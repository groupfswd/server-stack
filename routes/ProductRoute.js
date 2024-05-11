const router = require('express').Router();
const productController = require("../controllers/ProductController")

router.get("/", productController.findAll)
router.get("/:id", productController.findOne)

module.exports = router