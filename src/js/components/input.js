import * as Utils from '../utils';
import { Component } from '../component';


export class Input extends Component {
    constructor(element, options) {
        super(element, options);
        
        Utils.console.info(`creating input for the ${element} with options ${JSON.stringify(options)}`);

        this.dom = Utils.extend(this.dom, {
            input: element.getElementsByTagName('input')[0],
            labels: element.parentNode.getElementsByTagName('label'),
            icons: element.getElementsByClassName('fa')
        });

        let inputId = this.dom.input.getAttribute('id') || Utils.aria.setId(this.dom.input);

        [].forEach.call(this.dom.labels, (label) => {
            label.setAttribute('for', inputId);
        });

        Utils.aria.set(this.dom.input, 'labelledby', Utils.aria.setId(this.dom.labels[0]));

        [].forEach.call(this.dom.icons, (icon) => {
            Utils.aria.set(icon, 'hidden', true);
        });

        this.dom.input.addEventListener('focus', () => {
            Utils.addClass(this.element, '-focused');
            Utils.makeElementsNotFocusable(this.dom.labels);
        });

        this.dom.input.addEventListener('blur', () => {
            Utils.removeClass(this.element, '-focused');
            Utils.makeElementsFocusable(this.dom.labels);
        });

        [].forEach.call(this.dom.labels, (label) => {
            label.addEventListener('focus', () => {
                this.dom.input.focus();
            });
        });

        this.dom.input.addEventListener('change', () => {
            Utils.console.log('input value changed to "' + this.value + '"');

            if (this.value == '') {
                Utils.removeClass(element, '-has-value');
            } else {
                Utils.addClass(element, '-has-value');
            }
        });

        this.state.initialized = true;
    }
}
