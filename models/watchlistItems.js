const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const WatchlistItem = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
    ticker: { type: String, required: true },
    companyName: {type: String, required: true}
  },
  { timestamps: true }
);

module.exports = mongoose.model("watchlistItems", WatchlistItem);
