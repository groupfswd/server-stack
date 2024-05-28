const paginate = require("../lib/pagination");
const prisma = require("../lib/prisma");
const slugify = require('slugify')

const findAll = async (params) => {
    let {
        category_id,
        search,
        price,
        min_price,
        max_price,
        weight,
        page,
        limit
    } = params;

    let filterOptions = {
        where: {}
    }

    let categoriesIdFilter = {};
    let searchFilter = {};
    let statusFilter = {};
    let priceFilter = {};
    let minPriceFilter = {};
    let rangePrice = {};
    let maxPriceFilter = {};
    let weightFilter = {};

    if (category_id)
        categoriesIdFilter = {
            category_id: +category_id
        }

    if (search)
        searchFilter = {
            OR: [{
                    name: {
                        equals: `%${search}%`,
                        mode: 'insensitive'
                    }
                },
                {
                    sku: `${search}`
                },
                {
                    slug: `${search}`
                }
            ]
        }

    statusFilter = {
        status: 'active'
    }

    if (price)
        priceFilter = {
            price: +price
        }

    if (min_price && max_price)
        rangePrice = {
            price: {
                gte: +min_price,
                lte: +max_price
            }
        }

    if (min_price && !max_price)
        minPriceFilter = {
            price: {
                gte: +min_price
            }
        }

    if (max_price && !min_price)
        maxPriceFilter = {
            price: {
                lte: +max_price
            }
        }

    if (weight)
        weightFilter = {
            weight: +weight
        }

    filterOptions.where = {
        ...categoriesIdFilter,
        ...searchFilter,
        ...statusFilter,
        ...priceFilter,
        ...minPriceFilter,
        ...maxPriceFilter,
        ...rangePrice,
        ...weightFilter
    }

    let skip = (page - 1) * limit;

    let take = limit;

    let [result, count] = await prisma.$transaction([
        prisma.products.findMany({
            ...filterOptions,
            include: {
                category: true,
            },
            skip: skip,
            take: take
        }),
        prisma.products.count({
            ...filterOptions
        })
    ])

    const data = paginate({
        result,
        count,
        limit,
        page
    })

    return data;
}

const findOne = async (params) => {
    const isNumeric = (string) => /^[+-]?\d+(\.\d+)?$/.test(string)
    const filterOption = {}
    if (isNumeric(params.id) === false) {
        filterOption.where = {
            slug: params.id
        }
    } else {
        filterOption.where = {
            id: +params.id
        }
    }

    if (params.status) {
        filterOption.where = {
            ...filterOption.where,
            status: "active"
        }
    }

    const product = await prisma.products.findUnique(filterOption);

    if (!product) {
        throw {
            name: "ErrorNotFound",
            message: "Data Product Not Found"
        }
    }

    return product;
}

const create = async (params) => {
    const category = await prisma.categories.findUnique({
        where: {
            id: +params.category_id
        }
    })
    if (!category) {
        throw {
            name: "ErrorNotFound",
            message: "Category Not Found"
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
    if (file) {
        const url = `${process.env.BASE_URL}/api/v1/images/${file.filename}`

        return url;
    } else {
        throw {
            name: "MissingFile"
        }
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

    const product = await prisma.products.update({
        where: {
            id: +params
        },
        data: {
            status: 'inactive'
        }
    })

    return product;
}


module.exports = {
    findAll,
    findOne,
    create,
    upload,
    update,
    destroy
}