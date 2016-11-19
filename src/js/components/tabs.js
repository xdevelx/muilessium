import * as Utils from '../utils';
import { Component } from '../component';


export class Tabs extends Component {
    constructor(element, options) {
        super(element, options);
        
        Utils.console.log('creating mui-tabs for ' + element +
                      ' with options ' + JSON.stringify(options));

        this.dom = Utils.extend(this.dom, {
            tabs: this.element.getElementsByClassName('tab'),
            labels: this.element.getElementsByClassName('label')
        });

        this.state = Utils.extend(this.state, {
            current: 0
        });

        Utils.addClass(this.dom.tabs[0],   '-active');
        Utils.addClass(this.dom.labels[0], '-active');

        Utils.makeChildElementsClickable(this.element, this.dom.labels, (index) => {
            Utils.removeClass(this.dom.labels[this.state.current], '-active');
            Utils.removeClass(this.dom.tabs[this.state.current],   '-active');

            Utils.addClass(this.dom.labels[index], '-active');
            Utils.addClass(this.dom.tabs[index],   '-active');

            _this.state.current = index;
        });

        this.state.initialized = true;
    }
}
