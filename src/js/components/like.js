import * as Utils from '../utils';
import { Component } from '../component';


export class Like extends Component {
    constructor(element, options) {
        Utils.console.log('creating mui-like for ' + element +
                          ' with options ' + Utils.stringify(options));
        
        super(element, options);

        Utils.makeElementClickable(this.element, () => {
            Utils.toggleClass(this.element, '-liked');
        });

        this.state.initialized = true;
    }
}
