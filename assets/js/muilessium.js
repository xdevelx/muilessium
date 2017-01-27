(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * EvEmitter v1.0.3
 * Lil' event emitter
 * MIT License
 */

/* jshint unused: true, undef: true, strict: true */

( function( global, factory ) {
  // universal module definition
  /* jshint strict: false */ /* globals define, module, window */
  if ( typeof define == 'function' && define.amd ) {
    // AMD - RequireJS
    define( factory );
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS - Browserify, Webpack
    module.exports = factory();
  } else {
    // Browser globals
    global.EvEmitter = factory();
  }

}( typeof window != 'undefined' ? window : this, function() {

"use strict";

function EvEmitter() {}

var proto = EvEmitter.prototype;

proto.on = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // set events hash
  var events = this._events = this._events || {};
  // set listeners array
  var listeners = events[ eventName ] = events[ eventName ] || [];
  // only add once
  if ( listeners.indexOf( listener ) == -1 ) {
    listeners.push( listener );
  }

  return this;
};

proto.once = function( eventName, listener ) {
  if ( !eventName || !listener ) {
    return;
  }
  // add event
  this.on( eventName, listener );
  // set once flag
  // set onceEvents hash
  var onceEvents = this._onceEvents = this._onceEvents || {};
  // set onceListeners object
  var onceListeners = onceEvents[ eventName ] = onceEvents[ eventName ] || {};
  // set flag
  onceListeners[ listener ] = true;

  return this;
};

proto.off = function( eventName, listener ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var index = listeners.indexOf( listener );
  if ( index != -1 ) {
    listeners.splice( index, 1 );
  }

  return this;
};

proto.emitEvent = function( eventName, args ) {
  var listeners = this._events && this._events[ eventName ];
  if ( !listeners || !listeners.length ) {
    return;
  }
  var i = 0;
  var listener = listeners[i];
  args = args || [];
  // once stuff
  var onceListeners = this._onceEvents && this._onceEvents[ eventName ];

  while ( listener ) {
    var isOnce = onceListeners && onceListeners[ listener ];
    if ( isOnce ) {
      // remove listener
      // remove before trigger to prevent recursion
      this.off( eventName, listener );
      // unset once flag
      delete onceListeners[ listener ];
    }
    // trigger listener
    listener.apply( this, args );
    // get next listener
    i += isOnce ? 0 : 1;
    listener = listeners[i];
  }

  return this;
};

return EvEmitter;

}));

},{}],2:[function(require,module,exports){
/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined) {
  'use strict';

var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * wrap a method with a deprecation warning and stack trace
 * @param {Function} method
 * @param {String} name
 * @param {String} message
 * @returns {Function} A new function wrapping the supplied method.
 */
function deprecate(method, name, message) {
    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
    return function() {
        var e = new Error('get-stack-trace');
        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
            .replace(/^\s+at\s+/gm, '')
            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

        var log = window.console && (window.console.warn || window.console.log);
        if (log) {
            log.call(window.console, deprecationMessage, stack);
        }
        return method.apply(this, arguments);
    };
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} target
 * @param {...Object} objects_to_assign
 * @returns {Object} target
 */
var assign;
if (typeof Object.assign !== 'function') {
    assign = function assign(target) {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    };
} else {
    assign = Object.assign;
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge=false]
 * @returns {Object} dest
 */
var extend = deprecate(function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}, 'extend', 'Use `assign`.');

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
var merge = deprecate(function merge(dest, src) {
    return extend(dest, src, true);
}, 'merge', 'Use `assign`.');

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        assign(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument || element;
    return (doc.defaultView || doc.parentWindow || window);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
    input.overallVelocityX = overallVelocity.x;
    input.overallVelocityY = overallVelocity.y;
    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = input.deltaX - last.deltaX;
        var deltaY = input.deltaY - last.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down
        if (!this.pressed) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent && !window.PointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */

var DEDUP_TIMEOUT = 2500;
var DEDUP_DISTANCE = 25;

function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);

    this.primaryTouch = null;
    this.lastTouches = [];
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
            return;
        }

        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
        if (isTouch) {
            recordTouches.call(this, inputEvent, inputData);
        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
            return;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

function recordTouches(eventType, eventData) {
    if (eventType & INPUT_START) {
        this.primaryTouch = eventData.changedPointers[0].identifier;
        setLastTouch.call(this, eventData);
    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
        setLastTouch.call(this, eventData);
    }
}

function setLastTouch(eventData) {
    var touch = eventData.changedPointers[0];

    if (touch.identifier === this.primaryTouch) {
        var lastTouch = {x: touch.clientX, y: touch.clientY};
        this.lastTouches.push(lastTouch);
        var lts = this.lastTouches;
        var removeLastTouch = function() {
            var i = lts.indexOf(lastTouch);
            if (i > -1) {
                lts.splice(i, 1);
            }
        };
        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
    }
}

function isSyntheticEvent(eventData) {
    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
    for (var i = 0; i < this.lastTouches.length; i++) {
        var t = this.lastTouches[i];
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
            return true;
        }
    }
    return false;
}

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';
var TOUCH_ACTION_MAP = getTouchActionProps();

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

        if (hasNone) {
            //do not prevent defaults if this is a tap gesture

            var isTapPointer = input.pointers.length === 1;
            var isTapMovement = input.distance < 2;
            var isTapTouchTime = input.deltaTime < 250;

            if (isTapPointer && isTapMovement && isTapTouchTime) {
                return;
            }
        }

        if (hasPanX && hasPanY) {
            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
            return;
        }

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // if both pan-x and pan-y are set (different recognizers
    // for different directions, e.g. horizontal pan but vertical swipe?)
    // we need none (as otherwise with pan-x pan-y combined none of these
    // recognizers will work, since the browser would handle all panning
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_NONE;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

