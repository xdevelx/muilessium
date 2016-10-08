import * as Utils from '../utils';
import { Component } from '../component';


let template = {
    open:  '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">',
    piece: '<path class="segment -n{{num}}" fill="{{color}}" fill-opacity="1" d="M50,50 L{{start-x}},{{start-y}} A50,50 0 0,1 {{end-x}}, {{end-y}} Z" data-value="{{value}}"></path>',
    close: '</svg>'
};


class Piece {
    constructor(data, offset) {
        data = data.trim();

        this.number = parseInt(data.match(/([0-9]+)$/i));
        this.color  = data.match(/(#[0-9A-Z]+)/i)[1];
        this.offset = offset;
    }

    render(total, num) {
        let startX = Math.cos(2 * Math.PI * (this.offset / total)) * 50 + 50,
            startY = Math.sin(2 * Math.PI * (this.offset / total)) * 50 + 50,
            endX   = Math.cos(2 * Math.PI * ((this.number + this.offset) / total)) * 50 + 50,
            endY   = Math.sin(2 * Math.PI * ((this.number + this.offset) / total)) * 50 + 50;

        return template.piece
            .replace('{{num}}',     num)
            .replace('{{color}}',   this.color)
            .replace('{{start-x}}', startX)
            .replace('{{start-y}}', startY)
            .replace('{{end-x}}',   endX)
            .replace('{{end-y}}',   endY)
            .replace('{{value}}',   this.number);
    }
}


export class PieChart extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log('creating mui-pie-chart for ' + element +
                        ' with options ' + JSON.stringify(options));

        this.data = element.getAttribute('data-pie').split(',');
        this.pieces = [];
        this.total = 0;

        for (let i = 0; i < this.data.length; i++) {
            let piece = new Piece(this.data[i], this.total);

            this.total += piece.number;
            this.pieces.push(piece);
        }

        let output = '';

        for (let i = 0; i < this.pieces.length; i++) {
            output += this.pieces[i].render(this.total, i);
        }

        element.innerHTML = template.open + output + template.close;
    }
}
