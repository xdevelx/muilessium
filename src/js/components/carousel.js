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

        Utils.addClass(this.dom.slides[0], '-active');
        Utils.addClass(this.dom.indicators[0], '-active');

        this.rotateInterval = setInterval(this.rotate.bind(this, 'next'), 1500);

        let _this = this;

        element.addEventListener('mouseover', () => {
            clearInterval(_this.rotateInterval);
        });

        element.addEventListener('mouseout', () => {
            _this.rotateInterval = setInterval(_this.rotate.bind(_this, 'next'), 1500);
        });

        Utils.makeChildElementsClickable(this.element, this.dom.controls.prev, () => {
            _this.rotate('prev');
        });

        Utils.makeChildElementsClickable(this.element, this.dom.controls.next, () => {
            _this.rotate('next');
        });

        Utils.makeChildElementsClickable(this.element, this.dom.indicators, (index) => {
            _this.rotate(index);
        });

        this.state.initialized = true;
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

        Utils.removeClass(this.dom.slides[currentSlide],     '-active');
        Utils.removeClass(this.dom.indicators[currentSlide], '-active');

        Utils.addClass(this.dom.slides[nextSlide],     '-active');
        Utils.addClass(this.dom.indicators[nextSlide], '-active');

        this.state.currentSlide = nextSlide;

        return this;
    }
}

