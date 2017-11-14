module.exports = {
    ignore: [
        'rem',              // IE10 has partial support of rem units.
        'viewport-units',   // Only vmax isn't supported in IE11.
        'outline',          // IE11 has partial support of it.
        'css-resize',       // IE, Edge, iOS Safari and Opera Mini don't support it.
        'transforms2d',     // Opera Mini doesn't support them.
        'css-animation',    // ..again Opera Mini
        'css-transitions',  // ..and again
        'border-radius',    // ..same thing..
        'css-boxshadow',    // ..yes, Opera Mini doesn't support it too..
        'css-fixed',        // ..and this too..
        'css-gradients',    // ..and this..
        'css-textshadow',   // ..Opera Mini has partial support of it.

        'user-select-none', // Mobile browsers have some issues with it, it's ok.
        'pointer-events',   // This rule related to the specification, not the "pointer-events" CSS property.
        'css-appearance',   // All browsers have partial support of this thing.
        'will-change',      // Some browsers don't support it, it's ok.
        'object-fit',       // Muilessium uses polyfill.
        'calc'              // If browser doesn't support viewport units in calc, it's not very horrible.
    ]
};

