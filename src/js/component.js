import * as Utils from './utils';

export class component {
    constructor(element, options) {
        Utils.console.log('creating component');
        
        this.element = element;
        this.eventListeners = {};
        
        var _this = this;
        
        if (options && options.eventListeners) {
            Object.keys(options.eventListeners).forEach(function(event) {
                _this.addEventListener(event, options.eventListeners[event]);
            });
        }
    }
    
    addEventListener(event, callback) {
        if (!this.eventListeners.hasOwnProperty(event)) {
            this.eventListeners[event] = [];    
        }

        this.eventListeners[event].push(callback);
    }
    
    startEventListening() {
        var _this = this;
        
        Object.keys(this.eventListeners).forEach(function(event) {
            _this.element.addEventListener(event, function() {
                _this.eventListeners[event].forEach(function(callback) {
                    callback();
                });
            });
        });
    }
}