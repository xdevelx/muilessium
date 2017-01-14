// Custom console
// -----------------------------------------------------------------------------

const console = {


    // Log
    // ---
    // Prints message to the standart browser console

    log: (message) => {
        window.console.log(`${message}`);
    },



    // Info
    // ----
    // Prints info message to the standart browser console

    info: (message) => {
        window.console.info(`[ INFO ] ${message}`);
    },



    // Warning
    // -------
    // Prints warning message to the standart browser console

    warning: (message) => {
        window.console.warn(`[ WARNING ] ${message}`);
    },



    // Error
    // -----
    // Prints error message to the standart browser console

    error: (message) => {
        window.console.error(`[ ERROR ] ${message}`);
    }
};





// -----------------------------------------------------------------------------
// Ajax utilities
// -----------------------------------------------------------------------------

const ajax = {


    // Post
    // ----
    // Makes a POST request and executes a success or error callback when
    // the request state changes

    post: (url, data, successCallback, errorCallback) => {
        let request = new XMLHttpRequest();

        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                /* Only 2xx codes are successful for the POST request. */
                if ((request.status >= 200) && (request.status < 300)) {
                    successCallback(request.responseText);
                } else {
                    console.error(`POST (${url}): error ${request.status} ${request.statusText}`);
                    errorCallback(request.status, request.statusText);
                }
            }
        }

        request.send(data);
    },



    // Get
    // ---
    // Makes a GET request and executes a success or error callback when
    // the request state changes

    get: (url, successCallback, errorCallback) => {
        let request = new XMLHttpRequest();

        request.open('GET', url, true);

        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                /* Status 304 (Not Modified) is also a successful for the GET request.*/
                if (((request.status >= 200) && (request.status < 300)) || (request.status === 304)) {
                    successCallback(request.responseText);
                } else {
                    console.error(`GET (${url}): error ${request.status} ${request.statusText}`);
                    errorCallback(request.status, request.statusText);
                }
            }
        };

        request.send(null);
    }
};





// -----------------------------------------------------------------------------
// WAI-ARIA utilities
// -----------------------------------------------------------------------------
// Here is some functions for operation with aria-roles and properties

const aria = {


    // Set property
    // ------------
    // Sets aria-property to the element

    set: (element, property, value = true) => {
        return setAttribute(element, `aria-${property}`, value);
    },


    // Set role
    // --------
    // Sets aria-role to the element

    setRole: (element, role) => {
        return setAttribute(element, 'role', role);
    },


    // Remove role
    // -----------
    // Removes aria-role from the element

    removeRole: (element) => {
        return removeAttribute(element, 'role');
    },


    // Set id
    // ------
    // Sets ID to the element (generates a random ID if ID not passed as a parameter),
    // returns this ID

    setId: (element, id) => {
        const newId = id || (`mui-id-${generateRandomString(6)}`);

        setAttribute(element, 'id', newId);

        return newId;
    },


    // Get property
    // ------------
    // Gets aria-property from the element

    get: (element, property) => {
        return getAttribute(element, `aria-${property}`);
    },


    // Get role
    // --------
    // Gets aria-role from the element

    getRole: (element) => {
        return getAttribute(element, 'role');
    },


    // Toggle state
    // ------------
    // Changes boolean state from true to false and from false to true.

    toggleState: (element, state) => {
        setAttribute(element, `aria-${state}`, !stringToBoolean(getAttribute(element, `aria-${state}`)));
    },


    // Hide icons
    // ----------
    // Sets role='presentation' to all icons with specified class name

    hideIcons: (className) => {
        [].forEach.call(document.getElementsByClassName(className), (icon) => {
            setAttribute(icon, 'aria-hidden', true);
        });
    }
};





// -----------------------------------------------------------------------------
// Checking for html elements in page
// -----------------------------------------------------------------------------


// Is in page
// ----------
// Returns true if elements is exists in a document.body and false otherwise

function isInPage(element) {
    /* Use this instead of document.contains because IE has only partial support of Node.contains. */
    return (element === document.body) || document.body.contains(element);
}



// Is not in page
// --------------
// Returns false if element is exists in a document.body and true otherwise

function isNotInPage(element) {
    return !isInPage(element);
}



// If exists
// ---------
// Executes callback function if the element exists in document.body
// and prints warning otherwise by default

function ifExists(element, callback, printWarning = true) {
    if (isInPage(element)) {
        return callback();
    } else {
        if (printWarning) {
            console.warning('element does not exists');
        }

        return null;
    }
}



// If nodelist
// -----------
// If first parameter is NodeList or HTMLCollection or Array of HTMLElements
// executes callback function and prints warning otherwise by default

function ifNodeList(x, callback, printWarning = true) {
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
}



// Is descendant
// -------------
// Returns true if the second element is a descendant of the first element and false otherwise

