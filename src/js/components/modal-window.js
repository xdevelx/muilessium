import { Component } from '../component';

import * as TouchScreen from '../controls/touchscreen';

import {
    aria
} from '../utils/aria';

import {
    addClass,
    removeClass
} from '../utils/classes';

import {
    makeElementClickable
} from '../utils/focus-and-click';

import {
    extend,
    forEach
} from '../utils/uncategorized';



export class ModalWindow extends Component {
    constructor(element, options) {
        super(element, options);

        this.dom = extend(this.dom, {
            openers:     document.querySelectorAll(`[data-modal-opener=${this.element.getAttribute('id')}]`),
            modalWindow: this.element.querySelector('.window'),
            closeIcon:   this.element.querySelector('.close-icon'),
            shadow:      this.element.querySelector('.mui-shadow-toggle')
        });

        this.state = extend(this.state, {
            visible: false
        });

        this.initAria();
        this.initControls();
    }


    initAria() {
        aria.set(this.element, 'hidden', true);
        aria.set(this.dom.shadow,  'hidden', true);

        return this;
    }


    initControls() {
        forEach(this.dom.openers, (opener) => {
            makeElementClickable(opener, this.openModal.bind(this));
        });

        makeElementClickable(this.dom.closeIcon, this.closeModal.bind(this));
        makeElementClickable(this.dom.shadow,    this.closeModal.bind(this));

        TouchScreen.onPinchOut(this.dom.modalWindow, this.closeModal.bind(this));

        return this;
    }


    openModal() {
        if (!this.state.visible) {
            addClass(this.element,    '-visible');
            addClass(this.dom.shadow, '-visible');
            
            aria.set(this.element, 'hidden', false);

            this.state.visible = true;
        }

        return this;
    }


    closeModal() {
        if (this.state.visible) {
            removeClass(this.element,    '-visible');
            removeClass(this.dom.shadow, '-visible');
            
            aria.set(this.element, 'hidden', true);

            this.state.visible = false;
        }

        return this;
    }
};

