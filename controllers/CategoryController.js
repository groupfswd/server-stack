const categoryService = require('../services/CategoryService');

const findAll = (req, res, next) => {
    res.send("masuuk kategori")
}

const findOne = (req, res, next) => {}


module.exports = {
    findAll,
    findOne
}