// -----------------------------------------------------------------------------
// CAROUSEL COMPONENT
// -----------------------------------------------------------------------------
//
// Methods list:
//  - (default) initAria()
//  - (default) initControls()
//  - startRotation()
//  - stopRotation()
//  - makeSlideActive(index)
//  - makeSlideInactive(index)
//  - rotate(param)
//
// -----------------------------------------------------------------------------


import Component from '../component';

import MOUSE       from '../controls/mouse';
import KEYBOARD    from '../controls/keyboard';
import TOUCHSCREEN from '../controls/touchscreen';

import { addClass                   } from '../utils/classes';
import { removeClass                } from '../utils/classes';
import { makeElementFocusable       } from '../utils/focus-and-click';
import { makeChildElementsClickable } from '../utils/focus-and-click';
import { onFocus                    } from '../utils/focus-and-click';
import { onBlur                     } from '../utils/focus-and-click';
import { extend                     } from '../utils/uncategorized';
import { forEach                    } from '../utils/uncategorized';



export default class Carousel extends Component {
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
        this.startRotation();
    }


    initAria() {
        return this;
    }


    initControls() {
        MOUSE.onMouseOver(this.domCache.element, this.stopRotation.bind(this));
        MOUSE.onMouseOut(this.domCache.element, this.startRotation.bind(this));

        makeElementFocusable(this.domCache.element);

        onFocus(this.domCache.element, () => {
            this.stopRotation();

            forEach(this.domCache.controls.prev, (prev) => {
                addClass(prev, '-focused');
            });

            forEach(this.domCache.controls.next, (next) => {
                addClass(next, '-focused');
            });
        });

        onBlur(this.domCache.element, () => {
            this.startRotation();

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

        TOUCHSCREEN.onSwipeRight(this.domCache.element, this.rotate.bind(this, 'prev'));
        TOUCHSCREEN.onSwipeLeft(this.domCache.element,  this.rotate.bind(this, 'next'));

        KEYBOARD.onArrowLeftPressed(this.domCache.element, this.rotate.bind(this, 'prev'));
        KEYBOARD.onArrowRightPressed(this.domCache.element, this.rotate.bind(this, 'next'));

        return this;
    }


    startRotation() {
        if (!this.state.isRotating) {
            this.state.rotateInterval = setInterval(
                this.rotate.bind(this, 'next'),
                this.state.interval * 1000);

            this.state.isRotating = true;
        }

        return this;
    }


    stopRotation() {
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
        const { currentSlide } = this.state;
        let nextSlide = 0;

        if (typeof param === 'string') {
            switch (param) {
            case 'next':
                nextSlide = (currentSlide + 1) % this.state.numberOfSlides;
                break;
            case 'prev':
                nextSlide =
                    ((currentSlide - 1) + this.state.numberOfSlides) % this.state.numberOfSlides;
                break;
            default:
                return null;
            }
        } else if (typeof param === 'number' && param >= 0 && param < this.state.numberOfSlides) {
            nextSlide = param;
        } else {
            return null;
        }

        this.makeSlideInactive(currentSlide);
        this.makeSlideActive(nextSlide);

        this.state.currentSlide = nextSlide;

        return this;
    }
}

