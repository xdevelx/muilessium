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
    ['typeText']: function(test) {
        document.body.innerHTML = '<div></div>';

        var element = document.querySelector('div');

        test.expect(4);

        _.typeText(element, { text: 'text', delay: 120, cycle: false, times: -1 }, function() {
            test.equal(element.innerHTML, 'text', 'it should print the text into the element');
            test.done();
        });

        test.doesNotThrow(() => _.typeText(null));
        test.doesNotThrow(() => _.typeText(undefined));
        test.doesNotThrow(() => _.typeText(element, undefined));
    },



    
    ['typeTexts']: function(test) {
        document.body.innerHTML = '<div></div>';

        var element = document.querySelector('div');

        _.typeTexts(element, ['text-1', 'text-2']);
        
        test.doesNotThrow(() => _.typeTexts(null));
        test.doesNotThrow(() => _.typeTexts(undefined));

        test.done();
    },
    



    ['activateAnimation']: function(test) {
        document.body.innerHTML = '<div class="other-class"></div>';

        var element = document.querySelector('div');

        _.activateAnimation(element);

        test.ok(element.classList.contains('-activated'),  'it should add "-activated" class to the element');
        test.ok(element.classList.contains('other-class'), 'it should not remove other classes from the element');

        test.doesNotThrow(() => _.activateAnimation(null));
        test.doesNotThrow(() => _.activateAnimation(undefined));

        test.done();
    },



    ['animateElement']: function(test) {
        document.body.innerHTML = '<div class="other-class fade-in"></div>';

        var element = document.querySelector('div');

        _.animateElement(element, 'fade-out');

        test.ok(element.classList.contains('-js-animation'), 'it should add "-js-animation" class to the element');
        test.ok(element.classList.contains('-fade-out'),     'it should add "-<animation-name>" class to the element');
        test.ok(element.classList.contains('-activated'),    'it should add "-activated" class to the element');
        test.ok(element.classList.contains('other-class'),   'it should not remove other classes from the element');

        test.doesNotThrow(() => _.animateElement(null));
        test.doesNotThrow(() => _.animateElement(undefined));
        test.doesNotThrow(() => _.animateElement(element, null));
        test.doesNotThrow(() => _.animateElement(element, undefined));

        test.done(); 
    }
};

