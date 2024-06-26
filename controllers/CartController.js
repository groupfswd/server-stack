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

const getShippingCost = async (req, res, next) => {
  try {
    const shipping_cost = await cartService.getShippingCost(req.query);
    return res.status(200).json(shipping_cost);
  } catch (err) {
    next(err);
  }
};

const reset = async (req, res, next) => {
  try {
    const cart = await cartService.resetCart({
      loggedUser: { id: req.loggedUser.id },
    });
    return res.json(cart);
  } catch (err) {
    next(err);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const cartItem = await cartService.deleteCartItem({
      productId: req.body.product_id,
      userId: req.loggedUser.id,
    });
    return res.json(cartItem);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  findOne,
  update,
  getShippingCost,
  reset,
  deleteItem,
};
