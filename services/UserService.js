const prisma = require("../lib/prisma");
const { hashPassword } = require('../lib/bcrypt')

const findAll = async () => {
    const users = await prisma.users.findMany()

    return users;
}

const findOne = async (params) => {
    const user = await prisma.users.findUnique({
        where: { id: params }
    })

    return user;
}

const update = async (params, body) => {
    if (body.password) {
        const hashedPassword = await hashPassword(body.password)
        body = { ...body, password: hashedPassword };
    }

    const user = await prisma.users.update({
        where: { id: params },
        data: body
    })

    return user;
}

module.exports = {
    findAll,
    findOne,
    update
}
