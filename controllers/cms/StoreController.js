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
    console.log(req.params.id);
    const data = await storeService.findOne(req.params);
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
    const params = { id: +id, data };
    const updateData = await storeService.update(params);
    res.json(updateData);
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteData = await storeService.destroy(id);
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
