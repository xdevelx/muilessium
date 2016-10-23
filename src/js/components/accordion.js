import * as Utils from '../utils';
import { Component } from '../component';

export class Accordion extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log('creating mui-accordion for ' + element +
                        ' with options ' + JSON.stringify(options));

        this.dom = {
            items:  element.getElementsByClassName('item'),
            titles: element.getElementsByClassName('title')
        };

        let _this = this;

        [].forEach.call(this.dom.titles, function(title, index) {
            Utils.makeElementClickable(title, function() {
                Utils.toggleClass(_this.dom.items[index], '-unfold');
            });
        });
    }
}
