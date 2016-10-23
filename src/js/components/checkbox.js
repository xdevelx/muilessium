import * as Utils from '../utils';
import { Component } from '../component';

export class Checkbox extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log('creating mui-checkbox for ' + element +
                        ' with options ' + JSON.stringify(options));

        this.dom = {
            input: element.getElementsByTagName('input')[0],
            label: element.getElementsByTagName('label')[0]
        };

        let _this = this;

        Utils.makeElementClickable(this.dom.label, function() {
            _this.dom.input.checked = !_this.dom.input.checked;
            Utils.toggleClass(element, '-checked');
        });
    }
}
