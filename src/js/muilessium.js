var Muilessium = (function(options) {
    'use strict';
    
    function Muilessium(options) {
        this.options = Utils.extend(Muilessium.defaults, options);
        
        var that = this;
        
        document.addEventListener('DOMContentLoaded', function() {
            that.init();
        });
        
        return this;
    }
    
    Muilessium.defaults = {};
    
    Muilessium.prototype.init = function() {
        return this;
    };
    
    return Muilessium;
}());

window.Muilessium = new Muilessium;