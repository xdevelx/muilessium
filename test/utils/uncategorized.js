// -----------------------------------------------------------------------------
// Unit tests for utilities
// /src/js/utils/uncategorized.js
// -----------------------------------------------------------------------------


var traceur = require('traceur');

traceur.require.makeDefault(function(filename) {
    return filename.indexOf('node_modules') === -1;
});

require('jsdom-global/register');


var log = require('../../nodeunit.config.js').log,
    _   = require('../../src/js/utils.js').UTILS;


module.exports = {
    ['normalizeTabIndex']: function(test) {
        document.body.innerHTML =
                `<a        tabindex="1" href=''></a>
                 <button   tabindex="2"></button>
                 <input    tabindex="3"></input>
                 <label    tabindex="4"></label>
                 <select   tabindex="5"></select>
                 <textarea tabindex="6"></textarea>
                 <object   tabindex="7"></object>
                 <div></div>
                 <div></div>`;

        var focusableElements = document.querySelectorAll('a,button,input,label,select,textarea,object'),
            otherElements     = document.querySelectorAll('div');
 
        // ---------------

        _.normalizeTabIndex();

        // ---------------

        [].forEach.call(focusableElements, function(element) {
            test.equal(element.tabIndex, 0, 'It should set the tabindex of the focusable element to zero.')
        });

        [].forEach.call(otherElements, function(element) {
            test.equal(element.tabIndex, -1, 'It should not change the tabindex of other elements.')
        });

        test.done();
    },



    ['lazyLoadImages']: function(test) {
        log.warning('imagesLoaded does not works with jsdom.',
                    'The lazyLoadImages utility should be tested manually');

        var src    = 'http://via.placeholder.com/100x100',
            srcset = 'http://via.placeholder.com/100x100 1x, http://via.placeholder.com/200x200 2x',
            sizes  = '100%';

        document.body.innerHTML =
                `<img class='mui-image -js-lazy-load'
                     data-src='${src}'
                     data-srcset='${srcset}'
                     data-sizes='${sizes}'
                     src='...'>`;

        var image = document.querySelector('img');

        test.expect(3);
 
        // ---------------

        _.lazyLoadImages(callback);

        // ---------------

        function callback() {
            //test.ok(true, 'It should execute the callback function when all images loaded.');
        }

        test.equal(image.src,    src,    'It should set the src of the image equal to the data-src.');
        test.equal(image.srcset, srcset, 'It should set the srcset of the image equal to the data-srcset.');
        test.equal(image.sizes,  sizes,  'It should set the sizes of the image equal to the data-sizes.');

        test.done();
    },



    ['initAnchorLinks']: function(test) {
        document.body.innerHTML =
                `<a href='#test-id'></a>
                 <div id='test-id'></div>`;

        var link = document.querySelector('a');
 
        //test.expect(1);

        // ---------------


        // !!!!!!!!!!!!!!!!!!!!
        // WARNING
        // !!!!!!!!!!!!!!!!!!!!
        log.error('Some tests with smoothscroll-polyfill have been broken.', 'Repair needed.');
        test.done();
        return;


        _.initAnchorLinks();

        // ---------------

        link.click();

        setTimeout(function() {
            // JSDOM transforms the link.href from "#test-id" to the "about:blank#test-id"
            test.equal(window.location.hash.substring(1), link.href.split('#')[1],
                    'It should set the window.location.hash equal to the link.href after scrolling.');

            test.done();
        }, 500);
    },



    ['generateRandomString']: function(test) {
 
        // ---------------

        var resultStandard = _.generateRandomString(),
            resultCustom   = _.generateRandomString(3);

        // ---------------

        test.ok(/^[a-zA-Z0-9]{8}$/.test(resultStandard), 'It should generate a random string with the length = 8 by default.');
        test.ok(/^[a-zA-Z0-9]{3}$/.test(resultCustom),   'It should generate a random string with the selected length.');

        test.doesNotThrow(function() {
            _.generateRandomString(null);
        });

        test.done();
    },



    ['stringify']: function(test) {
        var objects = [
            null,
            undefined,
            [],
            {},
            [[],[]],
            {a:{},b:{}},
            function() {},
            [function() {}],
            {a:function() {}}
        ],

        expectedResults = [
            'null',
            'undefined',
            '[]',
            '{}',
            '[[],[]]',
            '{"a":{},"b":{}}',
            '"function"',
            '["function"]',
            '{"a":"function"}'
        ],

        results = [];

        test.expect(9);

        // ---------------

        objects.forEach(function(object) {
            results.push(_.stringify(object));
        });

        // ---------------

        results.forEach(function(result, index) {
            test.equal(result, expectedResults[index], 'It should stringify the object #' + index + '.');
        });

        test.done();
    },



    ['extend']: function(test) {
        var objects = [
            {a:{}},
            {b:{}}
        ],

        results = [];
 
        // ---------------

        results.push(_.extend(undefined,  undefined ));
        results.push(_.extend({},         undefined ));
        results.push(_.extend(undefined,  {}        ));
        results.push(_.extend(null,       null      ));
        results.push(_.extend({},         null      ));
        results.push(_.extend(null,       {}        ));
        results.push(_.extend(objects[0], objects[1]));

        // ---------------

        test.deepEqual(results[0], {});
        test.deepEqual(results[1], {});
        test.deepEqual(results[2], {});
        test.deepEqual(results[3], {});
        test.deepEqual(results[4], {});
        test.deepEqual(results[5], {});
        test.deepEqual(results[6], {a:{}, b:{}});


        test.done();
    },



    ['debounce']: function(test) {
        test.expect(2); 

        // ---------------

        var func = _.debounce(callback, 100);

        func();
        func();

        // ---------------


        function callback() {
            test.ok(true, 'It should allow to execute the callback function only once every 100ms.');
        }
        
        test.doesNotThrow(function() {
            _.debounce(undefined);
            _.debounce(null);
            _.debounce(callback, undefined);
            _.debounce(callback, null);
        });

        test.done();
    },



    ['stringToBoolean']: function(test) {

        // ---------------

        var resultPositive = _.stringToBoolean('true'),
            resultNegative = _.stringToBoolean('false')   ||
                             _.stringToBoolean('')        ||
                             _.stringToBoolean(null)      ||
                             _.stringToBoolean(undefined);

        // ---------------

        test.ok(resultPositive,  'It should return "true" if the argument is the word "true".');
        test.ok(!resultNegative, 'It should return "false" if the argument is not the word "true".');

        test.done();
    },




    ['callOnce']: function(test) {

        test.expect(2);

        // ---------------

        var func = _.callOnce(callback);

        func();
        func();

        // ---------------

        function callback() {
            test.ok('It should allow to excute the callback function only once.');
        }

        test.doesNotThrow(function() {
            _.callOnce(null);
            _.callOnce(undefined);
        });

        test.done();
    },



    ['firstOfList']: function(test) {
        document.body.innerHTML =
                `<div id='first'></div>
                 <div></div>`;

        var elements = document.querySelectorAll('div'),
            results = [];
 
        // ---------------

        results[0] = _.firstOfList(elements);
        results[1] = _.firstOfList([1,2,3]);

        // ---------------

        test.equal(results[0].id, 'first', 'It should return the first element of the NodeList.');
        test.equal(results[1],    1,       'It should return the first element of the Array.');

        test.doesNotThrow(function() {
            _.firstOfList(null);
            _.firstOfList(undefined);
        });

        test.done();
    },



    ['lastOfList']: function(test) {
        document.body.innerHTML =
                `<div></div>
                 <div id='last'></div>`;

        var elements = document.querySelectorAll('div'),
            results = [];
 
        // ---------------

        results[0] = _.lastOfList(elements);
        results[1] = _.lastOfList([1,2,3]);

        // ---------------

        test.equal(results[0].id, 'last', 'It should return the last element of the NodeList.');
        test.equal(results[1],    3,      'It should return the last element of the Array.');

        test.doesNotThrow(function() {
            _.lastOfList(null);
            _.lastOfList(undefined);
        });

        test.done();
    },



    ['forEach']: function(test) {
        log.warning('Cannot check if the delays are correct.',
                    'The forEach utility with delay should be tested manually.');

        document.body.innerHTML =
                `<div id='first'></div>
                 <div id='second'></div>`;

        var elements = document.querySelectorAll('div'),
            results = [];
 
        // ---------------

        _.forEach(elements, callback);

        // ---------------

        function callback(element, index) {
            results.push([element.id, index]);
        }

        test.deepEqual(results, [['first', 0], ['second', 1]]);

        test.doesNotThrow(function() {
            _.forEach(null);
            _.forEach(undefined);
            _.forEach(elements, null);
            _.forEach(elements, undefined);
        });

        test.done();
    },
};

