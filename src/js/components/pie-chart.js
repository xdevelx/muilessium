import * as Utils from '../utils';
import { Component } from '../component';


const template = {
    open:  '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">',
    piece: '<path class="piece -n{{num}}" fill="{{color}}" fill-opacity="1" d="M50,50 L{{start-x}},{{start-y}} A50,50 0 {{large-arc-flag}},1 {{end-x}}, {{end-y}} Z" data-value="{{value}}"></path>',
    close: '</svg>'
};


class Piece {
    constructor(data, offsetValue) {
        data = data.trim();

        this.value       = parseInt(data.match(/([0-9]+)$/i));
        this.color       = data.match(/(#[0-9A-Z]+)/i)[1];
        this.offsetValue = offsetValue;
    }

    render(totalValue, currentNumber) {
        let startX = Math.cos(2 * Math.PI * (this.offsetValue / totalValue)) * 50 + 50,
            startY = Math.sin(2 * Math.PI * (this.offsetValue / totalValue)) * 50 + 50,
            endX   = Math.cos(2 * Math.PI * ((this.value + this.offsetValue) / totalValue)) * 50 + 50,
            endY   = Math.sin(2 * Math.PI * ((this.value + this.offsetValue) / totalValue)) * 50 + 50,
            largeArcFlag = (this.value / totalValue > .5) ? 1 : 0;

        return template.piece
            .replace('{{num}}',            currentNumber)
            .replace('{{color}}',          this.color)
            .replace('{{start-x}}',        startX)
            .replace('{{start-y}}',        startY)
            .replace('{{end-x}}',          endX)
            .replace('{{end-y}}',          endY)
            .replace('{{value}}',          this.value)
            .replace('{{large-arc-flag}}', largeArcFlag);
    }
}


export class PieChart extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log('creating mui-pie-chart for ' + element +
                        ' with options ' + JSON.stringify(options));

        this.data       = element.getAttribute('data-chart').split(',');
        this.pieces     = [];
        this.totalValue = 0;

        for (let i = 0; i < this.data.length; i++) {
            let piece = new Piece(this.data[i], this.totalValue);

            this.totalValue += piece.value;
            this.pieces.push(piece);
        }

        let output = '';

        for (let i = 0; i < this.pieces.length; i++) {
            output += this.pieces[i].render(this.totalValue, i);
        }

        element.innerHTML = template.open + output + template.close;

        this.state.initialized = true;
    }
}
