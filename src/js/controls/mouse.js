// -----------------------------------------------------------------------------
// MOUSE
// -----------------------------------------------------------------------------
// Here is a number of wrappers written in one style for the most popular
// mouse events. This list of functions can be expanded by other mouse actions
// if it needed.
//
// These functions should be used in components for better code readability.


export function onClick(element, callback) {
    element.addEventListener('click', (e) => {
        e.preventDefault();
        callback(e);
    });
};


export function onMouseOver(element, callback) {
    element.addEventListener('mouseover', (e) => {
        e.preventDefault();
        callback(e);
    });
};


export function onMouseOut(element, callback) {
    element.addEventListener('mouseout', (e) => {
        e.preventDefault();
        callback(e);
    });
};

