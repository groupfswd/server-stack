const prisma = require("../lib/prisma");
const { sendInvoiceEmail } = require("../lib/nodemailer");
const { createPdf } = require("../lib/pdfkit");
const paginate = require("../lib/pagination.js");
const SORT_LIST = [
  "created_at desc",
  "created_at asc",
  "updated_at desc",
  "updated_at asc",
];
const QUERY_LIST = ["user_id", "id"];

const findAll = async (params) => {
  const { page, limit, query, user_id } = params;

  const { sort_by, filter_status, q } = query;
  let skip = (page - 1) * limit;
  let take = limit;
  let sortOption = {};

  if (sort_by) {
    if (SORT_LIST.includes(sort_by)) {
      const sorts = sort_by.split(" ");
      sortOption[sorts[0]] = sorts[1];
    } else {
      throw { name: "InvalidSort" };
    }
  } else {
    sortOption = {
      created_at: "desc",
    };
  }

  const filterOption = {
    skip,
    take,
    orderBy: [
      {
        ...sortOption,
      },
    ],
  };

  let filterUser = {};
  let filterStatus = {};
  let searchQuery = {};

  if (user_id) {
    filterUser = {
      user_id: user_id,
    };
  }

  if (filter_status) {
    filterStatus = {
      status: filter_status,
    };
  }

  if (user_id) {
    if (q) {
      throw { name: "Unauthorized" };
    }
  } else {
    if (q) {
      console.log(QUERY_LIST.includes(q.split(" ")[0]));
      const query = q.split(" ");
      searchQuery[query[0]] = +query[1];
    }
  }

  filterOption.where = {
    ...filterUser,
    ...filterStatus,
    ...searchQuery,
  };

  console.log(filterOption);

  let [result, count] = await prisma.$transaction([
    prisma.orders.findMany({
      ...filterOption,
      include: {
        order_items: {
          include: {
            product: true,
          },
        },
      },
    }),
    prisma.orders.count({
      where: filterOption.where,
    }),
  ]);
  console.log(count);

  const data = paginate({ result, count, limit, page });

  return data;
};

const findOne = async (params) => {
  const data = await prisma.orders.findFirst({
    where: params,
    include: {
      order_items: {
        include: {
          product: true,
        },
      },
    },
  });
  return data;
};

const create = async (params) => {
  const { user, payload } = params;
  const { store_id, shipping_cost, shipping_method, courier, order_items } =
    payload;

  return prisma.$transaction(async (tx) => {
    let order = await tx.orders.create({
      data: {
        user_id: user.id,
        store_id: +store_id,
        shipping_cost: +shipping_cost,
        shipping_method,
        courier,
      },
    });

    let totalCost = 0;
    let totalWeight = 0;

    for (let i = 0; i < order_items.length; i++) {
      const currentItem = order_items[i];
      const quantity = +currentItem.quantity;
      const price = +currentItem.price;

      const foundProduct = await prisma.products.findUnique({
        where: {
          id: +currentItem.product_id,
        },
      });

      if (!foundProduct)
        throw { name: "ErrorNotFound", message: "Product Not Found" };

      if (foundProduct.stock < quantity) throw { name: "InsufficientStock" };

      if (foundProduct.price !== price) throw { name: "InvalidPrice" };

      totalCost += price * quantity;

      totalWeight += foundProduct.weight * quantity;

      await tx.order_Items.create({
        data: {
          product_id: foundProduct.id,
          order_id: order.id,
          quantity,
          price,
        },
      });
    }

    order = await tx.orders.update({
      where: {
        id: order.id,
      },
      data: {
        total_price: totalCost,
        total_weight: totalWeight,
      },
      include: {
        user: true,
        order_items: {
          include: {
            product: true,
          },
        },
      },
    });

    const pdfUrl = await createPdf(order);
    order = await tx.orders.update({
      where: {
        id: order.id,
      },
      data: {
        invoice: pdfUrl,
      },
      include: {
        user: true,
        order_items: {
          include: {
            product: true,
          },
        },
      },
    });

    await sendInvoiceEmail(user.email, pdfUrl);
    return order;
  });
};

const update = async (params) => {
  const { id, status } = params;
  const allowedStatus = [
    "cancelled",
    "approved",
    "shipping",
    "delivered",
    "completed",
  ];

  if (!allowedStatus.includes(status)) {
    throw { name: "InvalidOrderAction", message: "Invalid Status" };
  }
  const foundOrder = await prisma.orders.findUnique({
    where: {
      id: +id,
    },
  });

  if (!foundOrder) throw { name: "ErrorNotFound", message: "Order Not Found" };

  checkStatus({ status, foundOrder });

  const order = await prisma.orders.update({
    where: {
      id: foundOrder.id,
    },
    data: {
      status,
    },
  });

  return order;
};

const checkStatus = ({ status, foundOrder }) => {
  if (status === "cancelled") {
    if (!["waiting_payment", "waiting_approval"].includes(foundOrder.status))
      throw { name: "InvalidOrderAction", message: "Cannot cancel order" };
  } else if (status === "approved") {
    if (!["waiting_approval"].includes(foundOrder.status))
      throw { name: "InvalidOrderAction", message: "Cannot approve order" };
  } else if (status === "shipping") {
    if (!["approved"].includes(foundOrder.status))
      throw { name: "InvalidOrderAction", message: "Cannot ship order" };
  } else if (status === "delivered") {
    if (!["shipping"].includes(foundOrder.status))
      throw { name: "InvalidOrderAction", message: "Cannot deliver order" };
  } else if (status === "completed") {
    if (!["delivered"].includes(foundOrder.status))
      throw { name: "InvalidOrderAction", message: "Cannot complete order" };
  }
};

const pay = async (params) => {
  const { id, file } = params;
  console.log(file, "<<<<<<<");

  const updatedOrder = await prisma.orders.update({
    where: {
      id: +id,
    },
    data: {
      payment_receipt: file.path,
      status: "waiting_approval",
    },
  });

  console.log(updatedOrder);

  //   })
  //    if (file) {
  //      const url = `${process.env.BASE_URL}/api/v1/images/${file.filename}`;

  //      return url;
  //    } else {
  //      throw {
  //        name: "MissingFile",
  //      };
  //    }
  // };
};

module.exports = {
  findAll,
  findOne,
  create,
  update,
  pay,
};
