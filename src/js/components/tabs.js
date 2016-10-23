import * as Utils from '../utils';
import { Component } from '../component';

export class Tabs extends Component {
    constructor(element, options) {
        super(element, options);
        
        Utils.console.log('creating mui-tabs for ' + element +
                      ' with options ' + JSON.stringify(options));

        this.dom = {
            tabs: this.element.getElementsByClassName('tab'),
            labels: this.element.getElementsByClassName('label')
        };

        this.state = {
            current: 0
        };

        Utils.addClass(this.dom.tabs[0], '-active');
        Utils.addClass(this.dom.labels[0], '-active');

        let _this = this;

        Utils.makeChildElementsClickable(this.element, this.dom.labels, function(index) {
            Utils.removeClass(_this.dom.labels[_this.state.current], '-active');
            Utils.removeClass(_this.dom.tabs[_this.state.current], '-active');

            Utils.addClass(_this.dom.labels[index], '-active');
            Utils.addClass(_this.dom.tabs[index], '-active');

            _this.state.current = index;
        });
    }
}
