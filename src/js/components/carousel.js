import * as Utils from '../utils';
import { Component } from '../component';


export class Carousel extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log('creating mui-carousel for ' + element +
                        ' with options ' + JSON.stringify(options));

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
            currentSlide: 0
        });

        if (this.dom.indicators.length !== this.dom.slides.length) {
            Utils.console.warning('number of slides and number of indicators are not equal');
        }

        this.makeSlideActive(0);

        this.rotateInterval = setInterval(this.rotate.bind(this, 'next'), 1500);

        element.addEventListener('mouseover', () => {
            clearInterval(this.rotateInterval);
        });

        element.addEventListener('mouseout', () => {
            this.rotateInterval = setInterval(this.rotate.bind(this, 'next'), 1500);
        });

        Utils.makeChildElementsClickable(this.element, this.dom.controls.prev, () => {
            this.rotate('prev');
        });

        Utils.makeChildElementsClickable(this.element, this.dom.controls.next, () => {
            this.rotate('next');
        });

        Utils.makeChildElementsClickable(this.element, this.dom.indicators, (index) => {
            this.rotate(index);
        });

        this.state.initialized = true;
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
}

