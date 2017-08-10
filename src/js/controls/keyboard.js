// -----------------------------------------------------------------------------
// KEYBOARD
// -----------------------------------------------------------------------------
// Here is a number of wrappers written in one style for the most popular
// keys for creating accessible components. They are arrow keys, enter and space.
// This list of functions can be expanded by other key events if it needed.
//
// These functions should be used in components for better code readability.


export function onEnterPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
            callback(e);
        }
    });
};


export function onSpacePressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode == 32) {
            e.preventDefault();
            callback(e);
        }
    });
};


export function onTabPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode == 9 && !e.shiftKey) {
            e.preventDefault();
            callback(e);
        }
    });
};


export function onEscapePressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode == 27 && !e.shiftKey) {
            e.preventDefault();
            callback(e);
        }
    });
};


export function onShiftTabPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode == 9 && e.shiftKey) {
            e.preventDefault();
            callback(e);
        }
    });
};


export function onArrowLeftPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode == 37) {
            e.preventDefault();
            callback(e);
        }
    });
};


export function onArrowUpPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode == 38) {
            e.preventDefault();
            callback(e);
        }
    });
};


export function onArrowRightPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode == 39) {
            e.preventDefault();
            callback(e);
        }
    });
};


export function onArrowDownPressed(element, callback) {
    element.addEventListener('keydown', (e) => {
        if (e.keyCode == 40) {
            e.preventDefault();
            callback(e);
        }
    });
};

