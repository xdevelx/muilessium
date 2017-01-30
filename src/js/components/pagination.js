import { Component } from '../component';

import { aria } from '../utils/aria';



export class Pagination extends Component {
    constructor(element, options) {
        super(element, options);
 
        aria.setRole(this.element, 'navigation');
    }
};

