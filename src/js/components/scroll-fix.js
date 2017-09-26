// -----------------------------------------------------------------------------
// SCROLL FIX
// -----------------------------------------------------------------------------
// Methods list:
//  - (default) initAria()
//  - (default) initEvents()


import { Component } from '../component';

import { aria        } from '../utils/aria';
import { addClass    } from '../utils/classes';
import { removeClass } from '../utils/classes';



export class ScrollFix extends Component {
    constructor(element, options) {
        super(element, options);
        
        this.initAria();
        this.initEvents();
    }

    initAria() {
        aria.setRole(this.domCache.element, 'presentation');

        return this;
    }

    initEvents() {
        window.Muilessium.Events.addEventListener('scroll-start', () => {
            addClass(this.domCache.element, '-active');
        });

        window.Muilessium.Events.addEventListener('scroll-end', () => {
            setTimeout(() => {
                removeClass(this.domCache.element, '-active');
            }, 300);
        });
    }
};

