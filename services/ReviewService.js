const prisma = require("../lib/prisma");

const findAll = async (params) => {
  const id = params;
  const reviews = await prisma.reviews.findMany({
    where: {
      product_id: id,
    },
  });
  return reviews;
};

const findOne = async (params) => {
  const { id } = params;
  const review = await prisma.reviews.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!review) {
    throw { name: "ErrorNotFound", message: "Review not found" };
  }

  return review;
};

const create = async (params) => {
  const { user_id, body } = params;
  const { rating, comments, product_id } = body;

  const foundProduct = await prisma.products.findUnique({
    where: {
      id: +product_id,
    },
  });

  if (!foundProduct) {
    throw { name: "ErrorNotFound", message: "Product not found" };
  }

  const review = await prisma.reviews.create({
    data: {
      user_id,
      rating,
      comments,
      product_id: foundProduct.id,
    },
    include: {
      product: true,
    },
  });
  return review;
};

const update = async (params) => {
  const { id, body } = params;
  const { rating, comments } = body;

  const foundReview = await prisma.reviews.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!foundReview) {
    throw { name: "ErrorNotFound", message: "Review not found" };
  }

  const review = await prisma.reviews.update({
    where: {
      id: parseInt(id),
    },
    data: {
      rating,
      comments,
    },
  });
  return review;
};

const destroy = async (params) => {
  const { id } = params;
  const foundReview = await prisma.reviews.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!foundReview) {
    throw { name: "ErrorNotFound", message: "Review not found" };
  }

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
