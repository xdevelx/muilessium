// -----------------------------------------------------------------------------
// Manipulating CSS classes
// -----------------------------------------------------------------------------


import { ifExists } from '../utils/checks'; 


// Has class
// ---------
// Returns true if element exists and has selected class and false otherwise

export function hasClass(element, classForTest) {
    return ifExists(element, () => {
        // Use className instead of classList because IE11 does not have support for slassList on SVG
        return (element.className.indexOf(classForTest) !== -1);
    });
};



// Has not class
// -------------
// Returns false if element exists and has selected class and true otherwise

export function hasNotClass(element, classForTest) {
    return ifExists(element, () => {
        return !hasClass(element, classForTest);
    });
};



// Add class
// ---------
// Adds class to the element if it exists

export function addClass(element, newClass) {
    return ifExists(element, () => {
        if (hasClass(element, newClass)) {
            return;
        }

        /* Use className instead of classList because IE11 does not have support for slassList on SVG */
        element.className += ' ' + newClass;
    });
};



// Remove class
// ------------
// Removes class from the element if it exists

export function removeClass(element, classForRemoving) {
    return ifExists(element, () => {
        // Use className instead of classList because IE11 does not have support for slassList on SVG
        element.className = element.className.replace(classForRemoving, '');
    });
};



// Toggle class
// ------------
// Toggles class for the element if it exists

export function toggleClass(element, classForToggle) {
    return ifExists(element, () => {
        if (hasNotClass(element, classForToggle)) {
            addClass(element, classForToggle);
        } else {
            removeClass(element, classForToggle);
        }
    });
};

