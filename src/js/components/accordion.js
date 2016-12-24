import * as Utils from '../utils';
import { Component } from '../component';


export class Accordion extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log(`creating acccordion for the <${element.nodeName}> with options ${JSON.stringify(options)}`);

        this.dom = Utils.extend(this.dom, {
            items:      element.getElementsByClassName('item'),
            titles:     element.getElementsByClassName('title'),
            indicators: element.getElementsByClassName('indicator'),
            contents:   element.getElementsByClassName('content')
        });

        this.initAria();
        this.initControls();

        Utils.console.ok('accordion has been created');
    }


    initAria() {
        Utils.aria.setRole(this.element, 'tablist');
        Utils.setAttribute(this.element, 'multiselectable', true);
        
        [].forEach.call(this.dom.titles, (title, index) => {
            Utils.aria.setRole(title, 'tab');
            Utils.aria.set(title, 'expanded', false);
            Utils.aria.set(title, 'controls', Utils.aria.setId(this.dom.contents[index]));
        });

        [].forEach.call(this.dom.contents, (content, index) => {
            Utils.aria.setRole(content, 'tabpanel');
            Utils.aria.set(content, 'hidden', true);
            Utils.aria.set(content, 'labelledby', Utils.aria.setId(this.dom.titles[index]));
        });

        [].forEach.call(this.dom.indicators, (indicator) => {
            Utils.aria.set(indicator, 'hidden', true);
        });

        return this;
    }


    initControls() {
        Utils.makeChildElementsClickable(this.element, this.dom.titles, (index) => {
            this.titleClickEventListener(index);
        });

        return this;
    }


    titleClickEventListener(index) {
        Utils.console.elog(`title of the item #${index} has been clicked`);

        this.toggleItem(index);
    }


    foldItem(index) {
        Utils.console.log(`folding item #${index} of the accordion ${this.element}`);

        Utils.removeClass(this.dom.items[index], '-unfold');

        Utils.aria.set(this.dom.titles[index],   'expanded', false);
        Utils.aria.set(this.dom.contents[index], 'hidden',   true);

        return this;
    }


    foldAllItems() {
        Utils.console.log(`folding all items of the accordion ${this.element}`);

        [].forEach.call(this.dom.items, (item, index) => {
            this.foldItem(index);
        });

        return this;
    }


    unfoldItem(index) {
        Utils.console.log(`unfolding item #${index} of the accordion ${this.element}`);

        Utils.addClass(this.dom.items[index], '-unfold');

        Utils.aria.set(this.dom.titles[index],   'expanded', true);
        Utils.aria.set(this.dom.contents[index], 'hidden',   false);

        return this;
    }


    unfoldAllItems() {
        Utils.console.log(`folding all items of the accordion ${this.element}`);

        [].forEach.call(this.dom.items, (item, index) => {
            this.unfoldItem(index);
        });

        return this;
    }


    toggleItem(index) {
        Utils.console.log(`toggling item #${index} of the accordion ${this.element}`);

        Utils.toggleClass(this.dom.items[index], '-unfold');

        Utils.aria.toggleState(this.dom.titles[index],   'expanded');
        Utils.aria.toggleState(this.dom.contents[index], 'hidden');

        return this;
    }
}
