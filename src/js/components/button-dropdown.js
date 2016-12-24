import * as Utils from '../utils';
import { Component } from '../component';


export class ButtonDropdown extends Component {
    constructor(element, options) {
        super(element, options);

        this.dom = Utils.extend(this.dom, {
            button:   element.getElementsByClassName('mui-button')[0],
            dropdown: element.getElementsByClassName('mui-dropdown-options')[0],
            shadow:   element.getElementsByClassName('mui-shadow-toggle')[0]
        });

        this.state = Utils.extend(this.state, {
            opened: false
        });

        this.initAria();
        this.initControls();
    }


    initAria() {
        Utils.aria.removeRole(this.element); // Remove role='button' added in base component
        Utils.aria.set(this.dom.button,   'haspopup', true);
        Utils.aria.set(this.dom.dropdown, 'labelledby', Utils.aria.setId(this.dom.button));
        Utils.aria.set(this.dom.dropdown, 'hidden', true);
        Utils.aria.set(this.dom.shadow,   'hidden', true);

        return this;
    }


    initControls() {
        Utils.makeChildElementsClickable(this.element, [this.dom.button, this.dom.shadow],
                        this.toggleClickEventListener.bind(this));

        return this;
    }


    toggleClickEventListener() {
        this.toggleDropdown();
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
