const prisma = require("../lib/prisma");

const create = async (params) => {
  return prisma.$transaction(async (tx) => {
    const cart = await tx.carts.findUnique({
      where: {
        user_id: params.user_id,
      },
    });
    const data = await tx.cart_items.create({
      data: {
        cart_id: cart.cart_id,
        price: params.body.price,
        quantity: 1,
        product_id: params.body.product_id,
      },
    });

    return data;
  });
};

const destroy = async (params) => {
  const data = await prisma.cart_items.delete({
    where: {
      id: +params.id,
    },
  });
  return data;
};

module.exports = {
  create,
  destroy,
};
