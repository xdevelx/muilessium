import { Component } from '../component';

import {
    aria
} from '../utils/aria';



export class Button extends Component {
    constructor(element, options) {
        super(element, options);
        
        if (!aria.getRole(this.element)) {
            /* Sometimes it is useful to add role=link to the button, we should not override it here */
            aria.setRole(this.element, 'button');
        }
    }
};

