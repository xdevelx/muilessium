import * as Utils     from './utils';

import * as Polyfills from './polyfills';

import { Events }     from './events';


import { Accordion        } from './components/accordion';
import { Breadcrumb       } from './components/breadcrumb';
import { ButtonDropdown   } from './components/button-dropdown';
import { Button           } from './components/button';
import { Carousel         } from './components/carousel';
import { Checkbox         } from './components/checkbox';
import { HeaderNavigation } from './components/header-navigation';
import { Input            } from './components/input';
import { InputRange       } from './components/input-range';
import { MediaView        } from './components/media-view';
import { ModalWindow      } from './components/modal-window';
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
    'media-view':        MediaView,
    'modal-window':      ModalWindow,
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
        if (typeof Muilessium.instance === 'object') {
            return Muilessium.instance;
        }

        this.Utils = Utils;
        this.Events = new Events;
        
        this.init();
        
        Muilessium.instance = this;

        this.Events.fireEvent('muilessium-initialized');
    }


    init() {
        Utils.normalizeTabIndex();
        Utils.aria.hideIcons('fa');

        this.initEvents();
        this.initEventListeners();

        Utils.lazyLoadImages(() => {
            this.Events.fireEvent('images-loaded');
        });

        return this;
    }


    initEvents() {
        this.Events.addEvent('muilessium-initialized');
        this.Events.addEvent('images-loaded');

        return this;
    }


    initEventListeners() {
        this.Events.addEventListener('muilessium-initialized', () => {
            Polyfills.smoothScroll();

            Utils.initAnchorLinks();
        });

        this.Events.addEventListener('images-loaded', Polyfills.objectFit);
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
