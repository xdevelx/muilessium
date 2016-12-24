import * as Utils from '../utils';
import { Component } from '../component';


export class HeaderNavigation extends Component {
    constructor(element, options) {
        super(element, options);
        
        Utils.console.log(`creating header-navigation for the <${element.nodeName}> with options ${JSON.stringify(options)}`);

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

        window.addEventListener('resize', this.update.bind(this));

        Utils.console.ok('header-navigation has been created');
    }


    initAria() {
        [].forEach.call(this.dom.toggles, (toggle) => {
            Utils.aria.setRole(toggle, 'button');
        });

        Utils.aria.set(this.dom.hamburger, 'haspopup', true);

        Utils.aria.set(this.dom.linksList, 'labelledby', Utils.aria.setId(this.dom.hamburger));

        return this;
    }


    initControls() {
        Utils.makeChildElementsClickable(this.element, this.dom.toggles, () => {
            this.toggleNavigation();
        });

        Utils.makeChildElementsClickable(this.element, this.dom.links, (index) => {
            let href = this.dom.links[index].getAttribute('href');

            if (href[0] === '#') {
                this.closeNavigation();

                if (window.location.hash === href) {
                    window.location.hash = '';
                }

                window.location.hash = href.substring(1);
            } else {
                window.location = href;
            }
        });

        return this;
    }


    openNavigation() {
        Utils.console.log(`opening navigation`);

        if (!this.state.opened) {
            this.state.opened = true;
            this.dom.shadow.tabIndex = 0;

            Utils.addClass(this.element,    '-opened');
            Utils.addClass(this.dom.shadow, '-visible');

            Utils.aria.set(this.dom.hamburger, 'hidden', true);
            Utils.aria.set(this.dom.shadow,    'hidden', false);
            Utils.aria.set(this.dom.linksList, 'hidden', false);

            this.dom.linksList.getElementsByTagName('a')[0].focus();
        }

        return this;
    }


    closeNavigation() {
        Utils.console.log(`closing navigation`);

        if (this.state.opened) {
            this.state.opened = false;
            this.dom.shadow.tabIndex = -1;

            Utils.removeClass(this.element,    '-opened');
            Utils.removeClass(this.dom.shadow, '-visible');

            Utils.aria.set(this.dom.hamburger, 'hidden', false);
            Utils.aria.set(this.dom.shadow,    'hidden', true);
            Utils.aria.set(this.dom.linksList, 'hidden', true);

            this.dom.hamburger.focus();
        }

        return this;
    }
    
    toggleNavigation() {
        Utils.console.log(`toggling navigation`);

        if (this.state.opened) {
            this.closeNavigation();
        } else {
            this.openNavigation();
        }

        return this;
    }


    transformToMobile() {
        Utils.console.log(`transforming navigation to the mobile version`);

        if (!this.state.mobile) {
            this.closeNavigation();

            Utils.aria.set(this.dom.hamburger, 'hidden', false);
            Utils.aria.set(this.dom.linksList, 'hidden', true);

            this.state.mobile = true;
        }

        return this;
    }


    transformToDesktop() {
        Utils.console.log(`transforming navigation to the desktop version`);

        if (this.state.mobile) {
            this.closeNavigation();

            Utils.aria.set(this.dom.hamburger, 'hidden', true);
            Utils.aria.set(this.dom.shadow,    'hidden', true);
            Utils.aria.set(this.dom.linksList, 'hidden', false);

            this.state.mobile = false;
        }

        return this;
    }


    update() {
        Utils.console.log(`updating navigation`);

        let screenWidth = window.innerWidth;

        if (screenWidth < 600) {
            this.transformToMobile();
        } else {
            this.transformToDesktop();
        }

        return this;
    }
}
