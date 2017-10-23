// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/attributes.js
// -----------------------------------------------------------------------------


var traceur = require('traceur');

traceur.require.makeDefault(function(filename) {
    return filename.indexOf('node_modules') === -1;
});

require('jsdom-global/register');


var _ = require('../../src/js/utils.js');



module.exports = {
    ['setAttribute']: function(test) {
        document.body.innerHTML = '<div></div>';

        var element = document.querySelector('div');

        // ---------------

        _.setAttribute(element, 'data-test', 'true');

        // ---------------

        test.equal(element.getAttribute('data-test'), 'true', 'it should set the attribute of the element to the selected value');

        test.doesNotThrow(function() {
            _.setAttribute(null);
            _.setAttribute(undefined);
            _.setAttribute(element, null);
            _.setAttribute(element, undefined);
            _.setAttribute(element, 'data-test', null);
            _.setAttribute(element, 'data-test', undefined);
        });

        test.done();
    },



    ['getAttribute']: function(test) {
        document.body.innerHTML = '<div data-test="true"></div>';

        var element = document.querySelector('div');

        // ---------------

        var result = _.getAttribute(element, 'data-test');

        // ---------------

        test.equal(result, 'true', 'it should return the value of the attribute of the element');

        test.doesNotThrow(function() {
            _.getAttribute(null);
            _.getAttribute(undefined);
            _.getAttribute(element, null);
            _.getAttribute(element, undefined);
        });

        test.done();
    },



    ['removeAttribute']: function(test) {
        document.body.innerHTML = '<div data-test="true"></div>';

        var element = document.querySelector('div');

        // ---------------
    
        _.removeAttribute(element, 'data-test');

        // ---------------

        test.equal(element.getAttribute('data-test'), null, 'it should remove the attribute from the element');

        test.doesNotThrow(function() {
            _.removeAttribute(null);
            _.removeAttribute(undefined);
            _.removeAttribute(element, null);
            _.removeAttribute(element, undefined);
        });

        test.done();
    }
};