function getTouchActionProps() {
    if (!NATIVE_TOUCH_ACTION) {
        return false;
    }
    var touchMap = {};
    var cssSupports = window.CSS && window.CSS.supports;
    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

        // If css.supports is not supported but there is native touch-action assume it supports
        // all values. This is the case for IE 10 and 11.
        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
    });
    return touchMap;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.options = assign({}, this.defaults, options || {});

    this.id = uniqueId();

    this.manager = null;

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        assign(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(event) {
            self.manager.emit(event, input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }

        emit(self.options.event); // simple 'eventName' events

        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
            emit(input.additionalEvent);
        }

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = assign({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {

        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);

        if (direction) {
            input.additionalEvent = this.options.event + direction;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            input.additionalEvent = this.options.event + inOut;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 251, // minimal time of the pointer to be pressed
        threshold: 9 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.3,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.overallVelocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.overallVelocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.overallVelocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.offsetDirection &&
            input.distance > this.options.threshold &&
            input.maxPointers == this.options.pointers &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.offsetDirection);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 9, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create a manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.7';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, {enable: false}],
        [PinchRecognizer, {enable: false}, ['rotate']],
        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    this.options = assign({}, Hammer.defaults, options || {});

    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];
    this.oldCssProps = {};

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(this.options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        assign(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        recognizer = this.get(recognizer);

        // let's make sure this recognizer exists
        if (recognizer) {
            var recognizers = this.recognizers;
            var index = inArray(recognizers, recognizer);

            if (index !== -1) {
                recognizers.splice(index, 1);
                this.touchAction.update();
            }
        }

        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        if (events === undefined) {
            return;
        }
        if (handler === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        if (events === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    if (!element.style) {
        return;
    }
    var prop;
    each(manager.options.cssProps, function(value, name) {
        prop = prefixed(element.style, name);
        if (add) {
            manager.oldCssProps[prop] = element.style[prop];
            element.style[prop] = value;
        } else {
            element.style[prop] = manager.oldCssProps[prop] || '';
        }
    });
    if (!add) {
        manager.oldCssProps = {};
    }
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

assign(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    assign: assign,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

// this prevents errors when Hammer is loaded in the presence of an AMD
//  style loader but by script tag, not by the loader.
var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
freeGlobal.Hammer = Hammer;

if (typeof define === 'function' && define.amd) {
    define(function() {
        return Hammer;
    });
} else if (typeof module != 'undefined' && module.exports) {
    module.exports = Hammer;
} else {
    window[exportName] = Hammer;
}

})(window, document, 'Hammer');

},{}],3:[function(require,module,exports){
/*!
 * imagesLoaded v4.1.1
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */

( function( window, factory ) { 'use strict';
  // universal module definition

  /*global define: false, module: false, require: false */

  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'ev-emitter/ev-emitter'
    ], function( EvEmitter ) {
      return factory( window, EvEmitter );
    });
  } else if ( typeof module == 'object' && module.exports ) {
    // CommonJS
    module.exports = factory(
      window,
      require('ev-emitter')
    );
  } else {
    // browser global
    window.imagesLoaded = factory(
      window,
      window.EvEmitter
    );
  }

})( window,

// --------------------------  factory -------------------------- //

function factory( window, EvEmitter ) {

'use strict';

var $ = window.jQuery;
var console = window.console;

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

// turn element or nodeList into an array
function makeArray( obj ) {
  var ary = [];
  if ( Array.isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( typeof obj.length == 'number' ) {
    // convert nodeList to array
    for ( var i=0; i < obj.length; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
}

// -------------------------- imagesLoaded -------------------------- //

/**
 * @param {Array, Element, NodeList, String} elem
 * @param {Object or Function} options - if function, use as callback
 * @param {Function} onAlways - callback function
 */
function ImagesLoaded( elem, options, onAlways ) {
  // coerce ImagesLoaded() without new, to be new ImagesLoaded()
  if ( !( this instanceof ImagesLoaded ) ) {
    return new ImagesLoaded( elem, options, onAlways );
  }
  // use elem as selector string
  if ( typeof elem == 'string' ) {
    elem = document.querySelectorAll( elem );
  }

  this.elements = makeArray( elem );
  this.options = extend( {}, this.options );

  if ( typeof options == 'function' ) {
    onAlways = options;
  } else {
    extend( this.options, options );
  }

  if ( onAlways ) {
    this.on( 'always', onAlways );
  }

  this.getImages();

  if ( $ ) {
    // add jQuery Deferred object
    this.jqDeferred = new $.Deferred();
  }

  // HACK check async to allow time to bind listeners
  setTimeout( function() {
    this.check();
  }.bind( this ));
}

ImagesLoaded.prototype = Object.create( EvEmitter.prototype );

ImagesLoaded.prototype.options = {};

ImagesLoaded.prototype.getImages = function() {
  this.images = [];

  // filter & find items if we have an item selector
  this.elements.forEach( this.addElementImages, this );
};

/**
 * @param {Node} element
 */
ImagesLoaded.prototype.addElementImages = function( elem ) {
  // filter siblings
  if ( elem.nodeName == 'IMG' ) {
    this.addImage( elem );
  }
  // get background image on element
  if ( this.options.background === true ) {
    this.addElementBackgroundImages( elem );
  }

  // find children
  // no non-element nodes, #143
  var nodeType = elem.nodeType;
  if ( !nodeType || !elementNodeTypes[ nodeType ] ) {
    return;
  }
  var childImgs = elem.querySelectorAll('img');
  // concat childElems to filterFound array
  for ( var i=0; i < childImgs.length; i++ ) {
    var img = childImgs[i];
    this.addImage( img );
  }

  // get child background images
  if ( typeof this.options.background == 'string' ) {
    var children = elem.querySelectorAll( this.options.background );
    for ( i=0; i < children.length; i++ ) {
      var child = children[i];
      this.addElementBackgroundImages( child );
    }
  }
};

var elementNodeTypes = {
  1: true,
  9: true,
  11: true
};

ImagesLoaded.prototype.addElementBackgroundImages = function( elem ) {
  var style = getComputedStyle( elem );
  if ( !style ) {
    // Firefox returns null if in a hidden iframe https://bugzil.la/548397
    return;
  }
  // get url inside url("...")
  var reURL = /url\((['"])?(.*?)\1\)/gi;
  var matches = reURL.exec( style.backgroundImage );
  while ( matches !== null ) {
    var url = matches && matches[2];
    if ( url ) {
      this.addBackground( url, elem );
    }
    matches = reURL.exec( style.backgroundImage );
  }
};

/**
 * @param {Image} img
 */
ImagesLoaded.prototype.addImage = function( img ) {
  var loadingImage = new LoadingImage( img );
  this.images.push( loadingImage );
};

ImagesLoaded.prototype.addBackground = function( url, elem ) {
  var background = new Background( url, elem );
  this.images.push( background );
};

ImagesLoaded.prototype.check = function() {
  var _this = this;
  this.progressedCount = 0;
  this.hasAnyBroken = false;
  // complete if no images
  if ( !this.images.length ) {
    this.complete();
    return;
  }

  function onProgress( image, elem, message ) {
    // HACK - Chrome triggers event before object properties have changed. #83
    setTimeout( function() {
      _this.progress( image, elem, message );
    });
  }

  this.images.forEach( function( loadingImage ) {
    loadingImage.once( 'progress', onProgress );
    loadingImage.check();
  });
};

ImagesLoaded.prototype.progress = function( image, elem, message ) {
  this.progressedCount++;
  this.hasAnyBroken = this.hasAnyBroken || !image.isLoaded;
  // progress event
  this.emitEvent( 'progress', [ this, image, elem ] );
  if ( this.jqDeferred && this.jqDeferred.notify ) {
    this.jqDeferred.notify( this, image );
  }
  // check if completed
  if ( this.progressedCount == this.images.length ) {
    this.complete();
  }

  if ( this.options.debug && console ) {
    console.log( 'progress: ' + message, image, elem );
  }
};

ImagesLoaded.prototype.complete = function() {
  var eventName = this.hasAnyBroken ? 'fail' : 'done';
  this.isComplete = true;
  this.emitEvent( eventName, [ this ] );
  this.emitEvent( 'always', [ this ] );
  if ( this.jqDeferred ) {
    var jqMethod = this.hasAnyBroken ? 'reject' : 'resolve';
    this.jqDeferred[ jqMethod ]( this );
  }
};

// --------------------------  -------------------------- //

function LoadingImage( img ) {
  this.img = img;
}

LoadingImage.prototype = Object.create( EvEmitter.prototype );

LoadingImage.prototype.check = function() {
  // If complete is true and browser supports natural sizes,
  // try to check for image status manually.
  var isComplete = this.getIsImageComplete();
  if ( isComplete ) {
    // report based on naturalWidth
    this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
    return;
  }

  // If none of the checks above matched, simulate loading on detached element.
  this.proxyImage = new Image();
  this.proxyImage.addEventListener( 'load', this );
  this.proxyImage.addEventListener( 'error', this );
  // bind to image as well for Firefox. #191
  this.img.addEventListener( 'load', this );
  this.img.addEventListener( 'error', this );
  this.proxyImage.src = this.img.src;
};

LoadingImage.prototype.getIsImageComplete = function() {
  return this.img.complete && this.img.naturalWidth !== undefined;
};

LoadingImage.prototype.confirm = function( isLoaded, message ) {
  this.isLoaded = isLoaded;
  this.emitEvent( 'progress', [ this, this.img, message ] );
};

// ----- events ----- //

// trigger specified handler for event type
LoadingImage.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

LoadingImage.prototype.onload = function() {
  this.confirm( true, 'onload' );
  this.unbindEvents();
};

LoadingImage.prototype.onerror = function() {
  this.confirm( false, 'onerror' );
  this.unbindEvents();
};

LoadingImage.prototype.unbindEvents = function() {
  this.proxyImage.removeEventListener( 'load', this );
  this.proxyImage.removeEventListener( 'error', this );
  this.img.removeEventListener( 'load', this );
  this.img.removeEventListener( 'error', this );
};

// -------------------------- Background -------------------------- //

function Background( url, element ) {
  this.url = url;
  this.element = element;
  this.img = new Image();
}

// inherit LoadingImage prototype
Background.prototype = Object.create( LoadingImage.prototype );

Background.prototype.check = function() {
  this.img.addEventListener( 'load', this );
  this.img.addEventListener( 'error', this );
  this.img.src = this.url;
  // check if image is already complete
  var isComplete = this.getIsImageComplete();
  if ( isComplete ) {
    this.confirm( this.img.naturalWidth !== 0, 'naturalWidth' );
    this.unbindEvents();
  }
};

Background.prototype.unbindEvents = function() {
  this.img.removeEventListener( 'load', this );
  this.img.removeEventListener( 'error', this );
};

Background.prototype.confirm = function( isLoaded, message ) {
  this.isLoaded = isLoaded;
  this.emitEvent( 'progress', [ this, this.element, message ] );
};

// -------------------------- jQuery -------------------------- //

ImagesLoaded.makeJQueryPlugin = function( jQuery ) {
  jQuery = jQuery || window.jQuery;
  if ( !jQuery ) {
    return;
  }
  // set local variable
  $ = jQuery;
  // $().imagesLoaded()
  $.fn.imagesLoaded = function( options, callback ) {
    var instance = new ImagesLoaded( this, options, callback );
    return instance.jqDeferred.promise( $(this) );
  };
};
// try making plugin
ImagesLoaded.makeJQueryPlugin();

// --------------------------  -------------------------- //

return ImagesLoaded;

});

},{"ev-emitter":1}],4:[function(require,module,exports){
/*! npm.im/object-fit-images */
'use strict';

var ಠ = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='; // transparent image, used as accessor and replacing image
var propRegex = /(object-fit|object-position)\s*:\s*([-\w\s%]+)/g;
var testImg = new Image();
var supportsObjectFit = 'object-fit' in testImg.style;
var supportsObjectPosition = 'object-position' in testImg.style;
var supportsCurrentSrc = typeof testImg.currentSrc === 'string';
var nativeGetAttribute = testImg.getAttribute;
var nativeSetAttribute = testImg.setAttribute;
var autoModeEnabled = false;

function getStyle(el) {
	var style = getComputedStyle(el).fontFamily;
	var parsed;
	var props = {};
	while ((parsed = propRegex.exec(style)) !== null) {
		props[parsed[1]] = parsed[2];
	}
	return props;
}

function fixOne(el, requestedSrc) {
	if (el[ಠ].parsingSrcset) {
		return;
	}
	var style = getStyle(el);
	style['object-fit'] = style['object-fit'] || 'fill'; // default value

	// If the fix was already applied, don't try to skip fixing,
	// - because once you go ofi you never go back.
	// - Wait, that doesn't rhyme.
	// - This ain't rap, bro.
	if (!el[ಠ].s) {
		// fill is the default behavior so no action is necessary
		if (style['object-fit'] === 'fill') {
			return;
		}

		// Where object-fit is supported and object-position isn't (Safari < 10)
		if (
			!el[ಠ].skipTest && // unless user wants to apply regardless of browser support
			supportsObjectFit && // if browser already supports object-fit
			!style['object-position'] // unless object-position is used
		) {
			return;
		}
	}

	var src = el[ಠ].ios7src || el.currentSrc || el.src;

	if (requestedSrc) {
		// explicitly requested src takes precedence
		// TODO: this still should overwrite srcset
		src = requestedSrc;
	} else if (el.srcset && !supportsCurrentSrc && window.picturefill) {
		var pf = window.picturefill._;
		// prevent infinite loop
		// fillImg sets the src which in turn calls fixOne
		el[ಠ].parsingSrcset = true;

		// parse srcset with picturefill where currentSrc isn't available
		if (!el[pf.ns] || !el[pf.ns].evaled) {
			// force synchronous srcset parsing
			pf.fillImg(el, {reselect: true});
		}

		if (!el[pf.ns].curSrc) {
			// force picturefill to parse srcset
			el[pf.ns].supported = false;
			pf.fillImg(el, {reselect: true});
		}
		delete el[ಠ].parsingSrcset;

		// retrieve parsed currentSrc, if any
		src = el[pf.ns].curSrc || src;
	}

	// store info on object for later use
	if (el[ಠ].s) {
		el[ಠ].s = src;
		if (requestedSrc) {
			// the attribute reflects the user input
			// the property is the resolved URL
			el[ಠ].srcAttr = requestedSrc;
		}
	} else {
		el[ಠ] = {
			s: src,
			srcAttr: requestedSrc || nativeGetAttribute.call(el, 'src'),
			srcsetAttr: el.srcset
		};
		el.src = ಠ;

		try {
			// remove srcset because it overrides src
			if (el.srcset) {
				el.srcset = '';

				// restore non-browser-readable srcset property
				Object.defineProperty(el, 'srcset', {
					value: el[ಠ].srcsetAttr
				});
			}

			keepSrcUsable(el);
		} catch (err) {
			el[ಠ].ios7src = src;
		}
	}

	el.style.backgroundImage = 'url("' + src + '")';
	el.style.backgroundPosition = style['object-position'] || 'center';
	el.style.backgroundRepeat = 'no-repeat';

	if (/scale-down/.test(style['object-fit'])) {
		// `object-fit: scale-down` is either `contain` or `auto`
		if (!el[ಠ].i) {
			el[ಠ].i = new Image();
			el[ಠ].i.src = src;
		}

		// naturalWidth is only available when the image headers are loaded,
		// this loop will poll it every 100ms.
		// There's currently no check to prevent this loop from starting twice
		// as a consequence of calling ofi() twice on the same image, but it's light
		// and causes no issues, so it's not worth ensuring that it doesn't.
		(function loop() {
			// https://bugs.chromium.org/p/chromium/issues/detail?id=495908
			if (el[ಠ].i.naturalWidth) {
				if (el[ಠ].i.naturalWidth > el.width || el[ಠ].i.naturalHeight > el.height) {
					el.style.backgroundSize = 'contain';
				} else {
					el.style.backgroundSize = 'auto';
				}
				return;
			}
			setTimeout(loop, 100);
		})();
	} else {
		el.style.backgroundSize = style['object-fit'].replace('none', 'auto').replace('fill', '100% 100%');
	}
}

function keepSrcUsable(el) {
	var descriptors = {
		get: function get() {
			return el[ಠ].s;
		},
		set: function set(src) {
			delete el[ಠ].i; // scale-down's img sizes need to be updated too
			fixOne(el, src);
			return src;
		}
	};
	Object.defineProperty(el, 'src', descriptors);
	Object.defineProperty(el, 'currentSrc', {get: descriptors.get}); // it should be read-only
}

function hijackAttributes() {
	if (!supportsObjectPosition) {
		HTMLImageElement.prototype.getAttribute = function (name) {
			if (this[ಠ] && (name === 'src' || name === 'srcset')) {
				return this[ಠ][name + 'Attr'];
			}
			return nativeGetAttribute.call(this, name);
		};

		HTMLImageElement.prototype.setAttribute = function (name, value) {
			if (this[ಠ] && (name === 'src' || name === 'srcset')) {
				this[name === 'src' ? 'src' : name + 'Attr'] = String(value);
			} else {
				nativeSetAttribute.call(this, name, value);
			}
		};
	}
}

function fix(imgs, opts) {
	var startAutoMode = !autoModeEnabled && !imgs;
	opts = opts || {};
	imgs = imgs || 'img';
	if (supportsObjectPosition && !opts.skipTest) {
		return false;
	}

	// use imgs as a selector or just select all images
	if (typeof imgs === 'string') {
		imgs = document.querySelectorAll('img');
	} else if (!('length' in imgs)) {
		imgs = [imgs];
	}

	// apply fix to all
	for (var i = 0; i < imgs.length; i++) {
		imgs[i][ಠ] = imgs[i][ಠ] || opts;
		fixOne(imgs[i]);
	}

	if (startAutoMode) {
		document.body.addEventListener('load', function (e) {
			if (e.target.tagName === 'IMG') {
				fix(e.target, {
					skipTest: opts.skipTest
				});
			}
		}, true);
		autoModeEnabled = true;
		imgs = 'img'; // reset to a generic selector for watchMQ
	}

	// if requested, watch media queries for object-fit change
	if (opts.watchMQ) {
		window.addEventListener('resize', fix.bind(null, imgs, {
			skipTest: opts.skipTest
		}));
	}
}

fix.supportsObjectFit = supportsObjectFit;
fix.supportsObjectPosition = supportsObjectPosition;

hijackAttributes();

module.exports = fix;
},{}],5:[function(require,module,exports){
/*
 * smoothscroll polyfill - v0.3.4
 * https://iamdustan.github.io/smoothscroll
 * 2016 (c) Dustan Kasten, Jeremias Menichelli - MIT License
 */

(function(w, d, undefined) {
  'use strict';

  /*
   * aliases
   * w: window global object
   * d: document
   * undefined: undefined
   */

  // polyfill
  function polyfill() {
    // return when scrollBehavior interface is supported
    if ('scrollBehavior' in d.documentElement.style) {
      return;
    }

    /*
     * globals
     */
    var Element = w.HTMLElement || w.Element;
    var SCROLL_TIME = 468;

    /*
     * object gathering original scroll methods
     */
    var original = {
      scroll: w.scroll || w.scrollTo,
      scrollBy: w.scrollBy,
      scrollIntoView: Element.prototype.scrollIntoView
    };

    /*
     * define timing method
     */
    var now = w.performance && w.performance.now
      ? w.performance.now.bind(w.performance) : Date.now;

    /**
     * changes scroll position inside an element
     * @method scrollElement
     * @param {Number} x
     * @param {Number} y
     */
    function scrollElement(x, y) {
      this.scrollLeft = x;
      this.scrollTop = y;
    }

    /**
     * returns result of applying ease math function to a number
     * @method ease
     * @param {Number} k
     * @returns {Number}
     */
    function ease(k) {
      return 0.5 * (1 - Math.cos(Math.PI * k));
    }

    /**
     * indicates if a smooth behavior should be applied
     * @method shouldBailOut
     * @param {Number|Object} x
     * @returns {Boolean}
     */
    function shouldBailOut(x) {
      if (typeof x !== 'object'
            || x === null
            || x.behavior === undefined
            || x.behavior === 'auto'
            || x.behavior === 'instant') {
        // first arg not an object/null
        // or behavior is auto, instant or undefined
        return true;
      }

      if (typeof x === 'object'
            && x.behavior === 'smooth') {
        // first argument is an object and behavior is smooth
        return false;
      }

      // throw error when behavior is not supported
      throw new TypeError('behavior not valid');
    }

    /**
     * finds scrollable parent of an element
     * @method findScrollableParent
     * @param {Node} el
     * @returns {Node} el
     */
    function findScrollableParent(el) {
      var isBody;
      var hasScrollableSpace;
      var hasVisibleOverflow;

      do {
        el = el.parentNode;

        // set condition variables
        isBody = el === d.body;
        hasScrollableSpace =
          el.clientHeight < el.scrollHeight ||
          el.clientWidth < el.scrollWidth;
        hasVisibleOverflow =
          w.getComputedStyle(el, null).overflow === 'visible';
      } while (!isBody && !(hasScrollableSpace && !hasVisibleOverflow));

      isBody = hasScrollableSpace = hasVisibleOverflow = null;

      return el;
    }

    /**
     * self invoked function that, given a context, steps through scrolling
     * @method step
     * @param {Object} context
     */
    function step(context) {
      // call method again on next available frame
      context.frame = w.requestAnimationFrame(step.bind(w, context));

      var time = now();
      var value;
      var currentX;
      var currentY;
      var elapsed = (time - context.startTime) / SCROLL_TIME;

      // avoid elapsed times higher than one
      elapsed = elapsed > 1 ? 1 : elapsed;

      // apply easing to elapsed time
      value = ease(elapsed);

      currentX = context.startX + (context.x - context.startX) * value;
      currentY = context.startY + (context.y - context.startY) * value;

      context.method.call(context.scrollable, currentX, currentY);

      // return when end points have been reached
      if (currentX === context.x && currentY === context.y) {
        w.cancelAnimationFrame(context.frame);
        return;
      }
    }

    /**
     * scrolls window with a smooth behavior
     * @method smoothScroll
     * @param {Object|Node} el
     * @param {Number} x
     * @param {Number} y
     */
    function smoothScroll(el, x, y) {
      var scrollable;
      var startX;
      var startY;
      var method;
      var startTime = now();
      var frame;

      // define scroll context
      if (el === d.body) {
        scrollable = w;
        startX = w.scrollX || w.pageXOffset;
        startY = w.scrollY || w.pageYOffset;
        method = original.scroll;
      } else {
        scrollable = el;
        startX = el.scrollLeft;
        startY = el.scrollTop;
        method = scrollElement;
      }

      // cancel frame when a scroll event's happening
      if (frame) {
        w.cancelAnimationFrame(frame);
      }

      // scroll looping over a frame
      step({
        scrollable: scrollable,
        method: method,
        startTime: startTime,
        startX: startX,
        startY: startY,
        x: x,
        y: y,
        frame: frame
      });
    }

    /*
     * ORIGINAL METHODS OVERRIDES
     */

    // w.scroll and w.scrollTo
    w.scroll = w.scrollTo = function() {
      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0])) {
        original.scroll.call(
          w,
          arguments[0].left || arguments[0],
          arguments[0].top || arguments[1]
        );
        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        ~~arguments[0].left,
        ~~arguments[0].top
      );
    };

    // w.scrollBy
    w.scrollBy = function() {
      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0])) {
        original.scrollBy.call(
          w,
          arguments[0].left || arguments[0],
          arguments[0].top || arguments[1]
        );
        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        ~~arguments[0].left + (w.scrollX || w.pageXOffset),
        ~~arguments[0].top + (w.scrollY || w.pageYOffset)
      );
    };

    // Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = function() {
      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0])) {
        original.scrollIntoView.call(this, arguments[0] || true);
        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      var scrollableParent = findScrollableParent(this);
      var parentRects = scrollableParent.getBoundingClientRect();
      var clientRects = this.getBoundingClientRect();

      if (scrollableParent !== d.body) {
        // reveal element inside parent
        smoothScroll.call(
          this,
          scrollableParent,
          scrollableParent.scrollLeft + clientRects.left - parentRects.left,
          scrollableParent.scrollTop + clientRects.top - parentRects.top
        );
        // reveal parent in viewport
        w.scrollBy({
          left: parentRects.left,
          top: parentRects.top,
          behavior: 'smooth'
        });
      } else {
        // reveal element in viewport
        w.scrollBy({
          left: clientRects.left,
          top: clientRects.top,
          behavior: 'smooth'
        });
      }
    };
  }

  if (typeof exports === 'object') {
    // commonjs
    module.exports = { polyfill: polyfill };
  } else {
    // global
    polyfill();
  }
})(window, document);

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Component = undefined;

