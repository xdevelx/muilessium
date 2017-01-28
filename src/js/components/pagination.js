import { aria } from '../utils/aria';

import { Component } from '../component';


export class Pagination extends Component {
    constructor(element, options) {
        super(element, options);
 
        aria.setRole(this.element, 'navigation');
    }
};

