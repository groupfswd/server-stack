const router = require('express').Router();
const productController = require("../controllers/ProductController")

router.get("/", productController.findAll)
router.get("/:param", productController.findOne)

module.exports = router