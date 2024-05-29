const orderService = require("../services/OrderService");
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 15;

const findAll = async (req, res, next) => {
  try {
    const id = req.loggedUser.id;
    const query = {
      page: +req.query.page || DEFAULT_PAGE,
      limit: +req.query.limit || DEFAULT_LIMIT,
      query: req.query,
      user_id: id,
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
      user_id: req.loggedUser.id,
    };
    const data = await orderService.findOne(params);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};
``;
const create = async (req, res, next) => {
  try {
    const user = req.loggedUser;
    const payload = req.body;
    const data = await orderService.create({ user, payload });
    res.status(201).json({ message: "Success", data: data });
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

const upload = async (req, res, next) => {
  try {
    const url = await orderService.upload(req.file);
    res.status(201).json({ message: "Successfully Upload Photo", image: url });
  } catch (err) {
    next(err);
  }
};

const updateItems = async (req, res, next) => {
  try {
    const body = req.body;
    console.log(body, "body");
    const data = await orderService.updateOrderItems(body);
    res.status(200).json({ message: "Update Success", data: data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  findAll,
  findOne,
  create,
  update,
  upload,
  updateItems,
};
