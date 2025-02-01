const BASE_URL = "https://tradeflow-327c5044b0d5.herokuapp.com";
// const BASE_URL = "http://localhost:3001";

//Elements
const appContainerElement = document.querySelector(".appContainer");
const topNavElement = document.querySelector(".topNav");

const leftColumnElement = document.querySelector(".leftColumn");
const middleColumnElement = document.querySelector(".middleColumn");
const rightColumnElement = document.querySelector(".rightColumn");

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

const watchlistItemContainerElement = document.getElementById(
  "watchlistItemContainer"
);

const transactionContainerElement = document.getElementById(
  "transactionContainer"
);

const ordersTickerInputElement = document.getElementById("ordersTickerInput");

const ordersPriceInputElement = document.getElementById("ordersPriceInput");

const ordersQtyInputElement = document.getElementById("ordersQtyInput");

const ordersBuyButtonElement = document.getElementById("ordersBuyButton");

const ordersSellButtonElement = document.getElementById("ordersSellButton");

const newsContainerElement = document.getElementById("newsContainer");

const searchDropDownElement = document.getElementById("searchDropDown");

const addToWatchlistButtonElement = document.getElementById(
  "addToWatchlistButton"
);

const addToWashlistButtonElement = document.getElementById(
  "addToWatchlistButton"
);

const flipMode1Element = document.getElementById("flipMode1");
const flipMode2Element = document.getElementById("flipMode2");

const cardStyleLightElements = document.querySelectorAll(".cardStyleLight");

const cardStyleDarkElements = document.querySelectorAll(".cardStyleDark");

//Data & Values
let themeMode = "light";
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

let chartTicker = "";
let chartCompanyName = "";
let chartStockPrice = 0;
let usernameInput = "";
let pinInput = "";
let loggedIn = false;
let loggedInUser = {
  _id: "",
  username: "",
  pin: "",
  transactions: [],
  watchlistItems: [],
};

let userWatchlist = [];
let userTransaction = [];
let ordersQtyInput = 0;
let allNews = [];

//Functions
//Login Logout
const login = async () => {
  const requestBody = {
    username: usernameInput.toLowerCase(),
    pin: pinInput,
  };
  try {
    let foundUser = await axios.post(`${BASE_URL}/users/login`, requestBody);
    if (foundUser) {
      loggedIn = true;
      loggedInUser = foundUser.data;

      getUserWatchlist();
      getUserTransaction();
    } else {
      console.log("invalid");
    }
  } catch (err) {}
  loginRenderLogics();
  drawChart(chartArray);
  render();
};

const logout = () => {
  loggedIn = false;
  loggedInUser = {
    _id: "",
    username: "",
    pin: "",
    transactions: [],
    watchlistItems: [],
  };
  userWatchlist = [];
  userTransaction = [];
  loginRenderLogics();
  drawChart(chartArray);
  render();
};

//Watchlist
const getUserWatchlist = async () => {
  if (loggedIn) {
    try {
      let returnData = await axios.get(
        `${BASE_URL}/watchlistItems/${loggedInUser._id}`
      );
      userWatchlist = returnData.data;
    } catch (error) {}
  }
  render();
};

const renderWatchlist = () => {
  watchlistItemContainerElement.innerHTML = "";
  userWatchlist.forEach((eachStock) => {
    let newDiv = document.createElement("div");
    newDiv.classList.add("watchlistItem");
    newDiv.classList.add(
      `${themeMode === "light" ? "lightModeButton" : "darkModeButton"}`
    );

    newDiv.innerHTML = `
<div class="watchlistItemTicker">${eachStock.ticker}</div>
<div class="watchlistItemCompanyName">${eachStock.companyName}</div>
`;

    newDiv.addEventListener("click", () => {
      searchStock(eachStock.ticker);
    });
    watchlistItemContainerElement.appendChild(newDiv);
  });
};

//Transactions
const getUserTransaction = async () => {
  if (loggedIn) {
    try {
      let returnData = await axios.get(
        `${BASE_URL}/transactions/${loggedInUser._id}`
      );
      userTransaction = returnData.data;
    } catch (error) {}
  }
  render();
};

