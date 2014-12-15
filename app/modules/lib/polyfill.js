// 
// HTML5 Placeholder Attribute Polyfill (Simple)
// 
// Author: James Brumond <james@jbrumond.me> (http://www.jbrumond.me)
// 

(function(window, document, undefined) {

  // Don't run the polyfill if it isn't needed
  if ('placeholder' in document.createElement('input')) {
    document.placeholderPolyfill = function() { /*  no-op */ };
    document.placeholderPolyfill.active = false;
    return;
  }

  // Fetch NodeLists of the needed element types
  var inputs = document.getElementsByTagName('input');
  var textareas = document.getElementsByTagName('textarea');

  // 
  // Define the exposed polyfill methods for manual calls
  // 
  document.placeholderPolyfill = function(elems) {
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
  }
  
  // Use onpropertychange for auto-updating
  else if (document.attachEvent && 'onpropertychange' in document) {
    document.attachEvent('onpropertychange', document.placeholderPolyfill);
  }
  
  // No event-based auto-update
  else {
    // pass
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
    addEvent(elem, 'keyup',    checkPlaceholder);
    addEvent(elem, 'keyDown',  checkPlaceholder);
    addEvent(elem, 'blur',     checkPlaceholder);
    addEvent(elem, 'focus',    hidePlaceholder);
    addEvent(elem, 'click',    hidePlaceholder);

    // Use mutation events for auto-updating
    if (elem.addEventListener) {
      addEvent(elem, 'DOMAttrModified', updatePlaceholder);
    }
    
    // Use onpropertychange for auto-updating
    else if (elem.attachEvent && 'onpropertychange' in elem) {
      addEvent(elem, 'propertychange', updatePlaceholder);
    }
  
    // No event-based auto-update
    else {
      // pass
    }

    function updatePlaceholder() {
      // Run this asynchronously to make sure all needed updates happen before we run checks
      setTimeout(function() {
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
      if (! elem.__placeholder && ! elem.value) {
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
    var result = [ ];

    each(arguments, function(arg) {
      if (typeof arg.length !== 'number') {
        arg = [ arg ];
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
    return (tag === 'textarea' || (tag === 'input' && (elem.type === 'text' || elem.type === 'password')));
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

    var result = [ ];
    for (var i = 0, c = arr.length; i < c; i++) {
      if (func.call(null, arr[i], i, arr)) {
        result.push(arr[i]);
      }
    }

    return result;
  }

// -------------------------------------------------------------

  var regexCache = { };
  function classNameRegex(cn) {
    if (! regexCache[cn]) {
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
    return elem.getAttribute('placeholder') || (elem.attributes.placeholder && elem.attributes.placeholder.nodeValue);
  }

// -------------------------------------------------------------

  // Get the first stylesheet in the document, or, if there are none, create/inject
  // one and return it.
  function firstStylesheet() {
    var sheet = document.styleSheets && document.styleSheets[0];
    if (! sheet) {
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

if ("document" in self) {

// Full polyfill for browsers with no classList support
if (!("classList" in document.createElement("_"))) {

(function (view) {

if (!('Element' in view)) return;

var
    classListProp = "classList"
  , protoProp = "prototype"
  , elemCtrProto = view.Element[protoProp]
  , objCtr = Object
  , strTrim = String[protoProp].trim || function () {
    return this.replace(/^\s+|\s+$/g, "");
  }
  , arrIndexOf = Array[protoProp].indexOf || function (item) {
    var
        i = 0
      , len = this.length
    ;
    for (; i < len; i++) {
      if (i in this && this[i] === item) {
        return i;
      }
    }
    return -1;
  }
  // Vendors: please allow content code to instantiate DOMExceptions
  , DOMEx = function (type, message) {
    this.name = type;
    this.code = DOMException[type];
    this.message = message;
  }
  , checkTokenAndGetIndex = function (classList, token) {
    if (token === "") {
      throw new DOMEx(
          "SYNTAX_ERR"
        , "An invalid or illegal string was specified"
      );
    }
    if (/\s/.test(token)) {
      throw new DOMEx(
          "INVALID_CHARACTER_ERR"
        , "String contains an invalid character"
      );
    }
    return arrIndexOf.call(classList, token);
  }
  , ClassList = function (elem) {
    var
        trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
      , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
      , i = 0
      , len = classes.length
    ;
    for (; i < len; i++) {
      this.push(classes[i]);
    }
    this._updateClassName = function () {
      elem.setAttribute("class", this.toString());
    };
  }
  , classListProto = ClassList[protoProp] = []
  , classListGetter = function () {
    return new ClassList(this);
  }
;
// Most DOMException implementations don't allow calling DOMException's toString()
// on non-DOMExceptions. Error's toString() is sufficient here.
DOMEx[protoProp] = Error[protoProp];
classListProto.item = function (i) {
  return this[i] || null;
};
classListProto.contains = function (token) {
  token += "";
  return checkTokenAndGetIndex(this, token) !== -1;
};
classListProto.add = function () {
  var
      tokens = arguments
    , i = 0
    , l = tokens.length
    , token
    , updated = false
  ;
  do {
    token = tokens[i] + "";
    if (checkTokenAndGetIndex(this, token) === -1) {
      this.push(token);
      updated = true;
    }
  }
  while (++i < l);

  if (updated) {
    this._updateClassName();
  }
};
classListProto.remove = function () {
  var
      tokens = arguments
    , i = 0
    , l = tokens.length
    , token
    , updated = false
    , index
  ;
  do {
    token = tokens[i] + "";
    index = checkTokenAndGetIndex(this, token);
    while (index !== -1) {
      this.splice(index, 1);
      updated = true;
      index = checkTokenAndGetIndex(this, token);
    }
  }
  while (++i < l);

  if (updated) {
    this._updateClassName();
  }
};
classListProto.toggle = function (token, force) {
  token += "";

  var
      result = this.contains(token)
    , method = result ?
      force !== true && "remove"
    :
      force !== false && "add"
  ;

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
  return this.join(" ");
};

if (objCtr.defineProperty) {
  var classListPropDesc = {
      get: classListGetter
    , enumerable: true
    , configurable: true
  };
  try {
    objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
  } catch (ex) { // IE 8 doesn't support enumerable:true
    if (ex.number === -0x7FF5EC54) {
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

  var testElement = document.createElement("_");

  testElement.classList.add("c1", "c2");

  // Polyfill for IE 10/11 and Firefox <26, where classList.add and
  // classList.remove exist but support only one argument at a time.
  if (!testElement.classList.contains("c2")) {
    var createMethod = function(method) {
      var original = DOMTokenList.prototype[method];

      DOMTokenList.prototype[method] = function(token) {
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

  testElement.classList.toggle("c3", false);

  // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
  // support the second argument.
  if (testElement.classList.contains("c3")) {
    var _toggle = DOMTokenList.prototype.toggle;

    DOMTokenList.prototype.toggle = function(token, force) {
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

(function() {
  if (!Event.prototype.preventDefault) {
    Event.prototype.preventDefault=function() {
      this.returnValue=false;
    };
  }
  if (!Event.prototype.stopPropagation) {
    Event.prototype.stopPropagation=function() {
      this.cancelBubble=true;
    };
  }
  if (!Element.prototype.addEventListener) {
    var eventListeners=[];
    
    var addEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var self=this;
      var wrapper=function(e) {
        e.target=e.srcElement;
        e.currentTarget=self;
        if (listener.handleEvent) {
          listener.handleEvent(e);
        } else {
          listener.call(self,e);
        }
      };
      if (type=="DOMContentLoaded") {
        var wrapper2=function(e) {
          if (document.readyState=="complete") {
            wrapper(e);
          }
        };
        document.attachEvent("onreadystatechange",wrapper2);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper2});
        
        if (document.readyState=="complete") {
          var e=new Event();
          e.srcElement=window;
          wrapper2(e);
        }
      } else {
        this.attachEvent("on"+type,wrapper);
        eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
      }
    };
    var removeEventListener=function(type,listener /*, useCapture (will be ignored) */) {
      var counter=0;
      while (counter<eventListeners.length) {
        var eventListener=eventListeners[counter];
        if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
          if (type=="DOMContentLoaded") {
            this.detachEvent("onreadystatechange",eventListener.wrapper);
          } else {
            this.detachEvent("on"+type,eventListener.wrapper);
          }
          eventListeners.splice(counter, 1);
          break;
        }
        ++counter;
      }
    };
    Element.prototype.addEventListener=addEventListener;
    Element.prototype.removeEventListener=removeEventListener;
    if (HTMLDocument) {
      HTMLDocument.prototype.addEventListener=addEventListener;
      HTMLDocument.prototype.removeEventListener=removeEventListener;
    }
    if (Window) {
      Window.prototype.addEventListener=addEventListener;
      Window.prototype.removeEventListener=removeEventListener;
    }
  }
})();