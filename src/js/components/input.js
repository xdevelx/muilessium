import * as Utils from '../utils';
import { Component } from '../component';


export class Input extends Component {
    constructor(element, options) {
        super(element, options);

        this.dom = Utils.extend(this.dom, {
            input: element.getElementsByTagName('input')[0],
            labels: element.parentNode.getElementsByTagName('label'),
            hint: element.parentNode.getElementsByClassName('mui-input-hint')[0],
            indicator: element.parentNode.getElementsByClassName('mui-input-indicator')[0]
        });

        this.state = Utils.extend(this.state, {
            regexp: new RegExp((element.getAttribute('data-regexp') || '')),
            validationDelay: (element.getAttribute('data-validation-delay') || 300),
            validationTimeout: null
        });

        this.initAria();
        this.initControls();
    }


    initAria() {
        const inputId = this.dom.input.getAttribute('id') || Utils.aria.setId(this.dom.input);

        Utils.ifNodeList(this.dom.labels, () => {
            Utils.aria.set(this.dom.input, 'labelledby', Utils.aria.setId(this.dom.labels[0]));

            [].forEach.call(this.dom.labels, (label) => {
                Utils.setAttribute(label, 'for', inputId);
            });
        });

        return this;
    }


    initControls() {
        Utils.ifNodeList(this.dom.labels, () => {
            [].forEach.call(this.dom.labels, (label) => {
                label.addEventListener('focus', () => {
                    this.dom.input.focus();
                });
            });
        });

        this.dom.input.addEventListener('focus', this.focusHandler.bind(this));
        this.dom.input.addEventListener('blur',  this.blurHandler.bind(this));

        this.dom.input.addEventListener('change',  this.changeValueHandler.bind(this));
        this.dom.input.addEventListener('keydown', this.changeValueHandler.bind(this));

        return this;
    }


    focusHandler() {
        Utils.addClass(this.element, '-focused');

        Utils.ifNodeList(this.dom.labels, () => {
            Utils.makeElementsNotFocusable(this.dom.labels);
        });

        return this;
    }


    blurHandler() {
        Utils.removeClass(this.element, '-focused');

        Utils.ifNodeList(this.dom.labels, () => {
            Utils.makeElementsFocusable(this.dom.labels);
        });

        return this;
    }


    changeValueHandler() {
        if (this.dom.input.value == '') {
            Utils.removeClass(this.element,  '-has-value');

            Utils.removeClass(this.element,  '-valid');
            Utils.removeClass(this.element,  '-invalid');

            Utils.removeClass(this.dom.hint, '-valid');
            Utils.removeClass(this.dom.hint, '-invalid');

            Utils.removeClass(this.dom.indicator, '-valid');
            Utils.removeClass(this.dom.indicator, '-invalid');
        } else {
            Utils.addClass(this.element, '-has-value');

            let validationTimeout = this.state.validationTimeout;

            if (validationTimeout) {
                clearTimeout(validationTimeout);
            }

            validationTimeout = setTimeout(this.validate.bind(this), this.state.validationDelay);
        }

        return this;
    }

    
    validate() {
        if (this.state.regexp.test(this.dom.input.value)) {
            Utils.removeClass(this.element,       '-invalid');
            Utils.addClass(this.element,          '-valid');

            Utils.removeClass(this.dom.hint,      '-invalid');
            Utils.addClass(this.dom.hint,         '-valid');

            Utils.removeClass(this.dom.indicator, '-invalid');
            Utils.addClass(this.dom.indicator,    '-valid');
        } else {
            Utils.removeClass(this.element,       '-valid');
            Utils.addClass(this.element,          '-invalid');

            Utils.removeClass(this.dom.hint,      '-valid');
            Utils.addClass(this.dom.hint,         '-invalid');

            Utils.removeClass(this.dom.indicator, '-valid');
            Utils.addClass(this.dom.indicator,    '-invalid');
        }

        this.state.validationTimeout = null;

        return this;
    }    
}
