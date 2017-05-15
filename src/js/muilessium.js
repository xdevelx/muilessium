// -----------------------------------------------------------------------------
// MUILESSIUM BASE
// -----------------------------------------------------------------------------


import * as Utils     from './utils';
import * as Polyfills from './polyfills';

import * as Keyboard    from './controls/keyboard';
import * as Mouse       from './controls/mouse';
import * as TouchScreen from './controls/touchscreen';

import { Events  } from './events';
import { Factory } from './factory';


export default class Muilessium {
    constructor() {
        // This is a singleton
        if (typeof Muilessium.instance === 'object') {
            return Muilessium.instance;
        }

        // Utilities from /src/js/utils.js
        this.Utils = Utils;

        // Controls from /src/js/controls/*
        this.Keyboard    = Keyboard;
        this.Mouse       = Mouse;
        this.TouchScreen = TouchScreen;

        // Events observer from /src/js/events.js
        this.Events  = new Events;
        this.initEvents();
        this.initEventListeners();

        // Components factory from /src/js/factory.js
        this.Factory = new Factory;

        Muilessium.instance = this;
        this.Events.fireEvent('muilessium-initialized');
    }


    initEvents() {
        this.Events.addEvent('muilessium-initialized');
        this.Events.addEvent('images-loaded');

        return this;
    }


    initEventListeners() {
        this.Events.addEventListener('muilessium-initialized', () => {
            Utils.normalizeTabIndex();
            Utils.initAnchorLinks();
            Utils.lazyLoadImages(() => {
                this.Events.fireEvent('images-loaded');
            });

            Polyfills.smoothScroll();
        });

        this.Events.addEventListener('images-loaded', Polyfills.objectFit);

        this.Events.addEventListener('scroll-start', () => {
            Utils.addClass(document.body, '_disable-pointer-events');
        });

        this.Events.addEventListener('scroll-end', () => {
            setTimeout(() => {
                Utils.removeClass(document.body, '_disable-pointer-events');
            }, 300);
        });
    }
};

