/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./template.html":
/*!***********************!*\
  !*** ./template.html ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// Module
var code = "<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->\n<div class=\"guic-toast\">\n    <div class=\"guic-toast-message\">\n        <component-slot data-name=\"message\"></component-slot>\n    </div>\n    <div class=\"guic-toast-close-btn\">\n        <component-slot data-name=\"close-btn\"></component-slot>\n    </div>\n</div>";
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (code);

/***/ }),

/***/ "./node_modules/postmessage-polyfill/postmessage.js":
/*!**********************************************************!*\
  !*** ./node_modules/postmessage-polyfill/postmessage.js ***!
  \**********************************************************/
/***/ (function() {

/**
 The MIT License

 Copyright (c) 2010 Daniel Park (http://metaweb.com, http://postmessage.freebaseapps.com)

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 **/
var NO_JQUERY = {};
(function(window, $, undefined) {

     if (!("console" in window)) {
         var c = window.console = {};
         c.log = c.warn = c.error = c.debug = function(){};
     }

     if ($ === NO_JQUERY) {
         // jQuery is optional
         $ = {
             fn: {},
             extend: function() {
                 var a = arguments[0];
                 for (var i=1,len=arguments.length; i<len; i++) {
                     var b = arguments[i];
                     for (var prop in b) {
                         a[prop] = b[prop];
                     }
                 }
                 return a;
             }
         };
     }

     $.fn.pm = function() {
         console.log("usage: \nto send:    $.pm(options)\nto receive: $.pm.bind(type, fn, [origin])");
         return this;
     };

     // send postmessage
     $.pm = window.pm = function(options) {
         pm.send(options);
     };

     // bind postmessage handler
     $.pm.bind = window.pm.bind = function(type, fn, origin, hash, async_reply) {
         pm.bind(type, fn, origin, hash, async_reply === true);
     };

     // unbind postmessage handler
     $.pm.unbind = window.pm.unbind = function(type, fn) {
         pm.unbind(type, fn);
     };

     // default postmessage origin on bind
     $.pm.origin = window.pm.origin = null;

     // default postmessage polling if using location hash to pass postmessages
     $.pm.poll = window.pm.poll = 200;

     var pm = {

         send: function(options) {
             var o = $.extend({}, pm.defaults, options),
             target = o.target;
             if (!o.target) {
                 console.warn("postmessage target window required");
                 return;
             }
             if (!o.type) {
                 console.warn("postmessage type required");
                 return;
             }
             var msg = {data:o.data, type:o.type};
             if (o.success) {
                 msg.callback = pm._callback(o.success);
             }
             if (o.error) {
                 msg.errback = pm._callback(o.error);
             }
             if (("postMessage" in target) && !o.hash) {
                 pm._bind();
                 target.postMessage(JSON.stringify(msg), o.origin || '*');
             }
             else {
                 pm.hash._bind();
                 pm.hash.send(o, msg);
             }
         },

         bind: function(type, fn, origin, hash, async_reply) {
           pm._replyBind ( type, fn, origin, hash, async_reply );
         },
       
         _replyBind: function(type, fn, origin, hash, isCallback) {
           if (("postMessage" in window) && !hash) {
               pm._bind();
           }
           else {
               pm.hash._bind();
           }
           var l = pm.data("listeners.postmessage");
           if (!l) {
               l = {};
               pm.data("listeners.postmessage", l);
           }
           var fns = l[type];
           if (!fns) {
               fns = [];
               l[type] = fns;
           }
           fns.push({fn:fn, callback: isCallback, origin:origin || $.pm.origin});
         },

         unbind: function(type, fn) {
             var l = pm.data("listeners.postmessage");
             if (l) {
                 if (type) {
                     if (fn) {
                         // remove specific listener
                         var fns = l[type];
                         if (fns) {
                             var m = [];
                             for (var i=0,len=fns.length; i<len; i++) {
                                 var o = fns[i];
                                 if (o.fn !== fn) {
                                     m.push(o);
                                 }
                             }
                             l[type] = m;
                         }
                     }
                     else {
                         // remove all listeners by type
                         delete l[type];
                     }
                 }
                 else {
                     // unbind all listeners of all type
                     for (var i in l) {
                       delete l[i];
                     }
                 }
             }
         },

         data: function(k, v) {
             if (v === undefined) {
                 return pm._data[k];
             }
             pm._data[k] = v;
             return v;
         },

         _data: {},

         _CHARS: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),

         _random: function() {
             var r = [];
             for (var i=0; i<32; i++) {
                 r[i] = pm._CHARS[0 | Math.random() * 32];
             };
             return r.join("");
         },

         _callback: function(fn) {
             var cbs = pm.data("callbacks.postmessage");
             if (!cbs) {
                 cbs = {};
                 pm.data("callbacks.postmessage", cbs);
             }
             var r = pm._random();
             cbs[r] = fn;
             return r;
         },

         _bind: function() {
             // are we already listening to message events on this w?
             if (!pm.data("listening.postmessage")) {
                 if (window.addEventListener) {
                     window.addEventListener("message", pm._dispatch, false);
                 }
                 else if (window.attachEvent) {
                     window.attachEvent("onmessage", pm._dispatch);
                 }
                 pm.data("listening.postmessage", 1);
             }
         },

         _dispatch: function(e) {
             //console.log("$.pm.dispatch", e, this);
             try {
                 var msg = JSON.parse(e.data);
             }
             catch (ex) {
                 console.warn("postmessage data invalid json: ", ex);
                 return;
             }
             if (!msg.type) {
                 console.warn("postmessage message type required");
                 return;
             }
             var cbs = pm.data("callbacks.postmessage") || {},
             cb = cbs[msg.type];
             if (cb) {
                 cb(msg.data);
             }
             else {
                 var l = pm.data("listeners.postmessage") || {};
                 var fns = l[msg.type] || [];
                 for (var i=0,len=fns.length; i<len; i++) {
                     var o = fns[i];
                     if (o.origin && o.origin !== '*' && e.origin !== o.origin) {
                         console.warn("postmessage message origin mismatch", e.origin, o.origin);
                         if (msg.errback) {
                             // notify post message errback
                             var error = {
                                 message: "postmessage origin mismatch",
                                 origin: [e.origin, o.origin]
                             };
                             pm.send({target:e.source, data:error, type:msg.errback});
                         }
                         continue;
                     }

                     function sendReply ( data ) {
                       if (msg.callback) {
                           pm.send({target:e.source, data:data, type:msg.callback});
                       }
                     }
                     
                     try {
                         if ( o.callback ) {
                           o.fn(msg.data, sendReply, e);
                         } else {
                           sendReply ( o.fn(msg.data, e) );
                         }
                     }
                     catch (ex) {
                         if (msg.errback) {
                             // notify post message errback
                             pm.send({target:e.source, data:ex, type:msg.errback});
                         } else {
                             throw ex;
                         }
                     }
                 };
             }
         }
     };

     // location hash polling
     pm.hash = {

         send: function(options, msg) {
             //console.log("hash.send", target_window, options, msg);
             var target_window = options.target,
             target_url = options.url;
             if (!target_url) {
                 console.warn("postmessage target window url is required");
                 return;
             }
             target_url = pm.hash._url(target_url);
             var source_window,
             source_url = pm.hash._url(window.location.href);
             if (window == target_window.parent) {
                 source_window = "parent";
             }
             else {
                 try {
                     for (var i=0,len=parent.frames.length; i<len; i++) {
                         var f = parent.frames[i];
                         if (f == window) {
                             source_window = i;
                             break;
                         }
                     };
                 }
                 catch(ex) {
                     // Opera: security error trying to access parent.frames x-origin
                     // juse use window.name
                     source_window = window.name;
                 }
             }
             if (source_window == null) {
                 console.warn("postmessage windows must be direct parent/child windows and the child must be available through the parent window.frames list");
                 return;
             }
             var hashmessage = {
                 "x-requested-with": "postmessage",
                 source: {
                     name: source_window,
                     url: source_url
                 },
                 postmessage: msg
             };
             var hash_id = "#x-postmessage-id=" + pm._random();
             target_window.location = target_url + hash_id + encodeURIComponent(JSON.stringify(hashmessage));
         },

         _regex: /^\#x\-postmessage\-id\=(\w{32})/,

         _regex_len: "#x-postmessage-id=".length + 32,

         _bind: function() {
             // are we already listening to message events on this w?
             if (!pm.data("polling.postmessage")) {
                 setInterval(function() {
                                 var hash = "" + window.location.hash,
                                 m = pm.hash._regex.exec(hash);
                                 if (m) {
                                     var id = m[1];
                                     if (pm.hash._last !== id) {
                                         pm.hash._last = id;
                                         pm.hash._dispatch(hash.substring(pm.hash._regex_len));
                                     }
                                 }
                             }, $.pm.poll || 200);
                 pm.data("polling.postmessage", 1);
             }
         },

         _dispatch: function(hash) {
             if (!hash) {
                 return;
             }
             try {
                 hash = JSON.parse(decodeURIComponent(hash));
                 if (!(hash['x-requested-with'] === 'postmessage' &&
                       hash.source && hash.source.name != null && hash.source.url && hash.postmessage)) {
                     // ignore since hash could've come from somewhere else
                     return;
                 }
             }
             catch (ex) {
                 // ignore since hash could've come from somewhere else
                 return;
             }
             var msg = hash.postmessage,
             cbs = pm.data("callbacks.postmessage") || {},
             cb = cbs[msg.type];
             if (cb) {
                 cb(msg.data);
             }
             else {
                 var source_window;
                 if (hash.source.name === "parent") {
                     source_window = window.parent;
                 }
                 else {
                     source_window = window.frames[hash.source.name];
                 }
                 var l = pm.data("listeners.postmessage") || {};
                 var fns = l[msg.type] || [];
                 for (var i=0,len=fns.length; i<len; i++) {
                     var o = fns[i];
                     if (o.origin) {
                         var origin = /https?\:\/\/[^\/]*/.exec(hash.source.url)[0];
                         if (o.origin !== '*' && origin !== o.origin) {
                             console.warn("postmessage message origin mismatch", origin, o.origin);
                             if (msg.errback) {
                                 // notify post message errback
                                 var error = {
                                     message: "postmessage origin mismatch",
                                     origin: [origin, o.origin]
                                 };
                                 pm.send({target:source_window, data:error, type:msg.errback, hash:true, url:hash.source.url});
                             }
                             continue;
                         }
                     }

                     function sendReply ( data ) {
                       if (msg.callback) {
                         pm.send({target:source_window, data:data, type:msg.callback, hash:true, url:hash.source.url});
                       }
                     }
                     
                     try {
                         if ( o.callback ) {
                           o.fn(msg.data, sendReply);
                         } else {
                           sendReply ( o.fn(msg.data) );
                         }
                     }
                     catch (ex) {
                         if (msg.errback) {
                             // notify post message errback
                             pm.send({target:source_window, data:ex, type:msg.errback, hash:true, url:hash.source.url});
                         } else {
                             throw ex;
                         }
                     }
                 };
             }
         },

         _url: function(url) {
             // url minus hash part
             return (""+url).replace(/#.*$/, "");
         }

     };

     $.extend(pm, {
                  defaults: {
                      target: null,  /* target window (required) */
                      url: null,     /* target window url (required if no window.postMessage or hash == true) */
                      type: null,    /* message type (required) */
                      data: null,    /* message data (required) */
                      success: null, /* success callback (optional) */
                      error: null,   /* error callback (optional) */
                      origin: "*",   /* postmessage origin (optional) */
                      hash: false    /* use location hash for message passing (optional) */
                  }
              });

 })(this, typeof jQuery === "undefined" ? NO_JQUERY : jQuery);

/**
 * http://www.JSON.org/json2.js
 **/
if (! ("JSON" in window && window.JSON)){JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z"};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());


/***/ }),

/***/ "./node_modules/whatwg-fetch/fetch.js":
/*!********************************************!*\
  !*** ./node_modules/whatwg-fetch/fetch.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DOMException": () => (/* binding */ DOMException),
/* harmony export */   "Headers": () => (/* binding */ Headers),
/* harmony export */   "Request": () => (/* binding */ Request),
/* harmony export */   "Response": () => (/* binding */ Response),
/* harmony export */   "fetch": () => (/* binding */ fetch)
/* harmony export */ });
var global =
  (typeof globalThis !== 'undefined' && globalThis) ||
  (typeof self !== 'undefined' && self) ||
  (typeof global !== 'undefined' && global)

var support = {
  searchParams: 'URLSearchParams' in global,
  iterable: 'Symbol' in global && 'iterator' in Symbol,
  blob:
    'FileReader' in global &&
    'Blob' in global &&
    (function() {
      try {
        new Blob()
        return true
      } catch (e) {
        return false
      }
    })(),
  formData: 'FormData' in global,
  arrayBuffer: 'ArrayBuffer' in global
}

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj)
}

if (support.arrayBuffer) {
  var viewClasses = [
    '[object Int8Array]',
    '[object Uint8Array]',
    '[object Uint8ClampedArray]',
    '[object Int16Array]',
    '[object Uint16Array]',
    '[object Int32Array]',
    '[object Uint32Array]',
    '[object Float32Array]',
    '[object Float64Array]'
  ]

  var isArrayBufferView =
    ArrayBuffer.isView ||
    function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
}

function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name)
  }
  if (/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(name) || name === '') {
    throw new TypeError('Invalid character in header field name')
  }
  return name.toLowerCase()
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value)
  }
  return value
}

// Build a destructive iterator for the value list
function iteratorFor(items) {
  var iterator = {
    next: function() {
      var value = items.shift()
      return {done: value === undefined, value: value}
    }
  }

  if (support.iterable) {
    iterator[Symbol.iterator] = function() {
      return iterator
    }
  }

  return iterator
}

function Headers(headers) {
  this.map = {}

  if (headers instanceof Headers) {
    headers.forEach(function(value, name) {
      this.append(name, value)
    }, this)
  } else if (Array.isArray(headers)) {
    headers.forEach(function(header) {
      this.append(header[0], header[1])
    }, this)
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function(name) {
      this.append(name, headers[name])
    }, this)
  }
}

Headers.prototype.append = function(name, value) {
  name = normalizeName(name)
  value = normalizeValue(value)
  var oldValue = this.map[name]
  this.map[name] = oldValue ? oldValue + ', ' + value : value
}

Headers.prototype['delete'] = function(name) {
  delete this.map[normalizeName(name)]
}

Headers.prototype.get = function(name) {
  name = normalizeName(name)
  return this.has(name) ? this.map[name] : null
}

Headers.prototype.has = function(name) {
  return this.map.hasOwnProperty(normalizeName(name))
}

Headers.prototype.set = function(name, value) {
  this.map[normalizeName(name)] = normalizeValue(value)
}

Headers.prototype.forEach = function(callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this)
    }
  }
}

Headers.prototype.keys = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push(name)
  })
  return iteratorFor(items)
}

Headers.prototype.values = function() {
  var items = []
  this.forEach(function(value) {
    items.push(value)
  })
  return iteratorFor(items)
}

Headers.prototype.entries = function() {
  var items = []
  this.forEach(function(value, name) {
    items.push([name, value])
  })
  return iteratorFor(items)
}

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries
}

function consumed(body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'))
  }
  body.bodyUsed = true
}

function fileReaderReady(reader) {
  return new Promise(function(resolve, reject) {
    reader.onload = function() {
      resolve(reader.result)
    }
    reader.onerror = function() {
      reject(reader.error)
    }
  })
}

function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsArrayBuffer(blob)
  return promise
}

function readBlobAsText(blob) {
  var reader = new FileReader()
  var promise = fileReaderReady(reader)
  reader.readAsText(blob)
  return promise
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf)
  var chars = new Array(view.length)

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i])
  }
  return chars.join('')
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0)
  } else {
    var view = new Uint8Array(buf.byteLength)
    view.set(new Uint8Array(buf))
    return view.buffer
  }
}

function Body() {
  this.bodyUsed = false

  this._initBody = function(body) {
    /*
      fetch-mock wraps the Response object in an ES6 Proxy to
      provide useful test harness features such as flush. However, on
      ES5 browsers without fetch or Proxy support pollyfills must be used;
      the proxy-pollyfill is unable to proxy an attribute unless it exists
      on the object before the Proxy is created. This change ensures
      Response.bodyUsed exists on the instance, while maintaining the
      semantic of setting Request.bodyUsed in the constructor before
      _initBody is called.
    */
    this.bodyUsed = this.bodyUsed
    this._bodyInit = body
    if (!body) {
      this._bodyText = ''
    } else if (typeof body === 'string') {
      this._bodyText = body
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body
    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString()
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer)
      // IE 10-11 can't handle a DataView body.
      this._bodyInit = new Blob([this._bodyArrayBuffer])
    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
      this._bodyArrayBuffer = bufferClone(body)
    } else {
      this._bodyText = body = Object.prototype.toString.call(body)
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8')
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type)
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
      }
    }
  }

  if (support.blob) {
    this.blob = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as blob')
      } else {
        return Promise.resolve(new Blob([this._bodyText]))
      }
    }

    this.arrayBuffer = function() {
      if (this._bodyArrayBuffer) {
        var isConsumed = consumed(this)
        if (isConsumed) {
          return isConsumed
        }
        if (ArrayBuffer.isView(this._bodyArrayBuffer)) {
          return Promise.resolve(
            this._bodyArrayBuffer.buffer.slice(
              this._bodyArrayBuffer.byteOffset,
              this._bodyArrayBuffer.byteOffset + this._bodyArrayBuffer.byteLength
            )
          )
        } else {
          return Promise.resolve(this._bodyArrayBuffer)
        }
      } else {
        return this.blob().then(readBlobAsArrayBuffer)
      }
    }
  }

  this.text = function() {
    var rejected = consumed(this)
    if (rejected) {
      return rejected
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob)
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text')
    } else {
      return Promise.resolve(this._bodyText)
    }
  }

  if (support.formData) {
    this.formData = function() {
      return this.text().then(decode)
    }
  }

  this.json = function() {
    return this.text().then(JSON.parse)
  }

  return this
}

// HTTP methods whose capitalization should be normalized
var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

function normalizeMethod(method) {
  var upcased = method.toUpperCase()
  return methods.indexOf(upcased) > -1 ? upcased : method
}

function Request(input, options) {
  if (!(this instanceof Request)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
  }

  options = options || {}
  var body = options.body

  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError('Already read')
    }
    this.url = input.url
    this.credentials = input.credentials
    if (!options.headers) {
      this.headers = new Headers(input.headers)
    }
    this.method = input.method
    this.mode = input.mode
    this.signal = input.signal
    if (!body && input._bodyInit != null) {
      body = input._bodyInit
      input.bodyUsed = true
    }
  } else {
    this.url = String(input)
  }

  this.credentials = options.credentials || this.credentials || 'same-origin'
  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers)
  }
  this.method = normalizeMethod(options.method || this.method || 'GET')
  this.mode = options.mode || this.mode || null
  this.signal = options.signal || this.signal
  this.referrer = null

  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
    throw new TypeError('Body not allowed for GET or HEAD requests')
  }
  this._initBody(body)

  if (this.method === 'GET' || this.method === 'HEAD') {
    if (options.cache === 'no-store' || options.cache === 'no-cache') {
      // Search for a '_' parameter in the query string
      var reParamSearch = /([?&])_=[^&]*/
      if (reParamSearch.test(this.url)) {
        // If it already exists then set the value with the current time
        this.url = this.url.replace(reParamSearch, '$1_=' + new Date().getTime())
      } else {
        // Otherwise add a new '_' parameter to the end with the current time
        var reQueryString = /\?/
        this.url += (reQueryString.test(this.url) ? '&' : '?') + '_=' + new Date().getTime()
      }
    }
  }
}

Request.prototype.clone = function() {
  return new Request(this, {body: this._bodyInit})
}

function decode(body) {
  var form = new FormData()
  body
    .trim()
    .split('&')
    .forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
  return form
}

function parseHeaders(rawHeaders) {
  var headers = new Headers()
  // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2
  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
  preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
    var parts = line.split(':')
    var key = parts.shift().trim()
    if (key) {
      var value = parts.join(':').trim()
      headers.append(key, value)
    }
  })
  return headers
}

Body.call(Request.prototype)

function Response(bodyInit, options) {
  if (!(this instanceof Response)) {
    throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.')
  }
  if (!options) {
    options = {}
  }

  this.type = 'default'
  this.status = options.status === undefined ? 200 : options.status
  this.ok = this.status >= 200 && this.status < 300
  this.statusText = 'statusText' in options ? options.statusText : ''
  this.headers = new Headers(options.headers)
  this.url = options.url || ''
  this._initBody(bodyInit)
}

Body.call(Response.prototype)

Response.prototype.clone = function() {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url
  })
}

Response.error = function() {
  var response = new Response(null, {status: 0, statusText: ''})
  response.type = 'error'
  return response
}

var redirectStatuses = [301, 302, 303, 307, 308]

Response.redirect = function(url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError('Invalid status code')
  }

  return new Response(null, {status: status, headers: {location: url}})
}

var DOMException = global.DOMException
try {
  new DOMException()
} catch (err) {
  DOMException = function(message, name) {
    this.message = message
    this.name = name
    var error = Error(message)
    this.stack = error.stack
  }
  DOMException.prototype = Object.create(Error.prototype)
  DOMException.prototype.constructor = DOMException
}

function fetch(input, init) {
  return new Promise(function(resolve, reject) {
    var request = new Request(input, init)

    if (request.signal && request.signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'))
    }

    var xhr = new XMLHttpRequest()

    function abortXhr() {
      xhr.abort()
    }

    xhr.onload = function() {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      }
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
      var body = 'response' in xhr ? xhr.response : xhr.responseText
      setTimeout(function() {
        resolve(new Response(body, options))
      }, 0)
    }

    xhr.onerror = function() {
      setTimeout(function() {
        reject(new TypeError('Network request failed'))
      }, 0)
    }

    xhr.ontimeout = function() {
      setTimeout(function() {
        reject(new TypeError('Network request failed'))
      }, 0)
    }

    xhr.onabort = function() {
      setTimeout(function() {
        reject(new DOMException('Aborted', 'AbortError'))
      }, 0)
    }

    function fixUrl(url) {
      try {
        return url === '' && global.location.href ? global.location.href : url
      } catch (e) {
        return url
      }
    }

    xhr.open(request.method, fixUrl(request.url), true)

    if (request.credentials === 'include') {
      xhr.withCredentials = true
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false
    }

    if ('responseType' in xhr) {
      if (support.blob) {
        xhr.responseType = 'blob'
      } else if (
        support.arrayBuffer &&
        request.headers.get('Content-Type') &&
        request.headers.get('Content-Type').indexOf('application/octet-stream') !== -1
      ) {
        xhr.responseType = 'arraybuffer'
      }
    }

    if (init && typeof init.headers === 'object' && !(init.headers instanceof Headers)) {
      Object.getOwnPropertyNames(init.headers).forEach(function(name) {
        xhr.setRequestHeader(name, normalizeValue(init.headers[name]))
      })
    } else {
      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })
    }

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr)

      xhr.onreadystatechange = function() {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr)
        }
      }
    }

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
  })
}

fetch.polyfill = true

if (!global.fetch) {
  global.fetch = fetch
  global.Headers = Headers
  global.Request = Request
  global.Response = Response
}


/***/ }),

/***/ "./script.js":
/*!*******************!*\
  !*** ./script.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var coherent_gameface_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! coherent-gameface-components */ "../../lib/components.js");
/* harmony import */ var _template_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./template.html */ "./template.html");
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/




const components = new coherent_gameface_components__WEBPACK_IMPORTED_MODULE_0__.Components();
const BaseComponent = components.BaseComponent;
const TOAST_POSITIONS = ['top left', 'top right', 'bottom left', 'bottom right', 'top center', 'bottom center'];
const classPrefix = 'guic-toast-';
let containersCreated = false;
let animationEventAttached = false;

/**
 * Class definition of the gameface toast custom element
 */
