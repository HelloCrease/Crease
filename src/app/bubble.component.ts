
export class Bubble {
    target: HTMLElement;
    name;
    data;
    value;
    flag;
    line;
    lineStruct;
    svgWidth = 580;
    svgHeight = 500;
    margin = {
        top: 100,
        bottom: 50,
        left: 100,
        right: 100
    };
    svg;
    tooltip;
    width = this.svgWidth - this.margin.left - this.margin.right;
    height = this.svgHeight - this.margin.top - this.margin.bottom;
    constructor(target: HTMLElement,
                name, data, value) {
        this.target = target;
        this.name = name;
        this.data = data;
        this.value = value;
    }
    render() {
        console.log(this.value);
        this.data = this.concatNameData(this.name, this.data, this.value);
      //  this.lineStruct = this.mergeLine(this.line, this.data);
        this.svg = d3.select(this.target).append('svg')
            .attr('width', this.svgWidth)
            .attr('height', this.svgHeight)
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
        const xAxisScale = d3.scaleLinear()
            .domain([d3.min(this.data.map(d => d[0])), d3.max(this.data.map(d => d[0]))])
            .range([0, this.width]);
        const yAxisScale = d3.scaleLinear()
            .rangeRound([this.height, 0])
            .domain([d3.min(this.data.map(d => d[1])), d3.max(this.data.map(d => d[1]))]);
        // create axis objects
        const xAxis = d3.axisBottom(xAxisScale);
        const yAxis = d3.axisLeft(yAxisScale);
        const gX = this.svg.append('g')
            .attr('class' , 'axis1')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(xAxis);
        const gY = this.svg.append('g')
            .attr('class', 'axis2')
            .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
            .call(yAxis);
        const scalec1 = d3.scaleLinear()
            .domain([d3.min(this.getvalue(this.value, 0)), d3.max(this.getvalue(this.value, 0))])
            .range(['white', 'red']);
        const scalec2 = d3.scaleLinear()
            .domain([d3.min(this.getvalue(this.value, 1)), d3.max(this.getvalue(this.value, 1))])
            .range(['blue', 'white']);
        console.log(this.data);
        const circles = this.svg
            .selectAll('circle')
            .data(this.data)
            .enter()
            .append('circle')
            .attr('class', 'non_brushed')
            .attr('cx', (d) => {
                return xAxisScale(d[0]); })
            .attr('cy', (d) => {
                return yAxisScale(d[1]); })
            .attr('r', (d) => {
                return 3;
            })
            .attr('fill', d => {
                if (d[3] > 0) {
                    return scalec1(d[3]);
                } else {
                    return scalec2(d[3]);
                }
            })
            .on('mouseover', function() { tooltip.style('display', null); })
            .on('mouseout', function() { tooltip.style('display', 'none'); })
            .on('mousemove', function(d) {
                console.log(d);
                const xPosition = d3.mouse(this)[0] - 15;
                const yPosition = d3.mouse(this)[1] - 25;
                tooltip.attr('transform', 'translate(' + xPosition + ',' + yPosition + ')');
                tooltip.select('text').text(d[2] + ': ' + d[3]);
            });
         const tooltip = this.svg.append('g')
            .attr('class', 'tooltip')
            .style('display', 'none');
          tooltip.append('circle')
            .attr('width', 30)
            .attr('height', 20)
            .attr('fill', 'white')
            .style('opacity', 0.5);
          tooltip.append('text')
            .attr('x', 15)
            .attr('dy', '1.2em')
            .style('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold');
       // console.log(this.value);
        // console.log(scalec(-0.00328), scalec(0.00328));
          /* d3.csv('../assets/data/adj_array_avg.csv', data => {
                data =  this.filterData(data);
                const datah = findhundred(data);
                const opcaticyScale1 =  d3.scaleLinear()
                            .domain([d3.min(selectdata(datah, 0)), d3.max(selectdata(datah, 0))])
                            .range([0.1, 1]);
                const opcaticyScale2 =  d3.scaleLinear()
                            .domain([d3.min(selectdata(datah, 1)), d3.max(selectdata(datah, 1))])
                            .range([1, 0.1]);
                // console.log(d3.min(selectdata(datah, 1)), d3.max(selectdata(datah, 0)));
                const linestruct = mergeLine(this.data, data, datah);
                const line  = d3.line()
                                .x(d => xAxisScale(d.x))
                                .y(d => yAxisScale(d.y));
                const lines = this.svg.append('g')
                              .attr('class', 'lines');
                lines.selectAll('.line-group')
                     .data(linestruct).enter()
                     .append('g')
                     .attr('class', 'line-group')
                     .append('path')
                    .attr('class', 'line')
                    .attr('d', d => line(d.values))
                    .style('stroke', (d) => {
                        if (d.data < 0) {
                            return 'blue';
                        } else {
                            return 'red';
                        }
                    })
                    .style('opacity',  d => {
                        if (d.data > 0) {
                            return opcaticyScale1(d.data);
                        } else {
                           // console.log(opcaticyScale2(d.data));
                            return opcaticyScale2(d.data);
                        }
                    });
                  // console.log(this.filterData(data));
                // console.log(data['columns']);
            }); */

        function  mergeLine(line, data, datah) {
            const datastruct = findDataPosition(data, datah);
            // console.log(datastruct);
            const linedata = structLinedata(datastruct, line);
            return linedata;
           // console.log(line, data);
        }
        function findhundred(data) {
            let result = [];
            data.forEach(ele => {
                result = result.concat(ele);
            });
            // console.log(result);
            const result1 = result.sort().reverse().splice(0, 205);
            const result2 = result.sort().reverse().splice(1351, 205);
            console.log(result1.concat(result2));
            return result1.concat(result2);
        }
        function findDataPosition(data, hdata) {
          //  console.log(data, hdata);
            const result = [];
            for (let i = 0; i < 64; i++) {
                for (let j = 0; j < 64; j++) {
                    if (hdata.indexOf(data[i][j])  > -1) {
                        result.push({data: data[i][j], point1: i, point2: j});
                    }
                }
            }
            return result;
            console.log(result);
        }
        function structLinedata(datastruct, line) {
            // console.log(datastruct, line);
            const result = [];
            datastruct.forEach((ele, i) => {
                result[i] = {};
                result[i]['data'] = ele.data;
                result[i]['values'] = [
                       {x: line[ele.point1][0], y: line[ele.point1][1]},
                       {x: line[ele.point2][0], y: line[ele.point2][1]}
                ];
            });
            return result;
            console.log(result);
        }
        function selectdata(data, number) {
           const result = [];
           if (number === 0) {
               data.forEach(ele => {
                   if (ele > 0) {
                       result.push(ele);
                   }
               });
           } else {
               data.forEach(ele => {
                    if (ele < 0) {
                        result.push(ele);
                    }
               });
           }
           return result;
        }
    }

