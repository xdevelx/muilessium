import * as Utils from '../utils';
import { Component } from '../component';


export class Textarea extends Component {
    constructor(element, options) {
        super(element, options);
        
        this.dom = Utils.extend(this.dom, {
            textarea: element.getElementsByTagName('textarea')[0],
            labels: element.parentNode.getElementsByTagName('label')
        });

        this.initAria();
        this.initControls();
    }


    initAria() {
        const textareaId = this.dom.textarea.getAttribute('id') || Utils.aria.setId(this.dom.textarea);

        Utils.ifNodeList(this.dom.labels, () => {
            Utils.aria.set(this.dom.textarea, 'labelledby', Utils.aria.setId(this.dom.labels[0]));

            [].forEach.call(this.dom.labels, (label) => {
                label.setAttribute('for', textareaId);
            });
        }, false);

        return this;
    }


    initControls() {
        Utils.ifNodeList(this.dom.labels, () => {
            [].forEach.call(this.dom.labels, (label) => {
                label.addEventListener('focus', () => {
                    this.dom.textarea.focus();
                });
            });
        }, false);

        this.dom.textarea.addEventListener('focus',  this.focusEventListener.bind(this));
        this.dom.textarea.addEventListener('blur',   this.blurEventListener.bind(this));
        this.dom.textarea.addEventListener('change', this.changeEventListener.bind(this));

        return this;
    }


    focusEventListener() {
        Utils.addClass(this.element, '-focused');

        Utils.ifNodeList(this.dom.labels, () => {
            Utils.makeElementsNotFocusable(this.dom.labels);
        });
    }


    blurEventListener() {
        Utils.removeClass(this.element, '-focused');

        Utils.ifNodeList(this.dom.labels, () => {
            Utils.makeElementsFocusable(this.dom.labels);
        });
    }


    changeEventListener() {
        if (this.dom.textarea.value == '') {
            Utils.removeClass(this.element, '-has-value');
        } else {
            Utils.addClass(this.element, '-has-value');
        }
    }
}