var _utils = require('./utils');

var Utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = exports.Component = function Component(element, options) {
    _classCallCheck(this, Component);

    this.element = element;

    this.dom = {};
    this.state = {};
};

},{"./utils":32}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Accordion = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

var _component = require('../component');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Accordion = exports.Accordion = function (_Component) {
    _inherits(Accordion, _Component);

    function Accordion(element, options) {
        _classCallCheck(this, Accordion);

        var _this = _possibleConstructorReturn(this, (Accordion.__proto__ || Object.getPrototypeOf(Accordion)).call(this, element, options));

        _this.dom = Utils.extend(_this.dom, {
            items: element.getElementsByClassName('item'),
            titles: element.getElementsByClassName('title'),
            indicators: element.getElementsByClassName('indicator'),
            contents: element.getElementsByClassName('content')
        });

        _this.initAria();
        _this.initControls();
        return _this;
    }

    _createClass(Accordion, [{
        key: 'initAria',
        value: function initAria() {
            var _this2 = this;

            Utils.aria.setRole(this.element, 'tablist');
            Utils.setAttribute(this.element, 'multiselectable', true);

            [].forEach.call(this.dom.titles, function (title, index) {
                Utils.aria.setRole(title, 'tab');
                Utils.aria.set(title, 'expanded', false);
                Utils.aria.set(title, 'controls', Utils.aria.setId(_this2.dom.contents[index]));
            });

            [].forEach.call(this.dom.contents, function (content, index) {
                Utils.aria.setRole(content, 'tabpanel');
                Utils.aria.set(content, 'hidden', true);
                Utils.aria.set(content, 'labelledby', Utils.aria.setId(_this2.dom.titles[index]));
            });

            [].forEach.call(this.dom.indicators, function (indicator) {
                Utils.aria.set(indicator, 'hidden', true);
            });

            return this;
        }
    }, {
        key: 'initControls',
        value: function initControls() {
            var _this3 = this;

            Utils.makeChildElementsClickable(this.element, this.dom.titles, function (index) {
                _this3.toggleItem(index);
            });

            return this;
        }
    }, {
        key: 'foldItem',
        value: function foldItem(index) {
            Utils.removeClass(this.dom.items[index], '-unfold');

            Utils.aria.set(this.dom.titles[index], 'expanded', false);
            Utils.aria.set(this.dom.contents[index], 'hidden', true);

            return this;
        }
    }, {
        key: 'foldAllItems',
        value: function foldAllItems() {
            var _this4 = this;

            [].forEach.call(this.dom.items, function (item, index) {
                _this4.foldItem(index);
            });

            return this;
        }
    }, {
        key: 'unfoldItem',
        value: function unfoldItem(index) {
            Utils.addClass(this.dom.items[index], '-unfold');

            Utils.aria.set(this.dom.titles[index], 'expanded', true);
            Utils.aria.set(this.dom.contents[index], 'hidden', false);

            return this;
        }
    }, {
        key: 'unfoldAllItems',
        value: function unfoldAllItems() {
            var _this5 = this;

            [].forEach.call(this.dom.items, function (item, index) {
                _this5.unfoldItem(index);
            });

            return this;
        }
    }, {
        key: 'toggleItem',
        value: function toggleItem(index) {
            Utils.toggleClass(this.dom.items[index], '-unfold');

            Utils.aria.toggleState(this.dom.titles[index], 'expanded');
            Utils.aria.toggleState(this.dom.contents[index], 'hidden');

            return this;
        }
    }]);

    return Accordion;
}(_component.Component);

;

},{"../component":6,"../utils":32}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Breadcrumb = undefined;

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

var _component = require('../component');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Breadcrumb = exports.Breadcrumb = function (_Component) {
    _inherits(Breadcrumb, _Component);

    function Breadcrumb(element, options) {
        _classCallCheck(this, Breadcrumb);

        var _this = _possibleConstructorReturn(this, (Breadcrumb.__proto__ || Object.getPrototypeOf(Breadcrumb)).call(this, element, options));

        Utils.aria.setRole(_this.element, 'navigation');
        return _this;
    }

    return Breadcrumb;
}(_component.Component);

;

},{"../component":6,"../utils":32}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ButtonDropdown = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _keyboard = require('../controls/keyboard');

var Keyboard = _interopRequireWildcard(_keyboard);

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

var _component = require('../component');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ButtonDropdown = exports.ButtonDropdown = function (_Component) {
    _inherits(ButtonDropdown, _Component);

    function ButtonDropdown(element, options) {
        _classCallCheck(this, ButtonDropdown);

        var _this = _possibleConstructorReturn(this, (ButtonDropdown.__proto__ || Object.getPrototypeOf(ButtonDropdown)).call(this, element, options));

        _this.dom = Utils.extend(_this.dom, {
            button: element.getElementsByClassName('mui-button')[0],
            dropdown: element.getElementsByClassName('mui-dropdown-options')[0],
            optionsList: element.getElementsByClassName('option'),
            shadow: element.getElementsByClassName('mui-shadow-toggle')[0]
        });

        _this.state = Utils.extend(_this.state, {
            opened: false
        });

        _this.initAria();
        _this.initControls();
        return _this;
    }

    _createClass(ButtonDropdown, [{
        key: 'initAria',
        value: function initAria() {
            Utils.aria.removeRole(this.element); // Remove role='button' added in base component
            Utils.aria.set(this.dom.button, 'haspopup', true);
            Utils.aria.set(this.dom.dropdown, 'labelledby', Utils.aria.setId(this.dom.button));
            Utils.aria.set(this.dom.dropdown, 'hidden', true);
            Utils.aria.set(this.dom.shadow, 'hidden', true);

            return this;
        }
    }, {
        key: 'initControls',
        value: function initControls() {
            var _this2 = this;

            Utils.makeElementClickable(this.dom.button, this.toggleDropdown.bind(this));
            Utils.makeElementClickable(this.dom.shadow, this.toggleDropdown.bind(this), true);

            Keyboard.onShiftTabPressed(Utils.firstOfList(this.dom.optionsList), function () {
                _this2.closeDropdown();
                _this2.dom.button.focus();
            });

            Keyboard.onTabPressed(Utils.lastOfList(this.dom.optionsList), function () {
                _this2.closeDropdown();

                Utils.goToNextFocusableElement(Utils.lastOfList(Utils.getFocusableChilds(_this2.element)));
            });

            return this;
        }
    }, {
        key: 'openDropdown',
        value: function openDropdown() {
            Utils.addClass(this.element, '-opened');
            Utils.addClass(this.dom.shadow, '-visible');

            Utils.aria.set(this.dom.button, 'hidden', true);
            Utils.aria.set(this.dom.dropdown, 'hidden', false);

            this.dom.dropdown.getElementsByTagName('a')[0].focus();

            this.state.opened = true;

            return this;
        }
    }, {
        key: 'closeDropdown',
        value: function closeDropdown() {
            Utils.removeClass(this.element, '-opened');
            Utils.removeClass(this.dom.shadow, '-visible');

            Utils.aria.set(this.dom.button, 'hidden', false);
            Utils.aria.set(this.dom.dropdown, 'hidden', true);

            this.dom.button.focus();

            this.state.opened = false;

            return this;
        }
    }, {
        key: 'toggleDropdown',
        value: function toggleDropdown() {
            if (this.state.opened) {
                this.closeDropdown();
            } else {
                this.openDropdown();
            }

            return this;
        }
    }]);

    return ButtonDropdown;
}(_component.Component);

;

},{"../component":6,"../controls/keyboard":25,"../utils":32}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Button = undefined;

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

var _component = require('../component');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Button = exports.Button = function (_Component) {
    _inherits(Button, _Component);

    function Button(element, options) {
        _classCallCheck(this, Button);

        var _this = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, element, options));

        if (!Utils.aria.getRole(_this.element)) {
            // Sometimes it is useful to add role=link to the button, we should not override it here
            Utils.aria.setRole(_this.element, 'button');
        }
        return _this;
    }

    return Button;
}(_component.Component);

;

},{"../component":6,"../utils":32}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Carousel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mouse = require('../controls/mouse');

var Mouse = _interopRequireWildcard(_mouse);

var _touchscreen = require('../controls/touchscreen');

var TouchScreen = _interopRequireWildcard(_touchscreen);

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

var _component = require('../component');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Carousel = exports.Carousel = function (_Component) {
    _inherits(Carousel, _Component);

    function Carousel(element, options) {
        _classCallCheck(this, Carousel);

        var _this = _possibleConstructorReturn(this, (Carousel.__proto__ || Object.getPrototypeOf(Carousel)).call(this, element, options));

        _this.dom = Utils.extend(_this.dom, {
            slides: element.getElementsByClassName('mui-slide'),
            controls: {
                prev: element.getElementsByClassName('prev'),
                next: element.getElementsByClassName('next')
            },
            indicators: element.getElementsByClassName('indicator')
        });

        _this.state = Utils.extend(_this.state, {
            numberOfSlides: _this.dom.slides.length,
            currentSlide: 0,
            interval: parseFloat(_this.element.getAttribute('data-interval'), 10) || 5
        });

        _this.initAria();
        _this.initControls();
        _this.makeSlideActive(0);
        _this.startRotating();
        return _this;
    }

    _createClass(Carousel, [{
        key: 'initAria',
        value: function initAria() {
            return this;
        }
    }, {
        key: 'initControls',
        value: function initControls() {
            var _this2 = this;

            Mouse.onMouseOver(this.element, this.stopRotating.bind(this));
            Mouse.onMouseOut(this.element, this.startRotating.bind(this));

            Utils.makeChildElementsClickable(this.element, this.dom.controls.prev, this.rotate.bind(this, 'prev'));
            Utils.makeChildElementsClickable(this.element, this.dom.controls.next, this.rotate.bind(this, 'next'));

            Utils.makeChildElementsClickable(this.element, this.dom.indicators, function (index) {
                _this2.rotate(index);
            });

            TouchScreen.onSwipeRight(this.element, this.rotate.bind(this, 'prev'));
            TouchScreen.onSwipeLeft(this.element, this.rotate.bind(this, 'next'));

            return this;
        }
    }, {
        key: 'startRotating',
        value: function startRotating() {
            this.state.rotateInterval = setInterval(this.rotate.bind(this, 'next'), this.state.interval * 1000);

            return this;
        }
    }, {
        key: 'stopRotating',
        value: function stopRotating() {
            clearInterval(this.state.rotateInterval);

            return this;
        }
    }, {
        key: 'makeSlideActive',
        value: function makeSlideActive(index) {
            Utils.addClass(this.dom.slides[index], '-active');
            Utils.addClass(this.dom.indicators[index], '-active');

            return this;
        }
    }, {
        key: 'makeSlideInactive',
        value: function makeSlideInactive(index) {
            Utils.removeClass(this.dom.slides[index], '-active');
            Utils.removeClass(this.dom.indicators[index], '-active');

            return this;
        }
    }, {
        key: 'rotate',
        value: function rotate(param) {
            var currentSlide = this.state.currentSlide,
                nextSlide = 0;

            if (typeof param === 'string') {
                switch (param) {
                    case 'next':
                        nextSlide = (currentSlide + 1) % this.state.numberOfSlides;
                        break;
                    case 'prev':
                        nextSlide = (currentSlide - 1 + this.state.numberOfSlides) % this.state.numberOfSlides;
                        break;
                    default:
                        Utils.console.error('wrong carousel rotate param');
                        return;
                }
            } else if (typeof param === 'number' && param >= 0 && param < this.state.numberOfSlides) {
                nextSlide = param;
            } else {
                Utils.console.error('wrong carusel rotate param');
                return;
            }

            this.makeSlideInactive(currentSlide);
            this.makeSlideActive(nextSlide);

            this.state.currentSlide = nextSlide;

            return this;
        }
    }]);

    return Carousel;
}(_component.Component);

