// -----------------------------------------------------------------------------
// RADIO COMPONENT
// -----------------------------------------------------------------------------
// Methods list:
//  - (default) initAria()
//  - (default) initControls()
//  - updateState()

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

        this.domCache = extend(this.domCache, {
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
        aria.setRole(this.domCache.element, 'radiogroup');

        ifExists(this.domCache.inputLabel, () => {
            aria.set(this.domCache.element, 'labelledby', aria.setId(this.domCache.inputLabel));
            setAttribute(this.domCache.inputLabel, 'for', aria.setId(this.domCache.element));
        });

        forEach(this.domCache.inputs, (input, index) => {
            aria.set(input, 'hidden', true);
            setAttribute(input, 'type', 'radio');
            setAttribute(input, 'name', getAttribute(this.domCache.element, 'data-name'));

            if (input.checked) {
                this.state.checkedIndex = index;
            }
        });

        forEach(this.domCache.labels, (label, index) => {
            setAttribute(label, 'for', getAttribute(this.domCache.inputs[index], 'id'));
            aria.setRole(label, 'radio');
        });

        return this;
    }


    initControls() {
        makeChildElementsClickable(this.domCache.element, this.domCache.labels, (index) => {
            this.updateState(index);
        });

        return this;
    }


    updateState(index) {
        if ((typeof index !== 'number') || (index < 0)) {
            return this;
        }

        this.domCache.inputs[index].checked = true;

        if (this.state.checkedIndex >= 0) {
            aria.set(this.domCache.labels[this.state.checkedIndex], 'checked', false);
        }

        aria.set(this.domCache.labels[index], 'checked', true);

        this.state.checkedIndex = index;

        return this;
    }
};

