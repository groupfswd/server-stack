const orderService = require("../../services/OrderService");

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

// apakah admin bisa membuat order?
const create = async (req, res, next) => {};

const update = async (req, res, next) => {
  // isinya update status order
};

module.exports = {
  findAll,
  findOne,
  create,
  update,
};