    concatNameData(name, data, value) {
       // console.log(value);

        const result = [];
        data.forEach((ele, i) => {
            result[i] = ele;
            result[i][2] = name[i];
            result[i][3] = value[i];
        });
        // console.log(result);
        return result;
    }
    filterData(data) {
        const datatemp = data['columns'];
        data = data.splice(0, 63);
        const arr = new Array(64);
        data.forEach((ele, i) => {
            arr[i] = new Array(63);
            let count  = 0;
            for (const elename in ele) {
                if (ele.hasOwnProperty(elename)) {
                arr[i][count] = ele[elename];
                count ++;
            }
        }
        });
        arr[63] = datatemp;
        for (let i = 0; i < 64; i++) {
            for (let j = 0 ; j < 64; j++) {
                let value = parseFloat(arr[i][j].split('e')[0]);
                const power = arr[i][j].split('e')[1];
                if (power === '-01') {
                    value = value * 0.1;
                } else if (power === '-02') {
                    value = value * 0.01;
                } else if (power === '-03') {
                    value = value * 0.001;
                } else if (power === '-04') {
                    value = value * 0.0001;
                } else if (power === '-05') {
                    value = value * 0.00001;
                }
                arr[i][j] = value;
            }
        }
        return arr;
    }

    getvalue(value, number) {
        const result = [];
        if (number === 0) {
            value.forEach(ele => {
                if (ele >= 0) {
                    result.push(ele);
                }
            });
        } else {
            value.forEach(ele => {
                if (ele < 0) {
                    result.push(ele);
                }
            });
        }
        return result;
    }
}
