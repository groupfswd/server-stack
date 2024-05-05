const router = require('express').Router();
const cartController = require("../controllers/CartController")

router.get("/", cartController.findOne)
router.put("/", cartController.update)

module.exports = router