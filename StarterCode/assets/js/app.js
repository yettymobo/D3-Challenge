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
var circlesGroup = chartGroup.selectAll(".stateCircle")
   .data(data)
   .enter()
   .append("circle")
   .attr("cx", d => xLinearScale(d.poverty))
   .attr("cy", d => yLinearScale(d.healthcare))
   .attr("r", 20)
   .attr("fill", "blue")
   .attr("opacity", ".8");

   // append text in middle of circles
var circleText = chartGroup.selectAll(".stateText")
    .data(data)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .text(d => yLinearScale(d.abbr))
    .attr('text-anchor', 'middle');

// append x axis label
chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`)
    .classed("aText", true)
    .text("In Poverty (%)") 

// append y axis label
chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .classed("aText", true)
    .text("Lacks Healthcare (%)");

// initialize tooltip
var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.abbr}<br>"Poverty %:"${d.poverty} <br>"Healthcare %:" ${d.healthcare}`);


    });

// create tooltip
chartGroup.call(toolTip);

// onmousever event for circles Group
circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
})

// onmouseout event for circles Group
.on("mouseout", function(data, index) {
    toolTip.hide(data);
 });

 