const cartItemsService = require("../services/CartItemsService");

const create = async (req, res, next) => {
  try {
    const params = {
      body: req.body,
      user_id: 1,
    };
    const data = await cartItemsService.create(params);
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
    };
    const data = await cartItemsService.destroy(params);
    res.status(201).json({ message: "deleted ", data });
  } catch (err) {
    next(err);
  }
};

module.exports = { create, destroy };