function isDescendant(parent, child) {
    let node = child.parentNode;

    while (node != null) {
        if (node == parent) {
            return true;
        }

        node = node.parentNode;
    }

    return false;
}





// -----------------------------------------------------------------------------
// Manipulating with html attributes
// -----------------------------------------------------------------------------


// Set attribute
// -------------
// Sets attribute to the element if it exists

function setAttribute(element, attribute, value) {
    return ifExists(element, () => {
        return element.setAttribute(attribute, value);
    });
}



// Get attribute
// -------------
// Gets attribute from the element if it exists

function getAttribute(element, attribute) {
    return ifExists(element, () => {
        return element.getAttribute(attribute);
    });
}



// Remove attribute
// -------------
// Removes attribute from the element if it exists

function removeAttribute(element, attribute) {
    return ifExists(element, () => {
        return element.removeAttribute(attribute);
    });
}





// -----------------------------------------------------------------------------
// Manipulating CSS classes
// -----------------------------------------------------------------------------


// Has class
// ---------
// Returns true if element exists and has selected class and false otherwise

function hasClass(element, classForTest) {
    return ifExists(element, () => {
        // Use className instead of classList because IE11 does not have support for slassList on SVG
        return (element.className.indexOf(classForTest) !== -1);
    });
}



// Has not class
// -------------
// Returns false if element exists and has selected class and true otherwise

function hasNotClass(element, classForTest) {
    return ifExists(element, () => {
        return !hasClass(element, classForTest);
    });
}



// Add class
// ---------
// Adds class to the element if it exists

function addClass(element, newClass) {
    return ifExists(element, () => {
        if (hasClass(element, newClass)) {
            return;
        }

        /* Use className instead of classList because IE11 does not have support for slassList on SVG */
        element.className += ' ' + newClass;
    });
}



// Remove class
// ------------
// Removes class from the element if it exists

function removeClass(element, classForRemoving) {
    return ifExists(element, () => {
        // Use className instead of classList because IE11 does not have support for slassList on SVG
        element.className = element.className.replace(classForRemoving, '');
    });
}



// Toggle class
// ------------
// Toggles class for the element if it exists

function toggleClass(element, classForToggle) {
    return ifExists(element, () => {
        if (hasNotClass(element, classForToggle)) {
            addClass(element, classForToggle);
        } else {
            removeClass(element, classForToggle);
        }
    });
}





// -----------------------------------------------------------------------------
// Manipulating with Focus & Click
// -----------------------------------------------------------------------------


// Make element focusable
// ----------------------
// Sets tabindex=0 to the element if it exists

function makeElementFocusable(element) {
    return ifExists(element, () => {
        element.tabIndex = 0;
    });
}



// Make multiple elements focusable
// --------------------------------
// Sets tabindex=0 to the multiple elements in NodeList

function makeElementsFocusable(elements) {
    return ifNodeList(elements, () => {
        [].forEach.call(elements, (element) => {
            makeElementFocusable(element);
        });
    });
}



// Make element not focusable
// --------------------------
// Sets tabindex=-1 to the element

function makeElementNotFocusable(element) {
    return ifExists(element, () => {
        element.tabIndex = -1;
    });
}



// Make multiple elements not focusable
// ------------------------------------
// Sets tabindex=-1 to the multiple elements in NodeList

function makeElementsNotFocusable(elements) {
    return ifNodeList(elements, () => {
        [].forEach.call(elements, (element) => {
            makeElementNotFocusable(element);
        });
    });
}



// Make element clickable
// ----------------------
// Sets tabindex=0 to the element and adds event listeners for the click and
// enter key press with callback to the element if it exists

function makeElementClickable(element, callback) {
    return ifExists(element, () => {
        element.tabIndex = 0;

        element.addEventListener('click', (e) => {
            e.preventDefault();
            callback();
        });

        element.addEventListener('keypress', (e) => {
            if (isEnterPressed(e)) {
                e.preventDefault();
                callback();
            }
        });
    });
}



// Make childs clickable
// ----------------------
// Sets tabindex=0 to the child elements of the selected element
// and adds event listeners for the click and enter key press
// with callback to the childs if they exists

function makeChildElementsClickable(element, childs, callback, mouseOnly = false) {
    return ifExists(element, () => {
        return ifNodeList(childs, () => {
            element.addEventListener('click', (e) => {
                let index = -1;

                [].forEach.call(childs, (child, i) => {
                    if ((child == e.target) || isDescendant(child, e.target)) {
                        index = i;
                    }
                });

                if (index >= 0) {
                    e.preventDefault();
                    callback(index);
                }
            });

            if (!mouseOnly) {
                [].forEach.call(childs, (child) => {
                    child.tabIndex = 0;
                });

                element.addEventListener('keypress', (e) => {
                    if (isEnterPressed(e)) {
                        let index = [].indexOf.call(childs, e.target);

                        if (index >= 0) {
                            e.preventDefault();
                            callback(index);
                        }
                    }
                });
            }
        });
    });
}