;

},{"../component":6,"../controls/mouse":26,"../controls/touchscreen":27,"../utils":32}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Checkbox = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

var _component = require('../component');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Checkbox = exports.Checkbox = function (_Component) {
    _inherits(Checkbox, _Component);

    function Checkbox(element, options) {
        _classCallCheck(this, Checkbox);

        var _this = _possibleConstructorReturn(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).call(this, element, options));

        _this.dom = Utils.extend(_this.dom, {
            input: element.getElementsByTagName('input')[0],
            label: element.getElementsByTagName('label')[0]
        });

        _this.initAria();
        _this.initControls();
        return _this;
    }

    _createClass(Checkbox, [{
        key: 'initAria',
        value: function initAria() {
            Utils.aria.setRole(this.dom.label, 'checkbox');

            var inputId = this.dom.input.getAttribute('id') || Utils.aria.setId(this.dom.input);

            this.dom.input.checked = false;

            Utils.setAttribute(this.dom.label, 'for', inputId);
            Utils.aria.set(this.dom.label, 'controls', inputId);
            Utils.aria.set(this.dom.label, 'checked', false);
            Utils.aria.set(this.dom.input, 'labelledby', Utils.aria.setId(this.dom.label));

            return this;
        }
    }, {
        key: 'initControls',
        value: function initControls() {
            Utils.makeElementClickable(this.dom.label, this.toggleCheckbox.bind(this));

            return this;
        }
    }, {
        key: 'setCheckbox',
        value: function setCheckbox() {
            this.dom.input.checked = true;

            Utils.addClass(this.element, '-checked');
            Utils.aria.set(this.dom.label, 'checked', true);

            return this;
        }
    }, {
        key: 'unsetCheckbox',
        value: function unsetCheckbox() {
            this.dom.input.checked = false;

            Utils.removeClass(this.element, '-checked');
            Utils.aria.set(this.dom.label, 'checked', false);

            return this;
        }
    }, {
        key: 'toggleCheckbox',
        value: function toggleCheckbox() {
            if (this.dom.input.checked) {
                this.unsetCheckbox();
            } else {
                this.setCheckbox();
            }

            return this;
        }
    }]);

    return Checkbox;
}(_component.Component);

;

},{"../component":6,"../utils":32}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HeaderNavigation = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _touchscreen = require('../controls/touchscreen');

var TouchScreen = _interopRequireWildcard(_touchscreen);

var _keyboard = require('../controls/keyboard');

var Keyboard = _interopRequireWildcard(_keyboard);

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

var _component = require('../component');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HeaderNavigation = exports.HeaderNavigation = function (_Component) {
    _inherits(HeaderNavigation, _Component);

    function HeaderNavigation(element, options) {
        _classCallCheck(this, HeaderNavigation);

        var _this = _possibleConstructorReturn(this, (HeaderNavigation.__proto__ || Object.getPrototypeOf(HeaderNavigation)).call(this, element, options));

        _this.dom = Utils.extend(_this.dom, {
            hamburger: element.getElementsByClassName('mui-navigation-toggle')[0],
            shadow: element.getElementsByClassName('mui-shadow-toggle')[0],
            links: element.getElementsByClassName('links-list')[0],
            linksList: element.getElementsByTagName('a')
        });

        _this.state = Utils.extend(_this.state, {
            opened: false,
            mobile: false
        });

        _this.initAria();
        _this.initControls();
        _this.update();

        window.Muilessium.Events.addEventListener('resizeWindowWidth', Utils.debounce(_this.update.bind(_this), 100));

        _this.state.initialized = true;
        return _this;
    }

    _createClass(HeaderNavigation, [{
        key: 'initAria',
        value: function initAria() {
            Utils.aria.setRole(this.dom.hamburger, 'button');

            Utils.aria.set(this.dom.shadow, 'hidden', true);
            Utils.aria.set(this.dom.hamburger, 'haspopup', true);

            Utils.aria.set(this.dom.links, 'labelledby', Utils.aria.setId(this.dom.hamburger));

            return this;
        }
    }, {
        key: 'initControls',
        value: function initControls() {
            var _this2 = this;

            Utils.makeElementClickable(this.dom.hamburger, this.toggleNavigation.bind(this));
            Utils.makeElementClickable(this.dom.shadow, this.toggleNavigation.bind(this), true);

            Utils.makeChildElementsClickable(this.element, this.dom.linksList, function (index) {
                var href = _this2.dom.linksList[index].getAttribute('href');

                if (href[0] === '#') {
                    _this2.closeNavigation();
                } else {
                    window.location = href;
                }
            });

            TouchScreen.onSwipeRight(this.element, function () {
                if (_this2.state.mobile) {
                    _this2.closeNavigation();
                }
            });

            Keyboard.onShiftTabPressed(Utils.firstOfList(this.dom.linksList), function () {
                _this2.closeNavigation();

                Utils.goToPreviousFocusableElement(Utils.firstOfList(Utils.getFocusableChilds(_this2.element)));
            });

            Keyboard.onTabPressed(Utils.lastOfList(this.dom.linksList), function () {
                _this2.closeNavigation();

                Utils.goToNextFocusableElement(Utils.lastOfList(Utils.getFocusableChilds(_this2.element)));
            });

            return this;
        }
    }, {
        key: 'openNavigation',
        value: function openNavigation() {
            if (!this.state.opened) {
                this.state.opened = true;
                this.dom.shadow.tabIndex = 0;

                Utils.addClass(this.element, '-opened');
                Utils.addClass(this.dom.shadow, '-visible');

                Utils.aria.set(this.dom.hamburger, 'hidden', true);
                Utils.aria.set(this.dom.links, 'hidden', false);

                Utils.getFocusableChilds(this.dom.links)[0].focus();
            }

            return this;
        }
    }, {
        key: 'closeNavigation',
        value: function closeNavigation() {
            if (this.state.opened) {
                this.state.opened = false;
                this.dom.shadow.tabIndex = -1;

                Utils.removeClass(this.element, '-opened');
                Utils.removeClass(this.dom.shadow, '-visible');

                Utils.aria.set(this.dom.hamburger, 'hidden', false);
                Utils.aria.set(this.dom.links, 'hidden', true);

                this.dom.hamburger.focus();
            }

            return this;
        }
    }, {
        key: 'toggleNavigation',
        value: function toggleNavigation() {
            if (this.state.opened) {
                this.closeNavigation();
            } else {
                this.openNavigation();
            }

            return this;
        }
    }, {
        key: 'transformToMobile',
        value: function transformToMobile() {
            if (!this.state.mobile || !this.state.initialized) {
                this.closeNavigation();

                Utils.aria.set(this.dom.hamburger, 'hidden', false);
                Utils.aria.set(this.dom.links, 'hidden', true);

                Utils.addClass(this.element, '-mobile-version');
                Utils.removeClass(this.element, '-desktop-version');

                this.state.mobile = true;
            }

            return this;
        }
    }, {
        key: 'transformToDesktop',
        value: function transformToDesktop() {
            if (this.state.mobile || !this.state.initialized) {
                this.closeNavigation();

                Utils.aria.set(this.dom.hamburger, 'hidden', true);
                Utils.aria.set(this.dom.shadow, 'hidden', true);
                Utils.aria.set(this.dom.links, 'hidden', false);

                Utils.addClass(this.element, '-desktop-version');
                Utils.removeClass(this.element, '-mobile-version');

                this.state.mobile = false;
            }

            return this;
        }
    }, {
        key: 'update',
        value: function update() {
            if (window.innerWidth < 600) {
                this.transformToMobile();
                return this;
            } else if (window.innerWidth > 1200) {
                this.transformToDesktop();
                return this;
            }

            var parentNode = this.element.parentNode,
                parentWidth = parentNode.clientWidth,
                childsWidth = 0;

            [].forEach.call(parentNode.childNodes, function (child) {
                var width = child.offsetWidth;

                if (width) {
                    childsWidth += child.offsetWidth;
                }
            });

            if (childsWidth > parentWidth - 200) {
                this.transformToMobile();
            } else {
                this.transformToDesktop();
            }

            return this;
        }
    }]);

    return HeaderNavigation;
}(_component.Component);

;

},{"../component":6,"../controls/keyboard":25,"../controls/touchscreen":27,"../utils":32}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InputRange = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

var _input = require('./input');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InputRange = exports.InputRange = function (_Input) {
    _inherits(InputRange, _Input);

    function InputRange(element, options) {
        _classCallCheck(this, InputRange);

        var _this = _possibleConstructorReturn(this, (InputRange.__proto__ || Object.getPrototypeOf(InputRange)).call(this, element, options));

        _this.initAria();
        _this.initControls();
        return _this;
    }

    _createClass(InputRange, [{
        key: 'changeValueHandler',
        value: function changeValueHandler() {
            return this;
        }
    }]);

    return InputRange;
}(_input.Input);

;

},{"../utils":32,"./input":15}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Input = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

var _component = require('../component');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Input = exports.Input = function (_Component) {
    _inherits(Input, _Component);

    function Input(element, options) {
        _classCallCheck(this, Input);

        var _this = _possibleConstructorReturn(this, (Input.__proto__ || Object.getPrototypeOf(Input)).call(this, element, options));

        _this.dom = Utils.extend(_this.dom, {
            input: element.getElementsByTagName('input')[0],
            labels: element.parentNode.getElementsByTagName('label'),
            hint: element.parentNode.getElementsByClassName('mui-input-hint')[0],
            indicator: element.parentNode.getElementsByClassName('mui-input-indicator')[0]
        });

        _this.state = Utils.extend(_this.state, {
            regexp: new RegExp(element.getAttribute('data-regexp') || ''),
            validationDelay: element.getAttribute('data-validation-delay') || 300,
            validationTimeout: null
        });

        _this.initAria();
        _this.initControls();
        return _this;
    }

    _createClass(Input, [{
        key: 'initAria',
        value: function initAria() {
            var _this2 = this;

            var inputId = this.dom.input.getAttribute('id') || Utils.aria.setId(this.dom.input);

            Utils.ifNodeList(this.dom.labels, function () {
                Utils.aria.set(_this2.dom.input, 'labelledby', Utils.aria.setId(_this2.dom.labels[0]));

                [].forEach.call(_this2.dom.labels, function (label) {
                    Utils.setAttribute(label, 'for', inputId);
                });
            });

            return this;
        }
    }, {
        key: 'initControls',
        value: function initControls() {
            var _this3 = this;

            Utils.ifNodeList(this.dom.labels, function () {
                [].forEach.call(_this3.dom.labels, function (label) {
                    label.addEventListener('focus', function () {
                        _this3.dom.input.focus();
                    });
                });
            });

            this.dom.input.addEventListener('focus', this.focusHandler.bind(this));
            this.dom.input.addEventListener('blur', this.blurHandler.bind(this));

            this.dom.input.addEventListener('change', this.changeValueHandler.bind(this));
            this.dom.input.addEventListener('keydown', this.changeValueHandler.bind(this));

            return this;
        }
    }, {
        key: 'focusHandler',
        value: function focusHandler() {
            var _this4 = this;

            Utils.addClass(this.element, '-focused');

            Utils.ifNodeList(this.dom.labels, function () {
                Utils.makeElementsNotFocusable(_this4.dom.labels);
            });

            return this;
        }
    }, {
        key: 'blurHandler',
        value: function blurHandler() {
            var _this5 = this;

            Utils.removeClass(this.element, '-focused');

            Utils.ifNodeList(this.dom.labels, function () {
                Utils.makeElementsFocusable(_this5.dom.labels);
            });

            return this;
        }
    }, {
        key: 'changeValueHandler',
        value: function changeValueHandler() {
            if (this.dom.input.value == '') {
                Utils.removeClass(this.element, '-has-value');

                Utils.removeClass(this.element, '-valid');
                Utils.removeClass(this.element, '-invalid');

                Utils.removeClass(this.dom.hint, '-valid');
                Utils.removeClass(this.dom.hint, '-invalid');

                Utils.removeClass(this.dom.indicator, '-valid');
                Utils.removeClass(this.dom.indicator, '-invalid');
            } else {
                Utils.addClass(this.element, '-has-value');

                var validationTimeout = this.state.validationTimeout;

                if (validationTimeout) {
                    clearTimeout(validationTimeout);
                }

                validationTimeout = setTimeout(this.validate.bind(this), this.state.validationDelay);
            }

            return this;
        }
    }, {
        key: 'validate',
        value: function validate() {
            if (this.state.regexp.test(this.dom.input.value)) {
                Utils.removeClass(this.element, '-invalid');
                Utils.addClass(this.element, '-valid');

                Utils.removeClass(this.dom.hint, '-invalid');
                Utils.addClass(this.dom.hint, '-valid');

                Utils.removeClass(this.dom.indicator, '-invalid');
                Utils.addClass(this.dom.indicator, '-valid');
            } else {
                Utils.removeClass(this.element, '-valid');
                Utils.addClass(this.element, '-invalid');

                Utils.removeClass(this.dom.hint, '-valid');
                Utils.addClass(this.dom.hint, '-invalid');

                Utils.removeClass(this.dom.indicator, '-valid');
                Utils.addClass(this.dom.indicator, '-invalid');
            }

            this.state.validationTimeout = null;

            return this;
        }
    }]);

    return Input;
}(_component.Component);

