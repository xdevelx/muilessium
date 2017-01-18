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

},{"ev-emitter":1}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{"./utils":27}],6:[function(require,module,exports){
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

},{"../component":5,"../utils":27}],7:[function(require,module,exports){
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

},{"../component":5,"../utils":27}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ButtonDropdown = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
            Utils.makeChildElementsClickable(this.element, [this.dom.button, this.dom.shadow], this.toggleDropdown.bind(this));

            return this;
        }
    }, {
        key: 'openDropdown',
        value: function openDropdown() {
            Utils.addClass(this.element, '-opened');
            Utils.addClass(this.dom.shadow, '-visible');

            Utils.aria.set(this.dom.button, 'hidden', true);
            Utils.aria.set(this.dom.dropdown, 'hidden', false);
            Utils.aria.set(this.dom.shadow, 'hidden', false);

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
            Utils.aria.set(this.dom.shadow, 'hidden', true);

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

},{"../component":5,"../utils":27}],9:[function(require,module,exports){
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

        Utils.aria.setRole(_this.element, 'button');
        return _this;
    }

    return Button;
}(_component.Component);

},{"../component":5,"../utils":27}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Carousel = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

            this.element.addEventListener('mouseover', this.stopRotating.bind(this));
            this.element.addEventListener('mouseout', this.startRotating.bind(this));

            Utils.makeChildElementsClickable(this.element, this.dom.controls.prev, function () {
                _this2.rotate('prev');
            });

            Utils.makeChildElementsClickable(this.element, this.dom.controls.next, function () {
                _this2.rotate('next');
            });

            Utils.makeChildElementsClickable(this.element, this.dom.indicators, function (index) {
                _this2.rotate(index);
            });

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

},{"../component":5,"../utils":27}],11:[function(require,module,exports){
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

},{"../component":5,"../utils":27}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HeaderNavigation = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
            toggles: element.getElementsByClassName('mui-navigation-toggle'),
            hamburger: element.getElementsByClassName('mui-navigation-toggle')[0],
            shadow: element.getElementsByClassName('mui-shadow-toggle')[0],
            linksList: element.getElementsByClassName('links-list')[0],
            links: element.getElementsByTagName('a')
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
            [].forEach.call(this.dom.toggles, function (toggle) {
                Utils.aria.setRole(toggle, 'button');
            });

            Utils.aria.set(this.dom.hamburger, 'haspopup', true);

            Utils.aria.set(this.dom.linksList, 'labelledby', Utils.aria.setId(this.dom.hamburger));

            return this;
        }
    }, {
        key: 'initControls',
        value: function initControls() {
            var _this2 = this;

            Utils.makeChildElementsClickable(this.element, this.dom.toggles, this.toggleNavigation.bind(this));

            Utils.makeChildElementsClickable(this.element, this.dom.links, function (index) {
                var href = _this2.dom.links[index].getAttribute('href');

                if (href[0] === '#') {
                    _this2.closeNavigation();
                } else {
                    window.location = href;
                }
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
                Utils.aria.set(this.dom.shadow, 'hidden', false);
                Utils.aria.set(this.dom.linksList, 'hidden', false);

                this.dom.linksList.getElementsByTagName('a')[0].focus();
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
                Utils.aria.set(this.dom.shadow, 'hidden', true);
                Utils.aria.set(this.dom.linksList, 'hidden', true);

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
                Utils.aria.set(this.dom.linksList, 'hidden', true);

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
                Utils.aria.set(this.dom.linksList, 'hidden', false);

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

            if (childsWidth > parentWidth - 100) {
                this.transformToMobile();
            } else {
                this.transformToDesktop();
            }

            return this;
        }
    }]);

    return HeaderNavigation;
}(_component.Component);

},{"../component":5,"../utils":27}],13:[function(require,module,exports){
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

},{"../utils":27,"./input":14}],14:[function(require,module,exports){
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

},{"../component":5,"../utils":27}],15:[function(require,module,exports){
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

},{"../component":5,"../utils":27}],16:[function(require,module,exports){
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

},{"../component":5,"../utils":27}],17:[function(require,module,exports){
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

},{"../component":5,"../utils":27}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Rating = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

            this.element.addEventListener('keydown', function (e) {
                _this2.keyDownHandler(e.keyCode);
            });

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
    }, {
        key: 'keyDownHandler',
        value: function keyDownHandler(keyCode) {
            switch (keyCode) {
                case 37:
                    this.decreaseRating();
                    break;
                case 39:
                    this.increaseRating();
                    break;
                default:
                    break;
            }

            return this;
        }
    }]);

    return Rating;
}(_component.Component);

},{"../component":5,"../utils":27}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SelectDropdown = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

