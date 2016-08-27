import * as Utils from './utils';

export class component {
    constructor(element, options) {
        Utils.console.log('creating component');
        
        this.element = element;
        this.userEventListeners = {};
        this.observerEventListeners = [];
        
        var _this = this;
        
        if (options && options.eventListeners) {
            Object.keys(options.eventListeners).forEach(function(event) {
                _this.addEventListener(event, options.eventListeners[event]);
            });
        }
    }
    
    addEventListener(event, listener) {
        if (!this.userEventListeners.hasOwnProperty(event)) {
            this.userEventListeners[event] = [];    
        }

        this.userEventListeners[event].push(listener);
        this.updateEventListenerHandlers();
    }
    
    removeEventListener(event, listener) {
        if (this.userEventListeners.hasOwnProperty(event)) {
            var indexOfListener = this.userEventListeners[event].findIndex(function(func) {
                return func.name === listener.name;
            });
            
            if (indexOfListener > -1) {
                this.userEventListeners[event].splice(indexOfListener, 1);
                this.updateEventListenerHandlers();
            }
        }
    }
    
    updateEventListenerHandlers() {
        var _this = this;
        
        this.observerEventListeners.forEach(function(listenerInfo) {
            _this.element.removeEventListener(
                listenerInfo.event, listenerInfo.listener);
        });
        
        _this.observerEventListeners = [];
        
        Object.keys(this.userEventListeners).forEach(function(event) {
            var listener = function() {
                _this.userEventListeners[event].forEach(function(callback) {
                    callback();
                });
            };
            
            var listenerInfo = {
                'event': event,
                'listener': listener
            };
            
            _this.element.addEventListener(event, listener);
            _this.observerEventListeners.push(listenerInfo);
        });
    }
}