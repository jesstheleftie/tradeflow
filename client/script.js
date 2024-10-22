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

//Data
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
//Functions
const searchStock = async (searchInput) => {
  //Check if searchInput sticker is valid
  if (!allTickers.includes(searchInput.toUpperCase())) {
    return;
  }
  const requestBody = {
    ticker: searchInput.toUpperCase(),
  };
  const data = await axios.post("http://localhost:3001/getData", requestBody);
  const resArray = data.data.results;
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
  console.log("chartArray", chartArray);
  drawChart(chartArray);
  //If ticker is valid, make the API call to stocks

  //Store the information
};

const getAllStocks = async () => {
  console.log("here");
  try {
    console.log("here321");
    const res = await axios.get("http://localhost:3001/tickers");
    console.log("all stocks", res.data);
    allStocks = res.data;
    allTickers = allStocks.map((stock) => {
      return stock.ticker;
    });
  } catch (error) {
    console.error("Error", error);
  }
};
const renderChart = () => {};

//Elements
const searchInputElement = document.getElementById("searchInput");
const searchButtonElement = document.getElementById("searchButton");

//event listeners
searchInputElement.addEventListener("input", (e) => {
  searchInput = e.target.value;
});
searchButtonElement.addEventListener("click", () => {
  searchStock(searchInput);
});

//Run Functions
getAllStocks();
setTimeout(() => {
  searchStock("AAPL");
}, 1000);
setTimeout(() => {
  searchStock("TSLA");
}, 5000);
