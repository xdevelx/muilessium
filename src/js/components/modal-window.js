// -----------------------------------------------------------------------------
// MODAL WINDOW COMPONENT
// -----------------------------------------------------------------------------
// Methods list:
//  - (default) initAria()
//  - (default) initControls()
//  - openModal()
//  - closeModal()


import { Component } from '../component';

import * as Keyboard from '../controls/keyboard';
import * as TouchScreen from '../controls/touchscreen';

import { aria                 } from '../utils/aria';
import { addClass             } from '../utils/classes';
import { removeClass          } from '../utils/classes';
import { makeElementFocusable } from '../utils/focus-and-click';
import { makeElementClickable } from '../utils/focus-and-click';
import { extend               } from '../utils/uncategorized';
import { forEach              } from '../utils/uncategorized';



export class ModalWindow extends Component {
    constructor(element, options) {
        super(element, options);

        this.domCache = extend(this.domCache, {
            openers:     document.querySelectorAll(`[data-modal-opener=${element.getAttribute('id')}]`),
            modalWindow: element.querySelector('.window'),
            closeIcon:   element.querySelector('.close-icon'),
            shadow:      element.querySelector('.mui-shadow-toggle')
        });

        this.state = extend(this.state, {
            visible: false,
            savedOpener: null
        });

        this.initAria();
        this.initControls();
    }


    initAria() {
        aria.set(this.domCache.element, 'hidden', true);
        aria.set(this.domCache.shadow,  'hidden', true);

        return this;
    }


    initControls() {
        forEach(this.domCache.openers, (opener) => {
            makeElementClickable(opener, () => {
                this.state.savedOpener = opener;
                this.openModal();
            });

            /* Not sure it is good idea to open modal on space pressed, need tests. */
            Keyboard.onSpacePressed(opener, () => {
                this.state.savedOpened = opener;
                this.openModal();
            });
        });

        makeElementFocusable(this.domCache.modalWindow);

        Keyboard.onTabPressed(this.domCache.modalWindow, this.closeModal.bind(this));
        
        makeElementClickable(this.domCache.closeIcon, this.closeModal.bind(this),
                        { mouse: true, keyboard: false });
        makeElementClickable(this.domCache.shadow,    this.closeModal.bind(this),
                        { mouse: true, keyboard: false });

        TouchScreen.onPinchOut(this.domCache.modalWindow, this.closeModal.bind(this));

        return this;
    }


    openModal() {
        if (!this.state.visible) {
            addClass(this.domCache.element,    '-visible');
            addClass(this.domCache.shadow, '-visible');
            
            aria.set(this.domCache.element, 'hidden', false);

            this.domCache.modalWindow.focus();

            this.state.visible = true;
        }

        return this;
    }


    closeModal() {
        if (this.state.visible) {
            removeClass(this.domCache.element,    '-visible');
            removeClass(this.domCache.shadow, '-visible');
            
            aria.set(this.domCache.element, 'hidden', true);

            this.state.visible = false;

            if (this.state.savedOpener) {
                this.state.savedOpener.focus();
                this.state.savedOpener = null;
            }
        }

        return this;
    }
};

