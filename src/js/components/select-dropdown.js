import * as Utils from '../utils';
import { Component } from '../component';


const template = {
    open: '<div class="select" id="{{id}}"><div class="state"></div><ul class="options">',
    option: '<li class="option" value="{{value}}">{{text}}</li>',
    close: '</ul></div>'
};


export class SelectDropdown extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log('creating mui-select-dropdown for ' + element +
                        ' with options ' + JSON.stringify(options));

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
            options: this.element.getElementsByClassName('options')[0]
        });

        this.dom.optionsList = this.dom.options.getElementsByClassName('option');

        this.isOpened = false;
        this.updateState();

        let _this = this;

        Utils.makeElementClickable(this.dom.select, () => {
            _this.toggleDropdown();
        });

        Utils.makeChildElementsClickable(this.element, this.dom.optionsList, (index) => {
            _this.updateState(index);
            _this.closeDropdown();
        });

        this.state.initialized = true;
    }


    toggleDropdown() {
        Utils.toggleClass(this.element, '-opened');

        return this;
    }


    closeDropdown() {
        Utils.removeClass(this.element, '-opened');

        return this;
    }


    updateState(newSelectedIndex = 0) {
        this.selectedIndex = newSelectedIndex;
        this.dom.state.innerHTML = this.dom.optionsList[this.selectedIndex].innerHTML;

        return this;
    }
}
