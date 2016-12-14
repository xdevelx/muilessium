import * as Utils from '../utils';
import { Component } from '../component';


export class Tabs extends Component {
    constructor(element, options) {
        super(element, options);
        
        Utils.console.log('creating mui-tabs for ' + element +
                      ' with options ' + JSON.stringify(options));

        this.dom = Utils.extend(this.dom, {
            tabs: this.element.getElementsByClassName('tab'),
            labels: this.element.getElementsByClassName('label')
        });

        this.state = Utils.extend(this.state, {
            current: 0
        });

        Utils.addClass(this.dom.tabs[0],   '-active');
        Utils.addClass(this.dom.labels[0], '-active');

        Utils.makeChildElementsClickable(this.element, this.dom.labels, (index) => {
            this.makeTabInactive(this.state.current);
            this.makeTabActive(index);
        });

        [].forEach.call(this.dom.labels, (label, index) => {
            if (index !== this.state.current) {
                Utils.makeElementNotFocusable(label);
            }

            label.addEventListener('keydown', (e) => {
                this.keyDownListener(e.keyCode);
            });
        });

        this.state.initialized = true;
    }

    makeTabActive(index) {
        Utils.addClass(this.dom.labels[index], '-active');
        Utils.addClass(this.dom.tabs[index],   '-active');
        Utils.aria.set(this.dom.labels[index], 'selected', true);
        Utils.aria.set(this.dom.tabs[index], 'hidden', false);
        
        Utils.makeElementFocusable(this.dom.labels[index]);
        this.dom.labels[index].focus();

        this.state.current = index;

        return this;
    }

    makeTabInactive(index) {
        Utils.removeClass(this.dom.labels[index], '-active');
        Utils.removeClass(this.dom.tabs[index],   '-active');
        Utils.aria.set(this.dom.labels[index], 'selected', false);
        Utils.aria.set(this.dom.tabs[index], 'hidden', true);

        this.dom.labels[index].blur();
        Utils.makeElementNotFocusable(this.dom.labels[index]);

        return this;
    }

    goToPreviousTab() {
        if (this.state.current > 0) {
            this.makeTabInactive(this.state.current);
            this.makeTabActive(this.state.current - 1);
        }

        return this;
    }

    goToNextTab() {
        if (this.state.current < this.dom.tabs.length - 1) {
            this.makeTabInactive(this.state.current);
            this.makeTabActive(this.state.current + 1);
        }

        return this;
    }

    keyDownListener(keyCode) {
        switch (keyCode) {
            case 37: // Arrow Left
                this.goToPreviousTab();
                break;
            case 39: // Arrow Right
                this.goToNextTab();
                break;
            default:
                break;
        }

        return this;
    }
}
