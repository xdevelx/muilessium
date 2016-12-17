import * as Utils from '../utils';
import { Button } from './button';


export class ButtonDropdown extends Button {
    constructor(element, options) {
        super(element, options);

        Utils.console.log('creating mui-button-dropdown for ' + element +
                        ' with options ' + JSON.stringify(options));

        this.dom = Utils.extend(this.dom, {
            button:   element.getElementsByClassName('mui-button')[0],
            icon:     element.getElementsByClassName('fa')[0],
            dropdown: element.getElementsByClassName('mui-dropdown-options')[0],
            shadow:   element.getElementsByClassName('mui-shadow-toggle')[0]
        });

        this.state = Utils.extend(this.state, {
            opened: false
        });

        Utils.makeChildElementsClickable(this.element, [this.dom.button, this.dom.shadow], () => {
            this.toggleDropdown();
        });

        Utils.aria.removeRole(this.element); // Remove role='button' added in base component
        Utils.aria.set(this.dom.button,   'haspopup', true);
        Utils.aria.set(this.dom.icon,     'hidden', true);
        Utils.aria.set(this.dom.dropdown, 'labelledby', Utils.aria.setId(this.dom.button));
        Utils.aria.set(this.dom.dropdown, 'hidden', true);
        Utils.aria.set(this.dom.shadow,   'hidden', true);

        this.state.initialized = true;
    }

    openDropdown() {
        Utils.addClass(this.element,    '-opened');
        Utils.addClass(this.dom.shadow, '-visible');

        Utils.aria.set(this.dom.button,   'hidden', true);
        Utils.aria.set(this.dom.dropdown, 'hidden', false);
        Utils.aria.set(this.dom.shadow,   'hidden', false);

        this.dom.dropdown.getElementsByTagName('a')[0].focus()

        this.state.opened = true;

        return this;
    }

    closeDropdown() {
        Utils.removeClass(this.element,    '-opened');
        Utils.removeClass(this.dom.shadow, '-visible');

        Utils.aria.set(this.dom.button,   'hidden', false);
        Utils.aria.set(this.dom.dropdown, 'hidden', true);
        Utils.aria.set(this.dom.shadow,   'hidden', true);

        this.dom.button.focus();

        this.state.opened = false;

        return this;
    }

    toggleDropdown() {
        if (this.state.opened) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }

        return this;
    }
}
