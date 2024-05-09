const prisma = require("../lib/prisma");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

async function fetchCities() {
  try {
    const response = await fetch("https://api.rajaongkir.com/starter/city", {
      method: "GET",
      headers: {
        key: process.env.RAJAONGKIR_API_KEY,
      },
    });
    const city = await response.json();
    return city.rajaongkir.results;
  } catch (err) {
    throw err;
  }
}

async function citiesData() {
  try {
    const data = await fetchCities();
    const trimmedData = data.map((item) => {
      return {
        name: item.city_name,
      };
    });
    return trimmedData;
  } catch (err) {
    throw err;
  }
}

async function getCitiesTable() {
  try {
    const data = await prisma.cities.findMany();
    const trimmedData = data.map((item) => {
      return {
        name: item.name,
      };
    });
    return trimmedData;
  } catch (err) {
    throw err;
  }
}

async function createCities() {
  try {
    const data = await citiesData();
    const tableData = await getCitiesTable();

    if (tableData.length === 0) {
      await prisma.cities.createMany({
        data: data,
      });
      console.log("Cities Created");
    } else {
      console.log("Data in cities table already exist, will update the data ");

      if (data.length > tableData.length) {
        await data.map(async (newItem) => {
          if (!tableData.find((oldItem) => oldItem.name === newItem.name)) {
            await prisma.cities.create({
              data: {
                name: newItem.name,
              },
            });
          }
        });
        console.log("Cities Updated");
      } else {
        console.log("There are no new cities to update");
      }
    }
  } catch (err) {
    throw err;
  }
}

createCities();
