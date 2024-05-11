const prisma = require("../lib/prisma");
const { sendInvoiceEmail } = require("../lib/nodemailer");
const { createPdf } = require("../lib/pdfkit");

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
        user_id: params.user.id,
        store_id: params.order.store_id,
        shipping_cost: params.order.shipping_cost,
        shipping_method: params.order.shipping_method,
        total_weight: params.order.total_weight,
        total_price: params.order.total_price,
        courier: params.order.courier,
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

    const pdfUrl = await createPdf(orderItem);

    await tx.orders.update({
      where: {
        id: order.id,
      },
      data: {
        invoice: pdfUrl,
      },
    });

    await sendInvoiceEmail(params.user.email, pdfUrl);

    return { order, orderItem, pdfUrl };
  });
};

const update = async (params) => {
  const data = await prisma.orders.update(params);
  return data;
};

module.exports = {
  findAll,
  findOne,
  create,
  update,
};
