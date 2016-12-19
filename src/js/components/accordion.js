import * as Utils from '../utils';
import { Component } from '../component';


export class Accordion extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.info(`creating acccordion for the ${element} with options ${JSON.stringify(options)}`);

        this.dom = Utils.extend(this.dom, {
            items:  element.getElementsByClassName('item'),
            titles: element.getElementsByClassName('title'),
            indicators: element.getElementsByClassName('indicator'),
            contents: element.getElementsByClassName('content')
        });

        Utils.makeChildElementsClickable(this.element, this.dom.titles, (index) => {
            this.toggleItem(index);
        });

        Utils.aria.setRole(this.element, 'tablist');
        this.element.setAttribute('multiselectable', true);
        
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
            Utils.aria.set(indicator.getElementsByClassName('fa')[0], 'hidden', true);
        });


        this.state.initialized = true;
    }

    foldItem(index) {
        Utils.removeClass(this.dom.items[index], '-unfold');

        Utils.aria.set(this.dom.titles[index],   'expanded', false);
        Utils.aria.set(this.dom.contents[index], 'hidden',   true);

        return this;
    }

    foldAllItems() {
        [].forEach.call(this.dom.items, (item, index) => {
            this.foldItem(index);
        });

        return this;
    }

    unfoldItem(index) {
        Utils.addClass(this.dom.items[index], '-unfold');

        Utils.aria.set(this.dom.titles[index],   'expanded', true);
        Utils.aria.set(this.dom.contents[index], 'hidden',   false);

        return this;
    }

    unfoldAllItems() {
        [].forEach.call(this.dom.items, (item, index) => {
            this.unfoldItem(index);
        });

        return this;
    }

    toggleItem(index) {
        Utils.toggleClass(this.dom.items[index], '-unfold');

        Utils.aria.toggleState(this.dom.titles[index],   'expanded');
        Utils.aria.toggleState(this.dom.contents[index], 'hidden');

        return this;
    }
}
