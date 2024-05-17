const router = require("express").Router();
const orderController = require("../controllers/OrderController");
const multer = require("../lib/multer");

router.get("/", orderController.findAll);
router.get("/:id", orderController.findOne);
router.post("/", orderController.create);
router.put("/:id", orderController.update);
router.post("/:id", multer, orderController.pay);

module.exports = router;
