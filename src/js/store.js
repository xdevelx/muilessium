// -----------------------------------------------------------------------------
// GLOBAL STORE
// -----------------------------------------------------------------------------
//
// This is a global page state. It should be available as Muilessium.STORE.
//
// -----------------------------------------------------------------------------


import { EVENTS } from './events';

import { deepGet } from './utils/uncategorized';
import { deepSet } from './utils/uncategorized';


class Store {
    constructor() {
        this.data = {};

        EVENTS.addEvent('state-changed');
    }

    set(path, data) {
        const result = deepSet(this.data, path, data);

        EVENTS.fireEvent('state-changed');

        return result;
    }

    get(path, data) {
        return deepGet(this.data, path);
    }
};


// -----------------------------------------------------------------------------

export let STORE = new Store();


