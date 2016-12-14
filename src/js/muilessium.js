import * as Utils from './utils';

import { Accordion        } from './components/accordion';
import { ButtonDropdown   } from './components/button-dropdown';
import { Button           } from './components/button';
import { Carousel         } from './components/carousel';
import { Checkbox         } from './components/checkbox';
import { HeaderNavigation } from './components/header-navigation';
import { Input            } from './components/input';
import { SelectDropdown   } from './components/select-dropdown';
import { Tabs             } from './components/tabs';
import { Textarea         } from './components/textarea';
import { Rating           } from './components/rating';


const components = {
    'accordion':         Accordion,
    'button-dropdown':   ButtonDropdown,
    'button':            Button,
    'carousel':          Carousel,
    'checkbox':          Checkbox,
    'header-navigation': HeaderNavigation,
    'input':             Input,
    'select-dropdown':   SelectDropdown,
    'tabs':              Tabs,
    'textarea':          Textarea,
    'rating':            Rating
};


class Muilessium {
    constructor() {
        if (typeof Muilessium.instance === 'object') {
            return Muilessium.instance;
        }
        
        Utils.normalizeTabIndex();

        Utils.lazyLoadImages(() => {
            Utils.objectFitImages();
        });

        this.Utils = Utils;
        
        Muilessium.instance = this;

        return this;
    }

    create(type, selector, options) {
        if (typeof components[type] !== 'function') {
            throw new Error('No such component: ' + type);
        }
        
        var elements = document.querySelectorAll(selector);
        
        return [].map.call(elements, function(element) {
            return new components[type](element, options);
        });
    };
}


export default Muilessium;
