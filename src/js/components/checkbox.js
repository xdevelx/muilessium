import * as Utils from '../utils';
import { Component } from '../component';


export class Checkbox extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log(`creating checkbox for the <${element.nodeName}> with options ${JSON.stringify(options)}`);

        this.dom = Utils.extend(this.dom, {
            input: element.getElementsByTagName('input')[0],
            label: element.getElementsByTagName('label')[0],
        });

        this.initAria();
        this.initControls();

        Utils.console.ok('checkbox has been created');
    }


    initAria() {
        Utils.aria.setRole(this.dom.label, 'checkbox');

        let inputId = Utils.aria.setId(this.dom.input);

        this.dom.input.checked = false;
        this.dom.label.setAttribute('for', inputId);

        Utils.aria.set(this.dom.label, 'controls', inputId);
        Utils.aria.set(this.dom.label, 'checked', false);

        Utils.aria.set(this.dom.input, 'labelledby', Utils.aria.setId(this.dom.label));

        return this;
    }


    initControls() {
        Utils.makeElementClickable(this.dom.label, () => {
            this.toggleCheckbox();
        });

        return this;
    }


    setCheckbox() {
        Utils.console.log(`setting checkbox`);

        this.dom.input.checked = true;

        Utils.addClass(this.element, '-checked');

        Utils.aria.set(this.dom.label, 'checked', true);

        return this;
    }


    unsetCheckbox() {
        Utils.console.log(`unsetting checkbox`);

        this.dom.input.checked = false;

        Utils.removeClass(this.element, '-checked');

        Utils.aria.set(this.dom.label, 'checked', false);

        return this;
    }


    toggleCheckbox() {
        Utils.console.log(`toggling checkbox`);

        if (this.dom.input.checked) {
            this.unsetCheckbox();
        } else {
            this.setCheckbox();
        }

        return this;
    }
}
