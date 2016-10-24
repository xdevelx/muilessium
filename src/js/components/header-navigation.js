import * as Utils from '../utils';
import { Component } from '../component';

export class HeaderNavigation extends Component {
    constructor(element, options) {
        super(element, options);
        
        Utils.console.log('creating mui-header-navigation for ' + element +
                      ' with options ' + JSON.stringify(options));

        this.dom = {
            toggles: element.getElementsByClassName('mui-navigation-toggle'),
            shadow: element.getElementsByClassName('-shadow')[0]
        };

        this.state = {
            opened: false
        };

        let _this = this;

        Utils.makeChildElementsClickable(this.element, this.dom.toggles, function() {
            _this.state.opened = !_this.state.opened;

            _this.dom.shadow.tabIndex = _this.state.opened ? 1 : 0;

            Utils.toggleClass(_this.element, '-opened');
        });
    }
}
