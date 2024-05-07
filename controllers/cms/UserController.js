const userService = require('../../services/UserService');

const findAll = async (req, res, next) => {
    try {
        const data = await userService.findAll()

        res.status(200).json({ message: 'Get All Users Successful', data })
    } catch (err) {
        next(err)
    }
}

const findOne = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        
        const data = await userService.findOne(id)

        res.status(200).json({ message: 'Get User By Id Successful', data })
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        let body = req.body

        await userService.update(id, body)

        res.status(200).json({ message: 'Update User Successful' })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    findAll,
    findOne,
    update
}