class GamefaceToast extends BaseComponent {
    /* eslint-disable require-jsdoc */
    constructor() {
        super();
        this.template = _template_html__WEBPACK_IMPORTED_MODULE_1__["default"];
        this.init = this.init.bind(this);
        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);
        this.hideTimeOut = null;
        this._gravity = 'top';
        this._position = 'left';
    }

    get message() {
        return this._messageSlot.textContent;
    }

    set message(value) {
        this._messageSlot.innerHTML = value;
    }

    get targetElement() {
        return this._targetElement;
    }

    set targetElement(element) {
        this._targetElement = element;
    }

    get position() {
        return this._position;
    }

    set position(value) {
        this._position = value;
        this.setAttribute('position', value);
    }

    get gravity() {
        return this._gravity;
    }

    set gravity(value) {
        this._gravity = value;
        this.setAttribute('gravity', value);
    }

    init(data) {
        this.setupTemplate(data, () => {
            components.renderOnce(this);
            // attach event handlers here
            this.attachEventListeners();
            this._messageSlot = this.querySelector('.guic-toast-message').firstElementChild;
        });
    }

    connectedCallback() {
        this.gravity = this.getAttribute('gravity') || this._gravity;
        this.position = this.getAttribute('position') || this._position;
        this.timeout = this.getAttribute('timeout') || 0;
        this.elementSelector = this.getAttribute('target');
        this._targetElement = this._targetElement || document.querySelector(this.elementSelector);

        if (!containersCreated) this.createToastContainers();

        components.loadResource(this)
            .then(this.init)
            .catch(err => console.error(err));
    }

    attachEventListeners() {
        if (this._targetElement ) {
            this._targetElement.addEventListener('click', this.show);
        }

        if (!animationEventAttached) {
            document.addEventListener('animationend', (event) => {
                if (event.animationName === 'guic-toast-fade-out') event.target.parentElement.removeChild(event.target);
            });
            animationEventAttached = true;
        }
    }
    /* eslint-enable require-jsdoc */

    /**
     * Creates containers for all possible toast positions
    */
    createToastContainers() {
        const body = document.querySelector('body');
        TOAST_POSITIONS.forEach((containerPosition) => {
            const [vertical, horizontal] = containerPosition.split(' ');
            const toastContainer = document.createElement('div');
            toastContainer.classList.add('guic-toast-container', `${classPrefix}${vertical}`, `${classPrefix}${horizontal}`);
            body.appendChild(toastContainer);
        });

        containersCreated = true;
    }

    /**
     * Appends the toast to one of the containers depending on the gravity and position
     * @param {string} gravity - top, bottom.
     * @param {string} position - left, right, center
    */
    appendToastToContainer(gravity, position) {
        const container = document.querySelector(`.guic-toast-container.${classPrefix}${gravity}.${classPrefix}${position}`);

        if (container) {
            container.appendChild(this);
            return;
        } else {
            console.error('No container found for the specified gravity and position');
        }
    }

    /**
     * Displays the toast
     */
    show() {
        this.appendToastToContainer(this.gravity, this.position);
        this.handleTimeOut();
        this.handleCloseButton();
        this.classList.add('guic-toast-show');
        this.classList.remove('guic-toast-hide');
    }

    /**
     * Hides the toast
     */
    hide() {
        if (this.isConnected) this.classList.add('guic-toast-hide');
    }

    /**
     * Setups the timeout of the toast
     */
    handleTimeOut() {
        if (this.hideTimeOut) clearTimeout(this.hideTimeOut);

        if (this.timeout > 0) {
            this.hideTimeOut = setTimeout(this.hide, this.timeout);
        }
    }

    /**
     * Setups the close button of the toast
     */
    handleCloseButton() {
        const closeButton = this.querySelector('.guic-toast-close-btn');
        if (closeButton.firstElementChild.clientWidth && closeButton.firstElementChild.clientHeight) {
            closeButton.addEventListener('click', this.hide);
        }
    }
}
components.defineCustomElement('gameface-toast', GamefaceToast);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GamefaceToast);


/***/ }),

/***/ "../../lib/components.js":
/*!*******************************!*\
  !*** ../../lib/components.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Components": () => (/* binding */ Components)
/* harmony export */ });
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/* eslint-disable no-useless-escape */
const newLinesRegExp = new RegExp('^\s+|\s+$', 'g');
const NATIVE_TEXT_FIELD_ELEMENTS = ['input', 'textarea'];
window.GUIComponentsDefinedElements = {};

if (!window.GUIComponentsDefinedElements) window.GUIComponentsDefinedElements = {};


/**
 * Checks if the passed element is a native text field
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isNativeTextField(element) {
    return NATIVE_TEXT_FIELD_ELEMENTS.indexOf(element.tagName.toLowerCase()) > -1;
}

/**
 * BaseComponent
 * The base class from which all other components inherit shared logic
 */
class BaseComponent extends HTMLElement {
    /**
     * Return the type of the class
     */
    get instanceType() {
        return 'BaseComponent';
    }
    /**
     * Called when the template of a component was loaded.
     * @param {object} data
     * @param {function} callback
     * @returns {undefined}
    */
    setupTemplate(data, callback) {
        if (!this.isConnected) {
            return console.log(`DEBUG: component ${this.tagName} was not initialized because it was disconnected from the DOM!`);
        }

        this.template = data.template;
        callback(data.template);
    }
    /**
     * Validate if a value can be set on the state.
     * @param {string} name - the name of the property.
     * @param {any} value - the value that has to be checked.
     * @returns {boolean}
     */
    isStatePropValid(name, value) {
        const schemaProperty = this.stateSchema[name];

        if (!schemaProperty) {
            console.error(`A property ${name} does not exist on type ${this.tagName.toLowerCase()}!`);
            return false;
        }

        const type = typeof value;
        if (schemaProperty.type.includes('array')) {
            const isArray = Array.isArray(value);
            if (isArray) return true;
        }

        if (!schemaProperty.type.includes(type)) {
            console.error(`Property ${name} can not be of type - ${type}. Allowed types are: ${schemaProperty.type.join(',')}`);
            return false;
        }

        return true;
    }
}

/**
 * This is the base class that holds all functionality shared between custom components
 * and native elements
 */
class Validator {
    /**
     * Return the type of the class
     */
    get instanceType() {
        return 'Validator';
    }

    /**
     * Check if element is child of a form
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    static isFormElement(element) {
        element = element.parentElement;
        while (element) {
            if (element.tagName === 'GAMEFACE-FORM-CONTROL' || element.tagName === 'gameface-form-control') return true;
            element = element.parentElement;
        }

        return false;
    }

    /**
     * Check if element value is bigger than element maxlength
     * @returns {boolean}
     */
    static tooLong() {
        return false;
    }

    /**
     * Check if element value is less than element minlength
     * @returns {boolean}
     */
    static tooShort() {
        return false;
    }

    /**
     * Checks if the value of an element is bigger than its max attribute
     * @returns {boolean}
    */
    static rangeOverflow() {
        return false;
    }

    /**
     * Checks if the value of an element is smaller than its min attribute
     * @returns {boolean}
    */
    static rangeUnderflow() {
        return false;
    }

    /**
     * Check if element is required and its value is missing
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    static valueMissing(element) {
        return element.hasAttribute('required') && !element.value;
    }

    /**
     * Check if element name is missing
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    static nameMissing(element) {
        return !element.name && !element.getAttribute('name');
    }

    /**
     * Check if an element is required
     * @param {HTMLElement} element
     * @returns {boolean}
    */
    static isRequired(element) {
        return element.hasAttribute('required');
    }

    /**
     * Checks if there is a custom error for the element
     * @returns {boolean}
     */
    static customError() {
        return false;
    }

    /**
     * Checks if element is going to be serialized.
     * If an element doesn't have a name it will not be serialized.
     * Used to determine if an element should be validated.
     * @param {HTMLElement} element
     * @returns {boolean}
    */
    static willSerialize(element) {
        return this.nameMissing(element) ? false : true;
    }

    /* eslint-disable require-jsdoc */
    static isBadURL() {
        return false;
    }

    static isBadEmail() {
        return false;
    }
    /* eslint-enable require-jsdoc */
}

/**
 * The NativeElementValidator uses the methods from the Validator class
 * All native elements tha don't support methods like isFormElement, tooLong, tooShort
 * etc.. will be wrapped in this class in order to enable us to validate native and
 * custom elements using the same methods.
 * */
class NativeElementValidator {
    /* eslint-disable require-jsdoc */
    get instanceType() {
        return 'NativeElementValidator';
    }

    constructor(element) {
        this.element = element;
    }

    isFormElement() {
        return Validator.isFormElement(this.element);
    }

    tooLong() {
        if (isNativeTextField(this.element)) return TextFieldValidator.tooLong(this.element);
        return Validator.tooLong();
    }

    tooShort() {
        if (isNativeTextField(this.element)) return TextFieldValidator.tooShort(this.element);
        return Validator.tooShort();
    }

    rangeOverflow() {
        if (isNativeTextField(this.element)) return TextFieldValidator.rangeOverflow(this.element);
        return Validator.rangeOverflow();
    }

    rangeUnderflow() {
        if (isNativeTextField(this.element)) return TextFieldValidator.rangeUnderflow(this.element);
        return Validator.rangeUnderflow();
    }

    valueMissing() {
        return Validator.valueMissing(this.element);
    }

    nameMissing() {
        return Validator.nameMissing(this.element);
    }

    customError() {
        return Validator.customError();
    }

    isRequired() {
        return Validator.isRequired(this.element);
    }

    willSerialize() {
        return Validator.willSerialize(this.element);
    }

    isBadEmail() {
        if (isNativeTextField(this.element)) return TextFieldValidator.isBadEmail(this.element);
        return false;
    }

    isBadURL() {
        if (isNativeTextField(this.element)) return TextFieldValidator.isBadURL(this.element);
        return false;
    }
    /* eslint-enable require-jsdoc */
}

/**
 * The CustomElementValidator is inherited by custom elements in order to gain the
 * validation function from the Validator class.
 * This class can not be used to wrap the native elements as it inherits the
 * HTMLElement which can not be instantiated using the new keyword.
*/
class CustomElementValidator extends BaseComponent {
    /* eslint-disable require-jsdoc */
    get instanceType() {
        return 'CustomElementValidator';
    }

    isFormElement() {
        return Validator.isFormElement(this);
    }

    tooLong() {
        return Validator.tooLong(this);
    }

    tooShort() {
        return Validator.tooShort(this);
    }

    valueMissing() {
        return Validator.valueMissing(this);
    }

    nameMissing() {
        return Validator.nameMissing(this);
    }

    customError() {
        return Validator.customError();
    }

    isRequired() {
        return Validator.isRequired(this);
    }

    rangeOverflow() {
        return Validator.rangeOverflow(this);
    }

    rangeUnderflow() {
        return Validator.rangeUnderflow(this);
    }

    willSerialize() {
        return Validator.willSerialize(this);
    }

    isBadEmail() {
        return Validator.isBadEmail(this);
    }

    isBadURL() {
        return Validator.isBadURL(this);
    }
    /* eslint-enable require-jsdoc */
}

/**
 * Class that implements the commong validation methods for the text fields
 */
class TextFieldValidator {
    /* eslint-disable-next-line require-jsdoc */
    get instanceType() {
        return 'TextFieldValidator';
    }

    /**
     * Most of the custom elements will not need this check however,
     * we call all validation methods in order to determine if an element is valid.
     * Each element that needs this check implements it itself.
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    static tooLong(element) {
        const maxLength = element.getAttribute('maxlength');
        if (!maxLength) return false;
        return element.value.length > parseFloat(maxLength);
    }

    /**
    * Most of the custom elements will not need this check however,
    * we call all validation methods in order to determine if an element is valid.
    * Each element that needs this check implements it itself.
    * @param {HTMLElement} element
    * @returns {boolean}
    */
    static tooShort(element) {
        const minLength = element.getAttribute('minlength');
        if (!minLength) return false;
        return element.value.length < parseFloat(minLength);
    }

    /**
    * Most of the custom elements will not need this check however,
    * we call all validation methods in order to determine if an element is valid.
    * Each element that needs this check implements it itself.
    * @param {HTMLElement} element
    * @returns {boolean}
    */
    static rangeOverflow(element) {
        const max = element.getAttribute('max');
        if (!max) return false;
        return parseFloat(element.value) > parseFloat(max);
    }

    /**
     * Most of the custom elements will not need this check however,
     * we call all validation methods in order to determine if an element is valid.
     * Each element that needs this check implements it itself.
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    static rangeUnderflow(element) {
        const min = element.getAttribute('min');
        if (!min) return false;
        return parseFloat(element.value) < parseFloat(min);
    }

    /**
     * Checks if the text field with type url has a valid url by its pattern
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    static isBadURL(element) {
        if (element.getAttribute('type') !== 'url') return false;
        const pattern = element.pattern || element.getAttribute('pattern');
        if (!pattern) return false;
        if (!element.value.match(pattern)) return true;
        return false;
    }

    /**
     * Checks if the text field element with type email is valid
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    static isBadEmail(element) {
        if (element.getAttribute('type') !== 'email') return false;
        if (!element.value.match('@')) return true;
        return false;
    }
}

// eslint-disable-next-line max-lines-per-function, require-jsdoc
const Components = function () {
    const GF_COMPONENT_SLOT_TAG_NAME = 'component-slot';
    const KEYCODES = {
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        UP: 38,
        HOME: 36,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        TAB: 9,
        SHIFT: 16,
        CTRL: 17,
        SPACE: 32,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        LETTER_A: 65,
    };

    /**
     * Class that defines the Gameface components
     */
    class GamefaceComponents {
        // eslint-disable-next-line require-jsdoc
        constructor() {
            this.imported = this.imported || [];
            this.KEYCODES = KEYCODES;
            this.cachedComponents = {};

            this.CustomElementValidator = CustomElementValidator;
            this.NativeElementValidator = NativeElementValidator;
            this.TextFieldValidator = TextFieldValidator;
            this.Validator = Validator;
            this.BaseComponent = BaseComponent;
        }

        /**
         * Create and add a script tag with given url.
         * @param {string} url
        */
        importScript(url) {
            const script = document.createElement('script');
            script.setAttribute('src', url);
            document.body.appendChild(script);
        }

        /**
         * Loads an html by given url.
         * @param {string} url
         * @returns {promise} resolved with the html as text.
        */
        loadHTML(url) {
            return this.loadResource(url).then((result) => {
                return result.template;
            });
        }

        /**
         * Creates a promise which resolves when a custom element was defined.
         * Saves the promise for each defined component.
         * @param {string} name - the name of the custom element
         * @returns {promise} - the previously saved promise it any or a new one
        */
        whenDefined(name) {
            if (window.GUIComponentsDefinedElements[name] !== undefined) {
                return window.GUIComponentsDefinedElements[name].promise;
            }

            const defined = window.GUIComponentsDefinedElements[name] = {};
            defined.promise = new Promise((resolve, reject) => {
                defined.resolve = resolve;
                defined.reject = reject;
            });
            return defined.promise;
        }

        /**
         * Defines a custom element.
         * @param {string} name - the name of the element.
         * @param {Object} element - the object which describes the element.
        */
        defineCustomElement(name, element) {
            // don't attempt to register custom element twice
            if (window.GUIComponentsDefinedElements[name] || customElements.get(name)) return;
            this.whenDefined(name);
            customElements.define(name, element);
            window.GUIComponentsDefinedElements[name].resolve(element);
        }

        /**
         * Imports a component by given url.
         * It will automatically try to import style.css and script.js if these
         * files' names were not explicitly specified.
         * @param {string} url - the url of the component
        */
        importComponent(url) {
            requestAnimationFrame(() => {
                this.importScript(url + '/script.js');
            });
        }

        /**
         * Removes back and forward slashes from string
         * @param {string} path
         * @returns {string}
         */
        removeSlashes(path) {
            return path.replace(/[/|\\]/g, '');
        }

        /**
         * Remove new lines from the beginning of templates,
         * because template.firstChild.cloneNode will clone an empty
         * string and will return an empty template.
         * @param {string} template
         * @returns {string}
        */
        removeNewLines(template) {
            return template.replace(newLinesRegExp, '').trim();
        }

        /**
         * Removes the copyright notice from the template
         * @param {string} template
         * @returns {string} the template without the copyright notice
        */
        removeCopyrightNotice(template) {
            return template.replace(`<!--Copyright (c) Coherent Labs AD. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. -->`, '').trim();
        }

        /**
         * Used when the element has already been rendered.
         * Return the already rendered template instead of
         * loading and slotting its elements.
         *
         * @param {HTMLElement} component - the component that was rendered
         * @returns {Promise<HTMLElement>} - a promise that will resolve with the rendered template
        */
        resolveWithTemplate(component) {
            return new Promise((resolve) => {
                resolve({
                    template: component.template,
                    url: component.url,
                });
            });
        }

        /**
         * Uses an XMLHttpRequest to load an external file.
         * @param {string} component - the url of the file.
         * @returns {promise} - a promise that is resolved with the file's text content.
        */
        loadResource(component) {
            if (component.template && typeof component.template === 'string') {
                if (component.isRendered) return this.resolveWithTemplate(component);
                const template = this.removeCopyrightNotice(component.template);

                return new Promise((resolve) => {
                    resolve({
                        template: this.removeNewLines(template),
                        url: component.url,
                    });
                });
            }

            if (typeof component.template === 'object' && component.isRendered) {
                return this.resolveWithTemplate(component);
            }

            if (window.__optimize) {
                const id = this.removeSlashes(component.url);
                const element = document.getElementById(id).firstChild;
                // fallback to XHR
                if (!element) return this.requestResource(component.url);

                return new Promise((resolve) => {
                    resolve({ template: element.innerHTML, url: component.url });
                });
            }

            return this.requestResource(component.url);
        }


        /**
         * Execute an XMLHttpRequest to load a resource by url.
         * @param {string} url - the path to the resource
         * @returns {promise} - promise which resolves with the loaded resource
        */
        requestResource(url) {
            const request = new XMLHttpRequest();
            const promise = new Promise(function (resolve, reject) {
                request.onload = (response) => {
                    if (request.status == 200) {
                        resolve({ template: request.responseText, url: url });
                    } else {
                        reject(response);
                    }
                };
                request.onerror = reject;
            });
            request.open('GET', url);
            request.send();
            return promise;
        }

        /**
         * Recursively finds the slot elements in a given element.
         * @param {HTMLElement} parent - the element which is searched for slots.
         * @param {string} parentElName
         * @param {object} result - a key:value object containing the slot elements
         * under their data-name as value:
         * { <my-slot-name>: HTMLElement }
         * @returns {Object} result
        */
        findSlots(parent, parentElName, result = {}) {
            const children = parent.children;
            const length = children.length;

            for (let i = 0; i < length; ++i) {
                const child = children[i];
                const childTagName = child.tagName.toLowerCase();

                if (childTagName === 'component-slot') {
                    const name = child.dataset.name;
                    if (!result[name]) result[name] = [];
                    result[name].push(child);
                    this.findSlots(child, parentElName, result);
                } else if (child.hasAttribute('slot')) {
                    const slot = child.getAttribute('slot');
                    if (!result[slot]) result[slot] = [];
                    result[slot].push(child);
                    this.findSlots(child, parentElName, result);
                    // the scrollable container is the ONLY component that can hold
                    // slots of another elements; we allow this in order achieve
                    // better integration of the scrollbar inside other components
                    // The WebComponents and the standard slot elements don't support
                    // such behavior; an element handles only its own slots. The scrollable
                    // container is an exception from this rule.
                } else if (childTagName === 'gameface-scrollable-container' ||
                    (childTagName !== GF_COMPONENT_SLOT_TAG_NAME &&
                        parentElName !== childTagName &&
                        !window.GUIComponentsDefinedElements[childTagName])) {
                    // if the child is another nested element don't look for slots in it
                    this.findSlots(child, parentElName, result);
                }
            }

            return result;
        }

        /**
         * Will replace the slot element
         * @param {HTMLElement[]} source
         * @param {HTMLElement} target
         */
        replaceSlots(source, target) {
            const fakeRoot = target[0];
            if (source.length && fakeRoot.childNodes.length) {
                while (fakeRoot.firstChild) {
                    fakeRoot.removeChild(fakeRoot.lastChild);
                }
            }
            // remove the slot so that it can be replaced
            const parent = fakeRoot.parentNode;
            parent.removeChild(fakeRoot);

            for (let i = 0; i < source.length; ++i) {
                parent.appendChild(source[i]);
            }
        }

        /**
         * Transfers the slottable elements into their slots.
         * @param {HTMLElement} source - the element containing the slottable elements.
         * @param {HTMLElement} target - the element containing the slots elements.
        */
        transferContent(source, target) {
            while (target.childNodes.length > 0) {
                const nodes = target.childNodes;
                target.removeChild(nodes[nodes.length - 1]);
            }
            while (source.childNodes.length > 0) {
                const nodes = source.childNodes;
                const node = nodes[0];
                source.removeChild(node);
                target.appendChild(node);
            }
        }

        /**
         * Renderes an element only if it wasn't rendered before that
         * @param {HTMLElement} element
         * @returns {boolean} - true if it was rendered, false if not
        */
        renderOnce(element) {
            if (element.isRendered) return false;

            this.render(element);
            element.isRendered = true;
            return true;
        }

        /**
        * Renders an element's content into its template.
        * @param {HTMLElement} element - the element into which to render the content
        */
        render(element) {
            const templateRoot = document.createElement('div');
            templateRoot.innerHTML = element.template;

            const parentElName = element.tagName.toLowerCase();

            const templateSlots = this.findSlots(templateRoot, parentElName);
            const userSlots = this.findSlots(element, parentElName);

            // use for...of instead of for...in for better performance
            const userSlotsKeys = Object.keys(userSlots);
            const templateSlotsKeys = Object.keys(templateSlots);

            // there's no point in looping over userSlots if there aren't
            // corresponding template slots
            if (templateSlotsKeys.length) {
                for (const userSlot of userSlotsKeys) {
                    if (!userSlots[userSlot] || !templateSlots[userSlot]) continue;
                    this.replaceSlots(userSlots[userSlot], templateSlots[userSlot]);
                }
            }

            this.transferContent(templateRoot, element);
        }

        /**
         * Used to render.
         * @param {HTMLElement} element - the element which will be rendered
         * @param {string} targetContainerSelector - the selector of the parent element
         * @param {Array<HTMLElement>} children - the child elements that need to go into the parent
         */
        transferChildren(element, targetContainerSelector, children) {
            const templateRoot = document.createElement('div');
            templateRoot.innerHTML = element.template;
            const container = templateRoot.querySelector(targetContainerSelector);
            children.forEach(child => container.appendChild(child));

            this.transferContent(templateRoot, element);
        }

        /**
         * Delay the execution of a callback function by n amount of frames.
         * Used to retrieve the computed styles of elements.
         * @param {Function} callback - the function that will be executed.
         * @param {number} count - the amount of frames that the callback execution
         * should be delayed by.
         * @returns {any}
        */
        waitForFrames(callback = () => { }, count = 3) {
            if (count === 0) return callback();
            count--;
            requestAnimationFrame(() => this.waitForFrames(callback, count));
        }

        /**
         * Checks if the current user agent is Cohtml
         * @returns {boolean}
        */
        isBrowserGameface() {
            return navigator.userAgent.match('Cohtml');
        }

        /**
         * Check if a value is a number and if not - log an error
         * @param {string} propName - the name of the property that needs to be validated
         * @param {any} value
         * @returns {boolean} - true if it is a number or a string that can be cast to number, false if not
         */
        isNumberPositiveValidation(propName, value) {
            const parsed = parseInt(value);

            if (isNaN(parsed)) {
                console.error(`Unsupported type[${typeof parsed}] given for ${propName}. Possible values are positive numbers.`);
                return false;
            }

            if (parsed < 0) {
                console.error(`The passed value for ${propName} - ${value} is not a positive number. Please use positive numbers only for ${propName}.`);
                return false;
            }

            return true;
        }
    }

    const components = new GamefaceComponents();

    /**
     * Class that will handle gameface components slot element
     */
    class ComponentSlot extends HTMLElement {
        /* eslint-disable require-jsdoc */

