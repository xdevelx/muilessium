// -----------------------------------------------------------------------------
// Manipulating with Focus & Click
// -----------------------------------------------------------------------------


import { ifExists       } from '../utils/checks';
import { ifNodeList     } from '../utils/checks';
import { isDescendant   } from '../utils/checks';
import { onClick        } from '../controls/mouse';
import { onEnterPressed } from '../controls/keyboard';


// Make element focusable
// ----------------------
// Sets tabindex=0 to the element if it exists

export function makeElementFocusable(element) {
    return ifExists(element, () => {
        element.tabIndex = 0;
    });
};



// Make multiple elements focusable
// --------------------------------
// Sets tabindex=0 to the multiple elements in NodeList

export function makeElementsFocusable(elements) {
    return ifNodeList(elements, () => {
        [].forEach.call(elements, (element) => {
            makeElementFocusable(element);
        });
    });
};



// Make element not focusable
// --------------------------
// Sets tabindex=-1 to the element

export function makeElementNotFocusable(element) {
    return ifExists(element, () => {
        element.tabIndex = -1;
    });
};



// Make multiple elements not focusable
// ------------------------------------
// Sets tabindex=-1 to the multiple elements in NodeList

export function makeElementsNotFocusable(elements) {
    return ifNodeList(elements, () => {
        [].forEach.call(elements, (element) => {
            makeElementNotFocusable(element);
        });
    });
};



// Make element clickable
// ----------------------
// Sets tabindex=0 to the element and adds event listeners for the click and
// enter key press with callback to the element if it exists

export function makeElementClickable(element, callback) {
    return ifExists(element, () => {
        element.tabIndex = 0;

        onClick(element, (e) => {
            callback(e);
        });

        onEnterPressed(element, (e) => {
            callback(e);
        });
    });
};



// Make childs clickable
// ----------------------
// Sets tabindex=0 to the child elements of the selected element
// and adds event listeners for the click and enter key press
// with callback to the childs if they exists

export function makeChildElementsClickable(element, childs, callback, mouseOnly = false) {
    return ifExists(element, () => {
        return ifNodeList(childs, () => {
            onClick(element, (e) => {
                let index = -1;

                [].forEach.call(childs, (child, i) => {
                    if ((child == e.target) || isDescendant(child, e.target)) {
                        index = i;
                    }
                });

                if (index >= 0) {
                    callback(index);
                }
            });

            if (!mouseOnly) {
                [].forEach.call(childs, (child) => {
                    child.tabIndex = 0;
                });

                onEnterPressed(element, (e) => {
                    let index = [].indexOf.call(childs, e.target);

                    if (index >= 0) {
                        callback(index);
                    }
                });
            }
        });
    });
};

