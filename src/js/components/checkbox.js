import { Component } from '../component';

import { aria                  } from '../utils/aria';
import { setAttribute          } from '../utils/attributes';
import { addClass              } from '../utils/classes';
import { removeClass           } from '../utils/classes';
import { makeElementClickable  } from '../utils/focus-and-click';
import { extend                } from '../utils/uncategorized';



export class Checkbox extends Component {
    constructor(element, options) {
        super(element, options);

        this.dom = extend(this.dom, {
            input: element.querySelector('input'),
            label: element.querySelector('label'),
        });

        this.initAria();
        this.initControls();
    }


    initAria() {
        aria.setRole(this.dom.label, 'checkbox');

        const inputId = this.dom.input.getAttribute('id') || aria.setId(this.dom.input);

        this.dom.input.checked = false;

        setAttribute(this.dom.label, 'for', inputId);

        aria.set(this.dom.label, 'controls', inputId);
        aria.set(this.dom.label, 'checked', false);
        aria.set(this.dom.input, 'labelledby', aria.setId(this.dom.label));

        return this;
    }


    initControls() {
        makeElementClickable(this.dom.label, this.toggleCheckbox.bind(this));

        return this;
    }


    setCheckbox() {
        this.dom.input.checked = true;

        addClass(this.element, '-checked');
        aria.set(this.dom.label, 'checked', true);

        return this;
    }


    unsetCheckbox() {
        this.dom.input.checked = false;

        removeClass(this.element, '-checked');
        aria.set(this.dom.label, 'checked', false);

        return this;
    }


    toggleCheckbox() {
        if (this.dom.input.checked) {
            this.unsetCheckbox();
        } else {
            this.setCheckbox();
        }

        return this;
    }
};

