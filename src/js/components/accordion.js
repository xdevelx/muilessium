import * as Utils from '../utils';
import { Component } from '../component';


export class Accordion extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log('creating mui-accordion for ' + element +
                        ' with options ' + JSON.stringify(options));

        this.dom = Utils.extend(this.dom, {
            items:  element.getElementsByClassName('item'),
            titles: element.getElementsByClassName('title'),
            contents: element.getElementsByClassName('content')
        });

        Utils.makeChildElementsClickable(this.element, this.dom.titles, (index) => {
            this.toggleItem(index);
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
