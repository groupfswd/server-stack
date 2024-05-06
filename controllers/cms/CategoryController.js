const categoryService = require("../../services/CategoryService");

const findAll = async (req, res, next) => {
  try {
    const data = await categoryService.findAll();
    res.status(200).json(data);
  } catch (err) {
    throw new Error(err);
  }
};

const findOne = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = await categoryService.findOne(parseInt(id));
    res.status(200).json(data);
  } catch (err) {
    throw new Error(err);
  }
};

const create = async (req, res, next) => {
  try {
    const categoryName = req.body.name;
    const data = await categoryService.create(categoryName);
    res.status(201).json(data);
  } catch (err) {
    throw new Error(err);
  }
};

const update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const categoryName = req.body;
    console.log(categoryName, id);
    const category = await categoryService.update(parseInt(id), categoryName);
    res.status(200).json({ message: "Update Success", data: category });
  } catch (err) {
    throw new Error(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await categoryService.destroy(id);
    res.status(200).json({ message: "Delete Success", data: category });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  findAll,
  findOne,
  create,
  update,
  destroy,
};
