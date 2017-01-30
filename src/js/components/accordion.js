import { Component } from '../component';

import { aria                               } from '../utils/aria';
import { setAttribute                       } from '../utils/attributes';
import { addClass, removeClass, toggleClass } from '../utils/classes';
import { makeChildElementsClickable         } from '../utils/focus-and-click';
import { extend, forEach                    } from '../utils/uncategorized';



export class Accordion extends Component {
    constructor(element, options) {
        super(element, options);

        this.dom = extend(this.dom, {
            items:      element.querySelectorAll('.item'),
            titles:     element.querySelectorAll('.title'),
            indicators: element.querySelectorAll('.indicator'),
            contents:   element.querySelectorAll('.content')
        });

        this.initAria();
        this.initControls();
    }


    initAria() {
        aria.setRole(this.element, 'tablist');
        setAttribute(this.element, 'multiselectable', true);
        
        forEach(this.dom.titles, (title, index) => {
            aria.setRole(title, 'tab');
            aria.set(title, 'expanded', false);
            aria.set(title, 'controls', aria.setId(this.dom.contents[index]));
        });

        forEach(this.dom.contents, (content, index) => {
            aria.setRole(content, 'tabpanel');
            aria.set(content, 'hidden', true);
            aria.set(content, 'labelledby', aria.setId(this.dom.titles[index]));
        });

        forEach(this.dom.indicators, (indicator) => {
            aria.set(indicator, 'hidden', true);
        });

        return this;
    }


    initControls() {
        makeChildElementsClickable(this.element, this.dom.titles, (index) => {
            this.toggleItem(index);
        });

        return this;
    }


    foldItem(index) {
        removeClass(this.dom.items[index], '-unfold');

        aria.set(this.dom.titles[index],   'expanded', false);
        aria.set(this.dom.contents[index], 'hidden',   true);

        return this;
    }


    foldAllItems() {
        forEach(this.dom.items, (item, index) => {
            this.foldItem(index);
        });

        return this;
    }


    unfoldItem(index) {
        addClass(this.dom.items[index], '-unfold');

        aria.set(this.dom.titles[index],   'expanded', true);
        aria.set(this.dom.contents[index], 'hidden',   false);

        return this;
    }


    unfoldAllItems() {
        forEach(this.dom.items, (item, index) => {
            this.unfoldItem(index);
        });

        return this;
    }


    toggleItem(index) {
        toggleClass(this.dom.items[index], '-unfold');

        aria.toggleState(this.dom.titles[index],   'expanded');
        aria.toggleState(this.dom.contents[index], 'hidden');

        return this;
    }
};

