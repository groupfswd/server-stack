const prisma = require("../lib/prisma");

const findOne = async (req) => {
  const cart = await prisma.carts.findUnique({
    where: {
      id: req.loggedUser.id,
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

const update = async (req) => {
  const cart = await prisma.carts.update({
    where: {
      id: req.loggedUser.id,
    },
    data: {
      cart_items: {
        update: {
          product: req.body.product,
          quantity: req.body.quantity,
        },
      },
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
