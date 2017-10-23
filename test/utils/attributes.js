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

        test.doesNotThrow(() => _.setAttribute(null));
        test.doesNotThrow(() => _.setAttribute(undefined));
        test.doesNotThrow(() => _.setAttribute(element, null));
        test.doesNotThrow(() => _.setAttribute(element, undefined));
        test.doesNotThrow(() => _.setAttribute(element, 'data-test', null));
        test.doesNotThrow(() => _.setAttribute(element, 'data-test', undefined));

        test.done();
    },



    ['getAttribute']: function(test) {
        document.body.innerHTML = '<div data-test="true"></div>';

        var element = document.querySelector('div');

        test.equal(_.getAttribute(element, 'data-test'), 'true', 'it should return the value of the attribute of the element');

        test.doesNotThrow(() => _.getAttribute(null));
        test.doesNotThrow(() => _.getAttribute(undefined));
        test.doesNotThrow(() => _.getAttribute(element, null));
        test.doesNotThrow(() => _.getAttribute(element, undefined));

        test.done();
    },



    ['removeAttribute']: function(test) {
        document.body.innerHTML = '<div data-test="true"></div>';

        var element = document.querySelector('div');

        _.removeAttribute(element, 'data-test');

        test.equal(element.getAttribute('data-test'), null, 'it should remove the attribute from the element');

        test.doesNotThrow(() => _.removeAttribute(null));
        test.doesNotThrow(() => _.removeAttribute(undefined));
        test.doesNotThrow(() => _.removeAttribute(element, null));
        test.doesNotThrow(() => _.removeAttribute(element, undefined));

        test.done();
    }
};

