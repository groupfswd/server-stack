const router = require("express").Router();
const cartItemsController = require("../controllers/CartItemsController");

router.delete("/:id", cartItemsController.destroy);
router.post("/", cartItemsController.create);

module.exports = router;
