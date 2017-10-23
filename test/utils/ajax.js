// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/ajax.js
//
// https://github.com/typicode/jsonplaceholder
// -----------------------------------------------------------------------------


var traceur = require('traceur');

traceur.require.makeDefault(function(filename) {
    return filename.indexOf('node_modules') === -1;
});

require('jsdom-global/register');



var _ = require('../../src/js/utils.js');



module.exports = {
    ['post']: function(test) {
        test.expect(1);

        // ---

        _.ajax.post(
            'http://jsonplaceholder.typicode.com/posts',
            { /* data */ },
            callbackPositive,
            callbackNegative
        );

        // ---

        function callbackPositive(responseText) {
            test.equal(JSON.parse(responseText).id, 101);
            test.done();
        }

        function callbackNegative(status, statusText) {
            test.ok(false, 'it seems like jsonplaceholder is down');            
            test.done();
        }
    },
    


    ['postProtected']: function(test) {
        test.expect(1);

        // ---

        _.ajax.postProtected(
            'http://jsonplaceholder.typicode.com/posts',
            { /* data */ },
            callbackPositive
        );

        // ---

        function callbackPositive(responseText) {
            test.equal(JSON.parse(responseText).id, 101);
            test.done();
        }
    },



    ['get']: function(test) {
        test.expect(1);

        // ---

        _.ajax.get(
            'http://jsonplaceholder.typicode.com/posts',
            callbackPositive,
            callbackNegative
        );

        // ---

        function callbackPositive(responseText) {
            test.equal(JSON.parse(responseText)[0].id, 1);
            test.done();
        }

        function callbackNegative(status, statusText) {
            test.ok(false, 'it seems like jsonplaceholder is down');            
            test.done();
        }
        
    },
    


    ['getProtected']: function(test) {
        test.expect(1);

        // ---

        _.ajax.getProtected(
            'http://jsonplaceholder.typicode.com/posts',
            callbackPositive
        );

        // ---

        function callbackPositive(responseText) {
            test.equal(JSON.parse(responseText)[0].id, 1);
            test.done();
        }
    },
};

