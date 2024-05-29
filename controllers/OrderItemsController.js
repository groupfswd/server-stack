const orderItemsService = require("../services/OrderItemsService");

const updateItems = async (req, res, next) => {
  try {
    const body = req.body;
    console.log(body, "body");
    const data = await orderItemsService.updateItems(body);
    res.status(200).json({ message: "Update Success", data: data });
  } catch (err) {
    next(err);
  }
};
module.exports = { updateItems };
