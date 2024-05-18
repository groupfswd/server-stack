const prisma = require("../lib/prisma");

const findAll = async (params) => {
  const reviews = await prisma.reviews.findMany();
  return reviews;
};

const findOne = async (params) => {
  const { id } = params;
  const review = await prisma.reviews.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  return review;
};

const create = async (params) => {
  const { body } = params;
  const review = await prisma.reviews.create({
    data: {
      ...body,
    },
  });
  return review;
};

const update = async (params) => {
  const { id, body } = params;
  const review = await prisma.reviews.update({
    where: {
      id: parseInt(id),
    },
    data: {
      ...body,
    },
  });
  return review;
};

const destroy = async (params) => {
  const { id } = params;
  const review = await prisma.reviews.delete({
    where: {
      id: parseInt(id),
    },
  });
  return review;
};

module.exports = {
  findAll,
  findOne,
  create,
  update,
  destroy,
};
