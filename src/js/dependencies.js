// -----------------------------------------------------------------------------
// DEPENDENCIES
// -----------------------------------------------------------------------------
//
// All dependencies except polyfills used in the application should be imported
// here. For polyfills see /src/js/polyfills.js
//
// Used dependencies:
//   - to-slug-case
//   - imagesloaded
//   - hammerjs
//
// -----------------------------------------------------------------------------



// toSlugCase
// https://github.com/ianstormtaylor/to-slug-case
// Notice: Really don't know why it's happening,
//   but es6 import of this dependency brokes the tests.
//   Use require instead.
const _toSlugCase = require('to-slug-case');

function toSlugCase(str) {
    return _toSlugCase(str);
}


// imagesLoaded
// https://imagesloaded.desandro.com/
const _imagesLoaded = require('imagesloaded');

function imagesLoaded(element, callback) {
    _imagesLoaded(element, callback);
}


// HammerJS
// https://hammerjs.github.io/
const _Hammer = require('hammerjs');

function Hammer() {
    return _Hammer;
}

// SimpleBar
// http://grsmto.github.io/simplebar/
import * as _SimpleBar from 'simplebar';

function SimpleBar() {
    return _SimpleBar;
}


// -----------------------------------------------------------------------------

const DEPENDENCIES = {
    toSlugCase,
    imagesLoaded,
    Hammer,
    SimpleBar
};

export default DEPENDENCIES;

