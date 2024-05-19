const prisma = require("../lib/prisma");

const findAll = async (params) => {
  const user_id = +params;
  const addresses = await prisma.addresses.findMany({
    where: {
      user_id: user_id,
    },
  });

  return addresses;
};

const findOne = async (params) => {
  const { id, user_id } = params;
  const address = await prisma.addresses.findUnique({
    where: {
      id: +id,
      user_id,
    },
  });

  if (!address) {
    throw {
      name: "ErrorNotFound",
      message: "Data Not Found",
    };
  }

  return address;
};

const create = async ({ user_id, params }) => {
  const city = await prisma.cities.findUnique({
    where: {
      id: +params.city_id,
    },
  });

  if (!city) {
    throw {
      name: "ErrorNotFound",
      message: "City Not Found",
    };
  }
  const address = await prisma.addresses.create({
    data: {
      user_id: user_id,
      city_id: params.city_id,
      street_address: params.street_address,
      province: params.province,
      postal_code: params.postal_code,
      title: params.title,
    },
  });

  return address;
};

const update = async (params) => {
  const id = await prisma.addresses.findUnique({
    where: {
      id: +params.id,
    },
  });

  if (!id) {
    throw {
      name: "ErrorNotFound",
      message: "Data Not Found",
    };
  }

  const address = await prisma.addresses.update({
    where: { id: +params.id },
    data: {
      city_id: params.data.city_id,
      street_address: params.data.street_address,
      province: params.data.province,
      postal_code: params.data.postal_code,
      title: params.data.title,
    },
  });

  return address;
};

const destroy = async (params) => {
  const data = await prisma.addresses.findUnique({
    where: {
      id: +params,
    },
  });

  if (!data) {
    throw {
      name: "ErrorNotFound",
      message: "Data Not Found",
    };
  }

  const address = await prisma.addresses.delete({
    where: {
      id: parseInt(params),
    },
  });

  return address;
};

module.exports = { findAll, findOne, create, update, destroy };
