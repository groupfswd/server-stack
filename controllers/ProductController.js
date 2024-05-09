const productService = require('../services/ProductService');

const findAll = async (req, res, next) => {
    try {
        const data = await productService.findAll(req.query);

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