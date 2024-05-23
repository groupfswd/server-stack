const router = require('express').Router();
const cartController = require("../controllers/CartController")

router.get("/", cartController.findOne)
router.get("/shipping_costs", cartController.getShippingCost)
router.put("/", cartController.update)
router.delete("/", cartController. reset)
router.delete("/cart_items", cartController. deleteItem)

module.exports = router