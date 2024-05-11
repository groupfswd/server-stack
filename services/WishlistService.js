const prisma = require("../lib/prisma");

const findAll = async (params) => {
    const wishlists = await prisma.wishlists.findMany({
        where: { user_id: params.id },
        include: {
            product: true
        }
    })

    return wishlists;
}

const findOne = async (params) => {
    const wishlist = await prisma.wishlists.findUnique({
        where: { id: +params },
        include: {
            product: true
        }
    })

    if (!wishlist) {
        throw { name: 'ErrorNotFound' }
    }

    return wishlist;
}

const create = async (params) => {
    const wishlist = await prisma.wishlists.create({
        data: {
            user_id: params.user.id,
            product_id: +params.product
        }
    })

    return wishlist;
}

const destroy = async (params) => {
    const result = await prisma.wishlists.findUnique({
        where: { id: +params }
    })

    if (!result) {
        throw { name: 'ErrorNotFound' }
    }

    const wishlist = await prisma.wishlists.delete({
        where: { id: result.id }
    })

    return wishlist;
}

module.exports = {
    findAll,
    findOne,
    create,
    destroy
}
