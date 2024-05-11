const storeService = require("../services/StoreService");

const findAll = async (req, res, next) => {
  try {
    const data = await storeService.findAll();
    res.status(200).json({ message: "success", data: data });
  } catch (err) {
    next(err);
  }
};

const findOne = async (req, res, next) => {
  try {
    const data = await storeService.findOne(req.params);
    res.status(200).json({ message: "success", data: data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  findAll,
  findOne,
};
