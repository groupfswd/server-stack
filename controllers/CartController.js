const cartService = require("../services/CartService");

const findOne = async (req, res, next) => {
  try {
    const cart = await cartService.findOne({
      loggedUser: { id: req.loggedUser.id },
    });
    return res.json(cart);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const cart = await cartService.update({
      loggedUser: { id: req.loggedUser.id },
      body: req.body,
    });
    return res.json(cart);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  findOne,
  update,
};
