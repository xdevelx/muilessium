// -----------------------------------------------------------------------------
// Unit test template
// -----------------------------------------------------------------------------

var traceur = require('traceur');

traceur.require.makeDefault(function(filename) {
    return filename.indexOf('node_modules') === -1;
});

// var _ = require('../src/js/utils.js');


module.exports = {
    ['template']: function(test) {
        var cleanup = require('jsdom-global')();

        test.expect(1);
        test.ok(true, 'this assertion should pass');

        cleanup();
        test.done();
    }
};
