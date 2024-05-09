const prisma = require("../lib/prisma");

const findAll = async (params) => {
  try {
    if (params.role === "ADMIN") {
      const data = await prisma.orders.findMany();
      return data;
    } else {
      const data = await prisma.orders.findMany({
        where: {
          user_id: +params.id,
        },
      });
      return data;
    }
  } catch (err) {
    throw err;
  }
};

const findOne = async (params) => {
  try {
    const data = await prisma.orders.findFirst({
      where: {
        id: +params.id,
      },
    });

    if (data?.user_id !== params.user.id && params.user.role !== "ADMIN") {
      throw {
        name: "Unauthorized",
        message: "You are not authorized to access this resource",
      };
    } else {
      return data;
    }
  } catch (err) {
    throw err;
  }
};

const create = async (params) => {
  try {
    const data = await prisma.orders.create({
      data: {
        user_id: params.user_id,
        store_id: params.store_id,
        shipping_cost: params.shipping_cost,
        shipping_method: params.shipping_method,
        total_weight: params.total_weight,
        total_price: params.total_price,
        courier: params.courier,
        invoice: "test file invoce",
      },
    });

    const orderItems = params.cart_items.map((item) => ({
      order_id: data.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    await prisma.order_Items.createMany({
      data: orderItems,
    });

    await prisma.carts.update({
      where: {
        id: params.id,
      },
      data: {
        total_price: null,
        courier: null,
        total_weight: null,
        shipping_cost: null,
        shipping_method: null,
      },
    });

    await prisma.cart_items.deleteMany({
      where: {
        cart_id: params.id,
      },
    });

    return data;
  } catch (err) {
    throw err;
  }
};

const update = async (params) => {
  // isinya upload bukti pembayaran ke column payment_receipt
};

const getDataFromCart = async (params) => {
  try {
    const data = await prisma.carts.findFirst({
      where: {
        user_id: +params,
      },
      include: {
        cart_items: {
          select: {
            quantity: true,
            product: {
              select: {
                id: true,
                price: true,
                weight: true,
              },
            },
          },
        },
      },
    });
    return data;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  findAll,
  findOne,
  create,
  update,
  getDataFromCart,
};
