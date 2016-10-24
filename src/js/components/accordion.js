import * as Utils from '../utils';
import { Component } from '../component';

export class Accordion extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log('creating mui-accordion for ' + element +
                        ' with options ' + JSON.stringify(options));

        this.dom = Object.assign(this.dom, {
            items:  element.getElementsByClassName('item'),
            titles: element.getElementsByClassName('title')
        });

        let _this = this;

        Utils.makeChildElementsClickable(this.element, this.dom.titles, function(index) {
            Utils.toggleClass(_this.dom.items[index], '-unfold');
        });

        this.state.initialized = true;
    }
}
