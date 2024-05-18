const wishlistService = require('../services/WishlistService');

const findAll = async (req, res, next) => {
    try {
        const data = await wishlistService.findAll(req.loggedUser)

        res.status(200).json({ message: 'Get All Wishlists Successful', data })
    } catch (err) {
        next(err)
    }
}

const findOne = async (req, res, next) => {
    try {
        const data = await wishlistService.findOne(req.params.id)

        res.status(200).json({ message: 'Get Wishlist By Id Successful', data })
    } catch (err) {
        next(err)
    }
}

const create = async (req, res, next) => {
    try {
        const params = {
            user: req.loggedUser,
            product: req.params.id,
        }

        const data = await wishlistService.create(params)

        res.status(201).json({ message: 'Wishlist Created Successful', data })
    } catch (err) {
        next(err)
    }
}

const destroy = async (req, res, next) => {
    try {
        await wishlistService.destroy(req.params.id)

        res.status(200).json({ message: 'Wishlist Deleted Successful' })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    findAll,
    findOne,
    create,
    destroy
}
