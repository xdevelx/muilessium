export class EventsObserver {
    constructor(element) {
        this.element = element;
        this.eventListeners = [];
        this.userEventListeners = [];
    }
    
    addEventListener(event, listener) {
        if (!this.userEventListeners.hasOwnProperty(event)) {
            this.userEventListeners[event] = [];    
        }

        this.userEventListeners[event].push(listener);
        this.updateEventListeners();
    }
    
    removeEventListener(event, listener) {
        if (this.userEventListeners.hasOwnProperty(event)) {
            var indexOfListener = this.userEventListeners[event].findIndex(function(func) {
                return func.name === listener.name;
            });
            
            if (indexOfListener > -1) {
                this.userEventListeners[event].splice(indexOfListener, 1);
                this.updateEventListeners();
            }
        }
    }
    
    updateEventListeners() {
        var _this = this;
        
        this.eventListeners.forEach(function(listenerInfo) {
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
            _this.eventListeners.push(listenerInfo);
        });
    }
}
