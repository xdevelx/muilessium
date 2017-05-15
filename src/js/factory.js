// -----------------------------------------------------------------------------
// FACTORY OF COMPONENTS
// -----------------------------------------------------------------------------
// This is a factory of components. It should be available as
// window.Muilessium.Factory. take a look at /src/js/muilessium.js if not.
//
// Methods:
//   create(type, selector, options)
//       Creates a component of selected type for every element selected
//       by this selector. Options will be passed to a component's constructor.
//

// Components from /src/components/ are imported using index file - components.js.
import * as components from './components';
// The components should be created at /src/js/main.js

export class Factory {
    constructor() {
        if (typeof Factory.instance === 'object') {
            return Factory.instance;
        }

        Factory.instance = this;
    }

    create(type, selector, options) {
        if (typeof components[type] !== 'function') {
            throw new Error('No such component: ' + type);
        }
        
        let elements = document.querySelectorAll(selector);
        
        return [].map.call(elements, function(element) {
            return new components[type](element, options);
        });
    };
};

