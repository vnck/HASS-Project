const markerDefaultColor = "#9880C2";
const markerSelectedColor = "#9880C2";
const markerFadedColor = "#E4DDEE";
const markerPersonalColor = "#5598E2";

const labelDefaultColor = "#331A5B";
const labelSelectedColor = "#331A5B";
const labelFadedColor = "#E4DDEE";
const labelPersonalColor = "#093B72";

const annotationDefaultColor = "#E4DDEE";
const annotationPersonalColor = "#CADFF7";

const backgroundColor = 'transparent'

const title = "Timeline of TraceTogether Headlines";
const subtitle = "and Facebook Reactions."

const labelSeparation = 12;

const timeParser = d3.timeParse("%Y-%m-%d %I:%M%p");

window.onloadFuncs.push(() => {

    d3.json('data/tracetogether_reactions.json').then((data)=> {
        console.log(data);
        data.forEach(d => {d.date = timeParser(d.date + " 06:00AM")});

        const width = d3.select('#timeline-wrapper').node().getBoundingClientRect().width;

        const params = {};
    
        params["smallScreenSize"] = 768;
        params["mediumScreenSize"] = 940;
        
        params["svg"] = {
        "width":  width,
        "height": data.length * 24 // Roughly relative to number of data points but doesn't factor in the full timeline scale such as clustering or spread out data
        };
        
        params["margin"] = {
        "top":    40,
        "right":  96,
        "bottom": 50,
        "left":   440,
        "axisLeft": 50,
        };
        
        params["plot"] = {
        "x":      params["margin"]["left"],
        "y":      params["margin"]["top"],
        "width":  params["svg"]["width"]  - params["margin"]["left"] - params["margin"]["right"],
        "height": params["svg"]["height"] - params["margin"]["top"]  - params["margin"]["bottom"]
        };
        
        params["smallScreenMargin"] = {
        "top":    60,
        "right":  8,
        "bottom": 192,
        "left":   8,
        "axisLeft": 144,
        };
    
        params["smallScreenPlot"] = {
        "x":      params["margin"]["left"],
        "y":      params["margin"]["top"],
        "width":  params["svg"]["width"]  - params["margin"]["left"] - params["margin"]["right"],
        "height": params["svg"]["height"] - params["margin"]["top"]  - params["margin"]["bottom"]
        };
    
        params["marker"] = {
        "radius": 4
        }
        
        params["date"] = {
        "offset": params["marker"]["radius"] * 2
        }
    
        params["event"] = {
        "offset": params["marker"]["radius"] * 6
        }
    
        params["smallScreenEvent"] = {
        "offset": params["marker"]["radius"] * 4
        }

        const y = d3.scaleUtc()
        .domain(d3.extent(data, d => d.date))//.nice()
        .range([params.plot.y, params.plot.height]);

        const axis = width >= params.smallScreenSize ? 
        d3.axisRight(y)
            .tickPadding(-(params.margin.axisLeft)-10)
            .tickSizeOuter(0)
            .tickSizeInner(-(params.margin.axisLeft))
        :
        d3.axisRight(y)
            .tickPadding(-(params.smallScreenMargin.axisLeft))
            .tickSizeOuter(0)
            .tickSizeInner(-(params.smallScreenMargin.axisLeft))
            .tickFormat(d3.timeFormat('%b'));

        const halo = (text) => {
            text
                .style("text-anchor", "end")
            // text.clone(true)
            //     .each(function() { this.parentNode.insertBefore(this, this.previousSibling); })
            //     .attr("aria-hidden", "true")
            //     .attr("fill", "none")
            //     .attr("stroke", backgroundColor)
            //     .attr("stroke-width", 24)
            //     .attr("stroke-linecap", "round")
            //     .attr("stroke-linejoin", "round")
            //     .style("text-shadow", `-1px -1px 2px ${backgroundColor}, 1px 1px 2px ${backgroundColor}, -1px 1px 2px ${backgroundColor}, 1px -1px 2px ${backgroundColor}`);
        }

        const dodge = (positions, separation = 10, maxiter = 10, maxerror = 1e-1) => {
            positions = Array.from(positions);
            let n = positions.length;
            if (!positions.every(isFinite)) throw new Error("invalid position");
            if (!(n > 1)) return positions;
            let index = d3.range(positions.length);
            for (let iter = 0; iter < maxiter; ++iter) {
                index.sort((i, j) => d3.ascending(positions[i], positions[j]));
                let error = 0;
                for (let i = 1; i < n; ++i) {
                    let delta = positions[index[i]] - positions[index[i - 1]];
                    if (delta < separation) {
                    delta = (separation - delta) / 2;
                    error = Math.max(error, delta);
                    positions[index[i - 1]] -= delta;
                    positions[index[i]] += delta;
                    }
                }
                if (error < maxerror) break;
            }
            return positions;
          }

        const svg = d3.select('#timelineGraph')
            .attr("title", "Timeline of TraceTogether Headlines")
            .attr("id", "timeline")
            .attr('width', params.svg.width)
            .attr('height', params.svg.height)
        
        const chartBackground = svg.append("rect")
            .attr("id", "chart-background")
            .attr("fill", backgroundColor) // fallback for CSS
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", params.svg.width)
            .attr("height", params.svg.height);
        
        const plot = svg.append("g")
            .attr("id", "plot")
            .attr("transform", `translate(${width >= params.smallScreenSize ? params.plot.x : params.smallScreenMargin.left}, ${params.plot.y})`);
        
        const gy = plot.append("g")
            .attr("id", "y-axis")
            .attr("class", "axis")
            .call(axis)
            .attr("aria-hidden", "true")
            .call(g => g.selectAll(".tick text").call(halo));  

        const chartSubtitle = svg.append("g")
            .attr("class", "chart-subtitle")
            .append("text")
                .attr("text-anchor", "middle")
                .attr("x", width >= params.smallScreenSize ? params.margin.left : params.event.offset)
                .attr("y", 10)
                .attr("dy", "1.5em")
                .style("font-weight", "400")
                .style("font-size", "clamp(1rem, 2.5vw, 1.25rem)")
                .text("A Timeline of TraceTogether Headlines");

        // const annotations = plot.append("g")
        // .attr("class", "annotations")
        // .selectAll("g")
        // .data(lockdownData)
        // .join("g");

        // const annotationsLeftMargin = params.plot.x + 240 + 24;

        // annotations.append("line")
        //     .attr("aria-hidden", "true")
        //     .attr("stroke", annotationDefaultColor)
        //     .attr("stroke-width", 3)
        //     .attr("x1", annotationsLeftMargin)
        //     .attr("x2", annotationsLeftMargin)
        //     .attr("y1", d => y(d.startDate))
        //     .attr("y2", d => y(d.endDate));

        // annotations.append("text")
        //     .attr("x", annotationsLeftMargin + 24)
        //     .attr("y", d => y(d.startDate))
        //     .attr("dy", "0.7em")
        //     .style("font-size", 16)
        //     .style("font-weight", 600)
        //     .text(d => width >= params.mediumScreenSize ? d.name : '');

        // annotations.append("text")
        //     .attr("x", annotationsLeftMargin + 24)
        //     .attr("y", d => y(d.startDate))
        //     .attr("dy", "2.0em")
        //     .style("font-size", 16)
        //     .style("font-weight", 400)
        //     .text(d => width >= params.mediumScreenSize ? d3.timeFormat("%e %b")(d.startDate) + " – " + d3.timeFormat("%e %b")(d.endDate) : '');

        const markers = plot.append("g")
            .attr("class", "markers")
            .selectAll("circle")
            .data(data)
            .join("circle")
                .attr("transform", d => `translate(0, ${y(d.date)})`)
                .attr("aria-hidden", "true")
                .attr("fill", d => d.sharedOrPersonal === "Shared" ? markerDefaultColor : markerPersonalColor)
                .attr("stroke", d => d.sharedOrPersonal === "Shared" ? markerDefaultColor : markerPersonalColor)
                // .attr("stroke-width", 1)
                .attr("cx", 0.5)
                .attr("cy", (params.marker.radius / 2) + 0.5)
                .attr("r", params.marker.radius);

        const dodgedYValues = dodge(data.map(d => y(d.date)), labelSeparation);

        const eventLabels = plot.append("g")
            .attr("class", "eventLabels")
            .selectAll("text")
            .data(d => d3.zip(
                data,
                dodgedYValues,
            ))
            .join("text")
                .attr("class", "event-title")
                .style("font-weight", "400")
                .style("fill", ([d]) => d.sharedOrPersonal === "Shared" ? labelDefaultColor : labelPersonalColor)
                .attr("x", width >= params.smallScreenSize ? params.event.offset : params.smallScreenEvent.offset)
                .attr("y", ([, y]) => y)
                .attr("dy", "0.35em");

        eventLabels.append("tspan")
            .text(([d]) => d.title);

        eventLabels.append("tspan")
            .text(([d]) => ` ${d.eventDescription} ${d3.timeFormat("%A, %e %B")(d.date)}`)
                .attr("x", width);

        const tooltip = d3.select("#timeline-tooltip")
            .attr("class", "tooltip")
            .attr("aria-hidden", "true");

        const rangeY = dodgedYValues.map(x => x + params.plot.y);
        const rangeY0 = rangeY[0];
        const fuzzyTextHeightAdjustment = 16;

        svg.on("touchend mouseout", function(event) {
            markers
                .attr("fill", d => d.sharedOrPersonal === "Shared" ? markerDefaultColor : markerPersonalColor)
                .attr("stroke", d => d.sharedOrPersonal === "Shared" ? markerDefaultColor : markerPersonalColor);

            eventLabels
                .style("opacity", 1);
        });

        svg.on("touchmove mousemove", function(event) {
            const mouseY = d3.pointer(event,this)[1];
            const nearestEventY = rangeY.reduce((a, b) => Math.abs(b - mouseY) < Math.abs(a - mouseY) ? b : a);
            const dodgedIndex = rangeY.indexOf(nearestEventY);
            const dataEvent = data[dodgedIndex];
        
            if (mouseY >= rangeY0 - fuzzyTextHeightAdjustment) {
                console.log('hovered!');
        
                eventLabels
                    .filter((d, i) => i !== dodgedIndex)
                    .style("opacity", 0.3);
        
                eventLabels
                    .filter((d, i) => i === dodgedIndex)
                    .style("opacity", 1);
        
                markers
                    .filter((d, i) => i !== dodgedIndex)
                    .attr("fill", markerFadedColor)
                    .attr("stroke", markerFadedColor);
        
                markers
                    .filter((d, i) => i === dodgedIndex)
                        .attr("fill", d => d.sharedOrPersonal === "Shared" ? markerDefaultColor : markerPersonalColor)
                        .attr("stroke", d => d.sharedOrPersonal === "Shared" ? markerDefaultColor : markerPersonalColor)
                    .raise();
            
                tooltip.style("opacity", 1);
                tooltip.style("transform", `translate(${(width >= params.smallScreenSize ? params.plot.x + 8 : 0)}px, calc(-100% + ${nearestEventY}px))`);
                tooltip.select("#date")
                    .text(d3.timeFormat("%A, %e %B")(dataEvent.date));
                tooltip.select("#name")
                    .text(dataEvent.title);
                tooltip.select("#description")
                    .text(dataEvent.eventDescription);
            }
        });

        svg.on("touchend mouseleave", () => tooltip.style("opacity", 0));

    })
});
