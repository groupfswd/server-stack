const orderService = require("../../services/OrderService");
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 50;

const findAll = async (req, res, next) => {
  try {
    const query = {
      page: +req.query.page || DEFAULT_PAGE,
      limit: +req.query.limit || DEFAULT_LIMIT,
      query: req.query,
    };

    const data = await orderService.findAll(query);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const findOne = async (req, res, next) => {
  try {
    const params = {
      id: +req.params.id,
    };
    const data = await orderService.findOne(params);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const params = {
      id: req.params.id,
      body: req.body,
    };
    const data = await orderService.update(params);
    res.status(200).json({ message: "Update Success", data: data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  findAll,
  findOne,
  update,
};
