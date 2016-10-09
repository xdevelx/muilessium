import * as Utils from '../utils';
import { Component } from '../component';

let template = {
    open: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><line stroke-width="1" stroke="#777" x1="0" x2="100" y1="0" y2="0"></line><line stroke-width="1" stroke="#777" x1="0" x2="0" y1="0" y2="100"></line>',
    line: '<polyline fill="none" stroke-width="1" stroke="{{color}}" points="{{points}}"></polyline>',
    close: '</svg>'
};

class Line {
    constructor(data) {
        data = data.trim();

        this.color = data.match(/(#[0-9A-F]+)/i)[1];
        this.values = data.replace(this.color, '').trim().split(' ');
    }

    render(maxValue) {
        let step = 100 / this.values.length,
            points = '';

        this.values.forEach(function(value, i) {
            let currentPoint = i * step + ',' + value * 100 / maxValue + ' ';

            points += currentPoint;
        });

        return template.line
            .replace('{{color}}',  this.color)
            .replace('{{points}}', points);
    }
}


export class LineChart extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log('creating mui-line-chart for ' + element +
                        ' with options ' + JSON.stringify(options));

        this.data = element.getAttribute('data-chart').split(',');
        this.lines = [];
        this.maxValue = 0;

        for (let i = 0; i < this.data.length; i++) {
            let line = new Line(this.data[i]);

            for (let j = 0; j < line.values.length; j++) {
                if (+line.values[j] > this.maxValue) {
                    this.maxValue = +line.values[j];
                }
            }

            this.lines.push(line);
        }

        let output = '';

        for (let i = 0; i < this.lines.length; i++) {
            output += this.lines[i].render(this.maxValue);
        }

        element.innerHTML = template.open + output + template.close;
    }
}

