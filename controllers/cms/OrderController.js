const { query } = require("express");
const orderService = require("../../services/OrderService");
const MAX_ITEM_COUNT = 100;

const findAll = async (req, res, next) => {
  try {
    const query = {
      skip: +req.query.skip,
      page: +req.query.page,
      take: MAX_ITEM_COUNT,
    };
    const body = req.body;
    const action = {
      where: {
        ...body.filter,
      },
      orderBy: body.sort,
    };
    const data = await orderService.findAll({ query, action });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const findOne = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await orderService.findOne(id);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const status = req.body;
    const data = await orderService.update({
      where: {
        id: +id,
      },
      data: status,
    });
    res.status(200).json({ message: "Update Success", data: data });
  } catch (err) {}
};

module.exports = {
  findAll,
  findOne,
  update,
};
