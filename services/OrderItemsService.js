const prisma = require("../lib/prisma");
require("dotenv").config();

const updateItems = async (params) => {
  console.log(params, "params");
  const order = await prisma.order_Items.update({
    where: {
      id: params.id,
    },
    data: {
      is_reviewed: true,
    },
  });

  return order;
};

module.exports = { updateItems };
