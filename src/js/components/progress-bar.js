// -----------------------------------------------------------------------------
// PROGRESS BAR COMPONENT
// -----------------------------------------------------------------------------
// Methods list:
//  - (default) initAria()
//  - setValue(newValue)


import { Component } from '../component';

import { aria         } from '../utils/aria';
import { getAttribute } from '../utils/attributes';
import { hasClass     } from '../utils/classes';
import { extend       } from '../utils/uncategorized';


export class ProgressBar extends Component {
    constructor(element, options) {
        super(element, options);

        this.domCache = extend(this.domCache, {
            indicator: element.querySelector('.indicator'),
            value: element.querySelector('.value')
        });

        this.state = extend(this.state, {
            isRadial: hasClass(element, '-radial'),
            value: parseInt(getAttribute(element, 'data-value', 0))
        });

        if (this.state.isRadial) {
            this.domCache.indicator = this.domCache.indicator.querySelector('.progress');
            this.state.radialRadius = getAttribute(this.domCache.indicator, 'r', 10);
        }

        this.setValue(this.state.value);
    }

    setValue(newValue) {
        let sign = 1;

        if (newValue < this.state.value) {
            sign = -1;
        }

        let update = () => {
            this.domCache.value.innerText = this.state.value + '%';

            if (this.state.isRadial) {
                const dasharray  = 2 * Math.PI * this.state.radialRadius;
                const dashoffset = this.state.value * dasharray / 100;

                this.domCache.indicator.style.strokeDashoffset = dasharray - dashoffset;
            } else {
                this.domCache.indicator.style.width = this.state.value + '%';
            }

            this.state.value += sign;

            if (((sign > 0) && (this.state.value <= newValue)) ||
                ((sign < 0) && (this.state.value >= newValue))) {
                requestAnimationFrame(update);
            }
        };

        update();
    }
};

