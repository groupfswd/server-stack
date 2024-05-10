const prisma = require("../lib/prisma");
const path = require("path");

const findAll = async (params) => {
  const data = await prisma.orders.findMany(params);
  return data;

  // add pagination
};

const findOne = async (params) => {
  const data = await prisma.orders.findFirst({
    where: {
      id: +params,
    },
  });
  return data;
};

const create = async (params) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.orders.create({
      data: {
        user_id: params.user_id,
        store_id: params.order.store_id,
        shipping_cost: params.order.shipping_cost,
        shipping_method: params.order.shipping_method,
        total_weight: params.order.total_weight,
        total_price: params.order.total_price,
        paid_at: new Date().toISOString(),
        courier: params.order.courier,
        invoice: "test file invoce",
      },
    });

    const data = params.order.order_items.map((item) => {
      return {
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      };
    });
    const orderItem = await tx.order_Items.createMany({ data });

    // send invoice

    return { order, orderItem };
  });
};

const update = async (params) => {
  const data = await prisma.orders.update({
    where: {
      id: +params.id,
    },
    data: {
      payment_receipt: params.filePath.path,
      paid_at: new Date().toISOString(),
    },
  });
  return data;
};

module.exports = {
  findAll,
  findOne,
  create,
  update,
};
