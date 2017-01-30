import { Component } from '../component';

import { aria } from '../utils/aria';



export class Breadcrumb extends Component {
    constructor(element, options) {
        super(element, options);

        aria.setRole(this.element, 'navigation');
    }
};
 
