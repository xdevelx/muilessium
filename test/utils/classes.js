// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/classes.js
// -----------------------------------------------------------------------------


var traceur = require('traceur');

traceur.require.makeDefault(function(filename) {
    return filename.indexOf('node_modules') === -1;
});

require('jsdom-global/register');


var _ = require('../../src/js/utils.js');



module.exports = {
    ['hasClass']: function(test) {
        document.body.innerHTML = '<div class="test-class"></div>';

        var element = document.querySelector('div');

        // ---------------

        var resultPositive = _.hasClass(element, 'test-class'),
            resultNegative = _.hasClass(element, 'another-class');

        // ---------------

        test.ok(resultPositive,  'it should return true if the element has the class');
        test.ok(!resultNegative, 'it should return false if the element has not the class');

        test.doesNotThrow(function() {
            _.hasClass(null);
            _.hasClass(undefined);
            _.hasClass(element, null);
            _.hasClass(element, undefined);
        });

        test.done();
    },



    ['hasNotClass']: function(test) {
        document.body.innerHTML = '<div class="test-class"></div>';

        var element = document.querySelector('div');

        // ---------------

        var resultPositive = _.hasNotClass(element, 'another-class'),
            resultNegative = _.hasNotClass(element, 'test-class');

        // ---------------

        test.ok(resultPositive,  'it should return true if the element has not the class');
        test.ok(!resultNegative, 'it should return false if the element has the class');

        test.doesNotThrow(function() {
            _.hasNotClass(null);
            _.hasNotClass(undefined);
            _.hasNotClass(element, null);
            _.hasNotClass(element, undefined);
        });

        test.done();
    },



    ['addClass']: function(test) {
        document.body.innerHTML = '<div class="old-class"></div>';

        var element = document.querySelector('div');

        // ---------------

        _.addClass(element, 'new-class');

        // ---------------

        test.ok(element.classList.contains('new-class'), 'it should add the new class to the element');
        test.ok(element.classList.contains('old-class'), 'it should not remove the old classes from the element');

        test.doesNotThrow(function() {
            _.addClass(null);
            _.addClass(undefined);
            _.addClass(element, null);
            _.addClass(element, undefined);
        });

        test.done();
    },



    ['addClasses']: function(test) {
        document.body.innerHTML = '<div class="old-class"></div>';

        var element = document.querySelector('div');

        // ---------------

        _.addClasses(element, 'new-class-1', 'new-class-2');

        // ---------------

        test.ok(element.classList.contains('new-class-1'), 'it should add the new classes to the element');
        test.ok(element.classList.contains('new-class-1'), 'it should add the new classes to the element');
        test.ok(element.classList.contains('old-class'),   'it should not remove the old classes from the element');

        test.doesNotThrow(function() {
            _.addClasses(null);
            _.addClasses(undefined);
            _.addClasses(element, null);
            _.addClasses(element, undefined);
        });

        test.done();
    },



    ['removeClass']: function(test) {
        document.body.innerHTML = '<div class="old-class other-class"></div>';

        var element = document.querySelector('div');

        // ---------------

        _.removeClass(element, 'old-class');

        // ---------------

        test.ok(!element.classList.contains('old-class'),  'it should remove the old class from the element');
        test.ok(element.classList.contains('other-class'), 'it should not remove other classes from the element');

        test.doesNotThrow(function() {
            _.removeClass(null);
            _.removeClass(undefined);
            _.removeClass(element, null);
            _.removeClass(element, undefined);
        });

        test.done();
    },



    ['removeClasses']: function(test) {
        document.body.innerHTML = '<div class="old-class-1 old-class-2 other-class"></div>';

        var element = document.querySelector('div');

        // ---------------

        _.removeClasses(element, 'old-class-1', 'old-class-2');

        // ---------------

        test.ok(!element.classList.contains('old-class-1'),  'it should remove the old classes from the element');
        test.ok(!element.classList.contains('old-class-2'),  'it should remove the old classes from the element');
        test.ok(element.classList.contains('other-class'),   'it should not remove other classes from the element');

        test.doesNotThrow(function() {
            _.removeClasses(null);
            _.removeClasses(undefined);
            _.removeClasses(element, null);
            _.removeClasses(element, undefined);
        });

        test.done();
    },



    ['replaceClass']: function(test) {
        document.body.innerHTML = '<div class="old-class other-class"></div>';

        var element = document.querySelector('div');

        // ---------------

        _.replaceClass(element, 'old-class', 'new-class');

        // ---------------

        test.ok(!element.classList.contains('old-class'),  'it should remove the old class from the element');
        test.ok(element.classList.contains('new-class'),   'it should add the new class to the element');
        test.ok(element.classList.contains('other-class'), 'it should not remove other classes from the element');

        test.doesNotThrow(function() {
            _.replaceClass(null);
            _.replaceClass(undefined);
            _.replaceClass(element, null);
            _.replaceClass(element, undefined);
            _.replaceClass(element, 'old-class', null);
            _.replaceClass(element, 'old-class', undefined);
        });

        test.done();
    },



    ['toggleClass']: function(test) {
        document.body.innerHTML = '<div class="test-class-1 other-class"></div>';

        var element = document.querySelector('div');

        // ---------------

        _.toggleClass(element, 'test-class-1');
        _.toggleClass(element, 'test-class-2');

        // ---------------

        test.ok(!element.classList.contains('test-class-1'), 'it should remove the class from the element');
        test.ok(element.classList.contains('test-class-2'),  'it should add the class to the element');
        test.ok(element.classList.contains('other-class'), 'it should not remove other classes from the element');

        test.doesNotThrow(function() {
            _.toggleClass(null);
            _.toggleClass(undefined);
            _.toggleClass(element, null);
            _.toggleClass(element, undefined);
        });

        test.done();
    },
};

