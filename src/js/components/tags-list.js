import * as Utils from '../utils';
import { Component } from '../component';


export class TagsList extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.aria.setRole(this.element, 'navigation');
    }
}
