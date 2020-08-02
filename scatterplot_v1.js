!(function (d3) {
  // Set the dimensions of the canvas / graph
  var margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 50,
  };
  var width = 600 - margin.left - margin.right;
  var height = 400 - margin.top - margin.bottom;

  // Parse the deaths / time
  var parsedeaths = d3.timeParse("%d-%b-%y");
  var formatTime = d3.timeFormat("%e %B");

  // Set the ranges
  var x = d3.scaleLog().range([0, width]);
  var y = d3.scaleLog().range([height, 0]);

  // Define the axes
  var xAxis = d3.axisBottom(x).ticks(10);

  var yAxis = d3.axisLeft(y).ticks(10);

  // Define the line
  var valueline = d3
    .line()
    .x((d) => x(d.deaths))
    .y((d) => y(d.cases));

  // Define the div for the tooltip
  var div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Adds the svg canvas
  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Get the data
  d3.csv(
    "https://raw.githubusercontent.com/kn13-kiran/NarrativeVisualization/master/totalcasesByState.csv"
  ).then((data) => {
    data.forEach((d) => {
      //d.deaths = parsedeaths(d.deaths);
      d.state = d.state;
      d.deaths = +d.deaths;
      d.cases = +d.cases;
    });

    // Scale the range of the data
    // x.domain(d3.extent(data, d => d.deaths));
    x.domain([1, d3.max(data, (d) => d.deaths)]);
    y.domain([1, d3.max(data, (d) => d.cases)]);

    // Add the valueline path.
    // svg
    //  .append('path')
    //  .attr('class', 'line')
    //  .attr('d', valueline(data));

    // Add the scatterplot
    svg
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", (d) => 5 + d.deaths / 1000)
      .attr("cx", (d) => x(d.deaths))
      .attr("cy", (d) => y(d.cases))
      .attr("stroke-width", "20px")
      .attr("stroke", "rgba(0,0,0,0)")
      .style("cursor", "pointer")
      .on("mouseover", (d) => {
        div.transition().duration(200).style("opacity", 0.9);
        div
          .html(d.deaths + "<br/>" + d.cases + "<br/>" + d.state)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", () => {
        div.transition().duration(500).style("opacity", 0);
      });

    // Add the X Axis
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Add the Y Axis
    svg.append("g").attr("class", "y axis").call(yAxis);
  });
})(d3);
