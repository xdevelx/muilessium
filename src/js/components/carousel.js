import * as Utils from '../utils';
import { Component } from '../component';

export class Carousel extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log('creating mui-carousel for ' + element +
                        ' with options ' + JSON.stringify(options));

        this.dom               = {};
        this.dom.slides        = element.getElementsByClassName('mui-slide');
        this.dom.controls      = {};
        this.dom.controls.prev = element.getElementsByClassName('prev');
        this.dom.controls.next = element.getElementsByClassName('next');
        this.dom.indicators    = element.getElementsByClassName('indicator');

        this.state = {};
        this.state.numberOfSlides = this.dom.slides.length;
        this.state.currentSlide = 0;

        if (this.dom.indicators.length !== this.dom.slides.length) {
            Utils.console.warning('number of slides and number of indicators are not equal');
        }

        this.rotateInterval = setInterval(this.rotate.bind(this, 'next'), 1500);

        let _this = this;

        element.addEventListener('mouseover', function() {
            clearInterval(_this.rotateInterval);
        });

        element.addEventListener('mouseout', function() {
            _this.rotateInterval = setInterval(_this.rotate.bind(_this, 'next'), 1500);
        });

        [].forEach.call(this.dom.controls.prev, function(element) {
            element.addEventListener('click', function() {
                _this.rotate('prev');
            });
        });

        [].forEach.call(this.dom.controls.next, function(element) {
            element.addEventListener('click', function() {
                _this.rotate('next');
            });
        });

        [].forEach.call(this.dom.indicators, function(element, index) {
            element.addEventListener('click', function() {
                _this.rotate(index);
            });
        });
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
    }
}

