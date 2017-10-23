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

        test.ok(_.hasClass(element, 'test-class'),     'it should return true if the element has the class');
        test.ok(!_.hasClass(element, 'another-class'), 'it should return false if the element has not the class');

        test.doesNotThrow(() => _.hasClass(null, null));
        test.doesNotThrow(() => _.hasClass(undefined, undefined));

        test.done();
    },



    ['hasNotClass']: function(test) {
        document.body.innerHTML = '<div class="test-class"></div>';

        var element = document.querySelector('div');

        test.ok(!_.hasNotClass(element, 'test-class'),   'it should return false if the element has the class');
        test.ok(_.hasNotClass(element, 'another-class'), 'it should return true if the element has not the class');

        test.doesNotThrow(() => _.hasNotClass(null, null));
        test.doesNotThrow(() => _.hasNotClass(undefined, undefined));

        test.done();
    },



    ['addClass']: function(test) {
        document.body.innerHTML = '<div class="old-class"></div>';

        var element = document.querySelector('div');

        _.addClass(element, 'new-class');

        test.ok(element.classList.contains('new-class'), 'it should add the new class to the element');
        test.ok(element.classList.contains('old-class'), 'it should not remove the old classes from the element');

        test.doesNotThrow(() => _.addClass(null, null));
        test.doesNotThrow(() => _.addClass(undefined, undefined));

        test.done();
    },



    ['addClasses']: function(test) {
        document.body.innerHTML = '<div class="old-class"></div>';

        var element = document.querySelector('div');

        _.addClasses(element, 'new-class-1', 'new-class-2');

        test.ok(element.classList.contains('new-class-1'), 'it should add the new classes to the element');
        test.ok(element.classList.contains('new-class-1'), 'it should add the new classes to the element');
        test.ok(element.classList.contains('old-class'),   'it should not remove the old classes from the element');

        test.doesNotThrow(() => _.addClasses(null, null));
        test.doesNotThrow(() => _.addClasses(undefined, undefined));

        test.done();
    },



    ['removeClass']: function(test) {
        document.body.innerHTML = '<div class="old-class other-class"></div>';

        var element = document.querySelector('div');

        _.removeClass(element, 'old-class');

        test.ok(!element.classList.contains('old-class'),  'it should remove the old class from the element');
        test.ok(element.classList.contains('other-class'), 'it should not remove other classes from the element');

        test.doesNotThrow(() => _.removeClass(null, null));
        test.doesNotThrow(() => _.removeClass(undefined, undefined));

        test.done();
    },



    ['removeClasses']: function(test) {
        document.body.innerHTML = '<div class="old-class-1 old-class-2 other-class"></div>';

        var element = document.querySelector('div');

        _.removeClasses(element, 'old-class-1', 'old-class-2');

        test.ok(!element.classList.contains('old-class-1'),  'it should remove the old classes from the element');
        test.ok(!element.classList.contains('old-class-2'),  'it should remove the old classes from the element');
        test.ok(element.classList.contains('other-class'),   'it should not remove other classes from the element');

        test.doesNotThrow(() => _.removeClasses(null, null));
        test.doesNotThrow(() => _.removeClasses(undefined, undefined));

        test.done();
    },



    ['replaceClass']: function(test) {
        document.body.innerHTML = '<div class="old-class other-class"></div>';

        var element = document.querySelector('div');

        _.replaceClass(element, 'old-class', 'new-class');

        test.ok(!element.classList.contains('old-class'),  'it should remove the old class from the element');
        test.ok(element.classList.contains('new-class'),   'it should add the new class to the element');
        test.ok(element.classList.contains('other-class'), 'it should not remove other classes from the element');

        test.doesNotThrow(() => _.replaceClass(null, null, null));
        test.doesNotThrow(() => _.replaceClass(undefined, undefined, undefined));

        test.done();
    },



    ['toggleClass']: function(test) {
        document.body.innerHTML = '<div class="test-class other-class"></div>';

        var element = document.querySelector('div');

        _.toggleClass(element, 'test-class');

        test.ok(!element.classList.contains('test-class'), 'it should remove the class from the element');
        test.ok(element.classList.contains('other-class'), 'it should not remove other classes from the element');

        _.toggleClass(element, 'test-class');

        test.ok(element.classList.contains('test-class'),  'it should add the class to the element');
        test.ok(element.classList.contains('other-class'), 'it should not remove other classes from the element');

        test.doesNotThrow(() => _.toggleClass(null, null));
        test.doesNotThrow(() => _.toggleClass(undefined, undefined));

        test.done();
    },
};

