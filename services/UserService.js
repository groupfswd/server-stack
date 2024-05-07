const prisma = require("../lib/prisma");
const { hashPassword } = require('../lib/bcrypt')

const findAll = async () => {
    const users = await prisma.users.findMany()

    return users;
}

const findOne = async (params) => {
    const user = await prisma.users.findUnique({
        where: { id: parseInt(params.id) }
    })

    return user;
}

const update = async (params) => {
    if (params.data.password) {
        const hashedPassword = await hashPassword(params.data.password)

        params.data = { ...params.data, password: hashedPassword };
    }

    const user = await prisma.users.update({
        where: { id: params.user.id },
        data: params.data
    })

    return user;
}

module.exports = {
    findAll,
    findOne,
    update
}