;

},{"../component":6,"../utils":32}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MediaView = undefined;

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

var _component = require('../component');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MediaView = exports.MediaView = function (_Component) {
    _inherits(MediaView, _Component);

    function MediaView(element, options) {
        _classCallCheck(this, MediaView);

        var _this = _possibleConstructorReturn(this, (MediaView.__proto__ || Object.getPrototypeOf(MediaView)).call(this, element, options));

        _this.dom = Utils.extend(_this.dom, {
            media: _this.element.getElementsByClassName('media')[0],
            description: _this.element.getElementsByClassName('description')[0]
        });

        Utils.aria.set(_this.dom.media, 'describedby', Utils.aria.setId(_this.dom.description));
        return _this;
    }

    return MediaView;
}(_component.Component);

;

},{"../component":6,"../utils":32}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ModalWindow = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _touchscreen = require('../controls/touchscreen');

var TouchScreen = _interopRequireWildcard(_touchscreen);

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

var _component = require('../component');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ModalWindow = exports.ModalWindow = function (_Component) {
    _inherits(ModalWindow, _Component);

    function ModalWindow(element, options) {
        _classCallCheck(this, ModalWindow);

        var _this = _possibleConstructorReturn(this, (ModalWindow.__proto__ || Object.getPrototypeOf(ModalWindow)).call(this, element, options));

        _this.dom = Utils.extend(_this.dom, {
            openers: document.querySelectorAll('[data-modal-opener=' + _this.element.getAttribute('id') + ']'),
            modalWindow: _this.element.getElementsByClassName('window')[0],
            closeIcon: _this.element.getElementsByClassName('close-icon')[0],
            shadow: _this.element.getElementsByClassName('mui-shadow-toggle')[0]
        });

        _this.state = Utils.extend(_this.state, {
            visible: false
        });

        _this.initAria();
        _this.initControls();
        return _this;
    }

    _createClass(ModalWindow, [{
        key: 'initAria',
        value: function initAria() {
            Utils.aria.set(this.element, 'hidden', true);
            Utils.aria.set(this.dom.shadow, 'hidden', true);

            return this;
        }
    }, {
        key: 'initControls',
        value: function initControls() {
            var _this2 = this;

            [].forEach.call(this.dom.openers, function (opener) {
                Utils.makeElementClickable(opener, _this2.openModal.bind(_this2));
            });

            Utils.makeElementClickable(this.dom.closeIcon, this.closeModal.bind(this));
            Utils.makeElementClickable(this.dom.shadow, this.closeModal.bind(this));

            TouchScreen.onPinchOut(this.dom.modalWindow, this.closeModal.bind(this));

            return this;
        }
    }, {
        key: 'openModal',
        value: function openModal() {
            if (!this.state.visible) {
                Utils.addClass(this.element, '-visible');
                Utils.addClass(this.dom.shadow, '-visible');

                Utils.aria.set(this.element, 'hidden', false);

                this.state.visible = true;
            }

            return this;
        }
    }, {
        key: 'closeModal',
        value: function closeModal() {
            if (this.state.visible) {
                Utils.removeClass(this.element, '-visible');
                Utils.removeClass(this.dom.shadow, '-visible');

                Utils.aria.set(this.element, 'hidden', true);

                this.state.visible = false;
            }

            return this;
        }
    }]);

    return ModalWindow;
}(_component.Component);

;

},{"../component":6,"../controls/touchscreen":27,"../utils":32}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Pagination = undefined;

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

var _component = require('../component');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pagination = exports.Pagination = function (_Component) {
    _inherits(Pagination, _Component);

    function Pagination(element, options) {
        _classCallCheck(this, Pagination);

        var _this = _possibleConstructorReturn(this, (Pagination.__proto__ || Object.getPrototypeOf(Pagination)).call(this, element, options));

        Utils.aria.setRole(_this.element, 'navigation');
        return _this;
    }

    return Pagination;
}(_component.Component);

;

},{"../component":6,"../utils":32}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Radio = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

var _component = require('../component');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Radio = exports.Radio = function (_Component) {
    _inherits(Radio, _Component);

    function Radio(element, options) {
        _classCallCheck(this, Radio);

        var _this = _possibleConstructorReturn(this, (Radio.__proto__ || Object.getPrototypeOf(Radio)).call(this, element, options));

        _this.dom = Utils.extend(_this.dom, {
            inputs: element.getElementsByTagName('input'),
            labels: element.getElementsByTagName('label'),
            inputLabel: element.parentNode.getElementsByClassName('mui-input-label')[0],
            icons: element.getElementsByClassName('icon')
        });

        _this.state = Utils.extend(_this.state, {
            checkedIndex: -1
        });

        _this.initAria();
        _this.initControls();
        _this.updateState();
        return _this;
    }

    _createClass(Radio, [{
        key: 'initAria',
        value: function initAria() {
            var _this2 = this;

            Utils.aria.setRole(this.element, 'radiogroup');

            Utils.ifExists(this.dom.inputLabel, function () {
                Utils.aria.set(_this2.element, 'labelledby', Utils.aria.setId(_this2.dom.inputLabel));
                Utils.setAttribute(_this2.dom.inputLabel, 'for', Utils.aria.setId(_this2.element));
            });

            [].forEach.call(this.dom.inputs, function (input, index) {
                Utils.aria.set(input, 'hidden', true);
                Utils.setAttribute(input, 'type', 'radio');
                Utils.setAttribute(input, 'name', _this2.element.getAttribute('data-name'));

                if (input.checked) {
                    _this2.state.checkedIndex = index;
                }
            });

            [].forEach.call(this.dom.labels, function (label, index) {
                Utils.setAttribute(label, 'for', _this2.dom.inputs[index].getAttribute('id'));
                Utils.aria.setRole(label, 'radio');
            });

            return this;
        }
    }, {
        key: 'initControls',
        value: function initControls() {
            var _this3 = this;

            Utils.makeChildElementsClickable(this.element, this.dom.labels, function (index) {
                _this3.updateState(index);
            });

            return this;
        }
    }, {
        key: 'updateState',
        value: function updateState(index) {
            if (typeof index !== 'number' || index < 0) {
                return this;
            }

            this.dom.inputs[index].checked = true;

            if (this.state.checkedIndex >= 0) {
                Utils.aria.set(this.dom.labels[this.state.checkedIndex], 'checked', false);
            }

            Utils.aria.set(this.dom.labels[index], 'checked', true);

            this.state.checkedIndex = index;

            return this;
        }
    }]);

    return Radio;
}(_component.Component);

;

},{"../component":6,"../utils":32}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Rating = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _keyboard = require('../controls/keyboard');

var Keyboard = _interopRequireWildcard(_keyboard);

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

var _component = require('../component');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rating = exports.Rating = function (_Component) {
    _inherits(Rating, _Component);

    function Rating(element, options) {
        _classCallCheck(this, Rating);

        var _this = _possibleConstructorReturn(this, (Rating.__proto__ || Object.getPrototypeOf(Rating)).call(this, element, options));

        _this.dom = Utils.extend(_this.dom, {
            stars: element.getElementsByClassName('star')
        });

        _this.state = Utils.extend(_this.state, {
            rating: element.getAttribute('data-rating'),
            maxRating: 5,
            minRating: 0
        });

        _this.initAria();
        _this.initControls();
        _this.updateRating(_this.state.rating);
        return _this;
    }

    _createClass(Rating, [{
        key: 'initAria',
        value: function initAria() {
            [].forEach.call(this.dom.stars, function (star) {
                Utils.aria.set(star, 'hidden', true);
            });

            return this;
        }
    }, {
        key: 'initControls',
        value: function initControls() {
            var _this2 = this;

            Utils.makeElementFocusable(this.element);

            Keyboard.onArrowLeftPressed(this.element, this.decreaseRating.bind(this));
            Keyboard.onArrowRightPressed(this.element, this.increaseRating.bind(this));

            Utils.makeChildElementsClickable(this.element, this.dom.stars, function (index) {
                _this2.updateRating(index + 1);
            }, true);

            return this;
        }
    }, {
        key: 'updateRating',
        value: function updateRating(newRating) {
            if (newRating < this.state.minRating || newRating > this.state.maxRating) {
                Utils.console.error('wrong rating value');
                return this;
            }

            Utils.removeClass(this.element, '-r' + this.state.rating);
            Utils.addClass(this.element, '-r' + newRating);

            var newAriaLabel = Utils.aria.get(this.element, 'label').replace(this.state.rating, newRating);

            Utils.aria.set(this.element, 'label', newAriaLabel);
            Utils.setAttribute(this.element, 'data-rating', newRating);

            this.state.rating = newRating;

            if (this.element === document.activeElement) {
                this.element.blur();
                this.element.focus();
            }

            return this;
        }
    }, {
        key: 'increaseRating',
        value: function increaseRating() {
            if (this.state.rating < this.state.maxRating) {
                this.updateRating(this.state.rating + 1);
            }

            return this;
        }
    }, {
        key: 'decreaseRating',
        value: function decreaseRating() {
            if (this.state.rating > this.state.minRating) {
                this.updateRating(this.state.rating - 1);
            }

            return this;
        }
    }]);

    return Rating;
}(_component.Component);

;

},{"../component":6,"../controls/keyboard":25,"../utils":32}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SelectDropdown = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

var _keyboard = require('../controls/keyboard');

var Keyboard = _interopRequireWildcard(_keyboard);

var _component = require('../component');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SelectDropdown = exports.SelectDropdown = function (_Component) {
    _inherits(SelectDropdown, _Component);

    function SelectDropdown(element, options) {
        _classCallCheck(this, SelectDropdown);

        var _this = _possibleConstructorReturn(this, (SelectDropdown.__proto__ || Object.getPrototypeOf(SelectDropdown)).call(this, element, options));

        _this.dom = Utils.extend(_this.dom, {
            labels: _this.element.parentNode.getElementsByTagName('label'),
            select: _this.element.getElementsByClassName('select')[0],
            state: _this.element.getElementsByClassName('state')[0],
            options: _this.element.getElementsByClassName('mui-dropdown-options')[0],
            optionsList: _this.element.getElementsByClassName('option'),
            shadow: _this.element.getElementsByClassName('mui-shadow-toggle')[0],
            icon: _this.element.getElementsByClassName('icon')[0]
        });

        _this.state = Utils.extend(_this.state, {
            selectedIndex: _this.getSelectedIndex(),
            isOpened: false
        });

        _this.createHiddenSelect();
        _this.initAria();
        _this.initControls();
        _this.updateState();
        return _this;
    }

    _createClass(SelectDropdown, [{
        key: 'createHiddenSelect',
        value: function createHiddenSelect() {
            var _this2 = this;

            var hiddenSelect = document.createElement('select'),
                id = this.dom.select.getAttribute('data-id');

            hiddenSelect.setAttribute('id', id);
            hiddenSelect.setAttribute('name', id);

            this.element.appendChild(hiddenSelect);
            this.dom.hiddenSelect = hiddenSelect;

            Utils.addClass(this.dom.hiddenSelect, '_hidden');
            Utils.aria.set(this.dom.hiddenSelect, 'hidden', true);

            [].forEach.call(this.dom.optionsList, function (option) {
                var hiddenOption = document.createElement('option');

                hiddenOption.value = Utils.getAttribute(option, 'data-value');

                _this2.dom.hiddenSelect.add(hiddenOption);
            });

            return this;
        }
    }, {
        key: 'initAria',
        value: function initAria() {
            var _this3 = this;

            Utils.aria.setRole(this.dom.select, 'listbox');

            [].forEach.call(this.dom.optionsList, function (option) {
                Utils.aria.setRole(option, 'option');
                Utils.aria.setId(option);
            });

            Utils.aria.set(this.dom.select, 'activedescendant', this.dom.optionsList[this.state.selectedIndex].getAttribute('id'));
            Utils.aria.set(this.dom.state, 'hidden', true);
            Utils.aria.set(this.dom.icon, 'hidden', true);
            Utils.aria.set(this.dom.shadow, 'hidden', true);

            Utils.ifNodeList(this.dom.labels, function () {
                var selectId = Utils.aria.setId(_this3.dom.select);

                [].forEach.call(_this3.dom.labels, function (label) {
                    Utils.setAttribute(label, 'for', selectId);
                });

                Utils.aria.set(_this3.dom.select, 'labelledby', Utils.aria.setId(_this3.dom.labels[0]));
            });

            return this;
        }
    }, {
        key: 'initControls',
        value: function initControls() {
            var _this4 = this;

            Utils.makeElementClickable(this.dom.select, this.toggleDropdown.bind(this));
            Utils.makeElementClickable(this.dom.shadow, this.toggleDropdown.bind(this), true);

            Utils.makeChildElementsClickable(this.element, this.dom.optionsList, function (index) {
                _this4.updateState(index);
                _this4.closeDropdown();
            });

            Utils.ifNodeList(this.dom.labels, function () {
                [].forEach.call(_this4.dom.labels, function (label) {
                    label.addEventListener('focus', function () {
                        _this4.dom.select.focus();
                    });
                });

                _this4.dom.select.addEventListener('focus', function () {
                    Utils.makeElementsNotFocusable(_this4.dom.labels);
                });

                _this4.dom.select.addEventListener('blur', function () {
                    Utils.makeElementsFocusable(_this4.dom.labels);
                });
            });

            Keyboard.onTabPressed(Utils.lastOfList(this.dom.optionsList), function () {
                _this4.closeDropdown();

                Utils.goToNextFocusableElement(_this4.dom.shadow);
            });

            return this;
        }
    }, {
        key: 'getSelectedIndex',
        value: function getSelectedIndex() {
            for (var i = 0; i < this.dom.options.length; i++) {
                if (Utils.hasClass(this.dom.options[i], '-selected')) {
                    return i;
                }
            }

            return 0;
        }
    }, {
        key: 'openDropdown',
        value: function openDropdown() {
            this.state.isOpened = true;

            Utils.addClass(this.element, '-opened');
            Utils.addClass(this.dom.shadow, '-visible');

            return this;
        }
    }, {
        key: 'toggleDropdown',
        value: function toggleDropdown() {
            this.state.isOpened = !this.state.isOpened;

            Utils.toggleClass(this.element, '-opened');
            Utils.toggleClass(this.dom.shadow, '-visible');

            return this;
        }
    }, {
        key: 'closeDropdown',
        value: function closeDropdown() {
            this.state.isOpened = false;

            Utils.removeClass(this.element, '-opened');
            Utils.removeClass(this.dom.shadow, '-visible');

            return this;
        }
    }, {
        key: 'updateState',
        value: function updateState() {
            var newSelectedIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

            this.state.selectedIndex = newSelectedIndex;
            this.dom.state.innerHTML = this.dom.optionsList[this.state.selectedIndex].innerHTML;
            this.dom.hiddenSelect.selectedIndex = this.state.selectedIndex.toString();

            Utils.aria.set(this.dom.select, 'activedescendant', this.dom.optionsList[this.state.selectedIndex].getAttribute('id'));

            return this;
        }
    }]);

    return SelectDropdown;
}(_component.Component);

