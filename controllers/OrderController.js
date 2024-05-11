const orderService = require("../services/OrderService");

const findAll = async (req, res, next) => {
  try {
    const id = req.loggedUser.id;
    const data = await orderService.findAll({
      where: {
        user_id: +id,
      },
    });
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

const create = async (req, res, next) => {
  try {
    const user = req.loggedUser;
    const order = req.body;
    const data = await orderService.create({ user, order });
    res.status(201).json({ message: "Success", data: data });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const filePath = req.body;
    const data = await orderService.update({
      where: {
        id: +id,
      },
      data: {
        payment_receipt: filePath.path,
        paid_at: new Date().toISOString(),
        status: "waiting_approval",
      },
    });
    res.status(200).json({ message: "Update Success", data: data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  findAll,
  findOne,
  create,
  update,
};
