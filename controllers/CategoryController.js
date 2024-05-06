const categoryService = require("../services/CategoryService");

const findAll = async (req, res, next) => {
  try {
    const data = await categoryService.findAll();
    res.status(200).json({ message: "Success", data: data });
  } catch (err) {
    next(err)
  }
};

const findOne = async (req, res, next) => {};

module.exports = {
  findAll,
  findOne,
};
