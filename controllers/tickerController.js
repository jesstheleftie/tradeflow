const Ticker = require("../models/tickerList");

const getAllTickers = async (req, res) => {
  try {
    const tickers = await Ticker.find();
    console.log("tickers", tickers);
    res.json(tickers);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

module.exports = {
  getAllTickers,
};
