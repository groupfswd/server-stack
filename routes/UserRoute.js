const router = require('express').Router();
const userController = require("../controllers/UserController")

router.get("/", userController.findAll)
router.get("/:id", userController.findOne)
router.put("/", userController.update)

module.exports = router