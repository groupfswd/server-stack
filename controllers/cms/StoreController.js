const storeService = require("../../services/StoreService");

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
    const data = await storeService.findOne(req.param.id);
    if (!data) {
      return res.status(404).json({ message: "data not found" });
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const data = req.body;
    const createdData = await storeService.create(data);
    res.status(201).json(createdData);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const updateData = await storeService.update(id, data, { new: true });
    if (!updateData) {
      return res.status(404).json({ message: "data not found" });
    }
    res.json(updateData);
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteData = await storeService.destroy(id);
    if (!deleteData) {
      return res.status(404).json({ message: "delete failure" });
    }
    res.json({ message: "data deleted succesfuly" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  findAll,
  findOne,
  create,
  update,
  destroy,
};
