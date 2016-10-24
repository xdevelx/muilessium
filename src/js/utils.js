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


function addClass(element, newClass) {
    if (!document.contains(element)) {
        console.error('cannot add class to element ' + element + '. No such element');
        throw new Error();
    }

    if (element.className.indexOf(newClass) !== -1) {
        console.log('class ' + newClass + ' already added to element ' + element);
        return;
    }

    element.className += ' ' + newClass;
}


function removeClass(element, classForRemoving) {
    if (!document.contains(element)) {
        console.error('cannot add class to element ' + element + '. No such element');
        throw new Error();
    }

    element.className = element.className.replace(classForRemoving, '');
}


function toggleClass(element, classforToggle) {
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
    
    focusableElements.map(function(element) {
        element.tabIndex = 1;
    });
}


function stringify(object) {
    return JSON.stringify(object, function(key, value) {
        if (typeof value === 'function') {
            return 'function';
        }
        
        return value;
    });
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

    element.addEventListener('click', function(e) {
        e.preventDefault();
        callback();
    });

    element.addEventListener('keypress', function(e) {
        if (isEnterPressed(e)) {
            e.preventDefault();
            callback();
        }
    });
}


function makeChildElementsClickable(element, childs, callback) {
    [].forEach.call(childs, function(child) {
        child.tabIndex = 1;
    });

    element.addEventListener('click', function(e) {
        let index = -1;

        [].forEach.call(childs, function(child, i) {
            if ((child == e.target) || isDescendant(child, e.target)) {
                index = i;
            }
        });

        if (index >= 0) {
            e.preventDefault();
            callback(index);
        }
    });

    element.addEventListener('keypress', function(e) {
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
    addClass,
    removeClass,
    toggleClass,
    normalizeTabIndex,
    stringify,
    objectFitImages,
    isEnterPressed,
    isDescendant,
    makeElementClickable,
    makeChildElementsClickable
};
