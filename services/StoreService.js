const prisma = require("../lib/prisma");

const findAll = async (params) => {
  const data = await prisma.stores.findMany();
  return data;
};

const findOne = async (params) => {
  const { id } = params;
  const data = await prisma.stores.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!data) {
    throw {
      name: "ErrorNotFound",
      message: "data not found",
    };
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
      postal_code: +params.postal_code,
    },
  });
  return data;
};

const update = async ({ id, data }) => {
  const findOne = await prisma.stores.findUnique({
    where: {
      id,
    },
  });
  if (!findOne) {
    throw { name: "ErrorNotFound" };
  }
  const result = await prisma.stores.update({
    where: {
      id,
    },
    data: {
      city_id: data.city_id,
      name: data.name,
      bank_name: data.bank_name,
      street_address: data.street_address,
      province: data.province,
      postal_code: +data.postal_code,
    },
  });
  return result;
};

const destroy = async (id) => {
  const result = await prisma.stores.findUnique({
    where: { id: +id },
  });
  if (!result) {
    throw { name: "ErrorNotFound" };
  }
  const data = await prisma.stores.delete({
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
