const drawChart = (input) => {
  if (!input) return;
  let data = google.visualization.arrayToDataTable(input);

  let options = {
    title: "test title",
    hAxis: { title: "test", titleTextStyle: { color: "blue" } },
    vAxis: { minValue: 0 },
  };

  let chart = new google.visualization.BarChart(
    document.getElementById("chartContainer")
  );
  chart.draw(data, options);
};

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(drawChart);

setTimeout(() => {
  drawChart([
    ["test1", "test2", "test3"],
    ["1", 0, 0],
    ["2", 1, 0],
    ["3", 0, 0],
    ["4", 0, 0],
  ]);
}, 10);
setTimeout(() => {
  drawChart([
    ["test1", "test2", "test3"],
    ["1", 1, 1],
    ["2", 2, 2],
    ["3", 3, 3],
    ["4", 4, 4],
  ]);
}, 2000);

setTimeout(() => {
  drawChart([
    ["test1", "test2", "test3"],
    ["1", 5, 2],
    ["2", 3, 6],
    ["3", 6, 7],
    ["4", 1, 4],
  ]);
}, 4000);
