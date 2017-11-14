let path = require('path');

module.exports = {
    ignore: [
        'rem',              // ok
        'viewport-units',   // only vmax is not supported in ie11
        'transforms2d',     // ok
        'css-animation',    // ok
        'css-transitions',  // ok
        'border-radius',    // ok
        'css-boxshadow',    // ok
        'user-select-none', // mobile browsers have some issues with it, it's ok
        'pointer-events',   // ok
        'css-appearance',   // it does not matter
        'css-fixed',        // ok
        'outline',          // ie11 has only partial support of it
        'css-gradients',    // ok
        'will-change',      // some browsers are not support it, it's ok
        'css-textshadow',   // ok
        'css-resize',       // ?
        'object-fit',       // used polyfill
        'calc'              // if browser doesn't support viewport units in calc, it's not very horrible
    ]
};

