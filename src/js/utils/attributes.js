// -----------------------------------------------------------------------------
// HTML ATTRIBUTES
// -----------------------------------------------------------------------------
// These functions should be used in components for better code readability and
// avoiding errors when selected element does not exists.
//
// Here is the ful list of utilities for manipulating with attributes:
//  - setAttribute(element, attribute, value)
//  - getAttribute(element, attribute, defaultValue)
//  - removeAttribute(element, attribute)


import { ifExists } from '../utils/checks';



// Set attribute
// -------------
// Sets attribute to the element if it exists

export function setAttribute(element, attribute, value) {
    return ifExists(element, () => {
        return element.setAttribute(attribute, value);
    });
};



// Get attribute
// -------------
// Gets attribute from the element if it exists

export function getAttribute(element, attribute, defaultValue) {
    return ifExists(element, () => {
        return (element.getAttribute(attribute) || defaultValue);
    });
};



// Remove attribute
// -------------
// Removes attribute from the element if it exists

export function removeAttribute(element, attribute) {
    return ifExists(element, () => {
        return element.removeAttribute(attribute);
    });
};