const renderTransaction = () => {
  transactionContainerElement.innerHTML = "";
  userTransaction
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .forEach((eachTransaction) => {
      let newDiv = document.createElement("div");
      newDiv.classList.add("transactionItem");
      newDiv.innerHTML = `<div class="transactionTicker"><span>${
        eachTransaction.ticker
      }</span><span class="buySellIndicator" style="color:${
        eachTransaction.qty > 0 ? "rgb(129, 190, 37)" : "rgb(237, 9, 9)"
      }">${eachTransaction.qty > 0 ? "Buy" : "Sell"}</span></div>
    <div class="transactionSharePrice">$${eachTransaction.price}</div>
    <div class="transactionShareQty">${eachTransaction.qty} Shares</div>
    <div class="transactionDate">${new Date(
      eachTransaction.createdAt
    ).toLocaleString()}</div>
    `;
      transactionContainerElement.appendChild(newDiv);
    });
};

//Stocks
const getAllStocks = async () => {
  try {
    console.log(`${BASE_URL}/tickers`);
    const res = await axios.get(`${BASE_URL}/tickers`);
    console.log("res", res.data);
    allStocks = res.data;
    allTickers = allStocks.map((stock) => {
      return stock.ticker;
    });
  } catch (error) {
    console.error("Error", error);
  }
};

const searchStock = async (searchInput) => {
  searchDropDownElement.innerHTML = "";
  console.log("123", allTickers, searchInput);
  //Check if searchInput ticker is valid
  if (!allTickers.includes(searchInput.toUpperCase())) {
    return;
  }
  console.log("456");
  const requestBody = {
    ticker: searchInput.toUpperCase(),
  };
  try {
    console.log(`${BASE_URL}/getData`);
    const data = await axios.post(`${BASE_URL}/getData`, requestBody);
    searchInput = "";
    chartTicker = data.data.ticker;
    chartCompanyName = allStocks.find((eachStock) => {
      return eachStock.ticker === data.data.ticker;
    }).companyName;

    chartStockPrice = data.data.results[data.data.results.length - 1].c;

    const resArray = data.data.results;
    chartArray = [firstRow];
    const barAmount = 50;
    resArray
      //.slice(start from index,end at index) to extract the last 50 price data
      .slice(resArray.length - (barAmount + 1), resArray.length - 1)
      .forEach((eachCandle) => {
        let color = "black";
        if (eachCandle.o - eachCandle.c > 0) {
          color = "red";
        }
        if (eachCandle.o - eachCandle.c < 0) {
          color = "green";
        }
        chartArray.push([
          new Date(eachCandle.t),
          eachCandle.h,
          eachCandle.o,
          eachCandle.c,
          eachCandle.l,
          color,
        ]);
      });
    ordersQtyInput = 0;
    drawChart(chartArray);
    render();
    //If ticker is valid, make the API call to stocks
  } catch (error) {}
  //Store the information
};