;

},{"../component":6,"../controls/keyboard":25,"../utils":32}],22:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tabs = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _keyboard = require('../controls/keyboard');

var Keyboard = _interopRequireWildcard(_keyboard);

var _touchscreen = require('../controls/touchscreen');

var TouchScreen = _interopRequireWildcard(_touchscreen);

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

var _component = require('../component');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tabs = exports.Tabs = function (_Component) {
    _inherits(Tabs, _Component);

    function Tabs(element, options) {
        _classCallCheck(this, Tabs);

        var _this = _possibleConstructorReturn(this, (Tabs.__proto__ || Object.getPrototypeOf(Tabs)).call(this, element, options));

        _this.dom = Utils.extend(_this.dom, {
            tabs: _this.element.getElementsByClassName('tab'),
            labels: _this.element.getElementsByClassName('label'),
            labelsWrapper: _this.element.getElementsByClassName('labels')[0]
        });

        _this.state = Utils.extend(_this.state, {
            current: 0
        });

        _this.initAria();
        _this.initControls();
        return _this;
    }

    _createClass(Tabs, [{
        key: 'initAria',
        value: function initAria() {
            var _this2 = this;

            Utils.aria.setRole(this.dom.labelsWrapper, 'tablist');

            [].forEach.call(this.dom.labels, function (label, index) {
                Utils.aria.setRole(label, 'tab');
                Utils.aria.set(label, 'selected', false);
                Utils.aria.set(label, 'controls', Utils.aria.setId(_this2.dom.tabs[index]));
            });

            [].forEach.call(this.dom.tabs, function (tab, index) {
                Utils.aria.setRole(tab, 'tabpanel');
                Utils.aria.set(tab, 'hidden', true);
                Utils.aria.set(tab, 'labelledby', Utils.aria.setId(_this2.dom.labels[index]));
            });

            Utils.addClass(this.dom.tabs[0], '-active');
            Utils.aria.set(this.dom.tabs[0], 'hidden', false);
            Utils.addClass(this.dom.labels[0], '-active');
            Utils.aria.set(this.dom.labels[0], 'selected', true);

            return this;
        }
    }, {
        key: 'initControls',
        value: function initControls() {
            var _this3 = this;

            Utils.makeChildElementsClickable(this.element, this.dom.labels, function (index) {
                _this3.makeTabInactive(_this3.state.current);
                _this3.makeTabActive(index);
            });

            [].forEach.call(this.dom.labels, function (label, index) {
                if (index !== _this3.state.current) {
                    Utils.makeElementNotFocusable(label);
                }

                Keyboard.onArrowLeftPressed(label, _this3.goToPreviousTab.bind(_this3));
                Keyboard.onArrowRightPressed(label, _this3.goToNextTab.bind(_this3));
            });

            TouchScreen.onSwipeRight(this.element, this.goToPreviousTab.bind(this));
            TouchScreen.onSwipeLeft(this.element, this.goToNextTab.bind(this));

            return this;
        }
    }, {
        key: 'makeTabActive',
        value: function makeTabActive(index) {
            Utils.addClass(this.dom.labels[index], '-active');
            Utils.addClass(this.dom.tabs[index], '-active');
            Utils.aria.set(this.dom.labels[index], 'selected', true);
            Utils.aria.set(this.dom.tabs[index], 'hidden', false);

            Utils.makeElementFocusable(this.dom.labels[index]);
            this.dom.labels[index].focus();

            this.state.current = index;

            return this;
        }
    }, {
        key: 'makeTabInactive',
        value: function makeTabInactive(index) {
            Utils.removeClass(this.dom.labels[index], '-active');
            Utils.removeClass(this.dom.tabs[index], '-active');
            Utils.aria.set(this.dom.labels[index], 'selected', false);
            Utils.aria.set(this.dom.tabs[index], 'hidden', true);

            this.dom.labels[index].blur();
            Utils.makeElementNotFocusable(this.dom.labels[index]);

            return this;
        }
    }, {
        key: 'goToPreviousTab',
        value: function goToPreviousTab() {
            if (this.state.current > 0) {
                this.makeTabInactive(this.state.current);
                this.makeTabActive(this.state.current - 1);
            }

            return this;
        }
    }, {
        key: 'goToNextTab',
        value: function goToNextTab() {
            if (this.state.current < this.dom.tabs.length - 1) {
                this.makeTabInactive(this.state.current);
                this.makeTabActive(this.state.current + 1);
            }

            return this;
        }
    }, {
        key: 'keyDownHandler',
        value: function keyDownHandler(keyCode) {
            switch (keyCode) {
                case 37:
                    // Arrow Left
                    this.goToPreviousTab();
                    break;
                case 39:
                    // Arrow Right
                    this.goToNextTab();
                    break;
                default:
                    break;
            }

            return this;
        }
    }]);

    return Tabs;
}(_component.Component);

;

},{"../component":6,"../controls/keyboard":25,"../controls/touchscreen":27,"../utils":32}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TagsList = undefined;

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

var _component = require('../component');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TagsList = exports.TagsList = function (_Component) {
    _inherits(TagsList, _Component);

    function TagsList(element, options) {
        _classCallCheck(this, TagsList);

        var _this = _possibleConstructorReturn(this, (TagsList.__proto__ || Object.getPrototypeOf(TagsList)).call(this, element, options));

        Utils.aria.setRole(_this.element, 'navigation');
        return _this;
    }

    return TagsList;
}(_component.Component);

;

},{"../component":6,"../utils":32}],24:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Textarea = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

var _component = require('../component');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Textarea = exports.Textarea = function (_Component) {
    _inherits(Textarea, _Component);

    function Textarea(element, options) {
        _classCallCheck(this, Textarea);

        var _this = _possibleConstructorReturn(this, (Textarea.__proto__ || Object.getPrototypeOf(Textarea)).call(this, element, options));

        _this.dom = Utils.extend(_this.dom, {
            textarea: element.getElementsByTagName('textarea')[0],
            labels: element.parentNode.getElementsByTagName('label')
        });

        _this.initAria();
        _this.initControls();
        return _this;
    }

    _createClass(Textarea, [{
        key: 'initAria',
        value: function initAria() {
            var _this2 = this;

            var textareaId = this.dom.textarea.getAttribute('id') || Utils.aria.setId(this.dom.textarea);

            Utils.ifNodeList(this.dom.labels, function () {
                Utils.aria.set(_this2.dom.textarea, 'labelledby', Utils.aria.setId(_this2.dom.labels[0]));

                [].forEach.call(_this2.dom.labels, function (label) {
                    label.setAttribute('for', textareaId);
                });
            }, false);

            return this;
        }
    }, {
        key: 'initControls',
        value: function initControls() {
            var _this3 = this;

            Utils.ifNodeList(this.dom.labels, function () {
                [].forEach.call(_this3.dom.labels, function (label) {
                    label.addEventListener('focus', function () {
                        _this3.dom.textarea.focus();
                    });
                });
            }, false);

            this.dom.textarea.addEventListener('focus', this.focusEventHandler.bind(this));
            this.dom.textarea.addEventListener('blur', this.blurEventHandler.bind(this));
            this.dom.textarea.addEventListener('change', this.changeEventHandler.bind(this));

            return this;
        }
    }, {
        key: 'focusEventHandler',
        value: function focusEventHandler() {
            var _this4 = this;

            Utils.addClass(this.element, '-focused');

            Utils.ifNodeList(this.dom.labels, function () {
                Utils.makeElementsNotFocusable(_this4.dom.labels);
            });
        }
    }, {
        key: 'blurEventHandler',
        value: function blurEventHandler() {
            var _this5 = this;

            Utils.removeClass(this.element, '-focused');

            Utils.ifNodeList(this.dom.labels, function () {
                Utils.makeElementsFocusable(_this5.dom.labels);
            });
        }
    }, {
        key: 'changeEventHandler',
        value: function changeEventHandler() {
            if (this.dom.textarea.value == '') {
                Utils.removeClass(this.element, '-has-value');
            } else {
                Utils.addClass(this.element, '-has-value');
            }
        }
    }]);

    return Textarea;
}(_component.Component);

;

},{"../component":6,"../utils":32}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.onEnterPressed = onEnterPressed;
exports.onTabPressed = onTabPressed;
exports.onShiftTabPressed = onShiftTabPressed;
exports.onArrowLeftPressed = onArrowLeftPressed;
exports.onArrowUpPressed = onArrowUpPressed;
exports.onArrowRightPressed = onArrowRightPressed;
exports.onArrowDownPressed = onArrowDownPressed;
function onEnterPressed(element, callback) {
    element.addEventListener('keydown', function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            callback(e);
        }
    });
};

function onTabPressed(element, callback) {
    element.addEventListener('keydown', function (e) {
        if (e.keyCode == 9 && !e.shiftKey) {
            e.preventDefault();
            callback(e);
        }
    });
};

function onShiftTabPressed(element, callback) {
    element.addEventListener('keydown', function (e) {
        if (e.keyCode == 9 && e.shiftKey) {
            e.preventDefault();
            callback(e);
        }
    });
};

function onArrowLeftPressed(element, callback) {
    element.addEventListener('keydown', function (e) {
        if (e.keyCode == 37) {
            e.preventDefault();
            callback(e);
        }
    });
};

function onArrowUpPressed(element, callback) {
    element.addEventListener('keydown', function (e) {
        if (e.keyCode == 38) {
            e.preventDefault();
            callback(e);
        }
    });
};

function onArrowRightPressed(element, callback) {
    element.addEventListener('keydown', function (e) {
        if (e.keyCode == 39) {
            e.preventDefault();
            callback(e);
        }
    });
};

function onArrowDownPressed(element, callback) {
    element.addEventListener('keydown', function (e) {
        if (e.keyCode == 40) {
            e.preventDefault();
            callback(e);
        }
    });
};

},{}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.onClick = onClick;
exports.onMouseOver = onMouseOver;
exports.onMouseOut = onMouseOut;
function onClick(element, callback) {
    element.addEventListener('click', function (e) {
        e.preventDefault();
        callback(e);
    });
};

function onMouseOver(element, callback) {
    element.addEventListener('mouseover', function (e) {
        e.preventDefault();
        callback(e);
    });
};

function onMouseOut(element, callback) {
    element.addEventListener('mouseout', function (e) {
        e.preventDefault();
        callback(e);
    });
};

},{}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.onSwipeLeft = onSwipeLeft;
exports.onSwipeRight = onSwipeRight;
exports.onPinchOut = onPinchOut;
function onSwipeLeft(element, callback) {
    var hammertime = new Hammer(element);

    hammertime.on('swipeleft', callback);
};

function onSwipeRight(element, callback) {
    var hammertime = new Hammer(element);

    hammertime.on('swiperight', callback);
};

