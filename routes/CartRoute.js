const router = require('express').Router();
const cartController = require("../controllers/CartController")

router.get("/", cartController.findOne)
router.get("/shipping_costs", cartController.getShippingCost)
router.put("/", cartController.update)

module.exports = router