import { Component } from '../component';

import * as Keyboard from '../controls/keyboard';

import { aria                                         } from '../utils/aria';
import { getAttribute, setAttribute                   } from '../utils/attributes';
import { addClass, removeClass, toggleClass, hasClass } from '../utils/classes';
import { ifNodeList                                   } from '../utils/checks';

import {
    makeElementClickable,
    makeChildElementsClickable,
    makeElementsFocusable,
    makeElementsNotFocusable,
    getFocusableChilds,
    goToNextFocusableElement,
    goToPreviousFocusableElement,
    onFocus,
    onBlur
} from '../utils/focus-and-click';

import { extend, forEach, firstOfList, lastOfList } from '../utils/uncategorized';



export class SelectDropdown extends Component {
    constructor(element, options) {
        super(element, options);

        this.dom = extend(this.dom, {
            labels:      this.element.parentNode.querySelectorAll('label'),
            select:      this.element.querySelector('.select'),
            state:       this.element.querySelector('.state'),
            options:     this.element.querySelector('.mui-dropdown-options'),
            optionsList: this.element.querySelectorAll('.option'),
            shadow:      this.element.querySelector('.mui-shadow-toggle'),
            icon:        this.element.querySelector('.icon'),
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
            id = this.dom.select.getAttribute('data-id');

        this.element.appendChild(hiddenSelect);

        setAttribute(hiddenSelect, 'id', id);
        setAttribute(hiddenSelect, 'name', id);

        this.dom.hiddenSelect = hiddenSelect;

        addClass(this.dom.hiddenSelect, '_hidden');
        aria.set(this.dom.hiddenSelect, 'hidden', true);

        forEach(this.dom.optionsList, (option) => {
            let hiddenOption = document.createElement('option');

            hiddenOption.value = getAttribute(option, 'data-value');
            
            this.dom.hiddenSelect.add(hiddenOption);
        });

        return this;
    }


    initAria() {
        aria.setRole(this.dom.select, 'listbox');

        forEach(this.dom.optionsList, (option) => {
            aria.setRole(option, 'option');
            aria.setId(option);
        });

        aria.set(this.dom.select, 'activedescendant',
                    getAttribute(this.dom.optionsList[this.state.selectedIndex], 'id'));
        aria.set(this.dom.state, 'hidden', true);
        aria.set(this.dom.icon, 'hidden', true);
        aria.set(this.dom.shadow, 'hidden', true);

        ifNodeList(this.dom.labels, () => {
            const selectId = aria.setId(this.dom.select);

            forEach(this.dom.labels, (label) => {
                setAttribute(label, 'for', selectId);
            });

            aria.set(this.dom.select, 'labelledby', aria.setId(this.dom.labels[0]));
        });

        return this;
    }

    
    initControls() { 
        makeElementClickable(this.dom.select, this.toggleDropdown.bind(this));
        makeElementClickable(this.dom.shadow, this.toggleDropdown.bind(this), true);

        makeChildElementsClickable(this.element, this.dom.optionsList, (index) => {
            this.updateState(index);
            this.closeDropdown();
        });

        ifNodeList(this.dom.labels, () => {
            forEach(this.dom.labels, (label) => {
                onFocus(label, () => {
                    this.dom.select.focus();
                });
            });

            onFocus(this.dom.select, () => {
                makeElementsNotFocusable(this.dom.labels);
            });

            onBlur(this.dom.select, () => {
                makeElementsFocusable(this.dom.labels);
            });
            
        });

        this.dom.focusables = getFocusableChilds(this.element);

        Keyboard.onTabPressed(lastOfList(this.dom.optionsList), () => {
            this.closeDropdown();

            goToNextFocusableElement(lastOfList(this.dom.focusables));
        });

        Keyboard.onShiftTabPressed(firstOfList(this.dom.optionsList), () => {
            this.closeDropdown();

            goToPreviousFocusableElement(firstOfList(this.dom.focusables));
        });

        return this;
    }


    getSelectedIndex() {
        for (let i = 0; i < this.dom.options.length; i++) {
            if (hasClass(this.dom.options[i], '-selected')) {
                return i;
            }
        }

        return 0;
    }

    openDropdown() {
        this.state.isOpened = true;

        addClass(this.element, '-opened');
        addClass(this.dom.shadow, '-visible');

        firstOfList(this.dom.optionsList).focus();

        return this;
    }

    toggleDropdown() {
        this.state.isOpened = !this.state.isOpened;

        toggleClass(this.element, '-opened');
        toggleClass(this.dom.shadow, '-visible');

        return this;
    }


    closeDropdown() {
        this.state.isOpened = false;

        removeClass(this.element, '-opened');
        removeClass(this.dom.shadow, '-visible');

        return this;
    }


    updateState(newSelectedIndex = 0) {
        this.state.selectedIndex = newSelectedIndex;
        this.dom.state.innerHTML = this.dom.optionsList[this.state.selectedIndex].innerHTML;
        this.dom.hiddenSelect.selectedIndex = this.state.selectedIndex.toString();

        aria.set(this.dom.select, 'activedescendant',
                    getAttribute(this.dom.optionsList[this.state.selectedIndex], 'id'));

        return this;
    }
};

