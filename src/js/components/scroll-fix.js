// -----------------------------------------------------------------------------
// SCROLL FIX
// -----------------------------------------------------------------------------
//
// Methods list:
//  - (default) initAria()
//  - (default) initEvents()
//
// -----------------------------------------------------------------------------


import Component from '../component';

import { EVENTS } from '../events';

import { aria        } from '../utils/aria';
import { addClass    } from '../utils/classes';
import { removeClass } from '../utils/classes';



export default class ScrollFix extends Component {
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
        EVENTS.addEventListener('scroll-start', () => {
            addClass(this.domCache.element, '-active');
        });

        EVENTS.addEventListener('scroll-end', () => {
            setTimeout(() => {
                removeClass(this.domCache.element, '-active');
            }, 300);
        });
    }
};