function onPinchOut(element, callback) {
    var hammertime = new Hammer(element);

    hammertime.get('pinch').set({ enable: true });
    hammertime.on('pinchout', callback);
};

},{}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Events = exports.Events = function () {
    function Events() {
        _classCallCheck(this, Events);

        if (_typeof(Events.instance) === 'object') {
            return Events.instance;
        }

        this.data = {
            window: {}
        };

        this.eventsData = {};

        this.initDefaultEvents();

        Events.instance = this;
    }

    _createClass(Events, [{
        key: 'initDefaultEvents',
        value: function initDefaultEvents() {
            var _this = this;

            this.addEvent('resizeWindowHeight');
            this.addEvent('resizeWindowWidth');

            this.data.window.height = window.innerHeight;
            this.data.window.width = window.innerWidth;

            window.addEventListener('resize', function () {
                var height = window.innerHeight;
                var width = window.innerWidth;

                if (_this.data.window.height != height) {
                    _this.data.window.height = height;

                    _this.fireEvent('resizeWindowHeight');
                }

                if (_this.data.window.width != width) {
                    _this.data.window.width = width;

                    _this.fireEvent('resizeWindowWidth');
                }
            });
        }
    }, {
        key: 'addEvent',
        value: function addEvent(name) {
            if (!(name in this.eventsData)) {
                this.eventsData[name] = {
                    callbacks: [],
                    counter: 0
                };
            }

            return this;
        }
    }, {
        key: 'addEventListener',
        value: function addEventListener(name, callback) {
            var executeIfAlreadyFired = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            if (name in this.eventsData && typeof callback === 'function') {
                this.eventsData[name].callbacks.push(callback);

                if (executeIfAlreadyFired && this.eventsData[name].counter > 0) {
                    callback();
                }
            }

            return this;
        }
    }, {
        key: 'fireEvent',
        value: function fireEvent(name) {
            if (name in this.eventsData) {
                this.eventsData[name].counter++;

                this.eventsData[name].callbacks.forEach(function (callback) {
                    if (typeof callback === 'function') {
                        callback();
                    }
                });
            }

            return this;
        }
    }]);

    return Events;
}();

},{}],29:[function(require,module,exports){
'use strict';

var _muilessium = require('./muilessium');

var _muilessium2 = _interopRequireDefault(_muilessium);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
    window.Hammer = require('hammerjs');
    window.Muilessium = new _muilessium2.default();

    window.Muilessium.components = {
        accordions: window.Muilessium.create('accordion', '.mui-accordion', {}),
        breadcrumbs: window.Muilessium.create('breadcrumb', '.mui-breadcrumb', {}),
        buttonsd: window.Muilessium.create('button-dropdown', '.mui-button-dropdown', {}),
        buttons: window.Muilessium.create('button', '.mui-button', {}),
        carousels: window.Muilessium.create('carousel', '.mui-carousel', {}),
        checkboxes: window.Muilessium.create('checkbox', '.mui-checkbox', {}),
        hnavigations: window.Muilessium.create('header-navigation', '.mui-header-navigation', {}),
        inputRange: window.Muilessium.create('input-range', '.mui-input-range', {}),
        inputs: window.Muilessium.create('input', '.mui-input', {}),
        mediaViews: window.Muilessium.create('media-view', '.mui-media-view', {}),
        modalWindows: window.Muilessium.create('modal-window', '.mui-modal-window', {}),
        paginations: window.Muilessium.create('pagination', '.mui-pagination', {}),
        radios: window.Muilessium.create('radio', '.mui-radio', {}),
        ratings: window.Muilessium.create('rating', '.mui-rating', {}),
        sdropdowns: window.Muilessium.create('select-dropdown', '.mui-select-dropdown', {}),
        tabs: window.Muilessium.create('tabs', '.mui-tabs', {}),
        tagslists: window.Muilessium.create('tags-list', '.mui-tags-list', {}),
        textareas: window.Muilessium.create('textarea', '.mui-textarea', {})
    };
});

},{"./muilessium":30,"hammerjs":2}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

var Utils = _interopRequireWildcard(_utils);

var _polyfills = require('./polyfills');

var Polyfills = _interopRequireWildcard(_polyfills);

var _events = require('./events');

var _accordion = require('./components/accordion');

var _breadcrumb = require('./components/breadcrumb');

var _buttonDropdown = require('./components/button-dropdown');

var _button = require('./components/button');

var _carousel = require('./components/carousel');

var _checkbox = require('./components/checkbox');

var _headerNavigation = require('./components/header-navigation');

var _input = require('./components/input');

var _inputRange = require('./components/input-range');

var _mediaView = require('./components/media-view');

var _modalWindow = require('./components/modal-window');

var _pagination = require('./components/pagination');

var _radio = require('./components/radio');

var _selectDropdown = require('./components/select-dropdown');

var _tabs = require('./components/tabs');

var _tagsList = require('./components/tags-list');

var _textarea = require('./components/textarea');

var _rating = require('./components/rating');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var components = {
    'accordion': _accordion.Accordion,
    'breadcrumb': _breadcrumb.Breadcrumb,
    'button-dropdown': _buttonDropdown.ButtonDropdown,
    'button': _button.Button,
    'carousel': _carousel.Carousel,
    'checkbox': _checkbox.Checkbox,
    'header-navigation': _headerNavigation.HeaderNavigation,
    'input': _input.Input,
    'input-range': _inputRange.InputRange,
    'media-view': _mediaView.MediaView,
    'modal-window': _modalWindow.ModalWindow,
    'pagination': _pagination.Pagination,
    'radio': _radio.Radio,
    'select-dropdown': _selectDropdown.SelectDropdown,
    'tabs': _tabs.Tabs,
    'tags-list': _tagsList.TagsList,
    'textarea': _textarea.Textarea,
    'rating': _rating.Rating
};

var Muilessium = function () {
    function Muilessium() {
        _classCallCheck(this, Muilessium);

        if (_typeof(Muilessium.instance) === 'object') {
            return Muilessium.instance;
        }

        this.Utils = Utils;
        this.Events = new _events.Events();

        this.init();

        Muilessium.instance = this;

        this.Events.fireEvent('muilessium-initialized');
    }

    _createClass(Muilessium, [{
        key: 'init',
        value: function init() {
            var _this = this;

            Utils.normalizeTabIndex();
            Utils.aria.hideIcons('fa');

            this.initEvents();
            this.initEventListeners();

            Utils.lazyLoadImages(function () {
                _this.Events.fireEvent('images-loaded');
            });

            return this;
        }
    }, {
        key: 'initEvents',
        value: function initEvents() {
            this.Events.addEvent('muilessium-initialized');
            this.Events.addEvent('images-loaded');

            return this;
        }
    }, {
        key: 'initEventListeners',
        value: function initEventListeners() {
            this.Events.addEventListener('muilessium-initialized', function () {
                Polyfills.smoothScroll();

                Utils.initAnchorLinks();
            });

            this.Events.addEventListener('images-loaded', Polyfills.objectFit);
        }
    }, {
        key: 'create',
        value: function create(type, selector, options) {
            if (typeof components[type] !== 'function') {
                throw new Error('No such component: ' + type);
            }

            var elements = document.querySelectorAll(selector);

            return [].map.call(elements, function (element) {
                return new components[type](element, options);
            });
        }
    }]);

    return Muilessium;
}();

exports.default = Muilessium;
;

},{"./components/accordion":7,"./components/breadcrumb":8,"./components/button":10,"./components/button-dropdown":9,"./components/carousel":11,"./components/checkbox":12,"./components/header-navigation":13,"./components/input":15,"./components/input-range":14,"./components/media-view":16,"./components/modal-window":17,"./components/pagination":18,"./components/radio":19,"./components/rating":20,"./components/select-dropdown":21,"./components/tabs":22,"./components/tags-list":23,"./components/textarea":24,"./events":28,"./polyfills":31,"./utils":32}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.smoothScroll = smoothScroll;
exports.objectFit = objectFit;

var _smoothscrollPolyfill = require('smoothscroll-polyfill');

var smoothScrollPolyfill = _interopRequireWildcard(_smoothscrollPolyfill);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var objectFitImages = require('object-fit-images');

function smoothScroll() {
    smoothScrollPolyfill.polyfill();
};

function objectFit() {
    objectFitImages();
};

},{"object-fit-images":4,"smoothscroll-polyfill":5}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ajax = require('./utils/ajax');

Object.keys(_ajax).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ajax[key];
    }
  });
});

var _aria = require('./utils/aria');

Object.keys(_aria).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _aria[key];
    }
  });
});

var _attributes = require('./utils/attributes');

Object.keys(_attributes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _attributes[key];
    }
  });
});

var _checks = require('./utils/checks');

Object.keys(_checks).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _checks[key];
    }
  });
});

var _classes = require('./utils/classes');

Object.keys(_classes).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _classes[key];
    }
  });
});

var _console = require('./utils/console');

Object.keys(_console).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _console[key];
    }
  });
});

var _focusAndClick = require('./utils/focus-and-click');

Object.keys(_focusAndClick).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _focusAndClick[key];
    }
  });
});

var _scroll = require('./utils/scroll');

Object.keys(_scroll).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _scroll[key];
    }
  });
});

var _uncategorized = require('./utils/uncategorized');

Object.keys(_uncategorized).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _uncategorized[key];
    }
  });
});

var _viewport = require('./utils/viewport');

Object.keys(_viewport).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _viewport[key];
    }
  });
});

},{"./utils/ajax":33,"./utils/aria":34,"./utils/attributes":35,"./utils/checks":36,"./utils/classes":37,"./utils/console":38,"./utils/focus-and-click":39,"./utils/scroll":40,"./utils/uncategorized":41,"./utils/viewport":42}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// -----------------------------------------------------------------------------
// Ajax utilities
// -----------------------------------------------------------------------------

var ajax = exports.ajax = {

    // Post
    // ----
    // Makes a POST request and executes a success or error callback when
    // the request state changes

    post: function post(url, data, successCallback, errorCallback) {
        var request = new XMLHttpRequest();

        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                /* Only 2xx codes are successful for the POST request. */
                if (request.status >= 200 && request.status < 300) {
                    successCallback(request.responseText);
                } else {
                    console.error('POST (' + url + '): error ' + request.status + ' ' + request.statusText);
                    errorCallback(request.status, request.statusText);
                }
            }
        };

        request.send(data);
    },

    // Get
    // ---
    // Makes a GET request and executes a success or error callback when
    // the request state changes

    get: function get(url, successCallback, errorCallback) {
        var request = new XMLHttpRequest();

        request.open('GET', url, true);

        request.onreadystatechange = function () {
            if (request.readyState === 4) {
                /* Status 304 (Not Modified) is also a successful for the GET request.*/
                if (request.status >= 200 && request.status < 300 || request.status === 304) {
                    successCallback(request.responseText);
                } else {
                    console.error('GET (' + url + '): error ' + request.status + ' ' + request.statusText);
                    errorCallback(request.status, request.statusText);
                }
            }
        };

        request.send(null);
    }
};

},{}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.aria = undefined;

var _attributes = require('../utils/attributes');

var _uncategorized = require('../utils/uncategorized');

var aria = exports.aria = {

    // Set property
    // ------------
    // Sets aria-property to the element

    set: function set(element, property) {
        var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        return (0, _attributes.setAttribute)(element, 'aria-' + property, value);
    },

    // Set role
    // --------
    // Sets aria-role to the element

    setRole: function setRole(element, role) {
        return (0, _attributes.setAttribute)(element, 'role', role);
    },

    // Remove role
    // -----------
    // Removes aria-role from the element

    removeRole: function removeRole(element) {
        return (0, _attributes.removeAttribute)(element, 'role');
    },

    // Set id
    // ------
    // Sets ID to the element (generates a random ID if ID not passed as a parameter),
    // returns this ID

    setId: function setId(element, id) {
        var newId = id || 'mui-id-' + (0, _uncategorized.generateRandomString)(6);

        (0, _attributes.setAttribute)(element, 'id', newId);

        return newId;
    },

    // Get property
    // ------------
    // Gets aria-property from the element

    get: function get(element, property) {
        return (0, _attributes.getAttribute)(element, 'aria-' + property);
    },

    // Get role
    // --------
    // Gets aria-role from the element

    getRole: function getRole(element) {
        return (0, _attributes.getAttribute)(element, 'role');
    },

    // Toggle state
    // ------------
    // Changes boolean state from true to false and from false to true.

    toggleState: function toggleState(element, state) {
        (0, _attributes.setAttribute)(element, 'aria-' + state, !(0, _uncategorized.stringToBoolean)((0, _attributes.getAttribute)(element, 'aria-' + state)));
    },

    // Hide icons
    // ----------
    // Sets role='presentation' to all icons with specified class name

    hideIcons: function hideIcons(className) {
        [].forEach.call(document.getElementsByClassName(className), function (icon) {
            (0, _attributes.setAttribute)(icon, 'aria-hidden', true);
        });
    }
}; // -----------------------------------------------------------------------------
// WAI-ARIA utilities
// -----------------------------------------------------------------------------
// Here is some functions for operation with aria-roles and properties

},{"../utils/attributes":35,"../utils/uncategorized":41}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setAttribute = setAttribute;
exports.getAttribute = getAttribute;
exports.removeAttribute = removeAttribute;

var _checks = require('../utils/checks');

// Set attribute
// -------------
// Sets attribute to the element if it exists

function setAttribute(element, attribute, value) {
    return (0, _checks.ifExists)(element, function () {
        return element.setAttribute(attribute, value);
    });
} // -----------------------------------------------------------------------------
// Manipulating with html attributes
// -----------------------------------------------------------------------------


;

// Get attribute
// -------------
// Gets attribute from the element if it exists

function getAttribute(element, attribute) {
    return (0, _checks.ifExists)(element, function () {
        return element.getAttribute(attribute);
    });
};

// Remove attribute
// -------------
// Removes attribute from the element if it exists

function removeAttribute(element, attribute) {
    return (0, _checks.ifExists)(element, function () {
        return element.removeAttribute(attribute);
    });
};

},{"../utils/checks":36}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isInPage = isInPage;
exports.isNotInPage = isNotInPage;
exports.ifExists = ifExists;
exports.ifNodeList = ifNodeList;
exports.isDescendant = isDescendant;

var _console = require('../utils/console');

// Is in page
// ----------
// Returns true if elements is exists in a document.body and false otherwise

function isInPage(element) {
    /* Use this instead of document.contains because IE has only partial support of Node.contains. */
    return element === document.body || document.body.contains(element);
} // -----------------------------------------------------------------------------
// Checking for html elements in page
// -----------------------------------------------------------------------------


;

// Is not in page
// --------------
// Returns false if element is exists in a document.body and true otherwise

function isNotInPage(element) {
    return !isInPage(element);
};

// If exists
// ---------
// Executes callback function if the element exists in document.body
// and prints warning otherwise by default

function ifExists(element, callback) {
    var printWarning = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    if (isInPage(element)) {
        return callback();
    } else {
        if (printWarning) {
            _console.console.warning('element does not exists');
        }

        return null;
    }
};

// If nodelist
// -----------
// If first parameter is NodeList or HTMLCollection or Array of HTMLElements
// executes callback function and prints warning otherwise by default

function ifNodeList(x, callback) {
    var printWarning = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    if ((x instanceof NodeList || x instanceof HTMLCollection) && x.length > 0) {
        return callback();
    } else if (x instanceof Array && x.length > 0) {
        var isArrayOfElements = x.every(function (element) {
            return element instanceof HTMLElement;
        });

        if (isArrayOfElements) {
            return callback();
        }
    }

    if (printWarning) {
        _console.console.warning('element is not an instance of NodeList or HTMLCollection');
    }

    return null;
};

// Is descendant
// -------------
// Returns true if the second element is a descendant of the first element and false otherwise

