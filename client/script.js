const drawChart = (input) => {
  if (!input) return;
  let data = google.visualization.arrayToDataTable(input);

  let options = {
    title: "Stock Performance",
    legend: "none",
    candlestick: {
      fallingColor: { stroke: "#FF0000", strokeWidth: 0, fill: "#a52714" }, // Red for falling stocks
      risingColor: { stroke: "#00FF00", strokeWidth: 0, fill: "#0f9d58" }, // Green for rising stocks
    },
    bar: { groupWidth: "50%" }, // Control the overall width (including body and wicks)
    candlestick: {
      width: 20,
    }, // Set candlestick body width
  };

  let chart = new google.visualization.CandlestickChart(
    document.getElementById("chartContainer")
  );
  chart.draw(data, options);
};

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

// setTimeout(() => {
//   drawChart(
//     [
//       [
//         "Day",
//         "High Price",
//         "Opening Price",
//         "Closing Price",
//         "Low Price",
//         { role: "style", type: "string" },
//       ],
//       ["Mon", 26, 18, 17, 15, "red"],
//       ["Tue", 26, 18, 19, 15, "green"],
//       ["Wed", 24, 22, 28, 26, "green"],
//       ["Thu", 26, 24, 30, 28, "green"],
//       ["Fri", 28, 26, 32, 30, "green"],
//     ],
//     true
//   );
// }, 100);
// setTimeout(() => {
//   drawChart([
//     ["test1", "test2", "test3"],
//     ["1", 1, 1],
//     ["2", 2, 2],
//     ["3", 3, 3],
//     ["4", 4, 4],
//   ]);
// }, 2000);

// setTimeout(() => {
//   drawChart([
//     ["test1", "test2", "test3"],
//     ["1", 5, 2],
//     ["2", 3, 6],
//     ["3", 6, 7],
//     ["4", 1, 4],
//   ]);
// }, 4000);

//Data & Values
let searchInput = "AAPL";
const stockData = [];
let allStocks = [];
let allTickers = [];
const firstRow = [
  "Day",
  "High Price",
  "Opening Price",
  "Closing Price",
  "Low Price",
  { role: "style", type: "string" },
];
let chartArray = [firstRow];
const tickerAmount = 50;

let chartTicker = "";
let chartCompanyName = "";
let chartStockPrice = 0;
let usernameInput = "";
let pinInput = "";
let loggedIn = false;
let loggedInUser = {
  username: "",
  pin: "",
  transactions: [],
  watchlistItems: [],
};

//Functions
const login = async () => {
  console.log("logging in");
  const requestBody = {
    username: usernameInput.toLowerCase(),
    pin: pinInput,
  };
  try {
    let foundUser = await axios.post(
      "http://localhost:3001/users/login",
      requestBody
    );
    if (foundUser) {
      loggedIn = true;
      loggedInUser = foundUser.data;
    } else {
      console.log("invalid");
    }
  } catch (err) {}
  render();
};

const logout = () => {
  loggedIn = false;
  loggedInUser = {
    username: "",
    pin: "",
    transactions: [],
    watchlistItems: [],
  };
  render();
};

const searchStock = async (searchInput) => {
  //Check if searchInput sticker is valid
  if (!allTickers.includes(searchInput.toUpperCase())) {
    return;
  }
  const requestBody = {
    ticker: searchInput.toUpperCase(),
  };

  const data = await axios.post("http://localhost:3001/getData", requestBody);

  chartTicker = data.data.ticker;
  chartCompanyName = allStocks.find((eachStock) => {
    return eachStock.ticker === data.data.ticker;
  }).companyName;

  chartStockPrice = data.data.results[data.data.results.length - 1].c;

  const resArray = data.data.results;
  console.log(data);
  chartArray = [firstRow];
  resArray
    //.slice(start from index,end at index)
    .slice(resArray.length - (tickerAmount + 1), resArray.length - 1)
    .forEach((eachCandle) => {
      let color = "black";
      if (eachCandle.o - eachCandle.c > 0) {
        color = "red";
      }
      if (eachCandle.o - eachCandle.c < 0) {
        color = "green";
      }
      chartArray.push([
        eachCandle.t,
        eachCandle.h,
        eachCandle.o,
        eachCandle.c,
        eachCandle.l,
        color,
      ]);
    });

  drawChart(chartArray);
  //If ticker is valid, make the API call to stocks

  //Store the information
  render();
};

const getAllStocks = async () => {
  try {
    const res = await axios.get("http://localhost:3001/tickers");

    allStocks = res.data;
    allTickers = allStocks.map((stock) => {
      return stock.ticker;
    });
  } catch (error) {
    console.error("Error", error);
  }
};

//Elements
const searchInputElement = document.getElementById("searchInput");
const searchButtonElement = document.getElementById("searchButton");
const titleTickerElement = document.querySelector(".titleTicker");
const titleCompanyNameElement = document.querySelector(".titleCompanyName");
const chartHeaderStockPriceElement = document.querySelector(
  ".chartHeaderStockPrice"
);
const usernameInputElement = document.getElementById("usernameInput");
const pinInputElement = document.getElementById("pinInput");
const loginButtonElement = document.getElementById("loginButton");

const credentialsContainerElement = document.getElementById(
  "credentialsContainer"
);
const loggedInContainerElement = document.getElementById("loggedInContainer");
const welcomeMessageElement = document.getElementById("welcomeMessage");
const logoutButtonElement = document.getElementById("logoutButton");
//event listeners
searchInputElement.addEventListener("input", (e) => {
  searchInput = e.target.value;
});
searchButtonElement.addEventListener("click", () => {
  searchStock(searchInput);
});
usernameInputElement.addEventListener("input", (e) => {
  usernameInput = e.target.value;
});
pinInputElement.addEventListener("input", (e) => {
  pinInput = e.target.value;
});
loginButtonElement.addEventListener("click", () => {
  login();
});
logoutButtonElement.addEventListener("click", () => {
  usernameInput = "";
  pinInput = "";
  logout();
});

//Run Functions
getAllStocks();
setTimeout(() => {
  searchStock("AAPL");
}, 1000);
setTimeout(() => {
  searchStock("TSLA");
}, 5000);

//Render to frontend
const render = () => {
  titleTickerElement.innerText = chartTicker.toUpperCase();
  titleCompanyNameElement.innerText = chartCompanyName;
  chartHeaderStockPriceElement.innerText = chartStockPrice;
  console.log("logged in user", loggedInUser);
  welcomeMessageElement.innerText = `Hi ${loggedInUser.username}!`;
  //login logics
  if (loggedIn) {
    credentialsContainerElement.style.display = "none";
    loggedInContainerElement.style.display = "inherit";
  } else {
    credentialsContainerElement.style.display = "inherit";
    loggedInContainerElement.style.display = "none";
  }
  usernameInputElement.value = usernameInput;
  pinInputElement.value = pinInput;
};
