import * as Utils from '../utils';
import { Component } from '../component';

let template = {
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

        this.dom = {
            state:   this.element.getElementsByClassName('state')[0],
            options: this.element.getElementsByClassName('options')[0]
        };

        this.dom.optionsList = this.dom.options.getElementsByClassName('option');

        this.isOpened = false;
        this.updateState();

        let _this = this;

        this.dom.state.tabIndex = 1;

        this.dom.state.addEventListener('click', function() {
            _this.toggleDropdown();
        });

        this.dom.state.addEventListener('keyup', function(e) {
            if (e.keyCode == 13) {
                _this.toggleDropdown();
            }
        });

        [].forEach.call(this.dom.optionsList, function(option, index) {
            option.tabIndex = 1;

            option.addEventListener('click', function() {
                _this.updateState(index);
                _this.closeDropdown();
            });

            option.addEventListener('keyup', function(e) {
                if (e.keyCode == 13) {
                    _this.updateState(index);
                    _this.closeDropdown();
                }
            });
        });
    }

    toggleDropdown() {
        Utils.toggleClass(this.element, '-opened');
    }

    closeDropdown() {
        Utils.removeClass(this.element, '-opened');
    }

    updateState(newSelectedIndex = 0) {
        this.selectedIndex = newSelectedIndex;
        this.dom.state.innerHTML = this.dom.optionsList[this.selectedIndex].innerHTML;
    }
}
