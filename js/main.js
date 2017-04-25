$(function() {
    // Read in your data. On success, run the rest of your code
    d3.csv('data/Global_Health_Spending.csv', function(error, data) {

        // Setting defaults
        var margin = {
                top: 40,
                right: 10,
                bottom: 10,
                left: 10
            },
            //diameter = 960,
            //format = d3.format(",d"),
            width = 1200,
            height = 900,
            drawWidth = width - margin.left - margin.right,
            drawHeight = height - margin.top - margin.bottom,
            measure = 'General government expenditure'; // variable to visualize

          
        // Append a wrapper div for the chart
        var svg = d3.select('#vis')
            .append("div")
            .attr('height', height)
            .attr('width', width)
            .style("left", margin.left + "px")
            .style("top", margin.top + "px");
        

        /* ********************************** Create hierarchical data structure & treemap function  ********************************** */

        // Nest your data *by region* using d3.nest()
        var nestedData = d3.nest()
            .entries(data);

        // Define a hierarchy for your data
        var root = d3.hierarchy({
            values: nestedData
        }, function(d) {
            return d.values;
        })

        // Create a *treemap function* that will compute your layout given your data structure

        var treemap = d3.treemap()
        .size([width,height])
        .round(true)
        .tile(d3.treemapResquarify)
        .padding(0);

        /* ********************************** Create an ordinal color scale  ********************************** */

        // Get list of regions for colors
        var regions = nestedData.map(function(d) {
            return d.key;
        });

        // Set an ordinal scale for colors
        var colorScale = d3.scaleOrdinal().range(d3.schemeCategory10);

        /* ********************************** Write a function to perform the data-join  ********************************** */
        

        // Write your `draw` function to bind data, and position elements
        var draw = function() {
            // Redefine which value you want to visualize in your data by using the `.sum()` method
            measure_val = root.sum(function(d) {
                return +d[measure];
            });

            // (Re)build your treemap data structure by passing your `root` to your `treemap` function
            treemap(root);

            // Bind your data to a selection of elements with class node
            // The data that you want to join is array of elements returned by `root.leaves()`
            
            
            var nodes = svg.selectAll(".node").data(root.leaves());

            // Enter and append elements, then position them using the appropriate *styles*
            nodes.enter()
                .append("div")
                .text(function(d) {
                    return d.data.Location.substring(0, width).toUpperCase(); 
                })
                .merge(nodes)
                .attr('class', 'node')
                .transition().duration(1500)
                .style("left", function(d, i) {
                    return d.x0 + "px";
                })
                .style("top", function(d) {
                    return d.y0 + "px";
                })
                .style('width', function(d) {
                    return d.x1 - d.x0 + 'px';
                })
                .style("height", function(d) {
                    return d.y1 - d.y0 + "px";
                })
                .style("background", function(d, i) {
                    return colorScale(d.data.Location);
                });

        };

        // Call your draw function
        draw();

        // Listen to change events on the input elements
        $("input").on('change', function() {
            // Set your measure variable to the value (which is used in the draw funciton)
            measure = $(this).val();

            // Draw your elements
            draw();
        });
    });
});