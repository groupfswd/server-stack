const prisma = require("../lib/prisma");

const findAll = async (params) => {
  const data = await prisma.stores.findMany();
  return data;
};

const findOne = async (params) => {
  const data = await prisma.stores.findUnique({
    where: {
      id: params,
    },
  });
  if (!data) {
    throw Error;
  }
  return data;
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
  if (!data) {
    throw {
      message: "error data not found",
    };
  }
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
  const data = await prisma.stores.destroy({
    where: {
      id: params.id,
    },
  });
  if (!data) {
    throw Error;
  }
  return data;
};

module.exports = {
  findAll,
  findOne,
  create,
  update,
  destroy,
};
