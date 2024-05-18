const userService = require('../services/UserService');

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
        const data = await userService.findOne(req.loggedUser)

        res.status(200).json({ message: 'Get User By Id Successful', data })
    } catch (err) {
        next(err)
    }
}

const update = async (req, res, next) => {
    try {
        const params = {
            user: req.loggedUser,
            data: req.body
        }

        await userService.update(params)

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
