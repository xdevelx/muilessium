import * as Utils from '../utils';
import { component } from '../component';

export class input extends component {
    constructor(element, options) {
        super(element, options);
        
        Utils.console.log('creating mui-input for ' + element +
                      ' with options ' + JSON.stringify(options));

        element.getElementsByTagName('input')[0].addEventListener('change', function() {
            Utils.console.log('input value changed to "' + this.value + '"');

            if (this.value == '') {
                Utils.removeClass(element, '-has-value');
            } else {
                Utils.addClass(element, '-has-value');
            }
        });
    }
}