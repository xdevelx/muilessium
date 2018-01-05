// -----------------------------------------------------------------------------
// TOUCHSCREEN
// -----------------------------------------------------------------------------
//
// Here is a number of wrappers written in one style for the most popular
// touchscreen actions. They can be extended by other touch-actions if it needed.
// Documantation for the HammerJS is here: http://hammerjs.github.io/
//
// These functions should be used in components for better code readability.
//
// Functions list:
//  - onSwipeLeft
//  - onSwipeRight
//  - onPinchOut
//
// -----------------------------------------------------------------------------


window.Hammer = require('hammerjs');


function onSwipeLeft(element, callback) {
    const hammertime = new window.Hammer(element);

    hammertime.on('swipeleft', callback);
}


function onSwipeRight(element, callback) {
    const hammertime = new window.Hammer(element);

    hammertime.on('swiperight', callback);
}


function onPinchOut(element, callback) {
    const hammertime = new window.Hammer(element);

    hammertime.get('pinch').set({ enable: true });
    hammertime.on('pinchout', callback);
}


// -----------------------------------------------------------------------------

const TOUCHSCREEN = {
    onSwipeLeft,
    onSwipeRight,
    onPinchOut
};

export default TOUCHSCREEN;

