import * as Utils from '../utils';
import { component } from '../component';

export class like extends component {
    constructor(element, options) {
        Utils.console.log('creating mui-like for ' + element +
                          ' with options ' + Utils.stringify(options));
        
        super(element, options);
        
        this.addEventListener('click', this.clickEventListener.bind(this));
    }
  
    clickEventListener() {
        Utils.console.log('like button clicked');
        Utils.toggleClass(this.element, '-liked');
    }
}