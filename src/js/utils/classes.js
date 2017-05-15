// -----------------------------------------------------------------------------
// CSS CLASSES
// -----------------------------------------------------------------------------
// IE11 does not support useful methods of the classList on SVG elements,
// so it will be a good idea to use this wrappers for all elements and don't think
// about "is this element an SVG or not?".
//
// Here is the full list of utilities for manipulations with CSS classes:
//  - hasClass(element, class)
//  - hasNotClass(element, class)
//  - addClass(element, class)
//  - addClasses(element, ...classes)
//  - removeClass(element, class)
//  - removeClasses(element, ...classes)
//  - replaceClass(element, class, newClass)
//  - toggleClass(element, class)


import { ifExists } from '../utils/checks'; 
import { forEach } from '../utils/uncategorized';


// Has class
// ---------
// Returns true if element exists and has selected class and false otherwise

export function hasClass(element, classForTest) {
    return ifExists(element, () => {
        /* Use className instead of classList because IE11 does not have support for slassList on SVG */
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



// Add multiple classes
// --------------------
// Adds multiple classs to the element if it exists

export function addClasses(element, ...newClasses) {
    return ifExists(element, () => {
        forEach(newClasses, (c) => {
            addClass(element, c);
        });
    });
};



// Remove class
// ------------
// Removes class from the element if it exists

export function removeClass(element, classForRemoving) {
    return ifExists(element, () => {
        /* Use className instead of classList because IE11 does not have support for slassList on SVG */
        element.className = element.className.replace(classForRemoving, '');
    });
};



// Remove multiple classes
// --------------------
// Removes multiple classs to the element if it exists

export function removeClasses(element, ...classesForRemoving) {
    return ifExists(element, () => {
        forEach(classesForRemoving, (c) => {
            removeClass(element, c);
        });
    });
};



// Replace class
// -------------
// Removes first selected class and adds second one

export function replaceClass(element, classForRemoving, newClass) {
    removeClass(element, classForRemoving);
    addClass(element, newClass);
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

