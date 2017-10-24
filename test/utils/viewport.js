// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/viewport.js
// -----------------------------------------------------------------------------


var traceur = require('traceur');

traceur.require.makeDefault(function(filename) {
    return filename.indexOf('node_modules') === -1;
});

require('jsdom-global/register');


var _ = require('../../src/js/utils.js');


module.exports = {
    setUp: function (callback) {
        console.log('\x1b[33m%s %s\x1b[0m\n  %s', '!',
                'Rendering is not implemented in jsdom.',
                'All viewport utilities should be tested manually');

        callback();
    },



    ['isInViewport']: function(test) {
        document.body.innerHTML = '<div></div>';

        var element = document.querySelector('div');
 
        // ---------------

        var result = _.isInViewport(element);

        // ---------------

        test.ok(result, 'it should return true if the element is in the viewport');


        test.doesNotThrow(function() {
            _.isInViewport(null);
            _.isInViewport(undefined);
        });

        test.done();
    },



    ['isAboveViewport']: function(test) {
        document.body.innerHTML = '<div></div>';

        var element = document.querySelector('div');
 
        // ---------------

        var result = _.isInViewport(element);

        // ---------------

        test.ok(result, 'it should return true if the element is above the viewport');

        test.doesNotThrow(function() {
            _.isInViewport(null);
            _.isInViewport(undefined);
        });

        test.done();
    }
};

