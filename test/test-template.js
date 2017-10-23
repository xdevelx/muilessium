// -----------------------------------------------------------------------------
// Unit test template
// -----------------------------------------------------------------------------

var traceur = require('traceur');

traceur.require.makeDefault(function(filename) {
    return filename.indexOf('node_modules') === -1;
});

require('jsdom-global/register');

var _ = require('../../src/js/utils.js');


module.exports = {
    ['template']: function(test) {
        test.expect(1);
        test.ok(true, 'this assertion should pass');

        test.done();
    }
};
