import * as Utils from '../utils';
import { Component } from '../component';

export class Input extends Component {
    constructor(element, options) {
        super(element, options);
        
        Utils.console.log('creating mui-input for ' + element +
                      ' with options ' + JSON.stringify(options));


        this.dom = {
            input: element.getElementsByTagName('input')[0]
        };

        let _this = this;

        this.dom.input.addEventListener('focus', function() {
            Utils.addClass(_this.element, '-focused');
        });

        this.dom.input.addEventListener('blur', function() {
            Utils.removeClass(_this.element, '-focused');
        });

        this.dom.input.addEventListener('change', function() {
            Utils.console.log('input value changed to "' + this.value + '"');

            if (this.value == '') {
                Utils.removeClass(element, '-has-value');
            } else {
                Utils.addClass(element, '-has-value');
            }
        });
    }
}
