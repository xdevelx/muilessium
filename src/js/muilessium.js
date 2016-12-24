import * as Utils from './utils';

import { Accordion        } from './components/accordion';
import { Breadcrumb       } from './components/breadcrumb';
import { ButtonDropdown   } from './components/button-dropdown';
import { Button           } from './components/button';
import { Carousel         } from './components/carousel';
import { Checkbox         } from './components/checkbox';
import { HeaderNavigation } from './components/header-navigation';
import { Input            } from './components/input';
import { InputRange       } from './components/input-range';
import { Pagination       } from './components/pagination';
import { Radio            } from './components/radio';
import { SelectDropdown   } from './components/select-dropdown';
import { Tabs             } from './components/tabs';
import { TagsList         } from './components/tags-list';
import { Textarea         } from './components/textarea';
import { Rating           } from './components/rating';


const components = {
    'accordion':         Accordion,
    'breadcrumb':        Breadcrumb,
    'button-dropdown':   ButtonDropdown,
    'button':            Button,
    'carousel':          Carousel,
    'checkbox':          Checkbox,
    'header-navigation': HeaderNavigation,
    'input':             Input,
    'input-range':       InputRange,
    'pagination':        Pagination,
    'radio':             Radio,
    'select-dropdown':   SelectDropdown,
    'tabs':              Tabs,
    'tags-list':         TagsList,
    'textarea':          Textarea,
    'rating':            Rating
};


class Muilessium {
    constructor() {
        Utils.console.log('------------------------');
        Utils.console.log('   <<< MUILESSIUM >>>   ');
        Utils.console.log('------------------------');

        if (typeof Muilessium.instance === 'object') {
            return Muilessium.instance;
        }
        
        Utils.normalizeTabIndex();

        Utils.lazyLoadImages(() => {
            Utils.objectFitImages();
        });

        Utils.aria.hideIcons('fa');

        this.Utils = Utils;
        
        Muilessium.instance = this;

        Utils.console.ok('muilessium has been created');
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
