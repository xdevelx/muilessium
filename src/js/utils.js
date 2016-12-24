var objectFitImages = require('object-fit-images');


const console = {
    log: (message) => {
        window.console.log(`Muilessium: ${message}`);
    },

    ulog: (message) => {
        window.console.log(`Muilessium: ---> ${message}`);
    },

    info: (message) => {
        window.console.info(`Muilessium: ${message}`);
    },

    warning: (message) => {
        window.console.warn(`[WARNING] Muilessium: ${message}`);
    },

    error: (message) => {
        window.console.error(`[ERROR] Muilessium: ${message}`);
    }
};


const ajax = {
    post: (url, data, successCallback, errorCallback) => {
        let request = new XMLHttpRequest();

        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                // Only 2xx codes are successful for the POST request.
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

    get: (url, successCallback, errorCallback) => {
        let request = new XMLHttpRequest();

        request.open('GET', url, true);

        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                // Status 304 (Not Modified) is also a successful for the GET request.
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


const aria = {
    set: (element, property, value = true) => {
        console.ulog(`setting aria-${property} = ${value} to the element: ${element}`);

        return setAttribute(element, `aria-${property}`, value);
    },

    setRole: (element, role) => {
        console.ulog(`setting role ${role} to the element ${element}`);

        return setAttribute(element, 'role', role);
    },

    removeRole: (element) => {
        console.ulog(`removing role from the element ${element}`);

        return removeAttribute(element, 'role');
    },

    setId: (element, id) => {
        console.ulog(`setting ID to the element ${element}`);

        const newId = id || (`mui-id-${generateRandomString(6)}`);

        setAttribute(element, 'id', newId);

        return newId;
    },

    get: (element, property) => {
        console.ulog(`getting aria-${property} value from the element ${element}`);

        return getAttribute(element, `aria-${property}`);
    },

    getRole: (element) => {
        console.ulog(`getting role from element ${element}`);

        return getAttribute(element, 'role');
    },

    toggleState: (element, state) => {
        console.ulog(`toggling aria-${state} value for the element ${element}`);

        setAttribute(element, `aria-${state}`, !stringToBoolean(getAttribute(element, `aria-${state}`)));
    },

    hideIcons: (className) => {
        [].forEach.call(document.getElementsByClassName(className), (icon) => {
            console.ulog(`setting aria-hidden = true to the icon element: ${icon} with class ${className}`);
            setAttribute(icon, 'aria-hidden', true);
        });
    }
};


function setAttribute(element, attribute, value) {
    console.ulog(`setting attribute ${attribute} = ${value} to the element ${element}`);

    return ifExists(element, () => {
        return element.setAttribute(attribute, value);
    });
}


function getAttribute(element, attribute) {
    return ifExists(element, () => {
        return element.getAttribute(attribute);
    });
}


function removeAttribute(element, attribute) {
    return ifExists(element, () => {
        return element.removeAttribute(attribute);
    });
}


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


function ifNodeList(x, callback, printWarning = true) {
    if (((x instanceof NodeList) || (x instanceof HTMLCollection)) && (x.length > 0)) {
        return callback();
    } else {
        if (printWarning) {
            console.warning('element is not an instance of NodeList or HTMLCollection');
        }

        return null;
    }
}


function stringToBoolean(str) {
    return str === 'true';
}


function isInPage(element) {
    // Use this instead of document.contains because IE has only partial support of Node.contains.
    return (element === document.body) || document.body.contains(element);
}


function isNotInPage(element) {
    return !isInPage(element);
}


function hasClass(element, classForTest) {
    console.ulog(`checking for the element ${element} has class .${classForTest}`);

    return ifExists(element, () => {
        // Use className instead of classList because IE11 does not have support for slassList on SVG
        return (element.className.indexOf(classForTest) !== -1);
    });
}


function hasNotClass(element, classForTest) {
    console.ulog(`checking for element ${element} has not class ${classForTest}`);

    return ifExists(element, () => {
        return !hasClass(element, classForTest);
    });
}


function addClass(element, newClass) {
    console.ulog(`adding class ${newClass} to the element ${element}`);

    return ifExists(element, () => {
        if (hasClass(element, newClass)) {
            console.ulog(`class ${newClass} already added to the element ${element}`);
            return;
        }

        // Use className instead of classList because IE11 does not have support for slassList on SVG
        element.className += ' ' + newClass;
    });
}


function removeClass(element, classForRemoving) {
    console.ulog(`removing class ${classForRemoving} from the element ${element}`);

    return ifExists(element, () => {
        // Use className instead of classList because IE11 does not have support for slassList on SVG
        element.className = element.className.replace(classForRemoving, '');
    });
}


function toggleClass(element, classForToggle) {
    console.ulog(`togle class ${classForToggle} for element ${element}`);

    return ifExists(element, () => {
        if (hasNotClass(element, classForToggle)) {
            addClass(element, classForToggle);
        } else {
            removeClass(element, classForToggle);
        }
    });
}


function normalizeTabIndex() {
    var focusableElements = [].slice.call(
        document.querySelectorAll('a, button, input, label, select, textarea, object')
    );
    
    focusableElements.map((element) => {
        element.tabIndex = 0;
    });
}


function stringify(object) {
    return JSON.stringify(object, (key, value) => {
        if (typeof value === 'function') {
            return 'function';
        }
        
        return value;
    });
}


// Use this function instead of Object.assign because IE11 has no support for Object.assign
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
function extend(target, source) {
    target = target || {};

    for (let prop in source) {
        target[prop] = source[prop];
    }

    return target;
}


function isEnterPressed(e) {
    return (e.keyCode == 13);
}


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


function makeElementFocusable(element) {
    console.ulog(`making element ${element} focusable`);

    return ifExists(element, () => {
        element.tabIndex = 0;
    });
}


function makeElementsFocusable(elements) {
    [].forEach.call(elements, (element) => {
        makeElementFocusable(element);
    });
}


function makeElementNotFocusable(element) {
    element.tabIndex = -1;
}


function makeElementsNotFocusable(elements) {
    [].forEach.call(elements, (element) => {
        makeElementNotFocusable(element);
    });
}


function makeElementClickable(element, callback) {
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
}


function makeChildElementsClickable(element, childs, callback, mouseOnly = false) {
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
}


function lazyLoadImages(callback) {
    [].forEach.call(document.querySelectorAll('.mui-lazy-load'), (image) => {
        image.src = image.getAttribute('data-src');

        image.addEventListener('load', function() {
            addClass(this, '-loaded'); 
        });
    });

    if (typeof callback === 'function') {
        callback();
    }
}


function generateRandomString(length = 8) {
    let str = '',
        possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        str += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }

    return str;
}


export {
    console,
    ajax,
    aria,

    setAttribute,
    getAttribute,
    removeAttribute,
    ifExists,
    ifNodeList,
    stringToBoolean,
    isInPage,
    isNotInPage,
    addClass,
    removeClass,
    toggleClass,
    normalizeTabIndex,
    stringify,
    extend,
    objectFitImages,
    isEnterPressed,
    isDescendant,
    makeElementFocusable,
    makeElementsFocusable,
    makeElementNotFocusable,
    makeElementsNotFocusable,
    makeElementClickable,
    makeChildElementsClickable,
    lazyLoadImages,
    generateRandomString
};
