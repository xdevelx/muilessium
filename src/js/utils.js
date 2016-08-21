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
};


function removeClass(element, classForRemoving) {
    if (!document.contains(element)) {
        console.error('cannot add class to element ' + element + '. No such element');
        throw new Error();
    }

    element.className = element.className.replace(classForRemoving, '');
};


function toggleClass(element, classforToggle) {
    if (element.className.indexOf(classforToggle) === -1) {
        addClass(element, classforToggle);
    } else {
        removeClass(element, classforToggle);
    }
};


export {
    console,
    addClass,
    removeClass,
    toggleClass
};