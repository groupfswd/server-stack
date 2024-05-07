const prisma = require("../lib/prisma");
const citiesData = require("./fetch-cities");

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

async function updateCities() {
  const newData = await citiesData();
  const oldData = await getCitiesTable();

  if (newData.length > oldData.length) {
    await newData.map(async (newItem) => {
      if (!oldData.find((oldItem) => oldItem.name === newItem.name)) {
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

updateCities();
