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

            width = 1085,
            height = 900,
            drawWidth = width - margin.left - margin.right,
            drawHeight = height - margin.top - margin.bottom,
            measure = 'General government expenditure'; // variable to visualize

          
        var svg = d3.select('#vis')
            .append("div")
            .attr('height', height)
            .attr('width', width)
            .style("left", margin.left + "px")
            .style("top", margin.top + "px");
        

        var nestedData = d3.nest()
            .entries(data);

        // Defining a hierarchy for data
        var root = d3.hierarchy({
            values: nestedData
        }, function(d) {
            return d.values;
        })

        // Creating treemap function to compute data structure layout

        var treemap = d3.treemap()
        .size([width,height])
        .round(true)
        .tile(d3.treemapResquarify)
        .padding(0);

        // Setting ordinal scale for colors
        var colorScale = d3.scaleOrdinal().range(d3.schemeCategory10);
        

        // function to bind data and position elements
        var draw = function() {
            
            // Redefining value to visualize 
            measure_val = root.sum(function(d) {
                return +d[measure];
            });

            // Building treemap
            treemap(root);

            // Binding data to nodes
            var nodes = svg.selectAll(".node").data(root.leaves());

            // Entering and appending elements as well as styling them
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

        draw();

        // Updating based on button clicked to showcase subset of data
        $("input").on('change', function() {
            //setting measure based on button clicked
            measure = $(this).val();

            // draw elements
            draw();
        });
    });
});