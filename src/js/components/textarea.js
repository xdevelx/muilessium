import { Component } from '../component';

import { aria                     } from '../utils/aria';
import { setAttribute             } from '../utils/attributes';
import { getAttribute             } from '../utils/attributes';
import { ifNodeList               } from '../utils/checks';
import { addClass                 } from '../utils/classes';
import { removeClass              } from '../utils/classes';
import { makeElementsFocusable    } from '../utils/focus-and-click';
import { makeElementsNotFocusable } from '../utils/focus-and-click';
import { onFocus                  } from '../utils/focus-and-click';
import { onBlur                   } from '../utils/focus-and-click';
import { extend                   } from '../utils/uncategorized';
import { forEach                  } from '../utils/uncategorized';



export class Textarea extends Component {
    constructor(element, options) {
        super(element, options);
        
        this.dom = extend(this.dom, {
            textarea: element.querySelector('textarea'),
            labels:   element.parentNode.querySelectorAll('label')
        });

        this.initAria();
        this.initControls();
    }


    initAria() {
        const textareaId = getAttribute(this.dom.textarea, 'id') || aria.setId(this.dom.textarea);

        ifNodeList(this.dom.labels, () => {
            aria.set(this.dom.textarea, 'labelledby', aria.setId(this.dom.labels[0]));

            forEach(this.dom.labels, (label) => {
                setAttribute(label, 'for', textareaId);
            });
        }, false);

        return this;
    }


    initControls() {
        ifNodeList(this.dom.labels, () => {
            forEach(this.dom.labels, (label) => {
                onFocus(label, () => {
                    this.dom.textarea.focus();
                });
            });
        }, false);

        onFocus(this.dom.textarea,  this.focusEventHandler.bind(this));
        onBlur(this.dom.textarea,   this.blurEventHandler.bind(this));

        this.dom.textarea.addEventListener('change', this.changeEventHandler.bind(this));

        return this;
    }


    focusEventHandler() {
        addClass(this.element, '-focused');

        ifNodeList(this.dom.labels, () => {
            makeElementsNotFocusable(this.dom.labels);
        });
    }


    blurEventHandler() {
        removeClass(this.element, '-focused');

        ifNodeList(this.dom.labels, () => {
            makeElementsFocusable(this.dom.labels);
        });
    }


    changeEventHandler() {
        if (this.dom.textarea.value == '') {
            removeClass(this.element, '-has-value');
        } else {
            addClass(this.element, '-has-value');
        }
    }
};

