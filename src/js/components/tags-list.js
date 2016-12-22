import * as Utils from '../utils';
import { Component } from '../component';


export class TagsList extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.info(`creating tags-list for the ${element} with options ${JSON.stringify(options)}`);

        Utils.aria.setRole(this.element, 'navigation');

        this.state.initialized = true;
    }
}
