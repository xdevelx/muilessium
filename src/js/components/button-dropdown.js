import * as Utils from '../utils';
import { Button } from './button';


export class ButtonDropdown extends Button {
    constructor(element, options) {
        super(element, options);

        Utils.console.log('creating mui-button-dropdown for ' + element +
                        ' with options ' + JSON.stringify(options));

        this.dom = Utils.extend(this.dom, {
            button:   element.getElementsByClassName('mui-button')[0],
            dropdown: element.getElementsByClassName('mui-dropdown-options')[0],
            shadow:   element.getElementsByClassName('mui-shadow-toggle')[0]
        });

        Utils.makeChildElementsClickable(this.element, [this.dom.button, this.dom.shadow], () => {
            this.toggleDropdown();
        });

        this.state.initialized = true;
    }

    openDropdown() {
        Utils.addClass(this.element,    '-opened');
        Utils.addClass(this.dom.shadow, '-visible');

        return this;
    }

    closeDropdown() {
        Utils.removeClass(this.element,    '-opened');
        Utils.removeClass(this.dom.shadow, '-visible');

        return this;
    }

    toggleDropdown() {
        Utils.toggleClass(this.element,    '-opened');
        Utils.toggleClass(this.dom.shadow, '-visible');

        return this;
    }
}
