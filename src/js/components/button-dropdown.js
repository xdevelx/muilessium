// -----------------------------------------------------------------------------
// DROPDOWN BUTTON COMPONENT
// -----------------------------------------------------------------------------
// Methods list:
//  - (default) initAria()
//  - (default) initControls()
//  - openDrpdown()
//  - closeDrpdown()
//  - toggleDrpdown()


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

        this.domCache = extend(this.domCache, {
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
        aria.removeRole(this.domCache.element);

        aria.set(this.domCache.button,   'haspopup', true);
        aria.set(this.domCache.dropdown, 'labelledby', aria.setId(this.domCache.button));
        aria.set(this.domCache.dropdown, 'hidden', true);
        aria.set(this.domCache.shadow,   'hidden', true);

        return this;
    }


    initControls() {
        makeElementClickable(this.domCache.button,
                        this.toggleDropdown.bind(this, { focusFirstWhenOpened: false }),
                                        { mouse: true, keyboard: false });

        Keyboard.onEnterPressed(this.domCache.button,
                        this.toggleDropdown.bind(this, { focusFirstWhenOpened: true }),
                                        { mouse: false, keyboard: true });

        Keyboard.onSpacePressed(this.domCache.button,
                        this.toggleDropdown.bind(this, { focusFirstWhenOpened: true }),
                                        { mouse: false, keyboard: true });

        makeElementClickable(this.domCache.shadow, this.toggleDropdown.bind(this),
                        { mouse: true, keyboard: false });

        makeElementsFocusable(this.domCache.optionsList);

        forEach(this.domCache.optionsList, (option, index) => {
            Keyboard.onArrowUpPressed(option, () => {
                if (option == firstOfList(this.domCache.optionsList)) {
                    this.closeDropdown();
                    this.domCache.button.focus();
                } else {
                    this.domCache.optionsList[index-1].focus();
                }
            });

            Keyboard.onArrowDownPressed(option, () => {
                if (option == lastOfList(this.domCache.optionsList)) {
                    this.closeDropdown();
                    this.domCache.button.focus();
                } else {
                    this.domCache.optionsList[index+1].focus();
                }
            });
        });

        Keyboard.onShiftTabPressed(firstOfList(this.domCache.optionsList), () => {
            this.closeDropdown();
            this.domCache.button.focus();
        });

        Keyboard.onTabPressed(lastOfList(this.domCache.optionsList), () => {
            this.closeDropdown();

            goToNextFocusableElement(lastOfList(getFocusableChilds(this.domCache.element)));
        });

        return this;
    }


    openDropdown({ focusFirst = true }) {
        addClass(this.domCache.element,    '-opened');
        addClass(this.domCache.shadow, '-visible');

        aria.set(this.domCache.button,   'hidden', true);
        aria.set(this.domCache.dropdown, 'hidden', false);

        if (focusFirst) {
            firstOfList(getFocusableChilds(this.domCache.dropdown)).focus();
        }

        this.state.opened = true;

        return this;
    }


    closeDropdown() {
        removeClass(this.domCache.element,    '-opened');
        removeClass(this.domCache.shadow, '-visible');

        aria.set(this.domCache.button,   'hidden', false);
        aria.set(this.domCache.dropdown, 'hidden', true);

        this.domCache.button.focus();

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

