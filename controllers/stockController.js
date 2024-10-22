const { default: axios } = require("axios");
const apiKey = "wQS_7upXK7ElEJm1SZb6iBSIHyW_xVEW";

const getStockData = async (req, res) => {
  console.log("123");
  const { ticker } = req.body;
  try {
    const stockData = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/10/minute/2024-10-16/2024-10-16?adjusted=true&sort=asc&apiKey=${apiKey}`
    );

    console.log("stockData", stockData.data);
    res.json(stockData.data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getStockNews = async (req, res) => {
  console.log("123");
  const { ticker } = req.body;
  try {
    const stockNews = await axios.get(
      `https://api.polygon.io/v2/reference/news?limit=10&apiKey=${apiKey}`
    );

    console.log("stockNews", stockNews.data);
    res.json(stockNews.data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};


module.exports = {
  getStockData,
  getStockNews
};
