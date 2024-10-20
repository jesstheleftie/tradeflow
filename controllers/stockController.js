const { default: axios } = require("axios");
const apiKey = "wQS_7upXK7ElEJm1SZb6iBSIHyW_xVEW";

const getStockData = async (req, res) => {
  console.log("123");

  try {
    const stockData = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/TSLA/range/10/minute/2024-10-09/2024-10-17?adjusted=true&sort=asc&apiKey=${apiKey}`
    );

    console.log("stockData", stockData.data);
    res.json(stockData.data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  getStockData,
};
