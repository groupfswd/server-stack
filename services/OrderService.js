const prisma = require("../lib/prisma");

const findAll = async (params) => {
  try {
    const data = await prisma.orders.findMany({
      where: {
        user_id: params,
      },
    });
    return data;
  } catch (err) {
    throw err;
  }
};

const findOne = async (params) => {};

const create = async (params) => {};

const update = async (params) => {};

module.exports = {
  findAll,
  findOne,
  create,
  update,
};
