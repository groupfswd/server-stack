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
  try {
    const id = req.params.id;
    const status = req.body;
    const data = await orderService.update({
      where: {
        id: +id,
      },
      data: {
        status: status,
      },
    });
    res.status(200).json({ message: "Update Success", data: data });
  } catch (err) {}
};

module.exports = {
  findAll,
  findOne,
  update,
};
