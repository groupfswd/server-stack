const prisma = require("../lib/prisma");

const findOne = async (params) => {
  const cart = await prisma.carts.findUnique({
    where: {
      id: params.id,
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
  const cart = await prisma.carts.update({
    where: {
      id: params.id,
    },
    data: {
      quantity: params.quantity,
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
