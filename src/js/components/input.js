import * as Utils from '../utils';
import { Component } from '../component';


export class Input extends Component {
    constructor(element, options) {
        super(element, options);
        
        Utils.console.log('creating mui-input for ' + element +
                      ' with options ' + JSON.stringify(options));

        this.dom = Utils.extend(this.dom, {
            input: element.getElementsByTagName('input')[0]
        });

        this.dom.input.addEventListener('focus', () => {
            Utils.addClass(this.element, '-focused');
        });

        this.dom.input.addEventListener('blur', () => {
            Utils.removeClass(this.element, '-focused');
        });

        this.dom.input.addEventListener('change', () => {
            Utils.console.log('input value changed to "' + this.value + '"');

            if (this.value == '') {
                Utils.removeClass(element, '-has-value');
            } else {
                Utils.addClass(element, '-has-value');
            }
        });

        this.state.initialized = true;
    }
}
