// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/scroll.js
// -----------------------------------------------------------------------------


var traceur = require('traceur');

traceur.require.makeDefault(function(filename) {
    return filename.indexOf('node_modules') === -1;
});

require('jsdom-global/register');


var log = require('../../nodeunit.config.js').log,
    _   = require('../../src/js/utils.js').UTILS;


// This will fix the following error from jsdom runtime:
// - Error: Not implemented: window.scroll
window.scroll = function() {}

// It looks like smoothscroll-polyfill doesn't work with the latest jsdom
// versions. Here is little fix for it.
// See /src/js/polyfills.js for more information about polyfills.
window.HTMLElement.prototype.scrollIntoView = function() {}


module.exports = {
    ['scrollTo']: function(test) {
        log.warning('Window.scroll is not implemented in jsdom.',
                    'All scroll utilities should be tested manually.');

        document.body.innerHTML = `<div></div>`;

        var element = document.querySelector('div');
 
        // ---------------

        _.scrollTo(element, callback);

        // ---------------

        function callback() {
            test.ok(true, 'It should execute the callback function when scroll ends.');
            test.done();
        }

        test.doesNotThrow(function() {
            _.scrollTo(null);
            _.scrollTo(undefined);
            _.scrollTo(element, null);
            _.scrollTo(element, undefined);
        });
    },



    ['scrollToTop']: function(test) {
        document.body.innerHTML = ``;
 
        // ---------------

        _.scrollToTop(callback);

        // ---------------

        function callback() {
            test.ok(true, 'It should execute the callback function when scroll ends.');
            test.done();
        }

        test.doesNotThrow(function() {
            _.scrollTo(null);
            _.scrollTo(undefined);
        });
    },



    ['scrollFire']: function(test) {
        document.body.innerHTML = `<div></div>`;
 
        var element = document.querySelector('div');

        test.expect(2);

        // ---------------

        _.scrollFire(element, callback);

        // ---------------

        function callback() {
            test.ok(true, 'It should execute the callback function.');
        }

        test.doesNotThrow(function() {
            _.scrollFire(null);
            _.scrollFire(undefined);
            _.scrollFire(element, null);
            _.scrollFire(element, undefined);
        });

        test.done();
    }
};

