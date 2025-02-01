const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const TickerList = new Schema(
  {
    ticker: { type: String, required: true },
    companyName: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("tickerLists", TickerList);
