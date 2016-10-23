import * as Utils from './utils';
import { EventsObserver } from './events-observer';

export class Component {
    constructor(element, options) {
        Utils.console.log('creating component');
        
        this.element = element;
        this.eventsObserver = new EventsObserver(element);

        var _this = this;
        
        if (options && options.eventListeners) {
            Object.keys(options.eventListeners).forEach(function(event) {
                _this.eventsObserver.addEventListener(event, options.eventListeners[event]);
            });
        }
    }
    
    addEventListener(event, listener) {
        this.eventsObserver.addEventListener(event, listener);
    }
    
    removeEventListener(event, listener) {
        this.eventsObserver.removeEventListener(event, listener);
    }
}
