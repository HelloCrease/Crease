export class Line {
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
        const scalec = d3.scaleLinear()
            .domain([d3.min(this.value), d3.max(this.value)])
            .range(['blue', 'red']);
       // console.log(this.value);
        // console.log(scalec(-0.00328), scalec(0.00328));
        d3.csv('../assets/data/final_edge_info_avg_undirect.csv', data => {
            const number2show = 30;
               data =  this.filterData(data);
               const datah = findhundred(data, number2show);
                const opcaticyScale1 =  d3.scaleLinear()
                            .domain([d3.min(selectdata(datah, 0)), d3.max(selectdata(datah, 0))])
                            .range([0.1, 1]);
                const opcaticyScale2 =  d3.scaleLinear()
                            .domain([d3.min(selectdata(datah, 1)), d3.max(selectdata(datah, 1))])
                            .range([1, 0.1]);
                const  defs = this.svg.append('defs');

                const arrowMarker = defs.append('marker')
                            .attr('id', 'arrow')
                            .attr('markerUnits', 'strokeWidth')
                            .attr('markerWidth', '8')
                            .attr('markerHeight', '8')
                            .attr('viewBox', '0 0 12 12')
                            .attr('refX', '13')
                            .attr('refY', '6')
                            .attr('orient', 'auto');
                // tslint:disable-next-line:variable-name
                const arrow_path = 'M2,2 L10,6 L2,10 L6,6 L2,2';

                arrowMarker.append('path')
                                  .attr('d', arrow_path)
                                  .attr('fill', 'black');
                // console.log(d3.min(selectdata(datah, 1)), d3.max(selectdata(datah, 0)));
                const linestruct = mergeLine(this.data, data, datah);
                const line  = d3.line()
                                .x(d => xAxisScale(d.x))
                                .y(d => yAxisScale(d.y))
                                .curve(d3.curveBasis);
                const lines = this.svg.append('g')
                              .attr('class', 'lines');
                lines.selectAll('.line-group')
                     .data(linestruct).enter()
                     .append('g')
                     .attr('class', 'line-group')
                     .append('path')
                    /*  .attr('id', 'wavy') //Unique id of the path
                     .attr('d', 'M 10,90 Q 100,100 200,70') //SVG path
                     .style('fill', 'none')
                     .style('stroke', '#AAAAAA'); */
                     .attr('class', 'line')
                     .attr('d', d => line(d.values))
                     .attr('marker-end', 'url(#arrow)')
                    /*  .attr('d', d => {
                         const startx = xAxisScale(d.values[0].x);
                         const starty = yAxisScale(d.values[0].y);
                         const endx  = xAxisScale(d.values[1].x);
                         const endy = yAxisScale(d.values[1].y);
                         return ['M', startx, starty,
                        'A',
                        (startx - endx) / 2, ',' ,
                        (starty - endy) / 4, 0, 0, ',',
                        startx < endx ? 1 : 0, endx, ',', endy]
                        .join(' ');
                     }) */
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
                    })
                    .style('fill', 'none');
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
            // .attr('fill', d => scalec(d[3]) )
            // tslint:disable-next-line:only-arrow-functions
            .on('mouseover', function() { tooltip.style('display', null); })
            // tslint:disable-next-line:only-arrow-functions
            .on('mouseout', function() { tooltip.style('display', 'none'); })
            .on('mousemove', function(d) {
                const xPosition = d3.mouse(this)[0] - 15;
                const yPosition = d3.mouse(this)[1] - 25;
                tooltip.attr('transform', 'translate(' + xPosition + ',' + yPosition + ')');
                tooltip.select('text').text(d[2]);
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
                  // console.log(this.filterData(data));
                // console.log(data['columns']);
            });

        function  mergeLine(line, data, datah) {
            const datastruct = findDataPosition(data, datah);
            // console.log(datastruct);
            const linedata = structLinedata(datastruct, line);
            return linedata;
           // console.log(line, data);
        }
        function findhundred(data, number2show) {
            let result = [];
            
            console.log(data);
            data.forEach(ele => {
                result = result.concat(ele);
            });
            result.sort((a, b) => {
                return a - b;
            });
            const result2 = result.splice(result.length - 1 - number2show, number2show);
            const result1 = result.splice(0, number2show);
            return result1.concat(result2);
            // return result1;
           // return result;
        }
        function findDataPosition(data, hdata) {
          //  console.log(data, hdata);
            const result = [];
            for (let i = 0; i < 64; i++) {
                for (let j = 0; j < 64; j++) {
                    if (hdata.indexOf(data[i][j])  > -1) {
                        result.push({data: data[i][j], point1: i, point2: j});
                        result.push({data: data[i][j], point1: j, point2: i});
                    }
                }
            }
         //   console.log(result);
            return result;
            console.log(result);
        }
        function structLinedata(datastruct, line) {
           //  console.log(datastruct, line);
            const result = [];
            datastruct.forEach((ele, i) => {
                result[i] = {};
                result[i].data = ele.data;
                result[i].values = [
                       {x: line[ele.point1][0], y: line[ele.point1][1]},
                       findBeSA(line[ele.point1][0], line[ele.point1][1], line[ele.point2][0], line[ele.point2][1]),
                       {x: line[ele.point2][0], y: line[ele.point2][1]}
                ];
            });
         //   console.log(result);
            return result;
        }
        function findBeSA(x1, y1 , x2, y2) {
            const disk = (y2 - y1) / (x2 - x1);
            const k = -1 / disk;
            const x0 = (x2 + x1) / 2;
            const y0 = (y2 + y1) / 2;
            const b = y0 - k * x0;
            return findControl(x1, y1, x2, y2, k , b);

        }
        function findControl(x1, y1, x2, y2, k , b) {
            const cosa = (x2 - x1) / 2;
            const ye = (y2 - y1) / 2 + y1 - cosa;
            const xe = (ye - b) / k;
            const x0 = (x2 - x1) / 2 + x1;
            const y0 = (y2 - y1) / 2 + y1;
            return  {x: (x0 - xe) / 2 + xe, y : (y0 - ye) / 2 + ye};

        }
        // tslint:disable-next-line:variable-name
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
        const datatemp = data.columns;
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
}
