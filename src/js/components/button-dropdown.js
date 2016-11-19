import * as Utils from '../utils';
import { Button } from './button';


export class ButtonDropdown extends Button {
    constructor(element, options) {
        super(element, options);

        Utils.console.log('creating mui-button-dropdown for ' + element +
                        ' with options ' + JSON.stringify(options));


        this.dom = Utils.extend(this.dom, {
            button:   element.getElementsByClassName('mui-button')[0],
            dropdown: element.getElementsByClassName('mui-dropdown-options')[0],
            shadow:   element.getElementsByClassName('mui-shadow-toggle')[0]
        });

        let _this = this;

        Utils.makeElementClickable(this.dom.button, () => {
            Utils.toggleClass(element, '-opened');
            Utils.toggleClass(_this.dom.shadow, '-visible');
        });

        Utils.makeElementClickable(this.dom.shadow, () => {
            Utils.toggleClass(element, '-opened');
            Utils.toggleClass(_this.dom.shadow, '-visible');
        });

        this.state.initialized = true;
    }
}
