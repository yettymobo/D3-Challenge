// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".scatter-plot")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(data) {

    // parse data
    data.forEach(function(d) {
      d.poverty = +d.poverty;
      d.healthcare = +d.healthcare;
    });
  
// Create x scale variable
var xLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.poverty), d3.max(data, d => d.poverty)])
    .range([0, chartWidth])
    .nice();
  
// Create y scale variable
var yLinearScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.healthcare), d3.max(data, d => d.healthcare)])
    .range([chartHeight, 0])
    .nice();
 
// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// append x axis
var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${chartHeight})`)
  .call(bottomAxis);

// append y axis
chartGroup.append("g")
  .call(leftAxis);

   // append circles
var circlesGroup = chartGroup.selectAll("circle")
   .data(data)
   .enter()
   .append("circle")
   .attr("cx", d => xLinearScale(d.poverty))
   .attr("cy", d => yLinearScale(d.healthcare))
   .attr("r", 20)
   .attr("fill", "blue")
   .attr("opacity", ".8");

   // append text in middle of circles
var circleText = chartGroup.selectAll(null)
.data(data)
.enter()
.append("text")
.attr("x", d => xLinearScale(d.poverty))
.attr("y", d => yLinearScale(d.healthcare))
.text(d => yLinearScale(d.abbr))
.attr("font-family", "sans-serif")
.attr("font-size", "5px")
.attr("fill", "white")
.attr('text-anchor', 'middle');
