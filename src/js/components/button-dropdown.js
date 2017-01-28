import * as Keyboard from '../controls/keyboard';

import { aria                            } from '../utils/aria';
import { addClass, removeClass           } from '../utils/classes';
import { makeElementClickable, getFocusableChilds, goToNextFocusableElement } from '../utils/focus-and-click';
import { extend, firstOfList, lastOfList } from '../utils/uncategorized';

import { Component } from '../component';


export class ButtonDropdown extends Component {
    constructor(element, options) {
        super(element, options);

        this.dom = extend(this.dom, {
            button:      element.querySelector('.mui-button'),
            dropdown:    element.querySelector('.mui-dropdown-options'),
            optionsList: element.querySelectorAll('.option'),
            shadow:      element.querySelector('.mui-shadow-toggle')
        });

        this.state = extend(this.state, {
            opened: false
        });

        this.initAria();
        this.initControls();
    }


    initAria() {
        aria.removeRole(this.element); // Remove role='button' added in base component

        aria.set(this.dom.button,   'haspopup', true);
        aria.set(this.dom.dropdown, 'labelledby', aria.setId(this.dom.button));
        aria.set(this.dom.dropdown, 'hidden', true);
        aria.set(this.dom.shadow,   'hidden', true);

        return this;
    }


    initControls() {
        makeElementClickable(this.dom.button, this.toggleDropdown.bind(this));
        makeElementClickable(this.dom.shadow, this.toggleDropdown.bind(this), true);

        Keyboard.onShiftTabPressed(firstOfList(this.dom.optionsList), () => {
            this.closeDropdown();
            this.dom.button.focus();
        });

        Keyboard.onTabPressed(lastOfList(this.dom.optionsList), () => {
            this.closeDropdown();

            goToNextFocusableElement(lastOfList(getFocusableChilds(this.element)));
        });

        return this;
    }


    openDropdown() {
        addClass(this.element,    '-opened');
        addClass(this.dom.shadow, '-visible');

        aria.set(this.dom.button,   'hidden', true);
        aria.set(this.dom.dropdown, 'hidden', false);

        firstOfList(getFocusableChilds(this.dom.dropdown)).focus()

        this.state.opened = true;

        return this;
    }


    closeDropdown() {
        removeClass(this.element,    '-opened');
        removeClass(this.dom.shadow, '-visible');

        aria.set(this.dom.button,   'hidden', false);
        aria.set(this.dom.dropdown, 'hidden', true);

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
};

