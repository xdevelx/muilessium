import * as Utils from '../utils';
import { Component } from '../component';


export class Rating extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log('creating rating for ' + element +
                        ' with options ' + JSON.stringify(options));

        Utils.makeElementFocusable(element);

        this.state.initialized = true;
    }
}
