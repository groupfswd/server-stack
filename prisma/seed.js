const prisma = require("../lib/prisma");
const axios = require("axios");
const path = require("path");
const slugify = require("slugify");
const { hashPassword } = require("../lib/bcrypt.js");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const main = async () => {
  try {
    // Seeding City
    const { data } = await axios.get(
      "https://api.rajaongkir.com/starter/city",
      {
        headers: {
          key: process.env.RAJAONGKIR_API_KEY,
        },
      }
    );

    const cities = data.rajaongkir.results.map((item) => {
      return {
        id: +item.city_id,
        name: item.city_name,
      };
    });

    await prisma.cities.createMany({
      data: cities,
    });

    // Seeding User
    const users = [
      {
        fullname: "developer",
        email: "developer@mail.com",
        password: hashPassword("postgres"),
        phone_number: "+62812091820938934",
        role: "USER",
      },
      {
        fullname: "admin",
        email: "admin@mail.com",
        password: hashPassword("postgres"),
        phone_number: "+62812091823434594",
        role: "ADMIN",
      },
    ];

    await prisma.users.createMany({
      data: users,
    });

    // Seeding Categories
    const categories = [
      {
        name: "Food",
      },
      {
        name: "Clothing",
      },
      {
        name: "Medicine",
      },
    ];

    await prisma.categories.createMany({
      data: categories,
    });

    // Seeding Stores
    const store = {
      city_id: 153,
      name: "Baby Store",
      bank_name: "BCA",
      bank_account: "091823089239834",
      street_address: "Jl Example",
      province: "Jakarta Selatan",
      postal_code: 123520,
    };

    await prisma.stores.create({
      data: store,
    });

    // Seeding Products
    const products = [
      {
        name: "Popok Bayi",
        slug: slugify("Popok Bayi"),
        sku: "BB-101",
        stock: 2000,
        price: 200000,
        weight: 2500,
        image: "",
        description: "",
        category_id: 2,
      },
    ];

    await prisma.products.createMany({ data: products });

    // Seeding Address
    const addresses = [
      {
        title: "Rumah",
        city_id: 153,
        street_address: "Jl Senopati",
        province: "Jakarta Selatan",
        postal_code: 14350,
        user_id: 1,
      },
      {
        title: "Kantor",
        city_id: 153,
        street_address: "Jl Fatmawati",
        province: "Jakarta Selatan",
        postal_code: 14298,
        user_id: 1,
      },
    ];

    await prisma.addresses.createMany({ data: addresses });

    // Seeding Cart
    const carts = {
      user_id: 1,
      store_id: 1,
      total_price: 200000,
      courier: "jne",
      total_weight: 2500,
      shipping_method: "REGULER",
      shipping_cost: 30000,
      cart_items: {
        create: {
          product_id: 1,
          quantity: 1,
          price: 200000,
        },
      },
    };

    await prisma.carts.create({ data: carts });

    // Seeding Wishlists
    const wishlists = {
      user_id: 1,
      product_id: 1,
    };

    await prisma.wishlists.create({ data: wishlists });

    // Seeding Orders
    const orders = {
      user_id: 1,
      store_id: 1,
      shipping_cost: 30000,
      shipping_method: "REGULER",
      courier: "jne",
      total_weight: 2500,
      total_price: 200000,
      order_items: {
        create: {
          product_id: 1,
          quantity: 1,
          price: 200000,
        },
      },
    };

    await prisma.orders.create({ data: orders });

    const reviews = {
      user_id: 1,
      product_id: 1,
      rating: 5,
      comments: "Mantabbbb",
    };

    await prisma.reviews.create({ data: reviews });
  } catch (err) {
    console.log(err);
  }
};

main();
