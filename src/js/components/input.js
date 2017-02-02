import { Component } from '../component';

import { aria                       } from '../utils/aria';
import { setAttribute, getAttribute } from '../utils/attributes';
import { ifExists, ifNodeList       } from '../utils/checks';

import {
    hasClass,
    addClass,
    removeClass,
    removeClasses,
    replaceClass
} from '../utils/classes';

import {
    makeElementsFocusable,
    makeElementsNotFocusable,
    onFocus,
    onBlur
} from '../utils/focus-and-click';

import { extend, forEach } from '../utils/uncategorized';



export class Input extends Component {
    constructor(element, options) {
        super(element, options);

        this.dom = extend(this.dom, {
            input:     element.querySelector('input'),
            labels:    element.parentNode.querySelectorAll('label'),
            hint:      element.parentNode.querySelector('.mui-input-hint'),
            indicator: element.parentNode.querySelector('.mui-input-indicator')
        });

        this.state = extend(this.state, {
            regexp:            new RegExp(getAttribute(element, 'data-regexp', '')),
            isValidationEnabled: !hasClass(element, '-js-no-validation'),
            validationDelay:   getAttribute(element, 'data-validation-delay', 300),
            validationTimeout: null,
            printNotExistsWarnings: !hasClass(element, '-js-allow-not-exists')
        });

        this.initAria();
        this.initControls();
    }


    initAria() {
        const inputId = getAttribute(this.dom.input, 'id') || aria.setId(this.dom.input);

        ifNodeList(this.dom.labels, () => {
            aria.set(this.dom.input, 'labelledby', aria.setId(this.dom.labels[0]));

            forEach(this.dom.labels, (label) => {
                setAttribute(label, 'for', inputId);
            });
        }, this.state.printNotExistsWarnings);

        return this;
    }


    initControls() {
        ifNodeList(this.dom.labels, () => {
            forEach(this.dom.labels, (label) => {
                onFocus(label, () => {
                    this.dom.input.focus();
                });
            });
        }, this.state.printNotExistsWarnings);

        onFocus(this.dom.input, this.focusHandler.bind(this));
        onBlur(this.dom.input,  this.blurHandler.bind(this));

        this.dom.input.addEventListener('change',  this.changeValueHandler.bind(this));
        this.dom.input.addEventListener('keydown', this.changeValueHandler.bind(this));

        return this;
    }


    focusHandler() {
        addClass(this.element, '-focused');

        ifNodeList(this.dom.labels, () => {
            makeElementsNotFocusable(this.dom.labels);
        }, this.state.printNotExistsWarnings);

        return this;
    }


    blurHandler() {
        removeClass(this.element, '-focused');

        ifNodeList(this.dom.labels, () => {
            makeElementsFocusable(this.dom.labels);
        }, this.state.printNotExistsWarnings);

        return this;
    }


    changeValueHandler() {
        if (this.dom.input.value == '') {
            removeClasses(this.element, '-has-value', '-valid', '-invalid');

            ifExists(this.dom.hint, () => {
                removeClasses(this.dom.hint,      '-valid', '-invalid');
                removeClasses(this.dom.indicator, '-valid', '-invalid');
            }, this.state.printNotExistsWarnings);
        } else {
            addClass(this.element, '-has-value');

            let validationTimeout = this.state.validationTimeout;

            if (validationTimeout) {
                clearTimeout(validationTimeout);
            }

            validationTimeout = setTimeout(this.validate.bind(this), this.state.validationDelay);
        }

        return this;
    }

    
    validate() {
        if (this.state.isValidationEnabled) {
            if (this.state.regexp.test(this.dom.input.value)) {
                replaceClass(this.element,       '-invalid', '-valid');

                ifExists(this.dom.hint, () => {
                    replaceClass(this.dom.hint,      '-invalid', '-valid');
                    replaceClass(this.dom.indicator, '-invalid', '-valid');
                }, this.state.printNotExistsWarnings);
            } else {
                replaceClass(this.element,       '-valid', '-invalid');

                ifExists(this.dom.hint, () => {
                    replaceClass(this.dom.hint,      '-valid', '-invalid');
                    replaceClass(this.dom.indicator, '-valid', '-invalid');
                }, this.state.printNotExistsWarnings);
            }

            this.state.validationTimeout = null;
        }

        return this;
    }    
};