var Utils = _interopRequireWildcard(_utils);

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

            Utils.makeElementClickable(this.dom.select, function () {
                _this4.toggleDropdown();
            });

            Utils.makeElementClickable(this.dom.shadow, function () {
                _this4.toggleDropdown();
            });

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

},{"../component":5,"../utils":27}],20:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Tabs = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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

                label.addEventListener('keydown', function (e) {
                    _this3.keyDownHandler(e.keyCode);
                });
            });

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

},{"../component":5,"../utils":27}],21:[function(require,module,exports){
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

},{"../component":5,"../utils":27}],22:[function(require,module,exports){
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

},{"../component":5,"../utils":27}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
'use strict';

var _muilessium = require('./muilessium');

var _muilessium2 = _interopRequireDefault(_muilessium);

var _utils = require('./utils');

var Utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

document.addEventListener('DOMContentLoaded', function () {
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
        paginations: window.Muilessium.create('pagination', '.mui-pagination', {}),
        radios: window.Muilessium.create('radio', '.mui-radio', {}),
        ratings: window.Muilessium.create('rating', '.mui-rating', {}),
        sdropdowns: window.Muilessium.create('select-dropdown', '.mui-select-dropdown', {}),
        tabs: window.Muilessium.create('tabs', '.mui-tabs', {}),
        tagslists: window.Muilessium.create('tags-list', '.mui-tags-list', {}),
        textareas: window.Muilessium.create('textarea', '.mui-textarea', {})
    };
});

},{"./muilessium":25,"./utils":27}],25:[function(require,module,exports){
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

},{"./components/accordion":6,"./components/breadcrumb":7,"./components/button":9,"./components/button-dropdown":8,"./components/carousel":10,"./components/checkbox":11,"./components/header-navigation":12,"./components/input":14,"./components/input-range":13,"./components/media-view":15,"./components/pagination":16,"./components/radio":17,"./components/rating":18,"./components/select-dropdown":19,"./components/tabs":20,"./components/tags-list":21,"./components/textarea":22,"./events":23,"./polyfills":26,"./utils":27}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.objectFit = exports.smoothScroll = undefined;

var _smoothscrollPolyfill = require('smoothscroll-polyfill');

var smoothScrollPolyfill = _interopRequireWildcard(_smoothscrollPolyfill);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var objectFitImages = require('object-fit-images');

function smoothScroll() {
    smoothScrollPolyfill.polyfill();
}

function objectFit() {
    objectFitImages();
}

exports.smoothScroll = smoothScroll;
exports.objectFit = objectFit;

},{"object-fit-images":3,"smoothscroll-polyfill":4}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// Custom console
// -----------------------------------------------------------------------------

var console = {

    // Log
    // ---
    // Prints message to the standart browser console

    log: function log(message) {
        window.console.log('' + message);
    },

    // Info
    // ----
    // Prints info message to the standart browser console

    info: function info(message) {
        window.console.info('[ INFO ] ' + message);
    },

    // Warning
    // -------
    // Prints warning message to the standart browser console

    warning: function warning(message) {
        window.console.warn('[ WARNING ] ' + message);
    },

    // Error
    // -----
    // Prints error message to the standart browser console

    error: function error(message) {
        window.console.error('[ ERROR ] ' + message);
    }
};

// -----------------------------------------------------------------------------
// Ajax utilities
// -----------------------------------------------------------------------------

