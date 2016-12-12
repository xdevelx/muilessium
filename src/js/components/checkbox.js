import * as Utils from '../utils';
import { Component } from '../component';


export class Checkbox extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log('creating mui-checkbox for ' + element +
                        ' with options ' + JSON.stringify(options));

        this.dom = Utils.extend(this.dom, {
            input: element.getElementsByTagName('input')[0],
            label: element.getElementsByTagName('label')[0]
        });

        Utils.makeElementClickable(this.dom.label, () => {
            this.toggleCheckbox();
        });

        this.state.initialized = true;
    }


    setCheckbox() {
        this.dom.input.checked = true;

        Utils.addClass(this.element, '-checked');

        Utils.aria.set(this.dom.label, 'checked', true);

        return this;
    }


    unsetCheckbox() {
        this.dom.input.checked = false;

        Utils.removeClass(this.element, '-checked');

        Utils.aria.set(this.dom.label, 'checked', false);

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
}
