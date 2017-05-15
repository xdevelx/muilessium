// -----------------------------------------------------------------------------
// SELECT DROPDOWN COMPONENT
// -----------------------------------------------------------------------------
// Methods list:
//  - (default) initAria()
//  - (default) initControls()
//  - getSelectedIndex()
//  - openDropdown()
//  - closeDropdown()
//  - toggleDropdown()
//  - updateState(newIndex = 0)


import { Component } from '../component';

import * as Keyboard from '../controls/keyboard';

import { aria                         } from '../utils/aria';
import { getAttribute                 } from '../utils/attributes';
import { setAttribute                 } from '../utils/attributes';
import { addClass                     } from '../utils/classes';
import { removeClass                  } from '../utils/classes';
import { toggleClass                  } from '../utils/classes';
import { hasClass                     } from '../utils/classes';
import { ifNodeList                   } from '../utils/checks';
import { makeElementClickable         } from '../utils/focus-and-click';
import { makeChildElementsClickable   } from '../utils/focus-and-click';
import { makeElementsFocusable        } from '../utils/focus-and-click';
import { makeElementsNotFocusable     } from '../utils/focus-and-click';
import { getFocusableChilds           } from '../utils/focus-and-click';
import { goToNextFocusableElement     } from '../utils/focus-and-click';
import { goToPreviousFocusableElement } from '../utils/focus-and-click';
import { onFocus                      } from '../utils/focus-and-click';
import { onBlur                       } from '../utils/focus-and-click';
import { extend                       } from '../utils/uncategorized';
import { forEach                      } from '../utils/uncategorized';
import { firstOfList                  } from '../utils/uncategorized';
import { lastOfList                   } from '../utils/uncategorized';



export class SelectDropdown extends Component {
    constructor(element, options) {
        super(element, options);

        this.domCache = extend(this.domCache, {
            labels:      element.parentNode.querySelectorAll('label'),
            select:      element.querySelector('.select'),
            state:       element.querySelector('.state'),
            options:     element.querySelector('.mui-dropdown-options'),
            optionsList: element.querySelectorAll('.option'),
            shadow:      element.querySelector('.mui-shadow-toggle'),
            icon:        element.querySelector('.icon'),
            focusables:  []
        });

        this.state = extend(this.state, {
            selectedIndex: this.getSelectedIndex(),
            isOpened: false
        });

        this.createHiddenSelect();
        this.initAria();
        this.initControls();
        this.updateState();
    }


    createHiddenSelect() {
        let hiddenSelect = document.createElement('select'),
            id = this.domCache.select.getAttribute('data-id');

        this.domCache.element.appendChild(hiddenSelect);

        setAttribute(hiddenSelect, 'id', id);
        setAttribute(hiddenSelect, 'name', id);

        this.domCache.hiddenSelect = hiddenSelect;

        addClass(this.domCache.hiddenSelect, '_hidden');
        aria.set(this.domCache.hiddenSelect, 'hidden', true);

        forEach(this.domCache.optionsList, (option) => {
            let hiddenOption = document.createElement('option');

            hiddenOption.value = getAttribute(option, 'data-value');
            
            this.domCache.hiddenSelect.add(hiddenOption);
        });

        return this;
    }


