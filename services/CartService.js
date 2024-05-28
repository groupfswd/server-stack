const prisma = require("../lib/prisma");
const axios = require("axios");

const findOne = async (params) => {
  const cart = await prisma.carts.findUnique({
    where: {
      user_id: params.loggedUser.id,
    },
    include: {
      cart_items: {
        include: {
          product: true,
        },
      },

      store: {
        include: {
          city: true,
        },
      },
    },
  });
  return cart;
};

const update = async (params) => {
  return prisma.$transaction(async (tx) => {
    const {
      shipping_cost,
      courier,
      shipping_method,
      store_id,
      cart_items_attributes,
    } = params.body;

    let totalWeight = 0;

    let totalPrice = 0;

    let cart = await tx.carts.update({
      where: {
        user_id: params.loggedUser.id,
      },
      data: {
        shipping_cost,
        courier,
        shipping_method,
        store_id,
      },
    });

    for (let i = 0; i < cart_items_attributes.length; i++) {
      const currentProduct = cart_items_attributes[i];

      const foundProduct = await tx.products.findUnique({
        where: { id: currentProduct.product_id },
      });
      if (!foundProduct) {
        throw { name: "ErrorNotFound", message: "Product not found" };
      }

      if (foundProduct.stock < currentProduct.quantity) {
        throw { name: "InsufficientStock", message: "Insufficient Stock" };
      }

      if (foundProduct.price !== +currentProduct.price) {
        throw { name: "InvalidPrice", message: "Invalid Price" };
      }

      const currentWeight = foundProduct.weight * currentProduct.quantity;

      totalWeight += currentWeight;

      const currentPrice = foundProduct.price * currentProduct.quantity;

      totalPrice += currentPrice;

      const cartItem = await tx.cart_items.findFirst({
        where: {
          AND: [{ product_id: foundProduct.id }, { cart_id: cart.id }],
        },
      });

      if (cartItem) {
        //update
        await tx.cart_items.update({
          where: {
            id: cartItem.id,
          },
          data: {
            quantity: +currentProduct.quantity,
            price: +currentProduct.price,
          },
        });
      } else {
        //create
        await tx.cart_items.create({
          data: {
            quantity: +currentProduct.quantity,
            price: +currentProduct.price,
            cart: {
              connect: {
                id: cart.id,
              },
            },
            product: {
              connect: {
                id: foundProduct.id,
              },
            },
          },
        });
      }

      cart = await tx.carts.update({
        where: {
          id: cart.id,
        },
        data: {
          total_price: totalPrice,
          total_weight: totalWeight,
        },
        include: {
          cart_items: true,
        },
      });
    }
    return cart;
  });
};

const getShippingCost = async (params) => {
  const { weight, destination_id, origin_id, courier } = params;

  const destination = await prisma.cities.findUnique({
    where: {
      id: +destination_id,
    },
  });

  const origin = await prisma.cities.findUnique({
    where: {
      id: +origin_id,
    },
  });

  if (!["jne", "pos", "tiki"].includes(courier)) {
    throw { name: "ErrorNotFound", message: "Courier not found" };
  }

  const shipping_cost = await axios({
    url: "https://api.rajaongkir.com/starter/cost",
    method: "POST",
    data: {
      weight: +weight,
      destination: destination.id,
      origin: origin.id,
      courier,
    },
    headers: {
      key: process.env.RAJAONGKIR_API_KEY,
    },
  });

  const cost_lists = shipping_cost.data.rajaongkir.results[0].costs;

  return cost_lists;
};

const resetCart = async (params) => {
  await prisma.carts.update({
    where: {
      user_id: params.loggedUser.id,
    },
    data: {
      cart_items: {
        deleteMany: {},
      },
    },
  });

  return { message: "Cart has been reset" };
};

const deleteCartItem = async (params) => {
  const findUser = await prisma.users.findUnique({
    where: {
      id: params.userId,
    },
    include: {
      cart: true,
    },
  });

  const foundProduct = await prisma.products.findUnique({
    where: { id: params.productId },
  });
  if (!foundProduct) {
    throw { name: "ErrorNotFound", message: "Product not found" };
  }

  return prisma.cart_items.deleteMany({
    where: {
      product_id: params.productId,
      cart_id: findUser.cart.id,
    },
  });
};

module.exports = {
  findOne,
  update,
  getShippingCost,
  resetCart,
  deleteCartItem,
};
