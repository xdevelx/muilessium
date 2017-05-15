// -----------------------------------------------------------------------------
// TOUCHSCREEN
// -----------------------------------------------------------------------------
// Here is a number of wrappers written in one style for the most popular
// touchscreen actions. They can be extended by other touch-actions if it needed.
// Documantation for the HammerJS is here: http://hammerjs.github.io/
//
// These functions should be used in components for better code readability.


export function onSwipeLeft(element, callback) {
    let hammertime = new Hammer(element);

    hammertime.on('swipeleft', callback);
};


export function onSwipeRight(element, callback) {
    let hammertime = new Hammer(element);

    hammertime.on('swiperight', callback);
};


export function onPinchOut(element, callback) {
    let hammertime = new Hammer(element);

    hammertime.get('pinch').set({ enable: true });
    hammertime.on('pinchout', callback);
};

