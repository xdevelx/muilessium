import * as smoothScrollPolyfill from 'smoothscroll-polyfill';

var objectFitImages = require('object-fit-images');


function smoothScroll() {
    smoothScrollPolyfill.polyfill();
}


function objectFit() {
    objectFitImages();
}


export {
    smoothScroll,
    objectFit
};