//News
const getAllNews = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/news`);
    allNews = res.data.results;
    renderNews();
  } catch (error) {}
};
const renderNews = () => {
  newsContainerElement.innerHTML = "";

  allNews.forEach((eachNews) => {
    let newDiv = document.createElement("div");
    newDiv.classList.add("newsItem");
    newDiv.classList.add(
      `${themeMode === "light" ? "lightModeButton" : "darkModeButton"}`
    );
    newDiv.addEventListener("click", () => {
      window.open(eachNews.article_url, "_blank");
    });
    newDiv.innerHTML = `<div><img style='max-height:40px; max-width:100%' src='${eachNews.image_url}'/></div><div class="newsTitle ">${eachNews.title}</div><div class="newsBody ">${eachNews.description}</div>`;
    newsContainerElement.appendChild(newDiv);
  });
};
//Buy and sell
const buyStock = async () => {
  if (ordersQtyInput <= 0 || loggedIn === false) {
    return;
  }
  try {
    const requestBody = {
      user_id: loggedInUser._id,
      ticker: chartTicker,
      qty: ordersQtyInput,
      price: chartStockPrice,
    };
    const res = await axios.post(`${BASE_URL}/transactions`, requestBody);
    if (res) {
      userTransaction.push(res.data.transaction);
      ordersQtyInput = 0;

      render();
    }
  } catch (error) {}
};

const sellStock = async () => {
  if (ordersQtyInput <= 0 || loggedIn === false) {
    return;
  }
  try {
    const requestBody = {
      user_id: loggedInUser._id,
      ticker: chartTicker,
      qty: ordersQtyInput * -1,
      price: chartStockPrice,
    };
    const res = await axios.post(`${BASE_URL}/transactions`, requestBody);
    if (res) {
      userTransaction.push(res.data.transaction);
      ordersQtyInput = 0;
      render();
    }
  } catch (error) {}
};

//Dropdown suggest
const autoSuggest = (tickerString) => {
  searchDropDownElement.innerHTML = "";
  const filterSuggestions = allStocks.filter((eachStock) => {
    if (tickerString.length > 0) {
      return eachStock.ticker.startsWith(tickerString);
    }
  });
  filterSuggestions
    .slice(0, 10)
    .sort((a, b) => {
      return a.ticker.localeCompare(b.ticker);
    })
    .forEach((suggestion) => {
      const newDiv = document.createElement("div");
      newDiv.classList.add("autocompleteItem");
      newDiv.classList.add(
        `${themeMode === "light" ? "lightModeButton" : "darkModeButton"}`
      );
      newDiv.innerHTML = `<div class="autocompleteItemTicker">${suggestion.ticker}</div>`;
      // <div class="autocompleteItemCompanyName">${suggestion.companyName}</div>
      newDiv.addEventListener("click", () => {
        searchStock(suggestion.ticker);

        searchDropDownElement.innerHTML = "";
      });
      searchDropDownElement.appendChild(newDiv);
    });
};

//Bookmark
const favouriteClick = async () => {
  if (loggedIn === false) {
    return;
  }
  let foundWatchlistStock = userWatchlist.find((eachWatchlistStock) => {
    return eachWatchlistStock.ticker === chartTicker;
  });
  if (foundWatchlistStock) {
    let deletedWatchlistStock = await axios.delete(
      `${BASE_URL}/watchlistItems/${foundWatchlistStock._id}`
    );

    if (deletedWatchlistStock) {
      let foundWatchlistStockIndex = null;
      if (chartTicker === foundWatchlistStock.ticker) {
        userWatchlist.find((eachWatchlistStock, index) => {
          if (eachWatchlistStock.ticker === chartTicker) {
            foundWatchlistStockIndex = index;
          }
        });
      }

      userWatchlist = userWatchlist.filter((eachStock, index) => {
        if (foundWatchlistStockIndex !== index) {
          return true;
        }
      });
    }
  } else {
    const requestBody = {
      user_id: loggedInUser._id,
      ticker: chartTicker,
      companyName: chartCompanyName,
    };
    let addedWatchlistStock = await axios.post(
      `${BASE_URL}/watchlistItems`,
      requestBody
    );

    if (addedWatchlistStock) {
      userWatchlist.push(addedWatchlistStock.data.watchlist);
    }
  }
  render();
};

//Adjust columns and some button behaviours when logged in or out
const loginRenderLogics = () => {
  if (loggedIn) {
    //Column sizings when logged in
    leftColumnElement.style.width = "15%";
    leftColumnElement.style.maxWidth = "250px";
    middleColumnElement.style.width = "calc(65% - 20px)";
    middleColumnElement.style.minWidth = "calc(100% - 550px - 20px)";
    middleColumnElement.style.margin = "0 10px";
    //Enable buy sell buttons also
    ordersBuyButtonElement.style.opacity = 1;
    ordersBuyButtonElement.style.cursor = "pointer";
    ordersSellButtonElement.style.opacity = 1;
    ordersSellButtonElement.style.cursor = "pointer";
    ordersQtyInputElement.disabled = false;
    //Show bookmark icon when logged in
    addToWatchlistButtonElement.style.display = "inherit";
  } else {
    //Column sizings when logged out
    leftColumnElement.style.width = "0%";
    leftColumnElement.style.maxWidth = "250px";
    middleColumnElement.style.width = "calc(80% - 10px)";
    middleColumnElement.style.minWidth = "calc(100% - 300px - 20px)";
    middleColumnElement.style.margin = "0 10px 0 0";
    //Disabled buy sell buttons also
    ordersBuyButtonElement.style.opacity = 0.25;
    ordersBuyButtonElement.style.cursor = "default";
    ordersSellButtonElement.style.opacity = 0.25;
    ordersSellButtonElement.style.cursor = "default";
    ordersQtyInputElement.disabled = true;
    //Show bookmark icon when logged out
    addToWatchlistButtonElement.style.display = "none";
  }
};

const drawChart = (input) => {
  //From forum research, a little bit of chatGPT for stylings
  if (!input) return;
  let data = google.visualization.arrayToDataTable(input);

  let options = {
    legend: "none",
    backgroundColor: { fill: "none" },
    candlestick: {
      fallingColor: { stroke: "#FF0000", strokeWidth: 0, fill: "#a52714" },
      risingColor: { stroke: "#00FF00", strokeWidth: 0, fill: "#0f9d58" },
      width: 20,
    },
    chartArea: { left: 60, height: "90%", width: "92%" },

    bar: { groupWidth: "50%" },
    hAxis: {
      gridlines: { color: "none", maxCount: 20 },
      format: "HH:mm",
      textStyle: { fontSize: 10, color: "rgb(150,150,150)" },
    },
    vAxis: {
      gridlines: { color: "none" },
      textStyle: { fontSize: 10, color: "rgb(150,150,150)" },
    },
  };

  let chart = new google.visualization.CandlestickChart(
    document.getElementById("chartContainer")
  );
  chart.draw(data, options);

  window.addEventListener("resize", () => {
    chart.draw(data, options);
  });
};
google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

//Event listeners
//Stock search input
searchInputElement.addEventListener("input", (e) => {
  searchInput = e.target.value;
  autoSuggest(e.target.value.toUpperCase());
});
//Search Button
searchButtonElement.addEventListener("click", () => {
  searchStock(searchInput);
});
//Username input
usernameInputElement.addEventListener("input", (e) => {
  usernameInput = e.target.value;
});
//Pin input
pinInputElement.addEventListener("input", (e) => {
  pinInput = e.target.value;
});
//Login button
loginButtonElement.addEventListener("click", () => {
  login();
});
//Logout button
logoutButtonElement.addEventListener("click", () => {
  usernameInput = "";
  pinInput = "";
  logout();
});
//Orders qty input
ordersQtyInputElement.addEventListener("input", (e) => {
  ordersQtyInput = e.target.value;
});
//Buy button
ordersBuyButtonElement.addEventListener("click", () => {
  buyStock();
});
//Sell button
ordersSellButtonElement.addEventListener("click", () => {
  sellStock();
});
//Bookmark button
addToWatchlistButtonElement.addEventListener("click", () => {
  favouriteClick();
});
//Flip light and dark mode button in non logged in mode
flipMode1Element.addEventListener("click", () => {
  if (themeMode === "light") {
    themeMode = "dark";
  } else {
    themeMode = "light";
  }
  render();
});
//Flip light and dark mode button in logged in mode
flipMode2Element.addEventListener("click", () => {
  if (themeMode === "light") {
    themeMode = "dark";
  } else {
    themeMode = "light";
  }
  render();
});

//Render to page
const render = () => {
  //Title render
  titleTickerElement.innerText = chartTicker.toUpperCase();
  //Order ticker input box render
  ordersTickerInputElement.placeholder = chartTicker.toUpperCase();
  //Title company name update
  titleCompanyNameElement.innerText = chartCompanyName;
  //Title stock price render
  chartHeaderStockPriceElement.innerText = "$" + chartStockPrice;
  //Order price box update
  ordersPriceInputElement.placeholder = chartStockPrice;
  //Order qty box update
  ordersQtyInputElement.value = ordersQtyInput;
  //Update welcome message in nav
  welcomeMessageElement.innerText = `Hi, ${loggedInUser.username}!`;
  //Update search input box
  searchInputElement.innerText = searchInput;

  //login element show and hide
  if (loggedIn) {
    credentialsContainerElement.style.display = "none";
    loggedInContainerElement.style.display = "flex";
  } else {
    credentialsContainerElement.style.display = "flex";
    loggedInContainerElement.style.display = "none";
  }
  //show hide watchlist and transactions
  loginRenderLogics();

  usernameInputElement.value = usernameInput;
  pinInputElement.value = pinInput;

  //Change svg between bookmarked and not bookmarked
  if (
    userWatchlist.filter((eachWatchlistStock) => {
      return eachWatchlistStock.ticker === chartTicker;
    }).length !== 0
  ) {
    addToWashlistButtonElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50"> <path d="M 37 48 C 36.824219 48 36.652344 47.953125 36.496094 47.863281 L 25 41.15625 L 13.503906 47.863281 C 13.195313 48.042969 12.8125 48.046875 12.503906 47.867188 C 12.191406 47.6875 12 47.359375 12 47 L 12 3 C 12 2.449219 12.449219 2 13 2 L 37 2 C 37.554688 2 38 2.449219 38 3 L 38 47 C 38 47.359375 37.808594 47.6875 37.496094 47.867188 C 37.34375 47.957031 37.171875 48 37 48 Z" fill="rgb(209, 162, 45)"></path> </svg>
`;
  } else {
    addToWashlistButtonElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50" >
<path d="M 12.8125 2 C 12.335938 2.089844 11.992188 2.511719 12 3 L 12 47 C 11.996094 47.359375 12.1875 47.691406 12.496094 47.871094 C 12.804688 48.054688 13.1875 48.054688 13.5 47.875 L 25 41.15625 L 36.5 47.875 C 36.8125 48.054688 37.195313 48.054688 37.503906 47.871094 C 37.8125 47.691406 38.003906 47.359375 38 47 L 38 3 C 38 2.449219 37.550781 2 37 2 L 13 2 C 12.96875 2 12.9375 2 12.90625 2 C 12.875 2 12.84375 2 12.8125 2 Z M 14 4 L 36 4 L 36 45.25 L 25.5 39.125 C 25.191406 38.945313 24.808594 38.945313 24.5 39.125 L 14 45.25 Z" fill='${
      themeMode === "light" ? "rgb(0,0,0)" : "rgb(245, 242, 211)"
    }'></path>
