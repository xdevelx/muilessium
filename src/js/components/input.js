import * as Utils from '../utils';
import { Component } from '../component';


export class Input extends Component {
    constructor(element, options) {
        super(element, options);
        
        Utils.console.log(`creating input for the <${element.nodeName}> with options ${JSON.stringify(options)}`);

        this.dom = Utils.extend(this.dom, {
            input: element.getElementsByTagName('input')[0],
            labels: element.parentNode.getElementsByTagName('label'),
        });

        this.initAria();
        this.initControls();

        Utils.console.ok('input has been created');
    }


    initAria() {
        let inputId = this.dom.input.getAttribute('id') || Utils.aria.setId(this.dom.input);

        Utils.ifNodeList(this.dom.labels, () => {
            Utils.aria.set(this.dom.input, 'labelledby', Utils.aria.setId(this.dom.labels[0]));

            [].forEach.call(this.dom.labels, (label) => {
                label.setAttribute('for', inputId);
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

        this.dom.input.addEventListener('change', function() {
            Utils.console.log('input value changed to "' + this.value + '"');

            if (this.value == '') {
                Utils.removeClass(this.element, '-has-value');
            } else {
                Utils.addClass(this.element, '-has-value');
            }
        });

        return this;
    }
}
