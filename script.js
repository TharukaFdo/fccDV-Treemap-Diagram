const DATA_URL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';
const width = 960;
const height = 600;

const svg = d3.select("#treemap");
const tooltip = d3.select("#tooltip");

d3.json(DATA_URL).then(data => {
  const root = d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value);

  d3.treemap()
    .size([width, height])
    .paddingInner(1)(root);

  const categories = Array.from(new Set(root.leaves().map(d => d.data.category)));
  const color = d3.scaleOrdinal()
    .domain(categories)
    .range(d3.schemeCategory20?.slice(0, categories.length) || d3.schemeTableau10);

  const cell = svg.selectAll("g")
    .data(root.leaves())
    .enter()
    .append("g")
    .attr("transform", d => `translate(${d.x0},${d.y0})`);

  cell.append("rect")
    .attr("class", "tile")
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value)
    .attr("width", d => d.x1 - d.x0)
    .attr("height", d => d.y1 - d.y0)
    .attr("fill", d => color(d.data.category))
    .on("mousemove", (event, d) => {
      tooltip.style("opacity", 0.9)
        .html(`Name: ${d.data.name}<br>Category: ${d.data.category}<br>Value: ${d.data.value}`)
        .attr("data-value", d.data.value)
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY - 30 + "px");
    })
    .on("mouseout", () => tooltip.style("opacity", 0));

  cell.append("text")
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append("tspan")
    .attr("x", 4)
    .attr("y", (d, i) => 13 + i * 10)
    .text(d => d)
    .attr("font-size", "10px")
    .attr("fill", "black");

  // LEGEND: 3 columns of 6 items
  const legend = d3.select("#legend");
  const itemsPerRow = 6;

  categories.forEach((cat, i) => {
    const item = legend.append("div")
      .attr("class", "legend-item")
      .style("width", "33%");

    item.append("div")
      .style("background-color", color(cat));

    item.append("span").text(cat);
  });
});
