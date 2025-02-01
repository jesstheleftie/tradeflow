const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const db = require("./db");
const cors = require("cors");
const stockController = require("./controllers/stockController");
const userController = require("./controllers/userController");
const watchlistItemController = require("./controllers/watchlistItemController");
const tickerController = require("./controllers/tickerController");
const transactionController = require("./controllers/transactionController");
const app = express();
// const plantController = require('./controllers/plantController')

// require() imports and middleware here ^ ///////
app.use(cors());
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

app.use(logger("dev"));
app.use(bodyParser.json());

// app.use() middleware here ^ ///////////////////


app.post("/getData", stockController.getStockData);
app.get("/news", stockController.getStockNews);

//User CRUD
app.get("/users/:id", userController.getUserByName);
app.put("/users/:id", userController.updateUser);
app.delete("/users/:id", userController.deleteUser);
app.get("/users", userController.getAllUsers);
app.post("/users/login", userController.login);
app.post("/users", userController.createUser);

//Watchlist CRUD
app.get(
  "/watchlistItems/:id",
  watchlistItemController.getWatchlistItemsByUserId
);
app.put("/watchlistItems/:id", watchlistItemController.updateWatchlistItem);
app.delete("/watchlistItems/:id", watchlistItemController.deleteWatchlistItem);
app.get("/watchlistItems", watchlistItemController.getAllWatchlistItems);
app.post("/watchlistItems", watchlistItemController.createWatchlistItem);

//Transaction CRUD
app.get("/transactions/:id", transactionController.getTransactionByUserId);
app.put("/transactions/:id", transactionController.updateTransaction);
app.delete("/transactions/:id", transactionController.deleteTransaction);
app.get("/transactions", transactionController.getAllTransactions);
app.post("/transactions", transactionController.createTransaction);

//Ticker GET
app.get("/tickers", tickerController.getAllTickers);

