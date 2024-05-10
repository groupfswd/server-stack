const orderService = require("../../services/OrderService");

const findAll = async (req, res, next) => {
  try {
    const data = await orderService.findAll();
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
  // isinya update status order
};

module.exports = {
  findAll,
  findOne,
  update,
};
