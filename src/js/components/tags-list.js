import * as Utils from '../utils';
import { Component } from '../component';


export class TagsList extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log(`creating tags-list for the <${element.nodeName}> with options ${JSON.stringify(options)}`);

        this.initAria();

        Utils.console.ok('tags-list has been created');
    }


    initAria() {
        Utils.aria.setRole(this.element, 'navigation');

        return this;
    }
}
