// -----------------------------------------------------------------------------
// CHECKBOX COMPONENT
// -----------------------------------------------------------------------------
// Methods list:
//  - (default) initAria()
//  - (default) initControls()
//  - setCheckbox()
//  - unsetCheckbox()
//  - toggleCheckbox()


import { Component } from '../component';

import * as Keyboard from '../controls/keyboard';

import { aria                  } from '../utils/aria';
import { setAttribute          } from '../utils/attributes';
import { addClass              } from '../utils/classes';
import { removeClass           } from '../utils/classes';
import { makeElementClickable  } from '../utils/focus-and-click';
import { extend                } from '../utils/uncategorized';



export class Checkbox extends Component {
    constructor(element, options) {
        super(element, options);

        this.domCache = extend(this.domCache, {
            input: element.querySelector('input'),
            label: element.querySelector('label'),
        });

        this.initAria();
        this.initControls();
    }


    initAria() {
        aria.setRole(this.domCache.label, 'checkbox');

        const inputId = this.domCache.input.getAttribute('id') || aria.setId(this.domCache.input);

        this.domCache.input.checked = false;

        setAttribute(this.domCache.label, 'for', inputId);

        aria.set(this.domCache.label, 'controls', inputId);
        aria.set(this.domCache.label, 'checked', false);
        aria.set(this.domCache.input, 'labelledby', aria.setId(this.domCache.label));

        return this;
    }


    initControls() {
        makeElementClickable(this.domCache.label, this.toggleCheckbox.bind(this));

        Keyboard.onSpacePressed(this.domCache.label, this.toggleCheckbox.bind(this));

        return this;
    }


    setCheckbox() {
        this.domCache.input.checked = true;

        addClass(this.domCache.element, '-checked');
        aria.set(this.domCache.label, 'checked', true);

        return this;
    }


    unsetCheckbox() {
        this.domCache.input.checked = false;

        removeClass(this.domCache.element, '-checked');
        aria.set(this.domCache.label, 'checked', false);

        return this;
    }


    toggleCheckbox() {
        if (this.domCache.input.checked) {
            this.unsetCheckbox();
        } else {
            this.setCheckbox();
        }

        return this;
    }
};

