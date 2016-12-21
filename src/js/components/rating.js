import * as Utils from '../utils';
import { Component } from '../component';


export class Rating extends Component {
    constructor(element, options) {
        super(element, options);

        Utils.console.info(`creating mui-rating for the ${element} with options ${JSON.stringify(options)}`);

        this.dom = Utils.extend(this.dom, {
            stars: element.getElementsByClassName('star')
        });

        this.state = Utils.extend(this.state, {
            rating: element.getAttribute('data-rating'),
            maxRating: 5,
            minRating: 0
        });

        this.updateRating(this.state.rating);

        Utils.makeElementFocusable(element);

        element.addEventListener('keydown', (e) => {
            this.keyDownListener(e.keyCode);
        });

        Utils.makeChildElementsClickable(this.element, this.dom.stars, (index) => {
            this.updateRating(index + 1);
        }, true);

        [].forEach.call(this.dom.stars, (star) => {
            Utils.aria.set(star, 'hidden', true);
        });

        this.state.initialized = true;
    }


    updateRating(newRating) {
        if (newRating < this.state.minRating || newRating > this.state.maxRating) {
            Utils.console.error('wrong rating value');
            return this;
        }

        Utils.removeClass(this.element, '-r' + this.state.rating);
        Utils.addClass(this.element, '-r' + newRating);

        let newAriaLabel = Utils.aria.get(this.element, 'label').replace(this.state.rating, newRating);

        Utils.aria.set(this.element, 'label', newAriaLabel);

        this.element.setAttribute('data-rating', newRating);

        this.state.rating = newRating;

        this.element.blur();
        this.element.focus();

        return this;
    }


    increaseRating() {
        if (this.state.rating < this.state.maxRating) {
            this.updateRating(this.state.rating + 1);
        }

        return this;
    }


    decreaseRating() {
        if (this.state.rating > this.state.minRating) {
            this.updateRating(this.state.rating - 1);
        }

        return this;
    }


    keyDownListener(keyCode) {
        switch (keyCode) {
            case 37:
                this.decreaseRating();
                break;
            case 39:
                this.increaseRating();
                break;
            default:
                break;
        }

        return this;
    }
}