// -----------------------------------------------------------------------------
// Scroll utilities
// -----------------------------------------------------------------------------


// Scroll to element
// -----------------
// Scrolls to the element and executes callback after scroll animation ends

function scrollTo(element, callback) {
    ifExists(element, () => {
        element.scrollIntoView({ 'behavior': 'smooth' });

        if (typeof callback === 'function') {
            setTimeout(callback, 470); /* Default scroll time in smoothscroll-polyfill is 468ms */
        }
    });
}


// Scroll to top
// -------------
// Scrolls to the top of page

function scrollToTop(callback) {
    window.scroll({ top: 0, left: 0, 'behavior': 'smooth' });

    if (typeof callback === 'function') {
        setTimeout(callback, 470); /* Default scroll time in smoothscroll-polyfill is 468ms */
    }
}


// Scrollfire
// ----------
// Executes a callback when the element becomes visible in viewport

function scrollFire(element, callback) {
    if (isInViewport(element)) {
        callback();
    } else {
        let modifiedCallback = callOnce(callback);

        document.addEventListener('scroll', () => {
            if (isInViewport(element)) {
                setTimeout(modifiedCallback, 200);
            }
        });
    }
}




// -----------------------------------------------------------------------------
// Viewport utilities
// -----------------------------------------------------------------------------

// Is in viewport
// --------------
// Returns true if the element is in viewport

function isInViewport(element) {
    return ifExists(element, () => {
        let rect = element.getBoundingClientRect(),
            html = document.documentElement;

        return (
            rect.top    >= 0 &&
            rect.left   >= 0 &&
            rect.bottom <= (window.innerHeight || html.clientHeight) &&
            rect.right  <= (window.innerWidth  || html.clientWidth)
        );
    });
}




// -----------------------------------------------------------------------------
// Function for the Muilessium Initialization
// -----------------------------------------------------------------------------


// Normalize TabIndexes
// --------------------

function normalizeTabIndex() {
    var focusableElements = [].slice.call(
        document.querySelectorAll('a, button, input, label, select, textarea, object')
    );
    
    focusableElements.map((element) => {
        element.tabIndex = 0;
    });
}



// Lazy load images
// ----------------

function lazyLoadImages(callback) {
    [].forEach.call(document.querySelectorAll('._lazy-load'), (image) => {
        image.src = image.getAttribute('data-src');

        image.addEventListener('load', function() {
            addClass(this, '-loaded'); 
        });
    });

    if (typeof callback === 'function') {
        callback();
    }
}



// Object fit images
// -----------------
// Should be used as callback for lazy load images

var objectFitImages = require('object-fit-images');



// Init anchor links
// -----------------

function initAnchorLinks() {
    let links = document.getElementsByTagName('a');

    [].forEach.call(links, (link) => {
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
}





// -----------------------------------------------------------------------------
// Uncategorized utilities
// -----------------------------------------------------------------------------


// Random string generation
// ------------------------

function generateRandomString(length = 8) {
    let str = '',
        possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        str += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }

    return str;
}



// Non-standart stringify function
// -------------------------------

function stringify(object) {
    return JSON.stringify(object, (key, value) => {
        if (typeof value === 'function') {
            return 'function';
        }
        
        return value;
    });
}


// Extend
// ------

/* Use this function instead of Object.assign because IE11 has no support for Object.assign
   https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign */

function extend(target, source) {
    target = target || {};

    for (let prop in source) {
        target[prop] = source[prop];
    }

    return target;
}


// Debounce
// --------

function debounce(func, ms) {
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
}



// Check for enter key in keyboard event
// -------------------------------------

function isEnterPressed(e) {
    return (e.keyCode == 13);
}



// String -> Boolean
// -----------------

function stringToBoolean(str) {
    return str === 'true';
}


// Call once
// ---------
// Executes callback function only once

function callOnce(callback) {
    let executed = false;

    return function() {
        if (!executed) {
            executed = true;

            return callback();
        }
    };
}



// -----------------------------------------------------------------------------

export {
    console,
    ajax,
    aria,

    isInPage,
    isNotInPage,
    ifExists,
    ifNodeList,
    isDescendant,

    setAttribute,
    getAttribute,
    removeAttribute,

    hasClass,
    hasNotClass,
    addClass,
    removeClass,
    toggleClass,

    makeElementFocusable,
    makeElementsFocusable,
    makeElementNotFocusable,
    makeElementsNotFocusable,
    makeElementClickable,
    makeChildElementsClickable,

    scrollTo,
    scrollToTop,
    scrollFire,

    normalizeTabIndex,
    lazyLoadImages,
    objectFitImages,
    initAnchorLinks,

    generateRandomString,
    stringify,
    extend,
    debounce,
    isEnterPressed,
    stringToBoolean,
    callOnce,
};
