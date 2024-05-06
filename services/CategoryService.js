const prisma = require("../lib/prisma");

const findAll = async () => {
  const data = await prisma.categories.findMany();
  return data;
};

const findOne = async (params) => {
    const data = await prisma.categories.findUnique({
      where: {
        id: params,
      },
    });

    if (!data) throw new Error("Data Not Found");
    return data;
};

const create = async (params) => {
    const data = await prisma.categories.create({
      data: {
        name: params.name,
      },
    });
    return data;
};

const update = async (id, params) => {
  const { name } = params;
  await findOne(id);
    const data = await prisma.categories.update({
      where: {
        id: id,
      },
      data: {
        name: name,
      },
    });
    return data;
};

const destroy = async (params) => {};

module.exports = {
  findAll,
  findOne,
  create,
  update,
  destroy,
};
