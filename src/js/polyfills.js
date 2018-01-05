// -----------------------------------------------------------------------------
// POLYFILLS
// -----------------------------------------------------------------------------
//
// All polyfills used in the application should be imported here. Wrappers are
// used for less dependence on polyfills realizations.
//
// Used polyfills:
//   - smoothscroll-polyfill
//   - object-fit-images
//   - object-assign
//   - to-slug-case
//
// -----------------------------------------------------------------------------


// SMOOTH SCROLL
// https://iamdustan.com/smoothscroll/
import * as smoothScrollPolyfill from 'smoothscroll-polyfill';

function smoothScroll() {
    smoothScrollPolyfill.polyfill();
}


// OBJECT FIT FOR IMAGES
// https://github.com/bfred-it/object-fit-images
// There is a css class for this polyfill.
// Take a look at src/css/utils.css for more information.
import objectFitImages from 'object-fit-images';

function objectFit() {
    objectFitImages();
}


// Object.assign
// https://github.com/sindresorhus/object-assign
import assign from 'object-assign';

function objectAssign(...args) {
    return assign(...args);
}



// toSlugCase
// https://github.com/ianstormtaylor/to-slug-case
// Notice: Really don't know why it's happening,
//   but es6 import of this dependency brokes the tests.
//   Use require instead.
const convertToSlugCase = require('to-slug-case');

function toSlugCase(str) {
    return convertToSlugCase(str);
}


// -----------------------------------------------------------------------------

const POLYFILLS = {
    smoothScroll,
    objectFit,
    objectAssign,
    toSlugCase
};

export default POLYFILLS;

