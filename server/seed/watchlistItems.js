const db = require("../db");
const WatchlistItems = require("../models/watchlistItems");

// Connect to the database
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const main = async () => {
  const watchlistItems = [
    { user_id: "6714474c67de30b19c2222ca", ticker: "TSLA" },
    { user_id: "6714474c67de30b19c2222ca", ticker: "AAPL" },
    { user_id: "6714474c67de30b19c2222ca", ticker: "NVDA" },
    { user_id: "6714474c67de30b19c2222ca", ticker: "META" },
    { user_id: "6714474c67de30b19c2222ca", ticker: "MSFT" },
  ];

  await WatchlistItems.insertMany(watchlistItems);
  console.log("Created some watchlist items!");
};
const run = async () => {
  await main();
  db.close();
};

run();
