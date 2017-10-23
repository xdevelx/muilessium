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

        _.makeElementFocusable(element);

        test.equal(element.tabIndex, 0, 'it should set the tabIndex attribute to zero');

        test.doesNotThrow(() => _.makeElementFocusable(null));
        test.doesNotThrow(() => _.makeElementFocusable(undefined));

        test.done();
    },



    ['makeElementsFocusable']: function(test) {
        document.body.innerHTML = '<div></div><div></div>';

        var elements = document.querySelectorAll('div');

        _.makeElementsFocusable(elements);

        [].forEach.call(elements, (element) => {
            test.equal(element.tabIndex, 0, 'it should set the tabIndex attribute of all selected elements to zero');
        });

        test.doesNotThrow(() => _.makeElementsFocusable(null));
        test.doesNotThrow(() => _.makeElementsFocusable(undefined));

        test.done();
    },



    ['makeElementNotFocusable']: function(test) {
        document.body.innerHTML = '<div tabindex="0"></div>';

        var element = document.querySelector('div');

        _.makeElementNotFocusable(element);

        test.equal(element.tabIndex, -1, 'it should set the tabIndex attribute to -1');

        test.doesNotThrow(() => _.makeElementNotFocusable(null));
        test.doesNotThrow(() => _.makeElementNotFocusable(undefined));

        test.done();
    },



    ['makeElementsNotFocusable']: function(test) {
        document.body.innerHTML = '<div tabindex="0"></div><div tabindex="1"></div>';

        var elements = document.querySelectorAll('div');

        _.makeElementsNotFocusable(elements);

        [].forEach.call(elements, (element) => {
            test.equal(element.tabIndex, -1, 'it should set the tabIndex attribute of all selected elements to zero');
        });

        test.doesNotThrow(() => _.makeElementsNotFocusable(null));
        test.doesNotThrow(() => _.makeElementsNotFocusable(undefined));

        test.done();
    },



    ['getFocusableChilds']: function(test) {
        document.body.innerHTML = '<div id="parent"><div tabindex="0"></div><div tabindex="1"></div><div></div></div>';

        var parent = document.querySelector('#parent'),
            childs = _.getFocusableChilds(parent);

        test.equal(childs.length, 2);

        [].forEach.call(childs, (element) => {
            test.ok(element.tabIndex >= 0, 'it should return the array of focusable elements');
        });

        test.doesNotThrow(() => _.getFocusableChilds(null));
        test.doesNotThrow(() => _.getFocusableChilds(undefined));

        test.done();
    },



    ['getAllFocusableElements']: function(test) {
        document.body.innerHTML = '<div><div tabindex="0"></div><div tabindex="1"></div><div></div></div>';

        var elements = _.getAllFocusableElements();

        test.equal(elements.length, 2);

        [].forEach.call(elements, (element) => {
            test.ok(element.tabIndex >= 0, 'it should return the array of focusable elements');
        });

        test.done();
    },



    ['getNextFocusableElement']: function(test) {
        document.body.innerHTML = '<div><div id="prev" tabindex="0"></div><div id="next" tabindex="1"></div><div></div></div>';

        var element = document.querySelector('#prev'),
            next = _.getNextFocusableElement(element);

        test.equal(next.id, 'next');

        next = _.getNextFocusableElement(next);

        test.equal(next, null);

        test.doesNotThrow(() => _.getNextFocusableElement(null));
        test.doesNotThrow(() => _.getNextFocusableElement(undefined));

        test.done();
    },



    ['getPreviousFocusableElement']: function(test) {
        document.body.innerHTML = '<div><div id="prev" tabindex="0"></div><div id="next" tabindex="1"></div><div></div></div>';

        var element = document.querySelector('#next'),
            prev = _.getPreviousFocusableElement(element);

        test.equal(prev.id, 'prev');

        prev = _.getPreviousFocusableElement(prev);

        test.equal(prev, null);

        test.doesNotThrow(() => _.getPreviousFocusableElement(null));
        test.doesNotThrow(() => _.getPreviousFocusableElement(undefined));

        test.done();
    },



    ['goToNextFocusableElement']: function(test) {
        document.body.innerHTML = '<div><div id="prev" tabindex="0"></div><div id="next" tabindex="1"></div><div></div></div>';

        var element = document.querySelector('#prev');
        
        element.focus();

        _.goToNextFocusableElement(element);

        test.equal(document.activeElement.id, 'next');

        test.doesNotThrow(() => _.goToNextFocusableElement(element));
        test.doesNotThrow(() => _.goToNextFocusableElement(null));
        test.doesNotThrow(() => _.goToNextFocusableElement(undefined));

        test.done();
    },



    ['goToPreviousFocusableElement']: function(test) {
        document.body.innerHTML = '<div><div id="prev" tabindex="1"></div><div id="next" tabindex="1"></div><div></div></div>';

        var element = document.querySelector('#next');
        
        element.focus();

        _.goToPreviousFocusableElement(element);

        test.equal(document.activeElement.id, 'prev');

        test.doesNotThrow(() => _.goToPreviousFocusableElement(element));
        test.doesNotThrow(() => _.goToPreviousFocusableElement(null));
        test.doesNotThrow(() => _.goToPreviousFocusableElement(undefined));

        test.done();
    },



    ['makeElementClickable']: function(test) {
        document.body.innerHTML = '<div></div>';

        var element = document.querySelector('div');

        test.expect(5);

        _.makeElementClickable(element, () => {
            test.ok(true, 'it should execute callback on the click event for the element');
        });

        element.click();

        test.doesNotThrow(() => _.makeElementClickable(null));
        test.doesNotThrow(() => _.makeElementClickable(undefined));
        test.doesNotThrow(() => _.makeElementClickable(element, null));
        test.doesNotThrow(() => _.makeElementClickable(element, undefined));

        test.done();
    },



    ['makeChildElementsClickable']: function(test) {
        document.body.innerHTML = '<div id="parent"><div></div><div></div></div>';

        var parent = document.querySelector('#parent'),
            childs = parent.querySelectorAll('div'),
            counter = 0;

        test.expect(10);

        _.makeChildElementsClickable(parent, childs, (index) => {
            test.ok(true, 'it should set event listener on the click event for the element');
            test.equal(index, counter++, 'it should pass the index of the child element to the callback'); 
        });

        [].forEach.call(childs, (child) => {
            child.click();
        });


        test.doesNotThrow(() => _.makeChildElementsClickable(null));
        test.doesNotThrow(() => _.makeChildElementsClickable(undefined));
        test.doesNotThrow(() => _.makeChildElementsClickable(parent, null));
        test.doesNotThrow(() => _.makeChildElementsClickable(parent, undefined));
        test.doesNotThrow(() => _.makeChildElementsClickable(parent, childs, null));
        test.doesNotThrow(() => _.makeChildElementsClickable(parent, childs, undefined));

        test.done();
    },



    ['onFocus']: function(test) {
        document.body.innerHTML = '<div tabindex="0"></div>';

        var element = document.querySelector('div');

        test.expect(5);

        _.onFocus(element, () => {
            test.ok(true, 'it should execute the callback function on focus event');
        });

        element.focus();

        test.doesNotThrow(() => _.onFocus(null));
        test.doesNotThrow(() => _.onFocus(undefined));
        test.doesNotThrow(() => _.onFocus(element, null));
        test.doesNotThrow(() => _.onFocus(element, undefined));

        test.done();
    },



    ['onBlur']: function(test) {
        document.body.innerHTML = '<div tabindex="0"></div>';

        var element = document.querySelector('div');

        test.expect(5);

        _.onBlur(element, () => {
            test.ok(true, 'it should execute the callback function on blur event');
        });

        element.focus();
        element.blur();

        test.doesNotThrow(() => _.onBlur(null));
        test.doesNotThrow(() => _.onBlur(undefined));
        test.doesNotThrow(() => _.onBlur(element, null));
        test.doesNotThrow(() => _.onBlur(element, undefined));

        test.done();
    },
};

