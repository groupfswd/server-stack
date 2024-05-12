const productService = require('../services/ProductService');
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 15

const findAll = async (req, res, next) => {
    try {
        const params = {
            ...req.query,
            page: +req.query.page || DEFAULT_PAGE,
            limit: +req.query.limit || DEFAULT_LIMIT,
            status: 'active'
        }
        const data = await productService.findAll(params);

        res.status(200).json({ message: 'Get Data Products', result: data});
    } catch (error) {
        next(error)
    }
}

const findOne = async (req, res, next) => {
    try {
        const params = {
            id: req.params.id,
            status: "active",
        }
        const data = await productService.findOne(params)

        res.status(200).json({ message: 'Get Product By Id Or Slug', data})
    } catch (error) {
        next(error)
    }
}


module.exports = {
    findAll,
    findOne
}