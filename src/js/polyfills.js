import * as smoothScrollPolyfill from 'smoothscroll-polyfill';

let objectFitImages = require('object-fit-images');


export function smoothScroll() {
    smoothScrollPolyfill.polyfill();
};


export function objectFit() {
    objectFitImages();
};

