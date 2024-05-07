const prisma = require("../lib/prisma");
const citiesData = require("./fetch-cities");

async function createCities() {
  try {
    const data = await citiesData();
    const tableData = await prisma.cities.findMany();

    if (tableData.length === 0) {
      await prisma.cities.createMany({
        data: data,
      });
      console.log("Cities Created");
    } else console.log("Cities already exist use update script");
  } catch (err) {
    throw err;
  }
}

createCities();
