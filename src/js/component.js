// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------
// This is a base component class. All other components from /src/js/components/
// should be inherited from it. Take a look at /src/js/components/sample-component.js
// for more information.
//
// Methods:
//   initAria()
//       ARIA markup should be initialized here. It is useful to use utilities
//       from /src/js/utils/aria.js
//   initControls()
//       Controls (keyboard, mouse or touchscreen) should be initialized here.
//       It is useful to use utilities from /src/js/utils/ and wrappers from
//       /src/js/controls/


import * as Utils from './utils';


export class Component {
    constructor(element, options) {
        this.domCache = {
            element: element
        };

        this.state = {};
    }

    initAria() {
        return this;
    }

    initControls() {
        return this;
    }
}

