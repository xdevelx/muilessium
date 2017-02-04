import { Component } from '../component';

import * as TouchScreen from '../controls/touchscreen';
import * as Keyboard    from '../controls/keyboard';

import { aria                  } from '../utils/aria';
import { addClass, removeClass } from '../utils/classes';

import {
    getFocusableChilds,
    makeElementClickable,
    makeChildElementsClickable,
    goToPreviousFocusableElement,
    goToNextFocusableElement
} from '../utils/focus-and-click';

import { extend, firstOfList, lastOfList } from '../utils/uncategorized';



export class HeaderNavigation extends Component {
    constructor(element, options) {
        super(element, options);
        
        this.dom = extend(this.dom, {
            hamburger:  element.querySelector('.mui-navigation-toggle'),
            shadow:     element.querySelector('.mui-shadow-toggle'),
            links:      element.querySelector('.links-list'),
            linksList:  element.querySelectorAll('a'),
            focusables: []
        });

        this.state = extend(this.state, {
            opened: false,
            mobile: false
        });

        this.initAria();
        this.initControls();
        this.update();

        window.Muilessium.Events.addEventListener('resize-window-width', this.update.bind(this)); 

        this.state.initialized = true;
    }


    initAria() {
        aria.setRole(this.dom.hamburger, 'button');

        aria.set(this.dom.shadow,    'hidden', true);
        aria.set(this.dom.hamburger, 'haspopup', true);

        aria.set(this.dom.links, 'labelledby', aria.setId(this.dom.hamburger));

        return this;
    }


    initControls() {
        makeElementClickable(this.dom.hamburger, this.toggleNavigation.bind(this));
        makeElementClickable(this.dom.shadow,    this.toggleNavigation.bind(this), true);

        makeChildElementsClickable(this.element, this.dom.linksList, (index) => {
            let href = this.dom.linksList[index].getAttribute('href');

            if (href[0] === '#') {
                this.closeNavigation();
            } else {
                window.location = href;
            }
        });

        TouchScreen.onSwipeRight(this.element, () => {
            if (this.state.mobile) {
                this.closeNavigation();
            }
        });

        this.dom.focusables = getFocusableChilds(this.dom.links);

        Keyboard.onShiftTabPressed(firstOfList(this.dom.focusables), () => {
            this.closeNavigation();

            goToPreviousFocusableElement(
                            firstOfList(this.dom.focusables));
        });

        Keyboard.onTabPressed(lastOfList(this.dom.focusables), () => {
            this.closeNavigation();

            goToNextFocusableElement(
                            lastOfList(this.dom.focusables));
        });

        return this;
    }


    openNavigation() {
        if (!this.state.opened) {
            this.state.opened = true;
            this.dom.shadow.tabIndex = 0;

            addClass(this.element,    '-opened');
            addClass(this.dom.shadow, '-visible');

            aria.set(this.dom.hamburger, 'hidden', true);
            aria.set(this.dom.links, 'hidden', false);

            firstOfList(this.dom.focusables).focus();
        }

        return this;
    }


    closeNavigation() {
        if (this.state.opened) {
            this.state.opened = false;
            this.dom.shadow.tabIndex = -1;

            removeClass(this.element,    '-opened');
            removeClass(this.dom.shadow, '-visible');

            aria.set(this.dom.hamburger, 'hidden', false);
            aria.set(this.dom.links, 'hidden', true);

            this.dom.hamburger.focus();
        }

        return this;
    }
    
    toggleNavigation() {
        if (this.state.opened) {
            this.closeNavigation();
        } else {
            this.openNavigation();
        }

        return this;
    }


    transformToMobile() {
        if (!this.state.mobile || !this.state.initialized) {
            this.closeNavigation();

            aria.set(this.dom.hamburger, 'hidden', false);
            aria.set(this.dom.links, 'hidden', true);

            addClass(this.element, '-mobile-version');
            removeClass(this.element, '-desktop-version');

            this.state.mobile = true;
        }

        return this;
    }


    transformToDesktop() {
        if (this.state.mobile || !this.state.initialized) {
            this.closeNavigation();

            aria.set(this.dom.hamburger, 'hidden', true);
            aria.set(this.dom.shadow,    'hidden', true);
            aria.set(this.dom.links,     'hidden', false);

            addClass(this.element, '-desktop-version');
            removeClass(this.element, '-mobile-version');

            this.state.mobile = false;
        }

        return this;
    }


    update() {
        if (window.innerWidth < 600) {
            this.transformToMobile();
            return this;
        } else if (window.innerWidth > 1200) {
            this.transformToDesktop();
            return this;
        }

        this.transformToDesktop();

        let parentNode = this.element.parentNode,
            parentWidth = parentNode.clientWidth,
            childsWidth = 0;

        [].forEach.call(parentNode.childNodes, (child) => {
            let width = child.offsetWidth;

            if (width) {
                childsWidth += child.offsetWidth;
            }
        });
 
        if (childsWidth > (parentWidth - 50)) {
            this.transformToMobile();
        } else {
            this.transformToDesktop();
        }

        return this;
    }
};

