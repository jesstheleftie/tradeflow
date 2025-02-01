const db = require("../db");
const Users = require("../models/users");

// Connect to the database
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const main = async () => {
  const users = [
    { username: "Demo", pin: "123" },
    { username: "Alice", pin: "456" },
    { username: "Bob", pin: "789" },
    { username: "Charlie", pin: "101" },
    { username: "Eve", pin: "202" },
    { username: "Mallory", pin: "303" },
    { username: "Trent", pin: "404" },
    { username: "Peggy", pin: "505" },
  ];

  await Users.insertMany(users);
  console.log("Created some users!");
};
const run = async () => {
  await main();
  db.close();
};

run();
