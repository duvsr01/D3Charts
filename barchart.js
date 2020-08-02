!(function (d3) {
  var p = document.createElement("div");
  p.appendChild(document.createTextNode("Covid-19 Cases "));

  var listEl = document.createElement("select");
  listEl.id = "state";
  p.appendChild(listEl);

  document.body.appendChild(p);

  <svg id="chart" width="650" height="420"></svg>;

  d3.csv("https://duvsr01.github.io/D3Charts/usa_state_data.csv").then((d) =>
    chart(d)
  );
  function chart(csv) {
    csv.forEach(function (d) {
      return d;
    });
    var months = [...new Set(csv.map((d) => d.Month))],
      states = [...new Set(csv.map((d) => d.State))];

    console.log("months and states" + months, states);

    var options = d3
      .select("#state")
      .selectAll("option")
      .data(states)
      .enter()
      .append("option")
      .text((d) => d);

    console.log("options is" + JSON.stringify(options));

    var svg = d3.select("#chart"),
      margin = { top: 25, bottom: 10, left: 65, right: 25 },
      width = +svg.attr("width") - margin.left - margin.right,
      height = +svg.attr("height") - margin.top - margin.bottom;

    var x = d3
      .scaleBand()
      .range([margin.left, width - margin.right])
      .padding(0.1)
      .paddingOuter(0.2);

    var y = d3.scaleLinear().range([height - margin.bottom, margin.top]);

    var xAxis = (g) =>
      g
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(x).tickSizeOuter(0));

    // text label for the x axis
    svg
      .append("text")
      .attr(
        "transform",
        "translate(" + (width - 40) + " ," + (height + 30) + ")"
      )
      .style("text-anchor", "end")
      .text("Months");

    var yAxis = (g) =>
      g
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y));

    // text label for the y axis
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Covid Cases");

    const type = d3.annotationLabel;

    const annotations = [
      {
        /* note: {
          //label: "Longer text to show text wrapping",
          bgPadding: 20,
          title: "Rise of cases",
        },
        //can use x, y directly instead of data
        data: { date: 44, close: 82 },
        className: "show-bg",
        dy: 82,
        dx: 104,
      },*/

        note: { label: "Rapid Increase" },
        x: 300,
        y: 100,
        dy: 37,
        dx: 62,
        subject: { radius: 50, radiusPadding: 1 },
      },
    ];

    const parseTime = d3.timeParse("%d-%b-%y");
    const timeFormat = d3.timeFormat("%d-%b-%y");

    const makeAnnotations = d3
      .annotation()
      .editMode(true)
      //also can set and override in the note.padding property
      //of the annotation object
      .notePadding(15)
      .type(type)
      //accessors & accessorsInverse not needed
      //if using x, y in annotations JSON
      /*.accessors({
    x: (d) => x(d.date),
    y: (d) => y(d.close),
  })
  .accessorsInverse({
    date: (d) => x.invert(d.x),
    close: (d) => y.invert(d.y),
  })*/
      .annotations(annotations);

    d3.select("svg")
      .append("g")
      .attr("class", "annotation-group")
      .call(makeAnnotations);

    svg.append("g").attr("class", "x-axis");

    svg.append("g").attr("class", "y-axis");

    d3.select("chart")
      .selectAll("rect.bar")
      .on("mouseover", function (d) {
        tooltip.transition().delay(30).duration(200).style("opacity", 1);
        tooltip
          .html(d.measurement)
          .style("left", d3.event.pageX + 25 + "px")
          .style("top", d3.event.pageY + "px");
      });

    update(d3.select("#state").property("value"), 0);

    function update(state, speed) {
      console.log("state is" + state);
      var data = csv.filter((f) => f.State == state);

      console.log("the data values here are" + JSON.stringify(data));

      var maxVal = d3.max(data, function (d) {
        return Number(d.Cases);
      });

      console.log("maxval is" + maxVal);

      //y.domain([0, maxVal]);
      y.domain([
        0,
        d3.max(data, function (d) {
          return Number(d.Cases);
        }),
      ]).nice();

      svg.selectAll(".y-axis").transition().duration(speed).call(yAxis);

      x.domain(data.map((d) => d.Month));

      svg.selectAll(".x-axis").transition().duration(speed).call(xAxis);

      var bar = svg.selectAll(".bar").data(data, (d) => d.Month);

      bar.exit().remove();

      bar
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("fill", "steelblue")
        .attr("width", x.bandwidth())
        .merge(bar)
        .transition()
        .duration(speed)
        .attr("x", (d) => x(d.Month))
        .attr("y", (d) => y(d.Cases))
        .attr("height", (d) => y(0) - y(d.Cases));

      svg
        .selectAll("bar")
        .data(data)
        .enter()
        .append("text")
        .attr("class", "bar")
        .attr("text-anchor", "middle")
        .attr("font-size", "13px")
        .attr("font-family", "sans-serif")
        .attr("fill", "grey")
        .attr("x", function (d) {
          return x(d.Month) + x.bandwidth() / 2;
        })
        .attr("y", function (d) {
          return y(d.Cases) - 5;
        })
        .text(function (d) {
          return d.Cases;
        });
    }

    chart.update = update;
  }

  var select = d3
    .select("#state")
    .style("border-radius", "5px")
    .on("change", function () {
      chart.update(this.value, 750);
    });
})(d3);
