// -----------------------------------------------------------------------------
// UNCATEGORIZED UTILITIES
// -----------------------------------------------------------------------------
//
// Here is the full list of uncategorized utilities:
//  - normalizeTabIndexes()
//  - lazyLoadImages(callback)
//  - initAnchorLinks()
//  - generateRandomString(length = 8)
//  - stringify(object)
//  - extend(target, source)
//  - debounce(func, ms)
//  - callOnce(callback)
//  - firstOfList(list)
//  - lastOfList(list)
//  - forEach(list, callback)


import { addClass             } from '../utils/classes';
import { makeElementClickable } from '../utils/focus-and-click';
import { scrollTo             } from '../utils/scroll';


// Normalize TabIndexes
// --------------------

export function normalizeTabIndex() {
    var focusableElements = [].slice.call(
        document.querySelectorAll('a, button, input, label, select, textarea, object')
    );
    
    focusableElements.map((element) => {
        element.tabIndex = 0;
    });
};



// Lazy load images
// ----------------

let imagesLoaded = require('imagesloaded');

export function lazyLoadImages(callback) {
    forEach(document.querySelectorAll('.-js-lazy-load'), (image) => {
        image.src = image.getAttribute('data-src');

        image.addEventListener('load', function() {
            addClass(this, '-loaded'); 
        });
    });

    if (typeof callback === 'function') {
        imagesLoaded('body', callback);
    }
};



// Init anchor links
// -----------------

export function initAnchorLinks() {
    let links = document.getElementsByTagName('a');

    forEach(links, (link) => {
        let href = link.getAttribute('href');

        if (href && href[0] === '#') {
            makeElementClickable(link, () => {
                let targetElement = document.getElementById(href.substring(1));

                if (targetElement) {
                    scrollTo(targetElement, () => {
                        if (window.location.hash === href) {
                            window.location.hash = '';
                        }

                        window.location.hash = href.substring(1);
                    });
                } else {
                    console.warning(`Anchor ${href} does not exists`);
                }
            });
        }
    });
};



// Random string generation
// ------------------------

export function generateRandomString(length = 8) {
    let str = '',
        possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        str += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }

    return str;
};



// Non-standart stringify function
// -------------------------------

export function stringify(object) {
    return JSON.stringify(object, (key, value) => {
        if (typeof value === 'function') {
            return 'function';
        }
        
        return value;
    });
};



// Extend
// ------

/* Use this function instead of Object.assign because IE11 has no support for Object.assign
   https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign */

export function extend(target, source) {
    target = target || {};

    for (let prop in source) {
        target[prop] = source[prop];
    }

    return target;
};



// Debounce
// --------

export function debounce(func, ms) {
    let callAllowed = true;

    return function() {
        if (!callAllowed) {
            return;
        }

        func.apply(this, arguments);

        callAllowed = false;

        setTimeout(() => {
            callAllowed = true;
        }, ms);
    };
};



// String -> Boolean
// -----------------

export function stringToBoolean(str) {
    return str === 'true';
};



// Call once
// ---------
// Executes callback function only once

export function callOnce(callback) {
    let executed = false;

    return function() {
        if (!executed) {
            executed = true;

            return callback();
        }
    };
};



// First of list
// ------------
// Returns first element of array-like objects

export function firstOfList(list) {
    return list[0];
};



// Last of list
// ------------
// Returns last element of array-like objects

export function lastOfList(list) {
    return list[list.length - 1];
};


// For Each
// --------
// Executes callback function for every item in the list.

export function forEach(list, callback, delay = 0) {
    if (delay > 0) {
        let counter = 0;

        return [].forEach.call(list, (item, index) => {
            setTimeout(() => {
                callback(item, index, list);
            }, delay * counter);

            counter++;
        });
    } else {
        return [].forEach.call(list, (item, index) => {
            callback(item, index, list);
        });
    }
};


