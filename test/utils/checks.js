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

        test.ok(_.isNode(element),    'it should return "true" if the argument is a Node');
        test.ok(!_.isNode([]),        'it should return "false" if the argument is not a Node');
        test.ok(!_.isNode(null),      'it should return "false" if the argument is not a Node');
        test.ok(!_.isNode(undefined), 'it should return "false" if the argument is not a Node');

        test.done();
    },



    ['isInPage']: function(test) {
        document.body.innerHTML = '<div></div>';

        var element = document.querySelector('div');

        test.ok(_.isInPage(element),
                'it should return "true" if the element is in page');
        test.ok(!_.isInPage(document.createElement('div')),
                'it should return "false" if the element is not in page');

        test.ok(!_.isInPage([]),        'it should return "false" if the argument is invalid');
        test.ok(!_.isInPage(null),      'it should return "false" if the argument is invalid');
        test.ok(!_.isInPage(undefined), 'it should return "false" if the argument is invalid');

        test.done();
    },



    ['isNotInPage']: function(test) {
        document.body.innerHTML = '<div></div>';

        var element = document.querySelector('div');

        test.ok(!_.isNotInPage(element),
                'it should return "false" if the element is in page');
        test.ok(_.isNotInPage(document.createElement('div')),
                'it should return "true" if the element is not in page');

        test.ok(_.isNotInPage([]),        'it should return "true" if the argument is invalid');
        test.ok(_.isNotInPage(null),      'it should return "true" if the argument is invalid');
        test.ok(_.isNotInPage(undefined), 'it should return "true" if the argument is invalid');

        test.done();
    },



    ['ifExists']: function(test) {
        document.body.innerHTML = '<div></div>';

        var element = document.querySelector('div');

        test.expect(2);

        var result = _.ifExists(element, function() {
            test.ok(true, 'it should execute the callback function if the element exists');
            return 1;
        });

        test.equal(result, 1, 'it should return the result of execution of the callback function');

        _.ifExists(document.createElement('div'), function() {
            test.ok(false, 'it should not execute the callback function if the element not exists in the page');
        });

        _.ifExists([], function() {
            test.ok(false, 'it should not execute the callback function if the argument is invalid');
        });

        _.ifExists(null, function() {
            test.ok(false, 'it should not execute the callback function if the argument is invalid');
        });

        _.ifExists(undefined, function() {
            test.ok(false, 'it should not execute the callback function if the argument is invalid');
        });

        test.done();
    },



    ['ifNodeList']: function(test) {
        document.body.innerHTML = '<div></div><div></div>';

        var elements = document.querySelectorAll('div');

        test.expect(2);

        var result = _.ifNodeList(elements, function() {
            test.ok(true, 'it should execute the callback function if the argument is a NodeList');
            return 1;
        });

        test.equal(result, 1, 'it should return the result of execution of the callback function');

        _.ifNodeList(elements[0], function() {
            test.ok(false, 'it should not execute the callback function if the argument is a Node');
        });

        _.ifNodeList([], function() {
            test.ok(false, 'it should not execute the callback function if the argument is invalid');
        });

        _.ifNodeList(null, function() {
            test.ok(false, 'it should not execute the callback function if the argument is invalid');
        });

        _.ifNodeList(undefined, function() {
            test.ok(false, 'it should not execute the callback function if the argument is invalid');
        });

        test.done();
    },



    ['isDescendant']: function(test) {
        document.body.innerHTML = '<div id="parent"><div id="child"></div></div>';

        var parent = document.querySelector('#parent'),
            child  = document.querySelector('#child');

        test.ok(_.isDescendant(parent, child),
                'it should return "true" if the second element is the descendant of the first one');
        test.ok(!_.isDescendant(child, parent),
                'it should return "false" if the second element is not the descendant of the first one');
        test.ok(!_.isDescendant(child, child),
                'it should return "false" if the second element is not the descendant of the first one');
        test.ok(!_.isDescendant([], []),
                'it should return "false" if the arguments are invalid');
        test.ok(!_.isDescendant(null, null),
                'it should return "false" if the arguments are invalid');
        test.ok(!_.isDescendant(undefined, undefined),
                'it should return "false" if the arguments are invalid');

        test.done();
    },
};

