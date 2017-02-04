import { Component } from '../component';

import { aria                       } from '../utils/aria';
import { setAttribute               } from '../utils/attributes';
import { getAttribute               } from '../utils/attributes';
import { ifExists                   } from '../utils/checks';
import { makeChildElementsClickable } from '../utils/focus-and-click';
import { extend                     } from '../utils/uncategorized';
import { forEach                    } from '../utils/uncategorized';



export class Radio extends Component {
    constructor(element, options) {
        super(element, options);

        this.dom = extend(this.dom, {
            inputs:     element.querySelectorAll('input'),
            labels:     element.querySelectorAll('label'),
            inputLabel: element.parentNode.querySelector('.mui-input-label'),
            icons:      element.querySelectorAll('.icon')
        });

        this.state = extend(this.state, {
            checkedIndex: -1
        });

        this.initAria();
        this.initControls();
        this.updateState();
    }


    initAria() {
        aria.setRole(this.element, 'radiogroup');

        ifExists(this.dom.inputLabel, () => {
            aria.set(this.element, 'labelledby', aria.setId(this.dom.inputLabel));
            setAttribute(this.dom.inputLabel, 'for', aria.setId(this.element));
        });

        forEach(this.dom.inputs, (input, index) => {
            aria.set(input, 'hidden', true);
            setAttribute(input, 'type', 'radio');
            setAttribute(input, 'name', getAttribute(this.element, 'data-name'));

            if (input.checked) {
                this.state.checkedIndex = index;
            }
        });

        forEach(this.dom.labels, (label, index) => {
            setAttribute(label, 'for', getAttribute(this.dom.inputs[index], 'id'));
            aria.setRole(label, 'radio');
        });

        return this;
    }


    initControls() {
        makeChildElementsClickable(this.element, this.dom.labels, (index) => {
            this.updateState(index);
        });

        return this;
    }


    updateState(index) {
        if ((typeof index !== 'number') || (index < 0)) {
            return this;
        }

        this.dom.inputs[index].checked = true;

        if (this.state.checkedIndex >= 0) {
            aria.set(this.dom.labels[this.state.checkedIndex], 'checked', false);
        }

        aria.set(this.dom.labels[index], 'checked', true);

        this.state.checkedIndex = index;

        return this;
    }
};

