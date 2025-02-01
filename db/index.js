const mongoose = require("mongoose");

const databaseUrl = process.env.DB_URL;
// console.log("databaseUrl", databaseUrl);
mongoose
  .connect(`${databaseUrl}`)
  .then(() => {
    console.log("Successfully connected to MongoDB.");
  })
  .catch((e) => {
    console.error("Connection error", e.message);
  });

const db = mongoose.connection;

module.exports = db;

// .connect(`mongodb://127.0.0.1:27017/stocksDatabase`)
