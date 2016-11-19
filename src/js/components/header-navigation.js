import * as Utils from '../utils';
import { Component } from '../component';


export class HeaderNavigation extends Component {
    constructor(element, options) {
        super(element, options);
        
        Utils.console.log('creating mui-header-navigation for ' + element +
                      ' with options ' + JSON.stringify(options));

        this.dom = Utils.extend(this.dom, {
            toggles: element.getElementsByClassName('mui-navigation-toggle'),
            shadow: element.getElementsByClassName('mui-shadow-toggle')[0]
        });

        this.state = Utils.extend(this.state, {
            opened: false
        });

        Utils.makeChildElementsClickable(this.element, this.dom.toggles, () => {
            this.toggleNavigation();
        });

        this.state.initialized = true;
    }


    openNavigation() {
        this.state.opened = true;
        this.dom.shadow.tabIndex = 1;

        Utils.addClass(this.element,    '-opened');
        Utils.addClass(this.dom.shadow, '-visible');

        return this;
    }


    closeNavigation() {
        this.state.opened = false;
        this.dom.shadow.tabIndex = -1;

        Utils.removeClass(this.element,    '-opened');
        Utils.removeClass(this.dom.shadow, '-visible');

        return this;
    }
    
    toggleNavigation() {
        this.state.opened = !this.state.opened;

        this.dom.shadow.tabIndex = this.state.opened ? 1 : -1;

        Utils.toggleClass(this.element,    '-opened');
        Utils.toggleClass(this.dom.shadow, '-visible');

        return this;
    }
}
