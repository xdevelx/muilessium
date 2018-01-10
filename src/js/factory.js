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
//   registerComponent(type, component)
//       Adds new component to the factory.
//
// -----------------------------------------------------------------------------


import COMPONENTS from './components';
import BaseComponent from './component';

import { forEach    } from './utils/uncategorized';
import { toLispCase } from './utils/uncategorized';


class Factory {
    constructor() {
        this.BaseComponent = BaseComponent;
        this.components = COMPONENTS;
        this.componentsCache = {};

        this.initComponents();
    }


    registerComponent(type, component) {
        if (!this.components[type]) {
            this.components[type] = component;
        }
    }


    initComponents() {
        forEach(Object.keys(this.components), (type) => {
            this.create(type, `.mui-${toLispCase(type)}`, {});
        });
    }


    create(type, selector, options) {
        if (typeof this.components[type] !== 'function') {
            throw new Error(`No such component: ${type}`);
        }

        if (!this.componentsCache[type]) {
            this.componentsCache[type] = [];
        }
        
        const elements = document.querySelectorAll(selector);
        
        return [].map.call(elements, (element) => {
            const newComponent = new this.components[type](element, options);

            this.componentsCache[type].push(newComponent);

            return newComponent;
        });
    }
}


// -----------------------------------------------------------------------------

const FACTORY = new Factory();

export default FACTORY;

