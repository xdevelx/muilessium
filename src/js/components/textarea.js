// -----------------------------------------------------------------------------
// TEXTAREA COMPONENT
// -----------------------------------------------------------------------------
// Methods list:
//  - (default) initAria()
//  - (default) initControls()


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
        
        this.domCache = extend(this.domCache, {
            textarea: element.querySelector('textarea'),
            labels:   element.parentNode.querySelectorAll('label')
        });

        this.initAria();
        this.initControls();
    }


    initAria() {
        const textareaId = getAttribute(this.domCache.textarea, 'id') || aria.setId(this.domCache.textarea);

        ifNodeList(this.domCache.labels, () => {
            aria.set(this.domCache.textarea, 'labelledby', aria.setId(this.domCache.labels[0]));

            forEach(this.domCache.labels, (label) => {
                setAttribute(label, 'for', textareaId);
            });
        }, false);

        return this;
    }


    initControls() {
        ifNodeList(this.domCache.labels, () => {
            forEach(this.domCache.labels, (label) => {
                onFocus(label, () => {
                    this.domCache.textarea.focus();
                });
            });
        }, false);

        onFocus(this.domCache.textarea,  this.focusEventHandler.bind(this));
        onBlur(this.domCache.textarea,   this.blurEventHandler.bind(this));

        this.domCache.textarea.addEventListener('change', this.changeEventHandler.bind(this));

        return this;
    }


    focusEventHandler() {
        addClass(this.domCache.element, '-focused');

        ifNodeList(this.domCache.labels, () => {
            makeElementsNotFocusable(this.domCache.labels);
        });
    }


    blurEventHandler() {
        removeClass(this.domCache.element, '-focused');

        ifNodeList(this.domCache.labels, () => {
            makeElementsFocusable(this.domCache.labels);
        });
    }


    changeEventHandler() {
        if (this.domCache.textarea.value == '') {
            removeClass(this.domCache.element, '-has-value');
        } else {
            addClass(this.domCache.element, '-has-value');
        }
    }
};

