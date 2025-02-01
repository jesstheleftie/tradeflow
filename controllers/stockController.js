const { default: axios } = require("axios");

const APIKEY = process.env.STOCK_API;

const getStockData = async (req, res) => {
  const { ticker } = req.body;
  try {
    //Getting today's date in format YYYY-MM-YY
    const todayDate = new Date().toISOString().split("T")[0];
    //Getting one week ago date in format YYYY-MM-YY
    const oneWeekAgoDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];
    const stockData = await axios.get(
      `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/10/minute/${oneWeekAgoDate}/${todayDate}?adjusted=true&sort=asc&apiKey=${APIKEY}`
    );

    res.json(stockData.data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getStockNews = async (req, res) => {
  const { ticker } = req.body;
  try {
    const stockNews = await axios.get(
      `https://api.polygon.io/v2/reference/news?limit=30&apiKey=${APIKEY}`
    );

    console.log("stockNews", stockNews.data);
    res.json(stockNews.data);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  getStockData,
  getStockNews,
};
