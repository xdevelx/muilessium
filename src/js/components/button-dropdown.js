import { Component } from '../component';

import * as Keyboard from '../controls/keyboard';

import { aria                     } from '../utils/aria';
import { addClass                 } from '../utils/classes';
import { removeClass              } from '../utils/classes';
import { makeElementClickable     } from '../utils/focus-and-click';
import { makeElementsFocusable    } from '../utils/focus-and-click';
import { getFocusableChilds       } from '../utils/focus-and-click';
import { goToNextFocusableElement } from '../utils/focus-and-click';
import { extend                   } from '../utils/uncategorized';
import { firstOfList              } from '../utils/uncategorized';
import { lastOfList               } from '../utils/uncategorized';
import { forEach                  } from '../utils/uncategorized';



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
        /* Remove role='button' added in base component */
        aria.removeRole(this.element);

        aria.set(this.dom.button,   'haspopup', true);
        aria.set(this.dom.dropdown, 'labelledby', aria.setId(this.dom.button));
        aria.set(this.dom.dropdown, 'hidden', true);
        aria.set(this.dom.shadow,   'hidden', true);

        return this;
    }


    initControls() {
        makeElementClickable(this.dom.button,
                        this.toggleDropdown.bind(this, { focusFirstWhenOpened: false }),
                                        { mouse: true, keyboard: false });

        Keyboard.onEnterPressed(this.dom.button,
                        this.toggleDropdown.bind(this, { focusFirstWhenOpened: true }),
                                        { mouse: false, keyboard: true });

        Keyboard.onSpacePressed(this.dom.button,
                        this.toggleDropdown.bind(this, { focusFirstWhenOpened: true }),
                                        { mouse: false, keyboard: true });

        makeElementClickable(this.dom.shadow, this.toggleDropdown.bind(this),
                        { mouse: true, keyboard: false });

        makeElementsFocusable(this.dom.optionsList);

        forEach(this.dom.optionsList, (option, index) => {
            Keyboard.onArrowUpPressed(option, () => {
                if (option == firstOfList(this.dom.optionsList)) {
                    this.closeDropdown();
                    this.dom.button.focus();
                } else {
                    this.dom.optionsList[index-1].focus();
                }
            });

            Keyboard.onArrowDownPressed(option, () => {
                if (option == lastOfList(this.dom.optionsList)) {
                    this.closeDropdown();
                    this.dom.button.focus();
                } else {
                    this.dom.optionsList[index+1].focus();
                }
            });
        });

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


    openDropdown({ focusFirst = true }) {
        addClass(this.element,    '-opened');
        addClass(this.dom.shadow, '-visible');

        aria.set(this.dom.button,   'hidden', true);
        aria.set(this.dom.dropdown, 'hidden', false);

        if (focusFirst) {
            firstOfList(getFocusableChilds(this.dom.dropdown)).focus();
        }

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


    toggleDropdown({ focusFirstWhenOpened = true }) {
        if (this.state.opened) {
            this.closeDropdown();
        } else {
            this.openDropdown({ focusFirst: focusFirstWhenOpened });
        }

        return this;
    }
};

