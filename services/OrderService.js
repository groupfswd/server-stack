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

const findOne = async (params) => {
  try {
    const data = await prisma.orders.findFirst({
      where: {
        id: +params.id,
      },
    });
    if (data.user_id !== params.user_id) {
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

const create = async (params) => {};

const update = async (params) => {};

module.exports = {
  findAll,
  findOne,
  create,
  update,
};
