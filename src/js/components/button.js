import * as Utils from '../utils';
import { component } from '../component';

export class button extends component {
    constructor(element, options) {
        super(element, options);
        
        Utils.console.log('creating mui-button for ' + element +
                      ' with options ' + JSON.stringify(options));
    }
}