function isDescendant(parent, child) {
    var node = child.parentNode;

    while (node != null) {
        if (node == parent) {
            return true;
        }

        node = node.parentNode;
    }

    return false;
};

},{"../utils/console":38}],37:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hasClass = hasClass;
exports.hasNotClass = hasNotClass;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.toggleClass = toggleClass;

var _checks = require('../utils/checks');

// Has class
// ---------
// Returns true if element exists and has selected class and false otherwise

function hasClass(element, classForTest) {
    return (0, _checks.ifExists)(element, function () {
        // Use className instead of classList because IE11 does not have support for slassList on SVG
        return element.className.indexOf(classForTest) !== -1;
    });
} // -----------------------------------------------------------------------------
// Manipulating CSS classes
// -----------------------------------------------------------------------------


;

// Has not class
// -------------
// Returns false if element exists and has selected class and true otherwise

function hasNotClass(element, classForTest) {
    return (0, _checks.ifExists)(element, function () {
        return !hasClass(element, classForTest);
    });
};

// Add class
// ---------
// Adds class to the element if it exists

function addClass(element, newClass) {
    return (0, _checks.ifExists)(element, function () {
        if (hasClass(element, newClass)) {
            return;
        }

        /* Use className instead of classList because IE11 does not have support for slassList on SVG */
        element.className += ' ' + newClass;
    });
};

// Remove class
// ------------
// Removes class from the element if it exists

function removeClass(element, classForRemoving) {
    return (0, _checks.ifExists)(element, function () {
        // Use className instead of classList because IE11 does not have support for slassList on SVG
        element.className = element.className.replace(classForRemoving, '');
    });
};

// Toggle class
// ------------
// Toggles class for the element if it exists

function toggleClass(element, classForToggle) {
    return (0, _checks.ifExists)(element, function () {
        if (hasNotClass(element, classForToggle)) {
            addClass(element, classForToggle);
        } else {
            removeClass(element, classForToggle);
        }
    });
};

},{"../utils/checks":36}],38:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
// -----------------------------------------------------------------------------
// Custom console
// -----------------------------------------------------------------------------

var console = exports.console = {

    // Log
    // ---
    // Prints message to the standart browser console

    log: function log(message) {
        window.console.log("" + message);
    },

    // Info
    // ----
    // Prints info message to the standart browser console

    info: function info(message) {
        window.console.info("[ INFO ] " + message);
    },

    // Warning
    // -------
    // Prints warning message to the standart browser console

    warning: function warning(message) {
        window.console.warn("[ WARNING ] " + message);
    },

    // Error
    // -----
    // Prints error message to the standart browser console

    error: function error(message) {
        window.console.error("[ ERROR ] " + message);
    }
};

},{}],39:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.makeElementFocusable = makeElementFocusable;
exports.makeElementsFocusable = makeElementsFocusable;
exports.makeElementNotFocusable = makeElementNotFocusable;
exports.makeElementsNotFocusable = makeElementsNotFocusable;
exports.getFocusableChilds = getFocusableChilds;
exports.getAllFocusableElements = getAllFocusableElements;
exports.getNextFocusableElement = getNextFocusableElement;
exports.getPreviousFocusableElement = getPreviousFocusableElement;
exports.goToNextFocusableElement = goToNextFocusableElement;
exports.goToPreviousFocusableElement = goToPreviousFocusableElement;
exports.makeElementClickable = makeElementClickable;
exports.makeChildElementsClickable = makeChildElementsClickable;

var _checks = require('../utils/checks');

var _mouse = require('../controls/mouse');

var _keyboard = require('../controls/keyboard');

// Make element focusable
// ----------------------
// Sets tabindex=0 to the element if it exists

function makeElementFocusable(element) {
    return (0, _checks.ifExists)(element, function () {
        element.tabIndex = 0;
    });
} // -----------------------------------------------------------------------------
// Manipulating with Focus & Click
// -----------------------------------------------------------------------------


;

// Make multiple elements focusable
// --------------------------------
// Sets tabindex=0 to the multiple elements in NodeList

function makeElementsFocusable(elements) {
    return (0, _checks.ifNodeList)(elements, function () {
        [].forEach.call(elements, function (element) {
            makeElementFocusable(element);
        });
    });
};

// Make element not focusable
// --------------------------
// Sets tabindex=-1 to the element

function makeElementNotFocusable(element) {
    return (0, _checks.ifExists)(element, function () {
        element.tabIndex = -1;
    });
};

// Make multiple elements not focusable
// ------------------------------------
// Sets tabindex=-1 to the multiple elements in NodeList

function makeElementsNotFocusable(elements) {
    return (0, _checks.ifNodeList)(elements, function () {
        [].forEach.call(elements, function (element) {
            makeElementNotFocusable(element);
        });
    });
};

// Get focusable childs
// --------------------
// Returns NodeList of childs of selected element with tabindex >= 0

function getFocusableChilds(element) {
    return (0, _checks.ifExists)(element, function () {
        return element.querySelectorAll('[tabindex]:not([tabindex="-1"])');
    });
};

// Get all focusable elements
// --------------------------
// Returns NodeList with all elements with tabindex >= 0

function getAllFocusableElements() {
    return document.querySelectorAll('[tabindex]:not([tabindex="-1"])');
};

// Get next focusable element
// --------------------------
// Returns next element with tabindex >= 0

function getNextFocusableElement(element) {
    return (0, _checks.ifExists)(element, function () {
        var focusables = getAllFocusableElements(),
            currentIndex = [].indexOf.call(focusables, element);

        if (currentIndex >= 0 && currentIndex < focusables.length - 1) {
            return focusables[currentIndex + 1];
        } else {
            return null;
        }
    });
};

// Get previous focusable element
// --------------------------
// Returns previous element with tabindex >= 0

function getPreviousFocusableElement(element) {
    return (0, _checks.ifExists)(element, function () {
        var focusables = getAllFocusableElements(),
            currentIndex = [].indexOf.call(focusables, element);

        if (currentIndex >= 0 && currentIndex > 0) {
            return focusables[currentIndex - 1];
        } else {
            return null;
        }
    });
};

// Go to next focusable
// --------------------
// Focus next focusable element

function goToNextFocusableElement(element) {
    var nextFocusable = getNextFocusableElement(element);

    return (0, _checks.ifExists)(nextFocusable, function () {
        nextFocusable.focus();

        return nextFocusable;
    });
};

// Go to previous focusable
// --------------------
// Focus previous focusable element

function goToPreviousFocusableElement(element) {
    var previousFocusable = getPreviousFocusableElement(element);

    return (0, _checks.ifExists)(previousFocusable, function () {
        previousFocusable.focus();

        return previousFocusable;
    });
};

// Make element clickable
// ----------------------
// Sets tabindex=0 to the element and adds event listeners for the click and
// enter key press with callback to the element if it exists

function makeElementClickable(element, callback) {
    var mouseOnly = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    return (0, _checks.ifExists)(element, function () {
        (0, _mouse.onClick)(element, function (e) {
            callback(e);
        });

        if (!mouseOnly) {
            element.tabIndex = 0;

            (0, _keyboard.onEnterPressed)(element, function (e) {
                callback(e);
            });
        }
    });
};

// Make childs clickable
// ----------------------
// Sets tabindex=0 to the child elements of the selected element
// and adds event listeners for the click and enter key press
// with callback to the childs if they exists

function makeChildElementsClickable(element, childs, callback) {
    var mouseOnly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    return (0, _checks.ifExists)(element, function () {
        return (0, _checks.ifNodeList)(childs, function () {
            (0, _mouse.onClick)(element, function (e) {
                var index = -1;

                [].forEach.call(childs, function (child, i) {
                    if (child == e.target || (0, _checks.isDescendant)(child, e.target)) {
                        index = i;
                    }
                });

                if (index >= 0) {
                    callback(index);
                }
            });

            if (!mouseOnly) {
                [].forEach.call(childs, function (child) {
                    child.tabIndex = 0;
                });

                (0, _keyboard.onEnterPressed)(element, function (e) {
                    var index = [].indexOf.call(childs, e.target);

                    if (index >= 0) {
                        callback(index);
                    }
                });
            }
        });
    });
};

},{"../controls/keyboard":25,"../controls/mouse":26,"../utils/checks":36}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.scrollTo = scrollTo;
exports.scrollToTop = scrollToTop;
exports.scrollFire = scrollFire;

var _checks = require('../utils/checks');

var _viewport = require('../utils/viewport');

var _uncategorized = require('../utils/uncategorized');

// Scroll to element
// -----------------
// Scrolls to the element and executes callback after scroll animation ends

function scrollTo(element, callback) {
    (0, _checks.ifExists)(element, function () {
        element.scrollIntoView({ 'behavior': 'smooth' });

        if (typeof callback === 'function') {
            setTimeout(callback, 470); /* Default scroll time in smoothscroll-polyfill is 468ms */
        }
    });
} // -----------------------------------------------------------------------------
// Scroll utilities
// -----------------------------------------------------------------------------


;

// Scroll to top
// -------------
// Scrolls to the top of page

function scrollToTop(callback) {
    window.scroll({ top: 0, left: 0, 'behavior': 'smooth' });

    if (typeof callback === 'function') {
        setTimeout(callback, 470); /* Default scroll time in smoothscroll-polyfill is 468ms */
    }
};

// Scrollfire
// ----------
// Executes a callback when the element becomes visible in viewport

function scrollFire(element, callback) {
    if ((0, _viewport.isInViewport)(element)) {
        callback();
    } else {
        (function () {
            var modifiedCallback = (0, _uncategorized.callOnce)(callback);

            document.addEventListener('scroll', function () {
                if ((0, _viewport.isInViewport)(element)) {
                    setTimeout(modifiedCallback, 200);
                }
            });
        })();
    }
};

},{"../utils/checks":36,"../utils/uncategorized":41,"../utils/viewport":42}],41:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.normalizeTabIndex = normalizeTabIndex;
exports.lazyLoadImages = lazyLoadImages;
exports.initAnchorLinks = initAnchorLinks;
exports.generateRandomString = generateRandomString;
exports.stringify = stringify;
exports.extend = extend;
exports.debounce = debounce;
exports.stringToBoolean = stringToBoolean;
exports.callOnce = callOnce;
exports.firstOfList = firstOfList;
exports.lastOfList = lastOfList;

var _classes = require('../utils/classes');

var _focusAndClick = require('../utils/focus-and-click');

var _scroll = require('../utils/scroll');

// Normalize TabIndexes
// --------------------

function normalizeTabIndex() {
    var focusableElements = [].slice.call(document.querySelectorAll('a, button, input, label, select, textarea, object'));

    focusableElements.map(function (element) {
        element.tabIndex = 0;
    });
} // -----------------------------------------------------------------------------
// Uncategorized utilities
// -----------------------------------------------------------------------------


;

// Lazy load images
// ----------------

var imagesLoaded = require('imagesloaded');

function lazyLoadImages(callback) {
    [].forEach.call(document.querySelectorAll('._lazy-load'), function (image) {
        image.src = image.getAttribute('data-src');

        image.addEventListener('load', function () {
            (0, _classes.addClass)(this, '-loaded');
        });
    });

    if (typeof callback === 'function') {
        imagesLoaded('body', callback);
    }
};

// Init anchor links
// -----------------

function initAnchorLinks() {
    var links = document.getElementsByTagName('a');

    [].forEach.call(links, function (link) {
        var href = link.getAttribute('href');

        if (href && href[0] === '#') {
            (0, _focusAndClick.makeElementClickable)(link, function () {
                var targetElement = document.getElementById(href.substring(1));

                if (targetElement) {
                    (0, _scroll.scrollTo)(targetElement, function () {
                        if (window.location.hash === href) {
                            window.location.hash = '';
                        }

                        window.location.hash = href.substring(1);
                    });
                } else {
                    console.warning('Anchor ' + href + ' does not exists');
                }
            });
        }
    });
};

// Random string generation
// ------------------------

function generateRandomString() {
    var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;

    var str = '',
        possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        str += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }

    return str;
};

// Non-standart stringify function
// -------------------------------

function stringify(object) {
    return JSON.stringify(object, function (key, value) {
        if (typeof value === 'function') {
            return 'function';
        }

        return value;
    });
};

// Extend
// ------

/* Use this function instead of Object.assign because IE11 has no support for Object.assign
   https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign */

function extend(target, source) {
    target = target || {};

    for (var prop in source) {
        target[prop] = source[prop];
    }

    return target;
};

// Debounce
// --------

function debounce(func, ms) {
    var callAllowed = true;

    return function () {
        if (!callAllowed) {
            return;
        }

        func.apply(this, arguments);

        callAllowed = false;

        setTimeout(function () {
            callAllowed = true;
        }, ms);
    };
};

// String -> Boolean
// -----------------

function stringToBoolean(str) {
    return str === 'true';
};

// Call once
// ---------
// Executes callback function only once

function callOnce(callback) {
    var executed = false;

    return function () {
        if (!executed) {
            executed = true;

            return callback();
        }
    };
};

// First of list
// ------------
// Returns first element of array-like objects

function firstOfList(list) {
    return list[0];
};

// Last of list
// ------------
// Returns last element of array-like objects

function lastOfList(list) {
    return list[list.length - 1];
};

},{"../utils/classes":37,"../utils/focus-and-click":39,"../utils/scroll":40,"imagesloaded":3}],42:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isInViewport = isInViewport;

var _checks = require('../utils/checks');

// Is in viewport
// --------------
// Returns true if the element is in viewport

function isInViewport(element) {
    return (0, _checks.ifExists)(element, function () {
        var rect = element.getBoundingClientRect(),
            html = document.documentElement;

        return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || html.clientHeight) && rect.right <= (window.innerWidth || html.clientWidth);
    });
} // -----------------------------------------------------------------------------
// Viewport utilities
// -----------------------------------------------------------------------------


;

},{"../utils/checks":36}]},{},[29]);
