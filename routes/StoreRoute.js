const router = require('express').Router();
const storesController = require("../controllers/StoreController")

router.get("/", storesController.findAll)
router.get("/:id", storesController.findOne)

module.exports = router