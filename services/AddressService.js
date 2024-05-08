const prisma = require("../lib/prisma");

const findAll = async (params) => {
    const user_id = +params;
    const addresses = await prisma.addresses.findFirst({
        where: {
            user_id: user_id
        }
    })

    if(!addresses){
        throw {
            name: "ErrorNotFound",
            message: "Data Address User Not Found"
        }
    }

    return addresses;
}

const findOne = async (params) => {
    const id = +params
    const address = await prisma.addresses.findUnique({
        where: {
            id: id
        }
    })

    if(!address){
        throw {
            name: "ErrorNotFound",
            message: "Data Not Found"
        }
    }

    return address;
}

const create = async (params) => {
    const address = await prisma.addresses.create({
        data: {
            user_id: params.user_id,
            city_id: params.city_id,
            street_address: params.street_address,
            province: params.province,
            postal_code: params.postal_code
        }
    });

    if (!address) {
        throw {
            name: "ErrorNotFound",
            message: "Data Not Found"
        }
    }
    return address;
}

const update = async (params) => {
    const id = await prisma.addresses.findUnique({
        where: {
            id: +params.id
        }
    });

    if (!id) {
        throw {
            name: "ErrorNotFound",
            message: "Data Not Found"
        }
    }

    const address = await prisma.addresses.update({
        where: { id: +params.id },
        data: {
            user_id: params.data.user_id,
            city_id: params.data.city_id,
            street_address: params.data.street_address,
            province: params.data.province,
            postal_code: params.data.postal_code
        }
    });

    return address;
}

const destroy = async (params) => {
    const data = await prisma.addresses.findUnique({
        where: {
            id: +params
        }
    });

    if (!data) {
        throw {
            name: "ErrorNotFound",
            message: "Data Not Found"
        }
    }
    
    const address = await prisma.addresses.delete({
        where: {
            id: parseInt(params)
        }
    });

    return address;
}


module.exports = { findAll, findOne, create, update, destroy }