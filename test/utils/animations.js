// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/animations.js
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
                'The appearance is important.',
                'All utilities for the animations should be tested manually.');

        callback();
    },



    ['typeText']: function(test) {
        document.body.innerHTML = '<div></div>';

        var element = document.querySelector('div');

        test.expect(2);

        // ---------------

        _.typeText(element, {
            text: 'text',
            delay: 120,
            cycle: false,
            times: -1
        }, callback);

        // ---------------
        
        function callback() {
            test.equal(element.innerHTML, 'text', 'it should print the text into the element');
            test.done();
        }

        test.doesNotThrow(function() {
            _.typeText(null);
            _.typeText(undefined);
            _.typeText(element, undefined);
        });
    },



    
    ['typeTexts']: function(test) {
        document.body.innerHTML = '<div></div>';

        var element = document.querySelector('div');

        // ---------------

        _.typeTexts(element, ['text-1', 'text-2']);

        // ---------------
        
        test.doesNotThrow(function() {
            _.typeTexts(null);
            _.typeTexts(undefined);
        });

        test.done();
    },
    



    ['activateAnimation']: function(test) {
        document.body.innerHTML = '<div class="other-class"></div>';

        var element = document.querySelector('div');

        // ---------------

        _.activateAnimation(element);

        // ---------------

        test.ok(element.classList.contains('-activated'),  'it should add "-activated" class to the element');
        test.ok(element.classList.contains('other-class'), 'it should not remove other classes from the element');

        test.doesNotThrow(function() {
            _.activateAnimation(null);
            _.activateAnimation(undefined);
        });

        test.done();
    },



    ['animateElement']: function(test) {
        document.body.innerHTML = '<div class="other-class fade-in"></div>';

        var element = document.querySelector('div');

        // ---------------

        _.animateElement(element, 'fade-out');

        // ---------------

        test.ok(element.classList.contains('-js-animation'), 'it should add "-js-animation" class to the element');
        test.ok(element.classList.contains('-fade-out'),     'it should add "-<animation-name>" class to the element');
        test.ok(element.classList.contains('-activated'),    'it should add "-activated" class to the element');
        test.ok(element.classList.contains('other-class'),   'it should not remove other classes from the element');

        test.doesNotThrow(function() {
            _.animateElement(null);
            _.animateElement(undefined);
            _.animateElement(element, null);
            _.animateElement(element, undefined);
        });

        test.done(); 
    }
};

