var Muilessium = (function(options) {
    'use strict';
    
    function Muilessium(options) {
        if (typeof Muilessium.instance === 'object') {
            return Muilessium.instance;
        }
        
        this.options = Utils.extend(Muilessium.defaults, options);
        
        var that = this;
        
        document.addEventListener('DOMContentLoaded', function() {
            that.init();
        });
        
        Muilessium.instance = this;
        
        return this;
    }
    
    Muilessium.defaults = {
        initialized: false
    };
    
    Muilessium.prototype.init = function() {
        this.options.initialized = true;
        return this;
    };
    
    Muilessium.prototype.create = function(type, selector, options) {
        if (typeof Muilessium.components[type] !== 'function') {
            throw new Error('No such component: ' + type);
        }
        
        var components = document.querySelectorAll(selector);
        
        return components.forEach(function(element) {
            new Muilessium.components[type](element, options);
        });
    };
    
    Muilessium.components = {
        input: function(element, options) {
        }
    };
    
    return Muilessium;
}());

window.Muilessium = new Muilessium;