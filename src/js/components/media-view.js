// -----------------------------------------------------------------------------
// MEDIA VIEW COMPONENT
// -----------------------------------------------------------------------------
// Methods list:
//  - (default) initAria()


import { Component } from '../component';

import { aria   } from '../utils/aria';
import { extend } from '../utils/uncategorized';



export class MediaView extends Component {
    constructor(element, options) {
        super(element, options);

        this.domCache = extend(this.domCache, {
            media:       element.querySelector('.media'),
            description: element.querySelector('.description')
        });

        this.initAria();
    }

    initAria() {
        aria.set(this.domCache.media, 'describedby', aria.setId(this.domCache.description));

        return this;
    }
};

