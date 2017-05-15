// -----------------------------------------------------------------------------
// CAROUSEL COMPONENT
// -----------------------------------------------------------------------------
// Methods list:
//  - (default) initAria()
//  - (default) initControls()
//  - startRotating()
//  - stopRotating()
//  - makeSlideActive(index)
//  - makeSlideInactive(index)
//  - rotate(param)


import { Component } from '../component';

import * as Mouse       from '../controls/mouse';
import * as Keyboard    from '../controls/keyboard';
import * as TouchScreen from '../controls/touchscreen';

import { addClass                   } from '../utils/classes';
import { removeClass                } from '../utils/classes';
import { console                    } from '../utils/console';
import { makeElementFocusable       } from '../utils/focus-and-click';
import { makeChildElementsClickable } from '../utils/focus-and-click';
import { onFocus                    } from '../utils/focus-and-click';
import { onBlur                     } from '../utils/focus-and-click';
import { extend                     } from '../utils/uncategorized';
import { forEach                    } from '../utils/uncategorized';



export class Carousel extends Component {
    constructor(element, options) {
        super(element, options);

        this.domCache = extend(this.domCache, {
            slides: element.querySelectorAll('.mui-slide'),
            controls: {
                prev: element.querySelectorAll('.prev'),
                next: element.querySelectorAll('.next')
            },
            indicators: element.querySelectorAll('.indicator')
        });

        this.state = extend(this.state, {
            numberOfSlides: this.domCache.slides.length,
            currentSlide: 0,
            interval: (parseFloat(element.getAttribute('data-interval'), 10) || 5),
            isRotating: false,
            rotateInterval: null
        });

        this.initAria();
        this.initControls();
        this.makeSlideActive(0);
        this.startRotating();
    }


    initAria() {
        return this;
    }


    initControls() {
        Mouse.onMouseOver(this.domCache.element, this.stopRotating.bind(this));
        Mouse.onMouseOut(this.domCache.element, this.startRotating.bind(this));

        makeElementFocusable(this.domCache.element);

        onFocus(this.domCache.element, () => {
            this.stopRotating();

            forEach(this.domCache.controls.prev, (prev) => {
                addClass(prev, '-focused');
            });

            forEach(this.domCache.controls.next, (next) => {
                addClass(next, '-focused');
            });
        });

        onBlur(this.domCache.element, () => {
            this.startRotating();

            forEach(this.domCache.controls.prev, (prev) => {
                removeClass(prev, '-focused');
            });

            forEach(this.domCache.controls.next, (next) => {
                removeClass(next, '-focused');
            });
        });

        makeChildElementsClickable(this.domCache.element, this.domCache.controls.prev,
                        this.rotate.bind(this, 'prev'), { mouse: true, keyboard: false });
        makeChildElementsClickable(this.domCache.element, this.domCache.controls.next,
                        this.rotate.bind(this, 'next'), { mouse: true, keyboard: false });

        makeChildElementsClickable(this.domCache.element, this.domCache.indicators, (index) => {
            this.rotate(index);
        }, { mouse: true, keyboard: false });

        TouchScreen.onSwipeRight(this.domCache.element, this.rotate.bind(this, 'prev'));
        TouchScreen.onSwipeLeft(this.domCache.element,  this.rotate.bind(this, 'next'));

        Keyboard.onArrowLeftPressed(this.domCache.element, this.rotate.bind(this, 'prev'));
        Keyboard.onArrowRightPressed(this.domCache.element, this.rotate.bind(this, 'next'));

        return this;
    }


    startRotating() {
        if (!this.state.isRotating) {
            this.state.rotateInterval = setInterval(
                            this.rotate.bind(this, 'next'),
                            this.state.interval * 1000);

            this.state.isRotating = true;
        }

        return this;
    }


    stopRotating() {
        clearInterval(this.state.rotateInterval);

        this.state.rotateInterval = null;
        this.state.isRotating = false;

        return this;
    }


    makeSlideActive(index) {
        addClass(this.domCache.slides[index],     '-active');
        addClass(this.domCache.indicators[index], '-active');

        return this;
    }


    makeSlideInactive(index) {
        removeClass(this.domCache.slides[index],     '-active');
        removeClass(this.domCache.indicators[index], '-active');

        return this;
    }


    rotate(param) {
        let currentSlide = this.state.currentSlide,
            nextSlide = 0;

        if (typeof param === 'string') {
            switch (param) {
                case 'next':
                    nextSlide = (currentSlide + 1) % this.state.numberOfSlides;
                    break;
                case 'prev':
                    nextSlide = (currentSlide - 1 + this.state.numberOfSlides) % this.state.numberOfSlides;
                    break;
                default:
                    Utils.console.error('wrong carousel rotate param');
                    return;
            }
        } else if (typeof param === 'number' && param >= 0 && param < this.state.numberOfSlides) {
            nextSlide = param;
        } else {
            console.warning('wrong carusel rotate param');
            return;
        }

        this.makeSlideInactive(currentSlide);
        this.makeSlideActive(nextSlide);

        this.state.currentSlide = nextSlide;

        return this;
    }
};

