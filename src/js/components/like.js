import * as Utils from '../utils';
import { component } from '../component';

export class like extends component {
    constructor(element, options) {
        super();
        
        Utils.console.log('creating mui-like for ' + element +
                          ' with options ' + JSON.stringify(options));

        element.addEventListener('click', function() {
            Utils.console.log('like button clicked');
            Utils.toggleClass(element, '-liked');
        });
    }
}