const orderService = require("../services/OrderService");

const findAll = async (req, res, next) => {
  try {
    const id = req.loggedUser.id;
    const data = await orderService.findAll(parseInt(id));
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const findOne = async (req, res, next) => {};

const create = async (req, res, next) => {};

const update = async (req, res, next) => {};

module.exports = {
  findAll,
  findOne,
  create,
  update,
};
