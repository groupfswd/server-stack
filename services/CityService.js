const prisma = require("../lib/prisma");

const findAll = async (params) => {
  try {
    const data = await prisma.cities.findMany();
    return data;
  } catch (err) {
    throw err;
  }
};

const findOne = async (params) => {
  try {
    const data = await prisma.cities.findUnique({
      where: {
        id: params,
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
};
