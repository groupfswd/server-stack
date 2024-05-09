const router = require('express').Router();
const productController = require("../controllers/ProductController")

router.get("/", productController.findAll)
router.get("/:slug", productController.findOne)

module.exports = router