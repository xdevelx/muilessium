import * as Utils from '../utils';
import { Component } from '../component';


const template = {
    open:  '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">',
    indicator: '<rect class="indicator" x="0" y="0" height="100" width="{{width}}" />',
    close: '</svg>'
};


export class ProgressBar extends Component {
    constructor(element, options) {
        super(element, options);
        
        Utils.console.log('creating mui-progress-bar for ' + element +
                      ' with options ' + JSON.stringify(options));

        this.state = Utils.extend(this.state, {
            percents: this.element.getAttribute('data-percents')
        });

        let output = template.indicator
                        .replace('{{width}}', this.state.percents);

        this.element.innerHTML = template.open + output + template.close;

        this.dom = Utils.extend(this.dom, {
            indicator: element.getElementsByClassName('indicator')[0]
        });

        this.state.initialized = true;
    }


    update(percents) {
        if (percents) {
            this.state.percents = percents;
            this.element.setAttribute('data-percents', percents);
        } else {
            this.state.percents = this.element.getAttribute('data-percents');
        }

        this.dom.indicator.setAttribute('width', this.state.percents);
 
        return this; 
    }
}
