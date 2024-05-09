const productService = require('../services/ProductService');
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 15

const findAll = async (req, res, next) => {
    try {
        const params = {
            ...req.query,
            page: +req.query.page || DEFAULT_PAGE,
            limit: +req.query.limit || DEFAULT_LIMIT
        }
        const data = await productService.findAll(params);

        res.status(200).json({ message: 'Get All Data Product', data});
    } catch (error) {
        next(error)
    }
}

const findOne = async (req, res, next) => {
    try {
        const data = await productService.findOneSlug(req.params.slug)

        res.status(200).json({ message: 'Get Product By Slug', data})
    } catch (error) {
        next(error)
    }
}


module.exports = {
    findAll,
    findOne
}