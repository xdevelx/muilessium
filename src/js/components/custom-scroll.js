// -----------------------------------------------------------------------------
// CUSTOM SCROLL COMPONENT
// -----------------------------------------------------------------------------


import { Component } from '../component';

import { setAttribute } from '../utils/attributes';
import { extend       } from '../utils/uncategorized';

import * as SimpleBar from 'simplebar';


export class CustomScroll extends Component {
    constructor(element, options) {
        super(element, options);

        setAttribute(this.element, 'data-simplebar', '');

        this.state = extend(this.state, {
            simplebar: new SimpleBar(element, {
                classNames: {
                    content: 'content',
                    scrollContent: 'scroll-content',
                    scrollbar: 'scrollbar',
                    track: 'track'
                }
            })
        });
    }
};

