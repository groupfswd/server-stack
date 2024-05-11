const router = require('express').Router();
const wishlistController = require("../controllers/WishlistController")

router.get("/", wishlistController.findAll)
router.get("/:id", wishlistController.findOne)
router.post("/:id", wishlistController.create)
router.delete("/:id", wishlistController.destroy)

module.exports = router