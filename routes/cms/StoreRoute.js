const router = require('express').Router();
const storeController = require("../../controllers/cms/StoreController")

router.get("/", storeController.findAll)
router.get("/:id", storeController.findOne)
router.post("/", storeController.create)
router.put("/:id", storeController.update)
router.delete("/:id", storeController.destroy)

module.exports = router