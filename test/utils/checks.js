// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/checks.js
// -----------------------------------------------------------------------------


var traceur = require('traceur');

traceur.require.makeDefault(function(filename) {
    return filename.indexOf('node_modules') === -1;
});

require('jsdom-global/register');


var _ = require('../../src/js/utils.js');



module.exports = {
    ['isNode']: function(test) {
        document.body.innerHTML = '<div></div>';

        var element = document.querySelector('div');

        // ---------------

        var resultPositive  = _.isNode(element),
            resultNegative  = _.isNode([])        ||
                              _.isNode(null)      ||
                              _.isNode(undefined);

        // ---------------

        test.ok(resultPositive,  'it should return "true" if the argument is a Node');
        test.ok(!resultNegative, 'it should return "false" if the argument is not a Node');

        test.done();
    },



    ['isInPage']: function(test) {
        document.body.innerHTML = '<div></div>';

        var element = document.querySelector('div');

        // ---------------

        var resultPositive = _.isInPage(element),
            resultNegative = _.isInPage(document.createElement('div')) ||
                             _.isInPage([])                            ||
                             _.isInPage(null)                          ||
                             _.isInPage(undefined);

        // ---------------

        test.ok(resultPositive, 'it should return "true" if the element is in page');
        test.ok(!resultNegative, 'it should return "false" if the element is not in page');

        test.done();
    },



    ['isNotInPage']: function(test) {
        document.body.innerHTML = '<div></div>';

        var element = document.querySelector('div');

        // ---------------

        var resultPositive = _.isNotInPage(document.createElement('div')) ||
                             _.isNotInPage([])                            ||
                             _.isNotInPage(null)                          ||
                             _.isNotInPage(undefined),
            resultNegative = _.isNotInPage(element);

        // ---------------

        test.ok(resultPositive,  'it should return "true" if the element is not in page or invalid');
        test.ok(!resultNegative, 'it should return "false" if the element is in page');

        test.done();
    },



    ['ifExists']: function(test) {
        document.body.innerHTML = '<div></div>';

        var element = document.querySelector('div');

        test.expect(2);

        // ---------------

        var result = _.ifExists(element, callbackPositive);

        _.ifExists(document.createElement('div'), callbackNegative);
        _.ifExists([],                            callbackNegative);
        _.ifExists(null,                          callbackNegative);
        _.ifExists(undefined,                     callbackNegative);

        // ---------------

        function callbackPositive() {
            test.ok(true, 'it should execute the callback function if the element exists');
            return 1;
        }

        function callbackNegative() {
            test.ok(false, 'it should not execute the callback function if the argument is invalid');
        }

        test.equal(result, 1, 'it should return the result of execution of the callback function');

        test.done();
    },



    ['ifNodeList']: function(test) {
        document.body.innerHTML = '<div></div><div></div>';

        var elements = document.querySelectorAll('div');

        test.expect(2);

        // ---------------

        var result = _.ifNodeList(elements, callbackPositive);

        _.ifNodeList(elements[0], callbackNegative);
        _.ifNodeList([],          callbackNegative);
        _.ifNodeList(null,        callbackNegative);
        _.ifNodeList(undefined,   callbackNegative);

        // ---------------

        test.equal(result, 1, 'it should return the result of execution of the callback function');

        function callbackPositive() {
            test.ok(true, 'it should execute the callback function if the argument is a NodeList');
            return 1;
        }

        function callbackNegative() {
            test.ok(false, 'it should not execute the callback function if the argument is invalid');
        }

        test.done();
    },



    ['isDescendant']: function(test) {
        document.body.innerHTML = '<div id="parent"><div id="child"></div></div>';

        var parent = document.querySelector('#parent'),
            child  = document.querySelector('#child');

        // ---------------
    
        var resultPositive = _.isDescendant(parent, child),
            resultNegative = _.isDescendant(child, parent) ||
                             _.isDescendant(child, child)  ||
                             _.isDescendant([], [])        ||
                             _.isDescendant(null, null)    ||
                             _.isDescendant(undefined, undefined);

        // ---------------

        test.ok(resultPositive,  'it should return "true" if the second element is the descendant of the first one');
        test.ok(!resultNegative, 'it should return false if the second element is not the descendant of the first one or the arguments are invalid');

        test.done();
    },
};

