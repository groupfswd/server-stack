const router = require("express").Router();
const orderItemsController = require("../controllers/OrderItemsController");

router.put("/update", orderItemsController.updateItems);

module.exports = router;
