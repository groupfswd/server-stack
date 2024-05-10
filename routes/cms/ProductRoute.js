const router = require('express').Router();
const productController = require("../../controllers/cms/ProductController")
const multer = require('../../lib/multer')

router.get("/", productController.findAll)
router.get("/:param", productController.findOne)
router.post("/", productController.create)
router.post("/upload", multer,productController.upload)
router.put("/:id", productController.update)
router.delete("/:id", productController.destroy)

module.exports = router