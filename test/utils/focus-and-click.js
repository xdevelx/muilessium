// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/focus-and-click.js
// -----------------------------------------------------------------------------


var traceur = require('traceur');

traceur.require.makeDefault(function(filename) {
    return filename.indexOf('node_modules') === -1;
});

require('jsdom-global/register');


var _ = require('../../src/js/utils.js');



module.exports = {
    ['makeElementFocusable']: function(test) {
        document.body.innerHTML = '<div></div>';

        var element = document.querySelector('div');

        // ---

        _.makeElementFocusable(element);

        // ---

        test.equal(element.tabIndex, 0, 'it should set the tabIndex attribute to zero');

        test.doesNotThrow(function() {
            _.makeElementFocusable(null);
            _.makeElementFocusable(undefined);
        });

        test.done();
    },



    ['makeElementsFocusable']: function(test) {
        document.body.innerHTML = '<div></div><div></div>';

        var elements = document.querySelectorAll('div');

        // ---

        _.makeElementsFocusable(elements);

        // ---

        [].forEach.call(elements, (element) => {
            test.equal(element.tabIndex, 0, 'it should set the tabIndex attribute of all selected elements to zero');
        });

        test.doesNotThrow(function() {
            _.makeElementsFocusable(null);
            _.makeElementsFocusable(undefined);
        });

        test.done();
    },



    ['makeElementNotFocusable']: function(test) {
        document.body.innerHTML = '<div tabindex="0"></div>';

        var element = document.querySelector('div');

        // ---

        _.makeElementNotFocusable(element);

        // ---

        test.equal(element.tabIndex, -1, 'it should set the tabIndex attribute to -1');

        test.doesNotThrow(function() {
            _.makeElementNotFocusable(null);
            _.makeElementNotFocusable(undefined);
        });

        test.done();
    },



    ['makeElementsNotFocusable']: function(test) {
        document.body.innerHTML = '<div tabindex="0"></div><div tabindex="1"></div>';

        var elements = document.querySelectorAll('div');

        // ---

        _.makeElementsNotFocusable(elements);

        // ---

        [].forEach.call(elements, (element) => {
            test.equal(element.tabIndex, -1, 'it should set the tabIndex attribute of all selected elements to zero');
        });

        test.doesNotThrow(function() {
            _.makeElementsNotFocusable(null);
            _.makeElementsNotFocusable(undefined);
        });

        test.done();
    },



    ['getFocusableChilds']: function(test) {
        document.body.innerHTML = '<div id="parent"><div tabindex="0"></div><div tabindex="1"></div><div></div></div>';

        var parent = document.querySelector('#parent');

        // ---

        var childs = _.getFocusableChilds(parent);

        // ---

        test.equal(childs.length, 2);

        [].forEach.call(childs, (element) => {
            test.ok(element.tabIndex >= 0, 'it should return the array of focusable elements');
        });

        test.doesNotThrow(function() {
            _.getFocusableChilds(null);
            _.getFocusableChilds(undefined);
        });

        test.done();
    },



    ['getAllFocusableElements']: function(test) {
        document.body.innerHTML = '<div><div tabindex="0"></div><div tabindex="1"></div><div></div></div>';

        // ---

        var elements = _.getAllFocusableElements();

        // ---

        test.equal(elements.length, 2);

        [].forEach.call(elements, (element) => {
            test.ok(element.tabIndex >= 0, 'it should return the array of focusable elements');
        });

        test.done();
    },



    ['getNextFocusableElement']: function(test) {
        document.body.innerHTML = '<div><div id="prev" tabindex="0"></div><div id="next" tabindex="1"></div><div></div></div>';

        var element = document.querySelector('#prev');

        // ---

        var next1 = _.getNextFocusableElement(element),
            next2 = _.getNextFocusableElement(next1);

        // ---

        test.equal(next1.id, 'next');
        test.equal(next2, null);

        test.doesNotThrow(function() {
            _.getNextFocusableElement(null);
            _.getNextFocusableElement(undefined);
        });

        test.done();
    },



    ['getPreviousFocusableElement']: function(test) {
        document.body.innerHTML = '<div><div id="prev" tabindex="0"></div><div id="next" tabindex="1"></div><div></div></div>';

        var element = document.querySelector('#next');

        // ---

        var prev1 = _.getPreviousFocusableElement(element),
            prev2 = _.getPreviousFocusableElement(prev1);

        // ---

        test.equal(prev1.id, 'prev');
        test.equal(prev2, null);

        test.doesNotThrow(function() {
            _.getPreviousFocusableElement(null);
            _.getPreviousFocusableElement(undefined);
        });

        test.done();
    },



    ['goToNextFocusableElement']: function(test) {
        document.body.innerHTML = '<div><div id="prev" tabindex="0"></div><div id="next" tabindex="1"></div><div></div></div>';

        var element = document.querySelector('#prev');
        
        element.focus();

        // ---

        _.goToNextFocusableElement(element);

        // ---

        test.equal(document.activeElement.id, 'next');

        test.doesNotThrow(function() {
            _.goToNextFocusableElement(element);
            _.goToNextFocusableElement(null);
            _.goToNextFocusableElement(undefined);
        });

        test.done();
    },



    ['goToPreviousFocusableElement']: function(test) {
        document.body.innerHTML = '<div><div id="prev" tabindex="1"></div><div id="next" tabindex="1"></div><div></div></div>';

        var element = document.querySelector('#next');
        
        element.focus();

        // ---

        _.goToPreviousFocusableElement(element);

        // ---

        test.equal(document.activeElement.id, 'prev');

        test.doesNotThrow(function() {
            _.goToPreviousFocusableElement(element);
            _.goToPreviousFocusableElement(null);
            _.goToPreviousFocusableElement(undefined);
        });

        test.done();
    },



    ['makeElementClickable']: function(test) {
        document.body.innerHTML = '<div></div>';

        var element = document.querySelector('div');

        test.expect(2);

        // ---

        _.makeElementClickable(element, callback);

        // ---


        function callback() {
            test.ok(true, 'it should execute callback on the click event for the element');
        }

        element.click();

        test.doesNotThrow(function() {
            _.makeElementClickable(null);
            _.makeElementClickable(undefined);
            _.makeElementClickable(element, null);
            _.makeElementClickable(element, undefined);
        });

        test.done();
    },



    ['makeChildElementsClickable']: function(test) {
        document.body.innerHTML = '<div id="parent"><div></div><div></div></div>';

        var parent = document.querySelector('#parent'),
            childs = parent.querySelectorAll('div');

        test.expect(5);

        // ---

        _.makeChildElementsClickable(parent, childs, callback());

        // ---

        function callback() {
            var counter = 0;

            return function(index) {
                test.ok(true, 'it should set event listener on the click event for the element');
                test.equal(index, counter++, 'it should pass the index of the child element to the callback'); 
            }
        }

        [].forEach.call(childs, (child) => {
            child.click();
        });

        test.doesNotThrow(function() {
            _.makeChildElementsClickable(null);
            _.makeChildElementsClickable(undefined);
            _.makeChildElementsClickable(parent, null);
            _.makeChildElementsClickable(parent, undefined);
            _.makeChildElementsClickable(parent, childs, null);
            _.makeChildElementsClickable(parent, childs, undefined);
        });

        test.done();
    },



    ['onFocus']: function(test) {
        document.body.innerHTML = '<div tabindex="0"></div>';

        var element = document.querySelector('div');

        test.expect(2);

        // ---

        _.onFocus(element, callback);

        // ---

        function callback() {
            test.ok(true, 'it should execute the callback function on focus event');
        }

        element.focus();

        test.doesNotThrow(function() {
            _.onFocus(null);
            _.onFocus(undefined);
            _.onFocus(element, null);
            _.onFocus(element, undefined);
        });

        test.done();
    },



    ['onBlur']: function(test) {
        document.body.innerHTML = '<div tabindex="0"></div>';

        var element = document.querySelector('div');

        test.expect(2);

        // ---

        _.onBlur(element, callback);

        // ---

        function callback() {
            test.ok(true, 'it should execute the callback function on blur event');
        }

        element.focus();
        element.blur();

        test.doesNotThrow(function() {
            _.onBlur(null);
            _.onBlur(undefined);
            _.onBlur(element, null);
            _.onBlur(element, undefined);
        });

        test.done();
    },
};

