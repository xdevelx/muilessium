import * as Utils from '../utils';
import { Component } from '../component';

export class Textarea extends Component {
    constructor(element, options) {
        super(element, options);
        
        Utils.console.log('creating mui-textarea for ' + element +
                          ' with options ' + JSON.stringify(options));

        element.getElementsByTagName('textarea')[0].addEventListener('change', function() {
            Utils.console.log('textarea value changed to "' + this.value + '"');

            if (this.value == '') {
                Utils.removeClass(element, '-has-value');
            } else {
                Utils.addClass(element, '-has-value');
            }
        });

        this.state.initialized = true;
    }
}
