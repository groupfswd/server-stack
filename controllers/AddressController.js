const addressService = require('../services/AddressService');

const findAll = async (req, res, next) => {
    try {
        const data = await addressService.findAll(req.loggedUser.id)

        res.status(200).json({ message: 'Get All Adresseses Users Logged Success', data })
    } catch (err) {
        next(err)
    }
}

const findOne = async (req, res, next) => {
    try {
        const params = {
            user_id: req.loggedUser.id,
            id: req.params.id
        }
        const data = await addressService.findOne(params)

        res.status(200).json({ message: 'Get Address By Id Success', data})
    } catch (error) {
        next(error)
    }
}

const create = async (req, res, next) => {
    try {
        const params = {
            user_id: req.loggedUser.id,
            params: req.body
        }
        const data = await addressService.create(params);

        res.status(201).json({ message: 'Successfully create address', data})
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const data = { 
            id: req.params.id,
            data: req.body
        }
        const address = await addressService.update(data)
        
        res.status(201).json({ message: 'Updated Success', address})
    } catch (error) {
        next(error)
    }
}

const destroy = async (req, res, next) => {
    try {
        const data = await addressService.destroy(req.params.id)

        res.status(200).json({ message: 'Successfully Deleted Address', data})
    } catch (error) {
        next(error)
    }
}


module.exports = {
    findAll,
    findOne,
    create,
    update,
    destroy
}
