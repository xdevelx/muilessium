import * as Utils from '../utils';
import { Component } from '../component';


export class Button extends Component {
    constructor(element, options) {
        super(element, options);
        
        if (!Utils.aria.getRole(this.element)) {
            // Sometimes it is useful to add role=link to the button, we should not override it here
            Utils.aria.setRole(this.element, 'button');
        }
    }
}
