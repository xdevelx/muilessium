import * as Utils from '../utils';
import { Component } from '../component';


export class Input extends Component {
    constructor(element, options) {
        super(element, options);

        this.dom = Utils.extend(this.dom, {
            input: element.getElementsByTagName('input')[0],
            labels: element.parentNode.getElementsByTagName('label'),
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

        this.dom.input.addEventListener('focus', () => {
            Utils.addClass(this.element, '-focused');

            Utils.ifNodeList(this.dom.labels, () => {
                Utils.makeElementsNotFocusable(this.dom.labels);
            });
        });

        this.dom.input.addEventListener('blur', () => {
            Utils.removeClass(this.element, '-focused');

            Utils.ifNodeList(this.dom.labels, () => {
                Utils.makeElementsFocusable(this.dom.labels);
            });
        });

        this.dom.input.addEventListener('change', () => {
            if (this.dom.input.value == '') {
                Utils.removeClass(this.element, '-has-value');
            } else {
                Utils.addClass(this.element, '-has-value');
            }
        });

        return this;
    }
}
