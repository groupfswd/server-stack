const router = require("express").Router();
const orderController = require("../../controllers/cms/OrderController");

router.get("/", orderController.findAll);
router.get("/:id", orderController.findOne);
router.put("/:id", orderController.update);

module.exports = router;
