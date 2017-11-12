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

// NOTICE: jsdom-global can pass options to the jsdom,
// but this feature is undocumented. Here is source code:
// https://github.com/rstacruz/jsdom-global/blob/master/index.js#L29
require('jsdom-global')('', {
    url: 'https://jsonplaceholder.typicode.com'
});



var log = require('../../nodeunit.config.js').log,
    _   = require('../../src/js/utils.js');


module.exports = {
    ['post']: function(test) {
        log.info('POST https://jsonplaceholder.typicode.com/posts');

        test.expect(1);

        // ---------------

        _.ajax.post(
            'https://jsonplaceholder.typicode.com/posts',
            { /* data */ },
            callbackPositive,
            callbackNegative
        );

        // ---------------

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
        log.info('POST https://jsonplaceholder.typicode.com/posts');

        test.expect(1);

        // ---------------

        _.ajax.postProtected(
            'https://jsonplaceholder.typicode.com/posts',
            { /* data */ },
            callbackPositive
        );

        // ---------------

        function callbackPositive(responseText) {
            test.equal(JSON.parse(responseText).id, 101);
            test.done();
        }
    },



    ['get']: function(test) {
        log.info('GET https://jsonplaceholder.typicode.com/posts');

        test.expect(1);

        // ---------------

        _.ajax.get(
            'https://jsonplaceholder.typicode.com/posts',
            callbackPositive,
            callbackNegative
        );

        // ---------------

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
        log.info('GET https://jsonplaceholder.typicode.com/posts');

        test.expect(1);

        // ---------------

        _.ajax.getProtected(
            'https://jsonplaceholder.typicode.com/posts',
            callbackPositive
        );

        // ---------------

        function callbackPositive(responseText) {
            test.equal(JSON.parse(responseText)[0].id, 1);
            test.done();
        }
    },
};

