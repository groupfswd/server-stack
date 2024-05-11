const prisma = require("../lib/prisma");

const findAll = async (params) => {
  const data = await prisma.stores.findMany();
  return data;
};

const findOne = async (params) => {
  try {
    const { id } = params;
    const data = await prisma.stores.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    return data;
  } catch (error) {
    console.error("Error in findOne:", error);
    throw error;
  }
};

const create = async (params) => {
  const data = await prisma.stores.create({
    data: {
      city_id: params.city_id,
      name: params.name,
      bank_name: params.bank_name,
      street_address: params.street_address,
      province: params.province,
      postal_code: params.postal_code,
    },
  });
  return data;
};

const update = async (id, params) => {
  await findOne(id);
  const data = await prisma.stores.update({
    where: {
      id: params.id,
    },
    data: {
      city_id: params.city_id,
      name: params.name,
      bank_name: params.bank_name,
      street_address: params.street_address,
      province: params.province,
      postal_code: params.postal_code,
    },
  });
  return data;
};

const destroy = async (params) => {
  const result = await prisma.stores.findUnique({
    where: { id: +params },
  });

  const data = await prisma.stores.destroy({
    where: {
      id: result.id,
    },
  });

  return data;
};

module.exports = {
  findAll,
  findOne,
  create,
  update,
  destroy,
};
