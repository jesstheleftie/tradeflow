const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const User = new Schema(
  {
    username: { type: String, required: true },
    pin: { type: String, required: true },
    transactions: [{ type: Schema.Types.ObjectId, ref: "Transaction" }],
    watchlistItems: [{ type: Schema.Types.ObjectId, ref: "Watchlist" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", User);
