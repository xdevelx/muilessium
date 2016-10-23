import * as Utils from '../utils';
import { Component } from '../component';

export class Button extends Component {
    constructor(element, options) {
        super(element, options);
        
        Utils.console.log('creating mui-button for ' + element +
                      ' with options ' + JSON.stringify(options));
    }
}
