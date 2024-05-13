const prisma = require("../lib/prisma");

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
  const {
    shipping_cost,
    courier,
    shipping_method,
    store_id,
    cart_items_attributes,
  } = params.body;

  let totalWeight = 0;

  let totalPrice = 0;

  console.log (typeof params.loggedUser.id)

  const cart = await prisma.carts.update({
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
    console.log(currentProduct);
    const foundProduct = await prisma.products.findUnique({
      where: { id: currentProduct.product_id },
    });
    if (!foundProduct) {
      throw { name: "ErrorNotFound" };
    }

    if (foundProduct.stock < currentProduct.quantity) {
      throw { name: "StockInsufficient" };
    }

    if (foundProduct.price !== +currentProduct.price){
      throw { name: "InvalidPrice"}
    }

    const currentWeight = foundProduct.weight * currentProduct.quantity;

    totalWeight += currentWeight;

    const currentPrice = foundProduct.price * currentProduct.quantity;

    totalPrice += currentPrice;

    await prisma.cart_items.upsert({
      where: {
        cart_id: cart.id,
        product_id: foundProduct.id
      },
      update: {
        quantity: +currentProduct.quantity,
        price: +currentProduct.price
      },
      create: {
        quantity: +currentProduct.quantity,
        price: +currentProduct.price
      }
    })
  }

  // const product = await prisma.products.findUnique({
  //   where: { id: params.body.product },
  // });

  // if (product.stock < params.body.quantity) {
  //   throw new Error("Stock Insufficient");
  // }

  // const totalWeight = product.weight * params.body.quantity;

  // const totalPrice = product.price * params.body.quantity;

  // const cartCourier = await prisma.carts.findUnique({
  //   where: {
  //     user_id: params.loggedUser.id,
  //     courier: true,
  //   },
  // });

  // if (!cartCourier) {
  //   throw new Error("Error Not Found");
  // }

  // const user = await prisma.users.findUnique({
  //   where: {
  //     user_id: params.loggedUser.id,
  //   },
  //   include: {
  //     addresses: true,
  //   },
  // });

  // if (!user) {
  //   throw new Error("Error Not Found");
  // }

  // const cart = await prisma.carts.update({
  //   where: {
  //     id: params.loggedUser.id,
  //   },
  //   data: {
  //     cart_items: {
  //       update: {
  //         product: params.body.product,
  //         quantity: params.body.quantity,
  //       },
  //     },
  // //     total_weight: totalWeight,
  //     total_price: totalPrice,
  //   },
  //   include: {
  //     cart_items: {
  //       select: {
  //         product: true,
  //         quantity: true,
  //       },
  //     },
  //   },
  // });
  return cart;
};

module.exports = {
  findOne,
  update,
};