var ajax = {

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

// -----------------------------------------------------------------------------
// WAI-ARIA utilities
// -----------------------------------------------------------------------------
// Here is some functions for operation with aria-roles and properties

var aria = {

    // Set property
    // ------------
    // Sets aria-property to the element

    set: function set(element, property) {
        var value = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

        return setAttribute(element, 'aria-' + property, value);
    },

    // Set role
    // --------
    // Sets aria-role to the element

    setRole: function setRole(element, role) {
        return setAttribute(element, 'role', role);
    },

    // Remove role
    // -----------
    // Removes aria-role from the element

    removeRole: function removeRole(element) {
        return removeAttribute(element, 'role');
    },

    // Set id
    // ------
    // Sets ID to the element (generates a random ID if ID not passed as a parameter),
    // returns this ID

    setId: function setId(element, id) {
        var newId = id || 'mui-id-' + generateRandomString(6);

        setAttribute(element, 'id', newId);

        return newId;
    },

    // Get property
    // ------------
    // Gets aria-property from the element

    get: function get(element, property) {
        return getAttribute(element, 'aria-' + property);
    },

    // Get role
    // --------
    // Gets aria-role from the element

    getRole: function getRole(element) {
        return getAttribute(element, 'role');
    },

    // Toggle state
    // ------------
    // Changes boolean state from true to false and from false to true.

    toggleState: function toggleState(element, state) {
        setAttribute(element, 'aria-' + state, !stringToBoolean(getAttribute(element, 'aria-' + state)));
    },

    // Hide icons
    // ----------
    // Sets role='presentation' to all icons with specified class name

    hideIcons: function hideIcons(className) {
        [].forEach.call(document.getElementsByClassName(className), function (icon) {
            setAttribute(icon, 'aria-hidden', true);
        });
    }
};

// -----------------------------------------------------------------------------
// Checking for html elements in page
// -----------------------------------------------------------------------------


// Is in page
// ----------
// Returns true if elements is exists in a document.body and false otherwise

function isInPage(element) {
    /* Use this instead of document.contains because IE has only partial support of Node.contains. */
    return element === document.body || document.body.contains(element);
}

// Is not in page
// --------------
// Returns false if element is exists in a document.body and true otherwise

function isNotInPage(element) {
    return !isInPage(element);
}

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
            console.warning('element does not exists');
        }

        return null;
    }
}

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
        console.warning('element is not an instance of NodeList or HTMLCollection');
    }

    return null;
}

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
}

// -----------------------------------------------------------------------------
// Manipulating with html attributes
// -----------------------------------------------------------------------------


// Set attribute
// -------------
// Sets attribute to the element if it exists

function setAttribute(element, attribute, value) {
    return ifExists(element, function () {
        return element.setAttribute(attribute, value);
    });
}

// Get attribute
// -------------
// Gets attribute from the element if it exists

function getAttribute(element, attribute) {
    return ifExists(element, function () {
        return element.getAttribute(attribute);
    });
}

// Remove attribute
// -------------
// Removes attribute from the element if it exists

function removeAttribute(element, attribute) {
    return ifExists(element, function () {
        return element.removeAttribute(attribute);
    });
}

// -----------------------------------------------------------------------------
// Manipulating CSS classes
// -----------------------------------------------------------------------------


// Has class
// ---------
// Returns true if element exists and has selected class and false otherwise

function hasClass(element, classForTest) {
    return ifExists(element, function () {
        // Use className instead of classList because IE11 does not have support for slassList on SVG
        return element.className.indexOf(classForTest) !== -1;
    });
}

// Has not class
// -------------
// Returns false if element exists and has selected class and true otherwise

function hasNotClass(element, classForTest) {
    return ifExists(element, function () {
        return !hasClass(element, classForTest);
    });
}

// Add class
// ---------
// Adds class to the element if it exists

function addClass(element, newClass) {
    return ifExists(element, function () {
        if (hasClass(element, newClass)) {
            return;
        }

        /* Use className instead of classList because IE11 does not have support for slassList on SVG */
        element.className += ' ' + newClass;
    });
}

// Remove class
// ------------
// Removes class from the element if it exists

