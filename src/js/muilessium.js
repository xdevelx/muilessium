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
            Utils.console.log('creating mui-input for ' + element +
                              ' with options ' + Utils.stringify(options));
            
            element.getElementsByTagName('input')[0].addEventListener('change', function() {
                Utils.console.log('input value changed to "' + this.value + '"');
                
                if (this.value == '') {
                    Utils.removeClass(element, '-has-value');
                } else {
                    Utils.addClass(element, '-has-value');
                }
            });
        },
        
        textarea: function(element, options) {
            Utils.console.log('creating mui-textarea for ' + element +
                              ' with options ' + Utils.stringify(options));
            
            element.getElementsByTagName('textarea')[0].addEventListener('change', function() {
                Utils.console.log('textarea value changed to "' + this.value + '"');
                
                if (this.value == '') {
                    Utils.removeClass(element, '-has-value');
                } else {
                    Utils.addClass(element, '-has-value');
                }
            });
        }
    };
    
    return Muilessium;
}());

window.Muilessium = new Muilessium;

window.Muilessium.create('input', '.mui-input', {});
window.Muilessium.create('textarea', '.mui-textarea', {});