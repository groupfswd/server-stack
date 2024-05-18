const categoryService = require("../../services/CategoryService");

const findAll = async (req, res, next) => {
  try {
    const data = await categoryService.findAll();
    res.status(200).json({
      message: "Get All Success",
      data: data
    });
  } catch (err) {
    next(err)
  }
};

const findOne = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await categoryService.findOne(parseInt(id));
    res.status(200).json({
      message: "Get By Id Success",
      data: data
    });
  } catch (err) {
    next(err)
  }
};

const create = async (req, res, next) => {
  try {
    const categoryName = req.body;
    const data = await categoryService.create(categoryName);
    res.status(201).json({
      message: "Create Success",
      data: data
    });
  } catch (err) {
    next(err)
  }
};

const update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const categoryName = req.body;
    const category = await categoryService.update(parseInt(id), categoryName);
    res.status(200).json({
      message: "Update Success",
      data: category
    });
  } catch (err) {
    next(err)
  }
};

const destroy = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await categoryService.destroy(id);
    res.status(200).json({
      message: "Delete Success",
      data: category
    });
  } catch (err) {
    next(err)
  }
};

module.exports = {
  findAll,
  findOne,
  create,
  update,
  destroy,
};
