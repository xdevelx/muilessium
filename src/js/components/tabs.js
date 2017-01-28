import { Component } from '../component';

import * as Keyboard from '../controls/keyboard';
import * as TouchScreen from '../controls/touchscreen';

import {
    aria
} from '../utils/aria';

import {
    addClass,
    removeClass
} from '../utils/classes';

import {
    makeChildElementsClickable,
    makeElementNotFocusable,
    makeElementFocusable
} from '../utils/focus-and-click';

import {
    extend,
    forEach
} from '../utils/uncategorized';



export class Tabs extends Component {
    constructor(element, options) {
        super(element, options);
        
        this.dom = extend(this.dom, {
            tabs:          this.element.querySelectorAll('.tab'),
            labels:        this.element.querySelectorAll('.label'),
            labelsWrapper: this.element.querySelector('.labels')
        });

        this.state = extend(this.state, {
            current: 0
        });

        this.initAria();
        this.initControls();
    }


    initAria() {
        aria.setRole(this.dom.labelsWrapper, 'tablist');

        forEach(this.dom.labels, (label, index) => {
            aria.setRole(label, 'tab');
            aria.set(label, 'selected', false);
            aria.set(label, 'controls', aria.setId(this.dom.tabs[index]));
        });

        forEach(this.dom.tabs, (tab, index) => {
            aria.setRole(tab, 'tabpanel');
            aria.set(tab, 'hidden', true);
            aria.set(tab, 'labelledby', aria.setId(this.dom.labels[index]));
        });

        addClass(this.dom.tabs[0],   '-active');
        aria.set(this.dom.tabs[0],   'hidden', false);
        addClass(this.dom.labels[0], '-active');
        aria.set(this.dom.labels[0], 'selected', true);
        
        return this;
    }


    initControls() {
        makeChildElementsClickable(this.element, this.dom.labels, (index) => {
            this.makeTabInactive(this.state.current);
            this.makeTabActive(index);
        });

        forEach(this.dom.labels, (label, index) => {
            if (index !== this.state.current) {
                makeElementNotFocusable(label);
            }

            Keyboard.onArrowLeftPressed(label, this.goToPreviousTab.bind(this));
            Keyboard.onArrowRightPressed(label, this.goToNextTab.bind(this));
        });

        TouchScreen.onSwipeRight(this.element, this.goToPreviousTab.bind(this));
        TouchScreen.onSwipeLeft(this.element, this.goToNextTab.bind(this));

        return this;
    }


    makeTabActive(index) {
        addClass(this.dom.labels[index], '-active');
        addClass(this.dom.tabs[index],   '-active');

        aria.set(this.dom.labels[index], 'selected', true);
        aria.set(this.dom.tabs[index], 'hidden', false);
        
        makeElementFocusable(this.dom.labels[index]);
        this.dom.labels[index].focus();

        this.state.current = index;

        return this;
    }


    makeTabInactive(index) {
        removeClass(this.dom.labels[index], '-active');
        removeClass(this.dom.tabs[index],   '-active');

        aria.set(this.dom.labels[index], 'selected', false);
        aria.set(this.dom.tabs[index], 'hidden', true);

        this.dom.labels[index].blur();
        makeElementNotFocusable(this.dom.labels[index]);

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
};

