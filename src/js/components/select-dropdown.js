import * as Utils from '../utils';
import { Component } from '../component';


const template = {
    open: '<div class="select" id="{{id}}"><div class="state"></div><ul class="mui-dropdown-options">',
    option: '<li class="option" data-value="{{value}}">{{text}}</li>',
    close: '</ul></div><div class="mui-shadow-toggle"></div>'
};


export class SelectDropdown extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.info(`creating mui-select-dropdown for the ${element} with options ${JSON.stringify(options)}`);

        let sourceSelect = element.getElementsByTagName('select')[0],
            sourceOptions = sourceSelect.options,
            sourceIconHTML = element.getElementsByClassName('icon')[0].outerHTML,
            newOptions = '';

        this.selectedIndex = sourceSelect.selectedIndex || 0;

        [].forEach.call(sourceOptions, function(option) {
            newOptions += template.option
                            .replace('{{value}}', option.value)
                            .replace('{{text}}', option.text);
        });

        element.innerHTML = template.open.replace('{{id}}', sourceSelect.id) +
                        newOptions +
                        template.close +
                        sourceIconHTML;

        this.dom = Utils.extend(this.dom, {
            select:  this.element.getElementsByClassName('select')[0],
            state:   this.element.getElementsByClassName('state')[0],
            options: this.element.getElementsByClassName('mui-dropdown-options')[0],
            shadow:  this.element.getElementsByClassName('mui-shadow-toggle')[0]
        });

        this.dom.optionsList = this.dom.options.getElementsByClassName('option');

        this.isOpened = false;
        this.updateState();

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

        this.state.initialized = true;
    }


    toggleDropdown() {
        Utils.toggleClass(this.element, '-opened');
        Utils.toggleClass(this.dom.shadow, '-visible');

        return this;
    }


    closeDropdown() {
        Utils.removeClass(this.element, '-opened');
        Utils.removeClass(this.dom.shadow, '-visible');

        return this;
    }


    updateState(newSelectedIndex = 0) {
        this.selectedIndex = newSelectedIndex;
        this.dom.state.innerHTML = this.dom.optionsList[this.selectedIndex].innerHTML;

        return this;
    }
}
