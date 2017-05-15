// -----------------------------------------------------------------------------
// BREADCRUMB COMPONENT
// -----------------------------------------------------------------------------
// Methods list:
//  - (default) initAria()


import { Component } from '../component';

import { aria } from '../utils/aria';


export class Breadcrumb extends Component {
    constructor(element, options) {
        super(element, options);

        this.initAria();
    }

    initAria() {
        aria.setRole(this.domCache.element, 'navigation');

        return this;
    }
};
 