function removeClass(element, classForRemoving) {
    return ifExists(element, function () {
        // Use className instead of classList because IE11 does not have support for slassList on SVG
        element.className = element.className.replace(classForRemoving, '');
    });
}

// Toggle class
// ------------
// Toggles class for the element if it exists

function toggleClass(element, classForToggle) {
    return ifExists(element, function () {
        if (hasNotClass(element, classForToggle)) {
            addClass(element, classForToggle);
        } else {
            removeClass(element, classForToggle);
        }
    });
}

// -----------------------------------------------------------------------------
// Manipulating with Focus & Click
// -----------------------------------------------------------------------------


// Make element focusable
// ----------------------
// Sets tabindex=0 to the element if it exists

function makeElementFocusable(element) {
    return ifExists(element, function () {
        element.tabIndex = 0;
    });
}

// Make multiple elements focusable
// --------------------------------
// Sets tabindex=0 to the multiple elements in NodeList

function makeElementsFocusable(elements) {
    return ifNodeList(elements, function () {
        [].forEach.call(elements, function (element) {
            makeElementFocusable(element);
        });
    });
}

// Make element not focusable
// --------------------------
// Sets tabindex=-1 to the element

function makeElementNotFocusable(element) {
    return ifExists(element, function () {
        element.tabIndex = -1;
    });
}

// Make multiple elements not focusable
// ------------------------------------
// Sets tabindex=-1 to the multiple elements in NodeList

function makeElementsNotFocusable(elements) {
    return ifNodeList(elements, function () {
        [].forEach.call(elements, function (element) {
            makeElementNotFocusable(element);
        });
    });
}

// Make element clickable
// ----------------------
// Sets tabindex=0 to the element and adds event listeners for the click and
// enter key press with callback to the element if it exists

function makeElementClickable(element, callback) {
    return ifExists(element, function () {
        element.tabIndex = 0;

        element.addEventListener('click', function (e) {
            e.preventDefault();
            callback();
        });

        element.addEventListener('keypress', function (e) {
            if (isEnterPressed(e)) {
                e.preventDefault();
                callback();
            }
        });
    });
}

// Make childs clickable
// ----------------------
// Sets tabindex=0 to the child elements of the selected element
// and adds event listeners for the click and enter key press
// with callback to the childs if they exists

function makeChildElementsClickable(element, childs, callback) {
    var mouseOnly = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    return ifExists(element, function () {
        return ifNodeList(childs, function () {
            element.addEventListener('click', function (e) {
                var index = -1;

                [].forEach.call(childs, function (child, i) {
                    if (child == e.target || isDescendant(child, e.target)) {
                        index = i;
                    }
                });

                if (index >= 0) {
                    e.preventDefault();
                    callback(index);
                }
            });

            if (!mouseOnly) {
                [].forEach.call(childs, function (child) {
                    child.tabIndex = 0;
                });

                element.addEventListener('keypress', function (e) {
                    if (isEnterPressed(e)) {
                        var index = [].indexOf.call(childs, e.target);

                        if (index >= 0) {
                            e.preventDefault();
                            callback(index);
                        }
                    }
                });
            }
        });
    });
}

// -----------------------------------------------------------------------------
// Scroll utilities
// -----------------------------------------------------------------------------


// Scroll to element
// -----------------
// Scrolls to the element and executes callback after scroll animation ends

function scrollTo(element, callback) {
    ifExists(element, function () {
        element.scrollIntoView({ 'behavior': 'smooth' });

        if (typeof callback === 'function') {
            setTimeout(callback, 470); /* Default scroll time in smoothscroll-polyfill is 468ms */
        }
    });
}

// Scroll to top
// -------------
// Scrolls to the top of page

function scrollToTop(callback) {
    window.scroll({ top: 0, left: 0, 'behavior': 'smooth' });

    if (typeof callback === 'function') {
        setTimeout(callback, 470); /* Default scroll time in smoothscroll-polyfill is 468ms */
    }
}

// Scrollfire
// ----------
// Executes a callback when the element becomes visible in viewport