    initAria() {
        aria.setRole(this.domCache.select, 'listbox');

        forEach(this.domCache.optionsList, (option) => {
            aria.setRole(option, 'option');
            aria.setId(option);
        });

        aria.set(this.domCache.select, 'activedescendant',
                    getAttribute(this.domCache.optionsList[this.state.selectedIndex], 'id'));
        aria.set(this.domCache.state, 'hidden', true);
        aria.set(this.domCache.icon, 'hidden', true);
        aria.set(this.domCache.shadow, 'hidden', true);

        ifNodeList(this.domCache.labels, () => {
            const selectId = aria.setId(this.domCache.select);

            forEach(this.domCache.labels, (label) => {
                setAttribute(label, 'for', selectId);
            });

            aria.set(this.domCache.select, 'labelledby', aria.setId(this.domCache.labels[0]));
        });

        return this;
    }

    
    initControls() { 
        makeElementClickable(this.domCache.select,
                        this.toggleDropdown.bind(this, { focusFirstWhenOpened: false }), { mouse: true, keyboard: false });

        makeElementClickable(this.domCache.select,
                        this.toggleDropdown.bind(this, { focusFirstWhenOpened: true }), { mouse: false, keyboard: true });

        Keyboard.onSpacePressed(this.domCache.select, this.toggleDropdown.bind(this));

        makeElementClickable(this.domCache.shadow, this.toggleDropdown.bind(this),
                        { mouse: true, keyboard: false });

        makeChildElementsClickable(this.domCache.element, this.domCache.optionsList, (index) => {
            this.updateState(index);
            this.closeDropdown();
        });

        ifNodeList(this.domCache.labels, () => {
            forEach(this.domCache.labels, (label) => {
                onFocus(label, () => {
                    this.domCache.select.focus();
                });
            });

            onFocus(this.domCache.select, () => {
                makeElementsNotFocusable(this.domCache.labels);
            });

            onBlur(this.domCache.select, () => {
                makeElementsFocusable(this.domCache.labels);
            });
            
        });

        forEach(this.domCache.optionsList, (option, index) => {
            Keyboard.onArrowUpPressed(option, () => {
                if (option == firstOfList(this.domCache.optionsList)) {
                    this.closeDropdown();
                    this.domCache.select.focus();
                } else {
                    this.domCache.optionsList[index-1].focus();
                }
            });

            Keyboard.onArrowDownPressed(option, () => {
                if (option == lastOfList(this.domCache.optionsList)) {
                    this.closeDropdown();
                    this.domCache.select.focus();
                } else {
                    this.domCache.optionsList[index+1].focus();
                }
            });
        });

        this.domCache.focusables = getFocusableChilds(this.domCache.element);

        Keyboard.onTabPressed(lastOfList(this.domCache.optionsList), () => {
            this.closeDropdown();

            goToNextFocusableElement(lastOfList(this.domCache.focusables));
        });

        Keyboard.onShiftTabPressed(firstOfList(this.domCache.optionsList), () => {
            this.closeDropdown();

            goToPreviousFocusableElement(firstOfList(this.domCache.focusables));
        });

        return this;
    }


    getSelectedIndex() {
        for (let i = 0; i < this.domCache.options.length; i++) {
            if (hasClass(this.domCache.options[i], '-selected')) {
                return i;
            }
        }

        return 0;
    }

    openDropdown({ focusFirst = true }) {
        this.state.isOpened = true;

        addClass(this.domCache.element, '-opened');
        addClass(this.domCache.shadow, '-visible');

        if (focusFirst) {
            firstOfList(this.domCache.optionsList).focus();
        }
    
        return this;
    }

    toggleDropdown({ focusFirstWhenOpened = true }) {
        if (this.state.isOpened) {
            this.closeDropdown();
        } else {
            this.openDropdown({ focusFirst: focusFirstWhenOpened });
        }

        return this;
    }


    closeDropdown() {
        this.state.isOpened = false;

        removeClass(this.domCache.element, '-opened');
        removeClass(this.domCache.shadow, '-visible');

        return this;
    }


    updateState(newSelectedIndex = 0) {
        this.state.selectedIndex = newSelectedIndex;
        this.domCache.state.innerHTML = this.domCache.optionsList[this.state.selectedIndex].innerHTML;
        this.domCache.hiddenSelect.selectedIndex = this.state.selectedIndex.toString();

        aria.set(this.domCache.select, 'activedescendant',
                    getAttribute(this.domCache.optionsList[this.state.selectedIndex], 'id'));

        return this;
    }
};

