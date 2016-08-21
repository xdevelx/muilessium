import * as Utils from "./utils";

import { input    as inputComponent }    from './components/input';
import { textarea as textareaComponent } from './components/textarea';
import { like     as likeComponent }     from './components/like';


class Muilessium {
    constructor(options) {
        if (typeof Muilessium.instance === 'object') {
            return Muilessium.instance;
        }
        
        this.options = Object.assign(Muilessium.defaults, options);
        
        Muilessium.instance = this;
        
        return this;
    }

    create(type, selector, options) {
        if (typeof Muilessium.components[type] !== 'function') {
            throw new Error('No such component: ' + type);
        }
        
        var components = document.querySelectorAll(selector);
        
        return components.forEach(function(element) {
            new Muilessium.components[type](element, options);
        });
    };
}


Muilessium.components = {
    input: inputComponent,
    textarea: textareaComponent,
    like: likeComponent
};


Muilessium.defaults = {};

export default Muilessium;
