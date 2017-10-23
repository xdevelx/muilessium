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

        test.doesNotThrow(() => _.hasClass(null));
        test.doesNotThrow(() => _.hasClass(undefined));
        test.doesNotThrow(() => _.hasClass(element, null));
        test.doesNotThrow(() => _.hasClass(element, undefined));

        test.done();
    },



    ['hasNotClass']: function(test) {
        document.body.innerHTML = '<div class="test-class"></div>';

        var element = document.querySelector('div');

        test.ok(!_.hasNotClass(element, 'test-class'),   'it should return false if the element has the class');
        test.ok(_.hasNotClass(element, 'another-class'), 'it should return true if the element has not the class');

        test.doesNotThrow(() => _.hasNotClass(null));
        test.doesNotThrow(() => _.hasNotClass(undefined));
        test.doesNotThrow(() => _.hasNotClass(element, null));
        test.doesNotThrow(() => _.hasNotClass(element, undefined));

        test.done();
    },



    ['addClass']: function(test) {
        document.body.innerHTML = '<div class="old-class"></div>';

        var element = document.querySelector('div');

        _.addClass(element, 'new-class');

        test.ok(element.classList.contains('new-class'), 'it should add the new class to the element');
        test.ok(element.classList.contains('old-class'), 'it should not remove the old classes from the element');

        test.doesNotThrow(() => _.addClass(null));
        test.doesNotThrow(() => _.addClass(undefined));
        test.doesNotThrow(() => _.addClass(element, null));
        test.doesNotThrow(() => _.addClass(element, undefined));

        test.done();
    },



    ['addClasses']: function(test) {
        document.body.innerHTML = '<div class="old-class"></div>';

        var element = document.querySelector('div');

        _.addClasses(element, 'new-class-1', 'new-class-2');

        test.ok(element.classList.contains('new-class-1'), 'it should add the new classes to the element');
        test.ok(element.classList.contains('new-class-1'), 'it should add the new classes to the element');
        test.ok(element.classList.contains('old-class'),   'it should not remove the old classes from the element');

        test.doesNotThrow(() => _.addClasses(null));
        test.doesNotThrow(() => _.addClasses(undefined));
        test.doesNotThrow(() => _.addClasses(element, null));
        test.doesNotThrow(() => _.addClasses(element, undefined));

        test.done();
    },



    ['removeClass']: function(test) {
        document.body.innerHTML = '<div class="old-class other-class"></div>';

        var element = document.querySelector('div');

        _.removeClass(element, 'old-class');

        test.ok(!element.classList.contains('old-class'),  'it should remove the old class from the element');
        test.ok(element.classList.contains('other-class'), 'it should not remove other classes from the element');

        test.doesNotThrow(() => _.removeClass(null));
        test.doesNotThrow(() => _.removeClass(undefined));
        test.doesNotThrow(() => _.removeClass(element, null));
        test.doesNotThrow(() => _.removeClass(element, undefined));

        test.done();
    },



    ['removeClasses']: function(test) {
        document.body.innerHTML = '<div class="old-class-1 old-class-2 other-class"></div>';

        var element = document.querySelector('div');

        _.removeClasses(element, 'old-class-1', 'old-class-2');

        test.ok(!element.classList.contains('old-class-1'),  'it should remove the old classes from the element');
        test.ok(!element.classList.contains('old-class-2'),  'it should remove the old classes from the element');
        test.ok(element.classList.contains('other-class'),   'it should not remove other classes from the element');

        test.doesNotThrow(() => _.removeClasses(null));
        test.doesNotThrow(() => _.removeClasses(undefined));
        test.doesNotThrow(() => _.removeClasses(element, null));
        test.doesNotThrow(() => _.removeClasses(element, undefined));

        test.done();
    },



    ['replaceClass']: function(test) {
        document.body.innerHTML = '<div class="old-class other-class"></div>';

        var element = document.querySelector('div');

        _.replaceClass(element, 'old-class', 'new-class');

        test.ok(!element.classList.contains('old-class'),  'it should remove the old class from the element');
        test.ok(element.classList.contains('new-class'),   'it should add the new class to the element');
        test.ok(element.classList.contains('other-class'), 'it should not remove other classes from the element');

        test.doesNotThrow(() => _.replaceClass(null));
        test.doesNotThrow(() => _.replaceClass(undefined));
        test.doesNotThrow(() => _.replaceClass(element, null));
        test.doesNotThrow(() => _.replaceClass(element, undefined));
        test.doesNotThrow(() => _.replaceClass(element, 'old-class', null));
        test.doesNotThrow(() => _.replaceClass(element, 'old-class', undefined));

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

        test.doesNotThrow(() => _.toggleClass(null));
        test.doesNotThrow(() => _.toggleClass(undefined));
        test.doesNotThrow(() => _.toggleClass(element, null));
        test.doesNotThrow(() => _.toggleClass(element, undefined));

        test.done();
    },
};

