import * as Utils from '../utils';
import { Component } from '../component';


export class Pagination extends Component {
    constructor(element, options) {
        super(element, options);
 
        Utils.console.log(`creating button for the <${element.nodeName}> with options ${JSON.stringify(options)}`);

        this.initAria();

        Utils.console.ok('pagination has been created');
    }


    initAria() {
        Utils.aria.setRole(this.element, 'navigation');

        return this;
    }
}
