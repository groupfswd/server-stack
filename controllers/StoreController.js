const storeService = require("../services/StoreService");

const findAll = async (req, res, next) => {
  try {
    const data = await storeService.findAll(req.query);
    res.status(200).json({ message: "success", data: data });
  } catch (err) {
    next(err);
  }
};

const findOne = async (req, res, next) => {
  try {
    const data = await storeService.findOne(req.params.id);
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  findAll,
  findOne,
};
