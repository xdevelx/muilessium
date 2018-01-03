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
};


// OBJECT FIT FOR IMAGES
// https://github.com/bfred-it/object-fit-images
// There is a css class for this polyfill.
// Take a look at src/css/utils.css for more information.
import objectFitImages from 'object-fit-images';

function objectFit() {
    objectFitImages();
};


// Object.assign
// https://github.com/sindresorhus/object-assign
import assign from 'object-assign';

function objectAssign() {
    return assign.apply(null, arguments);
};



// toSlugCase
// https://github.com/ianstormtaylor/to-slug-case
import * as convertToSlugCase from 'to-slug-case';

function toSlugCase(str) {
    return convertToSlugCase(str);
};


// -----------------------------------------------------------------------------

export let POLYFILLS = {
    smoothScroll,
    objectFitImages,
    objectAssign,
    toSlugCase
};

