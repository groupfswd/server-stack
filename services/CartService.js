const prisma = require("../lib/prisma");

const findOne = async (params) => {
  const cart = await prisma.carts.findUnique({
    where: {
      id: params.loggedUser.id,
    },
    include: {
      cart_items: {
        select: {
          product: true,
          quantity: true,
        },
      },
    },
  });
  return cart;
};

const update = async (params) => {
  const product = await prisma.products.findUnique({
    where: { id: params.body.product },
  });

  const totalWeight = product.weight * params.body.quantity;

  const totalPrice = product.price * params.body.quantity;

  const cart = await prisma.carts.update({
    where: {
      id: params.loggedUser.id,
    },
    data: {
      cart_items: {
        update: {
          product: params.body.product,
          quantity: params.body.quantity,
        },
      },
      total_weight: totalWeight,
      total_price: totalPrice,
    },
    include: {
      cart_items: {
        select: {
          product: true,
          quantity: true,
        },
      },
    },
  });
  return cart;
};

module.exports = {
  findOne,
  update,
};
