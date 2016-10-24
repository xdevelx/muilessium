import * as Utils from '../utils';
import { Component } from '../component';

let template = {
    open: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">',
    bar: '<rect class="bar -n{{num}}" x="{{x}}" y="{{y}}" height="{{height}}" width="{{width}}" fill="{{color}}" fill-opacity="1" data-value="{{value}}" />',
    close: '</svg>'
};


class Bar {
    constructor(data) {
        data = data.trim();

        this.value = parseInt(data.match(/([0-9]+)$/i));
        this.color = data.match(/(#[0-9A-Z]+)/i)[1];
    }

    render(totalPieces, currentNumber, maxValue) {
        let x      = 0,
            y      = currentNumber * 100 / totalPieces,
            height = 100 / totalPieces,
            width  = this.value * 100 / maxValue;

        return template.bar
            .replace('{{num}}',    currentNumber)
            .replace('{{color}}',  this.color)
            .replace('{{value}}',  this.value)
            .replace('{{x}}',      x)
            .replace('{{y}}',      y)
            .replace('{{height}}', height)
            .replace('{{width}}',  width);
    }
}


export class BarChart extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log('creating mui-bar-chart for ' + element +
                        ' with options ' + JSON.stringify(options));

        this.data     = element.getAttribute('data-chart').split(',');
        this.bars     = [];
        this.maxValue = 0;

        for (let i = 0; i < this.data.length; i++) {
            let bar = new Bar(this.data[i]);

            if (bar.value > this.maxValue) {
                this.maxValue = bar.value;
            }

            this.bars.push(bar);
        }

        let output = '';

        for (let i = 0; i < this.bars.length; i++) {
            output += this.bars[i].render(this.bars.length, i, this.maxValue);
        }

        element.innerHTML = template.open + output + template.close;

        this.state.initialized = true;
    }
}
