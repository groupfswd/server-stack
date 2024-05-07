const prisma = require("../lib/prisma");

const findOne = async (params) => {
  const cart = await prisma.cart.findUnique({
    where: {
      id: params.id,
    },
  });
  return cart;
};

const update = async (params) => {
  const cart = await prisma.cart.update({
    where: {
      id: params.id,
    },
    data: {
      quantity: params.quantity,
    },
  });
  return cart;
};

module.exports = {
  findOne,
  update,
};
