// -----------------------------------------------------------------------------
// CHECKS
// -----------------------------------------------------------------------------
// These functions should be used in components for better code readability
// and avoiding errors when some element does not exists.
//
// Here is the full list of utilities:
//  - isInPage(element)
//  - isNotInPage(element)
//  - ifExists(element, callback, printWarning = true)
//  - ifNodeList(element, callback, printWarning = true)
//  - isDescendant(parent, child)


import { console } from '../utils/console';


// Is in page
// ----------
// Returns true if elements is exists in a document.body and false otherwise

export function isInPage(element) {
    /* Use this instead of document.contains because IE has only partial support of Node.contains. */
    return (element === document.body) || document.body.contains(element);
};



// Is not in page
// --------------
// Returns false if element is exists in a document.body and true otherwise

export function isNotInPage(element) {
    return !isInPage(element);
};



// If exists
// ---------
// Executes callback function if the element exists in document.body
// and prints warning otherwise by default

export function ifExists(element, callback, printWarning = true) {
    if (isInPage(element)) {
        return callback();
    } else {
        if (printWarning) {
            console.warning('element does not exists');
        }

        return null;
    }
};



// If nodelist
// -----------
// If first parameter is NodeList or HTMLCollection or Array of HTMLElements
// executes callback function and prints warning otherwise by default

export function ifNodeList(x, callback, printWarning = true) {
    if (((x instanceof NodeList) || (x instanceof HTMLCollection)) && (x.length > 0)) {
        return callback();
    } else if ((x instanceof Array) && (x.length) > 0) {
        let isArrayOfElements = x.every((element) => {
            return (element instanceof HTMLElement);
        });

        if (isArrayOfElements) {
            return callback();
        }
    }
    
    if (printWarning) {
        console.warning('element is not an instance of NodeList or HTMLCollection');
    }

    return null;
};



// Is descendant
// -------------
// Returns true if the second element is a descendant of the first element and false otherwise

export function isDescendant(parent, child) {
    let node = child.parentNode;

    while (node != null) {
        if (node == parent) {
            return true;
        }

        node = node.parentNode;
    }

    return false;
};

