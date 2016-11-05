var objectFitImages = require('object-fit-images');


const console = {
    log: (message) => {
        window.console.log('Muilessium: ' + message);
    },

    warning: (message) => {
        window.console.warn('[WARNING] Muilessium: ' + message);
    },

    error: (message) => {
        window.console.error('[ERROR] Muilessium: ' + message);
    }
};


function isInPage(element) {
    // Use this instead of document.contains because IE has only partial support of Node.contains.
    return (element === document.body) || document.body.contains(element);
}


function isNotInPage(element) {
    return !isInPage(element);
}


function addClass(element, newClass) {
    if (isNotInPage(element)) {
        console.error('cannot add class to element ' + element + '. No such element');
        throw new Error();
    }

    if (element.className.indexOf(newClass) !== -1) {
        console.log('class ' + newClass + ' already added to element ' + element);
        return;
    }

    // Use className instead of classList because IE11 does not have support for slassList on SVG
    element.className += ' ' + newClass;
}


function removeClass(element, classForRemoving) {
    if (isNotInPage(element)) {
        console.error('cannot add class to element ' + element + '. No such element');
        throw new Error();
    }

    // Use className instead of classList because IE11 does not have support for slassList on SVG
    element.className = element.className.replace(classForRemoving, '');
}


function toggleClass(element, classforToggle) {
    // Use className instead of classList because IE11 does not have support for slassList on SVG
    if (element.className.indexOf(classforToggle) === -1) {
        addClass(element, classforToggle);
    } else {
        removeClass(element, classforToggle);
    }
}


function normalizeTabIndex() {
    var focusableElements = [].slice.call(
        document.querySelectorAll('a, button, input, select, textarea, object')
    );
    
    focusableElements.map((element) => {
        element.tabIndex = 1;
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


function makeElementClickable(element, callback) {
    element.tabIndex = 1;

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


function makeChildElementsClickable(element, childs, callback) {
    [].forEach.call(childs, (child) => {
        child.tabIndex = 1;
    });

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


export {
    console,
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
    makeElementClickable,
    makeChildElementsClickable
};
