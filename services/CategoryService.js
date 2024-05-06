const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const findAll = async () => {
  const data = await prisma.categories.findMany();
  return data;
};

const findOne = async (params) => {
  try {
    const data = await prisma.categories.findUnique({
      where: {
        id: params,
      },
    });

    if (!data) throw new Error("Data Not Found");
    return data;
  } catch (err) {
    throw Error(err);
  }
};

const create = async (params) => {
  try {
    const data = await prisma.categories.create({
      data: {
        name: params.name,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

const update = async (id, params) => {
  const { name } = params;
  await findOne(id);
  console.log(id, name);
  try {
    const data = await prisma.categories.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });
    return data;
  } catch (err) {
    throw Error(err);
  }
};

const destroy = (params) => {};

module.exports = {
  findAll,
  findOne,
  create,
  update,
  destroy,
};
