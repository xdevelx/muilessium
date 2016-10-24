import * as Utils from '../utils';
import { Component } from '../component';

export class Like extends Component {
    constructor(element, options) {
        Utils.console.log('creating mui-like for ' + element +
                          ' with options ' + Utils.stringify(options));
        
        super(element, options);

        let _this = this;
        
        Utils.makeElementClickable(this.element, function() {
            Utils.toggleClass(_this.element, '-liked');
        });

        this.state.initialized = true;
    }
  
    clickEventListener() {
        Utils.console.log('like button clicked');
        Utils.toggleClass(this.element, '-liked');
    }
}
