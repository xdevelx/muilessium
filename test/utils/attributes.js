// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/attributes.js
// -----------------------------------------------------------------------------


var traceur = require('traceur');

traceur.require.makeDefault(function(filename) {
    return filename.indexOf('node_modules') === -1;
});

require('jsdom-global/register');


var _ = require('../../src/js/utils.js');



module.exports = {
    ['setAttribute']: function(test) {
        document.body.innerHTML = '<div></div>';

        var element = document.querySelector('div');

        _.setAttribute(element, 'data-test', 'true');

        test.equal(element.getAttribute('data-test'), 'true', 'it should set the attribute of the element to the selected value');
        test.doesNotThrow(() => _.setAttribute(null, null));
        test.doesNotThrow(() => _.setAttribute(undefined, undefined));

        test.done();
    },



    ['getAttribute']: function(test) {
        document.body.innerHTML = '<div data-test="true"></div>';

        var element = document.querySelector('div');

        test.equal(_.getAttribute(element, 'data-test'), 'true', 'it should return the value of the attribute of the element');
        test.doesNotThrow(() => _.getAttribute(null, null));
        test.doesNotThrow(() => _.getAttribute(undefined, undefined));

        test.done();
    },



    ['removeAttribute']: function(test) {
        document.body.innerHTML = '<div data-test="true"></div>';

        var element = document.querySelector('div');

        _.removeAttribute(element, 'data-test');

        test.equal(element.getAttribute('data-test'), null, 'it should remove the attribute from the element');
        test.doesNotThrow(() => _.removeAttribute(null, null));
        test.doesNotThrow(() => _.removeAttribute(undefined, undefined));

        test.done();
    }
};

