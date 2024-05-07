const cartService = require("../services/CartService");

const findOne = async (req, res, next) => {
  try {
    const cart = await cartService.findOne({ id: req.params.id });
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const cart = await cartService.update({
      id: req.params.id,
      quantity: req.body.quantity,
    });
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  findOne,
  update,
};
