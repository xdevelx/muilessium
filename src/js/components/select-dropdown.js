import * as Utils from '../utils';
import { Component } from '../component';


export class SelectDropdown extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log(`creating mui-select-dropdown for the <${element.nodeName}> with options ${JSON.stringify(options)}`);

        this.dom = Utils.extend(this.dom, {
            labels:      this.element.parentNode.getElementsByTagName('label'),
            select:      this.element.getElementsByClassName('select')[0],
            state:       this.element.getElementsByClassName('state')[0],
            options:     this.element.getElementsByClassName('mui-dropdown-options')[0],
            optionsList: this.element.getElementsByClassName('option'),
            shadow:      this.element.getElementsByClassName('mui-shadow-toggle')[0],
            icon:        this.element.getElementsByClassName('icon')[0]
        });

        this.state = Utils.extend(this.state, {
            selectedIndex: this.getSelectedIndex(),
            isOpened: false
        });

        this.createHiddenSelect();
        this.initAria();
        this.initControls();
        this.updateState();

        Utils.console.ok('select-dropdown has been created');
    }


    createHiddenSelect() {
        let hiddenSelect = document.createElement('select'),
            id = this.dom.select.getAttribute('data-id');

        hiddenSelect.setAttribute('id', id);
        hiddenSelect.setAttribute('name', id);

        this.element.appendChild(hiddenSelect);
        this.dom.hiddenSelect = hiddenSelect;

        Utils.addClass(this.dom.hiddenSelect, '_hidden');
        Utils.aria.set(this.dom.hiddenSelect, 'hidden', true);

        [].forEach.call(this.dom.optionsList, (option) => {
            let hiddenOption = document.createElement('option');

            hiddenOption.value = option.getAttribute('data-value');
            
            this.dom.hiddenSelect.add(hiddenOption);
        });

        return this;
    }


    initAria() {
        Utils.aria.setRole(this.dom.select, 'listbox');

        [].forEach.call(this.dom.optionsList, (option) => {
            Utils.aria.setRole(option, 'option');
            Utils.aria.setId(option);
        });

        Utils.aria.set(this.dom.select, 'activedescendant',
                    this.dom.optionsList[this.state.selectedIndex].getAttribute('id'));
        Utils.aria.set(this.dom.state, 'hidden', true);
        Utils.aria.set(this.dom.icon, 'hidden', true);

        Utils.ifNodeList(this.dom.labels, () => {
            let selectId = Utils.aria.setId(this.dom.select);

            [].forEach.call(this.dom.labels, (label) => {
                label.setAttribute('for', selectId);
            });

            Utils.aria.set(this.dom.select, 'labelledby', Utils.aria.setId(this.dom.labels[0]));
        });

        return this;
    }

    
    initControls() { 
        Utils.makeElementClickable(this.dom.select, () => {
            this.toggleDropdown();
        });

        Utils.makeElementClickable(this.dom.shadow, () => {
            this.toggleDropdown();
        });

        Utils.makeChildElementsClickable(this.element, this.dom.optionsList, (index) => {
            this.updateState(index);
            this.closeDropdown();
        });

        Utils.ifNodeList(this.dom.labels, () => {
            [].forEach.call(this.dom.labels, (label) => {
                label.addEventListener('focus', () => {
                    this.dom.select.focus();
                });
            });

            this.dom.select.addEventListener('focus', () => {
                Utils.makeElementsNotFocusable(this.dom.labels);
            });

            this.dom.select.addEventListener('blur', () => {
                Utils.makeElementsFocusable(this.dom.labels);
            });
            
        });

        return this;
    }


    getSelectedIndex() {
        for (let i = 0; i < this.dom.options.length; i++) {
            if (Utils.hasClass(this.dom.options[i], '-selected')) {
                return i;
            }
        }

        return 0;
    }

    openDropdown() {
        Utils.console.log(`openeng select dropdown`);

        this.state.isOpened = true;

        Utils.addClass(this.element, '-opened');
        Utils.addClass(this.dom.shadow, '-visible');

        return this;
    }

    toggleDropdown() {
        Utils.console.log(`toggling select dropdown`);

        this.state.isOpened = !this.state.isOpened;

        Utils.toggleClass(this.element, '-opened');
        Utils.toggleClass(this.dom.shadow, '-visible');

        return this;
    }


    closeDropdown() {
        Utils.console.log(`closing select dropdown`);

        this.state.isOpened = false;

        Utils.removeClass(this.element, '-opened');
        Utils.removeClass(this.dom.shadow, '-visible');

        return this;
    }


    updateState(newSelectedIndex = 0) {
        Utils.console.log(`updating select dropdown state to the #${newSelectedIndex} option selected`);

        this.state.selectedIndex = newSelectedIndex;
        this.dom.state.innerHTML = this.dom.optionsList[this.state.selectedIndex].innerHTML;
        this.dom.hiddenSelect.selectedIndex = this.state.selectedIndex.toString();

        Utils.aria.set(this.dom.select, 'activedescendant',
                    this.dom.optionsList[this.state.selectedIndex].getAttribute('id'));

        return this;
    }
}
