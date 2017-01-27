import * as Keyboard from '../controls/keyboard';
import * as TouchScreen from '../controls/touchscreen';
import * as Utils from '../utils';
import { Component } from '../component';


export class Tabs extends Component {
    constructor(element, options) {
        super(element, options);
        
        this.dom = Utils.extend(this.dom, {
            tabs: this.element.getElementsByClassName('tab'),
            labels: this.element.getElementsByClassName('label'),
            labelsWrapper: this.element.getElementsByClassName('labels')[0]
        });

        this.state = Utils.extend(this.state, {
            current: 0
        });

        this.initAria();
        this.initControls();
    }


    initAria() {
        Utils.aria.setRole(this.dom.labelsWrapper, 'tablist');

        [].forEach.call(this.dom.labels, (label, index) => {
            Utils.aria.setRole(label, 'tab');
            Utils.aria.set(label, 'selected', false);
            Utils.aria.set(label, 'controls', Utils.aria.setId(this.dom.tabs[index]));
        });

        [].forEach.call(this.dom.tabs, (tab, index) => {
            Utils.aria.setRole(tab, 'tabpanel');
            Utils.aria.set(tab, 'hidden', true);
            Utils.aria.set(tab, 'labelledby', Utils.aria.setId(this.dom.labels[index]));
        });

        Utils.addClass(this.dom.tabs[0],   '-active');
        Utils.aria.set(this.dom.tabs[0],   'hidden', false);
        Utils.addClass(this.dom.labels[0], '-active');
        Utils.aria.set(this.dom.labels[0], 'selected', true);
        
        return this;
    }


    initControls() {
        Utils.makeChildElementsClickable(this.element, this.dom.labels, (index) => {
            this.makeTabInactive(this.state.current);
            this.makeTabActive(index);
        });

        [].forEach.call(this.dom.labels, (label, index) => {
            if (index !== this.state.current) {
                Utils.makeElementNotFocusable(label);
            }

            Keyboard.onArrowLeftPressed(label, this.goToPreviousTab.bind(this));
            Keyboard.onArrowRightPressed(label, this.goToNextTab.bind(this));
        });

        TouchScreen.onSwipeRight(this.element, this.goToPreviousTab.bind(this));
        TouchScreen.onSwipeLeft(this.element, this.goToNextTab.bind(this));

        return this;
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


    keyDownHandler(keyCode) {
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
};

