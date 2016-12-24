import * as Utils from '../utils';
import { Component } from '../component';


export class Carousel extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.log(`creating carousel for the <${element.nodeName}> with options ${JSON.stringify(options)}`);

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

        this.initAria();
        this.initControls();
        this.makeSlideActive(0);
        this.startRotating();

        Utils.console.ok('carousel has been created');
    }


    initAria() {
        return this;
    }


    initControls() {
        this.element.addEventListener('mouseover', this.stopRotating.bind(this));
        this.element.addEventListener('mouseout',  this.startRotating.bind(this));

        Utils.makeChildElementsClickable(this.element, this.dom.controls.prev, () => {
            this.rotate('prev');
        });

        Utils.makeChildElementsClickable(this.element, this.dom.controls.next, () => {
            this.rotate('next');
        });

        Utils.makeChildElementsClickable(this.element, this.dom.indicators, (index) => {
            this.rotate(index);
        });

        return this;
    }


    startRotating() {
        Utils.console.log(`start rotating carousel`);

        this.state.rotateInterval = setInterval(this.rotate.bind(this, 'next'), 5000);

        return this;
    }


    stopRotating() {
        Utils.console.log(`stop rotating carousel`);

        clearInterval(this.state.rotateInterval);

        return this;
    }


    makeSlideActive(index) {
        Utils.console.log(`making carousel slide #${index} active`);

        Utils.addClass(this.dom.slides[index],     '-active');
        Utils.addClass(this.dom.indicators[index], '-active');

        return this;
    }


    makeSlideInactive(index) {
        Utils.console.log(`making carousel slide #${index} inactive`);

        Utils.removeClass(this.dom.slides[index],     '-active');
        Utils.removeClass(this.dom.indicators[index], '-active');

        return this;
    }


    rotate(param) {
        Utils.console.log(`rotating carousel`);

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

