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

const citiesData = async () => {
  const data = await fetchCities();
  const trimmedData = data.map((item) => {
    return {
      name: item.city_name,
    };
  });
  return trimmedData;
};

module.exports = citiesData;
