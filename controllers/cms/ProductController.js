const productService = require('../../services/ProductService');
const DEFAULT_PAGE = 1
const DEFAULT_LIMIT = 20

const findAll = async (req, res, next) => {
    try {
        const params = {
            ...req.query,
            page: +req.query.page || DEFAULT_PAGE,
            limit: +req.query.limit || DEFAULT_LIMIT
        }
        const data = await productService.findAll(params);

        res.status(200).json({ message: 'Get Data Products', result: data });
    } catch (error) {
        next(error)
    }
}

const findOne = async (req, res, next) => {
    try {
        const data = await productService.findOne(req.params)

        res.status(200).json({ message: 'Get Product By Id Or Slug', data })
    } catch (error) {
        next(error)
    }
}

const create = async (req, res, next) => {
    try {
        const data = await productService.create(req.body)
    
        res.status(201).json({ message: 'Successfully Create Product', data })
    } catch (error) {
        next(error)
    }
}

const upload = async (req, res, next) => {
    try {
        const url = await productService.upload(req.file)

        res.status(201).json({ message: "Successfully Upload Photo", image: url});
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const data = {
            id: req.params.id,
            data: req.body
        }
    
        const product = await productService.update(data);
    
        res.status(201).json({ message: 'Successfully Update Product', product})
    } catch (error) {
        next(error)
    }
}

const destroy = async (req, res, next) => {
    try {
        await productService.destroy(req.params.id)

        res.status(200).json({ message: 'Successfully Deleted Product'})
    } catch (error) {
        next(error)
    }
}


module.exports = {
    findAll,
    findOne,
    create,
    upload,
    update,
    destroy
}