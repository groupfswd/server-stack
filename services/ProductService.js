const prisma = require("../lib/prisma");
const slugify = require('slugify')

const findAll = async (params) => {
    let {
        category_id,
        slug,
        name,
        sku,
        price,
        weight
    } = params;

    let filterOptions = {
        where: {
            like: {}
        }
    }

    let categoriesIdFilter = {};
    let slugFilter = {};
    let nameFilter = {};
    let skuFilter = {};
    let priceFilter = {};
    let weightFilter = {};

    if (category_id)
        categoriesIdFilter = {
            category_id: +category_id
        }

    if (slug)
        slugFilter = {
            slug: `${slug}`
        }

    if (name)
        nameFilter = {
            name: `${name}`
        }

    if (sku)
        skuFilter = {
            sku: `${sku}`
        }

    if (price)
        priceFilter = {
            price: +price
        }

    if (weight)
        weightFilter = {
            weight: +weight
        }

    filterOptions.where = {
        ...categoriesIdFilter,
        ...slugFilter,
        ...nameFilter,
        ...skuFilter,
        ...priceFilter,
        ...weightFilter
    }

    const product = await prisma.products.findMany({
        ...filterOptions,
        include: {
            category: true,
        },
    });

    return product;
}

const findOneSlug = async (params) => {
    const product = await prisma.products.findUnique({
        where: {
            slug: params
        }
    });

    if(!product){
        throw {
            name: "ErrorNotFound",
            message: "Data Product Not Found"
        }
    }

    return product;
}

const findOne = async (params) => {
    const product = await prisma.products.findFirst({
        where: {
            id: +params
        }
    });

    if(!product){
        throw {
            name: "ErrorNotFound",
            message: "Data Product Not Found"
        }
    }

    return product;
}

const create = async (params) => {
    const data = await prisma.products.findFirst({
        where: {
            slug: slugify(params.name)
        }
    });

    if(data){
        if (data.slug === slugify(params.name)) {
            throw{
                name: "ProductRegistered",
                message: "Product Name Has Been Registered"
            }
        }
    }

    const product = await prisma.products.create({
        data: {
            category_id: +params.category_id,
            name: params.name,
            slug: slugify(params.name),
            sku: params.sku,
            stock: +params.stock,
            price: +params.price,
            weight: +params.weight,
            description: params.description,
            image: params.image
        }
    })

    return product;
}

const upload = async (file) => {
    try {
        if (file) {
            const url = `${process.env.BASE_URL}/api/v1/images/${file.filename}`

            return url;
        } else {
            throw {
                name: "MissingFile"
            }
        }
    } catch (err) {
        throw err;
    }
};

const update = async (params) => {
    const product = await prisma.products.update({
        where: {
            id: +params.id
        },
        data: {
            category_id: +params.data.category_id,
            name: params.data.name,
            slug: slugify(params.data.name),
            sku: params.data.sku,
            stock: +params.data.stock,
            price: +params.data.price,
            weight: +params.data.weight,
            description: params.data.description,
            image: params.data.image,
        }
    });

    return product;
}

const destroy = async (params) => {
    const data = await prisma.products.findUnique({
        where: {
            id: +params
        }
    })

    if (!data) {
        throw {
            name: "ErrorNotFound",
            message: "Data Not Found"
        }
    }

    const product = await prisma.products.delete({
        where: {
            id: +params
        }
    })

    return product;
}


module.exports = {
    findAll,
    findOneSlug,
    findOne,
    create,
    upload,
    update,
    destroy
}