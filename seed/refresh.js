const db = require("../db");
const Users = require("../models/users");
const Transactions = require("../models/transactions");
const WatchlistItems = require("../models/watchlistItems");

const run = async () => {
  //Delete all first!
  let deletedUser = await Users.deleteMany();
  console.log("deleteUser", deletedUser);
  let deletedTransations = await Transactions.deleteMany();
  console.log("deletedTransations", deletedTransations);
  let deletedWatchlistItems = await WatchlistItems.deleteMany();
  console.log("deletedWatchlistItems", deletedWatchlistItems);

  //Create Users!
  const users = [
    { username: "demo", pin: "123" },
    { username: "alice", pin: "456" },
    { username: "bob", pin: "789" },
    { username: "charlie", pin: "101" },
    { username: "eve", pin: "202" },
    { username: "mallory", pin: "303" },
    { username: "trent", pin: "404" },
    { username: "peggy", pin: "505" },
  ];

  let createdUsers = await Users.insertMany(users);
  console.log("createdUsers", createdUsers);
  //Create Watchlist for Demo
  let demoUser = await Users.findOne({ username: "demo" });
  console.log("Found Demo User", demoUser);
  const watchlistItems = [
    { user_id: demoUser._id, ticker: "TSLA", companyName: "Tesla Inc." },
    { user_id: demoUser._id, ticker: "AAPL", companyName: "Apple Inc." },
    { user_id: demoUser._id, ticker: "NVDA", companyName: "NVDIA Corp."},
    { user_id: demoUser._id, ticker: "META", companyName: "Meta Platforms" },
    { user_id: demoUser._id, ticker: "MSFT", companyName: "Microsoft Inc." },
  ];

  let createdWashlistItems = await WatchlistItems.insertMany(watchlistItems);
  console.log("Created Watchlist Items", createdWashlistItems);
  //Create transactions for Demo
  const transactions = [
    { user_id: demoUser._id, ticker: "TSLA", qty: 500, price: 10 },
    { user_id: demoUser._id, ticker: "AAPL", qty: 200, price: 15 },
    { user_id: demoUser._id, ticker: "NVDA", qty: 100, price: 8 },
  ];

  let createdTransactions = await Transactions.insertMany(transactions);
  console.log("Created Transactions", createdTransactions);
};

run();
