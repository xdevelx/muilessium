import * as Mouse       from '../controls/mouse';
import * as TouchScreen from '../controls/touchscreen';

import * as Utils from '../utils';

import { Component } from '../component';


export class Carousel extends Component {
    constructor(element, options) {
        super(element, options);

        this.dom = Utils.extend(this.dom, {
            slides: element.getElementsByClassName('mui-slide'),
            controls: {
                prev: element.getElementsByClassName('prev'),
                next: element.getElementsByClassName('next')
            },
            indicators: element.getElementsByClassName('indicator')
        });

        this.state = Utils.extend(this.state, {
            numberOfSlides: this.dom.slides.length,
            currentSlide: 0,
            interval: (parseFloat(this.element.getAttribute('data-interval'), 10) || 5)
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

        Utils.makeChildElementsClickable(this.element, this.dom.controls.prev, this.rotate.bind(this, 'prev'));
        Utils.makeChildElementsClickable(this.element, this.dom.controls.next, this.rotate.bind(this, 'next'));

        Utils.makeChildElementsClickable(this.element, this.dom.indicators, (index) => {
            this.rotate(index);
        });

        TouchScreen.onSwipeRight(this.element, this.rotate.bind(this, 'prev'));
        TouchScreen.onSwipeLeft(this.element,  this.rotate.bind(this, 'next'));

        return this;
    }


    startRotating() {
        this.state.rotateInterval = setInterval(
                        this.rotate.bind(this, 'next'),
                        this.state.interval * 1000);

        return this;
    }


    stopRotating() {
        clearInterval(this.state.rotateInterval);

        return this;
    }


    makeSlideActive(index) {
        Utils.addClass(this.dom.slides[index],     '-active');
        Utils.addClass(this.dom.indicators[index], '-active');

        return this;
    }


    makeSlideInactive(index) {
        Utils.removeClass(this.dom.slides[index],     '-active');
        Utils.removeClass(this.dom.indicators[index], '-active');

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
            Utils.console.error('wrong carusel rotate param');
            return;
        }

        this.makeSlideInactive(currentSlide);
        this.makeSlideActive(nextSlide);

        this.state.currentSlide = nextSlide;

        return this;
    }
};

