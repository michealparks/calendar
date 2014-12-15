;document.addEventListener("DOMContentLoaded",function(window,document,Math,localStorage,screen,navigator,location,Error,undefined){
"use strict";
var gregorianBuilderService, gregorianEventService, device, mediator, router, authService, authView, gregorian, navView, calendarView, newInterpreterView, newServiceOrderView, serviceOrdersView, interpretersView, nirApp;
var DUPLO_ENV = 'dev';
var DUPLO_IN = {};
var DUPLO_VERSIONS = { 'nir': '0.1.0' };
// 
// HTML5 Placeholder Attribute Polyfill (Simple)
// 
// Author: James Brumond <james@jbrumond.me> (http://www.jbrumond.me)
// 
(function (window, document, undefined) {
  // Don't run the polyfill if it isn't needed
  if ('placeholder' in document.createElement('input')) {
    document.placeholderPolyfill = function () {
    };
    document.placeholderPolyfill.active = false;
    return;
  }
  // Fetch NodeLists of the needed element types
  var inputs = document.getElementsByTagName('input');
  var textareas = document.getElementsByTagName('textarea');
  // 
  // Define the exposed polyfill methods for manual calls
  // 
  document.placeholderPolyfill = function (elems) {
    elems = elems ? validElements(elems) : validElements(inputs, textareas);
    each(elems, polyfillElement);
  };
  // Expose whether or not the polyfill is in use (false means native support)
  document.placeholderPolyfill.active = true;
  // Run automatically
  document.placeholderPolyfill();
  // -------------------------------------------------------------
  // Use mutation events for auto-updating
  if (document.addEventListener) {
    document.addEventListener('DOMAttrModified', document.placeholderPolyfill);
    document.addEventListener('DOMNodeInserted', document.placeholderPolyfill);
  }  // Use onpropertychange for auto-updating
  else if (document.attachEvent && 'onpropertychange' in document) {
    document.attachEvent('onpropertychange', document.placeholderPolyfill);
  }  // No event-based auto-update
  else {
  }
  // -------------------------------------------------------------
  // Add some basic default styling for placeholders
  firstStylesheet().addRule('.-placeholder', 'color: #888;', 0);
  // -------------------------------------------------------------
  // 
  // Polyfill a single, specific element
  // 
  function polyfillElement(elem) {
    // If the element is already polyfilled, skip it
    if (elem.__placeholder != null) {
      // Make sure that if the placeholder is already shown, that it is at least up-to-date
      if (elem.__placeholder) {
        elem.value = getPlaceholder();
      }
      return;
    }
    // Keep track of placeholder changes so we can fire off updates correctly
    var currentPlaceholder = getPlaceholderFor(elem);
    function getPlaceholder() {
      return currentPlaceholder = getPlaceholderFor(elem);
    }
    // Is there already a value in the field? If so, don't replace it with the placeholder
    if (elem.value) {
      elem.__placeholder = false;
      if (elem.value === getPlaceholder()) {
        doShowPlaceholder();
      }
    } else {
      showPlaceholder();
    }
    // Define the events that cause these functions to be fired
    addEvent(elem, 'keyup', checkPlaceholder);
    addEvent(elem, 'keyDown', checkPlaceholder);
    addEvent(elem, 'blur', checkPlaceholder);
    addEvent(elem, 'focus', hidePlaceholder);
    addEvent(elem, 'click', hidePlaceholder);
    // Use mutation events for auto-updating
    if (elem.addEventListener) {
      addEvent(elem, 'DOMAttrModified', updatePlaceholder);
    }  // Use onpropertychange for auto-updating
    else if (elem.attachEvent && 'onpropertychange' in elem) {
      addEvent(elem, 'propertychange', updatePlaceholder);
    }  // No event-based auto-update
    else {
    }
    function updatePlaceholder() {
      // Run this asynchronously to make sure all needed updates happen before we run checks
      setTimeout(function () {
        var old = currentPlaceholder;
        var current = getPlaceholder();
        // If the placeholder attribute has changed
        if (old !== current) {
          // If the placeholder is currently shown
          if (elem.__placeholder) {
            elem.value = current;
          }
        }
        // Make sure that elem.__placeholder stays acurate, even if the placeholder or value are
        // manually changed via JavaScript
        if (elem.__placeholder && elem.value !== current) {
          elem.__placeholder = false;
        }
      }, 0);
    }
    function checkPlaceholder() {
      if (elem.value) {
        hidePlaceholder();
      } else {
        showPlaceholder();
      }
    }
    function showPlaceholder() {
      if (!elem.__placeholder && !elem.value) {
        doShowPlaceholder();
      }
    }
    function doShowPlaceholder() {
      elem.__placeholder = true;
      elem.value = getPlaceholder();
      addClass(elem, '-placeholder');
    }
    function hidePlaceholder() {
      if (elem.__placeholder) {
        elem.__placeholder = false;
        elem.value = '';
        removeClass(elem, '-placeholder');
      }
    }
  }
  // -------------------------------------------------------------
  // 
  // Build a list of valid (can have a placeholder) elements from the given parameters
  // 
  function validElements() {
    var result = [];
    each(arguments, function (arg) {
      if (typeof arg.length !== 'number') {
        arg = [arg];
      }
      result.push.apply(result, filter(arg, isValidElement));
    });
    return result;
  }
  // 
  // Check if a given element supports the placeholder attribute
  // 
  function isValidElement(elem) {
    var tag = (elem.nodeName || '').toLowerCase();
    return tag === 'textarea' || tag === 'input' && (elem.type === 'text' || elem.type === 'password');
  }
  // -------------------------------------------------------------
  function addEvent(obj, event, func) {
    if (obj.addEventListener) {
      obj.addEventListener(event, func, false);
    } else if (obj.attachEvent) {
      obj.attachEvent('on' + event, func);
    }
  }
  function removeEvent(obj, event, func) {
    if (obj.removeEventListener) {
      obj.removeEventListener(event, func, false);
    } else if (obj.detachEvent) {
      obj.detachEvent('on' + event, func);
    }
  }
  // -------------------------------------------------------------
  function each(arr, func) {
    if (arr.forEach) {
      return arr.forEach(func);
    }
    for (var i = 0, c = arr.length; i < c; i++) {
      func.call(null, arr[i], i, arr);
    }
  }
  function filter(arr, func) {
    if (arr.filter) {
      return arr.filter(func);
    }
    var result = [];
    for (var i = 0, c = arr.length; i < c; i++) {
      if (func.call(null, arr[i], i, arr)) {
        result.push(arr[i]);
      }
    }
    return result;
  }
  // -------------------------------------------------------------
  var regexCache = {};
  function classNameRegex(cn) {
    if (!regexCache[cn]) {
      regexCache[cn] = new RegExp('(^|\\s)+' + cn + '(\\s|$)+', 'g');
    }
    return regexCache[cn];
  }
  function addClass(elem, cn) {
    elem.className += ' ' + cn;
  }
  function removeClass(elem, cn) {
    elem.className = elem.className.replace(classNameRegex(cn), ' ');
  }
  // -------------------------------------------------------------
  // Internet Explorer 10 in IE7 mode was giving me the wierest error
  // where e.getAttribute('placeholder') !== e.attributes.placeholder.nodeValue
  function getPlaceholderFor(elem) {
    return elem.getAttribute('placeholder') || elem.attributes.placeholder && elem.attributes.placeholder.nodeValue;
  }
  // -------------------------------------------------------------
  // Get the first stylesheet in the document, or, if there are none, create/inject
  // one and return it.
  function firstStylesheet() {
    var sheet = document.styleSheets && document.styleSheets[0];
    if (!sheet) {
      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.appendChild(document.createTextNode(''));
      document.head.appendChild(style);
      sheet = style.sheet;
    }
    return sheet;
  }
}(window, document));
/* 
 * classList.js: Cross-browser full element.classList implementation.
 * 2014-07-23
 *
 * By Eli Grey, http://eligrey.com
 * Public Domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */
/*global self, document, DOMException */
/*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/
if ('document' in self) {
  // Full polyfill for browsers with no classList support
  if (!('classList' in document.createElement('_'))) {
    (function (view) {
      if (!('Element' in view))
        return;
      var classListProp = 'classList', protoProp = 'prototype', elemCtrProto = view.Element[protoProp], objCtr = Object, strTrim = String[protoProp].trim || function () {
          return this.replace(/^\s+|\s+$/g, '');
        }, arrIndexOf = Array[protoProp].indexOf || function (item) {
          var i = 0, len = this.length;
          for (; i < len; i++) {
            if (i in this && this[i] === item) {
              return i;
            }
          }
          return -1;
        }  // Vendors: please allow content code to instantiate DOMExceptions
, DOMEx = function (type, message) {
          this.name = type;
          this.code = DOMException[type];
          this.message = message;
        }, checkTokenAndGetIndex = function (classList, token) {
          if (token === '') {
            throw new DOMEx('SYNTAX_ERR', 'An invalid or illegal string was specified');
          }
          if (/\s/.test(token)) {
            throw new DOMEx('INVALID_CHARACTER_ERR', 'String contains an invalid character');
          }
          return arrIndexOf.call(classList, token);
        }, ClassList = function (elem) {
          var trimmedClasses = strTrim.call(elem.getAttribute('class') || ''), classes = trimmedClasses ? trimmedClasses.split(/\s+/) : [], i = 0, len = classes.length;
          for (; i < len; i++) {
            this.push(classes[i]);
          }
          this._updateClassName = function () {
            elem.setAttribute('class', this.toString());
          };
        }, classListProto = ClassList[protoProp] = [], classListGetter = function () {
          return new ClassList(this);
        };
      // Most DOMException implementations don't allow calling DOMException's toString()
      // on non-DOMExceptions. Error's toString() is sufficient here.
      DOMEx[protoProp] = Error[protoProp];
      classListProto.item = function (i) {
        return this[i] || null;
      };
      classListProto.contains = function (token) {
        token += '';
        return checkTokenAndGetIndex(this, token) !== -1;
      };
      classListProto.add = function () {
        var tokens = arguments, i = 0, l = tokens.length, token, updated = false;
        do {
          token = tokens[i] + '';
          if (checkTokenAndGetIndex(this, token) === -1) {
            this.push(token);
            updated = true;
          }
        } while (++i < l);
        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.remove = function () {
        var tokens = arguments, i = 0, l = tokens.length, token, updated = false, index;
        do {
          token = tokens[i] + '';
          index = checkTokenAndGetIndex(this, token);
          while (index !== -1) {
            this.splice(index, 1);
            updated = true;
            index = checkTokenAndGetIndex(this, token);
          }
        } while (++i < l);
        if (updated) {
          this._updateClassName();
        }
      };
      classListProto.toggle = function (token, force) {
        token += '';
        var result = this.contains(token), method = result ? force !== true && 'remove' : force !== false && 'add';
        if (method) {
          this[method](token);
        }
        if (force === true || force === false) {
          return force;
        } else {
          return !result;
        }
      };
      classListProto.toString = function () {
        return this.join(' ');
      };
      if (objCtr.defineProperty) {
        var classListPropDesc = {
          get: classListGetter,
          enumerable: true,
          configurable: true
        };
        try {
          objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
        } catch (ex) {
          // IE 8 doesn't support enumerable:true
          if (ex.number === -2146823252) {
            classListPropDesc.enumerable = false;
            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
          }
        }
      } else if (objCtr[protoProp].__defineGetter__) {
        elemCtrProto.__defineGetter__(classListProp, classListGetter);
      }
    }(self));
  } else {
    // There is full or partial native classList support, so just check if we need
    // to normalize the add/remove and toggle APIs.
    (function () {
      var testElement = document.createElement('_');
      testElement.classList.add('c1', 'c2');
      // Polyfill for IE 10/11 and Firefox <26, where classList.add and
      // classList.remove exist but support only one argument at a time.
      if (!testElement.classList.contains('c2')) {
        var createMethod = function (method) {
          var original = DOMTokenList.prototype[method];
          DOMTokenList.prototype[method] = function (token) {
            var i, len = arguments.length;
            for (i = 0; i < len; i++) {
              token = arguments[i];
              original.call(this, token);
            }
          };
        };
        createMethod('add');
        createMethod('remove');
      }
      testElement.classList.toggle('c3', false);
      // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
      // support the second argument.
      if (testElement.classList.contains('c3')) {
        var _toggle = DOMTokenList.prototype.toggle;
        DOMTokenList.prototype.toggle = function (token, force) {
          if (1 in arguments && !this.contains(token) === !force) {
            return force;
          } else {
            return _toggle.call(this, token);
          }
        };
      }
      testElement = null;
    }());
  }
}
/**
 * document.addEventListener shim
 */
(function () {
  if (!Event.prototype.preventDefault) {
    Event.prototype.preventDefault = function () {
      this.returnValue = false;
    };
  }
  if (!Event.prototype.stopPropagation) {
    Event.prototype.stopPropagation = function () {
      this.cancelBubble = true;
    };
  }
  if (!Element.prototype.addEventListener) {
    var eventListeners = [];
    var addEventListener = function (type, listener) {
      var self = this;
      var wrapper = function (e) {
        e.target = e.srcElement;
        e.currentTarget = self;
        if (listener.handleEvent) {
          listener.handleEvent(e);
        } else {
          listener.call(self, e);
        }
      };
      if (type == 'DOMContentLoaded') {
        var wrapper2 = function (e) {
          if (document.readyState == 'complete') {
            wrapper(e);
          }
        };
        document.attachEvent('onreadystatechange', wrapper2);
        eventListeners.push({
          object: this,
          type: type,
          listener: listener,
          wrapper: wrapper2
        });
        if (document.readyState == 'complete') {
          var e = new Event();
          e.srcElement = window;
          wrapper2(e);
        }
      } else {
        this.attachEvent('on' + type, wrapper);
        eventListeners.push({
          object: this,
          type: type,
          listener: listener,
          wrapper: wrapper
        });
      }
    };
    var removeEventListener = function (type, listener) {
      var counter = 0;
      while (counter < eventListeners.length) {
        var eventListener = eventListeners[counter];
        if (eventListener.object == this && eventListener.type == type && eventListener.listener == listener) {
          if (type == 'DOMContentLoaded') {
            this.detachEvent('onreadystatechange', eventListener.wrapper);
          } else {
            this.detachEvent('on' + type, eventListener.wrapper);
          }
          eventListeners.splice(counter, 1);
          break;
        }
        ++counter;
      }
    };
    Element.prototype.addEventListener = addEventListener;
    Element.prototype.removeEventListener = removeEventListener;
    if (HTMLDocument) {
      HTMLDocument.prototype.addEventListener = addEventListener;
      HTMLDocument.prototype.removeEventListener = removeEventListener;
    }
    if (Window) {
      Window.prototype.addEventListener = addEventListener;
      Window.prototype.removeEventListener = removeEventListener;
    }
  }
}());
gregorianBuilderService = function () {
  var docFrag = document.createDocumentFragment();
  function timeAxisTemplate() {
    return '<div class="col-period">12:00am</div>' + '<div class="col-period">3:00am</div>' + '<div class="col-period">6:00am</div>' + '<div class="col-period">9:00am</div>' + '<div class="col-period">12:00pm</div>' + '<div class="col-period">3:00pm</div>' + '<div class="col-period">6:00pm</div>' + '<div class="col-period">9:00pm</div>';
  }
  function rowTemplate() {
    return '<div class="col-background"></div>' + '<div class="col-background"></div>' + '<div class="col-background"></div>' + '<div class="col-background"></div>' + '<div class="col-background"></div>' + '<div class="col-background"></div>' + '<div class="col-background"></div>' + '<div class="col-background"></div>';
  }
  function eventTemplate(data) {
    var startX = timeToPosition(data.start);
    var endX = timeToPosition(data.end);
    return '<div id="' + data.id + '" class="col-event"' + 'style="background-color:' + data.color + ';left:' + startX + '%;' + ';width:' + (endX - startX) + '%;">' + data.name + '</div>';
  }
  function timeToPosition(time) {
    time.hour -= 0;
    time.minutes -= 0;
    // 180 minutes per time period. 
    // Width of each time period is 10% of the container.
    // Left offset is 20%
    return 10 * (time.hour * 60 + time.minutes) / 180 + 20;
  }
  function buildTimeAxis() {
    var row = document.createElement('div');
    row.id = 'axis-time';
    row.innerHTML = timeAxisTemplate();
    return row;
  }
  function buildRow(obj) {
    var row = document.createElement('div');
    var name = document.createElement('div');
    name.className = 'col-name';
    name.textContent = obj.interpreter.name;
    name.style.borderColor = obj.interpreter.color;
    row.className = 'row';
    row.id = obj.interpreter.name;
    row.innerHTML = rowTemplate() + buildEvents(obj.events);
    row.insertBefore(name, row.firstChild);
    return row;
  }
  function buildEvents(events) {
    var htmlString = '';
    for (var i = 0, l = events.length; i < l; i++) {
      htmlString += eventTemplate(events[i]);
    }
    return htmlString;
  }
  function main(objArray) {
    var root = document.createElement('div');
    var container = document.createElement('div');
    root.id = 'gregorian';
    container.id = 'container-row';
    for (var i = 0, l = objArray.length; i < l; i++) {
      docFrag.appendChild(buildRow(objArray[i]));
    }
    container.appendChild(docFrag);
    root.appendChild(buildTimeAxis());
    root.appendChild(container);
    return root;
  }
  return main;
}();
gregorianEventService = function () {
  var hasTouch = window.ontouchstart !== void 0;
  var ptrup = navigator.pointerEnabled !== void 0 || navigator.msPointerEnabled !== void 0 ? 'pointerup' : hasTouch ? 'touchend' : 'mouseup';
  function mapIndexToTime(i) {
    return (i - 1) * 3;
  }
  function main(calendarNode, onEventPress, onNewEventPress) {
    calendarNode.addEventListener(ptrup, function (e) {
      var node = e.target;
      var id = node.id - 0;
      var i = 0;
      if (node.className === 'col-event' && id !== 0) {
        onEventPress && onEventPress(id);
      } else if (node.className === 'col-background') {
        while ((node = node.previousSibling) !== null) {
          i++;
        }
        onNewEventPress && onNewEventPress(mapIndexToTime(i));
      }
    });
    return calendarNode;
  }
  return main;
}();
device = function () {
  var hasTouch = window['ontouchstart'] !== undefined;
  var ptrup = navigator['pointerEnabled'] !== undefined || navigator['msPointerEnabled'] !== undefined ? 'pointerup' : hasTouch ? 'touchend' : 'mouseup';
  var ptrdown = ptrup === 'pointerup' ? 'pointerdown' : hasTouch ? 'touchstart' : 'mousedown';
  var ptrmove = ptrup === 'pointerup' ? 'pointermove' : hasTouch ? 'touchmove' : 'mousemove';
  var transform = document.body.style.transform !== undefined ? 'transform' : 'webkitTransform';
  var innerHeight = 0;
  var innerWidth = 0;
  var scrollY = 0;
  var touchstartX = 0;
  var touchstartY = 0;
  var orientation = '';
  var online = true;
  function onTouchStart(e) {
    touchstartX = e.touches[0].pageX;
    touchstartY = e.touches[0].pageY;
  }
  function onWindowResize() {
    innerHeight = window.innerHeight;
    innerWidth = window.innerWidth;
  }
  function onOrientationChange() {
    orientation = window.screen.orientation;
  }
  function getScrollY() {
    scrollY = window.scrollY;
  }
  function onWindowScroll() {
    window.requestAnimationFrame(getScrollY);
  }
  window.addEventListener('resize', onWindowResize);
  window.addEventListener('orientationchange', onOrientationChange);
  window.addEventListener('scroll', onWindowScroll);
  onWindowResize();
  onOrientationChange();
  onWindowScroll();
  if (hasTouch) {
    window.addEventListener('touchstart', onTouchStart);
  }
  return {
    hasTouch: hasTouch,
    ptrup: ptrup,
    ptrdown: ptrdown,
    ptrmove: ptrmove,
    transform: transform,
    hasLocalStorage: function () {
      if (!window['localStorage']) {
        return false;
      } else {
        try {
          window.localStorage.setItem('test', 'test');
          window.localStorage.removeItem('test');
          return true;
        } catch (error) {
          return false;
        }
      }
    }(),
    touchUnmoved: function (e) {
      if (hasTouch && e.changedTouches) {
        return Math.abs(e.changedTouches[0].pageY - touchstartY) < 10 && Math.abs(e.changedTouches[0].pageX - touchstartX) < 10;
      } else {
        return true;
      }
    },
    isOnline: function (newState) {
      if (newState !== undefined) {
        online = newState;
      } else {
        return online;
      }
    },
    narrowWidth: function () {
      return innerWidth <= 700;
    },
    orientation: function () {
      return orientation;
    },
    innerHeight: function () {
      return innerHeight;
    },
    innerWidth: function () {
      return innerWidth;
    },
    scrollY: function () {
      return scrollY;
    },
    scrollBottom: function () {
      return scrollY + innerHeight;
    }
  };
}();
mediator = function () {
  var channels = {};
  function subscribe(channel, fn) {
    if (!channels[channel]) {
      channels[channel] = [];
    }
    channels[channel].push({
      context: this,
      callback: fn
    });
    return this;
  }
  function publish(channel) {
    if (!channels[channel]) {
      return this;
    }
    var args = Array.prototype.slice.call(arguments, 1);
    var subscription;
    var i = channels[channel].length;
    while (i-- > 0) {
      subscription = channels[channel][i];
      subscription.callback.apply(subscription.context, args);
    }
    return this;
  }
  return {
    publish: publish,
    subscribe: subscribe
  };
}();
router = function () {
  var routes = [];
  var mode;
  var root = '/';
  function config(options) {
    mode = options && options.mode && options.mode == 'history' && !!history.pushState ? 'history' : 'hash';
    root = options && options.root ? '/' + clearSlashes(options.root) + '/' : '/';
    return this;
  }
  function getFragment() {
    var fragment = '';
    if (mode === 'history') {
      fragment = clearSlashes(decodeURI(location.pathname + location.search));
      fragment = fragment.replace(/\?(.*)$/, '');
      fragment = root != '/' ? fragment.replace(root, '') : fragment;
    } else {
      var match = window.location.href.match(/#(.*)$/);
      fragment = match ? match[1] : '';
    }
    return clearSlashes(fragment);
  }
  function clearSlashes(path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  }
  function add(re, handler) {
    if (typeof re == 'function') {
      handler = re;
      re = '';
    }
    routes.push({
      re: re,
      handler: handler
    });
    return this;
  }
  function remove(param) {
    for (var i = 0, r; i < routes.length, r = routes[i]; i++) {
      if (r.handler === param || r.re === param) {
        routes.splice(i, 1);
        return this;
      }
    }
    return this;
  }
  function flush() {
    routes = [];
    mode = null;
    root = '/';
    return this;
  }
  function check(f) {
    var fragment = f || getFragment();
    for (var i = 0; i < routes.length; i++) {
      var match = fragment.match(routes[i].re);
      if (match) {
        match.shift();
        routes[i].handler.apply({}, match);
        return this;
      }
    }
    return this;
  }
  function navigate(path) {
    path = path ? path : '';
    if (mode === 'history') {
      history.pushState(null, null, root + clearSlashes(path));
    } else {
      window.location.href.match(/#(.*)$/);
      window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + path;
    }
    return this;
  }
  return {
    config: config,
    add: add,
    remove: remove,
    flush: flush,
    check: check,
    navigate: navigate
  };
}();
authService = function (mediator) {
  function login(data) {
  }
  function onLoginDone(obj) {
  }
  function checkLogged(done) {
    // todo
    done(true);
  }
  function getInterpreters() {
    // todo
    onGetInterpretersDone(window.testJSON);
  }
  function onGetInterpretersDone(obj) {
    mediator.publish('data-interpreters', obj);
  }
  function getServiceOrders() {
    // todo
    onGetServiceOrdersDone(window.testOrders);
  }
  function onGetServiceOrdersDone(obj) {
    mediator.publish('data-service-orders', obj);
  }
  function getInterpreter(id) {
    // todo
    onGetInterpreterDone(window.testInterpreter);
  }
  function onGetInterpreterDone(obj) {
    mediator.publish('data-interpreter', obj);
  }
  function getServiceOrder(id) {
    // todo
    onGetServiceOrderDone(window.testServiceOrder);
  }
  function onGetServiceOrderDone(obj) {
    mediator.publish('data-service-order');
  }
  function deleteInterpreter(id) {
  }
  function onDeleteInterpreterDone(id) {
  }
  function deleteServiceOrder(id) {
  }
  function onDeleteServiceOrderDone(id) {
  }
  return {
    login: login,
    checkLogged: checkLogged,
    getInterpreters: getInterpreters,
    getServiceOrders: getServiceOrders,
    getInterpreter: getInterpreter,
    getServiceOrder: getServiceOrder,
    deleteInterpreter: deleteInterpreter,
    deleteServiceOrder: deleteServiceOrder
  };
}(mediator);
authView = function (device, router) {
  var appRoot = document.getElementById('app-nir');
  var rootNode = document.getElementById('view-auth');
  rootNode.getElementsByClassName('btn-submit')[0].addEventListener(device.ptrup, onSubmitPress);
  function onSubmitPress() {
    var inputs = rootNode.getElementsByTagName('input');
    // TODO login
    appRoot.classList.add('state-logged');
    router.navigate('calendar').check();
  }
}(device, router);
gregorian = function (builderService, eventService) {
  function api(containerNode, objArray, onEventPress, onNewEventPress) {
    var calendar = eventService(builderService(objArray), onEventPress, onNewEventPress);
    containerNode.appendChild(calendar);
    containerNode.style.overflow = 'hidden';
    return calendar;
  }
  return api;
}(gregorianBuilderService, gregorianEventService);
navView = function (device, router) {
  var appRoot = document.getElementById('app-nir');
  var rootNode = document.getElementById('view-nav');
  rootNode.getElementsByClassName('logout')[0].addEventListener(device.ptrup, onLogoutPress);
  void function init() {
    var navBtns = rootNode.getElementsByClassName('btn-nav');
    var i = navBtns.length;
    while (i-- > 0) {
      navBtns[i].addEventListener(device.ptrup, onNavBtnPress);
    }
  }();
  function onNavBtnPress() {
    router.navigate(this.classList[2]).check();
  }
  function onLogoutPress() {
    // todo logout
    appRoot.classList.remove('state-logged');
    router.navigate('login').check();
  }
}(device, router);
calendarView = function (mediator, gregorian) {
  var rootNode = document.getElementById('view-calendar');
  var calenderContainer = rootNode.getElementsByClassName('container-calendar')[0];
  var inputFilter = rootNode.getElementsByClassName('input-filter')[0];
  inputFilter.addEventListener('keyup', filterData);
  mediator.subscribe('data-interpreters', onGetDataDone);
  function filterData(e) {
    var val = this.value;
    var nodes = calenderContainer.getElementsByClassName('row');
    var i = nodes.length;
    while (i-- > 0) {
      if (nodes[i].id.toLowerCase().indexOf(val.toLowerCase()) === -1) {
        nodes[i].classList.add('state-hidden');
      } else {
        nodes[i].classList.remove('state-hidden');
      }
    }
  }
  function onEventPress(id) {
    authService.getServiceOrder(id);
  }
  function onNewEventPress(id) {
    router.navigate('new-service-order').check();
  }
  function onGetDataDone(obj) {
    calenderContainer.innerHTML = '';
    gregorian(calenderContainer, obj, onEventPress, onNewEventPress);
  }
}(mediator, gregorian);
newInterpreterView = function (router, mediator, authService) {
  mediator.subscribe('data-interpreter', onGetDataDone);
  function onGetDataDone(obj) {
  }
  function getForm(id) {
    authService.getInterpreter(id);
    router.navigate('new-interpreter').check();
  }
  return { getForm: getForm };
}(router, mediator, authService);
newServiceOrderView = function (router, mediator, authService) {
  mediator.subscribe('data-service-order', onGetDataDone);
  function onGetDataDone(obj) {
  }
  function getForm(id) {
    authService.getServiceOrder(id);
    router.navigate('new-service-order').check();
  }
  return { getForm: getForm };
}(router, mediator, authService);
serviceOrdersView = function (mediator, device, router, newServiceOrderView) {
  var docFrag = document.createDocumentFragment();
  var rootNode = document.getElementById('view-service-orders');
  var serviceOrdersContainer = rootNode.getElementsByClassName('container-service-orders')[0];
  var inputFilter = rootNode.getElementsByClassName('input-filter')[0];
  rootNode.getElementsByClassName('btn-add')[0].addEventListener(device.ptrup, function () {
    router.navigate('new-service-order').check();
  });
  inputFilter.addEventListener('keyup', filterData);
  serviceOrdersContainer.addEventListener(device.ptrup, onServiceOrderPress);
  mediator.subscribe('data-service-orders', onGetDataDone);
  function onServiceOrderPress(e) {
    if (e.target.classList.contains('btn-edit')) {
      newServiceOrderView.getForm(e.target.id);
    } else if (e.target.classList.contains('btn-delete')) {
      authService.deleteServiceOrder(e.target.id);
    }
  }
  function filterData(e) {
    var val = this.value;
    var nodes = serviceOrdersContainer.getElementsByClassName('row');
    var i = nodes.length;
    while (i-- > 0) {
      if (nodes[i].id.toLowerCase().indexOf(val.toLowerCase()) === -1) {
        nodes[i].classList.add('state-hidden');
      } else {
        nodes[i].classList.remove('state-hidden');
      }
    }
  }
  function concatData(data) {
    return data.company + ' ' + data.interpreter + ' ' + data.client + ' ' + data.startTime + ' ' + data.endTime + ' ' + data.startDate + ' ' + data.endDate;
  }
  function serviceOrderTemplate(data) {
    return '<span class="text">' + data.company + '</span>' + '<span class="text">' + data.interpreter + '</span>' + '<span class="text">' + data.client + '</span>' + '<span class="text">' + data.startTime + '</span>' + '<span class="text">' + data.endTime + '</span>' + '<span class="text">' + data.startDate + '</span>' + '<span class="text">' + data.endDate + '</span>' + '<span id="' + data.id + '" class="btn-delete icon-trash"></span>' + '<span id="' + data.id + '" class="btn-edit icon-edit"></span>';
  }
  function onGetDataDone(obj) {
    var serviceOrderNode;
    for (var i = 0, l = obj.length; i < l; i++) {
      serviceOrderNode = document.createElement('span');
      serviceOrderNode.className = 'row service-order ';
      serviceOrderNode.id = concatData(obj[i]);
      serviceOrderNode.innerHTML = serviceOrderTemplate(obj[i]);
      docFrag.appendChild(serviceOrderNode);
    }
    serviceOrdersContainer.innerHTML = '';
    serviceOrdersContainer.appendChild(docFrag);
  }
  return {};
}(mediator, device, router, newServiceOrderView);
interpretersView = function (mediator, device, router, authService, newInterpreterView) {
  var docFrag = document.createDocumentFragment();
  var rootNode = document.getElementById('view-interpreters');
  var interpretersContainer = rootNode.getElementsByClassName('container-interpreters')[0];
  var inputFilter = rootNode.getElementsByClassName('input-filter')[0];
  rootNode.getElementsByClassName('btn-add')[0].addEventListener(device.ptrup, function () {
    router.navigate('new-interpreter').check();
  });
  inputFilter.addEventListener('keyup', filterData);
  interpretersContainer.addEventListener(device.ptrup, onInterpeterPress);
  mediator.subscribe('data-interpreters', onGetDataDone);
  function onInterpeterPress(e) {
    if (e.target.classList.contains('btn-edit')) {
      newInterpreterView.getForm(e.target.id);
    } else if (e.target.classList.contains('btn-delete')) {
      authService.deleteInterpreter(e.target.id);
    }
  }
  function filterData(e) {
    var val = this.value;
    var nodes = interpretersContainer.getElementsByClassName('row');
    var i = nodes.length;
    while (i-- > 0) {
      if (nodes[i].id.toLowerCase().indexOf(val.toLowerCase()) === -1) {
        nodes[i].classList.add('state-hidden');
      } else {
        nodes[i].classList.remove('state-hidden');
      }
    }
  }
  function interpreterTemplate(data) {
    var name = data.name.split(' ');
    return '<span class="color" style="background-color:' + data.color + '"></span>' + '<span class="text">' + name[0] + '</span>' + '<span class="text">' + name[1] + '</span>' + '<span id="' + data.id + '" class="btn-delete icon-trash"></span>' + '<span id="' + data.id + '" class="btn-edit icon-edit"></span>';
  }
  function onGetDataDone(obj) {
    var interpreterNode;
    for (var i = 0, l = obj.length; i < l; i++) {
      interpreterNode = document.createElement('div');
      interpreterNode.className = 'row interpreter ';
      interpreterNode.id = obj[i].interpreter.name;
      interpreterNode.innerHTML = interpreterTemplate(obj[i].interpreter);
      docFrag.appendChild(interpreterNode);
    }
    interpretersContainer.innerHTML = '';
    interpretersContainer.appendChild(docFrag);
  }
}(mediator, device, router, authService, newInterpreterView);
nirApp = function (router, mediator, authView, authService, calendarView, interpretersView, serviceOrdersView, newInterpreterView, newServiceOrderView) {
  var rootNode = document.getElementById('app-nir');
  var curView;
  var correctPaths = /login|calendar|interpreters|service-orders|new-interpreter|new-service-order/;
  router.config({ mode: 'history' }).add(onNavigation).navigate(getPath()).check();
  window.onpopstate = function () {
    console.log(getPath());
    router.navigate(getPath()).check();
  };
  authService.checkLogged(function (isLogged) {
    if (isLogged) {
      rootNode.classList.add('state-logged');
    } else {
      router.navigate('login').check();
    }
  });
  rootNode.classList.remove('state-loading');
  function onNavigation() {
    var nextView = getPath();
    if (!correctPaths.test(nextView)) {
      return router.navigate('calendar').check();
    }
    if (/calendar|interpreters/.test(nextView) && !/calendar|interpreters/.test(curView)) {
      authService.getInterpreters();
    }
    if (/service-orders/.test(nextView)) {
      authService.getServiceOrders();
    }
    // 2nd param specifies "arriving or not"
    mediator.publish('navigate-' + nextView, true).publish('navigate-' + curView, false);
    rootNode.classList.remove('state-view-' + curView);
    rootNode.classList.add('state-view-' + nextView);
    curView = nextView;
  }
  function getPath() {
    return window.location.pathname.slice(1);
  }
}(router, mediator, authView, authService, calendarView, interpretersView, serviceOrdersView, newInterpreterView, newServiceOrderView);
}(window,document,Math,localStorage,screen,navigator,location,Error));
