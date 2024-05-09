const orderService = require("../services/OrderService");

const findAll = async (req, res, next) => {
  try {
    const user = req.loggedUser;
    const data = await orderService.findAll(user);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const findOne = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = req.loggedUser;
    const data = await orderService.findOne({ id, user });
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const user_id = req.loggedUser.id;
    const cartData = await orderService.getDataFromCart(user_id);
    const data = await orderService.create(cartData);
    res.status(201).json({ message: "Success", data: data });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {};

module.exports = {
  findAll,
  findOne,
  create,
  update,
};
