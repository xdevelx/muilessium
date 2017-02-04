import { Component } from '../component';

import { aria   } from '../utils/aria';
import { extend } from '../utils/uncategorized';



export class MediaView extends Component {
    constructor(element, options) {
        super(element, options);

        this.dom = extend(this.dom, {
            media:       this.element.querySelector('.media'),
            description: this.element.querySelector('.description')
        });

        aria.set(this.dom.media, 'describedby', aria.setId(this.dom.description));
    }
};

