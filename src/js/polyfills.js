// -----------------------------------------------------------------------------
// POLYFILLS
// -----------------------------------------------------------------------------
// All polyfills used in the application should be imported here. Wrappers are
// used for less dependence on polyfills realizations.
//
// Used polyfills:
//   - smoothscroll-polyfill
//   - object-fit-images


// SMOOTH SCROLL
// https://iamdustan.com/smoothscroll/
import * as smoothScrollPolyfill from 'smoothscroll-polyfill';

export function smoothScroll() {
    smoothScrollPolyfill.polyfill();
};


// OBJECT FIT FOR IMAGES
// https://github.com/bfred-it/object-fit-images
// There is a css class for this polyfill.
// Take a look at src/css/utils.css for more information.
let objectFitImages = require('object-fit-images'); // It doesn't support es6 import

export function objectFit() {
    objectFitImages();
};

