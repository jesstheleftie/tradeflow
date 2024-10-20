const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const Transaction = new Schema(
  {
    ticker: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("transactions", Transaction);
