import * as Utils from '../utils';
import { Component } from '../component';


export class Pagination extends Component {
    constructor(element, options) {
        super(element, options);
 
        Utils.console.info(`creating button for the ${element} with options ${JSON.stringify(options)}`);

        this.initAria();
    }


    initAria() {
        Utils.aria.setRole(this.element, 'navigation');

        return this;
    }
}
