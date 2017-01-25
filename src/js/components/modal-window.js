import * as Utils from '../utils';
import { Component } from '../component';


export class ModalWindow extends Component {
    constructor(element, options) {
        super(element, options);

        this.dom = Utils.extend(this.dom, {
            openers:   document.querySelectorAll(`[data-modal-opener=${this.element.getAttribute('id')}]`),
            modalWindow: this.element.getElementsByClassName('window')[0],
            closeIcon: this.element.getElementsByClassName('close-icon')[0],
            shadow:    this.element.getElementsByClassName('mui-shadow-toggle')[0]
        });

        this.state = Utils.extend(this.state, {
            visible: false
        });

        this.initAria();
        this.initControls();
    }


    initAria() {
        Utils.aria.set(this.element, 'hidden', true);

        return this;
    }


    initControls() {
        [].forEach.call(this.dom.openers, (opener) => {
            Utils.makeElementClickable(opener, this.openModal.bind(this));
        });

        Utils.makeElementClickable(this.dom.closeIcon, this.closeModal.bind(this));
        Utils.makeElementClickable(this.dom.shadow,    this.closeModal.bind(this));

        this.hammertime = new Hammer(this.dom.modalWindow);
        this.hammertime.get('pinch').set({ enable: true });
        this.hammertime.on('pinchout', this.closeModal.bind(this));

        return this;
    }


    openModal() {
        if (!this.state.visible) {
            Utils.addClass(this.element,    '-visible');
            Utils.addClass(this.dom.shadow, '-visible');
            
            Utils.aria.set(this.element, 'hidden', false);

            this.state.visible = true;
        }

        return this;
    }


    closeModal() {
        if (this.state.visible) {
            Utils.removeClass(this.element,    '-visible');
            Utils.removeClass(this.dom.shadow, '-visible');
            
            Utils.aria.set(this.element, 'hidden', true);

            this.state.visible = false;
        }

        return this;
    }
}