function scrollFire(element, callback) {
    if (isInViewport(element)) {
        callback();
    } else {
        (function () {
            var modifiedCallback = callOnce(callback);

            document.addEventListener('scroll', function () {
                if (isInViewport(element)) {
                    setTimeout(modifiedCallback, 200);
                }
            });
        })();
    }
}

// -----------------------------------------------------------------------------
// Viewport utilities
// -----------------------------------------------------------------------------

// Is in viewport
// --------------
// Returns true if the element is in viewport

function isInViewport(element) {
    return ifExists(element, function () {
        var rect = element.getBoundingClientRect(),
            html = document.documentElement;

        return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || html.clientHeight) && rect.right <= (window.innerWidth || html.clientWidth);
    });
}

// -----------------------------------------------------------------------------
// Function for the Muilessium Initialization
// -----------------------------------------------------------------------------


// Normalize TabIndexes
// --------------------

function normalizeTabIndex() {
    var focusableElements = [].slice.call(document.querySelectorAll('a, button, input, label, select, textarea, object'));

    focusableElements.map(function (element) {
        element.tabIndex = 0;
    });
}

// Lazy load images
// ----------------

var imagesLoaded = require('imagesloaded');

function lazyLoadImages(callback) {
    [].forEach.call(document.querySelectorAll('._lazy-load'), function (image) {
        image.src = image.getAttribute('data-src');

        image.addEventListener('load', function () {
            addClass(this, '-loaded');
        });
    });

    if (typeof callback === 'function') {
        imagesLoaded('body', callback);
    }
}

// Init anchor links
// -----------------

function initAnchorLinks() {
    var links = document.getElementsByTagName('a');

    [].forEach.call(links, function (link) {
        var href = link.getAttribute('href');

        if (href && href[0] === '#') {
            makeElementClickable(link, function () {
                var targetElement = document.getElementById(href.substring(1));

                if (targetElement) {
                    scrollTo(targetElement, function () {
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
}

// -----------------------------------------------------------------------------
// Uncategorized utilities
// -----------------------------------------------------------------------------


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
}

// Non-standart stringify function
// -------------------------------

function stringify(object) {
    return JSON.stringify(object, function (key, value) {
        if (typeof value === 'function') {
            return 'function';
        }

        return value;
    });
}

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
}

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
}

// Check for enter key in keyboard event
// -------------------------------------

function isEnterPressed(e) {
    return e.keyCode == 13;
}

// String -> Boolean
// -----------------

function stringToBoolean(str) {
    return str === 'true';
}

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
}

// -----------------------------------------------------------------------------

exports.console = console;
exports.ajax = ajax;
exports.aria = aria;
exports.isInPage = isInPage;
exports.isNotInPage = isNotInPage;
exports.ifExists = ifExists;
exports.ifNodeList = ifNodeList;
exports.isDescendant = isDescendant;
exports.setAttribute = setAttribute;
exports.getAttribute = getAttribute;
exports.removeAttribute = removeAttribute;
exports.hasClass = hasClass;
exports.hasNotClass = hasNotClass;
exports.addClass = addClass;
exports.removeClass = removeClass;
exports.toggleClass = toggleClass;
exports.makeElementFocusable = makeElementFocusable;
exports.makeElementsFocusable = makeElementsFocusable;
exports.makeElementNotFocusable = makeElementNotFocusable;
exports.makeElementsNotFocusable = makeElementsNotFocusable;
exports.makeElementClickable = makeElementClickable;
exports.makeChildElementsClickable = makeChildElementsClickable;
exports.scrollTo = scrollTo;
exports.scrollToTop = scrollToTop;
exports.scrollFire = scrollFire;
exports.normalizeTabIndex = normalizeTabIndex;
exports.lazyLoadImages = lazyLoadImages;
exports.initAnchorLinks = initAnchorLinks;
exports.generateRandomString = generateRandomString;
exports.stringify = stringify;
exports.extend = extend;
exports.debounce = debounce;
exports.isEnterPressed = isEnterPressed;
exports.stringToBoolean = stringToBoolean;
exports.callOnce = callOnce;

},{"imagesloaded":2}]},{},[24]);
