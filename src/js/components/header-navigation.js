import * as TouchScreen from '../controls/touchscreen';
import * as Utils from '../utils';
import { Component } from '../component';


export class HeaderNavigation extends Component {
    constructor(element, options) {
        super(element, options);
        
        this.dom = Utils.extend(this.dom, {
            toggles:   element.getElementsByClassName('mui-navigation-toggle'),
            hamburger: element.getElementsByClassName('mui-navigation-toggle')[0],
            shadow:    element.getElementsByClassName('mui-shadow-toggle')[0],
            linksList: element.getElementsByClassName('links-list')[0],
            links:     element.getElementsByTagName('a')
        });

        this.state = Utils.extend(this.state, {
            opened: false,
            mobile: false
        });

        this.initAria();
        this.initControls();
        this.update();

        window.Muilessium.Events.addEventListener('resizeWindowWidth',
                        Utils.debounce(this.update.bind(this), 100)); 

        this.state.initialized = true;
    }


    initAria() {
        [].forEach.call(this.dom.toggles, (toggle) => {
            Utils.aria.setRole(toggle, 'button');
        });

        Utils.aria.set(this.dom.shadow,    'hidden', true);
        Utils.aria.set(this.dom.hamburger, 'haspopup', true);

        Utils.aria.set(this.dom.linksList, 'labelledby', Utils.aria.setId(this.dom.hamburger));

        return this;
    }


    initControls() {
        Utils.makeChildElementsClickable(this.element, this.dom.toggles, this.toggleNavigation.bind(this));

        Utils.makeChildElementsClickable(this.element, this.dom.links, (index) => {
            let href = this.dom.links[index].getAttribute('href');

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

        return this;
    }


    openNavigation() {
        if (!this.state.opened) {
            this.state.opened = true;
            this.dom.shadow.tabIndex = 0;

            Utils.addClass(this.element,    '-opened');
            Utils.addClass(this.dom.shadow, '-visible');

            Utils.aria.set(this.dom.hamburger, 'hidden', true);
            Utils.aria.set(this.dom.linksList, 'hidden', false);

            this.dom.linksList.getElementsByTagName('a')[0].focus();
        }

        return this;
    }


    closeNavigation() {
        if (this.state.opened) {
            this.state.opened = false;
            this.dom.shadow.tabIndex = -1;

            Utils.removeClass(this.element,    '-opened');
            Utils.removeClass(this.dom.shadow, '-visible');

            Utils.aria.set(this.dom.hamburger, 'hidden', false);
            Utils.aria.set(this.dom.linksList, 'hidden', true);

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

            Utils.aria.set(this.dom.hamburger, 'hidden', false);
            Utils.aria.set(this.dom.linksList, 'hidden', true);

            Utils.addClass(this.element, '-mobile-version');
            Utils.removeClass(this.element, '-desktop-version');

            this.state.mobile = true;
        }

        return this;
    }


    transformToDesktop() {
        if (this.state.mobile || !this.state.initialized) {
            this.closeNavigation();

            Utils.aria.set(this.dom.hamburger, 'hidden', true);
            Utils.aria.set(this.dom.shadow,    'hidden', true);
            Utils.aria.set(this.dom.linksList, 'hidden', false);

            Utils.addClass(this.element, '-desktop-version');
            Utils.removeClass(this.element, '-mobile-version');

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

        let parentNode = this.element.parentNode,
            parentWidth = parentNode.clientWidth,
            childsWidth = 0;

        [].forEach.call(parentNode.childNodes, (child) => {
            let width = child.offsetWidth;

            if (width) {
                childsWidth += child.offsetWidth;
            }
        });
 
        if (childsWidth > (parentWidth - 100)) {
            this.transformToMobile();
        } else {
            this.transformToDesktop();
        }

        return this;
    }
};

