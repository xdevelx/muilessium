import * as Utils from '../utils';
import { Component } from '../component';


export class MediaView extends Component {
    constructor(element, options) {
        super(element, options);

        this.dom = Utils.extend(this.dom, {
            media: this.element.getElementsByClassName('media')[0],
            description: this.element.getElementsByClassName('description')[0]
        });

        Utils.aria.set(this.dom.media, 'describedby', Utils.aria.setId(this.dom.description));
    }
};

