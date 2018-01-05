// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/focus-and-click.js
// -----------------------------------------------------------------------------


require('babel-register')({
    presets: ['env']
});

require('jsdom-global/register');


var log = require('../../nodeunit.config.js').log,
    _   = require('../../src/js/utils.js').default;


module.exports = {
    ['makeElementFocusable']: function(test) {
        document.body.innerHTML = `<div></div>`;

        var element = document.querySelector('div');

        // ---------------

        _.makeElementFocusable(element);

        // ---------------

        test.equal(element.tabIndex, 0, 'It should set the tabIndex attribute to zero.');

        test.doesNotThrow(function() {
            _.makeElementFocusable(null);
            _.makeElementFocusable(undefined);
        });

        test.done();
    },



    ['makeElementsFocusable']: function(test) {
        document.body.innerHTML =
                `<div></div>
                 <div></div>`;

        var elements = document.querySelectorAll('div');

        // ---------------

        _.makeElementsFocusable(elements);

        // ---------------

        [].forEach.call(elements, (element) => {
            test.equal(element.tabIndex, 0, 'It should set the tabIndex attribute of all selected elements to zero.');
        });

        test.doesNotThrow(function() {
            _.makeElementsFocusable(null);
            _.makeElementsFocusable(undefined);
        });

        test.done();
    },



    ['makeElementNotFocusable']: function(test) {
        document.body.innerHTML = `<div tabindex='0'></div>`;

        var element = document.querySelector('div');

        // ---------------

        _.makeElementNotFocusable(element);

        // ---------------

        test.equal(element.tabIndex, -1, 'It should set the tabIndex attribute to -1.');

        test.doesNotThrow(function() {
            _.makeElementNotFocusable(null);
            _.makeElementNotFocusable(undefined);
        });

        test.done();
    },



    ['makeElementsNotFocusable']: function(test) {
        document.body.innerHTML =
                `<div tabindex='0'></div>
                 <div tabindex='1'></div>`;

        var elements = document.querySelectorAll('div');

        // ---------------

        _.makeElementsNotFocusable(elements);

        // ---------------

        [].forEach.call(elements, (element) => {
            test.equal(element.tabIndex, -1, 'It should set the tabIndex attribute of all selected elements to -1.');
        });

        test.doesNotThrow(function() {
            _.makeElementsNotFocusable(null);
            _.makeElementsNotFocusable(undefined);
        });

        test.done();
    },



    ['getFocusableChilds']: function(test) {
        document.body.innerHTML =
                `<div id='parent'>
                    <div tabindex='0'></div>
                    <div tabindex='1'></div>
                    <div></div>
                 </div>`;

        var parent = document.querySelector('#parent');

        // ---------------

        var childs = _.getFocusableChilds(parent);

        // ---------------

        test.equal(childs.length, 2);

        [].forEach.call(childs, (element) => {
            test.ok(element.tabIndex >= 0, 'It should return the array of focusable elements.');
        });

        test.doesNotThrow(function() {
            _.getFocusableChilds(null);
            _.getFocusableChilds(undefined);
        });

        test.done();
    },



    ['getAllFocusableElements']: function(test) {
        document.body.innerHTML =
                `<div>
                     <div tabindex='0'></div>
                     <div tabindex='1'></div>
                     <div></div>
                 </div>`;

        // ---------------

        var elements = _.getAllFocusableElements();

        // ---------------

        test.equal(elements.length, 2);

        [].forEach.call(elements, (element) => {
            test.ok(element.tabIndex >= 0, 'It should return the array of focusable elements.');
        });

        test.done();
    },



    ['getNextFocusableElement']: function(test) {
        document.body.innerHTML =
                `<div>
                     <div id='prev' tabindex='0'></div>
                     <div id='next' tabindex='1'></div>
                     <div></div>
                 </div>`;

        var element = document.querySelector('#prev');

        // ---------------

        var next1 = _.getNextFocusableElement(element),
            next2 = _.getNextFocusableElement(next1);

        // ---------------

        test.equal(next1.id, 'next', 'It should return the next focusable element.');
        test.equal(next2,    null,   'It should return "null" if the selected element is the last focusable element.');

        test.doesNotThrow(function() {
            _.getNextFocusableElement(null);
            _.getNextFocusableElement(undefined);
        });

        test.done();
    },



    ['getPreviousFocusableElement']: function(test) {
        document.body.innerHTML =
                `<div>
                     <div id='prev' tabindex='0'></div>
                     <div id='next' tabindex='1'></div>
                     <div></div>
                 </div>`;

        var element = document.querySelector('#next');

        // ---------------

        var prev1 = _.getPreviousFocusableElement(element),
            prev2 = _.getPreviousFocusableElement(prev1);

        // ---------------

        test.equal(prev1.id, 'prev', 'It should return the previous focusable element.');
        test.equal(prev2,    null,   'It should return "null" if the selected element is the first focusable element.');

        test.doesNotThrow(function() {
            _.getPreviousFocusableElement(null);
            _.getPreviousFocusableElement(undefined);
        });

        test.done();
    },



    ['goToNextFocusableElement']: function(test) {
        document.body.innerHTML =
                `<div>
                     <div id='prev' tabindex='0'></div>
                     <div id='next' tabindex='1'></div>
                     <div></div>
                 </div>`;

        var element = document.querySelector('#prev');
        
        element.focus();

        // ---------------

        _.goToNextFocusableElement(element);

        // ---------------

        test.equal(document.activeElement.id, 'next', 'It should move the focus to the next focusable element.');

        test.doesNotThrow(function() {
            _.goToNextFocusableElement(element);
            _.goToNextFocusableElement(null);
            _.goToNextFocusableElement(undefined);
        });

        test.done();
    },



    ['goToPreviousFocusableElement']: function(test) {
        document.body.innerHTML =
                `<div>
                     <div id='prev' tabindex='1'></div>
                     <div id='next' tabindex='1'></div>
                     <div></div>
                 </div>`;

        var element = document.querySelector('#next');
        
        element.focus();

        // ---------------

        _.goToPreviousFocusableElement(element);

        // ---------------

        test.equal(document.activeElement.id, 'prev', 'It should move the focus to the previous focusable element.');

        test.doesNotThrow(function() {
            _.goToPreviousFocusableElement(element);
            _.goToPreviousFocusableElement(null);
            _.goToPreviousFocusableElement(undefined);
        });

        test.done();
    },



    ['makeElementClickable']: function(test) {
        document.body.innerHTML =
                `<div></div>
                 <div></div>
                 <div></div>`;

        var elements = document.querySelectorAll('div'),
            isClicked = false,
            expectedResultsForMouse    = [true, true, false],
            expectedResultsForKeyboard = [true, false, true];

        test.expect(11);

        // ---------------

        _.makeElementClickable(elements[0], callback);
        _.makeElementClickable(elements[1], callback, { mouse: true,  keyboard: false });
        _.makeElementClickable(elements[2], callback, { mouse: false, keyboard: true  });

        // ---------------


        function callback() {
            test.ok(true, 'It should execute the callback function on the "click" event for the element.');
            isClicked = true;
        }

        [0,1,2].forEach(function(i) {
            isClicked = false;

            elements[i].click();

            test.equal(isClicked, expectedResultsForMouse[i],
                    'It should execute the callback function on the "mouse click" event.');
        });

        [0,1,2].forEach(function(i) {
            isClicked = false;

            elements[i].dispatchEvent(
                new KeyboardEvent('keydown', {
                    keyCode: 13,
                    which:   13
                })
            );

            test.equal(isClicked, expectedResultsForKeyboard[i],
                    'It should execute the callback function on the "enter pressed" event.');
        });

        test.doesNotThrow(function() {
            _.makeElementClickable(null);
            _.makeElementClickable(undefined);
            _.makeElementClickable(elements[0], null);
            _.makeElementClickable(elements[0], undefined);
        });

        test.done();
    },



    ['makeChildElementsClickable']: function(test) {
        document.body.innerHTML =
                `<div class='parent'>
                     <div></div>
                     <div></div>
                 </div> 
                 <div class='parent'>
                     <div></div>
                     <div></div>
                 </div>
                 <div class='parent'>
                     <div></div>
                     <div></div>
                 </div>`;

        var parents = document.querySelectorAll('.parent'),
            elements = [
                parents[0].querySelectorAll('div'),
                parents[1].querySelectorAll('div'),
                parents[2].querySelectorAll('div')
            ],
            isClicked = false,
            expectedResultsForMouse    = [true, true, false],
            expectedResultsForKeyboard = [true, false, true];

        test.expect(29);

        // ---------------

        _.makeChildElementsClickable(parents[0], elements[0], callback());
        _.makeChildElementsClickable(parents[1], elements[1], callback(), { mouse: true,  keyboard: false });
        _.makeChildElementsClickable(parents[2], elements[2], callback(), { mouse: false, keyboard: true  });

        // ---------------

        function callback() {
            var counter = 0;

            return function(index) {
                test.ok(true, 'It should set the event listener for the click event for the element.');
                test.equal(index, (counter++)%2, 'It should pass the index of the child element to the callback function.'); 
                isClicked = true;
            }
        }

        [0,1,2].forEach(function(testNumber) {
            var expectedResult = expectedResultsForMouse[testNumber];

            [0,1].forEach(function(i) {
                isClicked = false;

                elements[testNumber][i].click();

                test.equal(isClicked, expectedResult,
                        'It should execute the callback function on the "mouse click" event.');
            });
        });

        [0,1,2].forEach(function(testNumber) {
            var expectedResult = expectedResultsForKeyboard[testNumber];

            [0,1].forEach(function(i) {
                isClicked = false;

                elements[testNumber][i].dispatchEvent(
                    new KeyboardEvent('keydown', {
                        keyCode: 13,
                        which:   13
                    })
                );

                test.equal(isClicked, expectedResult,
                        'It should execute the callback function on the "enter pressed" event.');
            });
        });

        test.doesNotThrow(function() {
            _.makeChildElementsClickable(null);
            _.makeChildElementsClickable(undefined);
            _.makeChildElementsClickable(parent, null);
            _.makeChildElementsClickable(parent, undefined);
            _.makeChildElementsClickable(parent, elements, null);
            _.makeChildElementsClickable(parent, elements, undefined);
        });

        test.done();
    },



    ['onFocus']: function(test) {
        document.body.innerHTML = `<div tabindex='0'></div>`;

        var element = document.querySelector('div');

        test.expect(2);

        // ---------------

        _.onFocus(element, callback);

        // ---------------

        function callback() {
            test.ok(true, 'It should execute the callback function on the "focus" event.');
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
        document.body.innerHTML = `<div tabindex='0'></div>`;

        var element = document.querySelector('div');

        test.expect(2);

        // ---------------

        _.onBlur(element, callback);

        // ---------------

        function callback() {
            test.ok(true, 'It should execute the callback function on the "blur" event.');
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
    }
};

