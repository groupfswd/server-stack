const router = require("express").Router();
const reviewController = require("../controllers/ReviewController");

router.get("/", reviewController.findAll);
router.get("/:id", reviewController.findOne);
router.post("/", reviewController.create);
router.put("/:id", reviewController.update);
router.delete("/:id", reviewController.destroy);

module.exports = router;
