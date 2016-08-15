var Utils = (function() {
    function Utils() {
        return this;
    }
    
    Utils.extend = function(a, b){
        for(var key in b) {
            if(b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        
        return a;
    };
    
    Utils.console = {
        log: function(message) {
            console.log('Muilessium: ' + message);
        },
        
        warning: function(message) {
            console.warning('[WARNING] Muilessium: ' + message);
        },
        
        error: function(message) {
            console.error('[ERROR] Muilessium: ' + message);
        }
    };
    
    Utils.stringify = function(object) {
        if (typeof object !== 'object') {
            Utils.console.warning('object for stringifying is not an object');
        }
        
        return JSON.stringify(object);
    };
    
    Utils.addClass = function(element, newClass) {
        if (!document.contains(element)) {
            Utils.console.error('cannot add class to element ' + element + '. No such element');
            throw new Error();
        }
        
        if (element.className.indexOf(newClass) !== -1) {
            Utils.console.log('class ' + newClass + ' already added to element ' + element);
            return;
        }
        
        element.className += ' ' + newClass;
    };
    
    Utils.removeClass = function(element, classForRemoving) {
        if (!document.contains(element)) {
            Utils.console.error('cannot add class to element ' + element + '. No such element');
            throw new Error();
        }
        
        element.className = element.className.replace(classForRemoving, '');
    };
    
    return Utils;
}());