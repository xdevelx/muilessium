import * as Utils from '../utils';
import { Component } from '../component';


let template = {
    open: '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><circle id="graph" r="15.9154943092" cx="16" cy="16" transform="rotate(-90 16 16)" /><mask id="clip"><use xlink:href="#graph" fill="#FFF" /></mask></defs><g class="graph" mask="url(#clip)" stroke-width="32">',
    piece: '<use class="graph-percent -n{{num}}" xlink:href="#graph" fill="none" stroke="{{color}}" stroke-dasharray="0 {{offset}} {{percent}} 100" />',
    close: '</g></svg>'
};


class Piece {
    constructor(data, offset) {
        data = data.trim();

        this.number = parseInt(data.match(/([0-9]+)$/i));
        this.color  = data.match(/(#[0-9A-Z]+)/i)[1];
        this.offset = offset;
    }

    render(total, num) {
        return template.piece
            .replace('{{num}}',     num)
            .replace('{{color}}',   this.color)
            .replace('{{offset}}',  (this.offset / total) * 100)
            .replace('{{percent}}', (this.number / total) * 100);
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