</svg>`;
  }

  renderWatchlist();
  renderTransaction();

  //Change theme between light and dark
  if (themeMode === "dark") {
    //Make all elements light
    document.querySelectorAll(".lightMode").forEach((eachElement) => {
      eachElement.classList.remove("lightMode");
      eachElement.classList.add("darkMode");
    });
    //Make all buttons light
    document.querySelectorAll(".lightModeButton").forEach((eachElement) => {
      eachElement.classList.remove("lightModeButton");
      eachElement.classList.add("darkModeButton");
    });

    //Make the background dark
    appContainerElement.style.backgroundColor = "rgb(30, 30, 30)";

    //Change light/dark mode logo in both locations
    flipMode1Element.innerHTML = `<img
      class="flipIconLight"
      src="images/icons8-light-mode-78.png"
    />`;
    flipMode2Element.innerHTML = `<img
      class="flipIconLight"
      src="images/icons8-light-mode-78.png"
    />`;

    document.querySelectorAll(".cardStyleLight").forEach((eachElement) => {
      eachElement.classList.remove("cardStyleLight");
      eachElement.classList.add("cardStyleDark");
    });
    //Remove top nav shadow
    topNavElement.style.boxShadow = "none";
  } else {
    //Make all elements dark
    document.querySelectorAll(".darkMode").forEach((eachElement) => {
      eachElement.classList.remove("darkMode");
      eachElement.classList.add("lightMode");
    });
    //Make all buttons dark
    document.querySelectorAll(".darkModeButton").forEach((eachElement) => {
      eachElement.classList.remove("darkModeButton");
      eachElement.classList.add("lightModeButton");
    });
    //Make the background light
    appContainerElement.style.backgroundColor = "rgb(235, 235, 235)";

    //Change light/dark mode logo in both locations
    flipMode1Element.innerHTML = `<img
            class="flipIconDark"
            src="images/icons8-dark-mode-50.png"
          />`;
    flipMode2Element.innerHTML = `<img
            class="flipIconDark"
            src="images/icons8-dark-mode-50.png"
          />`;

    document.querySelectorAll(".cardStyleDark").forEach((eachElement) => {
      eachElement.classList.remove("cardStyleDark");
      eachElement.classList.add("cardStyleLight");
    });
    //Add top nav shadow
    topNavElement.style.boxShadow = "0px 5px 10px rgb(158, 157, 157)";
  }
};

//Run initial functions
setTimeout(() => {
  getAllStocks();
  getAllNews();
}, 1000);

setTimeout(() => {
  searchStock("AAPL");
}, 10000);