        constructor() {
            super();

            this.originalAppendChild = this.appendChild;
            this.originalInsertBefore = this.insertBefore;
            this.originalReplaceChild = this.replaceChild;
            this.originalRemoveChild = this.removeChild;

            this.appendChild = (node) => {
                const child = this.originalAppendChild(node);
                this.disptachSlotChange(child);

                return child;
            };

            this.insertBefore = (newNode, referenceNode) => {
                const child = this.originalInsertBefore(newNode, referenceNode);
                this.disptachSlotChange(child);

                return child;
            };

            this.replaceChild = (newChild, oldChild) => {
                const replacedNode = this.originalReplaceChild(newChild, oldChild);
                this.disptachSlotChange(replacedNode);

                return replacedNode;
            };

            this.removeChild = (child) => {
                const removedNode = this.originalRemoveChild(child);
                this.disptachSlotChange(removedNode);

                return removedNode;
            };
        }

        disptachSlotChange(child) {
            this.dispatchEvent(new CustomEvent('slotchange'), {
                target: this,
                child: child,
            });
        }

        /* eslint-enable require-jsdoc */
    }

    components.defineCustomElement(GF_COMPONENT_SLOT_TAG_NAME, ComponentSlot);

    return components;
};




/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*****************!*\
  !*** ./demo.js ***!
  \*****************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _script_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./script.js */ "./script.js");
/* harmony import */ var postmessage_polyfill__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! postmessage-polyfill */ "./node_modules/postmessage-polyfill/postmessage.js");
/* harmony import */ var postmessage_polyfill__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(postmessage_polyfill__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var whatwg_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! whatwg-fetch */ "./node_modules/whatwg-fetch/fetch.js");
/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Coherent Labs AD. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/





