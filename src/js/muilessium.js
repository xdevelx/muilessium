// -----------------------------------------------------------------------------
// MUILESSIUM BASE
// -----------------------------------------------------------------------------


import { UTILS       } from './utils';
import { EVENTS      } from './events';
import { FACTORY     } from './factory';
import { POLYFILLS   } from './polyfills';
import { KEYBOARD    } from './controls/keyboard';
import { MOUSE       } from './controls/mouse';
import { TOUCHSCREEN } from './controls/touchscreen';


class Muilessium {
    constructor() {
        this.UTILS       = UTILS;
        this.EVENTS      = EVENTS;
        this.FACTORY     = FACTORY;
        this.POLYFILLS   = POLYFILLS;
        this.KEYBOARD    = KEYBOARD;
        this.MOUSE       = MOUSE;
        this.TOUCHSCREEN = TOUCHSCREEN;

        this.initEvents();
        this.initEventListeners();
        this.initComponents();

        this.EVENTS.fireEvent('muilessium-initialized');
    }


    initEvents() {
        EVENTS.addEvent('muilessium-initialized');
        EVENTS.addEvent('images-loaded');

        return this;
    }


    initEventListeners() {
        EVENTS.addEventListener('muilessium-initialized', () => {
            UTILS.normalizeTabIndex();
            UTILS.initAnchorLinks();
            UTILS.lazyLoadImages(() => {
                EVENTS.fireEvent('images-loaded');
            });

            POLYFILLS.smoothScroll();
        });

        EVENTS.addEventListener('images-loaded', POLYFILLS.objectFit);
    }


    initComponents() {
        FACTORY.create('Breadcrumb', '.mui-breadcrumb', {});
        FACTORY.create('Button',     '.mui-button',     {});
        FACTORY.create('MediaView',  '.mui-media-view', {});
        FACTORY.create('Pagination', '.mui-pagination', {});
        FACTORY.create('ScrollFix',  '.mui-scroll-fix', {});
        FACTORY.create('TagsList',   '.mui-tags-list',  {});

        this.components = {
            'Accordion':        FACTORY.create('Accordion',        '.mui-accordion',         {}),
            'ButtonDropdown':   FACTORY.create('ButtonDropdown',   '.mui-button-dropdown',   {}),
            'Carousel':         FACTORY.create('Carousel',         '.mui-carousel',          {}),
            'Checkbox':         FACTORY.create('Checkbox',         '.mui-checkbox',          {}),
            'CustomScroll':     FACTORY.create('CustomScroll',     '.mui-custom-scroll',     {}),
            'HeaderNavigation': FACTORY.create('HeaderNavigation', '.mui-header-navigation', {}),
            'Input':            FACTORY.create('Input',            '.mui-input',             {}),
            'ModalWindow':      FACTORY.create('ModalWindow',      '.mui-modal-window',      {}),
            'ProgressBar':      FACTORY.create('ProgressBar',      '.mui-progress-bar',      {}),
            'Radio':            FACTORY.create('Radio',            '.mui-radio',             {}),
            'Rating':           FACTORY.create('Rating',           '.mui-rating',            {}),
            'SelectDropdown':   FACTORY.create('SelectDropdown',   '.mui-select-dropdown',   {}),
            'Spoiler':          FACTORY.create('Spoiler',          '.mui-spoiler',           {}),
            'Tabs':             FACTORY.create('Tabs',             '.mui-tabs',              {}),
            'Textarea':         FACTORY.create('Textarea',         '.mui-textarea',          {})
        };
    }


    get(componentName, id) {
        let result = null;

        UTILS.forEach(this.components[componentName], (component) => {
            if (component.domCache.element.id === id) {
                result = component;
            }
        });

        return result;
    }
};


// -----------------------------------------------------------------------------

export let MUILESSIUM = new Muilessium;


