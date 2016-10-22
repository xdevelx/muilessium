import * as Utils from '../utils';
import { Component } from '../component';

export class Accordion extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log('creating mui-accordion for ' + element +
                        ' with options ' + JSON.stringify(options));

        this.dom = {};
        this.dom.items = element.getElementsByClassName('item');
        this.dom.titles = element.getElementsByClassName('title');

        let _this = this;

        [].forEach.call(this.dom.titles, function(title, index) {
            title.tabIndex = 1;

            title.addEventListener('click', function() {
                Utils.toggleClass(_this.dom.items[index], '-unfold');
            });

            title.addEventListener('keypress', function(e) {
                if (e.keyCode == 13) {
                    Utils.toggleClass(_this.dom.items[index], '-unfold');
                }
            });
        });
    }
}
