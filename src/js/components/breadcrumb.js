import * as Utils from '../utils';
import { Component } from '../component';


export class Breadcrumb extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.info(`creating breadcrumb for the ${element} with options ${JSON.stringify(options)}`);

        Utils.aria.setRole(element, 'navigation');

        this.state.initialized = true;
    }
} 
