// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/animations.js
// -----------------------------------------------------------------------------


require('babel-register')({
    presets: ['env']
});


require('jsdom-global/register');


var log = require('../../nodeunit.config.js').log,
    _   = require('../../src/js/utils.js').default;



module.exports = {
    ['typeText']: function(test) {
        log.warning('The appearance is important.',
                    'All utilities for the animations should be tested manually.');

        document.body.innerHTML = `<div></div>`;

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
            test.equal(element.innerHTML, 'text', 'It should print the text in the element.');
            test.done();
        }

        test.doesNotThrow(function() {
            _.typeText(null);
            _.typeText(undefined);
            _.typeText(element, undefined);
        });
    },



    
    ['typeTexts']: function(test) {
        document.body.innerHTML = `<div></div>`;

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
        document.body.innerHTML = `<div class='other-class'></div>`;

        var element = document.querySelector('div');

        // ---------------

        _.activateAnimation(element);

        // ---------------

        test.ok(element.classList.contains('-activated'),  'It should add the "-activated" class to the element.');
        test.ok(element.classList.contains('other-class'), 'It should not remove other classes from the element.');

        test.doesNotThrow(function() {
            _.activateAnimation(null);
            _.activateAnimation(undefined);
        });

        test.done();
    },



    ['animateElement']: function(test) {
        document.body.innerHTML = `<div class='other-class fade-in'></div>`;

        var element = document.querySelector('div');

        // ---------------

        _.animateElement(element, 'fade-out');

        // ---------------

        test.ok(element.classList.contains('-js-animation'), 'It should add the "-js-animation" class to the element.');
        test.ok(element.classList.contains('-fade-out'),     'It should add the "-<animation-name>" class to the element.');
        test.ok(element.classList.contains('-activated'),    'It should add the "-activated" class to the element.');
        test.ok(element.classList.contains('other-class'),   'It should not remove other classes from the element.');

        test.doesNotThrow(function() {
            _.animateElement(null);
            _.animateElement(undefined);
            _.animateElement(element, null);
            _.animateElement(element, undefined);
        });

        test.done(); 
    }
};

