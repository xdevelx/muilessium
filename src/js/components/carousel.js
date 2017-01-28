import * as Mouse       from '../controls/mouse';
import * as Keyboard    from '../controls/keyboard';
import * as TouchScreen from '../controls/touchscreen';

import { addClass, removeClass } from '../utils/classes';
import { console               } from '../utils/console';
import { makeElementFocusable, makeChildElementsClickable } from '../utils/focus-and-click';
import { extend, forEach       } from '../utils/uncategorized';

import { Component } from '../component';


export class Carousel extends Component {
    constructor(element, options) {
        super(element, options);

        this.dom = extend(this.dom, {
            slides: element.querySelectorAll('.mui-slide'),
            controls: {
                prev: element.querySelectorAll('.prev'),
                next: element.querySelectorAll('.next')
            },
            indicators: element.querySelectorAll('.indicator')
        });

        this.state = extend(this.state, {
            numberOfSlides: this.dom.slides.length,
            currentSlide: 0,
            interval: (parseFloat(this.element.getAttribute('data-interval'), 10) || 5),
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
        Mouse.onMouseOver(this.element, this.stopRotating.bind(this));
        Mouse.onMouseOut(this.element, this.startRotating.bind(this));

        makeElementFocusable(this.element);

        this.element.addEventListener('focus', () => {
            this.stopRotating();

            forEach(this.dom.controls.prev, (prev) => {
                addClass(prev, '-focused');
            });

            forEach(this.dom.controls.next, (next) => {
                addClass(next, '-focused');
            });
        });

        this.element.addEventListener('blur', () => {
            this.startRotating();

            forEach.call(this.dom.controls.prev, (prev) => {
                removeClass(prev, '-focused');
            });

            forEach.call(this.dom.controls.next, (next) => {
                removeClass(next, '-focused');
            });
        });

        makeChildElementsClickable(this.element, this.dom.controls.prev,
                        this.rotate.bind(this, 'prev'), true);
        makeChildElementsClickable(this.element, this.dom.controls.next,
                        this.rotate.bind(this, 'next'), true);

        makeChildElementsClickable(this.element, this.dom.indicators, (index) => {
            this.rotate(index);
        }, true);

        TouchScreen.onSwipeRight(this.element, this.rotate.bind(this, 'prev'));
        TouchScreen.onSwipeLeft(this.element,  this.rotate.bind(this, 'next'));

        Keyboard.onArrowLeftPressed(this.element, this.rotate.bind(this, 'prev'));
        Keyboard.onArrowRightPressed(this.element, this.rotate.bind(this, 'next'));

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
        addClass(this.dom.slides[index],     '-active');
        addClass(this.dom.indicators[index], '-active');

        return this;
    }


    makeSlideInactive(index) {
        removeClass(this.dom.slides[index],     '-active');
        removeClass(this.dom.indicators[index], '-active');

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