window.postMessage = function (message) {
    (0,postmessage_polyfill__WEBPACK_IMPORTED_MODULE_1__.pm)({
        origin: 'http://127.0.0.1/:3000',
        target: window,
        data: message,
    });
};

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OztBQUVPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLElBQUk7QUFDSjtBQUNBO0FBQ0EsS0FBSztBQUNMLElBQUk7QUFDSjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0IsaUJBQWlCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQsUUFBUTtBQUNSO0FBQ0EsUUFBUTtBQUNSLDRFQUE0RTtBQUM1RTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBNEIscUJBQXFCO0FBQ2pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBOztBQUVPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0EscUNBQXFDLDBCQUEwQjtBQUMvRDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsNkJBQTZCLDBCQUEwQixlQUFlO0FBQ3RFOztBQUVPO0FBQ1A7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxNQUFNO0FBQ047QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsR0FBRztBQUNIOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcGxCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQzBEO0FBQ25CO0FBQ3ZDO0FBQ0EsdUJBQXVCLG9FQUFVO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHNEQUFRO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvRUFBb0UsWUFBWSxFQUFFLFNBQVMsTUFBTSxZQUFZLEVBQUUsV0FBVztBQUMxSDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQSwwRUFBMEUsWUFBWSxFQUFFLFFBQVEsR0FBRyxZQUFZLEVBQUUsU0FBUztBQUMxSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUVBQWUsYUFBYSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDN0s3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxhQUFhO0FBQ3hCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkIsZUFBZSxVQUFVO0FBQ3pCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxtREFBbUQsY0FBYztBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QixlQUFlLEtBQUs7QUFDcEIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsTUFBTSx5QkFBeUIsMkJBQTJCO0FBQ2xHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLE1BQU0sdUJBQXVCLEtBQUssdUJBQXVCLDhCQUE4QjtBQUM3SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGFBQWE7QUFDNUIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxhQUFhO0FBQzVCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsYUFBYTtBQUM1QixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGFBQWE7QUFDNUIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsYUFBYTtBQUM1QixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGFBQWE7QUFDNUIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLGFBQWE7QUFDM0IsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLGFBQWE7QUFDM0IsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGFBQWE7QUFDNUIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsYUFBYTtBQUM1QixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsYUFBYTtBQUM1QixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFFBQVE7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFFBQVE7QUFDM0IscUJBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixRQUFRO0FBQzNCLHFCQUFxQixTQUFTO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsUUFBUTtBQUMzQixtQkFBbUIsUUFBUTtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixRQUFRO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFFBQVE7QUFDM0IscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixRQUFRO0FBQzNCLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixRQUFRO0FBQzNCLHFCQUFxQixRQUFRO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGFBQWE7QUFDaEMscUJBQXFCLHNCQUFzQjtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFFBQVE7QUFDM0IscUJBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLGlEQUFpRDtBQUMvRSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixRQUFRO0FBQzNCLHFCQUFxQixTQUFTO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQywwQ0FBMEM7QUFDNUUsc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGFBQWE7QUFDaEMsbUJBQW1CLFFBQVE7QUFDM0IsbUJBQW1CLFFBQVE7QUFDM0I7QUFDQSxhQUFhO0FBQ2IscUJBQXFCLFFBQVE7QUFDN0I7QUFDQSxtREFBbUQ7QUFDbkQ7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLFlBQVk7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsZUFBZTtBQUNsQyxtQkFBbUIsYUFBYTtBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsbUJBQW1CO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixhQUFhO0FBQ2hDLG1CQUFtQixhQUFhO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGFBQWE7QUFDaEMscUJBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixhQUFhO0FBQy9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGFBQWE7QUFDaEMsbUJBQW1CLFFBQVE7QUFDM0IsbUJBQW1CLG9CQUFvQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixVQUFVO0FBQzdCLG1CQUFtQixRQUFRO0FBQzNCO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFFBQVE7QUFDM0IsbUJBQW1CLEtBQUs7QUFDeEIscUJBQXFCLFNBQVM7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCxjQUFjLGNBQWMsU0FBUztBQUN2RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNEQUFzRCxVQUFVLElBQUksT0FBTyxpRUFBaUUsU0FBUztBQUNySjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ3NCOzs7Ozs7O1VDajJCdEI7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUN3QztBQUNFO0FBQ1k7QUFDdEQ7QUFDQTtBQUNBLElBQUksd0RBQUU7QUFDTjtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9jb2hlcmVudC1nYW1lZmFjZS10b2FzdC8uL3RlbXBsYXRlLmh0bWwiLCJ3ZWJwYWNrOi8vY29oZXJlbnQtZ2FtZWZhY2UtdG9hc3QvLi9ub2RlX21vZHVsZXMvcG9zdG1lc3NhZ2UtcG9seWZpbGwvcG9zdG1lc3NhZ2UuanMiLCJ3ZWJwYWNrOi8vY29oZXJlbnQtZ2FtZWZhY2UtdG9hc3QvLi9ub2RlX21vZHVsZXMvd2hhdHdnLWZldGNoL2ZldGNoLmpzIiwid2VicGFjazovL2NvaGVyZW50LWdhbWVmYWNlLXRvYXN0Ly4vc2NyaXB0LmpzIiwid2VicGFjazovL2NvaGVyZW50LWdhbWVmYWNlLXRvYXN0Ly4uLy4uL2xpYi9jb21wb25lbnRzLmpzIiwid2VicGFjazovL2NvaGVyZW50LWdhbWVmYWNlLXRvYXN0L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NvaGVyZW50LWdhbWVmYWNlLXRvYXN0L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2NvaGVyZW50LWdhbWVmYWNlLXRvYXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9jb2hlcmVudC1nYW1lZmFjZS10b2FzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2NvaGVyZW50LWdhbWVmYWNlLXRvYXN0L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY29oZXJlbnQtZ2FtZWZhY2UtdG9hc3QvLi9kZW1vLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIE1vZHVsZVxudmFyIGNvZGUgPSBcIjwhLS1Db3B5cmlnaHQgKGMpIENvaGVyZW50IExhYnMgQUQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS4gU2VlIExpY2Vuc2UudHh0IGluIHRoZSBwcm9qZWN0IHJvb3QgZm9yIGxpY2Vuc2UgaW5mb3JtYXRpb24uIC0tPlxcbjxkaXYgY2xhc3M9XFxcImd1aWMtdG9hc3RcXFwiPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJndWljLXRvYXN0LW1lc3NhZ2VcXFwiPlxcbiAgICAgICAgPGNvbXBvbmVudC1zbG90IGRhdGEtbmFtZT1cXFwibWVzc2FnZVxcXCI+PC9jb21wb25lbnQtc2xvdD5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcImd1aWMtdG9hc3QtY2xvc2UtYnRuXFxcIj5cXG4gICAgICAgIDxjb21wb25lbnQtc2xvdCBkYXRhLW5hbWU9XFxcImNsb3NlLWJ0blxcXCI+PC9jb21wb25lbnQtc2xvdD5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XCI7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBjb2RlOyIsIi8qKlxuIFRoZSBNSVQgTGljZW5zZVxuXG4gQ29weXJpZ2h0IChjKSAyMDEwIERhbmllbCBQYXJrIChodHRwOi8vbWV0YXdlYi5jb20sIGh0dHA6Ly9wb3N0bWVzc2FnZS5mcmVlYmFzZWFwcHMuY29tKVxuXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cbiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cbiBUSEUgU09GVFdBUkUuXG4gKiovXG52YXIgTk9fSlFVRVJZID0ge307XG4oZnVuY3Rpb24od2luZG93LCAkLCB1bmRlZmluZWQpIHtcblxuICAgICBpZiAoIShcImNvbnNvbGVcIiBpbiB3aW5kb3cpKSB7XG4gICAgICAgICB2YXIgYyA9IHdpbmRvdy5jb25zb2xlID0ge307XG4gICAgICAgICBjLmxvZyA9IGMud2FybiA9IGMuZXJyb3IgPSBjLmRlYnVnID0gZnVuY3Rpb24oKXt9O1xuICAgICB9XG5cbiAgICAgaWYgKCQgPT09IE5PX0pRVUVSWSkge1xuICAgICAgICAgLy8galF1ZXJ5IGlzIG9wdGlvbmFsXG4gICAgICAgICAkID0ge1xuICAgICAgICAgICAgIGZuOiB7fSxcbiAgICAgICAgICAgICBleHRlbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICB2YXIgYSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgICAgICAgICAgZm9yICh2YXIgaT0xLGxlbj1hcmd1bWVudHMubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICB2YXIgYiA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgIGFbcHJvcF0gPSBiW3Byb3BdO1xuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIHJldHVybiBhO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgIH07XG4gICAgIH1cblxuICAgICAkLmZuLnBtID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICBjb25zb2xlLmxvZyhcInVzYWdlOiBcXG50byBzZW5kOiAgICAkLnBtKG9wdGlvbnMpXFxudG8gcmVjZWl2ZTogJC5wbS5iaW5kKHR5cGUsIGZuLCBbb3JpZ2luXSlcIik7XG4gICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgfTtcblxuICAgICAvLyBzZW5kIHBvc3RtZXNzYWdlXG4gICAgICQucG0gPSB3aW5kb3cucG0gPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICBwbS5zZW5kKG9wdGlvbnMpO1xuICAgICB9O1xuXG4gICAgIC8vIGJpbmQgcG9zdG1lc3NhZ2UgaGFuZGxlclxuICAgICAkLnBtLmJpbmQgPSB3aW5kb3cucG0uYmluZCA9IGZ1bmN0aW9uKHR5cGUsIGZuLCBvcmlnaW4sIGhhc2gsIGFzeW5jX3JlcGx5KSB7XG4gICAgICAgICBwbS5iaW5kKHR5cGUsIGZuLCBvcmlnaW4sIGhhc2gsIGFzeW5jX3JlcGx5ID09PSB0cnVlKTtcbiAgICAgfTtcblxuICAgICAvLyB1bmJpbmQgcG9zdG1lc3NhZ2UgaGFuZGxlclxuICAgICAkLnBtLnVuYmluZCA9IHdpbmRvdy5wbS51bmJpbmQgPSBmdW5jdGlvbih0eXBlLCBmbikge1xuICAgICAgICAgcG0udW5iaW5kKHR5cGUsIGZuKTtcbiAgICAgfTtcblxuICAgICAvLyBkZWZhdWx0IHBvc3RtZXNzYWdlIG9yaWdpbiBvbiBiaW5kXG4gICAgICQucG0ub3JpZ2luID0gd2luZG93LnBtLm9yaWdpbiA9IG51bGw7XG5cbiAgICAgLy8gZGVmYXVsdCBwb3N0bWVzc2FnZSBwb2xsaW5nIGlmIHVzaW5nIGxvY2F0aW9uIGhhc2ggdG8gcGFzcyBwb3N0bWVzc2FnZXNcbiAgICAgJC5wbS5wb2xsID0gd2luZG93LnBtLnBvbGwgPSAyMDA7XG5cbiAgICAgdmFyIHBtID0ge1xuXG4gICAgICAgICBzZW5kOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICAgdmFyIG8gPSAkLmV4dGVuZCh7fSwgcG0uZGVmYXVsdHMsIG9wdGlvbnMpLFxuICAgICAgICAgICAgIHRhcmdldCA9IG8udGFyZ2V0O1xuICAgICAgICAgICAgIGlmICghby50YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwicG9zdG1lc3NhZ2UgdGFyZ2V0IHdpbmRvdyByZXF1aXJlZFwiKTtcbiAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICBpZiAoIW8udHlwZSkge1xuICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJwb3N0bWVzc2FnZSB0eXBlIHJlcXVpcmVkXCIpO1xuICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgfVxuICAgICAgICAgICAgIHZhciBtc2cgPSB7ZGF0YTpvLmRhdGEsIHR5cGU6by50eXBlfTtcbiAgICAgICAgICAgICBpZiAoby5zdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgIG1zZy5jYWxsYmFjayA9IHBtLl9jYWxsYmFjayhvLnN1Y2Nlc3MpO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICBpZiAoby5lcnJvcikge1xuICAgICAgICAgICAgICAgICBtc2cuZXJyYmFjayA9IHBtLl9jYWxsYmFjayhvLmVycm9yKTtcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgaWYgKChcInBvc3RNZXNzYWdlXCIgaW4gdGFyZ2V0KSAmJiAhby5oYXNoKSB7XG4gICAgICAgICAgICAgICAgIHBtLl9iaW5kKCk7XG4gICAgICAgICAgICAgICAgIHRhcmdldC5wb3N0TWVzc2FnZShKU09OLnN0cmluZ2lmeShtc2cpLCBvLm9yaWdpbiB8fCAnKicpO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgcG0uaGFzaC5fYmluZCgpO1xuICAgICAgICAgICAgICAgICBwbS5oYXNoLnNlbmQobywgbXNnKTtcbiAgICAgICAgICAgICB9XG4gICAgICAgICB9LFxuXG4gICAgICAgICBiaW5kOiBmdW5jdGlvbih0eXBlLCBmbiwgb3JpZ2luLCBoYXNoLCBhc3luY19yZXBseSkge1xuICAgICAgICAgICBwbS5fcmVwbHlCaW5kICggdHlwZSwgZm4sIG9yaWdpbiwgaGFzaCwgYXN5bmNfcmVwbHkgKTtcbiAgICAgICAgIH0sXG4gICAgICAgXG4gICAgICAgICBfcmVwbHlCaW5kOiBmdW5jdGlvbih0eXBlLCBmbiwgb3JpZ2luLCBoYXNoLCBpc0NhbGxiYWNrKSB7XG4gICAgICAgICAgIGlmICgoXCJwb3N0TWVzc2FnZVwiIGluIHdpbmRvdykgJiYgIWhhc2gpIHtcbiAgICAgICAgICAgICAgIHBtLl9iaW5kKCk7XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICBwbS5oYXNoLl9iaW5kKCk7XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgdmFyIGwgPSBwbS5kYXRhKFwibGlzdGVuZXJzLnBvc3RtZXNzYWdlXCIpO1xuICAgICAgICAgICBpZiAoIWwpIHtcbiAgICAgICAgICAgICAgIGwgPSB7fTtcbiAgICAgICAgICAgICAgIHBtLmRhdGEoXCJsaXN0ZW5lcnMucG9zdG1lc3NhZ2VcIiwgbCk7XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgdmFyIGZucyA9IGxbdHlwZV07XG4gICAgICAgICAgIGlmICghZm5zKSB7XG4gICAgICAgICAgICAgICBmbnMgPSBbXTtcbiAgICAgICAgICAgICAgIGxbdHlwZV0gPSBmbnM7XG4gICAgICAgICAgIH1cbiAgICAgICAgICAgZm5zLnB1c2goe2ZuOmZuLCBjYWxsYmFjazogaXNDYWxsYmFjaywgb3JpZ2luOm9yaWdpbiB8fCAkLnBtLm9yaWdpbn0pO1xuICAgICAgICAgfSxcblxuICAgICAgICAgdW5iaW5kOiBmdW5jdGlvbih0eXBlLCBmbikge1xuICAgICAgICAgICAgIHZhciBsID0gcG0uZGF0YShcImxpc3RlbmVycy5wb3N0bWVzc2FnZVwiKTtcbiAgICAgICAgICAgICBpZiAobCkge1xuICAgICAgICAgICAgICAgICBpZiAodHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHNwZWNpZmljIGxpc3RlbmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZucyA9IGxbdHlwZV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbSA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTAsbGVuPWZucy5sZW5ndGg7IGk8bGVuOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvID0gZm5zW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG8uZm4gIT09IGZuKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbS5wdXNoKG8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxbdHlwZV0gPSBtO1xuICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBhbGwgbGlzdGVuZXJzIGJ5IHR5cGVcbiAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgbFt0eXBlXTtcbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgIC8vIHVuYmluZCBhbGwgbGlzdGVuZXJzIG9mIGFsbCB0eXBlXG4gICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGxbaV07XG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICB9XG4gICAgICAgICB9LFxuXG4gICAgICAgICBkYXRhOiBmdW5jdGlvbihrLCB2KSB7XG4gICAgICAgICAgICAgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICByZXR1cm4gcG0uX2RhdGFba107XG4gICAgICAgICAgICAgfVxuICAgICAgICAgICAgIHBtLl9kYXRhW2tdID0gdjtcbiAgICAgICAgICAgICByZXR1cm4gdjtcbiAgICAgICAgIH0sXG5cbiAgICAgICAgIF9kYXRhOiB7fSxcblxuICAgICAgICAgX0NIQVJTOiAnMDEyMzQ1Njc4OUFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXonLnNwbGl0KCcnKSxcblxuICAgICAgICAgX3JhbmRvbTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgdmFyIHIgPSBbXTtcbiAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8MzI7IGkrKykge1xuICAgICAgICAgICAgICAgICByW2ldID0gcG0uX0NIQVJTWzAgfCBNYXRoLnJhbmRvbSgpICogMzJdO1xuICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgcmV0dXJuIHIuam9pbihcIlwiKTtcbiAgICAgICAgIH0sXG5cbiAgICAgICAgIF9jYWxsYmFjazogZnVuY3Rpb24oZm4pIHtcbiAgICAgICAgICAgICB2YXIgY2JzID0gcG0uZGF0YShcImNhbGxiYWNrcy5wb3N0bWVzc2FnZVwiKTtcbiAgICAgICAgICAgICBpZiAoIWNicykge1xuICAgICAgICAgICAgICAgICBjYnMgPSB7fTtcbiAgICAgICAgICAgICAgICAgcG0uZGF0YShcImNhbGxiYWNrcy5wb3N0bWVzc2FnZVwiLCBjYnMpO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICB2YXIgciA9IHBtLl9yYW5kb20oKTtcbiAgICAgICAgICAgICBjYnNbcl0gPSBmbjtcbiAgICAgICAgICAgICByZXR1cm4gcjtcbiAgICAgICAgIH0sXG5cbiAgICAgICAgIF9iaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAvLyBhcmUgd2UgYWxyZWFkeSBsaXN0ZW5pbmcgdG8gbWVzc2FnZSBldmVudHMgb24gdGhpcyB3P1xuICAgICAgICAgICAgIGlmICghcG0uZGF0YShcImxpc3RlbmluZy5wb3N0bWVzc2FnZVwiKSkge1xuICAgICAgICAgICAgICAgICBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibWVzc2FnZVwiLCBwbS5fZGlzcGF0Y2gsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICBlbHNlIGlmICh3aW5kb3cuYXR0YWNoRXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5hdHRhY2hFdmVudChcIm9ubWVzc2FnZVwiLCBwbS5fZGlzcGF0Y2gpO1xuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIHBtLmRhdGEoXCJsaXN0ZW5pbmcucG9zdG1lc3NhZ2VcIiwgMSk7XG4gICAgICAgICAgICAgfVxuICAgICAgICAgfSxcblxuICAgICAgICAgX2Rpc3BhdGNoOiBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIiQucG0uZGlzcGF0Y2hcIiwgZSwgdGhpcyk7XG4gICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgdmFyIG1zZyA9IEpTT04ucGFyc2UoZS5kYXRhKTtcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInBvc3RtZXNzYWdlIGRhdGEgaW52YWxpZCBqc29uOiBcIiwgZXgpO1xuICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgfVxuICAgICAgICAgICAgIGlmICghbXNnLnR5cGUpIHtcbiAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwicG9zdG1lc3NhZ2UgbWVzc2FnZSB0eXBlIHJlcXVpcmVkXCIpO1xuICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgfVxuICAgICAgICAgICAgIHZhciBjYnMgPSBwbS5kYXRhKFwiY2FsbGJhY2tzLnBvc3RtZXNzYWdlXCIpIHx8IHt9LFxuICAgICAgICAgICAgIGNiID0gY2JzW21zZy50eXBlXTtcbiAgICAgICAgICAgICBpZiAoY2IpIHtcbiAgICAgICAgICAgICAgICAgY2IobXNnLmRhdGEpO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgdmFyIGwgPSBwbS5kYXRhKFwibGlzdGVuZXJzLnBvc3RtZXNzYWdlXCIpIHx8IHt9O1xuICAgICAgICAgICAgICAgICB2YXIgZm5zID0gbFttc2cudHlwZV0gfHwgW107XG4gICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MCxsZW49Zm5zLmxlbmd0aDsgaTxsZW47IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgdmFyIG8gPSBmbnNbaV07XG4gICAgICAgICAgICAgICAgICAgICBpZiAoby5vcmlnaW4gJiYgby5vcmlnaW4gIT09ICcqJyAmJiBlLm9yaWdpbiAhPT0gby5vcmlnaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJwb3N0bWVzc2FnZSBtZXNzYWdlIG9yaWdpbiBtaXNtYXRjaFwiLCBlLm9yaWdpbiwgby5vcmlnaW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtc2cuZXJyYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBub3RpZnkgcG9zdCBtZXNzYWdlIGVycmJhY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJwb3N0bWVzc2FnZSBvcmlnaW4gbWlzbWF0Y2hcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbjogW2Uub3JpZ2luLCBvLm9yaWdpbl1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG0uc2VuZCh7dGFyZ2V0OmUuc291cmNlLCBkYXRhOmVycm9yLCB0eXBlOm1zZy5lcnJiYWNrfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiBzZW5kUmVwbHkgKCBkYXRhICkge1xuICAgICAgICAgICAgICAgICAgICAgICBpZiAobXNnLmNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBwbS5zZW5kKHt0YXJnZXQ6ZS5zb3VyY2UsIGRhdGE6ZGF0YSwgdHlwZTptc2cuY2FsbGJhY2t9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggby5jYWxsYmFjayApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG8uZm4obXNnLmRhdGEsIHNlbmRSZXBseSwgZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbmRSZXBseSAoIG8uZm4obXNnLmRhdGEsIGUpICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1zZy5lcnJiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vdGlmeSBwb3N0IG1lc3NhZ2UgZXJyYmFja1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbS5zZW5kKHt0YXJnZXQ6ZS5zb3VyY2UsIGRhdGE6ZXgsIHR5cGU6bXNnLmVycmJhY2t9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBleDtcbiAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgfVxuICAgICAgICAgfVxuICAgICB9O1xuXG4gICAgIC8vIGxvY2F0aW9uIGhhc2ggcG9sbGluZ1xuICAgICBwbS5oYXNoID0ge1xuXG4gICAgICAgICBzZW5kOiBmdW5jdGlvbihvcHRpb25zLCBtc2cpIHtcbiAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiaGFzaC5zZW5kXCIsIHRhcmdldF93aW5kb3csIG9wdGlvbnMsIG1zZyk7XG4gICAgICAgICAgICAgdmFyIHRhcmdldF93aW5kb3cgPSBvcHRpb25zLnRhcmdldCxcbiAgICAgICAgICAgICB0YXJnZXRfdXJsID0gb3B0aW9ucy51cmw7XG4gICAgICAgICAgICAgaWYgKCF0YXJnZXRfdXJsKSB7XG4gICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInBvc3RtZXNzYWdlIHRhcmdldCB3aW5kb3cgdXJsIGlzIHJlcXVpcmVkXCIpO1xuICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgfVxuICAgICAgICAgICAgIHRhcmdldF91cmwgPSBwbS5oYXNoLl91cmwodGFyZ2V0X3VybCk7XG4gICAgICAgICAgICAgdmFyIHNvdXJjZV93aW5kb3csXG4gICAgICAgICAgICAgc291cmNlX3VybCA9IHBtLmhhc2guX3VybCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgICAgICAgICAgaWYgKHdpbmRvdyA9PSB0YXJnZXRfd2luZG93LnBhcmVudCkge1xuICAgICAgICAgICAgICAgICBzb3VyY2Vfd2luZG93ID0gXCJwYXJlbnRcIjtcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTAsbGVuPXBhcmVudC5mcmFtZXMubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGYgPSBwYXJlbnQuZnJhbWVzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmID09IHdpbmRvdykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2Vfd2luZG93ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICBjYXRjaChleCkge1xuICAgICAgICAgICAgICAgICAgICAgLy8gT3BlcmE6IHNlY3VyaXR5IGVycm9yIHRyeWluZyB0byBhY2Nlc3MgcGFyZW50LmZyYW1lcyB4LW9yaWdpblxuICAgICAgICAgICAgICAgICAgICAgLy8ganVzZSB1c2Ugd2luZG93Lm5hbWVcbiAgICAgICAgICAgICAgICAgICAgIHNvdXJjZV93aW5kb3cgPSB3aW5kb3cubmFtZTtcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICBpZiAoc291cmNlX3dpbmRvdyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihcInBvc3RtZXNzYWdlIHdpbmRvd3MgbXVzdCBiZSBkaXJlY3QgcGFyZW50L2NoaWxkIHdpbmRvd3MgYW5kIHRoZSBjaGlsZCBtdXN0IGJlIGF2YWlsYWJsZSB0aHJvdWdoIHRoZSBwYXJlbnQgd2luZG93LmZyYW1lcyBsaXN0XCIpO1xuICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgfVxuICAgICAgICAgICAgIHZhciBoYXNobWVzc2FnZSA9IHtcbiAgICAgICAgICAgICAgICAgXCJ4LXJlcXVlc3RlZC13aXRoXCI6IFwicG9zdG1lc3NhZ2VcIixcbiAgICAgICAgICAgICAgICAgc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICAgICBuYW1lOiBzb3VyY2Vfd2luZG93LFxuICAgICAgICAgICAgICAgICAgICAgdXJsOiBzb3VyY2VfdXJsXG4gICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgIHBvc3RtZXNzYWdlOiBtc2dcbiAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgIHZhciBoYXNoX2lkID0gXCIjeC1wb3N0bWVzc2FnZS1pZD1cIiArIHBtLl9yYW5kb20oKTtcbiAgICAgICAgICAgICB0YXJnZXRfd2luZG93LmxvY2F0aW9uID0gdGFyZ2V0X3VybCArIGhhc2hfaWQgKyBlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoaGFzaG1lc3NhZ2UpKTtcbiAgICAgICAgIH0sXG5cbiAgICAgICAgIF9yZWdleDogL15cXCN4XFwtcG9zdG1lc3NhZ2VcXC1pZFxcPShcXHd7MzJ9KS8sXG5cbiAgICAgICAgIF9yZWdleF9sZW46IFwiI3gtcG9zdG1lc3NhZ2UtaWQ9XCIubGVuZ3RoICsgMzIsXG5cbiAgICAgICAgIF9iaW5kOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAvLyBhcmUgd2UgYWxyZWFkeSBsaXN0ZW5pbmcgdG8gbWVzc2FnZSBldmVudHMgb24gdGhpcyB3P1xuICAgICAgICAgICAgIGlmICghcG0uZGF0YShcInBvbGxpbmcucG9zdG1lc3NhZ2VcIikpIHtcbiAgICAgICAgICAgICAgICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaGFzaCA9IFwiXCIgKyB3aW5kb3cubG9jYXRpb24uaGFzaCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0gPSBwbS5oYXNoLl9yZWdleC5leGVjKGhhc2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaWQgPSBtWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwbS5oYXNoLl9sYXN0ICE9PSBpZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwbS5oYXNoLl9sYXN0ID0gaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBtLmhhc2guX2Rpc3BhdGNoKGhhc2guc3Vic3RyaW5nKHBtLmhhc2guX3JlZ2V4X2xlbikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwgJC5wbS5wb2xsIHx8IDIwMCk7XG4gICAgICAgICAgICAgICAgIHBtLmRhdGEoXCJwb2xsaW5nLnBvc3RtZXNzYWdlXCIsIDEpO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgIH0sXG5cbiAgICAgICAgIF9kaXNwYXRjaDogZnVuY3Rpb24oaGFzaCkge1xuICAgICAgICAgICAgIGlmICghaGFzaCkge1xuICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgfVxuICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgIGhhc2ggPSBKU09OLnBhcnNlKGRlY29kZVVSSUNvbXBvbmVudChoYXNoKSk7XG4gICAgICAgICAgICAgICAgIGlmICghKGhhc2hbJ3gtcmVxdWVzdGVkLXdpdGgnXSA9PT0gJ3Bvc3RtZXNzYWdlJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICBoYXNoLnNvdXJjZSAmJiBoYXNoLnNvdXJjZS5uYW1lICE9IG51bGwgJiYgaGFzaC5zb3VyY2UudXJsICYmIGhhc2gucG9zdG1lc3NhZ2UpKSB7XG4gICAgICAgICAgICAgICAgICAgICAvLyBpZ25vcmUgc2luY2UgaGFzaCBjb3VsZCd2ZSBjb21lIGZyb20gc29tZXdoZXJlIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICBjYXRjaCAoZXgpIHtcbiAgICAgICAgICAgICAgICAgLy8gaWdub3JlIHNpbmNlIGhhc2ggY291bGQndmUgY29tZSBmcm9tIHNvbWV3aGVyZSBlbHNlXG4gICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgdmFyIG1zZyA9IGhhc2gucG9zdG1lc3NhZ2UsXG4gICAgICAgICAgICAgY2JzID0gcG0uZGF0YShcImNhbGxiYWNrcy5wb3N0bWVzc2FnZVwiKSB8fCB7fSxcbiAgICAgICAgICAgICBjYiA9IGNic1ttc2cudHlwZV07XG4gICAgICAgICAgICAgaWYgKGNiKSB7XG4gICAgICAgICAgICAgICAgIGNiKG1zZy5kYXRhKTtcbiAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgIHZhciBzb3VyY2Vfd2luZG93O1xuICAgICAgICAgICAgICAgICBpZiAoaGFzaC5zb3VyY2UubmFtZSA9PT0gXCJwYXJlbnRcIikge1xuICAgICAgICAgICAgICAgICAgICAgc291cmNlX3dpbmRvdyA9IHdpbmRvdy5wYXJlbnQ7XG4gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICBzb3VyY2Vfd2luZG93ID0gd2luZG93LmZyYW1lc1toYXNoLnNvdXJjZS5uYW1lXTtcbiAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICB2YXIgbCA9IHBtLmRhdGEoXCJsaXN0ZW5lcnMucG9zdG1lc3NhZ2VcIikgfHwge307XG4gICAgICAgICAgICAgICAgIHZhciBmbnMgPSBsW21zZy50eXBlXSB8fCBbXTtcbiAgICAgICAgICAgICAgICAgZm9yICh2YXIgaT0wLGxlbj1mbnMubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICB2YXIgbyA9IGZuc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgIGlmIChvLm9yaWdpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvcmlnaW4gPSAvaHR0cHM/XFw6XFwvXFwvW15cXC9dKi8uZXhlYyhoYXNoLnNvdXJjZS51cmwpWzBdO1xuICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvLm9yaWdpbiAhPT0gJyonICYmIG9yaWdpbiAhPT0gby5vcmlnaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKFwicG9zdG1lc3NhZ2UgbWVzc2FnZSBvcmlnaW4gbWlzbWF0Y2hcIiwgb3JpZ2luLCBvLm9yaWdpbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtc2cuZXJyYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm90aWZ5IHBvc3QgbWVzc2FnZSBlcnJiYWNrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJwb3N0bWVzc2FnZSBvcmlnaW4gbWlzbWF0Y2hcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmlnaW46IFtvcmlnaW4sIG8ub3JpZ2luXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBtLnNlbmQoe3RhcmdldDpzb3VyY2Vfd2luZG93LCBkYXRhOmVycm9yLCB0eXBlOm1zZy5lcnJiYWNrLCBoYXNoOnRydWUsIHVybDpoYXNoLnNvdXJjZS51cmx9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHNlbmRSZXBseSAoIGRhdGEgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgIGlmIChtc2cuY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICBwbS5zZW5kKHt0YXJnZXQ6c291cmNlX3dpbmRvdywgZGF0YTpkYXRhLCB0eXBlOm1zZy5jYWxsYmFjaywgaGFzaDp0cnVlLCB1cmw6aGFzaC5zb3VyY2UudXJsfSk7XG4gICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIG8uY2FsbGJhY2sgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBvLmZuKG1zZy5kYXRhLCBzZW5kUmVwbHkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBzZW5kUmVwbHkgKCBvLmZuKG1zZy5kYXRhKSApO1xuICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgIGNhdGNoIChleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtc2cuZXJyYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBub3RpZnkgcG9zdCBtZXNzYWdlIGVycmJhY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcG0uc2VuZCh7dGFyZ2V0OnNvdXJjZV93aW5kb3csIGRhdGE6ZXgsIHR5cGU6bXNnLmVycmJhY2ssIGhhc2g6dHJ1ZSwgdXJsOmhhc2guc291cmNlLnVybH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IGV4O1xuICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICB9XG4gICAgICAgICB9LFxuXG4gICAgICAgICBfdXJsOiBmdW5jdGlvbih1cmwpIHtcbiAgICAgICAgICAgICAvLyB1cmwgbWludXMgaGFzaCBwYXJ0XG4gICAgICAgICAgICAgcmV0dXJuIChcIlwiK3VybCkucmVwbGFjZSgvIy4qJC8sIFwiXCIpO1xuICAgICAgICAgfVxuXG4gICAgIH07XG5cbiAgICAgJC5leHRlbmQocG0sIHtcbiAgICAgICAgICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0OiBudWxsLCAgLyogdGFyZ2V0IHdpbmRvdyAocmVxdWlyZWQpICovXG4gICAgICAgICAgICAgICAgICAgICAgdXJsOiBudWxsLCAgICAgLyogdGFyZ2V0IHdpbmRvdyB1cmwgKHJlcXVpcmVkIGlmIG5vIHdpbmRvdy5wb3N0TWVzc2FnZSBvciBoYXNoID09IHRydWUpICovXG4gICAgICAgICAgICAgICAgICAgICAgdHlwZTogbnVsbCwgICAgLyogbWVzc2FnZSB0eXBlIChyZXF1aXJlZCkgKi9cbiAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBudWxsLCAgICAvKiBtZXNzYWdlIGRhdGEgKHJlcXVpcmVkKSAqL1xuICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IG51bGwsIC8qIHN1Y2Nlc3MgY2FsbGJhY2sgKG9wdGlvbmFsKSAqL1xuICAgICAgICAgICAgICAgICAgICAgIGVycm9yOiBudWxsLCAgIC8qIGVycm9yIGNhbGxiYWNrIChvcHRpb25hbCkgKi9cbiAgICAgICAgICAgICAgICAgICAgICBvcmlnaW46IFwiKlwiLCAgIC8qIHBvc3RtZXNzYWdlIG9yaWdpbiAob3B0aW9uYWwpICovXG4gICAgICAgICAgICAgICAgICAgICAgaGFzaDogZmFsc2UgICAgLyogdXNlIGxvY2F0aW9uIGhhc2ggZm9yIG1lc3NhZ2UgcGFzc2luZyAob3B0aW9uYWwpICovXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0pO1xuXG4gfSkodGhpcywgdHlwZW9mIGpRdWVyeSA9PT0gXCJ1bmRlZmluZWRcIiA/IE5PX0pRVUVSWSA6IGpRdWVyeSk7XG5cbi8qKlxuICogaHR0cDovL3d3dy5KU09OLm9yZy9qc29uMi5qc1xuICoqL1xuaWYgKCEgKFwiSlNPTlwiIGluIHdpbmRvdyAmJiB3aW5kb3cuSlNPTikpe0pTT049e319KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gZihuKXtyZXR1cm4gbjwxMD9cIjBcIituOm59aWYodHlwZW9mIERhdGUucHJvdG90eXBlLnRvSlNPTiE9PVwiZnVuY3Rpb25cIil7RGF0ZS5wcm90b3R5cGUudG9KU09OPWZ1bmN0aW9uKGtleSl7cmV0dXJuIHRoaXMuZ2V0VVRDRnVsbFllYXIoKStcIi1cIitmKHRoaXMuZ2V0VVRDTW9udGgoKSsxKStcIi1cIitmKHRoaXMuZ2V0VVRDRGF0ZSgpKStcIlRcIitmKHRoaXMuZ2V0VVRDSG91cnMoKSkrXCI6XCIrZih0aGlzLmdldFVUQ01pbnV0ZXMoKSkrXCI6XCIrZih0aGlzLmdldFVUQ1NlY29uZHMoKSkrXCJaXCJ9O1N0cmluZy5wcm90b3R5cGUudG9KU09OPU51bWJlci5wcm90b3R5cGUudG9KU09OPUJvb2xlYW4ucHJvdG90eXBlLnRvSlNPTj1mdW5jdGlvbihrZXkpe3JldHVybiB0aGlzLnZhbHVlT2YoKX19dmFyIGN4PS9bXFx1MDAwMFxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nLGVzY2FwYWJsZT0vW1xcXFxcXFwiXFx4MDAtXFx4MWZcXHg3Zi1cXHg5ZlxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nLGdhcCxpbmRlbnQsbWV0YT17XCJcXGJcIjpcIlxcXFxiXCIsXCJcXHRcIjpcIlxcXFx0XCIsXCJcXG5cIjpcIlxcXFxuXCIsXCJcXGZcIjpcIlxcXFxmXCIsXCJcXHJcIjpcIlxcXFxyXCIsJ1wiJzonXFxcXFwiJyxcIlxcXFxcIjpcIlxcXFxcXFxcXCJ9LHJlcDtmdW5jdGlvbiBxdW90ZShzdHJpbmcpe2VzY2FwYWJsZS5sYXN0SW5kZXg9MDtyZXR1cm4gZXNjYXBhYmxlLnRlc3Qoc3RyaW5nKT8nXCInK3N0cmluZy5yZXBsYWNlKGVzY2FwYWJsZSxmdW5jdGlvbihhKXt2YXIgYz1tZXRhW2FdO3JldHVybiB0eXBlb2YgYz09PVwic3RyaW5nXCI/YzpcIlxcXFx1XCIrKFwiMDAwMFwiK2EuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KX0pKydcIic6J1wiJytzdHJpbmcrJ1wiJ31mdW5jdGlvbiBzdHIoa2V5LGhvbGRlcil7dmFyIGksayx2LGxlbmd0aCxtaW5kPWdhcCxwYXJ0aWFsLHZhbHVlPWhvbGRlcltrZXldO2lmKHZhbHVlJiZ0eXBlb2YgdmFsdWU9PT1cIm9iamVjdFwiJiZ0eXBlb2YgdmFsdWUudG9KU09OPT09XCJmdW5jdGlvblwiKXt2YWx1ZT12YWx1ZS50b0pTT04oa2V5KX1pZih0eXBlb2YgcmVwPT09XCJmdW5jdGlvblwiKXt2YWx1ZT1yZXAuY2FsbChob2xkZXIsa2V5LHZhbHVlKX1zd2l0Y2godHlwZW9mIHZhbHVlKXtjYXNlXCJzdHJpbmdcIjpyZXR1cm4gcXVvdGUodmFsdWUpO2Nhc2VcIm51bWJlclwiOnJldHVybiBpc0Zpbml0ZSh2YWx1ZSk/U3RyaW5nKHZhbHVlKTpcIm51bGxcIjtjYXNlXCJib29sZWFuXCI6Y2FzZVwibnVsbFwiOnJldHVybiBTdHJpbmcodmFsdWUpO2Nhc2VcIm9iamVjdFwiOmlmKCF2YWx1ZSl7cmV0dXJuXCJudWxsXCJ9Z2FwKz1pbmRlbnQ7cGFydGlhbD1bXTtpZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KHZhbHVlKT09PVwiW29iamVjdCBBcnJheV1cIil7bGVuZ3RoPXZhbHVlLmxlbmd0aDtmb3IoaT0wO2k8bGVuZ3RoO2krPTEpe3BhcnRpYWxbaV09c3RyKGksdmFsdWUpfHxcIm51bGxcIn12PXBhcnRpYWwubGVuZ3RoPT09MD9cIltdXCI6Z2FwP1wiW1xcblwiK2dhcCtwYXJ0aWFsLmpvaW4oXCIsXFxuXCIrZ2FwKStcIlxcblwiK21pbmQrXCJdXCI6XCJbXCIrcGFydGlhbC5qb2luKFwiLFwiKStcIl1cIjtnYXA9bWluZDtyZXR1cm4gdn1pZihyZXAmJnR5cGVvZiByZXA9PT1cIm9iamVjdFwiKXtsZW5ndGg9cmVwLmxlbmd0aDtmb3IoaT0wO2k8bGVuZ3RoO2krPTEpe2s9cmVwW2ldO2lmKHR5cGVvZiBrPT09XCJzdHJpbmdcIil7dj1zdHIoayx2YWx1ZSk7aWYodil7cGFydGlhbC5wdXNoKHF1b3RlKGspKyhnYXA/XCI6IFwiOlwiOlwiKSt2KX19fX1lbHNle2ZvcihrIGluIHZhbHVlKXtpZihPYmplY3QuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSxrKSl7dj1zdHIoayx2YWx1ZSk7aWYodil7cGFydGlhbC5wdXNoKHF1b3RlKGspKyhnYXA/XCI6IFwiOlwiOlwiKSt2KX19fX12PXBhcnRpYWwubGVuZ3RoPT09MD9cInt9XCI6Z2FwP1wie1xcblwiK2dhcCtwYXJ0aWFsLmpvaW4oXCIsXFxuXCIrZ2FwKStcIlxcblwiK21pbmQrXCJ9XCI6XCJ7XCIrcGFydGlhbC5qb2luKFwiLFwiKStcIn1cIjtnYXA9bWluZDtyZXR1cm4gdn19aWYodHlwZW9mIEpTT04uc3RyaW5naWZ5IT09XCJmdW5jdGlvblwiKXtKU09OLnN0cmluZ2lmeT1mdW5jdGlvbih2YWx1ZSxyZXBsYWNlcixzcGFjZSl7dmFyIGk7Z2FwPVwiXCI7aW5kZW50PVwiXCI7aWYodHlwZW9mIHNwYWNlPT09XCJudW1iZXJcIil7Zm9yKGk9MDtpPHNwYWNlO2krPTEpe2luZGVudCs9XCIgXCJ9fWVsc2V7aWYodHlwZW9mIHNwYWNlPT09XCJzdHJpbmdcIil7aW5kZW50PXNwYWNlfX1yZXA9cmVwbGFjZXI7aWYocmVwbGFjZXImJnR5cGVvZiByZXBsYWNlciE9PVwiZnVuY3Rpb25cIiYmKHR5cGVvZiByZXBsYWNlciE9PVwib2JqZWN0XCJ8fHR5cGVvZiByZXBsYWNlci5sZW5ndGghPT1cIm51bWJlclwiKSl7dGhyb3cgbmV3IEVycm9yKFwiSlNPTi5zdHJpbmdpZnlcIil9cmV0dXJuIHN0cihcIlwiLHtcIlwiOnZhbHVlfSl9fWlmKHR5cGVvZiBKU09OLnBhcnNlIT09XCJmdW5jdGlvblwiKXtKU09OLnBhcnNlPWZ1bmN0aW9uKHRleHQscmV2aXZlcil7dmFyIGo7ZnVuY3Rpb24gd2Fsayhob2xkZXIsa2V5KXt2YXIgayx2LHZhbHVlPWhvbGRlcltrZXldO2lmKHZhbHVlJiZ0eXBlb2YgdmFsdWU9PT1cIm9iamVjdFwiKXtmb3IoayBpbiB2YWx1ZSl7aWYoT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsaykpe3Y9d2Fsayh2YWx1ZSxrKTtpZih2IT09dW5kZWZpbmVkKXt2YWx1ZVtrXT12fWVsc2V7ZGVsZXRlIHZhbHVlW2tdfX19fXJldHVybiByZXZpdmVyLmNhbGwoaG9sZGVyLGtleSx2YWx1ZSl9Y3gubGFzdEluZGV4PTA7aWYoY3gudGVzdCh0ZXh0KSl7dGV4dD10ZXh0LnJlcGxhY2UoY3gsZnVuY3Rpb24oYSl7cmV0dXJuXCJcXFxcdVwiKyhcIjAwMDBcIithLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCl9KX1pZigvXltcXF0sOnt9XFxzXSokLy50ZXN0KHRleHQucmVwbGFjZSgvXFxcXCg/OltcIlxcXFxcXC9iZm5ydF18dVswLTlhLWZBLUZdezR9KS9nLFwiQFwiKS5yZXBsYWNlKC9cIlteXCJcXFxcXFxuXFxyXSpcInx0cnVlfGZhbHNlfG51bGx8LT9cXGQrKD86XFwuXFxkKik/KD86W2VFXVsrXFwtXT9cXGQrKT8vZyxcIl1cIikucmVwbGFjZSgvKD86Xnw6fCwpKD86XFxzKlxcWykrL2csXCJcIikpKXtqPWV2YWwoXCIoXCIrdGV4dCtcIilcIik7cmV0dXJuIHR5cGVvZiByZXZpdmVyPT09XCJmdW5jdGlvblwiP3dhbGsoe1wiXCI6an0sXCJcIik6an10aHJvdyBuZXcgU3ludGF4RXJyb3IoXCJKU09OLnBhcnNlXCIpfX19KCkpO1xuIiwidmFyIGdsb2JhbCA9XG4gICh0eXBlb2YgZ2xvYmFsVGhpcyAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2xvYmFsVGhpcykgfHxcbiAgKHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyAmJiBzZWxmKSB8fFxuICAodHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2xvYmFsKVxuXG52YXIgc3VwcG9ydCA9IHtcbiAgc2VhcmNoUGFyYW1zOiAnVVJMU2VhcmNoUGFyYW1zJyBpbiBnbG9iYWwsXG4gIGl0ZXJhYmxlOiAnU3ltYm9sJyBpbiBnbG9iYWwgJiYgJ2l0ZXJhdG9yJyBpbiBTeW1ib2wsXG4gIGJsb2I6XG4gICAgJ0ZpbGVSZWFkZXInIGluIGdsb2JhbCAmJlxuICAgICdCbG9iJyBpbiBnbG9iYWwgJiZcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICB0cnkge1xuICAgICAgICBuZXcgQmxvYigpXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pKCksXG4gIGZvcm1EYXRhOiAnRm9ybURhdGEnIGluIGdsb2JhbCxcbiAgYXJyYXlCdWZmZXI6ICdBcnJheUJ1ZmZlcicgaW4gZ2xvYmFsXG59XG5cbmZ1bmN0aW9uIGlzRGF0YVZpZXcob2JqKSB7XG4gIHJldHVybiBvYmogJiYgRGF0YVZpZXcucHJvdG90eXBlLmlzUHJvdG90eXBlT2Yob2JqKVxufVxuXG5pZiAoc3VwcG9ydC5hcnJheUJ1ZmZlcikge1xuICB2YXIgdmlld0NsYXNzZXMgPSBbXG4gICAgJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQ4Q2xhbXBlZEFycmF5XScsXG4gICAgJ1tvYmplY3QgSW50MTZBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgJ1tvYmplY3QgSW50MzJBcnJheV0nLFxuICAgICdbb2JqZWN0IFVpbnQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgJ1tvYmplY3QgRmxvYXQ2NEFycmF5XSdcbiAgXVxuXG4gIHZhciBpc0FycmF5QnVmZmVyVmlldyA9XG4gICAgQXJyYXlCdWZmZXIuaXNWaWV3IHx8XG4gICAgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHZpZXdDbGFzc2VzLmluZGV4T2YoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikpID4gLTFcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZU5hbWUobmFtZSkge1xuICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgbmFtZSA9IFN0cmluZyhuYW1lKVxuICB9XG4gIGlmICgvW15hLXowLTlcXC0jJCUmJyorLl5fYHx+IV0vaS50ZXN0KG5hbWUpIHx8IG5hbWUgPT09ICcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWUnKVxuICB9XG4gIHJldHVybiBuYW1lLnRvTG93ZXJDYXNlKClcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgfVxuICByZXR1cm4gdmFsdWVcbn1cblxuLy8gQnVpbGQgYSBkZXN0cnVjdGl2ZSBpdGVyYXRvciBmb3IgdGhlIHZhbHVlIGxpc3RcbmZ1bmN0aW9uIGl0ZXJhdG9yRm9yKGl0ZW1zKSB7XG4gIHZhciBpdGVyYXRvciA9IHtcbiAgICBuZXh0OiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciB2YWx1ZSA9IGl0ZW1zLnNoaWZ0KClcbiAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGl0ZXJhdG9yXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBIZWFkZXJzKGhlYWRlcnMpIHtcbiAgdGhpcy5tYXAgPSB7fVxuXG4gIGlmIChoZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycykge1xuICAgIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpXG4gICAgfSwgdGhpcylcbiAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGhlYWRlcnMpKSB7XG4gICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgdGhpcy5hcHBlbmQoaGVhZGVyWzBdLCBoZWFkZXJbMV0pXG4gICAgfSwgdGhpcylcbiAgfSBlbHNlIGlmIChoZWFkZXJzKSB7XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICB0aGlzLmFwcGVuZChuYW1lLCBoZWFkZXJzW25hbWVdKVxuICAgIH0sIHRoaXMpXG4gIH1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgbmFtZSA9IG5vcm1hbGl6ZU5hbWUobmFtZSlcbiAgdmFsdWUgPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbiAgdmFyIG9sZFZhbHVlID0gdGhpcy5tYXBbbmFtZV1cbiAgdGhpcy5tYXBbbmFtZV0gPSBvbGRWYWx1ZSA/IG9sZFZhbHVlICsgJywgJyArIHZhbHVlIDogdmFsdWVcbn1cblxuSGVhZGVycy5wcm90b3R5cGVbJ2RlbGV0ZSddID0gZnVuY3Rpb24obmFtZSkge1xuICBkZWxldGUgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24obmFtZSkge1xuICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICByZXR1cm4gdGhpcy5oYXMobmFtZSkgPyB0aGlzLm1hcFtuYW1lXSA6IG51bGxcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xuICByZXR1cm4gdGhpcy5tYXAuaGFzT3duUHJvcGVydHkobm9ybWFsaXplTmFtZShuYW1lKSlcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV0gPSBub3JtYWxpemVWYWx1ZSh2YWx1ZSlcbn1cblxuSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gIGZvciAodmFyIG5hbWUgaW4gdGhpcy5tYXApIHtcbiAgICBpZiAodGhpcy5tYXAuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdGhpcy5tYXBbbmFtZV0sIG5hbWUsIHRoaXMpXG4gICAgfVxuICB9XG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmtleXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgaXRlbXMucHVzaChuYW1lKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLnZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaXRlbXMgPSBbXVxuICB0aGlzLmZvckVhY2goZnVuY3Rpb24odmFsdWUpIHtcbiAgICBpdGVtcy5wdXNoKHZhbHVlKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbkhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGl0ZW1zID0gW11cbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgaXRlbXMucHVzaChbbmFtZSwgdmFsdWVdKVxuICB9KVxuICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG59XG5cbmlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gIEhlYWRlcnMucHJvdG90eXBlW1N5bWJvbC5pdGVyYXRvcl0gPSBIZWFkZXJzLnByb3RvdHlwZS5lbnRyaWVzXG59XG5cbmZ1bmN0aW9uIGNvbnN1bWVkKGJvZHkpIHtcbiAgaWYgKGJvZHkuYm9keVVzZWQpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXG4gIH1cbiAgYm9keS5ib2R5VXNlZCA9IHRydWVcbn1cblxuZnVuY3Rpb24gZmlsZVJlYWRlclJlYWR5KHJlYWRlcikge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVzb2x2ZShyZWFkZXIucmVzdWx0KVxuICAgIH1cbiAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmVqZWN0KHJlYWRlci5lcnJvcilcbiAgICB9XG4gIH0pXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNBcnJheUJ1ZmZlcihibG9iKSB7XG4gIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gIHZhciBwcm9taXNlID0gZmlsZVJlYWRlclJlYWR5KHJlYWRlcilcbiAgcmVhZGVyLnJlYWRBc0FycmF5QnVmZmVyKGJsb2IpXG4gIHJldHVybiBwcm9taXNlXG59XG5cbmZ1bmN0aW9uIHJlYWRCbG9iQXNUZXh0KGJsb2IpIHtcbiAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICByZWFkZXIucmVhZEFzVGV4dChibG9iKVxuICByZXR1cm4gcHJvbWlzZVxufVxuXG5mdW5jdGlvbiByZWFkQXJyYXlCdWZmZXJBc1RleHQoYnVmKSB7XG4gIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICB2YXIgY2hhcnMgPSBuZXcgQXJyYXkodmlldy5sZW5ndGgpXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aWV3Lmxlbmd0aDsgaSsrKSB7XG4gICAgY2hhcnNbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZpZXdbaV0pXG4gIH1cbiAgcmV0dXJuIGNoYXJzLmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGJ1ZmZlckNsb25lKGJ1Zikge1xuICBpZiAoYnVmLnNsaWNlKSB7XG4gICAgcmV0dXJuIGJ1Zi5zbGljZSgwKVxuICB9IGVsc2Uge1xuICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmLmJ5dGVMZW5ndGgpXG4gICAgdmlldy5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmKSlcbiAgICByZXR1cm4gdmlldy5idWZmZXJcbiAgfVxufVxuXG5mdW5jdGlvbiBCb2R5KCkge1xuICB0aGlzLmJvZHlVc2VkID0gZmFsc2VcblxuICB0aGlzLl9pbml0Qm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICAvKlxuICAgICAgZmV0Y2gtbW9jayB3cmFwcyB0aGUgUmVzcG9uc2Ugb2JqZWN0IGluIGFuIEVTNiBQcm94eSB0b1xuICAgICAgcHJvdmlkZSB1c2VmdWwgdGVzdCBoYXJuZXNzIGZlYXR1cmVzIHN1Y2ggYXMgZmx1c2guIEhvd2V2ZXIsIG9uXG4gICAgICBFUzUgYnJvd3NlcnMgd2l0aG91dCBmZXRjaCBvciBQcm94eSBzdXBwb3J0IHBvbGx5ZmlsbHMgbXVzdCBiZSB1c2VkO1xuICAgICAgdGhlIHByb3h5LXBvbGx5ZmlsbCBpcyB1bmFibGUgdG8gcHJveHkgYW4gYXR0cmlidXRlIHVubGVzcyBpdCBleGlzdHNcbiAgICAgIG9uIHRoZSBvYmplY3QgYmVmb3JlIHRoZSBQcm94eSBpcyBjcmVhdGVkLiBUaGlzIGNoYW5nZSBlbnN1cmVzXG4gICAgICBSZXNwb25zZS5ib2R5VXNlZCBleGlzdHMgb24gdGhlIGluc3RhbmNlLCB3aGlsZSBtYWludGFpbmluZyB0aGVcbiAgICAgIHNlbWFudGljIG9mIHNldHRpbmcgUmVxdWVzdC5ib2R5VXNlZCBpbiB0aGUgY29uc3RydWN0b3IgYmVmb3JlXG4gICAgICBfaW5pdEJvZHkgaXMgY2FsbGVkLlxuICAgICovXG4gICAgdGhpcy5ib2R5VXNlZCA9IHRoaXMuYm9keVVzZWRcbiAgICB0aGlzLl9ib2R5SW5pdCA9IGJvZHlcbiAgICBpZiAoIWJvZHkpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5fYm9keVRleHQgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgdGhpcy5fYm9keUJsb2IgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmZvcm1EYXRhICYmIEZvcm1EYXRhLnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LnNlYXJjaFBhcmFtcyAmJiBVUkxTZWFyY2hQYXJhbXMucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkpIHtcbiAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keS50b1N0cmluZygpXG4gICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIHN1cHBvcnQuYmxvYiAmJiBpc0RhdGFWaWV3KGJvZHkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5LmJ1ZmZlcilcbiAgICAgIC8vIElFIDEwLTExIGNhbid0IGhhbmRsZSBhIERhdGFWaWV3IGJvZHkuXG4gICAgICB0aGlzLl9ib2R5SW5pdCA9IG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKVxuICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlciAmJiAoQXJyYXlCdWZmZXIucHJvdG90eXBlLmlzUHJvdG90eXBlT2YoYm9keSkgfHwgaXNBcnJheUJ1ZmZlclZpZXcoYm9keSkpKSB7XG4gICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIgPSBidWZmZXJDbG9uZShib2R5KVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYm9keSlcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKSB7XG4gICAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QmxvYiAmJiB0aGlzLl9ib2R5QmxvYi50eXBlKSB7XG4gICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsIHRoaXMuX2JvZHlCbG9iLnR5cGUpXG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChzdXBwb3J0LmJsb2IpIHtcbiAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciByZWplY3RlZCA9IGNvbnN1bWVkKHRoaXMpXG4gICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxuICAgICAgfSBlbHNlIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQmxvYihbdGhpcy5fYm9keUFycmF5QnVmZmVyXSkpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgYmxvYicpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIGlmICh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpIHtcbiAgICAgICAgdmFyIGlzQ29uc3VtZWQgPSBjb25zdW1lZCh0aGlzKVxuICAgICAgICBpZiAoaXNDb25zdW1lZCkge1xuICAgICAgICAgIHJldHVybiBpc0NvbnN1bWVkXG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShcbiAgICAgICAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlci5idWZmZXIuc2xpY2UoXG4gICAgICAgICAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlci5ieXRlT2Zmc2V0LFxuICAgICAgICAgICAgICB0aGlzLl9ib2R5QXJyYXlCdWZmZXIuYnl0ZU9mZnNldCArIHRoaXMuX2JvZHlBcnJheUJ1ZmZlci5ieXRlTGVuZ3RoXG4gICAgICAgICAgICApXG4gICAgICAgICAgKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUFycmF5QnVmZmVyKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdGhpcy5ibG9iKCkudGhlbihyZWFkQmxvYkFzQXJyYXlCdWZmZXIpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGhpcy50ZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgIHJldHVybiByZWplY3RlZFxuICAgIH1cblxuICAgIGlmICh0aGlzLl9ib2R5QmxvYikge1xuICAgICAgcmV0dXJuIHJlYWRCbG9iQXNUZXh0KHRoaXMuX2JvZHlCbG9iKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHJlYWRBcnJheUJ1ZmZlckFzVGV4dCh0aGlzLl9ib2R5QXJyYXlCdWZmZXIpKVxuICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUZvcm1EYXRhKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgdGV4dCcpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keVRleHQpXG4gICAgfVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuZm9ybURhdGEpIHtcbiAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdGhpcy50ZXh0KCkudGhlbihkZWNvZGUpXG4gICAgfVxuICB9XG5cbiAgdGhpcy5qc29uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMudGV4dCgpLnRoZW4oSlNPTi5wYXJzZSlcbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIEhUVFAgbWV0aG9kcyB3aG9zZSBjYXBpdGFsaXphdGlvbiBzaG91bGQgYmUgbm9ybWFsaXplZFxudmFyIG1ldGhvZHMgPSBbJ0RFTEVURScsICdHRVQnLCAnSEVBRCcsICdPUFRJT05TJywgJ1BPU1QnLCAnUFVUJ11cblxuZnVuY3Rpb24gbm9ybWFsaXplTWV0aG9kKG1ldGhvZCkge1xuICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gIHJldHVybiBtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSA/IHVwY2FzZWQgOiBtZXRob2Rcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFJlcXVlc3QoaW5wdXQsIG9wdGlvbnMpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJlcXVlc3QpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUGxlYXNlIHVzZSB0aGUgXCJuZXdcIiBvcGVyYXRvciwgdGhpcyBET00gb2JqZWN0IGNvbnN0cnVjdG9yIGNhbm5vdCBiZSBjYWxsZWQgYXMgYSBmdW5jdGlvbi4nKVxuICB9XG5cbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgdmFyIGJvZHkgPSBvcHRpb25zLmJvZHlcblxuICBpZiAoaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB7XG4gICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBbHJlYWR5IHJlYWQnKVxuICAgIH1cbiAgICB0aGlzLnVybCA9IGlucHV0LnVybFxuICAgIHRoaXMuY3JlZGVudGlhbHMgPSBpbnB1dC5jcmVkZW50aWFsc1xuICAgIGlmICghb3B0aW9ucy5oZWFkZXJzKSB7XG4gICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxuICAgIH1cbiAgICB0aGlzLm1ldGhvZCA9IGlucHV0Lm1ldGhvZFxuICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcbiAgICB0aGlzLnNpZ25hbCA9IGlucHV0LnNpZ25hbFxuICAgIGlmICghYm9keSAmJiBpbnB1dC5fYm9keUluaXQgIT0gbnVsbCkge1xuICAgICAgYm9keSA9IGlucHV0Ll9ib2R5SW5pdFxuICAgICAgaW5wdXQuYm9keVVzZWQgPSB0cnVlXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRoaXMudXJsID0gU3RyaW5nKGlucHV0KVxuICB9XG5cbiAgdGhpcy5jcmVkZW50aWFscyA9IG9wdGlvbnMuY3JlZGVudGlhbHMgfHwgdGhpcy5jcmVkZW50aWFscyB8fCAnc2FtZS1vcmlnaW4nXG4gIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xuICAgIHRoaXMuaGVhZGVycyA9IG5ldyBIZWFkZXJzKG9wdGlvbnMuaGVhZGVycylcbiAgfVxuICB0aGlzLm1ldGhvZCA9IG5vcm1hbGl6ZU1ldGhvZChvcHRpb25zLm1ldGhvZCB8fCB0aGlzLm1ldGhvZCB8fCAnR0VUJylcbiAgdGhpcy5tb2RlID0gb3B0aW9ucy5tb2RlIHx8IHRoaXMubW9kZSB8fCBudWxsXG4gIHRoaXMuc2lnbmFsID0gb3B0aW9ucy5zaWduYWwgfHwgdGhpcy5zaWduYWxcbiAgdGhpcy5yZWZlcnJlciA9IG51bGxcblxuICBpZiAoKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSAmJiBib2R5KSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9keSBub3QgYWxsb3dlZCBmb3IgR0VUIG9yIEhFQUQgcmVxdWVzdHMnKVxuICB9XG4gIHRoaXMuX2luaXRCb2R5KGJvZHkpXG5cbiAgaWYgKHRoaXMubWV0aG9kID09PSAnR0VUJyB8fCB0aGlzLm1ldGhvZCA9PT0gJ0hFQUQnKSB7XG4gICAgaWYgKG9wdGlvbnMuY2FjaGUgPT09ICduby1zdG9yZScgfHwgb3B0aW9ucy5jYWNoZSA9PT0gJ25vLWNhY2hlJykge1xuICAgICAgLy8gU2VhcmNoIGZvciBhICdfJyBwYXJhbWV0ZXIgaW4gdGhlIHF1ZXJ5IHN0cmluZ1xuICAgICAgdmFyIHJlUGFyYW1TZWFyY2ggPSAvKFs/Jl0pXz1bXiZdKi9cbiAgICAgIGlmIChyZVBhcmFtU2VhcmNoLnRlc3QodGhpcy51cmwpKSB7XG4gICAgICAgIC8vIElmIGl0IGFscmVhZHkgZXhpc3RzIHRoZW4gc2V0IHRoZSB2YWx1ZSB3aXRoIHRoZSBjdXJyZW50IHRpbWVcbiAgICAgICAgdGhpcy51cmwgPSB0aGlzLnVybC5yZXBsYWNlKHJlUGFyYW1TZWFyY2gsICckMV89JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlIGFkZCBhIG5ldyAnXycgcGFyYW1ldGVyIHRvIHRoZSBlbmQgd2l0aCB0aGUgY3VycmVudCB0aW1lXG4gICAgICAgIHZhciByZVF1ZXJ5U3RyaW5nID0gL1xcPy9cbiAgICAgICAgdGhpcy51cmwgKz0gKHJlUXVlcnlTdHJpbmcudGVzdCh0aGlzLnVybCkgPyAnJicgOiAnPycpICsgJ189JyArIG5ldyBEYXRlKCkuZ2V0VGltZSgpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cblJlcXVlc3QucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiBuZXcgUmVxdWVzdCh0aGlzLCB7Ym9keTogdGhpcy5fYm9keUluaXR9KVxufVxuXG5mdW5jdGlvbiBkZWNvZGUoYm9keSkge1xuICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpXG4gIGJvZHlcbiAgICAudHJpbSgpXG4gICAgLnNwbGl0KCcmJylcbiAgICAuZm9yRWFjaChmdW5jdGlvbihieXRlcykge1xuICAgICAgaWYgKGJ5dGVzKSB7XG4gICAgICAgIHZhciBzcGxpdCA9IGJ5dGVzLnNwbGl0KCc9JylcbiAgICAgICAgdmFyIG5hbWUgPSBzcGxpdC5zaGlmdCgpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIHZhciB2YWx1ZSA9IHNwbGl0LmpvaW4oJz0nKS5yZXBsYWNlKC9cXCsvZywgJyAnKVxuICAgICAgICBmb3JtLmFwcGVuZChkZWNvZGVVUklDb21wb25lbnQobmFtZSksIGRlY29kZVVSSUNvbXBvbmVudCh2YWx1ZSkpXG4gICAgICB9XG4gICAgfSlcbiAgcmV0dXJuIGZvcm1cbn1cblxuZnVuY3Rpb24gcGFyc2VIZWFkZXJzKHJhd0hlYWRlcnMpIHtcbiAgdmFyIGhlYWRlcnMgPSBuZXcgSGVhZGVycygpXG4gIC8vIFJlcGxhY2UgaW5zdGFuY2VzIG9mIFxcclxcbiBhbmQgXFxuIGZvbGxvd2VkIGJ5IGF0IGxlYXN0IG9uZSBzcGFjZSBvciBob3Jpem9udGFsIHRhYiB3aXRoIGEgc3BhY2VcbiAgLy8gaHR0cHM6Ly90b29scy5pZXRmLm9yZy9odG1sL3JmYzcyMzAjc2VjdGlvbi0zLjJcbiAgdmFyIHByZVByb2Nlc3NlZEhlYWRlcnMgPSByYXdIZWFkZXJzLnJlcGxhY2UoL1xccj9cXG5bXFx0IF0rL2csICcgJylcbiAgcHJlUHJvY2Vzc2VkSGVhZGVycy5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgIHZhciBwYXJ0cyA9IGxpbmUuc3BsaXQoJzonKVxuICAgIHZhciBrZXkgPSBwYXJ0cy5zaGlmdCgpLnRyaW0oKVxuICAgIGlmIChrZXkpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHBhcnRzLmpvaW4oJzonKS50cmltKClcbiAgICAgIGhlYWRlcnMuYXBwZW5kKGtleSwgdmFsdWUpXG4gICAgfVxuICB9KVxuICByZXR1cm4gaGVhZGVyc1xufVxuXG5Cb2R5LmNhbGwoUmVxdWVzdC5wcm90b3R5cGUpXG5cbmV4cG9ydCBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUmVzcG9uc2UpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUGxlYXNlIHVzZSB0aGUgXCJuZXdcIiBvcGVyYXRvciwgdGhpcyBET00gb2JqZWN0IGNvbnN0cnVjdG9yIGNhbm5vdCBiZSBjYWxsZWQgYXMgYSBmdW5jdGlvbi4nKVxuICB9XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fVxuICB9XG5cbiAgdGhpcy50eXBlID0gJ2RlZmF1bHQnXG4gIHRoaXMuc3RhdHVzID0gb3B0aW9ucy5zdGF0dXMgPT09IHVuZGVmaW5lZCA/IDIwMCA6IG9wdGlvbnMuc3RhdHVzXG4gIHRoaXMub2sgPSB0aGlzLnN0YXR1cyA+PSAyMDAgJiYgdGhpcy5zdGF0dXMgPCAzMDBcbiAgdGhpcy5zdGF0dXNUZXh0ID0gJ3N0YXR1c1RleHQnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1c1RleHQgOiAnJ1xuICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhvcHRpb25zLmhlYWRlcnMpXG4gIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJydcbiAgdGhpcy5faW5pdEJvZHkoYm9keUluaXQpXG59XG5cbkJvZHkuY2FsbChSZXNwb25zZS5wcm90b3R5cGUpXG5cblJlc3BvbnNlLnByb3RvdHlwZS5jbG9uZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gbmV3IFJlc3BvbnNlKHRoaXMuX2JvZHlJbml0LCB7XG4gICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICBzdGF0dXNUZXh0OiB0aGlzLnN0YXR1c1RleHQsXG4gICAgaGVhZGVyczogbmV3IEhlYWRlcnModGhpcy5oZWFkZXJzKSxcbiAgICB1cmw6IHRoaXMudXJsXG4gIH0pXG59XG5cblJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gIHZhciByZXNwb25zZSA9IG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiAwLCBzdGF0dXNUZXh0OiAnJ30pXG4gIHJlc3BvbnNlLnR5cGUgPSAnZXJyb3InXG4gIHJldHVybiByZXNwb25zZVxufVxuXG52YXIgcmVkaXJlY3RTdGF0dXNlcyA9IFszMDEsIDMwMiwgMzAzLCAzMDcsIDMwOF1cblxuUmVzcG9uc2UucmVkaXJlY3QgPSBmdW5jdGlvbih1cmwsIHN0YXR1cykge1xuICBpZiAocmVkaXJlY3RTdGF0dXNlcy5pbmRleE9mKHN0YXR1cykgPT09IC0xKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0ludmFsaWQgc3RhdHVzIGNvZGUnKVxuICB9XG5cbiAgcmV0dXJuIG5ldyBSZXNwb25zZShudWxsLCB7c3RhdHVzOiBzdGF0dXMsIGhlYWRlcnM6IHtsb2NhdGlvbjogdXJsfX0pXG59XG5cbmV4cG9ydCB2YXIgRE9NRXhjZXB0aW9uID0gZ2xvYmFsLkRPTUV4Y2VwdGlvblxudHJ5IHtcbiAgbmV3IERPTUV4Y2VwdGlvbigpXG59IGNhdGNoIChlcnIpIHtcbiAgRE9NRXhjZXB0aW9uID0gZnVuY3Rpb24obWVzc2FnZSwgbmFtZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2VcbiAgICB0aGlzLm5hbWUgPSBuYW1lXG4gICAgdmFyIGVycm9yID0gRXJyb3IobWVzc2FnZSlcbiAgICB0aGlzLnN0YWNrID0gZXJyb3Iuc3RhY2tcbiAgfVxuICBET01FeGNlcHRpb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpXG4gIERPTUV4Y2VwdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBET01FeGNlcHRpb25cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZldGNoKGlucHV0LCBpbml0KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KVxuXG4gICAgaWYgKHJlcXVlc3Quc2lnbmFsICYmIHJlcXVlc3Quc2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgIHJldHVybiByZWplY3QobmV3IERPTUV4Y2VwdGlvbignQWJvcnRlZCcsICdBYm9ydEVycm9yJykpXG4gICAgfVxuXG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICBmdW5jdGlvbiBhYm9ydFhocigpIHtcbiAgICAgIHhoci5hYm9ydCgpXG4gICAgfVxuXG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHN0YXR1czogeGhyLnN0YXR1cyxcbiAgICAgICAgc3RhdHVzVGV4dDogeGhyLnN0YXR1c1RleHQsXG4gICAgICAgIGhlYWRlcnM6IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpXG4gICAgICB9XG4gICAgICBvcHRpb25zLnVybCA9ICdyZXNwb25zZVVSTCcgaW4geGhyID8geGhyLnJlc3BvbnNlVVJMIDogb3B0aW9ucy5oZWFkZXJzLmdldCgnWC1SZXF1ZXN0LVVSTCcpXG4gICAgICB2YXIgYm9keSA9ICdyZXNwb25zZScgaW4geGhyID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dFxuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcmVzb2x2ZShuZXcgUmVzcG9uc2UoYm9keSwgb3B0aW9ucykpXG4gICAgICB9LCAwKVxuICAgIH1cblxuICAgIHhoci5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgICAgfSwgMClcbiAgICB9XG5cbiAgICB4aHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgICAgfSwgMClcbiAgICB9XG5cbiAgICB4aHIub25hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBET01FeGNlcHRpb24oJ0Fib3J0ZWQnLCAnQWJvcnRFcnJvcicpKVxuICAgICAgfSwgMClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaXhVcmwodXJsKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gdXJsID09PSAnJyAmJiBnbG9iYWwubG9jYXRpb24uaHJlZiA/IGdsb2JhbC5sb2NhdGlvbi5ocmVmIDogdXJsXG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiB1cmxcbiAgICAgIH1cbiAgICB9XG5cbiAgICB4aHIub3BlbihyZXF1ZXN0Lm1ldGhvZCwgZml4VXJsKHJlcXVlc3QudXJsKSwgdHJ1ZSlcblxuICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlXG4gICAgfSBlbHNlIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnb21pdCcpIHtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBmYWxzZVxuICAgIH1cblxuICAgIGlmICgncmVzcG9uc2VUeXBlJyBpbiB4aHIpIHtcbiAgICAgIGlmIChzdXBwb3J0LmJsb2IpIHtcbiAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJ1xuICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgc3VwcG9ydC5hcnJheUJ1ZmZlciAmJlxuICAgICAgICByZXF1ZXN0LmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKSAmJlxuICAgICAgICByZXF1ZXN0LmhlYWRlcnMuZ2V0KCdDb250ZW50LVR5cGUnKS5pbmRleE9mKCdhcHBsaWNhdGlvbi9vY3RldC1zdHJlYW0nKSAhPT0gLTFcbiAgICAgICkge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJ1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpbml0ICYmIHR5cGVvZiBpbml0LmhlYWRlcnMgPT09ICdvYmplY3QnICYmICEoaW5pdC5oZWFkZXJzIGluc3RhbmNlb2YgSGVhZGVycykpIHtcbiAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKGluaXQuaGVhZGVycykuZm9yRWFjaChmdW5jdGlvbihuYW1lKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIG5vcm1hbGl6ZVZhbHVlKGluaXQuaGVhZGVyc1tuYW1lXSkpXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXF1ZXN0LmhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkge1xuICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihuYW1lLCB2YWx1ZSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKHJlcXVlc3Quc2lnbmFsKSB7XG4gICAgICByZXF1ZXN0LnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIGFib3J0WGhyKVxuXG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIERPTkUgKHN1Y2Nlc3Mgb3IgZmFpbHVyZSlcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgcmVxdWVzdC5zaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBhYm9ydFhocilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHhoci5zZW5kKHR5cGVvZiByZXF1ZXN0Ll9ib2R5SW5pdCA9PT0gJ3VuZGVmaW5lZCcgPyBudWxsIDogcmVxdWVzdC5fYm9keUluaXQpXG4gIH0pXG59XG5cbmZldGNoLnBvbHlmaWxsID0gdHJ1ZVxuXG5pZiAoIWdsb2JhbC5mZXRjaCkge1xuICBnbG9iYWwuZmV0Y2ggPSBmZXRjaFxuICBnbG9iYWwuSGVhZGVycyA9IEhlYWRlcnNcbiAgZ2xvYmFsLlJlcXVlc3QgPSBSZXF1ZXN0XG4gIGdsb2JhbC5SZXNwb25zZSA9IFJlc3BvbnNlXG59XG4iLCIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiAgQ29weXJpZ2h0IChjKSBDb2hlcmVudCBMYWJzIEFELiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLiBTZWUgTGljZW5zZS50eHQgaW4gdGhlIHByb2plY3Qgcm9vdCBmb3IgbGljZW5zZSBpbmZvcm1hdGlvbi5cclxuICotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG5pbXBvcnQgeyBDb21wb25lbnRzIH0gZnJvbSAnY29oZXJlbnQtZ2FtZWZhY2UtY29tcG9uZW50cyc7XHJcbmltcG9ydCB0ZW1wbGF0ZSBmcm9tICcuL3RlbXBsYXRlLmh0bWwnO1xyXG5cclxuY29uc3QgY29tcG9uZW50cyA9IG5ldyBDb21wb25lbnRzKCk7XHJcbmNvbnN0IEJhc2VDb21wb25lbnQgPSBjb21wb25lbnRzLkJhc2VDb21wb25lbnQ7XHJcbmNvbnN0IFRPQVNUX1BPU0lUSU9OUyA9IFsndG9wIGxlZnQnLCAndG9wIHJpZ2h0JywgJ2JvdHRvbSBsZWZ0JywgJ2JvdHRvbSByaWdodCcsICd0b3AgY2VudGVyJywgJ2JvdHRvbSBjZW50ZXInXTtcclxuY29uc3QgY2xhc3NQcmVmaXggPSAnZ3VpYy10b2FzdC0nO1xyXG5sZXQgY29udGFpbmVyc0NyZWF0ZWQgPSBmYWxzZTtcclxubGV0IGFuaW1hdGlvbkV2ZW50QXR0YWNoZWQgPSBmYWxzZTtcclxuXHJcbi8qKlxyXG4gKiBDbGFzcyBkZWZpbml0aW9uIG9mIHRoZSBnYW1lZmFjZSB0b2FzdCBjdXN0b20gZWxlbWVudFxyXG4gKi9cclxuY2xhc3MgR2FtZWZhY2VUb2FzdCBleHRlbmRzIEJhc2VDb21wb25lbnQge1xyXG4gICAgLyogZXNsaW50LWRpc2FibGUgcmVxdWlyZS1qc2RvYyAqL1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGVtcGxhdGU7XHJcbiAgICAgICAgdGhpcy5pbml0ID0gdGhpcy5pbml0LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oaWRlID0gdGhpcy5oaWRlLmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5zaG93ID0gdGhpcy5zaG93LmJpbmQodGhpcyk7XHJcbiAgICAgICAgdGhpcy5oaWRlVGltZU91dCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fZ3Jhdml0eSA9ICd0b3AnO1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gJ2xlZnQnO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBtZXNzYWdlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tZXNzYWdlU2xvdC50ZXh0Q29udGVudDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbWVzc2FnZSh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX21lc3NhZ2VTbG90LmlubmVySFRNTCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB0YXJnZXRFbGVtZW50KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90YXJnZXRFbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB0YXJnZXRFbGVtZW50KGVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLl90YXJnZXRFbGVtZW50ID0gZWxlbWVudDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgcG9zaXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBwb3NpdGlvbih2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5zZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJywgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBncmF2aXR5KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ncmF2aXR5O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBncmF2aXR5KHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fZ3Jhdml0eSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuc2V0QXR0cmlidXRlKCdncmF2aXR5JywgdmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXQoZGF0YSkge1xyXG4gICAgICAgIHRoaXMuc2V0dXBUZW1wbGF0ZShkYXRhLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbXBvbmVudHMucmVuZGVyT25jZSh0aGlzKTtcclxuICAgICAgICAgICAgLy8gYXR0YWNoIGV2ZW50IGhhbmRsZXJzIGhlcmVcclxuICAgICAgICAgICAgdGhpcy5hdHRhY2hFdmVudExpc3RlbmVycygpO1xyXG4gICAgICAgICAgICB0aGlzLl9tZXNzYWdlU2xvdCA9IHRoaXMucXVlcnlTZWxlY3RvcignLmd1aWMtdG9hc3QtbWVzc2FnZScpLmZpcnN0RWxlbWVudENoaWxkO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xyXG4gICAgICAgIHRoaXMuZ3Jhdml0eSA9IHRoaXMuZ2V0QXR0cmlidXRlKCdncmF2aXR5JykgfHwgdGhpcy5fZ3Jhdml0eTtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ3Bvc2l0aW9uJykgfHwgdGhpcy5fcG9zaXRpb247XHJcbiAgICAgICAgdGhpcy50aW1lb3V0ID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ3RpbWVvdXQnKSB8fCAwO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudFNlbGVjdG9yID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ3RhcmdldCcpO1xyXG4gICAgICAgIHRoaXMuX3RhcmdldEVsZW1lbnQgPSB0aGlzLl90YXJnZXRFbGVtZW50IHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy5lbGVtZW50U2VsZWN0b3IpO1xyXG5cclxuICAgICAgICBpZiAoIWNvbnRhaW5lcnNDcmVhdGVkKSB0aGlzLmNyZWF0ZVRvYXN0Q29udGFpbmVycygpO1xyXG5cclxuICAgICAgICBjb21wb25lbnRzLmxvYWRSZXNvdXJjZSh0aGlzKVxyXG4gICAgICAgICAgICAudGhlbih0aGlzLmluaXQpXHJcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4gY29uc29sZS5lcnJvcihlcnIpKTtcclxuICAgIH1cclxuXHJcbiAgICBhdHRhY2hFdmVudExpc3RlbmVycygpIHtcclxuICAgICAgICBpZiAodGhpcy5fdGFyZ2V0RWxlbWVudCApIHtcclxuICAgICAgICAgICAgdGhpcy5fdGFyZ2V0RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuc2hvdyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIWFuaW1hdGlvbkV2ZW50QXR0YWNoZWQpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignYW5pbWF0aW9uZW5kJywgKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQuYW5pbWF0aW9uTmFtZSA9PT0gJ2d1aWMtdG9hc3QtZmFkZS1vdXQnKSBldmVudC50YXJnZXQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChldmVudC50YXJnZXQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgYW5pbWF0aW9uRXZlbnRBdHRhY2hlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyogZXNsaW50LWVuYWJsZSByZXF1aXJlLWpzZG9jICovXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGVzIGNvbnRhaW5lcnMgZm9yIGFsbCBwb3NzaWJsZSB0b2FzdCBwb3NpdGlvbnNcclxuICAgICovXHJcbiAgICBjcmVhdGVUb2FzdENvbnRhaW5lcnMoKSB7XHJcbiAgICAgICAgY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcclxuICAgICAgICBUT0FTVF9QT1NJVElPTlMuZm9yRWFjaCgoY29udGFpbmVyUG9zaXRpb24pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgW3ZlcnRpY2FsLCBob3Jpem9udGFsXSA9IGNvbnRhaW5lclBvc2l0aW9uLnNwbGl0KCcgJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvYXN0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIHRvYXN0Q29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ2d1aWMtdG9hc3QtY29udGFpbmVyJywgYCR7Y2xhc3NQcmVmaXh9JHt2ZXJ0aWNhbH1gLCBgJHtjbGFzc1ByZWZpeH0ke2hvcml6b250YWx9YCk7XHJcbiAgICAgICAgICAgIGJvZHkuYXBwZW5kQ2hpbGQodG9hc3RDb250YWluZXIpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb250YWluZXJzQ3JlYXRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBcHBlbmRzIHRoZSB0b2FzdCB0byBvbmUgb2YgdGhlIGNvbnRhaW5lcnMgZGVwZW5kaW5nIG9uIHRoZSBncmF2aXR5IGFuZCBwb3NpdGlvblxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGdyYXZpdHkgLSB0b3AsIGJvdHRvbS5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwb3NpdGlvbiAtIGxlZnQsIHJpZ2h0LCBjZW50ZXJcclxuICAgICovXHJcbiAgICBhcHBlbmRUb2FzdFRvQ29udGFpbmVyKGdyYXZpdHksIHBvc2l0aW9uKSB7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmd1aWMtdG9hc3QtY29udGFpbmVyLiR7Y2xhc3NQcmVmaXh9JHtncmF2aXR5fS4ke2NsYXNzUHJlZml4fSR7cG9zaXRpb259YCk7XHJcblxyXG4gICAgICAgIGlmIChjb250YWluZXIpIHtcclxuICAgICAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignTm8gY29udGFpbmVyIGZvdW5kIGZvciB0aGUgc3BlY2lmaWVkIGdyYXZpdHkgYW5kIHBvc2l0aW9uJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGlzcGxheXMgdGhlIHRvYXN0XHJcbiAgICAgKi9cclxuICAgIHNob3coKSB7XHJcbiAgICAgICAgdGhpcy5hcHBlbmRUb2FzdFRvQ29udGFpbmVyKHRoaXMuZ3Jhdml0eSwgdGhpcy5wb3NpdGlvbik7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVUaW1lT3V0KCk7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVDbG9zZUJ1dHRvbigpO1xyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnZ3VpYy10b2FzdC1zaG93Jyk7XHJcbiAgICAgICAgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdndWljLXRvYXN0LWhpZGUnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEhpZGVzIHRoZSB0b2FzdFxyXG4gICAgICovXHJcbiAgICBoaWRlKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlzQ29ubmVjdGVkKSB0aGlzLmNsYXNzTGlzdC5hZGQoJ2d1aWMtdG9hc3QtaGlkZScpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0dXBzIHRoZSB0aW1lb3V0IG9mIHRoZSB0b2FzdFxyXG4gICAgICovXHJcbiAgICBoYW5kbGVUaW1lT3V0KCkge1xyXG4gICAgICAgIGlmICh0aGlzLmhpZGVUaW1lT3V0KSBjbGVhclRpbWVvdXQodGhpcy5oaWRlVGltZU91dCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnRpbWVvdXQgPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZVRpbWVPdXQgPSBzZXRUaW1lb3V0KHRoaXMuaGlkZSwgdGhpcy50aW1lb3V0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXR1cHMgdGhlIGNsb3NlIGJ1dHRvbiBvZiB0aGUgdG9hc3RcclxuICAgICAqL1xyXG4gICAgaGFuZGxlQ2xvc2VCdXR0b24oKSB7XHJcbiAgICAgICAgY29uc3QgY2xvc2VCdXR0b24gPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5ndWljLXRvYXN0LWNsb3NlLWJ0bicpO1xyXG4gICAgICAgIGlmIChjbG9zZUJ1dHRvbi5maXJzdEVsZW1lbnRDaGlsZC5jbGllbnRXaWR0aCAmJiBjbG9zZUJ1dHRvbi5maXJzdEVsZW1lbnRDaGlsZC5jbGllbnRIZWlnaHQpIHtcclxuICAgICAgICAgICAgY2xvc2VCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmhpZGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5jb21wb25lbnRzLmRlZmluZUN1c3RvbUVsZW1lbnQoJ2dhbWVmYWNlLXRvYXN0JywgR2FtZWZhY2VUb2FzdCk7XHJcbmV4cG9ydCBkZWZhdWx0IEdhbWVmYWNlVG9hc3Q7XHJcbiIsIi8qLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAqICBDb3B5cmlnaHQgKGMpIENvaGVyZW50IExhYnMgQUQuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuIFNlZSBMaWNlbnNlLnR4dCBpbiB0aGUgcHJvamVjdCByb290IGZvciBsaWNlbnNlIGluZm9ybWF0aW9uLlxyXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxuLyogZXNsaW50LWRpc2FibGUgbm8tdXNlbGVzcy1lc2NhcGUgKi9cclxuY29uc3QgbmV3TGluZXNSZWdFeHAgPSBuZXcgUmVnRXhwKCdeXFxzK3xcXHMrJCcsICdnJyk7XHJcbmNvbnN0IE5BVElWRV9URVhUX0ZJRUxEX0VMRU1FTlRTID0gWydpbnB1dCcsICd0ZXh0YXJlYSddO1xyXG53aW5kb3cuR1VJQ29tcG9uZW50c0RlZmluZWRFbGVtZW50cyA9IHt9O1xyXG5cclxuaWYgKCF3aW5kb3cuR1VJQ29tcG9uZW50c0RlZmluZWRFbGVtZW50cykgd2luZG93LkdVSUNvbXBvbmVudHNEZWZpbmVkRWxlbWVudHMgPSB7fTtcclxuXHJcblxyXG4vKipcclxuICogQ2hlY2tzIGlmIHRoZSBwYXNzZWQgZWxlbWVudCBpcyBhIG5hdGl2ZSB0ZXh0IGZpZWxkXHJcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAqL1xyXG5mdW5jdGlvbiBpc05hdGl2ZVRleHRGaWVsZChlbGVtZW50KSB7XHJcbiAgICByZXR1cm4gTkFUSVZFX1RFWFRfRklFTERfRUxFTUVOVFMuaW5kZXhPZihlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSkgPiAtMTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEJhc2VDb21wb25lbnRcclxuICogVGhlIGJhc2UgY2xhc3MgZnJvbSB3aGljaCBhbGwgb3RoZXIgY29tcG9uZW50cyBpbmhlcml0IHNoYXJlZCBsb2dpY1xyXG4gKi9cclxuY2xhc3MgQmFzZUNvbXBvbmVudCBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIHRoZSB0eXBlIG9mIHRoZSBjbGFzc1xyXG4gICAgICovXHJcbiAgICBnZXQgaW5zdGFuY2VUeXBlKCkge1xyXG4gICAgICAgIHJldHVybiAnQmFzZUNvbXBvbmVudCc7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIENhbGxlZCB3aGVuIHRoZSB0ZW1wbGF0ZSBvZiBhIGNvbXBvbmVudCB3YXMgbG9hZGVkLlxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGRhdGFcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHJcbiAgICAgKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxyXG4gICAgKi9cclxuICAgIHNldHVwVGVtcGxhdGUoZGF0YSwgY2FsbGJhY2spIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNDb25uZWN0ZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGBERUJVRzogY29tcG9uZW50ICR7dGhpcy50YWdOYW1lfSB3YXMgbm90IGluaXRpYWxpemVkIGJlY2F1c2UgaXQgd2FzIGRpc2Nvbm5lY3RlZCBmcm9tIHRoZSBET00hYCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnRlbXBsYXRlID0gZGF0YS50ZW1wbGF0ZTtcclxuICAgICAgICBjYWxsYmFjayhkYXRhLnRlbXBsYXRlKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogVmFsaWRhdGUgaWYgYSB2YWx1ZSBjYW4gYmUgc2V0IG9uIHRoZSBzdGF0ZS5cclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5LlxyXG4gICAgICogQHBhcmFtIHthbnl9IHZhbHVlIC0gdGhlIHZhbHVlIHRoYXQgaGFzIHRvIGJlIGNoZWNrZWQuXHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgaXNTdGF0ZVByb3BWYWxpZChuYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgIGNvbnN0IHNjaGVtYVByb3BlcnR5ID0gdGhpcy5zdGF0ZVNjaGVtYVtuYW1lXTtcclxuXHJcbiAgICAgICAgaWYgKCFzY2hlbWFQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBBIHByb3BlcnR5ICR7bmFtZX0gZG9lcyBub3QgZXhpc3Qgb24gdHlwZSAke3RoaXMudGFnTmFtZS50b0xvd2VyQ2FzZSgpfSFgKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcclxuICAgICAgICBpZiAoc2NoZW1hUHJvcGVydHkudHlwZS5pbmNsdWRlcygnYXJyYXknKSkge1xyXG4gICAgICAgICAgICBjb25zdCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIGlmIChpc0FycmF5KSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghc2NoZW1hUHJvcGVydHkudHlwZS5pbmNsdWRlcyh0eXBlKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGBQcm9wZXJ0eSAke25hbWV9IGNhbiBub3QgYmUgb2YgdHlwZSAtICR7dHlwZX0uIEFsbG93ZWQgdHlwZXMgYXJlOiAke3NjaGVtYVByb3BlcnR5LnR5cGUuam9pbignLCcpfWApO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFRoaXMgaXMgdGhlIGJhc2UgY2xhc3MgdGhhdCBob2xkcyBhbGwgZnVuY3Rpb25hbGl0eSBzaGFyZWQgYmV0d2VlbiBjdXN0b20gY29tcG9uZW50c1xyXG4gKiBhbmQgbmF0aXZlIGVsZW1lbnRzXHJcbiAqL1xyXG5jbGFzcyBWYWxpZGF0b3Ige1xyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gdGhlIHR5cGUgb2YgdGhlIGNsYXNzXHJcbiAgICAgKi9cclxuICAgIGdldCBpbnN0YW5jZVR5cGUoKSB7XHJcbiAgICAgICAgcmV0dXJuICdWYWxpZGF0b3InO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgZWxlbWVudCBpcyBjaGlsZCBvZiBhIGZvcm1cclxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaXNGb3JtRWxlbWVudChlbGVtZW50KSB7XHJcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgICB3aGlsZSAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudC50YWdOYW1lID09PSAnR0FNRUZBQ0UtRk9STS1DT05UUk9MJyB8fCBlbGVtZW50LnRhZ05hbWUgPT09ICdnYW1lZmFjZS1mb3JtLWNvbnRyb2wnKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIGVsZW1lbnQgdmFsdWUgaXMgYmlnZ2VyIHRoYW4gZWxlbWVudCBtYXhsZW5ndGhcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdG9vTG9uZygpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiBlbGVtZW50IHZhbHVlIGlzIGxlc3MgdGhhbiBlbGVtZW50IG1pbmxlbmd0aFxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyB0b29TaG9ydCgpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgdGhlIHZhbHVlIG9mIGFuIGVsZW1lbnQgaXMgYmlnZ2VyIHRoYW4gaXRzIG1heCBhdHRyaWJ1dGVcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgKi9cclxuICAgIHN0YXRpYyByYW5nZU92ZXJmbG93KCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyBpZiB0aGUgdmFsdWUgb2YgYW4gZWxlbWVudCBpcyBzbWFsbGVyIHRoYW4gaXRzIG1pbiBhdHRyaWJ1dGVcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgKi9cclxuICAgIHN0YXRpYyByYW5nZVVuZGVyZmxvdygpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiBlbGVtZW50IGlzIHJlcXVpcmVkIGFuZCBpdHMgdmFsdWUgaXMgbWlzc2luZ1xyXG4gICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyB2YWx1ZU1pc3NpbmcoZWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiBlbGVtZW50Lmhhc0F0dHJpYnV0ZSgncmVxdWlyZWQnKSAmJiAhZWxlbWVudC52YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIGVsZW1lbnQgbmFtZSBpcyBtaXNzaW5nXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIG5hbWVNaXNzaW5nKGVsZW1lbnQpIHtcclxuICAgICAgICByZXR1cm4gIWVsZW1lbnQubmFtZSAmJiAhZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIGFuIGVsZW1lbnQgaXMgcmVxdWlyZWRcclxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgKi9cclxuICAgIHN0YXRpYyBpc1JlcXVpcmVkKGVsZW1lbnQpIHtcclxuICAgICAgICByZXR1cm4gZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ3JlcXVpcmVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgdGhlcmUgaXMgYSBjdXN0b20gZXJyb3IgZm9yIHRoZSBlbGVtZW50XHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGN1c3RvbUVycm9yKCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrcyBpZiBlbGVtZW50IGlzIGdvaW5nIHRvIGJlIHNlcmlhbGl6ZWQuXHJcbiAgICAgKiBJZiBhbiBlbGVtZW50IGRvZXNuJ3QgaGF2ZSBhIG5hbWUgaXQgd2lsbCBub3QgYmUgc2VyaWFsaXplZC5cclxuICAgICAqIFVzZWQgdG8gZGV0ZXJtaW5lIGlmIGFuIGVsZW1lbnQgc2hvdWxkIGJlIHZhbGlkYXRlZC5cclxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgKi9cclxuICAgIHN0YXRpYyB3aWxsU2VyaWFsaXplKGVsZW1lbnQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5uYW1lTWlzc2luZyhlbGVtZW50KSA/IGZhbHNlIDogdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKiBlc2xpbnQtZGlzYWJsZSByZXF1aXJlLWpzZG9jICovXHJcbiAgICBzdGF0aWMgaXNCYWRVUkwoKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBpc0JhZEVtYWlsKCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIC8qIGVzbGludC1lbmFibGUgcmVxdWlyZS1qc2RvYyAqL1xyXG59XHJcblxyXG4vKipcclxuICogVGhlIE5hdGl2ZUVsZW1lbnRWYWxpZGF0b3IgdXNlcyB0aGUgbWV0aG9kcyBmcm9tIHRoZSBWYWxpZGF0b3IgY2xhc3NcclxuICogQWxsIG5hdGl2ZSBlbGVtZW50cyB0aGEgZG9uJ3Qgc3VwcG9ydCBtZXRob2RzIGxpa2UgaXNGb3JtRWxlbWVudCwgdG9vTG9uZywgdG9vU2hvcnRcclxuICogZXRjLi4gd2lsbCBiZSB3cmFwcGVkIGluIHRoaXMgY2xhc3MgaW4gb3JkZXIgdG8gZW5hYmxlIHVzIHRvIHZhbGlkYXRlIG5hdGl2ZSBhbmRcclxuICogY3VzdG9tIGVsZW1lbnRzIHVzaW5nIHRoZSBzYW1lIG1ldGhvZHMuXHJcbiAqICovXHJcbmNsYXNzIE5hdGl2ZUVsZW1lbnRWYWxpZGF0b3Ige1xyXG4gICAgLyogZXNsaW50LWRpc2FibGUgcmVxdWlyZS1qc2RvYyAqL1xyXG4gICAgZ2V0IGluc3RhbmNlVHlwZSgpIHtcclxuICAgICAgICByZXR1cm4gJ05hdGl2ZUVsZW1lbnRWYWxpZGF0b3InO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgfVxyXG5cclxuICAgIGlzRm9ybUVsZW1lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIFZhbGlkYXRvci5pc0Zvcm1FbGVtZW50KHRoaXMuZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9vTG9uZygpIHtcclxuICAgICAgICBpZiAoaXNOYXRpdmVUZXh0RmllbGQodGhpcy5lbGVtZW50KSkgcmV0dXJuIFRleHRGaWVsZFZhbGlkYXRvci50b29Mb25nKHRoaXMuZWxlbWVudCk7XHJcbiAgICAgICAgcmV0dXJuIFZhbGlkYXRvci50b29Mb25nKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9vU2hvcnQoKSB7XHJcbiAgICAgICAgaWYgKGlzTmF0aXZlVGV4dEZpZWxkKHRoaXMuZWxlbWVudCkpIHJldHVybiBUZXh0RmllbGRWYWxpZGF0b3IudG9vU2hvcnQodGhpcy5lbGVtZW50KTtcclxuICAgICAgICByZXR1cm4gVmFsaWRhdG9yLnRvb1Nob3J0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmFuZ2VPdmVyZmxvdygpIHtcclxuICAgICAgICBpZiAoaXNOYXRpdmVUZXh0RmllbGQodGhpcy5lbGVtZW50KSkgcmV0dXJuIFRleHRGaWVsZFZhbGlkYXRvci5yYW5nZU92ZXJmbG93KHRoaXMuZWxlbWVudCk7XHJcbiAgICAgICAgcmV0dXJuIFZhbGlkYXRvci5yYW5nZU92ZXJmbG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmFuZ2VVbmRlcmZsb3coKSB7XHJcbiAgICAgICAgaWYgKGlzTmF0aXZlVGV4dEZpZWxkKHRoaXMuZWxlbWVudCkpIHJldHVybiBUZXh0RmllbGRWYWxpZGF0b3IucmFuZ2VVbmRlcmZsb3codGhpcy5lbGVtZW50KTtcclxuICAgICAgICByZXR1cm4gVmFsaWRhdG9yLnJhbmdlVW5kZXJmbG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFsdWVNaXNzaW5nKCkge1xyXG4gICAgICAgIHJldHVybiBWYWxpZGF0b3IudmFsdWVNaXNzaW5nKHRoaXMuZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgbmFtZU1pc3NpbmcoKSB7XHJcbiAgICAgICAgcmV0dXJuIFZhbGlkYXRvci5uYW1lTWlzc2luZyh0aGlzLmVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGN1c3RvbUVycm9yKCkge1xyXG4gICAgICAgIHJldHVybiBWYWxpZGF0b3IuY3VzdG9tRXJyb3IoKTtcclxuICAgIH1cclxuXHJcbiAgICBpc1JlcXVpcmVkKCkge1xyXG4gICAgICAgIHJldHVybiBWYWxpZGF0b3IuaXNSZXF1aXJlZCh0aGlzLmVsZW1lbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHdpbGxTZXJpYWxpemUoKSB7XHJcbiAgICAgICAgcmV0dXJuIFZhbGlkYXRvci53aWxsU2VyaWFsaXplKHRoaXMuZWxlbWVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNCYWRFbWFpbCgpIHtcclxuICAgICAgICBpZiAoaXNOYXRpdmVUZXh0RmllbGQodGhpcy5lbGVtZW50KSkgcmV0dXJuIFRleHRGaWVsZFZhbGlkYXRvci5pc0JhZEVtYWlsKHRoaXMuZWxlbWVudCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlzQmFkVVJMKCkge1xyXG4gICAgICAgIGlmIChpc05hdGl2ZVRleHRGaWVsZCh0aGlzLmVsZW1lbnQpKSByZXR1cm4gVGV4dEZpZWxkVmFsaWRhdG9yLmlzQmFkVVJMKHRoaXMuZWxlbWVudCk7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgLyogZXNsaW50LWVuYWJsZSByZXF1aXJlLWpzZG9jICovXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUaGUgQ3VzdG9tRWxlbWVudFZhbGlkYXRvciBpcyBpbmhlcml0ZWQgYnkgY3VzdG9tIGVsZW1lbnRzIGluIG9yZGVyIHRvIGdhaW4gdGhlXHJcbiAqIHZhbGlkYXRpb24gZnVuY3Rpb24gZnJvbSB0aGUgVmFsaWRhdG9yIGNsYXNzLlxyXG4gKiBUaGlzIGNsYXNzIGNhbiBub3QgYmUgdXNlZCB0byB3cmFwIHRoZSBuYXRpdmUgZWxlbWVudHMgYXMgaXQgaW5oZXJpdHMgdGhlXHJcbiAqIEhUTUxFbGVtZW50IHdoaWNoIGNhbiBub3QgYmUgaW5zdGFudGlhdGVkIHVzaW5nIHRoZSBuZXcga2V5d29yZC5cclxuKi9cclxuY2xhc3MgQ3VzdG9tRWxlbWVudFZhbGlkYXRvciBleHRlbmRzIEJhc2VDb21wb25lbnQge1xyXG4gICAgLyogZXNsaW50LWRpc2FibGUgcmVxdWlyZS1qc2RvYyAqL1xyXG4gICAgZ2V0IGluc3RhbmNlVHlwZSgpIHtcclxuICAgICAgICByZXR1cm4gJ0N1c3RvbUVsZW1lbnRWYWxpZGF0b3InO1xyXG4gICAgfVxyXG5cclxuICAgIGlzRm9ybUVsZW1lbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIFZhbGlkYXRvci5pc0Zvcm1FbGVtZW50KHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvb0xvbmcoKSB7XHJcbiAgICAgICAgcmV0dXJuIFZhbGlkYXRvci50b29Mb25nKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvb1Nob3J0KCkge1xyXG4gICAgICAgIHJldHVybiBWYWxpZGF0b3IudG9vU2hvcnQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFsdWVNaXNzaW5nKCkge1xyXG4gICAgICAgIHJldHVybiBWYWxpZGF0b3IudmFsdWVNaXNzaW5nKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIG5hbWVNaXNzaW5nKCkge1xyXG4gICAgICAgIHJldHVybiBWYWxpZGF0b3IubmFtZU1pc3NpbmcodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgY3VzdG9tRXJyb3IoKSB7XHJcbiAgICAgICAgcmV0dXJuIFZhbGlkYXRvci5jdXN0b21FcnJvcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGlzUmVxdWlyZWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIFZhbGlkYXRvci5pc1JlcXVpcmVkKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJhbmdlT3ZlcmZsb3coKSB7XHJcbiAgICAgICAgcmV0dXJuIFZhbGlkYXRvci5yYW5nZU92ZXJmbG93KHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJhbmdlVW5kZXJmbG93KCkge1xyXG4gICAgICAgIHJldHVybiBWYWxpZGF0b3IucmFuZ2VVbmRlcmZsb3codGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgd2lsbFNlcmlhbGl6ZSgpIHtcclxuICAgICAgICByZXR1cm4gVmFsaWRhdG9yLndpbGxTZXJpYWxpemUodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNCYWRFbWFpbCgpIHtcclxuICAgICAgICByZXR1cm4gVmFsaWRhdG9yLmlzQmFkRW1haWwodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNCYWRVUkwoKSB7XHJcbiAgICAgICAgcmV0dXJuIFZhbGlkYXRvci5pc0JhZFVSTCh0aGlzKTtcclxuICAgIH1cclxuICAgIC8qIGVzbGludC1lbmFibGUgcmVxdWlyZS1qc2RvYyAqL1xyXG59XHJcblxyXG4vKipcclxuICogQ2xhc3MgdGhhdCBpbXBsZW1lbnRzIHRoZSBjb21tb25nIHZhbGlkYXRpb24gbWV0aG9kcyBmb3IgdGhlIHRleHQgZmllbGRzXHJcbiAqL1xyXG5jbGFzcyBUZXh0RmllbGRWYWxpZGF0b3Ige1xyXG4gICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIHJlcXVpcmUtanNkb2MgKi9cclxuICAgIGdldCBpbnN0YW5jZVR5cGUoKSB7XHJcbiAgICAgICAgcmV0dXJuICdUZXh0RmllbGRWYWxpZGF0b3InO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTW9zdCBvZiB0aGUgY3VzdG9tIGVsZW1lbnRzIHdpbGwgbm90IG5lZWQgdGhpcyBjaGVjayBob3dldmVyLFxyXG4gICAgICogd2UgY2FsbCBhbGwgdmFsaWRhdGlvbiBtZXRob2RzIGluIG9yZGVyIHRvIGRldGVybWluZSBpZiBhbiBlbGVtZW50IGlzIHZhbGlkLlxyXG4gICAgICogRWFjaCBlbGVtZW50IHRoYXQgbmVlZHMgdGhpcyBjaGVjayBpbXBsZW1lbnRzIGl0IGl0c2VsZi5cclxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdG9vTG9uZyhlbGVtZW50KSB7XHJcbiAgICAgICAgY29uc3QgbWF4TGVuZ3RoID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ21heGxlbmd0aCcpO1xyXG4gICAgICAgIGlmICghbWF4TGVuZ3RoKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQudmFsdWUubGVuZ3RoID4gcGFyc2VGbG9hdChtYXhMZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBNb3N0IG9mIHRoZSBjdXN0b20gZWxlbWVudHMgd2lsbCBub3QgbmVlZCB0aGlzIGNoZWNrIGhvd2V2ZXIsXHJcbiAgICAqIHdlIGNhbGwgYWxsIHZhbGlkYXRpb24gbWV0aG9kcyBpbiBvcmRlciB0byBkZXRlcm1pbmUgaWYgYW4gZWxlbWVudCBpcyB2YWxpZC5cclxuICAgICogRWFjaCBlbGVtZW50IHRoYXQgbmVlZHMgdGhpcyBjaGVjayBpbXBsZW1lbnRzIGl0IGl0c2VsZi5cclxuICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxyXG4gICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICovXHJcbiAgICBzdGF0aWMgdG9vU2hvcnQoZWxlbWVudCkge1xyXG4gICAgICAgIGNvbnN0IG1pbkxlbmd0aCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdtaW5sZW5ndGgnKTtcclxuICAgICAgICBpZiAoIW1pbkxlbmd0aCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBlbGVtZW50LnZhbHVlLmxlbmd0aCA8IHBhcnNlRmxvYXQobWluTGVuZ3RoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICogTW9zdCBvZiB0aGUgY3VzdG9tIGVsZW1lbnRzIHdpbGwgbm90IG5lZWQgdGhpcyBjaGVjayBob3dldmVyLFxyXG4gICAgKiB3ZSBjYWxsIGFsbCB2YWxpZGF0aW9uIG1ldGhvZHMgaW4gb3JkZXIgdG8gZGV0ZXJtaW5lIGlmIGFuIGVsZW1lbnQgaXMgdmFsaWQuXHJcbiAgICAqIEVhY2ggZWxlbWVudCB0aGF0IG5lZWRzIHRoaXMgY2hlY2sgaW1wbGVtZW50cyBpdCBpdHNlbGYuXHJcbiAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICAgICogQHJldHVybnMge2Jvb2xlYW59XHJcbiAgICAqL1xyXG4gICAgc3RhdGljIHJhbmdlT3ZlcmZsb3coZWxlbWVudCkge1xyXG4gICAgICAgIGNvbnN0IG1heCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdtYXgnKTtcclxuICAgICAgICBpZiAoIW1heCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGVsZW1lbnQudmFsdWUpID4gcGFyc2VGbG9hdChtYXgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTW9zdCBvZiB0aGUgY3VzdG9tIGVsZW1lbnRzIHdpbGwgbm90IG5lZWQgdGhpcyBjaGVjayBob3dldmVyLFxyXG4gICAgICogd2UgY2FsbCBhbGwgdmFsaWRhdGlvbiBtZXRob2RzIGluIG9yZGVyIHRvIGRldGVybWluZSBpZiBhbiBlbGVtZW50IGlzIHZhbGlkLlxyXG4gICAgICogRWFjaCBlbGVtZW50IHRoYXQgbmVlZHMgdGhpcyBjaGVjayBpbXBsZW1lbnRzIGl0IGl0c2VsZi5cclxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcmFuZ2VVbmRlcmZsb3coZWxlbWVudCkge1xyXG4gICAgICAgIGNvbnN0IG1pbiA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdtaW4nKTtcclxuICAgICAgICBpZiAoIW1pbikgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBwYXJzZUZsb2F0KGVsZW1lbnQudmFsdWUpIDwgcGFyc2VGbG9hdChtaW4pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2tzIGlmIHRoZSB0ZXh0IGZpZWxkIHdpdGggdHlwZSB1cmwgaGFzIGEgdmFsaWQgdXJsIGJ5IGl0cyBwYXR0ZXJuXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XHJcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGlzQmFkVVJMKGVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSAhPT0gJ3VybCcpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBjb25zdCBwYXR0ZXJuID0gZWxlbWVudC5wYXR0ZXJuIHx8IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCdwYXR0ZXJuJyk7XHJcbiAgICAgICAgaWYgKCFwYXR0ZXJuKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgaWYgKCFlbGVtZW50LnZhbHVlLm1hdGNoKHBhdHRlcm4pKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVja3MgaWYgdGhlIHRleHQgZmllbGQgZWxlbWVudCB3aXRoIHR5cGUgZW1haWwgaXMgdmFsaWRcclxuICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaXNCYWRFbWFpbChlbGVtZW50KSB7XHJcbiAgICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0eXBlJykgIT09ICdlbWFpbCcpIHJldHVybiBmYWxzZTtcclxuICAgICAgICBpZiAoIWVsZW1lbnQudmFsdWUubWF0Y2goJ0AnKSkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxpbmVzLXBlci1mdW5jdGlvbiwgcmVxdWlyZS1qc2RvY1xyXG5jb25zdCBDb21wb25lbnRzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3QgR0ZfQ09NUE9ORU5UX1NMT1RfVEFHX05BTUUgPSAnY29tcG9uZW50LXNsb3QnO1xyXG4gICAgY29uc3QgS0VZQ09ERVMgPSB7XHJcbiAgICAgICAgRE9XTjogNDAsXHJcbiAgICAgICAgTEVGVDogMzcsXHJcbiAgICAgICAgUklHSFQ6IDM5LFxyXG4gICAgICAgIFVQOiAzOCxcclxuICAgICAgICBIT01FOiAzNixcclxuICAgICAgICBFTkQ6IDM1LFxyXG4gICAgICAgIEVOVEVSOiAxMyxcclxuICAgICAgICBFU0NBUEU6IDI3LFxyXG4gICAgICAgIFRBQjogOSxcclxuICAgICAgICBTSElGVDogMTYsXHJcbiAgICAgICAgQ1RSTDogMTcsXHJcbiAgICAgICAgU1BBQ0U6IDMyLFxyXG4gICAgICAgIFBBR0VfVVA6IDMzLFxyXG4gICAgICAgIFBBR0VfRE9XTjogMzQsXHJcbiAgICAgICAgTEVUVEVSX0E6IDY1LFxyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENsYXNzIHRoYXQgZGVmaW5lcyB0aGUgR2FtZWZhY2UgY29tcG9uZW50c1xyXG4gICAgICovXHJcbiAgICBjbGFzcyBHYW1lZmFjZUNvbXBvbmVudHMge1xyXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByZXF1aXJlLWpzZG9jXHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1wb3J0ZWQgPSB0aGlzLmltcG9ydGVkIHx8IFtdO1xyXG4gICAgICAgICAgICB0aGlzLktFWUNPREVTID0gS0VZQ09ERVM7XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGVkQ29tcG9uZW50cyA9IHt9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5DdXN0b21FbGVtZW50VmFsaWRhdG9yID0gQ3VzdG9tRWxlbWVudFZhbGlkYXRvcjtcclxuICAgICAgICAgICAgdGhpcy5OYXRpdmVFbGVtZW50VmFsaWRhdG9yID0gTmF0aXZlRWxlbWVudFZhbGlkYXRvcjtcclxuICAgICAgICAgICAgdGhpcy5UZXh0RmllbGRWYWxpZGF0b3IgPSBUZXh0RmllbGRWYWxpZGF0b3I7XHJcbiAgICAgICAgICAgIHRoaXMuVmFsaWRhdG9yID0gVmFsaWRhdG9yO1xyXG4gICAgICAgICAgICB0aGlzLkJhc2VDb21wb25lbnQgPSBCYXNlQ29tcG9uZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ3JlYXRlIGFuZCBhZGQgYSBzY3JpcHQgdGFnIHdpdGggZ2l2ZW4gdXJsLlxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcclxuICAgICAgICAqL1xyXG4gICAgICAgIGltcG9ydFNjcmlwdCh1cmwpIHtcclxuICAgICAgICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICAgICAgICAgIHNjcmlwdC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHVybCk7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIExvYWRzIGFuIGh0bWwgYnkgZ2l2ZW4gdXJsLlxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcclxuICAgICAgICAgKiBAcmV0dXJucyB7cHJvbWlzZX0gcmVzb2x2ZWQgd2l0aCB0aGUgaHRtbCBhcyB0ZXh0LlxyXG4gICAgICAgICovXHJcbiAgICAgICAgbG9hZEhUTUwodXJsKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxvYWRSZXNvdXJjZSh1cmwpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC50ZW1wbGF0ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDcmVhdGVzIGEgcHJvbWlzZSB3aGljaCByZXNvbHZlcyB3aGVuIGEgY3VzdG9tIGVsZW1lbnQgd2FzIGRlZmluZWQuXHJcbiAgICAgICAgICogU2F2ZXMgdGhlIHByb21pc2UgZm9yIGVhY2ggZGVmaW5lZCBjb21wb25lbnQuXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgY3VzdG9tIGVsZW1lbnRcclxuICAgICAgICAgKiBAcmV0dXJucyB7cHJvbWlzZX0gLSB0aGUgcHJldmlvdXNseSBzYXZlZCBwcm9taXNlIGl0IGFueSBvciBhIG5ldyBvbmVcclxuICAgICAgICAqL1xyXG4gICAgICAgIHdoZW5EZWZpbmVkKG5hbWUpIHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5HVUlDb21wb25lbnRzRGVmaW5lZEVsZW1lbnRzW25hbWVdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuR1VJQ29tcG9uZW50c0RlZmluZWRFbGVtZW50c1tuYW1lXS5wcm9taXNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCBkZWZpbmVkID0gd2luZG93LkdVSUNvbXBvbmVudHNEZWZpbmVkRWxlbWVudHNbbmFtZV0gPSB7fTtcclxuICAgICAgICAgICAgZGVmaW5lZC5wcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgZGVmaW5lZC5yZXNvbHZlID0gcmVzb2x2ZTtcclxuICAgICAgICAgICAgICAgIGRlZmluZWQucmVqZWN0ID0gcmVqZWN0O1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmluZWQucHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIERlZmluZXMgYSBjdXN0b20gZWxlbWVudC5cclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBlbGVtZW50LlxyXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBlbGVtZW50IC0gdGhlIG9iamVjdCB3aGljaCBkZXNjcmliZXMgdGhlIGVsZW1lbnQuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBkZWZpbmVDdXN0b21FbGVtZW50KG5hbWUsIGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgLy8gZG9uJ3QgYXR0ZW1wdCB0byByZWdpc3RlciBjdXN0b20gZWxlbWVudCB0d2ljZVxyXG4gICAgICAgICAgICBpZiAod2luZG93LkdVSUNvbXBvbmVudHNEZWZpbmVkRWxlbWVudHNbbmFtZV0gfHwgY3VzdG9tRWxlbWVudHMuZ2V0KG5hbWUpKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMud2hlbkRlZmluZWQobmFtZSk7XHJcbiAgICAgICAgICAgIGN1c3RvbUVsZW1lbnRzLmRlZmluZShuYW1lLCBlbGVtZW50KTtcclxuICAgICAgICAgICAgd2luZG93LkdVSUNvbXBvbmVudHNEZWZpbmVkRWxlbWVudHNbbmFtZV0ucmVzb2x2ZShlbGVtZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEltcG9ydHMgYSBjb21wb25lbnQgYnkgZ2l2ZW4gdXJsLlxyXG4gICAgICAgICAqIEl0IHdpbGwgYXV0b21hdGljYWxseSB0cnkgdG8gaW1wb3J0IHN0eWxlLmNzcyBhbmQgc2NyaXB0LmpzIGlmIHRoZXNlXHJcbiAgICAgICAgICogZmlsZXMnIG5hbWVzIHdlcmUgbm90IGV4cGxpY2l0bHkgc3BlY2lmaWVkLlxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgLSB0aGUgdXJsIG9mIHRoZSBjb21wb25lbnRcclxuICAgICAgICAqL1xyXG4gICAgICAgIGltcG9ydENvbXBvbmVudCh1cmwpIHtcclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW1wb3J0U2NyaXB0KHVybCArICcvc2NyaXB0LmpzJyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVtb3ZlcyBiYWNrIGFuZCBmb3J3YXJkIHNsYXNoZXMgZnJvbSBzdHJpbmdcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxyXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmVtb3ZlU2xhc2hlcyhwYXRoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBwYXRoLnJlcGxhY2UoL1svfFxcXFxdL2csICcnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlbW92ZSBuZXcgbGluZXMgZnJvbSB0aGUgYmVnaW5uaW5nIG9mIHRlbXBsYXRlcyxcclxuICAgICAgICAgKiBiZWNhdXNlIHRlbXBsYXRlLmZpcnN0Q2hpbGQuY2xvbmVOb2RlIHdpbGwgY2xvbmUgYW4gZW1wdHlcclxuICAgICAgICAgKiBzdHJpbmcgYW5kIHdpbGwgcmV0dXJuIGFuIGVtcHR5IHRlbXBsYXRlLlxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZW1wbGF0ZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAgICAgICAgKi9cclxuICAgICAgICByZW1vdmVOZXdMaW5lcyh0ZW1wbGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGVtcGxhdGUucmVwbGFjZShuZXdMaW5lc1JlZ0V4cCwgJycpLnRyaW0oKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlbW92ZXMgdGhlIGNvcHlyaWdodCBub3RpY2UgZnJvbSB0aGUgdGVtcGxhdGVcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGVtcGxhdGVcclxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSB0aGUgdGVtcGxhdGUgd2l0aG91dCB0aGUgY29weXJpZ2h0IG5vdGljZVxyXG4gICAgICAgICovXHJcbiAgICAgICAgcmVtb3ZlQ29weXJpZ2h0Tm90aWNlKHRlbXBsYXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZW1wbGF0ZS5yZXBsYWNlKGA8IS0tQ29weXJpZ2h0IChjKSBDb2hlcmVudCBMYWJzIEFELiBBbGwgcmlnaHRzIHJlc2VydmVkLiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuIFNlZSBMaWNlbnNlLnR4dCBpbiB0aGUgcHJvamVjdCByb290IGZvciBsaWNlbnNlIGluZm9ybWF0aW9uLiAtLT5gLCAnJykudHJpbSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVXNlZCB3aGVuIHRoZSBlbGVtZW50IGhhcyBhbHJlYWR5IGJlZW4gcmVuZGVyZWQuXHJcbiAgICAgICAgICogUmV0dXJuIHRoZSBhbHJlYWR5IHJlbmRlcmVkIHRlbXBsYXRlIGluc3RlYWQgb2ZcclxuICAgICAgICAgKiBsb2FkaW5nIGFuZCBzbG90dGluZyBpdHMgZWxlbWVudHMuXHJcbiAgICAgICAgICpcclxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb21wb25lbnQgLSB0aGUgY29tcG9uZW50IHRoYXQgd2FzIHJlbmRlcmVkXHJcbiAgICAgICAgICogQHJldHVybnMge1Byb21pc2U8SFRNTEVsZW1lbnQ+fSAtIGEgcHJvbWlzZSB0aGF0IHdpbGwgcmVzb2x2ZSB3aXRoIHRoZSByZW5kZXJlZCB0ZW1wbGF0ZVxyXG4gICAgICAgICovXHJcbiAgICAgICAgcmVzb2x2ZVdpdGhUZW1wbGF0ZShjb21wb25lbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogY29tcG9uZW50LnRlbXBsYXRlLFxyXG4gICAgICAgICAgICAgICAgICAgIHVybDogY29tcG9uZW50LnVybCxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVzZXMgYW4gWE1MSHR0cFJlcXVlc3QgdG8gbG9hZCBhbiBleHRlcm5hbCBmaWxlLlxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb21wb25lbnQgLSB0aGUgdXJsIG9mIHRoZSBmaWxlLlxyXG4gICAgICAgICAqIEByZXR1cm5zIHtwcm9taXNlfSAtIGEgcHJvbWlzZSB0aGF0IGlzIHJlc29sdmVkIHdpdGggdGhlIGZpbGUncyB0ZXh0IGNvbnRlbnQuXHJcbiAgICAgICAgKi9cclxuICAgICAgICBsb2FkUmVzb3VyY2UoY29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQudGVtcGxhdGUgJiYgdHlwZW9mIGNvbXBvbmVudC50ZW1wbGF0ZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb21wb25lbnQuaXNSZW5kZXJlZCkgcmV0dXJuIHRoaXMucmVzb2x2ZVdpdGhUZW1wbGF0ZShjb21wb25lbnQpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLnJlbW92ZUNvcHlyaWdodE5vdGljZShjb21wb25lbnQudGVtcGxhdGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogdGhpcy5yZW1vdmVOZXdMaW5lcyh0ZW1wbGF0ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogY29tcG9uZW50LnVybCxcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC50ZW1wbGF0ZSA9PT0gJ29iamVjdCcgJiYgY29tcG9uZW50LmlzUmVuZGVyZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc29sdmVXaXRoVGVtcGxhdGUoY29tcG9uZW50KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5fX29wdGltaXplKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMucmVtb3ZlU2xhc2hlcyhjb21wb25lbnQudXJsKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkuZmlyc3RDaGlsZDtcclxuICAgICAgICAgICAgICAgIC8vIGZhbGxiYWNrIHRvIFhIUlxyXG4gICAgICAgICAgICAgICAgaWYgKCFlbGVtZW50KSByZXR1cm4gdGhpcy5yZXF1ZXN0UmVzb3VyY2UoY29tcG9uZW50LnVybCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHRlbXBsYXRlOiBlbGVtZW50LmlubmVySFRNTCwgdXJsOiBjb21wb25lbnQudXJsIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3RSZXNvdXJjZShjb21wb25lbnQudXJsKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBFeGVjdXRlIGFuIFhNTEh0dHBSZXF1ZXN0IHRvIGxvYWQgYSByZXNvdXJjZSBieSB1cmwuXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHVybCAtIHRoZSBwYXRoIHRvIHRoZSByZXNvdXJjZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtwcm9taXNlfSAtIHByb21pc2Ugd2hpY2ggcmVzb2x2ZXMgd2l0aCB0aGUgbG9hZGVkIHJlc291cmNlXHJcbiAgICAgICAgKi9cclxuICAgICAgICByZXF1ZXN0UmVzb3VyY2UodXJsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgY29uc3QgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgICAgIHJlcXVlc3Qub25sb2FkID0gKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcXVlc3Quc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHsgdGVtcGxhdGU6IHJlcXVlc3QucmVzcG9uc2VUZXh0LCB1cmw6IHVybCB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICByZXF1ZXN0Lm9uZXJyb3IgPSByZWplY3Q7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCk7XHJcbiAgICAgICAgICAgIHJlcXVlc3Quc2VuZCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlY3Vyc2l2ZWx5IGZpbmRzIHRoZSBzbG90IGVsZW1lbnRzIGluIGEgZ2l2ZW4gZWxlbWVudC5cclxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBwYXJlbnQgLSB0aGUgZWxlbWVudCB3aGljaCBpcyBzZWFyY2hlZCBmb3Igc2xvdHMuXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHBhcmVudEVsTmFtZVxyXG4gICAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZXN1bHQgLSBhIGtleTp2YWx1ZSBvYmplY3QgY29udGFpbmluZyB0aGUgc2xvdCBlbGVtZW50c1xyXG4gICAgICAgICAqIHVuZGVyIHRoZWlyIGRhdGEtbmFtZSBhcyB2YWx1ZTpcclxuICAgICAgICAgKiB7IDxteS1zbG90LW5hbWU+OiBIVE1MRWxlbWVudCB9XHJcbiAgICAgICAgICogQHJldHVybnMge09iamVjdH0gcmVzdWx0XHJcbiAgICAgICAgKi9cclxuICAgICAgICBmaW5kU2xvdHMocGFyZW50LCBwYXJlbnRFbE5hbWUsIHJlc3VsdCA9IHt9KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkcmVuID0gcGFyZW50LmNoaWxkcmVuO1xyXG4gICAgICAgICAgICBjb25zdCBsZW5ndGggPSBjaGlsZHJlbi5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZCA9IGNoaWxkcmVuW2ldO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGRUYWdOYW1lID0gY2hpbGQudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjaGlsZFRhZ05hbWUgPT09ICdjb21wb25lbnQtc2xvdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gY2hpbGQuZGF0YXNldC5uYW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVzdWx0W25hbWVdKSByZXN1bHRbbmFtZV0gPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRbbmFtZV0ucHVzaChjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5kU2xvdHMoY2hpbGQsIHBhcmVudEVsTmFtZSwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoY2hpbGQuaGFzQXR0cmlidXRlKCdzbG90JykpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzbG90ID0gY2hpbGQuZ2V0QXR0cmlidXRlKCdzbG90Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyZXN1bHRbc2xvdF0pIHJlc3VsdFtzbG90XSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtzbG90XS5wdXNoKGNoaWxkKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbmRTbG90cyhjaGlsZCwgcGFyZW50RWxOYW1lLCByZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBzY3JvbGxhYmxlIGNvbnRhaW5lciBpcyB0aGUgT05MWSBjb21wb25lbnQgdGhhdCBjYW4gaG9sZFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNsb3RzIG9mIGFub3RoZXIgZWxlbWVudHM7IHdlIGFsbG93IHRoaXMgaW4gb3JkZXIgYWNoaWV2ZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGJldHRlciBpbnRlZ3JhdGlvbiBvZiB0aGUgc2Nyb2xsYmFyIGluc2lkZSBvdGhlciBjb21wb25lbnRzXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhlIFdlYkNvbXBvbmVudHMgYW5kIHRoZSBzdGFuZGFyZCBzbG90IGVsZW1lbnRzIGRvbid0IHN1cHBvcnRcclxuICAgICAgICAgICAgICAgICAgICAvLyBzdWNoIGJlaGF2aW9yOyBhbiBlbGVtZW50IGhhbmRsZXMgb25seSBpdHMgb3duIHNsb3RzLiBUaGUgc2Nyb2xsYWJsZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5lciBpcyBhbiBleGNlcHRpb24gZnJvbSB0aGlzIHJ1bGUuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGNoaWxkVGFnTmFtZSA9PT0gJ2dhbWVmYWNlLXNjcm9sbGFibGUtY29udGFpbmVyJyB8fFxyXG4gICAgICAgICAgICAgICAgICAgIChjaGlsZFRhZ05hbWUgIT09IEdGX0NPTVBPTkVOVF9TTE9UX1RBR19OQU1FICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudEVsTmFtZSAhPT0gY2hpbGRUYWdOYW1lICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICF3aW5kb3cuR1VJQ29tcG9uZW50c0RlZmluZWRFbGVtZW50c1tjaGlsZFRhZ05hbWVdKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBjaGlsZCBpcyBhbm90aGVyIG5lc3RlZCBlbGVtZW50IGRvbid0IGxvb2sgZm9yIHNsb3RzIGluIGl0XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5kU2xvdHMoY2hpbGQsIHBhcmVudEVsTmFtZSwgcmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdpbGwgcmVwbGFjZSB0aGUgc2xvdCBlbGVtZW50XHJcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudFtdfSBzb3VyY2VcclxuICAgICAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSB0YXJnZXRcclxuICAgICAgICAgKi9cclxuICAgICAgICByZXBsYWNlU2xvdHMoc291cmNlLCB0YXJnZXQpIHtcclxuICAgICAgICAgICAgY29uc3QgZmFrZVJvb3QgPSB0YXJnZXRbMF07XHJcbiAgICAgICAgICAgIGlmIChzb3VyY2UubGVuZ3RoICYmIGZha2VSb290LmNoaWxkTm9kZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoZmFrZVJvb3QuZmlyc3RDaGlsZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZha2VSb290LnJlbW92ZUNoaWxkKGZha2VSb290Lmxhc3RDaGlsZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBzbG90IHNvIHRoYXQgaXQgY2FuIGJlIHJlcGxhY2VkXHJcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudCA9IGZha2VSb290LnBhcmVudE5vZGU7XHJcbiAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChmYWtlUm9vdCk7XHJcblxyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNvdXJjZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHNvdXJjZVtpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFRyYW5zZmVycyB0aGUgc2xvdHRhYmxlIGVsZW1lbnRzIGludG8gdGhlaXIgc2xvdHMuXHJcbiAgICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc291cmNlIC0gdGhlIGVsZW1lbnQgY29udGFpbmluZyB0aGUgc2xvdHRhYmxlIGVsZW1lbnRzLlxyXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldCAtIHRoZSBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIHNsb3RzIGVsZW1lbnRzLlxyXG4gICAgICAgICovXHJcbiAgICAgICAgdHJhbnNmZXJDb250ZW50KHNvdXJjZSwgdGFyZ2V0KSB7XHJcbiAgICAgICAgICAgIHdoaWxlICh0YXJnZXQuY2hpbGROb2Rlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlcyA9IHRhcmdldC5jaGlsZE5vZGVzO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LnJlbW92ZUNoaWxkKG5vZGVzW25vZGVzLmxlbmd0aCAtIDFdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB3aGlsZSAoc291cmNlLmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZXMgPSBzb3VyY2UuY2hpbGROb2RlcztcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vZGUgPSBub2Rlc1swXTtcclxuICAgICAgICAgICAgICAgIHNvdXJjZS5yZW1vdmVDaGlsZChub2RlKTtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5hcHBlbmRDaGlsZChub2RlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVuZGVyZXMgYW4gZWxlbWVudCBvbmx5IGlmIGl0IHdhc24ndCByZW5kZXJlZCBiZWZvcmUgdGhhdFxyXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcclxuICAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSB0cnVlIGlmIGl0IHdhcyByZW5kZXJlZCwgZmFsc2UgaWYgbm90XHJcbiAgICAgICAgKi9cclxuICAgICAgICByZW5kZXJPbmNlKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQuaXNSZW5kZXJlZCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5yZW5kZXIoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIGVsZW1lbnQuaXNSZW5kZXJlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgKiBSZW5kZXJzIGFuIGVsZW1lbnQncyBjb250ZW50IGludG8gaXRzIHRlbXBsYXRlLlxyXG4gICAgICAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIHRoZSBlbGVtZW50IGludG8gd2hpY2ggdG8gcmVuZGVyIHRoZSBjb250ZW50XHJcbiAgICAgICAgKi9cclxuICAgICAgICByZW5kZXIoZWxlbWVudCkge1xyXG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZVJvb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgdGVtcGxhdGVSb290LmlubmVySFRNTCA9IGVsZW1lbnQudGVtcGxhdGU7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwYXJlbnRFbE5hbWUgPSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlU2xvdHMgPSB0aGlzLmZpbmRTbG90cyh0ZW1wbGF0ZVJvb3QsIHBhcmVudEVsTmFtZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHVzZXJTbG90cyA9IHRoaXMuZmluZFNsb3RzKGVsZW1lbnQsIHBhcmVudEVsTmFtZSk7XHJcblxyXG4gICAgICAgICAgICAvLyB1c2UgZm9yLi4ub2YgaW5zdGVhZCBvZiBmb3IuLi5pbiBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlXHJcbiAgICAgICAgICAgIGNvbnN0IHVzZXJTbG90c0tleXMgPSBPYmplY3Qua2V5cyh1c2VyU2xvdHMpO1xyXG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZVNsb3RzS2V5cyA9IE9iamVjdC5rZXlzKHRlbXBsYXRlU2xvdHMpO1xyXG5cclxuICAgICAgICAgICAgLy8gdGhlcmUncyBubyBwb2ludCBpbiBsb29waW5nIG92ZXIgdXNlclNsb3RzIGlmIHRoZXJlIGFyZW4ndFxyXG4gICAgICAgICAgICAvLyBjb3JyZXNwb25kaW5nIHRlbXBsYXRlIHNsb3RzXHJcbiAgICAgICAgICAgIGlmICh0ZW1wbGF0ZVNsb3RzS2V5cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdXNlclNsb3Qgb2YgdXNlclNsb3RzS2V5cykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghdXNlclNsb3RzW3VzZXJTbG90XSB8fCAhdGVtcGxhdGVTbG90c1t1c2VyU2xvdF0pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVwbGFjZVNsb3RzKHVzZXJTbG90c1t1c2VyU2xvdF0sIHRlbXBsYXRlU2xvdHNbdXNlclNsb3RdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy50cmFuc2ZlckNvbnRlbnQodGVtcGxhdGVSb290LCBlbGVtZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFVzZWQgdG8gcmVuZGVyLlxyXG4gICAgICAgICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSB0aGUgZWxlbWVudCB3aGljaCB3aWxsIGJlIHJlbmRlcmVkXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHRhcmdldENvbnRhaW5lclNlbGVjdG9yIC0gdGhlIHNlbGVjdG9yIG9mIHRoZSBwYXJlbnQgZWxlbWVudFxyXG4gICAgICAgICAqIEBwYXJhbSB7QXJyYXk8SFRNTEVsZW1lbnQ+fSBjaGlsZHJlbiAtIHRoZSBjaGlsZCBlbGVtZW50cyB0aGF0IG5lZWQgdG8gZ28gaW50byB0aGUgcGFyZW50XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdHJhbnNmZXJDaGlsZHJlbihlbGVtZW50LCB0YXJnZXRDb250YWluZXJTZWxlY3RvciwgY2hpbGRyZW4pIHtcclxuICAgICAgICAgICAgY29uc3QgdGVtcGxhdGVSb290ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlUm9vdC5pbm5lckhUTUwgPSBlbGVtZW50LnRlbXBsYXRlO1xyXG4gICAgICAgICAgICBjb25zdCBjb250YWluZXIgPSB0ZW1wbGF0ZVJvb3QucXVlcnlTZWxlY3Rvcih0YXJnZXRDb250YWluZXJTZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIGNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4gY29udGFpbmVyLmFwcGVuZENoaWxkKGNoaWxkKSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRyYW5zZmVyQ29udGVudCh0ZW1wbGF0ZVJvb3QsIGVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGVsYXkgdGhlIGV4ZWN1dGlvbiBvZiBhIGNhbGxiYWNrIGZ1bmN0aW9uIGJ5IG4gYW1vdW50IG9mIGZyYW1lcy5cclxuICAgICAgICAgKiBVc2VkIHRvIHJldHJpZXZlIHRoZSBjb21wdXRlZCBzdHlsZXMgb2YgZWxlbWVudHMuXHJcbiAgICAgICAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgLSB0aGUgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIGV4ZWN1dGVkLlxyXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudCAtIHRoZSBhbW91bnQgb2YgZnJhbWVzIHRoYXQgdGhlIGNhbGxiYWNrIGV4ZWN1dGlvblxyXG4gICAgICAgICAqIHNob3VsZCBiZSBkZWxheWVkIGJ5LlxyXG4gICAgICAgICAqIEByZXR1cm5zIHthbnl9XHJcbiAgICAgICAgKi9cclxuICAgICAgICB3YWl0Rm9yRnJhbWVzKGNhbGxiYWNrID0gKCkgPT4geyB9LCBjb3VudCA9IDMpIHtcclxuICAgICAgICAgICAgaWYgKGNvdW50ID09PSAwKSByZXR1cm4gY2FsbGJhY2soKTtcclxuICAgICAgICAgICAgY291bnQtLTtcclxuICAgICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMud2FpdEZvckZyYW1lcyhjYWxsYmFjaywgY291bnQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENoZWNrcyBpZiB0aGUgY3VycmVudCB1c2VyIGFnZW50IGlzIENvaHRtbFxyXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufVxyXG4gICAgICAgICovXHJcbiAgICAgICAgaXNCcm93c2VyR2FtZWZhY2UoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKCdDb2h0bWwnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIENoZWNrIGlmIGEgdmFsdWUgaXMgYSBudW1iZXIgYW5kIGlmIG5vdCAtIGxvZyBhbiBlcnJvclxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wTmFtZSAtIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB0aGF0IG5lZWRzIHRvIGJlIHZhbGlkYXRlZFxyXG4gICAgICAgICAqIEBwYXJhbSB7YW55fSB2YWx1ZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSAtIHRydWUgaWYgaXQgaXMgYSBudW1iZXIgb3IgYSBzdHJpbmcgdGhhdCBjYW4gYmUgY2FzdCB0byBudW1iZXIsIGZhbHNlIGlmIG5vdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlzTnVtYmVyUG9zaXRpdmVWYWxpZGF0aW9uKHByb3BOYW1lLCB2YWx1ZSkge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUludCh2YWx1ZSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoaXNOYU4ocGFyc2VkKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgVW5zdXBwb3J0ZWQgdHlwZVske3R5cGVvZiBwYXJzZWR9XSBnaXZlbiBmb3IgJHtwcm9wTmFtZX0uIFBvc3NpYmxlIHZhbHVlcyBhcmUgcG9zaXRpdmUgbnVtYmVycy5gKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBhcnNlZCA8IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYFRoZSBwYXNzZWQgdmFsdWUgZm9yICR7cHJvcE5hbWV9IC0gJHt2YWx1ZX0gaXMgbm90IGEgcG9zaXRpdmUgbnVtYmVyLiBQbGVhc2UgdXNlIHBvc2l0aXZlIG51bWJlcnMgb25seSBmb3IgJHtwcm9wTmFtZX0uYCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjb21wb25lbnRzID0gbmV3IEdhbWVmYWNlQ29tcG9uZW50cygpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2xhc3MgdGhhdCB3aWxsIGhhbmRsZSBnYW1lZmFjZSBjb21wb25lbnRzIHNsb3QgZWxlbWVudFxyXG4gICAgICovXHJcbiAgICBjbGFzcyBDb21wb25lbnRTbG90IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlIHJlcXVpcmUtanNkb2MgKi9cclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbmFsQXBwZW5kQ2hpbGQgPSB0aGlzLmFwcGVuZENoaWxkO1xyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbmFsSW5zZXJ0QmVmb3JlID0gdGhpcy5pbnNlcnRCZWZvcmU7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luYWxSZXBsYWNlQ2hpbGQgPSB0aGlzLnJlcGxhY2VDaGlsZDtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbFJlbW92ZUNoaWxkID0gdGhpcy5yZW1vdmVDaGlsZDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYXBwZW5kQ2hpbGQgPSAobm9kZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGQgPSB0aGlzLm9yaWdpbmFsQXBwZW5kQ2hpbGQobm9kZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3B0YWNoU2xvdENoYW5nZShjaGlsZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNoaWxkO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5pbnNlcnRCZWZvcmUgPSAobmV3Tm9kZSwgcmVmZXJlbmNlTm9kZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY2hpbGQgPSB0aGlzLm9yaWdpbmFsSW5zZXJ0QmVmb3JlKG5ld05vZGUsIHJlZmVyZW5jZU5vZGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwdGFjaFNsb3RDaGFuZ2UoY2hpbGQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZDtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVwbGFjZUNoaWxkID0gKG5ld0NoaWxkLCBvbGRDaGlsZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVwbGFjZWROb2RlID0gdGhpcy5vcmlnaW5hbFJlcGxhY2VDaGlsZChuZXdDaGlsZCwgb2xkQ2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwdGFjaFNsb3RDaGFuZ2UocmVwbGFjZWROb2RlKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVwbGFjZWROb2RlO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVDaGlsZCA9IChjaGlsZCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVtb3ZlZE5vZGUgPSB0aGlzLm9yaWdpbmFsUmVtb3ZlQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwdGFjaFNsb3RDaGFuZ2UocmVtb3ZlZE5vZGUpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiByZW1vdmVkTm9kZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRpc3B0YWNoU2xvdENoYW5nZShjaGlsZCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KCdzbG90Y2hhbmdlJyksIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldDogdGhpcyxcclxuICAgICAgICAgICAgICAgIGNoaWxkOiBjaGlsZCxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIHJlcXVpcmUtanNkb2MgKi9cclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnRzLmRlZmluZUN1c3RvbUVsZW1lbnQoR0ZfQ09NUE9ORU5UX1NMT1RfVEFHX05BTUUsIENvbXBvbmVudFNsb3QpO1xyXG5cclxuICAgIHJldHVybiBjb21wb25lbnRzO1xyXG59O1xyXG5cclxuZXhwb3J0IHsgQ29tcG9uZW50cyB9O1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuLyogZXNsaW50LWRpc2FibGUgcmVxdWlyZS1qc2RvYyAqL1xyXG4vKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gKiAgQ29weXJpZ2h0IChjKSBDb2hlcmVudCBMYWJzIEFELiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKiAgTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLiBTZWUgTGljZW5zZS50eHQgaW4gdGhlIHByb2plY3Qgcm9vdCBmb3IgbGljZW5zZSBpbmZvcm1hdGlvbi5cclxuICotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcblxyXG5pbXBvcnQgR2FtZWZhY2VUb2FzdCBmcm9tICcuL3NjcmlwdC5qcyc7XHJcbmltcG9ydCB7IHBtIH0gZnJvbSAncG9zdG1lc3NhZ2UtcG9seWZpbGwnO1xyXG5pbXBvcnQgeyBmZXRjaCBhcyBmZXRjaFBvbHlmaWxsIH0gZnJvbSAnd2hhdHdnLWZldGNoJztcclxuXHJcbndpbmRvdy5wb3N0TWVzc2FnZSA9IGZ1bmN0aW9uIChtZXNzYWdlKSB7XHJcbiAgICBwbSh7XHJcbiAgICAgICAgb3JpZ2luOiAnaHR0cDovLzEyNy4wLjAuMS86MzAwMCcsXHJcbiAgICAgICAgdGFyZ2V0OiB3aW5kb3csXHJcbiAgICAgICAgZGF0YTogbWVzc2FnZSxcclxuICAgIH0pO1xyXG59O1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=