// -----------------------------------------------------------------------------
// FACTORY OF COMPONENTS
// -----------------------------------------------------------------------------
//
// This is a factory of components. It should be available as
// window.Muilessium.FACTORY. Take a look at /src/js/muilessium.js if not.
//
// Methods:
//   create(type, selector, options)
//       Creates a component of selected type for every element selected
//       by this selector. Options will be passed to a component's constructor.
//
// -----------------------------------------------------------------------------


import { COMPONENTS } from './components';


class Factory {
    constructor() {
        // ...
    }

    create(type, selector, options) {
        if (typeof COMPONENTS[type] !== 'function') {
            throw new Error('No such component: ' + type);
        }
        
        let elements = document.querySelectorAll(selector);
        
        return [].map.call(elements, function(element) {
            return new COMPONENTS[type](element, options);
        });
    };
};


// -----------------------------------------------------------------------------

export let FACTORY = new Factory();

