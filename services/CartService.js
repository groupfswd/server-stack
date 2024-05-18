const prisma = require("../lib/prisma");
const axios = require("axios");

const findOne = async (params) => {
  const cart = await prisma.carts.findUnique({
    where: {
      user_id: params.loggedUser.id,
    },
    include: {
      cart_items: true,
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
        throw { name: "ErrorNotFound" };
      }

      if (foundProduct.stock < currentProduct.quantity) {
        throw { name: "StockInsufficient" };
      }

      if (foundProduct.price !== +currentProduct.price) {
        throw { name: "InvalidPrice" };
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
    throw { name: ErrorNotFound, message: "Courier not found" };
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

module.exports = {
  findOne,
  update,
  getShippingCost,
};
