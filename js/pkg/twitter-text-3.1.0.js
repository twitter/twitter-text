/*!
 * twitter-text 3.1.0
 *
 * Copyright 2018 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this work except in compliance with the License.
 * You may obtain a copy of the License at:
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, (global.twttr = global.twttr || {}, global.twttr.txt = factory()));
}(this, function () { 'use strict';

  var _isObject = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
  };

  var _isObject$1 = /*#__PURE__*/Object.freeze({
    default: _isObject,
    __moduleExports: _isObject
  });

  var isObject = ( _isObject$1 && _isObject ) || _isObject$1;

  var _anObject = function (it) {
    if (!isObject(it)) throw TypeError(it + ' is not an object!');
    return it;
  };

  var _anObject$1 = /*#__PURE__*/Object.freeze({
    default: _anObject,
    __moduleExports: _anObject
  });

  // 7.2.1 RequireObjectCoercible(argument)
  var _defined = function (it) {
    if (it == undefined) throw TypeError("Can't call method on  " + it);
    return it;
  };

  var _defined$1 = /*#__PURE__*/Object.freeze({
    default: _defined,
    __moduleExports: _defined
  });

  var defined = ( _defined$1 && _defined ) || _defined$1;

  // 7.1.13 ToObject(argument)

  var _toObject = function (it) {
    return Object(defined(it));
  };

  var _toObject$1 = /*#__PURE__*/Object.freeze({
    default: _toObject,
    __moduleExports: _toObject
  });

  // 7.1.4 ToInteger
  var ceil = Math.ceil;
  var floor = Math.floor;
  var _toInteger = function (it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  };

  var _toInteger$1 = /*#__PURE__*/Object.freeze({
    default: _toInteger,
    __moduleExports: _toInteger
  });

  var toInteger = ( _toInteger$1 && _toInteger ) || _toInteger$1;

  // 7.1.15 ToLength

  var min = Math.min;
  var _toLength = function (it) {
    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  };

  var _toLength$1 = /*#__PURE__*/Object.freeze({
    default: _toLength,
    __moduleExports: _toLength
  });

  // true  -> String#at
  // false -> String#codePointAt
  var _stringAt = function (TO_STRING) {
    return function (that, pos) {
      var s = String(defined(that));
      var i = toInteger(pos);
      var l = s.length;
      var a, b;
      if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
      a = s.charCodeAt(i);
      return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
    };
  };

  var _stringAt$1 = /*#__PURE__*/Object.freeze({
    default: _stringAt,
    __moduleExports: _stringAt
  });

  var require$$0 = ( _stringAt$1 && _stringAt ) || _stringAt$1;

  var at = require$$0(true);

   // `AdvanceStringIndex` abstract operation
  // https://tc39.github.io/ecma262/#sec-advancestringindex
  var _advanceStringIndex = function (S, index, unicode) {
    return index + (unicode ? at(S, index).length : 1);
  };

  var _advanceStringIndex$1 = /*#__PURE__*/Object.freeze({
    default: _advanceStringIndex,
    __moduleExports: _advanceStringIndex
  });

  var toString = {}.toString;

  var _cof = function (it) {
    return toString.call(it).slice(8, -1);
  };

  var _cof$1 = /*#__PURE__*/Object.freeze({
    default: _cof,
    __moduleExports: _cof
  });

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var _core = createCommonjsModule(function (module) {
  var core = module.exports = { version: '2.6.10' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
  });
  var _core_1 = _core.version;

  var _core$1 = /*#__PURE__*/Object.freeze({
    default: _core,
    __moduleExports: _core,
    version: _core_1
  });

  var _global = createCommonjsModule(function (module) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math
    ? window : typeof self != 'undefined' && self.Math == Math ? self
    // eslint-disable-next-line no-new-func
    : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
  });

  var _global$1 = /*#__PURE__*/Object.freeze({
    default: _global,
    __moduleExports: _global
  });

  var _library = false;

  var _library$1 = /*#__PURE__*/Object.freeze({
    default: _library,
    __moduleExports: _library
  });

  var require$$1 = ( _core$1 && _core ) || _core$1;

  var require$$0$1 = ( _global$1 && _global ) || _global$1;

  var LIBRARY = ( _library$1 && _library ) || _library$1;

  var _shared = createCommonjsModule(function (module) {
  var SHARED = '__core-js_shared__';
  var store = require$$0$1[SHARED] || (require$$0$1[SHARED] = {});

  (module.exports = function (key, value) {
    return store[key] || (store[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: require$$1.version,
    mode: LIBRARY ? 'pure' : 'global',
    copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
  });
  });

  var _shared$1 = /*#__PURE__*/Object.freeze({
    default: _shared,
    __moduleExports: _shared
  });

  var id = 0;
  var px = Math.random();
  var _uid = function (key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
  };

  var _uid$1 = /*#__PURE__*/Object.freeze({
    default: _uid,
    __moduleExports: _uid
  });

  var require$$0$2 = ( _shared$1 && _shared ) || _shared$1;

  var uid = ( _uid$1 && _uid ) || _uid$1;

  var _wks = createCommonjsModule(function (module) {
  var store = require$$0$2('wks');

  var Symbol = require$$0$1.Symbol;
  var USE_SYMBOL = typeof Symbol == 'function';

  var $exports = module.exports = function (name) {
    return store[name] || (store[name] =
      USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
  };

  $exports.store = store;
  });

  var _wks$1 = /*#__PURE__*/Object.freeze({
    default: _wks,
    __moduleExports: _wks
  });

  var cof = ( _cof$1 && _cof ) || _cof$1;

  var require$$0$3 = ( _wks$1 && _wks ) || _wks$1;

  // getting tag from 19.1.3.6 Object.prototype.toString()

  var TAG = require$$0$3('toStringTag');
  // ES3 wrong here
  var ARG = cof(function () { return arguments; }()) == 'Arguments';

  // fallback for IE11 Script Access Denied error
  var tryGet = function (it, key) {
    try {
      return it[key];
    } catch (e) { /* empty */ }
  };

  var _classof = function (it) {
    var O, T, B;
    return it === undefined ? 'Undefined' : it === null ? 'Null'
      // @@toStringTag case
      : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
      // builtinTag case
      : ARG ? cof(O)
      // ES3 arguments fallback
      : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
  };

  var _classof$1 = /*#__PURE__*/Object.freeze({
    default: _classof,
    __moduleExports: _classof
  });

  var classof = ( _classof$1 && _classof ) || _classof$1;

  var builtinExec = RegExp.prototype.exec;

   // `RegExpExec` abstract operation
  // https://tc39.github.io/ecma262/#sec-regexpexec
  var _regexpExecAbstract = function (R, S) {
    var exec = R.exec;
    if (typeof exec === 'function') {
      var result = exec.call(R, S);
      if (typeof result !== 'object') {
        throw new TypeError('RegExp exec method returned something other than an Object or null');
      }
      return result;
    }
    if (classof(R) !== 'RegExp') {
      throw new TypeError('RegExp#exec called on incompatible receiver');
    }
    return builtinExec.call(R, S);
  };

  var _regexpExecAbstract$1 = /*#__PURE__*/Object.freeze({
    default: _regexpExecAbstract,
    __moduleExports: _regexpExecAbstract
  });

  var anObject = ( _anObject$1 && _anObject ) || _anObject$1;

  // 21.2.5.3 get RegExp.prototype.flags

  var _flags = function () {
    var that = anObject(this);
    var result = '';
    if (that.global) result += 'g';
    if (that.ignoreCase) result += 'i';
    if (that.multiline) result += 'm';
    if (that.unicode) result += 'u';
    if (that.sticky) result += 'y';
    return result;
  };

  var _flags$1 = /*#__PURE__*/Object.freeze({
    default: _flags,
    __moduleExports: _flags
  });

  var regexpFlags = ( _flags$1 && _flags ) || _flags$1;

  var nativeExec = RegExp.prototype.exec;
  // This always refers to the native implementation, because the
  // String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
  // which loads this file before patching the method.
  var nativeReplace = String.prototype.replace;

  var patchedExec = nativeExec;

  var LAST_INDEX = 'lastIndex';

  var UPDATES_LAST_INDEX_WRONG = (function () {
    var re1 = /a/,
        re2 = /b*/g;
    nativeExec.call(re1, 'a');
    nativeExec.call(re2, 'a');
    return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
  })();

  // nonparticipating capturing group, copied from es5-shim's String#split patch.
  var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

  var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

  if (PATCH) {
    patchedExec = function exec(str) {
      var re = this;
      var lastIndex, reCopy, match, i;

      if (NPCG_INCLUDED) {
        reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
      }
      if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

      match = nativeExec.call(re, str);

      if (UPDATES_LAST_INDEX_WRONG && match) {
        re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
      }
      if (NPCG_INCLUDED && match && match.length > 1) {
        // Fix browsers whose `exec` methods don't consistently return `undefined`
        // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
        // eslint-disable-next-line no-loop-func
        nativeReplace.call(match[0], reCopy, function () {
          for (i = 1; i < arguments.length - 2; i++) {
            if (arguments[i] === undefined) match[i] = undefined;
          }
        });
      }

      return match;
    };
  }

  var _regexpExec = patchedExec;

  var _regexpExec$1 = /*#__PURE__*/Object.freeze({
    default: _regexpExec,
    __moduleExports: _regexpExec
  });

  var _fails = function (exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };

  var _fails$1 = /*#__PURE__*/Object.freeze({
    default: _fails,
    __moduleExports: _fails
  });

  var require$$1$1 = ( _fails$1 && _fails ) || _fails$1;

  // Thank's IE8 for his funny defineProperty
  var _descriptors = !require$$1$1(function () {
    return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
  });

  var _descriptors$1 = /*#__PURE__*/Object.freeze({
    default: _descriptors,
    __moduleExports: _descriptors
  });

  var document = require$$0$1.document;
  // typeof document.createElement is 'object' in old IE
  var is = isObject(document) && isObject(document.createElement);
  var _domCreate = function (it) {
    return is ? document.createElement(it) : {};
  };

  var _domCreate$1 = /*#__PURE__*/Object.freeze({
    default: _domCreate,
    __moduleExports: _domCreate
  });

  var require$$0$4 = ( _descriptors$1 && _descriptors ) || _descriptors$1;

  var require$$2 = ( _domCreate$1 && _domCreate ) || _domCreate$1;

  var _ie8DomDefine = !require$$0$4 && !require$$1$1(function () {
    return Object.defineProperty(require$$2('div'), 'a', { get: function () { return 7; } }).a != 7;
  });

  var _ie8DomDefine$1 = /*#__PURE__*/Object.freeze({
    default: _ie8DomDefine,
    __moduleExports: _ie8DomDefine
  });

  // 7.1.1 ToPrimitive(input [, PreferredType])

  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  var _toPrimitive = function (it, S) {
    if (!isObject(it)) return it;
    var fn, val;
    if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
    if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
    if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var _toPrimitive$1 = /*#__PURE__*/Object.freeze({
    default: _toPrimitive,
    __moduleExports: _toPrimitive
  });

  var IE8_DOM_DEFINE = ( _ie8DomDefine$1 && _ie8DomDefine ) || _ie8DomDefine$1;

  var toPrimitive = ( _toPrimitive$1 && _toPrimitive ) || _toPrimitive$1;

  var dP = Object.defineProperty;

  var f = require$$0$4 ? Object.defineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPrimitive(P, true);
    anObject(Attributes);
    if (IE8_DOM_DEFINE) try {
      return dP(O, P, Attributes);
    } catch (e) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var _objectDp = {
  	f: f
  };

  var _objectDp$1 = /*#__PURE__*/Object.freeze({
    default: _objectDp,
    __moduleExports: _objectDp,
    f: f
  });

  var _propertyDesc = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var _propertyDesc$1 = /*#__PURE__*/Object.freeze({
    default: _propertyDesc,
    __moduleExports: _propertyDesc
  });

  var require$$1$2 = ( _objectDp$1 && _objectDp ) || _objectDp$1;

  var descriptor = ( _propertyDesc$1 && _propertyDesc ) || _propertyDesc$1;

  var _hide = require$$0$4 ? function (object, key, value) {
    return require$$1$2.f(object, key, descriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var _hide$1 = /*#__PURE__*/Object.freeze({
    default: _hide,
    __moduleExports: _hide
  });

  var hasOwnProperty = {}.hasOwnProperty;
  var _has = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  var _has$1 = /*#__PURE__*/Object.freeze({
    default: _has,
    __moduleExports: _has
  });

  var _functionToString = require$$0$2('native-function-to-string', Function.toString);

  var _functionToString$1 = /*#__PURE__*/Object.freeze({
    default: _functionToString,
    __moduleExports: _functionToString
  });

  var require$$0$5 = ( _hide$1 && _hide ) || _hide$1;

  var has = ( _has$1 && _has ) || _has$1;

  var $toString = ( _functionToString$1 && _functionToString ) || _functionToString$1;

  var _redefine = createCommonjsModule(function (module) {
  var SRC = uid('src');

  var TO_STRING = 'toString';
  var TPL = ('' + $toString).split(TO_STRING);

  require$$1.inspectSource = function (it) {
    return $toString.call(it);
  };

  (module.exports = function (O, key, val, safe) {
    var isFunction = typeof val == 'function';
    if (isFunction) has(val, 'name') || require$$0$5(val, 'name', key);
    if (O[key] === val) return;
    if (isFunction) has(val, SRC) || require$$0$5(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    if (O === require$$0$1) {
      O[key] = val;
    } else if (!safe) {
      delete O[key];
      require$$0$5(O, key, val);
    } else if (O[key]) {
      O[key] = val;
    } else {
      require$$0$5(O, key, val);
    }
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, TO_STRING, function toString() {
    return typeof this == 'function' && this[SRC] || $toString.call(this);
  });
  });

  var _redefine$1 = /*#__PURE__*/Object.freeze({
    default: _redefine,
    __moduleExports: _redefine
  });

  var _aFunction = function (it) {
    if (typeof it != 'function') throw TypeError(it + ' is not a function!');
    return it;
  };

  var _aFunction$1 = /*#__PURE__*/Object.freeze({
    default: _aFunction,
    __moduleExports: _aFunction
  });

  var aFunction = ( _aFunction$1 && _aFunction ) || _aFunction$1;

  // optional / simple context binding

  var _ctx = function (fn, that, length) {
    aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 1: return function (a) {
        return fn.call(that, a);
      };
      case 2: return function (a, b) {
        return fn.call(that, a, b);
      };
      case 3: return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
    }
    return function (/* ...args */) {
      return fn.apply(that, arguments);
    };
  };

  var _ctx$1 = /*#__PURE__*/Object.freeze({
    default: _ctx,
    __moduleExports: _ctx
  });

  var redefine = ( _redefine$1 && _redefine ) || _redefine$1;

  var require$$0$6 = ( _ctx$1 && _ctx ) || _ctx$1;

  var PROTOTYPE = 'prototype';

  var $export = function (type, name, source) {
    var IS_FORCED = type & $export.F;
    var IS_GLOBAL = type & $export.G;
    var IS_STATIC = type & $export.S;
    var IS_PROTO = type & $export.P;
    var IS_BIND = type & $export.B;
    var target = IS_GLOBAL ? require$$0$1 : IS_STATIC ? require$$0$1[name] || (require$$0$1[name] = {}) : (require$$0$1[name] || {})[PROTOTYPE];
    var exports = IS_GLOBAL ? require$$1 : require$$1[name] || (require$$1[name] = {});
    var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
    var key, own, out, exp;
    if (IS_GLOBAL) source = name;
    for (key in source) {
      // contains in native
      own = !IS_FORCED && target && target[key] !== undefined;
      // export native or passed
      out = (own ? target : source)[key];
      // bind timers to global for call from export context
      exp = IS_BIND && own ? require$$0$6(out, require$$0$1) : IS_PROTO && typeof out == 'function' ? require$$0$6(Function.call, out) : out;
      // extend global
      if (target) redefine(target, key, out, type & $export.U);
      // export
      if (exports[key] != out) require$$0$5(exports, key, exp);
      if (IS_PROTO && expProto[key] != out) expProto[key] = out;
    }
  };
  require$$0$1.core = require$$1;
  // type bitmap
  $export.F = 1;   // forced
  $export.G = 2;   // global
  $export.S = 4;   // static
  $export.P = 8;   // proto
  $export.B = 16;  // bind
  $export.W = 32;  // wrap
  $export.U = 64;  // safe
  $export.R = 128; // real proto method for `library`
  var _export = $export;

  var _export$1 = /*#__PURE__*/Object.freeze({
    default: _export,
    __moduleExports: _export
  });

  var regexpExec = ( _regexpExec$1 && _regexpExec ) || _regexpExec$1;

  var $export$1 = ( _export$1 && _export ) || _export$1;

  $export$1({
    target: 'RegExp',
    proto: true,
    forced: regexpExec !== /./.exec
  }, {
    exec: regexpExec
  });

  var SPECIES = require$$0$3('species');

  var REPLACE_SUPPORTS_NAMED_GROUPS = !require$$1$1(function () {
    // #replace needs built-in support for named groups.
    // #match works fine because it just return the exec results, even if it has
    // a "grops" property.
    var re = /./;
    re.exec = function () {
      var result = [];
      result.groups = { a: '7' };
      return result;
    };
    return ''.replace(re, '$<a>') !== '7';
  });

  var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
    // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
    var re = /(?:)/;
    var originalExec = re.exec;
    re.exec = function () { return originalExec.apply(this, arguments); };
    var result = 'ab'.split(re);
    return result.length === 2 && result[0] === 'a' && result[1] === 'b';
  })();

  var _fixReWks = function (KEY, length, exec) {
    var SYMBOL = require$$0$3(KEY);

    var DELEGATES_TO_SYMBOL = !require$$1$1(function () {
      // String methods call symbol-named RegEp methods
      var O = {};
      O[SYMBOL] = function () { return 7; };
      return ''[KEY](O) != 7;
    });

    var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !require$$1$1(function () {
      // Symbol-named RegExp methods call .exec
      var execCalled = false;
      var re = /a/;
      re.exec = function () { execCalled = true; return null; };
      if (KEY === 'split') {
        // RegExp[@@split] doesn't call the regex's exec method, but first creates
        // a new one. We need to return the patched regex when creating the new one.
        re.constructor = {};
        re.constructor[SPECIES] = function () { return re; };
      }
      re[SYMBOL]('');
      return !execCalled;
    }) : undefined;

    if (
      !DELEGATES_TO_SYMBOL ||
      !DELEGATES_TO_EXEC ||
      (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
      (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
    ) {
      var nativeRegExpMethod = /./[SYMBOL];
      var fns = exec(
        defined,
        SYMBOL,
        ''[KEY],
        function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
          if (regexp.exec === regexpExec) {
            if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
              // The native String method already delegates to @@method (this
              // polyfilled function), leasing to infinite recursion.
              // We avoid it by directly calling the native @@method method.
              return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
            }
            return { done: true, value: nativeMethod.call(str, regexp, arg2) };
          }
          return { done: false };
        }
      );
      var strfn = fns[0];
      var rxfn = fns[1];

      redefine(String.prototype, KEY, strfn);
      require$$0$5(RegExp.prototype, SYMBOL, length == 2
        // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
        // 21.2.5.11 RegExp.prototype[@@split](string, limit)
        ? function (string, arg) { return rxfn.call(string, this, arg); }
        // 21.2.5.6 RegExp.prototype[@@match](string)
        // 21.2.5.9 RegExp.prototype[@@search](string)
        : function (string) { return rxfn.call(string, this); }
      );
    }
  };

  var _fixReWks$1 = /*#__PURE__*/Object.freeze({
    default: _fixReWks,
    __moduleExports: _fixReWks
  });

  var toObject = ( _toObject$1 && _toObject ) || _toObject$1;

  var toLength = ( _toLength$1 && _toLength ) || _toLength$1;

  var advanceStringIndex = ( _advanceStringIndex$1 && _advanceStringIndex ) || _advanceStringIndex$1;

  var callRegExpExec = ( _regexpExecAbstract$1 && _regexpExecAbstract ) || _regexpExecAbstract$1;

  var require$$0$7 = ( _fixReWks$1 && _fixReWks ) || _fixReWks$1;

  var max = Math.max;
  var min$1 = Math.min;
  var floor$1 = Math.floor;
  var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
  var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

  var maybeToString = function (it) {
    return it === undefined ? it : String(it);
  };

  // @@replace logic
  require$$0$7('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
    return [
      // `String.prototype.replace` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.replace
      function replace(searchValue, replaceValue) {
        var O = defined(this);
        var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
        return fn !== undefined
          ? fn.call(searchValue, O, replaceValue)
          : $replace.call(String(O), searchValue, replaceValue);
      },
      // `RegExp.prototype[@@replace]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
      function (regexp, replaceValue) {
        var res = maybeCallNative($replace, regexp, this, replaceValue);
        if (res.done) return res.value;

        var rx = anObject(regexp);
        var S = String(this);
        var functionalReplace = typeof replaceValue === 'function';
        if (!functionalReplace) replaceValue = String(replaceValue);
        var global = rx.global;
        if (global) {
          var fullUnicode = rx.unicode;
          rx.lastIndex = 0;
        }
        var results = [];
        while (true) {
          var result = callRegExpExec(rx, S);
          if (result === null) break;
          results.push(result);
          if (!global) break;
          var matchStr = String(result[0]);
          if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        }
        var accumulatedResult = '';
        var nextSourcePosition = 0;
        for (var i = 0; i < results.length; i++) {
          result = results[i];
          var matched = String(result[0]);
          var position = max(min$1(toInteger(result.index), S.length), 0);
          var captures = [];
          // NOTE: This is equivalent to
          //   captures = result.slice(1).map(maybeToString)
          // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
          // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
          // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
          for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
          var namedCaptures = result.groups;
          if (functionalReplace) {
            var replacerArgs = [matched].concat(captures, position, S);
            if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
            var replacement = String(replaceValue.apply(undefined, replacerArgs));
          } else {
            replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
          }
          if (position >= nextSourcePosition) {
            accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
            nextSourcePosition = position + matched.length;
          }
        }
        return accumulatedResult + S.slice(nextSourcePosition);
      }
    ];

      // https://tc39.github.io/ecma262/#sec-getsubstitution
    function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
      var tailPos = position + matched.length;
      var m = captures.length;
      var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
      if (namedCaptures !== undefined) {
        namedCaptures = toObject(namedCaptures);
        symbols = SUBSTITUTION_SYMBOLS;
      }
      return $replace.call(replacement, symbols, function (match, ch) {
        var capture;
        switch (ch.charAt(0)) {
          case '$': return '$';
          case '&': return matched;
          case '`': return str.slice(0, position);
          case "'": return str.slice(tailPos);
          case '<':
            capture = namedCaptures[ch.slice(1, -1)];
            break;
          default: // \d\d?
            var n = +ch;
            if (n === 0) return match;
            if (n > m) {
              var f = floor$1(n / 10);
              if (f === 0) return match;
              if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
              return match;
            }
            capture = captures[n - 1];
        }
        return capture === undefined ? '' : capture;
      });
    }
  });

  // fallback for non-array-like ES3 and non-enumerable old V8 strings

  // eslint-disable-next-line no-prototype-builtins
  var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
    return cof(it) == 'String' ? it.split('') : Object(it);
  };

  var _iobject$1 = /*#__PURE__*/Object.freeze({
    default: _iobject,
    __moduleExports: _iobject
  });

  var IObject = ( _iobject$1 && _iobject ) || _iobject$1;

  // to indexed object, toObject with fallback for non-array-like ES3 strings


  var _toIobject = function (it) {
    return IObject(defined(it));
  };

  var _toIobject$1 = /*#__PURE__*/Object.freeze({
    default: _toIobject,
    __moduleExports: _toIobject
  });

  var max$1 = Math.max;
  var min$2 = Math.min;
  var _toAbsoluteIndex = function (index, length) {
    index = toInteger(index);
    return index < 0 ? max$1(index + length, 0) : min$2(index, length);
  };

  var _toAbsoluteIndex$1 = /*#__PURE__*/Object.freeze({
    default: _toAbsoluteIndex,
    __moduleExports: _toAbsoluteIndex
  });

  var toIObject = ( _toIobject$1 && _toIobject ) || _toIobject$1;

  var toAbsoluteIndex = ( _toAbsoluteIndex$1 && _toAbsoluteIndex ) || _toAbsoluteIndex$1;

  // false -> Array#indexOf
  // true  -> Array#includes



  var _arrayIncludes = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIObject($this);
      var length = toLength(O.length);
      var index = toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var _arrayIncludes$1 = /*#__PURE__*/Object.freeze({
    default: _arrayIncludes,
    __moduleExports: _arrayIncludes
  });

  var _strictMethod = function (method, arg) {
    return !!method && require$$1$1(function () {
      // eslint-disable-next-line no-useless-call
      arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
    });
  };

  var _strictMethod$1 = /*#__PURE__*/Object.freeze({
    default: _strictMethod,
    __moduleExports: _strictMethod
  });

  var require$$0$8 = ( _arrayIncludes$1 && _arrayIncludes ) || _arrayIncludes$1;

  var require$$0$9 = ( _strictMethod$1 && _strictMethod ) || _strictMethod$1;

  var $indexOf = require$$0$8(false);
  var $native = [].indexOf;
  var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

  $export$1($export$1.P + $export$1.F * (NEGATIVE_ZERO || !require$$0$9($native)), 'Array', {
    // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
    indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
      return NEGATIVE_ZERO
        // convert -0 to +0
        ? $native.apply(this, arguments) || 0
        : $indexOf(this, searchElement, arguments[1]);
    }
  });

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var cashtag = /[a-z]{1,6}(?:[._][a-z]{1,2})?/i;

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var punct = /\!'#%&'\(\)*\+,\\\-\.\/:;<=>\?@\[\]\^_{|}~\$/;

  var f$1 = {}.propertyIsEnumerable;

  var _objectPie = {
  	f: f$1
  };

  var _objectPie$1 = /*#__PURE__*/Object.freeze({
    default: _objectPie,
    __moduleExports: _objectPie,
    f: f$1
  });

  var pIE = ( _objectPie$1 && _objectPie ) || _objectPie$1;

  var gOPD = Object.getOwnPropertyDescriptor;

  var f$2 = require$$0$4 ? gOPD : function getOwnPropertyDescriptor(O, P) {
    O = toIObject(O);
    P = toPrimitive(P, true);
    if (IE8_DOM_DEFINE) try {
      return gOPD(O, P);
    } catch (e) { /* empty */ }
    if (has(O, P)) return descriptor(!pIE.f.call(O, P), O[P]);
  };

  var _objectGopd = {
  	f: f$2
  };

  var _objectGopd$1 = /*#__PURE__*/Object.freeze({
    default: _objectGopd,
    __moduleExports: _objectGopd,
    f: f$2
  });

  var require$$1$3 = ( _objectGopd$1 && _objectGopd ) || _objectGopd$1;

  // Works with __proto__ only. Old v8 can't work with null proto objects.
  /* eslint-disable no-proto */


  var check = function (O, proto) {
    anObject(O);
    if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
  };
  var _setProto = {
    set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
      function (test, buggy, set) {
        try {
          set = require$$0$6(Function.call, require$$1$3.f(Object.prototype, '__proto__').set, 2);
          set(test, []);
          buggy = !(test instanceof Array);
        } catch (e) { buggy = true; }
        return function setPrototypeOf(O, proto) {
          check(O, proto);
          if (buggy) O.__proto__ = proto;
          else set(O, proto);
          return O;
        };
      }({}, false) : undefined),
    check: check
  };
  var _setProto_1 = _setProto.set;
  var _setProto_2 = _setProto.check;

  var _setProto$1 = /*#__PURE__*/Object.freeze({
    default: _setProto,
    __moduleExports: _setProto,
    set: _setProto_1,
    check: _setProto_2
  });

  var require$$0$a = ( _setProto$1 && _setProto ) || _setProto$1;

  var setPrototypeOf = require$$0$a.set;
  var _inheritIfRequired = function (that, target, C) {
    var S = target.constructor;
    var P;
    if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
      setPrototypeOf(that, P);
    } return that;
  };

  var _inheritIfRequired$1 = /*#__PURE__*/Object.freeze({
    default: _inheritIfRequired,
    __moduleExports: _inheritIfRequired
  });

  var shared = require$$0$2('keys');

  var _sharedKey = function (key) {
    return shared[key] || (shared[key] = uid(key));
  };

  var _sharedKey$1 = /*#__PURE__*/Object.freeze({
    default: _sharedKey,
    __moduleExports: _sharedKey
  });

  var require$$0$b = ( _sharedKey$1 && _sharedKey ) || _sharedKey$1;

  var arrayIndexOf = require$$0$8(false);
  var IE_PROTO = require$$0$b('IE_PROTO');

  var _objectKeysInternal = function (object, names) {
    var O = toIObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
    return result;
  };

  var _objectKeysInternal$1 = /*#__PURE__*/Object.freeze({
    default: _objectKeysInternal,
    __moduleExports: _objectKeysInternal
  });

  // IE 8- don't enum bug keys
  var _enumBugKeys = (
    'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
  ).split(',');

  var _enumBugKeys$1 = /*#__PURE__*/Object.freeze({
    default: _enumBugKeys,
    __moduleExports: _enumBugKeys
  });

  var $keys = ( _objectKeysInternal$1 && _objectKeysInternal ) || _objectKeysInternal$1;

  var enumBugKeys = ( _enumBugKeys$1 && _enumBugKeys ) || _enumBugKeys$1;

  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

  var hiddenKeys = enumBugKeys.concat('length', 'prototype');

  var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return $keys(O, hiddenKeys);
  };

  var _objectGopn = {
  	f: f$3
  };

  var _objectGopn$1 = /*#__PURE__*/Object.freeze({
    default: _objectGopn,
    __moduleExports: _objectGopn,
    f: f$3
  });

  // 7.2.8 IsRegExp(argument)


  var MATCH = require$$0$3('match');
  var _isRegexp = function (it) {
    var isRegExp;
    return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
  };

  var _isRegexp$1 = /*#__PURE__*/Object.freeze({
    default: _isRegexp,
    __moduleExports: _isRegexp
  });

  var SPECIES$1 = require$$0$3('species');

  var _setSpecies = function (KEY) {
    var C = require$$0$1[KEY];
    if (require$$0$4 && C && !C[SPECIES$1]) require$$1$2.f(C, SPECIES$1, {
      configurable: true,
      get: function () { return this; }
    });
  };

  var _setSpecies$1 = /*#__PURE__*/Object.freeze({
    default: _setSpecies,
    __moduleExports: _setSpecies
  });

  var inheritIfRequired = ( _inheritIfRequired$1 && _inheritIfRequired ) || _inheritIfRequired$1;

  var require$$0$c = ( _objectGopn$1 && _objectGopn ) || _objectGopn$1;

  var isRegExp = ( _isRegexp$1 && _isRegexp ) || _isRegexp$1;

  var require$$6 = ( _setSpecies$1 && _setSpecies ) || _setSpecies$1;

  var dP$1 = require$$1$2.f;
  var gOPN = require$$0$c.f;


  var $RegExp = require$$0$1.RegExp;
  var Base = $RegExp;
  var proto = $RegExp.prototype;
  var re1 = /a/g;
  var re2 = /a/g;
  // "new" creates a new object, old webkit buggy here
  var CORRECT_NEW = new $RegExp(re1) !== re1;

  if (require$$0$4 && (!CORRECT_NEW || require$$1$1(function () {
    re2[require$$0$3('match')] = false;
    // RegExp constructor can alter flags and IsRegExp works correct with @@match
    return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
  }))) {
    $RegExp = function RegExp(p, f) {
      var tiRE = this instanceof $RegExp;
      var piRE = isRegExp(p);
      var fiU = f === undefined;
      return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
        : inheritIfRequired(CORRECT_NEW
          ? new Base(piRE && !fiU ? p.source : p, f)
          : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? regexpFlags.call(p) : f)
        , tiRE ? this : proto, $RegExp);
    };
    var proxy = function (key) {
      key in $RegExp || dP$1($RegExp, key, {
        configurable: true,
        get: function () { return Base[key]; },
        set: function (it) { Base[key] = it; }
      });
    };
    for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
    proto.constructor = $RegExp;
    $RegExp.prototype = proto;
    redefine(require$$0$1, 'RegExp', $RegExp);
  }

  require$$6('RegExp');

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  // Builds a RegExp
  function regexSupplant (regex, map, flags) {
    flags = flags || '';

    if (typeof regex !== 'string') {
      if (regex.global && flags.indexOf('g') < 0) {
        flags += 'g';
      }

      if (regex.ignoreCase && flags.indexOf('i') < 0) {
        flags += 'i';
      }

      if (regex.multiline && flags.indexOf('m') < 0) {
        flags += 'm';
      }

      regex = regex.source;
    }

    return new RegExp(regex.replace(/#\{(\w+)\}/g, function (match, name) {
      var newRegex = map[name] || '';

      if (typeof newRegex !== 'string') {
        newRegex = newRegex.source;
      }

      return newRegex;
    }), flags);
  }

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var spacesGroup = /\x09-\x0D\x20\x85\xA0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000/;

  // Copyright 2018 Twitter, Inc.
  var spaces = regexSupplant(/[#{spacesGroup}]/, {
    spacesGroup: spacesGroup
  });

  // Copyright 2018 Twitter, Inc.
  var validCashtag = regexSupplant('(^|#{spaces})(\\$)(#{cashtag})(?=$|\\s|[#{punct}])', {
    cashtag: cashtag,
    spaces: spaces,
    punct: punct
  }, 'gi');

  function extractCashtagsWithIndices (text) {
    if (!text || text.indexOf('$') === -1) {
      return [];
    }

    var tags = [];
    text.replace(validCashtag, function (match, before, dollar, cashtag, offset, chunk) {
      var startPosition = offset + before.length;
      var endPosition = startPosition + cashtag.length + 1;
      tags.push({
        cashtag: cashtag,
        indices: [startPosition, endPosition]
      });
    });
    return tags;
  }

  // @@match logic
  require$$0$7('match', 1, function (defined, MATCH, $match, maybeCallNative) {
    return [
      // `String.prototype.match` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.match
      function match(regexp) {
        var O = defined(this);
        var fn = regexp == undefined ? undefined : regexp[MATCH];
        return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
      },
      // `RegExp.prototype[@@match]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
      function (regexp) {
        var res = maybeCallNative($match, regexp, this);
        if (res.done) return res.value;
        var rx = anObject(regexp);
        var S = String(this);
        if (!rx.global) return callRegExpExec(rx, S);
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
        var A = [];
        var n = 0;
        var result;
        while ((result = callRegExpExec(rx, S)) !== null) {
          var matchStr = String(result[0]);
          A[n] = matchStr;
          if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
          n++;
        }
        return n === 0 ? null : A;
      }
    ];
  });

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var hashSigns = /[#＃]/;

  // Copyright 2018 Twitter, Inc.
  var endHashtagMatch = regexSupplant(/^(?:#{hashSigns}|:\/\/)/, {
    hashSigns: hashSigns
  });

  var validCCTLD = regexSupplant(RegExp('(?:(?:' + '한국|香港|澳門|新加坡|台灣|台湾|中國|中国|გე|ไทย|ලංකා|ഭാരതം|ಭಾರತ|భారత్|சிங்கப்பூர்|இலங்கை|இந்தியா|ଭାରତ|ભારત|' + 'ਭਾਰਤ|ভাৰত|ভারত|বাংলা|भारोत|भारतम्|भारत|ڀارت|پاکستان|موريتانيا|مليسيا|مصر|قطر|فلسطين|عمان|عراق|' + 'سورية|سودان|تونس|بھارت|بارت|ایران|امارات|المغرب|السعودية|الجزائر|الاردن|հայ|қаз|укр|срб|рф|' + 'мон|мкд|ею|бел|бг|ελ|zw|zm|za|yt|ye|ws|wf|vu|vn|vi|vg|ve|vc|va|uz|uy|us|um|uk|ug|ua|tz|tw|tv|' + 'tt|tr|tp|to|tn|tm|tl|tk|tj|th|tg|tf|td|tc|sz|sy|sx|sv|su|st|ss|sr|so|sn|sm|sl|sk|sj|si|sh|sg|' + 'se|sd|sc|sb|sa|rw|ru|rs|ro|re|qa|py|pw|pt|ps|pr|pn|pm|pl|pk|ph|pg|pf|pe|pa|om|nz|nu|nr|np|no|' + 'nl|ni|ng|nf|ne|nc|na|mz|my|mx|mw|mv|mu|mt|ms|mr|mq|mp|mo|mn|mm|ml|mk|mh|mg|mf|me|md|mc|ma|ly|' + 'lv|lu|lt|ls|lr|lk|li|lc|lb|la|kz|ky|kw|kr|kp|kn|km|ki|kh|kg|ke|jp|jo|jm|je|it|is|ir|iq|io|in|' + 'im|il|ie|id|hu|ht|hr|hn|hm|hk|gy|gw|gu|gt|gs|gr|gq|gp|gn|gm|gl|gi|gh|gg|gf|ge|gd|gb|ga|fr|fo|' + 'fm|fk|fj|fi|eu|et|es|er|eh|eg|ee|ec|dz|do|dm|dk|dj|de|cz|cy|cx|cw|cv|cu|cr|co|cn|cm|cl|ck|ci|' + 'ch|cg|cf|cd|cc|ca|bz|by|bw|bv|bt|bs|br|bq|bo|bn|bm|bl|bj|bi|bh|bg|bf|be|bd|bb|ba|az|ax|aw|au|' + 'at|as|ar|aq|ao|an|am|al|ai|ag|af|ae|ad|ac' + ')(?=[^0-9a-zA-Z@+-]|$))'));

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var directionalMarkersGroup = /\u202A-\u202E\u061C\u200E\u200F\u2066\u2067\u2068\u2069/;

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var invalidCharsGroup = /\uFFFE\uFEFF\uFFFF/;

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  // simple string interpolation
  function stringSupplant (str, map) {
    return str.replace(/#\{(\w+)\}/g, function (match, name) {
      return map[name] || '';
    });
  }

  // Copyright 2018 Twitter, Inc.
  var invalidDomainChars = stringSupplant('#{punct}#{spacesGroup}#{invalidCharsGroup}#{directionalMarkersGroup}', {
    punct: punct,
    spacesGroup: spacesGroup,
    invalidCharsGroup: invalidCharsGroup,
    directionalMarkersGroup: directionalMarkersGroup
  });

  // Copyright 2018 Twitter, Inc.
  var validDomainChars = regexSupplant(/[^#{invalidDomainChars}]/, {
    invalidDomainChars: invalidDomainChars
  });

  // Copyright 2018 Twitter, Inc.
  var validDomainName = regexSupplant(/(?:(?:#{validDomainChars}(?:-|#{validDomainChars})*)?#{validDomainChars}\.)/, {
    validDomainChars: validDomainChars
  });

  var validGTLD = regexSupplant(RegExp('(?:(?:' + '삼성|닷컴|닷넷|香格里拉|餐厅|食品|飞利浦|電訊盈科|集团|通販|购物|谷歌|诺基亚|联通|网络|网站|网店|网址|组织机构|移动|珠宝|点看|游戏|淡马锡|机构|書籍|时尚|新闻|' + '政府|政务|招聘|手表|手机|我爱你|慈善|微博|广东|工行|家電|娱乐|天主教|大拿|大众汽车|在线|嘉里大酒店|嘉里|商标|商店|商城|公益|公司|八卦|健康|信息|佛山|企业|' + '中文网|中信|世界|ポイント|ファッション|セール|ストア|コム|グーグル|クラウド|みんな|คอม|संगठन|नेट|कॉम|همراه|موقع|موبايلي|كوم|' + 'كاثوليك|عرب|شبكة|بيتك|بازار|العليان|ارامكو|اتصالات|ابوظبي|קום|сайт|рус|орг|онлайн|москва|ком|' + 'католик|дети|zuerich|zone|zippo|zip|zero|zara|zappos|yun|youtube|you|yokohama|yoga|yodobashi|' + 'yandex|yamaxun|yahoo|yachts|xyz|xxx|xperia|xin|xihuan|xfinity|xerox|xbox|wtf|wtc|wow|world|' + 'works|work|woodside|wolterskluwer|wme|winners|wine|windows|win|williamhill|wiki|wien|whoswho|' + 'weir|weibo|wedding|wed|website|weber|webcam|weatherchannel|weather|watches|watch|warman|' + 'wanggou|wang|walter|walmart|wales|vuelos|voyage|voto|voting|vote|volvo|volkswagen|vodka|' + 'vlaanderen|vivo|viva|vistaprint|vista|vision|visa|virgin|vip|vin|villas|viking|vig|video|' + 'viajes|vet|versicherung|vermögensberatung|vermögensberater|verisign|ventures|vegas|vanguard|' + 'vana|vacations|ups|uol|uno|university|unicom|uconnect|ubs|ubank|tvs|tushu|tunes|tui|tube|trv|' + 'trust|travelersinsurance|travelers|travelchannel|travel|training|trading|trade|toys|toyota|' + 'town|tours|total|toshiba|toray|top|tools|tokyo|today|tmall|tkmaxx|tjx|tjmaxx|tirol|tires|tips|' + 'tiffany|tienda|tickets|tiaa|theatre|theater|thd|teva|tennis|temasek|telefonica|telecity|tel|' + 'technology|tech|team|tdk|tci|taxi|tax|tattoo|tatar|tatamotors|target|taobao|talk|taipei|tab|' + 'systems|symantec|sydney|swiss|swiftcover|swatch|suzuki|surgery|surf|support|supply|supplies|' + 'sucks|style|study|studio|stream|store|storage|stockholm|stcgroup|stc|statoil|statefarm|' + 'statebank|starhub|star|staples|stada|srt|srl|spreadbetting|spot|sport|spiegel|space|soy|sony|' + 'song|solutions|solar|sohu|software|softbank|social|soccer|sncf|smile|smart|sling|skype|sky|' + 'skin|ski|site|singles|sina|silk|shriram|showtime|show|shouji|shopping|shop|shoes|shiksha|shia|' + 'shell|shaw|sharp|shangrila|sfr|sexy|sex|sew|seven|ses|services|sener|select|seek|security|' + 'secure|seat|search|scot|scor|scjohnson|science|schwarz|schule|school|scholarships|schmidt|' + 'schaeffler|scb|sca|sbs|sbi|saxo|save|sas|sarl|sapo|sap|sanofi|sandvikcoromant|sandvik|samsung|' + 'samsclub|salon|sale|sakura|safety|safe|saarland|ryukyu|rwe|run|ruhr|rugby|rsvp|room|rogers|' + 'rodeo|rocks|rocher|rmit|rip|rio|ril|rightathome|ricoh|richardli|rich|rexroth|reviews|review|' + 'restaurant|rest|republican|report|repair|rentals|rent|ren|reliance|reit|reisen|reise|rehab|' + 'redumbrella|redstone|red|recipes|realty|realtor|realestate|read|raid|radio|racing|qvc|quest|' + 'quebec|qpon|pwc|pub|prudential|pru|protection|property|properties|promo|progressive|prof|' + 'productions|prod|pro|prime|press|praxi|pramerica|post|porn|politie|poker|pohl|pnc|plus|' + 'plumbing|playstation|play|place|pizza|pioneer|pink|ping|pin|pid|pictures|pictet|pics|piaget|' + 'physio|photos|photography|photo|phone|philips|phd|pharmacy|pfizer|pet|pccw|pay|passagens|' + 'party|parts|partners|pars|paris|panerai|panasonic|pamperedchef|page|ovh|ott|otsuka|osaka|' + 'origins|orientexpress|organic|org|orange|oracle|open|ooo|onyourside|online|onl|ong|one|omega|' + 'ollo|oldnavy|olayangroup|olayan|okinawa|office|off|observer|obi|nyc|ntt|nrw|nra|nowtv|nowruz|' + 'now|norton|northwesternmutual|nokia|nissay|nissan|ninja|nikon|nike|nico|nhk|ngo|nfl|nexus|' + 'nextdirect|next|news|newholland|new|neustar|network|netflix|netbank|net|nec|nba|navy|natura|' + 'nationwide|name|nagoya|nadex|nab|mutuelle|mutual|museum|mtr|mtpc|mtn|msd|movistar|movie|mov|' + 'motorcycles|moto|moscow|mortgage|mormon|mopar|montblanc|monster|money|monash|mom|moi|moe|moda|' + 'mobily|mobile|mobi|mma|mls|mlb|mitsubishi|mit|mint|mini|mil|microsoft|miami|metlife|merckmsd|' + 'meo|menu|men|memorial|meme|melbourne|meet|media|med|mckinsey|mcdonalds|mcd|mba|mattel|' + 'maserati|marshalls|marriott|markets|marketing|market|map|mango|management|man|makeup|maison|' + 'maif|madrid|macys|luxury|luxe|lupin|lundbeck|ltda|ltd|lplfinancial|lpl|love|lotto|lotte|' + 'london|lol|loft|locus|locker|loans|loan|llc|lixil|living|live|lipsy|link|linde|lincoln|limo|' + 'limited|lilly|like|lighting|lifestyle|lifeinsurance|life|lidl|liaison|lgbt|lexus|lego|legal|' + 'lefrak|leclerc|lease|lds|lawyer|law|latrobe|latino|lat|lasalle|lanxess|landrover|land|lancome|' + 'lancia|lancaster|lamer|lamborghini|ladbrokes|lacaixa|kyoto|kuokgroup|kred|krd|kpn|kpmg|kosher|' + 'komatsu|koeln|kiwi|kitchen|kindle|kinder|kim|kia|kfh|kerryproperties|kerrylogistics|' + 'kerryhotels|kddi|kaufen|juniper|juegos|jprs|jpmorgan|joy|jot|joburg|jobs|jnj|jmp|jll|jlc|jio|' + 'jewelry|jetzt|jeep|jcp|jcb|java|jaguar|iwc|iveco|itv|itau|istanbul|ist|ismaili|iselect|irish|' + 'ipiranga|investments|intuit|international|intel|int|insure|insurance|institute|ink|ing|info|' + 'infiniti|industries|inc|immobilien|immo|imdb|imamat|ikano|iinet|ifm|ieee|icu|ice|icbc|ibm|' + 'hyundai|hyatt|hughes|htc|hsbc|how|house|hotmail|hotels|hoteles|hot|hosting|host|hospital|' + 'horse|honeywell|honda|homesense|homes|homegoods|homedepot|holiday|holdings|hockey|hkt|hiv|' + 'hitachi|hisamitsu|hiphop|hgtv|hermes|here|helsinki|help|healthcare|health|hdfcbank|hdfc|hbo|' + 'haus|hangout|hamburg|hair|guru|guitars|guide|guge|gucci|guardian|group|grocery|gripe|green|' + 'gratis|graphics|grainger|gov|got|gop|google|goog|goodyear|goodhands|goo|golf|goldpoint|gold|' + 'godaddy|gmx|gmo|gmbh|gmail|globo|global|gle|glass|glade|giving|gives|gifts|gift|ggee|george|' + 'genting|gent|gea|gdn|gbiz|garden|gap|games|game|gallup|gallo|gallery|gal|fyi|futbol|furniture|' + 'fund|fun|fujixerox|fujitsu|ftr|frontier|frontdoor|frogans|frl|fresenius|free|fox|foundation|' + 'forum|forsale|forex|ford|football|foodnetwork|food|foo|fly|flsmidth|flowers|florist|flir|' + 'flights|flickr|fitness|fit|fishing|fish|firmdale|firestone|fire|financial|finance|final|film|' + 'fido|fidelity|fiat|ferrero|ferrari|feedback|fedex|fast|fashion|farmers|farm|fans|fan|family|' + 'faith|fairwinds|fail|fage|extraspace|express|exposed|expert|exchange|everbank|events|eus|' + 'eurovision|etisalat|esurance|estate|esq|erni|ericsson|equipment|epson|epost|enterprises|' + 'engineering|engineer|energy|emerck|email|education|edu|edeka|eco|eat|earth|dvr|dvag|durban|' + 'dupont|duns|dunlop|duck|dubai|dtv|drive|download|dot|doosan|domains|doha|dog|dodge|doctor|' + 'docs|dnp|diy|dish|discover|discount|directory|direct|digital|diet|diamonds|dhl|dev|design|' + 'desi|dentist|dental|democrat|delta|deloitte|dell|delivery|degree|deals|dealer|deal|dds|dclk|' + 'day|datsun|dating|date|data|dance|dad|dabur|cyou|cymru|cuisinella|csc|cruises|cruise|crs|' + 'crown|cricket|creditunion|creditcard|credit|courses|coupons|coupon|country|corsica|coop|cool|' + 'cookingchannel|cooking|contractors|contact|consulting|construction|condos|comsec|computer|' + 'compare|company|community|commbank|comcast|com|cologne|college|coffee|codes|coach|clubmed|' + 'club|cloud|clothing|clinique|clinic|click|cleaning|claims|cityeats|city|citic|citi|citadel|' + 'cisco|circle|cipriani|church|chrysler|chrome|christmas|chloe|chintai|cheap|chat|chase|charity|' + 'channel|chanel|cfd|cfa|cern|ceo|center|ceb|cbs|cbre|cbn|cba|catholic|catering|cat|casino|cash|' + 'caseih|case|casa|cartier|cars|careers|career|care|cards|caravan|car|capitalone|capital|' + 'capetown|canon|cancerresearch|camp|camera|cam|calvinklein|call|cal|cafe|cab|bzh|buzz|buy|' + 'business|builders|build|bugatti|budapest|brussels|brother|broker|broadway|bridgestone|' + 'bradesco|box|boutique|bot|boston|bostik|bosch|boots|booking|book|boo|bond|bom|bofa|boehringer|' + 'boats|bnpparibas|bnl|bmw|bms|blue|bloomberg|blog|blockbuster|blanco|blackfriday|black|biz|bio|' + 'bingo|bing|bike|bid|bible|bharti|bet|bestbuy|best|berlin|bentley|beer|beauty|beats|bcn|bcg|' + 'bbva|bbt|bbc|bayern|bauhaus|basketball|baseball|bargains|barefoot|barclays|barclaycard|' + 'barcelona|bar|bank|band|bananarepublic|banamex|baidu|baby|azure|axa|aws|avianca|autos|auto|' + 'author|auspost|audio|audible|audi|auction|attorney|athleta|associates|asia|asda|arte|art|arpa|' + 'army|archi|aramco|arab|aquarelle|apple|app|apartments|aol|anz|anquan|android|analytics|' + 'amsterdam|amica|amfam|amex|americanfamily|americanexpress|alstom|alsace|ally|allstate|' + 'allfinanz|alipay|alibaba|alfaromeo|akdn|airtel|airforce|airbus|aigo|aig|agency|agakhan|africa|' + 'afl|afamilycompany|aetna|aero|aeg|adult|ads|adac|actor|active|aco|accountants|accountant|' + 'accenture|academy|abudhabi|abogado|able|abc|abbvie|abbott|abb|abarth|aarp|aaa|onion' + ')(?=[^0-9a-zA-Z@+-]|$))'));

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var validPunycode = /(?:xn--[\-0-9a-z]+)/;

  // Copyright 2018 Twitter, Inc.
  var validSubdomain = regexSupplant(/(?:(?:#{validDomainChars}(?:[_-]|#{validDomainChars})*)?#{validDomainChars}\.)/, {
    validDomainChars: validDomainChars
  });

  // Copyright 2018 Twitter, Inc.
  var validDomain = regexSupplant(/(?:#{validSubdomain}*#{validDomainName}(?:#{validGTLD}|#{validCCTLD}|#{validPunycode}))/, {
    validDomainName: validDomainName,
    validSubdomain: validSubdomain,
    validGTLD: validGTLD,
    validCCTLD: validCCTLD,
    validPunycode: validPunycode
  });

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var validPortNumber = /[0-9]+/;

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var cyrillicLettersAndMarks = /\u0400-\u04FF/;

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var latinAccentChars = /\xC0-\xD6\xD8-\xF6\xF8-\xFF\u0100-\u024F\u0253\u0254\u0256\u0257\u0259\u025B\u0263\u0268\u026F\u0272\u0289\u028B\u02BB\u0300-\u036F\u1E00-\u1EFF/;

  // Copyright 2018 Twitter, Inc.
  var validGeneralUrlPathChars = regexSupplant(/[a-z#{cyrillicLettersAndMarks}0-9!\*';:=\+,\.\$\/%#\[\]\-\u2013_~@\|&#{latinAccentChars}]/i, {
    cyrillicLettersAndMarks: cyrillicLettersAndMarks,
    latinAccentChars: latinAccentChars
  });

  // Copyright 2018 Twitter, Inc.
  //  1. Used in Wikipedia URLs like /Primer_(film)
  //  2. Used in IIS sessions like /S(dfd346)/
  //  3. Used in Rdio URLs like /track/We_Up_(Album_Version_(Edited))/

  var validUrlBalancedParens = regexSupplant('\\(' + '(?:' + '#{validGeneralUrlPathChars}+' + '|' + // allow one nested level of balanced parentheses
  '(?:' + '#{validGeneralUrlPathChars}*' + '\\(' + '#{validGeneralUrlPathChars}+' + '\\)' + '#{validGeneralUrlPathChars}*' + ')' + ')' + '\\)', {
    validGeneralUrlPathChars: validGeneralUrlPathChars
  }, 'i');

  // Copyright 2018 Twitter, Inc.
  // 1. Allow =&# for empty URL parameters and other URL-join artifacts

  var validUrlPathEndingChars = regexSupplant(/[\+\-a-z#{cyrillicLettersAndMarks}0-9=_#\/#{latinAccentChars}]|(?:#{validUrlBalancedParens})/i, {
    cyrillicLettersAndMarks: cyrillicLettersAndMarks,
    latinAccentChars: latinAccentChars,
    validUrlBalancedParens: validUrlBalancedParens
  });

  // Copyright 2018 Twitter, Inc.

  var validUrlPath = regexSupplant('(?:' + '(?:' + '#{validGeneralUrlPathChars}*' + '(?:#{validUrlBalancedParens}#{validGeneralUrlPathChars}*)*' + '#{validUrlPathEndingChars}' + ')|(?:@#{validGeneralUrlPathChars}+/)' + ')', {
    validGeneralUrlPathChars: validGeneralUrlPathChars,
    validUrlBalancedParens: validUrlBalancedParens,
    validUrlPathEndingChars: validUrlPathEndingChars
  }, 'i');

  // Copyright 2018 Twitter, Inc.
  var validUrlPrecedingChars = regexSupplant(/(?:[^A-Za-z0-9@＠$#＃#{invalidCharsGroup}]|[#{directionalMarkersGroup}]|^)/, {
    invalidCharsGroup: invalidCharsGroup,
    directionalMarkersGroup: directionalMarkersGroup
  });

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var validUrlQueryChars = /[a-z0-9!?\*'@\(\);:&=\+\$\/%#\[\]\-_\.,~|]/i;

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var validUrlQueryEndingChars = /[a-z0-9\-_&=#\/]/i;

  // Copyright 2018 Twitter, Inc.
  var extractUrl = regexSupplant('(' + // $1 total match
  '(#{validUrlPrecedingChars})' + // $2 Preceeding chracter
  '(' + // $3 URL
  '(https?:\\/\\/)?' + // $4 Protocol (optional)
  '(#{validDomain})' + // $5 Domain(s)
  '(?::(#{validPortNumber}))?' + // $6 Port number (optional)
  '(\\/#{validUrlPath}*)?' + // $7 URL Path
  '(\\?#{validUrlQueryChars}*#{validUrlQueryEndingChars})?' + // $8 Query String
  ')' + ')', {
    validUrlPrecedingChars: validUrlPrecedingChars,
    validDomain: validDomain,
    validPortNumber: validPortNumber,
    validUrlPath: validUrlPath,
    validUrlQueryChars: validUrlQueryChars,
    validUrlQueryEndingChars: validUrlQueryEndingChars
  }, 'gi');

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var invalidUrlWithoutProtocolPrecedingChars = /[-_.\/]$/;

  // 7.3.20 SpeciesConstructor(O, defaultConstructor)


  var SPECIES$2 = require$$0$3('species');
  var _speciesConstructor = function (O, D) {
    var C = anObject(O).constructor;
    var S;
    return C === undefined || (S = anObject(C)[SPECIES$2]) == undefined ? D : aFunction(S);
  };

  var _speciesConstructor$1 = /*#__PURE__*/Object.freeze({
    default: _speciesConstructor,
    __moduleExports: _speciesConstructor
  });

  var speciesConstructor = ( _speciesConstructor$1 && _speciesConstructor ) || _speciesConstructor$1;

  var $min = Math.min;
  var $push = [].push;
  var $SPLIT = 'split';
  var LENGTH = 'length';
  var LAST_INDEX$1 = 'lastIndex';
  var MAX_UINT32 = 0xffffffff;

  // babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
  var SUPPORTS_Y = !require$$1$1(function () { });

  // @@split logic
  require$$0$7('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
    var internalSplit;
    if (
      'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
      'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
      'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
      '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
      '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
      ''[$SPLIT](/.?/)[LENGTH]
    ) {
      // based on es5-shim implementation, need to rework it
      internalSplit = function (separator, limit) {
        var string = String(this);
        if (separator === undefined && limit === 0) return [];
        // If `separator` is not a regex, use native split
        if (!isRegExp(separator)) return $split.call(string, separator, limit);
        var output = [];
        var flags = (separator.ignoreCase ? 'i' : '') +
                    (separator.multiline ? 'm' : '') +
                    (separator.unicode ? 'u' : '') +
                    (separator.sticky ? 'y' : '');
        var lastLastIndex = 0;
        var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0;
        // Make `global` and avoid `lastIndex` issues by working with a copy
        var separatorCopy = new RegExp(separator.source, flags + 'g');
        var match, lastIndex, lastLength;
        while (match = regexpExec.call(separatorCopy, string)) {
          lastIndex = separatorCopy[LAST_INDEX$1];
          if (lastIndex > lastLastIndex) {
            output.push(string.slice(lastLastIndex, match.index));
            if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
            lastLength = match[0][LENGTH];
            lastLastIndex = lastIndex;
            if (output[LENGTH] >= splitLimit) break;
          }
          if (separatorCopy[LAST_INDEX$1] === match.index) separatorCopy[LAST_INDEX$1]++; // Avoid an infinite loop
        }
        if (lastLastIndex === string[LENGTH]) {
          if (lastLength || !separatorCopy.test('')) output.push('');
        } else output.push(string.slice(lastLastIndex));
        return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
      };
    // Chakra, V8
    } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
      internalSplit = function (separator, limit) {
        return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
      };
    } else {
      internalSplit = $split;
    }

    return [
      // `String.prototype.split` method
      // https://tc39.github.io/ecma262/#sec-string.prototype.split
      function split(separator, limit) {
        var O = defined(this);
        var splitter = separator == undefined ? undefined : separator[SPLIT];
        return splitter !== undefined
          ? splitter.call(separator, O, limit)
          : internalSplit.call(String(O), separator, limit);
      },
      // `RegExp.prototype[@@split]` method
      // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
      //
      // NOTE: This cannot be properly polyfilled in engines that don't support
      // the 'y' flag.
      function (regexp, limit) {
        var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
        if (res.done) return res.value;

        var rx = anObject(regexp);
        var S = String(this);
        var C = speciesConstructor(rx, RegExp);

        var unicodeMatching = rx.unicode;
        var flags = (rx.ignoreCase ? 'i' : '') +
                    (rx.multiline ? 'm' : '') +
                    (rx.unicode ? 'u' : '') +
                    (SUPPORTS_Y ? 'y' : 'g');

        // ^(? + rx + ) is needed, in combination with some S slicing, to
        // simulate the 'y' flag.
        var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
        var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
        if (lim === 0) return [];
        if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
        var p = 0;
        var q = 0;
        var A = [];
        while (q < S.length) {
          splitter.lastIndex = SUPPORTS_Y ? q : 0;
          var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
          var e;
          if (
            z === null ||
            (e = $min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
          ) {
            q = advanceStringIndex(S, q, unicodeMatching);
          } else {
            A.push(S.slice(p, q));
            if (A.length === lim) return A;
            for (var i = 1; i <= z.length - 1; i++) {
              A.push(z[i]);
              if (A.length === lim) return A;
            }
            q = p = e;
          }
        }
        A.push(S.slice(p));
        return A;
      }
    ];
  });

  var punycode = createCommonjsModule(function (module, exports) {
  (function(root) {

  	/** Detect free variables */
  	var freeExports = exports &&
  		!exports.nodeType && exports;
  	var freeModule = module &&
  		!module.nodeType && module;
  	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal;
  	if (
  		freeGlobal.global === freeGlobal ||
  		freeGlobal.window === freeGlobal ||
  		freeGlobal.self === freeGlobal
  	) {
  		root = freeGlobal;
  	}

  	/**
  	 * The `punycode` object.
  	 * @name punycode
  	 * @type Object
  	 */
  	var punycode,

  	/** Highest positive signed 32-bit float value */
  	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

  	/** Bootstring parameters */
  	base = 36,
  	tMin = 1,
  	tMax = 26,
  	skew = 38,
  	damp = 700,
  	initialBias = 72,
  	initialN = 128, // 0x80
  	delimiter = '-', // '\x2D'

  	/** Regular expressions */
  	regexPunycode = /^xn--/,
  	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
  	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

  	/** Error messages */
  	errors = {
  		'overflow': 'Overflow: input needs wider integers to process',
  		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
  		'invalid-input': 'Invalid input'
  	},

  	/** Convenience shortcuts */
  	baseMinusTMin = base - tMin,
  	floor = Math.floor,
  	stringFromCharCode = String.fromCharCode,

  	/** Temporary variable */
  	key;

  	/*--------------------------------------------------------------------------*/

  	/**
  	 * A generic error utility function.
  	 * @private
  	 * @param {String} type The error type.
  	 * @returns {Error} Throws a `RangeError` with the applicable error message.
  	 */
  	function error(type) {
  		throw new RangeError(errors[type]);
  	}

  	/**
  	 * A generic `Array#map` utility function.
  	 * @private
  	 * @param {Array} array The array to iterate over.
  	 * @param {Function} callback The function that gets called for every array
  	 * item.
  	 * @returns {Array} A new array of values returned by the callback function.
  	 */
  	function map(array, fn) {
  		var length = array.length;
  		var result = [];
  		while (length--) {
  			result[length] = fn(array[length]);
  		}
  		return result;
  	}

  	/**
  	 * A simple `Array#map`-like wrapper to work with domain name strings or email
  	 * addresses.
  	 * @private
  	 * @param {String} domain The domain name or email address.
  	 * @param {Function} callback The function that gets called for every
  	 * character.
  	 * @returns {Array} A new string of characters returned by the callback
  	 * function.
  	 */
  	function mapDomain(string, fn) {
  		var parts = string.split('@');
  		var result = '';
  		if (parts.length > 1) {
  			// In email addresses, only the domain name should be punycoded. Leave
  			// the local part (i.e. everything up to `@`) intact.
  			result = parts[0] + '@';
  			string = parts[1];
  		}
  		// Avoid `split(regex)` for IE8 compatibility. See #17.
  		string = string.replace(regexSeparators, '\x2E');
  		var labels = string.split('.');
  		var encoded = map(labels, fn).join('.');
  		return result + encoded;
  	}

  	/**
  	 * Creates an array containing the numeric code points of each Unicode
  	 * character in the string. While JavaScript uses UCS-2 internally,
  	 * this function will convert a pair of surrogate halves (each of which
  	 * UCS-2 exposes as separate characters) into a single code point,
  	 * matching UTF-16.
  	 * @see `punycode.ucs2.encode`
  	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
  	 * @memberOf punycode.ucs2
  	 * @name decode
  	 * @param {String} string The Unicode input string (UCS-2).
  	 * @returns {Array} The new array of code points.
  	 */
  	function ucs2decode(string) {
  		var output = [],
  		    counter = 0,
  		    length = string.length,
  		    value,
  		    extra;
  		while (counter < length) {
  			value = string.charCodeAt(counter++);
  			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
  				// high surrogate, and there is a next character
  				extra = string.charCodeAt(counter++);
  				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
  					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
  				} else {
  					// unmatched surrogate; only append this code unit, in case the next
  					// code unit is the high surrogate of a surrogate pair
  					output.push(value);
  					counter--;
  				}
  			} else {
  				output.push(value);
  			}
  		}
  		return output;
  	}

  	/**
  	 * Creates a string based on an array of numeric code points.
  	 * @see `punycode.ucs2.decode`
  	 * @memberOf punycode.ucs2
  	 * @name encode
  	 * @param {Array} codePoints The array of numeric code points.
  	 * @returns {String} The new Unicode string (UCS-2).
  	 */
  	function ucs2encode(array) {
  		return map(array, function(value) {
  			var output = '';
  			if (value > 0xFFFF) {
  				value -= 0x10000;
  				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
  				value = 0xDC00 | value & 0x3FF;
  			}
  			output += stringFromCharCode(value);
  			return output;
  		}).join('');
  	}

  	/**
  	 * Converts a basic code point into a digit/integer.
  	 * @see `digitToBasic()`
  	 * @private
  	 * @param {Number} codePoint The basic numeric code point value.
  	 * @returns {Number} The numeric value of a basic code point (for use in
  	 * representing integers) in the range `0` to `base - 1`, or `base` if
  	 * the code point does not represent a value.
  	 */
  	function basicToDigit(codePoint) {
  		if (codePoint - 48 < 10) {
  			return codePoint - 22;
  		}
  		if (codePoint - 65 < 26) {
  			return codePoint - 65;
  		}
  		if (codePoint - 97 < 26) {
  			return codePoint - 97;
  		}
  		return base;
  	}

  	/**
  	 * Converts a digit/integer into a basic code point.
  	 * @see `basicToDigit()`
  	 * @private
  	 * @param {Number} digit The numeric value of a basic code point.
  	 * @returns {Number} The basic code point whose value (when used for
  	 * representing integers) is `digit`, which needs to be in the range
  	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
  	 * used; else, the lowercase form is used. The behavior is undefined
  	 * if `flag` is non-zero and `digit` has no uppercase form.
  	 */
  	function digitToBasic(digit, flag) {
  		//  0..25 map to ASCII a..z or A..Z
  		// 26..35 map to ASCII 0..9
  		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
  	}

  	/**
  	 * Bias adaptation function as per section 3.4 of RFC 3492.
  	 * https://tools.ietf.org/html/rfc3492#section-3.4
  	 * @private
  	 */
  	function adapt(delta, numPoints, firstTime) {
  		var k = 0;
  		delta = firstTime ? floor(delta / damp) : delta >> 1;
  		delta += floor(delta / numPoints);
  		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
  			delta = floor(delta / baseMinusTMin);
  		}
  		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
  	}

  	/**
  	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
  	 * symbols.
  	 * @memberOf punycode
  	 * @param {String} input The Punycode string of ASCII-only symbols.
  	 * @returns {String} The resulting string of Unicode symbols.
  	 */
  	function decode(input) {
  		// Don't use UCS-2
  		var output = [],
  		    inputLength = input.length,
  		    out,
  		    i = 0,
  		    n = initialN,
  		    bias = initialBias,
  		    basic,
  		    j,
  		    index,
  		    oldi,
  		    w,
  		    k,
  		    digit,
  		    t,
  		    /** Cached calculation results */
  		    baseMinusT;

  		// Handle the basic code points: let `basic` be the number of input code
  		// points before the last delimiter, or `0` if there is none, then copy
  		// the first basic code points to the output.

  		basic = input.lastIndexOf(delimiter);
  		if (basic < 0) {
  			basic = 0;
  		}

  		for (j = 0; j < basic; ++j) {
  			// if it's not a basic code point
  			if (input.charCodeAt(j) >= 0x80) {
  				error('not-basic');
  			}
  			output.push(input.charCodeAt(j));
  		}

  		// Main decoding loop: start just after the last delimiter if any basic code
  		// points were copied; start at the beginning otherwise.

  		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

  			// `index` is the index of the next character to be consumed.
  			// Decode a generalized variable-length integer into `delta`,
  			// which gets added to `i`. The overflow checking is easier
  			// if we increase `i` as we go, then subtract off its starting
  			// value at the end to obtain `delta`.
  			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

  				if (index >= inputLength) {
  					error('invalid-input');
  				}

  				digit = basicToDigit(input.charCodeAt(index++));

  				if (digit >= base || digit > floor((maxInt - i) / w)) {
  					error('overflow');
  				}

  				i += digit * w;
  				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

  				if (digit < t) {
  					break;
  				}

  				baseMinusT = base - t;
  				if (w > floor(maxInt / baseMinusT)) {
  					error('overflow');
  				}

  				w *= baseMinusT;

  			}

  			out = output.length + 1;
  			bias = adapt(i - oldi, out, oldi == 0);

  			// `i` was supposed to wrap around from `out` to `0`,
  			// incrementing `n` each time, so we'll fix that now:
  			if (floor(i / out) > maxInt - n) {
  				error('overflow');
  			}

  			n += floor(i / out);
  			i %= out;

  			// Insert `n` at position `i` of the output
  			output.splice(i++, 0, n);

  		}

  		return ucs2encode(output);
  	}

  	/**
  	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
  	 * Punycode string of ASCII-only symbols.
  	 * @memberOf punycode
  	 * @param {String} input The string of Unicode symbols.
  	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
  	 */
  	function encode(input) {
  		var n,
  		    delta,
  		    handledCPCount,
  		    basicLength,
  		    bias,
  		    j,
  		    m,
  		    q,
  		    k,
  		    t,
  		    currentValue,
  		    output = [],
  		    /** `inputLength` will hold the number of code points in `input`. */
  		    inputLength,
  		    /** Cached calculation results */
  		    handledCPCountPlusOne,
  		    baseMinusT,
  		    qMinusT;

  		// Convert the input in UCS-2 to Unicode
  		input = ucs2decode(input);

  		// Cache the length
  		inputLength = input.length;

  		// Initialize the state
  		n = initialN;
  		delta = 0;
  		bias = initialBias;

  		// Handle the basic code points
  		for (j = 0; j < inputLength; ++j) {
  			currentValue = input[j];
  			if (currentValue < 0x80) {
  				output.push(stringFromCharCode(currentValue));
  			}
  		}

  		handledCPCount = basicLength = output.length;

  		// `handledCPCount` is the number of code points that have been handled;
  		// `basicLength` is the number of basic code points.

  		// Finish the basic string - if it is not empty - with a delimiter
  		if (basicLength) {
  			output.push(delimiter);
  		}

  		// Main encoding loop:
  		while (handledCPCount < inputLength) {

  			// All non-basic code points < n have been handled already. Find the next
  			// larger one:
  			for (m = maxInt, j = 0; j < inputLength; ++j) {
  				currentValue = input[j];
  				if (currentValue >= n && currentValue < m) {
  					m = currentValue;
  				}
  			}

  			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
  			// but guard against overflow
  			handledCPCountPlusOne = handledCPCount + 1;
  			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
  				error('overflow');
  			}

  			delta += (m - n) * handledCPCountPlusOne;
  			n = m;

  			for (j = 0; j < inputLength; ++j) {
  				currentValue = input[j];

  				if (currentValue < n && ++delta > maxInt) {
  					error('overflow');
  				}

  				if (currentValue == n) {
  					// Represent delta as a generalized variable-length integer
  					for (q = delta, k = base; /* no condition */; k += base) {
  						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
  						if (q < t) {
  							break;
  						}
  						qMinusT = q - t;
  						baseMinusT = base - t;
  						output.push(
  							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
  						);
  						q = floor(qMinusT / baseMinusT);
  					}

  					output.push(stringFromCharCode(digitToBasic(q, 0)));
  					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
  					delta = 0;
  					++handledCPCount;
  				}
  			}

  			++delta;
  			++n;

  		}
  		return output.join('');
  	}

  	/**
  	 * Converts a Punycode string representing a domain name or an email address
  	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
  	 * it doesn't matter if you call it on a string that has already been
  	 * converted to Unicode.
  	 * @memberOf punycode
  	 * @param {String} input The Punycoded domain name or email address to
  	 * convert to Unicode.
  	 * @returns {String} The Unicode representation of the given Punycode
  	 * string.
  	 */
  	function toUnicode(input) {
  		return mapDomain(input, function(string) {
  			return regexPunycode.test(string)
  				? decode(string.slice(4).toLowerCase())
  				: string;
  		});
  	}

  	/**
  	 * Converts a Unicode string representing a domain name or an email address to
  	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
  	 * i.e. it doesn't matter if you call it with a domain that's already in
  	 * ASCII.
  	 * @memberOf punycode
  	 * @param {String} input The domain name or email address to convert, as a
  	 * Unicode string.
  	 * @returns {String} The Punycode representation of the given domain name or
  	 * email address.
  	 */
  	function toASCII(input) {
  		return mapDomain(input, function(string) {
  			return regexNonASCII.test(string)
  				? 'xn--' + encode(string)
  				: string;
  		});
  	}

  	/*--------------------------------------------------------------------------*/

  	/** Define the public API */
  	punycode = {
  		/**
  		 * A string representing the current Punycode.js version number.
  		 * @memberOf punycode
  		 * @type String
  		 */
  		'version': '1.4.1',
  		/**
  		 * An object of methods to convert from JavaScript's internal character
  		 * representation (UCS-2) to Unicode code points, and back.
  		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
  		 * @memberOf punycode
  		 * @type Object
  		 */
  		'ucs2': {
  			'decode': ucs2decode,
  			'encode': ucs2encode
  		},
  		'decode': decode,
  		'encode': encode,
  		'toASCII': toASCII,
  		'toUnicode': toUnicode
  	};

  	/** Expose `punycode` */
  	// Some AMD build optimizers, like r.js, check for specific condition patterns
  	// like the following:
  	if (freeExports && freeModule) {
  		if (module.exports == freeExports) {
  			// in Node.js, io.js, or RingoJS v0.8.0+
  			freeModule.exports = punycode;
  		} else {
  			// in Narwhal or RingoJS v0.7.0-
  			for (key in punycode) {
  				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
  			}
  		}
  	} else {
  		// in Rhino or a web browser
  		root.punycode = punycode;
  	}

  }(commonjsGlobal));
  });

  // Copyright 2018 Twitter, Inc.
  var validAsciiDomain = regexSupplant(/(?:(?:[\-a-z0-9#{latinAccentChars}]+)\.)+(?:#{validGTLD}|#{validCCTLD}|#{validPunycode})/gi, {
    latinAccentChars: latinAccentChars,
    validGTLD: validGTLD,
    validCCTLD: validCCTLD,
    validPunycode: validPunycode
  });

  var MAX_DOMAIN_LABEL_LENGTH = 63;
  var PUNYCODE_ENCODED_DOMAIN_PREFIX = 'xn--'; // This is an extremely lightweight implementation of domain name validation according to RFC 3490
  // Our regexes handle most of the cases well enough
  // See https://tools.ietf.org/html/rfc3490#section-4.1 for details

  var idna = {
    toAscii: function toAscii(domain) {
      if (domain.substring(0, 4) === PUNYCODE_ENCODED_DOMAIN_PREFIX && !domain.match(validAsciiDomain)) {
        // Punycode encoded url cannot contain non ASCII characters
        return;
      }

      var labels = domain.split('.');

      for (var i = 0; i < labels.length; i++) {
        var label = labels[i];
        var punycodeEncodedLabel = punycode.toASCII(label);

        if (punycodeEncodedLabel.length < 1 || punycodeEncodedLabel.length > MAX_DOMAIN_LABEL_LENGTH) {
          // DNS label has invalid length
          return;
        }
      }

      return labels.join('.');
    }
  };

  // Copyright 2018 Twitter, Inc.
  var validTcoUrl = regexSupplant(/^https?:\/\/t\.co\/([a-z0-9]+)(?:\?#{validUrlQueryChars}*#{validUrlQueryEndingChars})?/, {
    validUrlQueryChars: validUrlQueryChars,
    validUrlQueryEndingChars: validUrlQueryEndingChars
  }, 'i');

  var DEFAULT_PROTOCOL = 'https://';
  var DEFAULT_PROTOCOL_OPTIONS = {
    extractUrlsWithoutProtocol: true
  };
  var MAX_URL_LENGTH = 4096;
  var MAX_TCO_SLUG_LENGTH = 40;

  var extractUrlsWithIndices = function extractUrlsWithIndices(text) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_PROTOCOL_OPTIONS;

    if (!text || (options.extractUrlsWithoutProtocol ? !text.match(/\./) : !text.match(/:/))) {
      return [];
    }

    var urls = [];

    var _loop = function _loop() {
      var before = RegExp.$2;
      var url = RegExp.$3;
      var protocol = RegExp.$4;
      var domain = RegExp.$5;
      var path = RegExp.$7;
      var endPosition = extractUrl.lastIndex;
      var startPosition = endPosition - url.length;

      if (!isValidUrl(url, protocol || DEFAULT_PROTOCOL, domain)) {
        return "continue";
      } // extract ASCII-only domains.


      if (!protocol) {
        if (!options.extractUrlsWithoutProtocol || before.match(invalidUrlWithoutProtocolPrecedingChars)) {
          return "continue";
        }

        var lastUrl = null;
        var asciiEndPosition = 0;
        domain.replace(validAsciiDomain, function (asciiDomain) {
          var asciiStartPosition = domain.indexOf(asciiDomain, asciiEndPosition);
          asciiEndPosition = asciiStartPosition + asciiDomain.length;
          lastUrl = {
            url: asciiDomain,
            indices: [startPosition + asciiStartPosition, startPosition + asciiEndPosition]
          };
          urls.push(lastUrl);
        }); // no ASCII-only domain found. Skip the entire URL.

        if (lastUrl == null) {
          return "continue";
        } // lastUrl only contains domain. Need to add path and query if they exist.


        if (path) {
          lastUrl.url = url.replace(domain, lastUrl.url);
          lastUrl.indices[1] = endPosition;
        }
      } else {
        // In the case of t.co URLs, don't allow additional path characters.
        if (url.match(validTcoUrl)) {
          var tcoUrlSlug = RegExp.$1;

          if (tcoUrlSlug && tcoUrlSlug.length > MAX_TCO_SLUG_LENGTH) {
            return "continue";
          } else {
            url = RegExp.lastMatch;
            endPosition = startPosition + url.length;
          }
        }

        urls.push({
          url: url,
          indices: [startPosition, endPosition]
        });
      }
    };

    while (extractUrl.exec(text)) {
      var _ret = _loop();

      if (_ret === "continue") continue;
    }

    return urls;
  };

  var isValidUrl = function isValidUrl(url, protocol, domain) {
    var urlLength = url.length;
    var punycodeEncodedDomain = idna.toAscii(domain);

    if (!punycodeEncodedDomain || !punycodeEncodedDomain.length) {
      return false;
    }

    urlLength = urlLength + punycodeEncodedDomain.length - domain.length;
    return protocol.length + urlLength <= MAX_URL_LENGTH;
  };

  var $sort = [].sort;
  var test = [1, 2, 3];

  $export$1($export$1.P + $export$1.F * (require$$1$1(function () {
    // IE8-
    test.sort(undefined);
  }) || !require$$1$1(function () {
    // V8 bug
    test.sort(null);
    // Old WebKit
  }) || !require$$0$9($sort)), 'Array', {
    // 22.1.3.25 Array.prototype.sort(comparefn)
    sort: function sort(comparefn) {
      return comparefn === undefined
        ? $sort.call(toObject(this))
        : $sort.call(toObject(this), aFunction(comparefn));
    }
  });

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  function removeOverlappingEntities (entities) {
    entities.sort(function (a, b) {
      return a.indices[0] - b.indices[0];
    });
    var prev = entities[0];

    for (var i = 1; i < entities.length; i++) {
      if (prev.indices[1] > entities[i].indices[0]) {
        entities.splice(i, 1);
        i--;
      } else {
        prev = entities[i];
      }
    }
  }

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  // Generated from unicode_regex/unicode_regex_groups.scala, same as objective c's \p{L}\p{M}
  var astralLetterAndMarks = /\ud800[\udc00-\udc0b\udc0d-\udc26\udc28-\udc3a\udc3c\udc3d\udc3f-\udc4d\udc50-\udc5d\udc80-\udcfa\uddfd\ude80-\ude9c\udea0-\uded0\udee0\udf00-\udf1f\udf30-\udf40\udf42-\udf49\udf50-\udf7a\udf80-\udf9d\udfa0-\udfc3\udfc8-\udfcf]|\ud801[\udc00-\udc9d\udd00-\udd27\udd30-\udd63\ude00-\udf36\udf40-\udf55\udf60-\udf67]|\ud802[\udc00-\udc05\udc08\udc0a-\udc35\udc37\udc38\udc3c\udc3f-\udc55\udc60-\udc76\udc80-\udc9e\udd00-\udd15\udd20-\udd39\udd80-\uddb7\uddbe\uddbf\ude00-\ude03\ude05\ude06\ude0c-\ude13\ude15-\ude17\ude19-\ude33\ude38-\ude3a\ude3f\ude60-\ude7c\ude80-\ude9c\udec0-\udec7\udec9-\udee6\udf00-\udf35\udf40-\udf55\udf60-\udf72\udf80-\udf91]|\ud803[\udc00-\udc48]|\ud804[\udc00-\udc46\udc7f-\udcba\udcd0-\udce8\udd00-\udd34\udd50-\udd73\udd76\udd80-\uddc4\uddda\ude00-\ude11\ude13-\ude37\udeb0-\udeea\udf01-\udf03\udf05-\udf0c\udf0f\udf10\udf13-\udf28\udf2a-\udf30\udf32\udf33\udf35-\udf39\udf3c-\udf44\udf47\udf48\udf4b-\udf4d\udf57\udf5d-\udf63\udf66-\udf6c\udf70-\udf74]|\ud805[\udc80-\udcc5\udcc7\udd80-\uddb5\uddb8-\uddc0\ude00-\ude40\ude44\ude80-\udeb7]|\ud806[\udca0-\udcdf\udcff\udec0-\udef8]|\ud808[\udc00-\udf98]|\ud80c[\udc00-\udfff]|\ud80d[\udc00-\udc2e]|\ud81a[\udc00-\ude38\ude40-\ude5e\uded0-\udeed\udef0-\udef4\udf00-\udf36\udf40-\udf43\udf63-\udf77\udf7d-\udf8f]|\ud81b[\udf00-\udf44\udf50-\udf7e\udf8f-\udf9f]|\ud82c[\udc00\udc01]|\ud82f[\udc00-\udc6a\udc70-\udc7c\udc80-\udc88\udc90-\udc99\udc9d\udc9e]|\ud834[\udd65-\udd69\udd6d-\udd72\udd7b-\udd82\udd85-\udd8b\uddaa-\uddad\ude42-\ude44]|\ud835[\udc00-\udc54\udc56-\udc9c\udc9e\udc9f\udca2\udca5\udca6\udca9-\udcac\udcae-\udcb9\udcbb\udcbd-\udcc3\udcc5-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd1e-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd52-\udea5\udea8-\udec0\udec2-\udeda\udedc-\udefa\udefc-\udf14\udf16-\udf34\udf36-\udf4e\udf50-\udf6e\udf70-\udf88\udf8a-\udfa8\udfaa-\udfc2\udfc4-\udfcb]|\ud83a[\udc00-\udcc4\udcd0-\udcd6]|\ud83b[\ude00-\ude03\ude05-\ude1f\ude21\ude22\ude24\ude27\ude29-\ude32\ude34-\ude37\ude39\ude3b\ude42\ude47\ude49\ude4b\ude4d-\ude4f\ude51\ude52\ude54\ude57\ude59\ude5b\ude5d\ude5f\ude61\ude62\ude64\ude67-\ude6a\ude6c-\ude72\ude74-\ude77\ude79-\ude7c\ude7e\ude80-\ude89\ude8b-\ude9b\udea1-\udea3\udea5-\udea9\udeab-\udebb]|\ud840[\udc00-\udfff]|\ud841[\udc00-\udfff]|\ud842[\udc00-\udfff]|\ud843[\udc00-\udfff]|\ud844[\udc00-\udfff]|\ud845[\udc00-\udfff]|\ud846[\udc00-\udfff]|\ud847[\udc00-\udfff]|\ud848[\udc00-\udfff]|\ud849[\udc00-\udfff]|\ud84a[\udc00-\udfff]|\ud84b[\udc00-\udfff]|\ud84c[\udc00-\udfff]|\ud84d[\udc00-\udfff]|\ud84e[\udc00-\udfff]|\ud84f[\udc00-\udfff]|\ud850[\udc00-\udfff]|\ud851[\udc00-\udfff]|\ud852[\udc00-\udfff]|\ud853[\udc00-\udfff]|\ud854[\udc00-\udfff]|\ud855[\udc00-\udfff]|\ud856[\udc00-\udfff]|\ud857[\udc00-\udfff]|\ud858[\udc00-\udfff]|\ud859[\udc00-\udfff]|\ud85a[\udc00-\udfff]|\ud85b[\udc00-\udfff]|\ud85c[\udc00-\udfff]|\ud85d[\udc00-\udfff]|\ud85e[\udc00-\udfff]|\ud85f[\udc00-\udfff]|\ud860[\udc00-\udfff]|\ud861[\udc00-\udfff]|\ud862[\udc00-\udfff]|\ud863[\udc00-\udfff]|\ud864[\udc00-\udfff]|\ud865[\udc00-\udfff]|\ud866[\udc00-\udfff]|\ud867[\udc00-\udfff]|\ud868[\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|\ud86a[\udc00-\udfff]|\ud86b[\udc00-\udfff]|\ud86c[\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]|\ud87e[\udc00-\ude1d]|\udb40[\udd00-\uddef]/;

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  // Generated from unicode_regex/unicode_regex_groups.scala, same as objective c's \p{L}\p{M}
  var bmpLetterAndMarks = /A-Za-z\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0300-\u0374\u0376\u0377\u037a-\u037d\u037f\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u0483-\u052f\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u05d0-\u05ea\u05f0-\u05f2\u0610-\u061a\u0620-\u065f\u066e-\u06d3\u06d5-\u06dc\u06df-\u06e8\u06ea-\u06ef\u06fa-\u06fc\u06ff\u0710-\u074a\u074d-\u07b1\u07ca-\u07f5\u07fa\u0800-\u082d\u0840-\u085b\u08a0-\u08b2\u08e4-\u0963\u0971-\u0983\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bc-\u09c4\u09c7\u09c8\u09cb-\u09ce\u09d7\u09dc\u09dd\u09df-\u09e3\u09f0\u09f1\u0a01-\u0a03\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a59-\u0a5c\u0a5e\u0a70-\u0a75\u0a81-\u0a83\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abc-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ad0\u0ae0-\u0ae3\u0b01-\u0b03\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3c-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5c\u0b5d\u0b5f-\u0b63\u0b71\u0b82\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd0\u0bd7\u0c00-\u0c03\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c39\u0c3d-\u0c44\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c58\u0c59\u0c60-\u0c63\u0c81-\u0c83\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbc-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0cde\u0ce0-\u0ce3\u0cf1\u0cf2\u0d01-\u0d03\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d-\u0d44\u0d46-\u0d48\u0d4a-\u0d4e\u0d57\u0d60-\u0d63\u0d7a-\u0d7f\u0d82\u0d83\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e01-\u0e3a\u0e40-\u0e4e\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb9\u0ebb-\u0ebd\u0ec0-\u0ec4\u0ec6\u0ec8-\u0ecd\u0edc-\u0edf\u0f00\u0f18\u0f19\u0f35\u0f37\u0f39\u0f3e-\u0f47\u0f49-\u0f6c\u0f71-\u0f84\u0f86-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u103f\u1050-\u108f\u109a-\u109d\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u135d-\u135f\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16f1-\u16f8\u1700-\u170c\u170e-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176c\u176e-\u1770\u1772\u1773\u1780-\u17d3\u17d7\u17dc\u17dd\u180b-\u180d\u1820-\u1877\u1880-\u18aa\u18b0-\u18f5\u1900-\u191e\u1920-\u192b\u1930-\u193b\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19b0-\u19c9\u1a00-\u1a1b\u1a20-\u1a5e\u1a60-\u1a7c\u1a7f\u1aa7\u1ab0-\u1abe\u1b00-\u1b4b\u1b6b-\u1b73\u1b80-\u1baf\u1bba-\u1bf3\u1c00-\u1c37\u1c4d-\u1c4f\u1c5a-\u1c7d\u1cd0-\u1cd2\u1cd4-\u1cf6\u1cf8\u1cf9\u1d00-\u1df5\u1dfc-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u20d0-\u20f0\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2183\u2184\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d7f-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2de0-\u2dff\u2e2f\u3005\u3006\u302a-\u302f\u3031-\u3035\u303b\u303c\u3041-\u3096\u3099\u309a\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua672\ua674-\ua67d\ua67f-\ua69d\ua69f-\ua6e5\ua6f0\ua6f1\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua7ad\ua7b0\ua7b1\ua7f7-\ua827\ua840-\ua873\ua880-\ua8c4\ua8e0-\ua8f7\ua8fb\ua90a-\ua92d\ua930-\ua953\ua960-\ua97c\ua980-\ua9c0\ua9cf\ua9e0-\ua9ef\ua9fa-\ua9fe\uaa00-\uaa36\uaa40-\uaa4d\uaa60-\uaa76\uaa7a-\uaac2\uaadb-\uaadd\uaae0-\uaaef\uaaf2-\uaaf6\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uab30-\uab5a\uab5c-\uab5f\uab64\uab65\uabc0-\uabea\uabec\uabed\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf870-\uf87f\uf882\uf884-\uf89f\uf8b8\uf8c1-\uf8d6\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe00-\ufe0f\ufe20-\ufe2d\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc/;

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var nonBmpCodePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/gm;

  // Copyright 2018 Twitter, Inc.

  var hashtagAlpha = regexSupplant(/(?:[#{bmpLetterAndMarks}]|(?=#{nonBmpCodePairs})(?:#{astralLetterAndMarks}))/, {
    bmpLetterAndMarks: bmpLetterAndMarks,
    nonBmpCodePairs: nonBmpCodePairs,
    astralLetterAndMarks: astralLetterAndMarks
  });

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var astralNumerals = /\ud801[\udca0-\udca9]|\ud804[\udc66-\udc6f\udcf0-\udcf9\udd36-\udd3f\uddd0-\uddd9\udef0-\udef9]|\ud805[\udcd0-\udcd9\ude50-\ude59\udec0-\udec9]|\ud806[\udce0-\udce9]|\ud81a[\ude60-\ude69\udf50-\udf59]|\ud835[\udfce-\udfff]/;

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var bmpNumerals = /0-9\u0660-\u0669\u06f0-\u06f9\u07c0-\u07c9\u0966-\u096f\u09e6-\u09ef\u0a66-\u0a6f\u0ae6-\u0aef\u0b66-\u0b6f\u0be6-\u0bef\u0c66-\u0c6f\u0ce6-\u0cef\u0d66-\u0d6f\u0de6-\u0def\u0e50-\u0e59\u0ed0-\u0ed9\u0f20-\u0f29\u1040-\u1049\u1090-\u1099\u17e0-\u17e9\u1810-\u1819\u1946-\u194f\u19d0-\u19d9\u1a80-\u1a89\u1a90-\u1a99\u1b50-\u1b59\u1bb0-\u1bb9\u1c40-\u1c49\u1c50-\u1c59\ua620-\ua629\ua8d0-\ua8d9\ua900-\ua909\ua9d0-\ua9d9\ua9f0-\ua9f9\uaa50-\uaa59\uabf0-\uabf9\uff10-\uff19/;

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var hashtagSpecialChars = /_\u200c\u200d\ua67e\u05be\u05f3\u05f4\uff5e\u301c\u309b\u309c\u30a0\u30fb\u3003\u0f0b\u0f0c\xb7/;

  // Copyright 2018 Twitter, Inc.
  var hashtagAlphaNumeric = regexSupplant(/(?:[#{bmpLetterAndMarks}#{bmpNumerals}#{hashtagSpecialChars}]|(?=#{nonBmpCodePairs})(?:#{astralLetterAndMarks}|#{astralNumerals}))/, {
    bmpLetterAndMarks: bmpLetterAndMarks,
    bmpNumerals: bmpNumerals,
    hashtagSpecialChars: hashtagSpecialChars,
    nonBmpCodePairs: nonBmpCodePairs,
    astralLetterAndMarks: astralLetterAndMarks,
    astralNumerals: astralNumerals
  });

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var codePoint = /(?:[^\uD800-\uDFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF])/;

  // Copyright 2018 Twitter, Inc.
  var hashtagBoundary = regexSupplant(/(?:^|\uFE0E|\uFE0F|$|(?!#{hashtagAlphaNumeric}|&)#{codePoint})/, {
    codePoint: codePoint,
    hashtagAlphaNumeric: hashtagAlphaNumeric
  });

  // Copyright 2018 Twitter, Inc.
  var validHashtag = regexSupplant(/(#{hashtagBoundary})(#{hashSigns})(?!\uFE0F|\u20E3)(#{hashtagAlphaNumeric}*#{hashtagAlpha}#{hashtagAlphaNumeric}*)/gi, {
    hashtagBoundary: hashtagBoundary,
    hashSigns: hashSigns,
    hashtagAlphaNumeric: hashtagAlphaNumeric,
    hashtagAlpha: hashtagAlpha
  });

  var extractHashtagsWithIndices = function extractHashtagsWithIndices(text, options) {
    if (!options) {
      options = {
        checkUrlOverlap: true
      };
    }

    if (!text || !text.match(hashSigns)) {
      return [];
    }

    var tags = [];
    text.replace(validHashtag, function (match, before, hash, hashText, offset, chunk) {
      var after = chunk.slice(offset + match.length);

      if (after.match(endHashtagMatch)) {
        return;
      }

      var startPosition = offset + before.length;
      var endPosition = startPosition + hashText.length + 1;
      tags.push({
        hashtag: hashText,
        indices: [startPosition, endPosition]
      });
    });

    if (options.checkUrlOverlap) {
      // also extract URL entities
      var urls = extractUrlsWithIndices(text);

      if (urls.length > 0) {
        var entities = tags.concat(urls); // remove overlap

        removeOverlappingEntities(entities); // only push back hashtags

        tags = [];

        for (var i = 0; i < entities.length; i++) {
          if (entities[i].hashtag) {
            tags.push(entities[i]);
          }
        }
      }
    }

    return tags;
  };

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var atSigns = /[@＠]/;

  // Copyright 2018 Twitter, Inc.
  var endMentionMatch = regexSupplant(/^(?:#{atSigns}|[#{latinAccentChars}]|:\/\/)/, {
    atSigns: atSigns,
    latinAccentChars: latinAccentChars
  });

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var validMentionPrecedingChars = /(?:^|[^a-zA-Z0-9_!#$%&*@＠]|(?:^|[^a-zA-Z0-9_+~.-])(?:rt|RT|rT|Rt):?)/;

  // Copyright 2018 Twitter, Inc.
  var validMentionOrList = regexSupplant('(#{validMentionPrecedingChars})' + // $1: Preceding character
  '(#{atSigns})' + // $2: At mark
  '([a-zA-Z0-9_]{1,20})' + // $3: Screen name
  '(/[a-zA-Z][a-zA-Z0-9_-]{0,24})?', // $4: List (optional)
  {
    validMentionPrecedingChars: validMentionPrecedingChars,
    atSigns: atSigns
  }, 'g');

  function extractMentionsOrListsWithIndices (text) {
    if (!text || !text.match(atSigns)) {
      return [];
    }

    var possibleNames = [];
    text.replace(validMentionOrList, function (match, before, atSign, screenName, slashListname, offset, chunk) {
      var after = chunk.slice(offset + match.length);

      if (!after.match(endMentionMatch)) {
        slashListname = slashListname || '';
        var startPosition = offset + before.length;
        var endPosition = startPosition + screenName.length + slashListname.length + 1;
        possibleNames.push({
          screenName: screenName,
          listSlug: slashListname,
          indices: [startPosition, endPosition]
        });
      }
    });
    return possibleNames;
  }

  // Copyright 2018 Twitter, Inc.
  function extractEntitiesWithIndices (text, options) {
    var entities = extractUrlsWithIndices(text, options).concat(extractMentionsOrListsWithIndices(text)).concat(extractHashtagsWithIndices(text, {
      checkUrlOverlap: false
    })).concat(extractCashtagsWithIndices(text));

    if (entities.length == 0) {
      return [];
    }

    removeOverlappingEntities(entities);
    return entities;
  }

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  function clone (o) {
    var r = {};

    for (var k in o) {
      if (o.hasOwnProperty(k)) {
        r[k] = o[k];
      }
    }

    return r;
  }

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var BOOLEAN_ATTRIBUTES = {
    disabled: true,
    readonly: true,
    multiple: true,
    checked: true
  }; // Options which should not be passed as HTML attributes

  var OPTIONS_NOT_ATTRIBUTES = {
    urlClass: true,
    listClass: true,
    usernameClass: true,
    hashtagClass: true,
    cashtagClass: true,
    usernameUrlBase: true,
    listUrlBase: true,
    hashtagUrlBase: true,
    cashtagUrlBase: true,
    usernameUrlBlock: true,
    listUrlBlock: true,
    hashtagUrlBlock: true,
    linkUrlBlock: true,
    usernameIncludeSymbol: true,
    suppressLists: true,
    suppressNoFollow: true,
    targetBlank: true,
    suppressDataScreenName: true,
    urlEntities: true,
    symbolTag: true,
    textWithSymbolTag: true,
    urlTarget: true,
    invisibleTagAttrs: true,
    linkAttributeBlock: true,
    linkTextBlock: true,
    htmlEscapeNonEntities: true
  };
  function extractHtmlAttrsFromOptions (options) {
    var htmlAttrs = {};

    for (var k in options) {
      var v = options[k];

      if (OPTIONS_NOT_ATTRIBUTES[k]) {
        continue;
      }

      if (BOOLEAN_ATTRIBUTES[k]) {
        v = v ? k : null;
      }

      if (v == null) {
        continue;
      }

      htmlAttrs[k] = v;
    }

    return htmlAttrs;
  }

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var HTML_ENTITIES = {
    '&': '&amp;',
    '>': '&gt;',
    '<': '&lt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  function htmlEscape (text) {
    return text && text.replace(/[&"'><]/g, function (character) {
      return HTML_ENTITIES[character];
    });
  }

  // 21.2.5.3 get RegExp.prototype.flags()
  if (require$$0$4 && /./g.flags != 'g') require$$1$2.f(RegExp.prototype, 'flags', {
    configurable: true,
    get: regexpFlags
  });

  var TO_STRING = 'toString';
  var $toString$1 = /./[TO_STRING];

  var define = function (fn) {
    redefine(RegExp.prototype, TO_STRING, fn, true);
  };

  // 21.2.5.14 RegExp.prototype.toString()
  if (require$$1$1(function () { return $toString$1.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
    define(function toString() {
      var R = anObject(this);
      return '/'.concat(R.source, '/',
        'flags' in R ? R.flags : !require$$0$4 && R instanceof RegExp ? regexpFlags.call(R) : undefined);
    });
  // FF44- RegExp#toString has a wrong name
  } else if ($toString$1.name != TO_STRING) {
    define(function toString() {
      return $toString$1.call(this);
    });
  }

  var DateProto = Date.prototype;
  var INVALID_DATE = 'Invalid Date';
  var TO_STRING$1 = 'toString';
  var $toString$2 = DateProto[TO_STRING$1];
  var getTime = DateProto.getTime;
  if (new Date(NaN) + '' != INVALID_DATE) {
    redefine(DateProto, TO_STRING$1, function toString() {
      var value = getTime.call(this);
      // eslint-disable-next-line no-self-compare
      return value === value ? $toString$2.call(this) : INVALID_DATE;
    });
  }

  // 19.1.3.6 Object.prototype.toString()

  var test$1 = {};
  test$1[require$$0$3('toStringTag')] = 'z';
  if (test$1 + '' != '[object z]') {
    redefine(Object.prototype, 'toString', function toString() {
      return '[object ' + classof(this) + ']';
    }, true);
  }

  var BOOLEAN_ATTRIBUTES$1 = {
    disabled: true,
    readonly: true,
    multiple: true,
    checked: true
  };
  function tagAttrs (attributes) {
    var htmlAttrs = '';

    for (var k in attributes) {
      var v = attributes[k];

      if (BOOLEAN_ATTRIBUTES$1[k]) {
        v = v ? k : null;
      }

      if (v == null) {
        continue;
      }

      htmlAttrs += " ".concat(htmlEscape(k), "=\"").concat(htmlEscape(v.toString()), "\"");
    }

    return htmlAttrs;
  }

  // Copyright 2018 Twitter, Inc.
  function linkToText (entity, text, attributes, options) {
    if (!options.suppressNoFollow) {
      attributes.rel = 'nofollow';
    } // if linkAttributeBlock is specified, call it to modify the attributes


    if (options.linkAttributeBlock) {
      options.linkAttributeBlock(entity, attributes);
    } // if linkTextBlock is specified, call it to get a new/modified link text


    if (options.linkTextBlock) {
      text = options.linkTextBlock(entity, text);
    }

    var d = {
      text: text,
      attr: tagAttrs(attributes)
    };
    return stringSupplant('<a#{attr}>#{text}</a>', d);
  }

  function linkToTextWithSymbol (entity, symbol, text, attributes, options) {
    var taggedSymbol = options.symbolTag ? "<".concat(options.symbolTag, ">").concat(symbol, "</").concat(options.symbolTag, ">") : symbol;
    text = htmlEscape(text);
    var taggedText = options.textWithSymbolTag ? "<".concat(options.textWithSymbolTag, ">").concat(text, "</").concat(options.textWithSymbolTag, ">") : text;

    if (options.usernameIncludeSymbol || !symbol.match(atSigns)) {
      return linkToText(entity, taggedSymbol + taggedText, attributes, options);
    } else {
      return taggedSymbol + linkToText(entity, taggedText, attributes, options);
    }
  }

  // Copyright 2018 Twitter, Inc.
  function linkToCashtag (entity, text, options) {
    var cashtag = htmlEscape(entity.cashtag);
    var attrs = clone(options.htmlAttrs || {});
    attrs.href = options.cashtagUrlBase + cashtag;
    attrs.title = "$".concat(cashtag);
    attrs['class'] = options.cashtagClass;

    if (options.targetBlank) {
      attrs.target = '_blank';
    }

    return linkToTextWithSymbol(entity, '$', cashtag, attrs, options);
  }

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var rtlChars = /[\u0600-\u06FF]|[\u0750-\u077F]|[\u0590-\u05FF]|[\uFE70-\uFEFF]/gm;

  function linkToHashtag (entity, text, options) {
    var hash = text.substring(entity.indices[0], entity.indices[0] + 1);
    var hashtag = htmlEscape(entity.hashtag);
    var attrs = clone(options.htmlAttrs || {});
    attrs.href = options.hashtagUrlBase + hashtag;
    attrs.title = "#".concat(hashtag);
    attrs['class'] = options.hashtagClass;

    if (hashtag.charAt(0).match(rtlChars)) {
      attrs['class'] += ' rtl';
    }

    if (options.targetBlank) {
      attrs.target = '_blank';
    }

    return linkToTextWithSymbol(entity, hash, hashtag, attrs, options);
  }

  function linkTextWithEntity (entity, options) {
    var displayUrl = entity.display_url;
    var expandedUrl = entity.expanded_url; // Goal: If a user copies and pastes a tweet containing t.co'ed link, the resulting paste
    // should contain the full original URL (expanded_url), not the display URL.
    //
    // Method: Whenever possible, we actually emit HTML that contains expanded_url, and use
    // font-size:0 to hide those parts that should not be displayed (because they are not part of display_url).
    // Elements with font-size:0 get copied even though they are not visible.
    // Note that display:none doesn't work here. Elements with display:none don't get copied.
    //
    // Additionally, we want to *display* ellipses, but we don't want them copied.  To make this happen we
    // wrap the ellipses in a tco-ellipsis class and provide an onCopy handler that sets display:none on
    // everything with the tco-ellipsis class.
    //
    // Exception: pic.twitter.com images, for which expandedUrl = "https://twitter.com/#!/username/status/1234/photo/1
    // For those URLs, display_url is not a substring of expanded_url, so we don't do anything special to render the elided parts.
    // For a pic.twitter.com URL, the only elided part will be the "https://", so this is fine.

    var displayUrlSansEllipses = displayUrl.replace(/…/g, ''); // We have to disregard ellipses for matching
    // Note: we currently only support eliding parts of the URL at the beginning or the end.
    // Eventually we may want to elide parts of the URL in the *middle*.  If so, this code will
    // become more complicated.  We will probably want to create a regexp out of display URL,
    // replacing every ellipsis with a ".*".

    if (expandedUrl.indexOf(displayUrlSansEllipses) != -1) {
      var displayUrlIndex = expandedUrl.indexOf(displayUrlSansEllipses);
      var v = {
        displayUrlSansEllipses: displayUrlSansEllipses,
        // Portion of expandedUrl that precedes the displayUrl substring
        beforeDisplayUrl: expandedUrl.substr(0, displayUrlIndex),
        // Portion of expandedUrl that comes after displayUrl
        afterDisplayUrl: expandedUrl.substr(displayUrlIndex + displayUrlSansEllipses.length),
        precedingEllipsis: displayUrl.match(/^…/) ? '…' : '',
        followingEllipsis: displayUrl.match(/…$/) ? '…' : ''
      };

      for (var k in v) {
        if (v.hasOwnProperty(k)) {
          v[k] = htmlEscape(v[k]);
        }
      } // As an example: The user tweets "hi http://longdomainname.com/foo"
      // This gets shortened to "hi http://t.co/xyzabc", with display_url = "…nname.com/foo"
      // This will get rendered as:
      // <span class='tco-ellipsis'> <!-- This stuff should get displayed but not copied -->
      //   …
      //   <!-- There's a chance the onCopy event handler might not fire. In case that happens,
      //        we include an &nbsp; here so that the … doesn't bump up against the URL and ruin it.
      //        The &nbsp; is inside the tco-ellipsis span so that when the onCopy handler *does*
      //        fire, it doesn't get copied.  Otherwise the copied text would have two spaces in a row,
      //        e.g. "hi  http://longdomainname.com/foo".
      //   <span style='font-size:0'>&nbsp;</span>
      // </span>
      // <span style='font-size:0'>  <!-- This stuff should get copied but not displayed -->
      //   http://longdomai
      // </span>
      // <span class='js-display-url'> <!-- This stuff should get displayed *and* copied -->
      //   nname.com/foo
      // </span>
      // <span class='tco-ellipsis'> <!-- This stuff should get displayed but not copied -->
      //   <span style='font-size:0'>&nbsp;</span>
      //   …
      // </span>


      v['invisible'] = options.invisibleTagAttrs;
      return stringSupplant("<span class='tco-ellipsis'>#{precedingEllipsis}<span #{invisible}>&nbsp;</span></span><span #{invisible}>#{beforeDisplayUrl}</span><span class='js-display-url'>#{displayUrlSansEllipses}</span><span #{invisible}>#{afterDisplayUrl}</span><span class='tco-ellipsis'><span #{invisible}>&nbsp;</span>#{followingEllipsis}</span>", v);
    }

    return displayUrl;
  }

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var urlHasProtocol = /^https?:\/\//i;

  function linkToUrl (entity, text, options) {
    var url = entity.url;
    var displayUrl = url;
    var linkText = htmlEscape(displayUrl); // If the caller passed a urlEntities object (provided by a Twitter API
    // response with include_entities=true), we use that to render the display_url
    // for each URL instead of it's underlying t.co URL.

    var urlEntity = options.urlEntities && options.urlEntities[url] || entity;

    if (urlEntity.display_url) {
      linkText = linkTextWithEntity(urlEntity, options);
    }

    var attrs = clone(options.htmlAttrs || {});

    if (!url.match(urlHasProtocol)) {
      url = "http://".concat(url);
    }

    attrs.href = url;

    if (options.targetBlank) {
      attrs.target = '_blank';
    } // set class only if urlClass is specified.


    if (options.urlClass) {
      attrs['class'] = options.urlClass;
    } // set target only if urlTarget is specified.


    if (options.urlTarget) {
      attrs.target = options.urlTarget;
    }

    if (!options.title && urlEntity.display_url) {
      attrs.title = urlEntity.expanded_url;
    }

    return linkToText(entity, linkText, attrs, options);
  }

  // Copyright 2018 Twitter, Inc.
  function linkToMentionAndList (entity, text, options) {
    var at = text.substring(entity.indices[0], entity.indices[0] + 1);
    var user = htmlEscape(entity.screenName);
    var slashListname = htmlEscape(entity.listSlug);
    var isList = entity.listSlug && !options.suppressLists;
    var attrs = clone(options.htmlAttrs || {});
    attrs['class'] = isList ? options.listClass : options.usernameClass;
    attrs.href = isList ? options.listUrlBase + user + slashListname : options.usernameUrlBase + user;

    if (!isList && !options.suppressDataScreenName) {
      attrs['data-screen-name'] = user;
    }

    if (options.targetBlank) {
      attrs.target = '_blank';
    }

    return linkToTextWithSymbol(entity, at, isList ? user + slashListname : user, attrs, options);
  }

  var DEFAULT_LIST_CLASS = 'tweet-url list-slug'; // Default CSS class for auto-linked usernames (along with the url class)

  var DEFAULT_USERNAME_CLASS = 'tweet-url username'; // Default CSS class for auto-linked hashtags (along with the url class)

  var DEFAULT_HASHTAG_CLASS = 'tweet-url hashtag'; // Default CSS class for auto-linked cashtags (along with the url class)

  var DEFAULT_CASHTAG_CLASS = 'tweet-url cashtag';
  function autoLinkEntities (text, entities, options) {
    var options = clone(options || {});
    options.hashtagClass = options.hashtagClass || DEFAULT_HASHTAG_CLASS;
    options.hashtagUrlBase = options.hashtagUrlBase || 'https://twitter.com/search?q=%23';
    options.cashtagClass = options.cashtagClass || DEFAULT_CASHTAG_CLASS;
    options.cashtagUrlBase = options.cashtagUrlBase || 'https://twitter.com/search?q=%24';
    options.listClass = options.listClass || DEFAULT_LIST_CLASS;
    options.usernameClass = options.usernameClass || DEFAULT_USERNAME_CLASS;
    options.usernameUrlBase = options.usernameUrlBase || 'https://twitter.com/';
    options.listUrlBase = options.listUrlBase || 'https://twitter.com/';
    options.htmlAttrs = extractHtmlAttrsFromOptions(options);
    options.invisibleTagAttrs = options.invisibleTagAttrs || "style='position:absolute;left:-9999px;'"; // remap url entities to hash

    var urlEntities, i, len;

    if (options.urlEntities) {
      urlEntities = {};

      for (i = 0, len = options.urlEntities.length; i < len; i++) {
        urlEntities[options.urlEntities[i].url] = options.urlEntities[i];
      }

      options.urlEntities = urlEntities;
    }

    var result = '';
    var beginIndex = 0; // sort entities by start index

    entities.sort(function (a, b) {
      return a.indices[0] - b.indices[0];
    });
    var nonEntity = options.htmlEscapeNonEntities ? htmlEscape : function (text) {
      return text;
    };

    for (var i = 0; i < entities.length; i++) {
      var entity = entities[i];
      result += nonEntity(text.substring(beginIndex, entity.indices[0]));

      if (entity.url) {
        result += linkToUrl(entity, text, options);
      } else if (entity.hashtag) {
        result += linkToHashtag(entity, text, options);
      } else if (entity.screenName) {
        result += linkToMentionAndList(entity, text, options);
      } else if (entity.cashtag) {
        result += linkToCashtag(entity, text, options);
      }

      beginIndex = entity.indices[1];
    }

    result += nonEntity(text.substring(beginIndex, text.length));
    return result;
  }

  // Copyright 2018 Twitter, Inc.
  function autoLink (text, options) {
    var entities = extractEntitiesWithIndices(text, {
      extractUrlsWithoutProtocol: false
    });
    return autoLinkEntities(text, entities, options);
  }

  // Copyright 2018 Twitter, Inc.
  function autoLinkCashtags (text, options) {
    var entities = extractCashtagsWithIndices(text);
    return autoLinkEntities(text, entities, options);
  }

  // Copyright 2018 Twitter, Inc.
  function autoLinkHashtags (text, options) {
    var entities = extractHashtagsWithIndices(text);
    return autoLinkEntities(text, entities, options);
  }

  // Copyright 2018 Twitter, Inc.
  function autoLinkUrlsCustom (text, options) {
    var entities = extractUrlsWithIndices(text, {
      extractUrlsWithoutProtocol: false
    });
    return autoLinkEntities(text, entities, options);
  }

  // Copyright 2018 Twitter, Inc.
  function autoLinkUsernamesOrLists (text, options) {
    var entities = extractMentionsOrListsWithIndices(text);
    return autoLinkEntities(text, entities, options);
  }

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0

  /**
   * Copied from https://github.com/twitter/twitter-text/blob/master/js/twitter-text.js
   */
  var convertUnicodeIndices = function convertUnicodeIndices(text, entities, indicesInUTF16) {
    if (entities.length === 0) {
      return;
    }

    var charIndex = 0;
    var codePointIndex = 0; // sort entities by start index

    entities.sort(function (a, b) {
      return a.indices[0] - b.indices[0];
    });
    var entityIndex = 0;
    var entity = entities[0];

    while (charIndex < text.length) {
      if (entity.indices[0] === (indicesInUTF16 ? charIndex : codePointIndex)) {
        var len = entity.indices[1] - entity.indices[0];
        entity.indices[0] = indicesInUTF16 ? codePointIndex : charIndex;
        entity.indices[1] = entity.indices[0] + len;
        entityIndex++;

        if (entityIndex === entities.length) {
          // no more entity
          break;
        }

        entity = entities[entityIndex];
      }

      var c = text.charCodeAt(charIndex);

      if (c >= 0xd800 && c <= 0xdbff && charIndex < text.length - 1) {
        // Found high surrogate char
        c = text.charCodeAt(charIndex + 1);

        if (c >= 0xdc00 && c <= 0xdfff) {
          // Found surrogate pair
          charIndex++;
        }
      }

      codePointIndex++;
      charIndex++;
    }
  };

  // Copyright 2018 Twitter, Inc.
  function modifyIndicesFromUnicodeToUTF16 (text, entities) {
    convertUnicodeIndices(text, entities, false);
  }

  // Copyright 2018 Twitter, Inc.
  function autoLinkWithJSON (text, json, options) {
    // map JSON entity to twitter-text entity
    if (json.user_mentions) {
      for (var i = 0; i < json.user_mentions.length; i++) {
        // this is a @mention
        json.user_mentions[i].screenName = json.user_mentions[i].screen_name;
      }
    }

    if (json.hashtags) {
      for (var i = 0; i < json.hashtags.length; i++) {
        // this is a #hashtag
        json.hashtags[i].hashtag = json.hashtags[i].text;
      }
    }

    if (json.symbols) {
      for (var i = 0; i < json.symbols.length; i++) {
        // this is a $CASH tag
        json.symbols[i].cashtag = json.symbols[i].text;
      }
    } // concatenate all entities


    var entities = [];

    for (var key in json) {
      entities = entities.concat(json[key]);
    } // modify indices to UTF-16


    modifyIndicesFromUnicodeToUTF16(text, entities);
    return autoLinkEntities(text, entities, options);
  }

  // This file is generated by scripts/buildConfig.js
  var configs = {
    version1: {
      version: 1,
      maxWeightedTweetLength: 140,
      scale: 1,
      defaultWeight: 1,
      transformedURLLength: 23,
      ranges: []
    },
    version2: {
      version: 2,
      maxWeightedTweetLength: 280,
      scale: 100,
      defaultWeight: 200,
      transformedURLLength: 23,
      ranges: [{
        start: 0,
        end: 4351,
        weight: 100
      }, {
        start: 8192,
        end: 8205,
        weight: 100
      }, {
        start: 8208,
        end: 8223,
        weight: 100
      }, {
        start: 8242,
        end: 8247,
        weight: 100
      }]
    },
    version3: {
      version: 3,
      maxWeightedTweetLength: 280,
      scale: 100,
      defaultWeight: 200,
      emojiParsingEnabled: true,
      transformedURLLength: 23,
      ranges: [{
        start: 0,
        end: 4351,
        weight: 100
      }, {
        start: 8192,
        end: 8205,
        weight: 100
      }, {
        start: 8208,
        end: 8223,
        weight: 100
      }, {
        start: 8242,
        end: 8247,
        weight: 100
      }]
    },
    defaults: {
      version: 3,
      maxWeightedTweetLength: 280,
      scale: 100,
      defaultWeight: 200,
      emojiParsingEnabled: true,
      transformedURLLength: 23,
      ranges: [{
        start: 0,
        end: 4351,
        weight: 100
      }, {
        start: 8192,
        end: 8205,
        weight: 100
      }, {
        start: 8208,
        end: 8223,
        weight: 100
      }, {
        start: 8242,
        end: 8247,
        weight: 100
      }]
    }
  };

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  function convertUnicodeIndices$1 (text, entities, indicesInUTF16) {
    if (entities.length == 0) {
      return;
    }

    var charIndex = 0;
    var codePointIndex = 0; // sort entities by start index

    entities.sort(function (a, b) {
      return a.indices[0] - b.indices[0];
    });
    var entityIndex = 0;
    var entity = entities[0];

    while (charIndex < text.length) {
      if (entity.indices[0] == (indicesInUTF16 ? charIndex : codePointIndex)) {
        var len = entity.indices[1] - entity.indices[0];
        entity.indices[0] = indicesInUTF16 ? codePointIndex : charIndex;
        entity.indices[1] = entity.indices[0] + len;
        entityIndex++;

        if (entityIndex == entities.length) {
          // no more entity
          break;
        }

        entity = entities[entityIndex];
      }

      var c = text.charCodeAt(charIndex);

      if (c >= 0xd800 && c <= 0xdbff && charIndex < text.length - 1) {
        // Found high surrogate char
        c = text.charCodeAt(charIndex + 1);

        if (c >= 0xdc00 && c <= 0xdfff) {
          // Found surrogate pair
          charIndex++;
        }
      }

      codePointIndex++;
      charIndex++;
    }
  }

  // Copyright 2018 Twitter, Inc.
  function extractCashtags (text) {
    var cashtagsOnly = [],
        cashtagsWithIndices = extractCashtagsWithIndices(text);

    for (var i = 0; i < cashtagsWithIndices.length; i++) {
      cashtagsOnly.push(cashtagsWithIndices[i].cashtag);
    }

    return cashtagsOnly;
  }

  // Copyright 2018 Twitter, Inc.
  function extractHashtags (text) {
    var hashtagsOnly = [];
    var hashtagsWithIndices = extractHashtagsWithIndices(text);

    for (var i = 0; i < hashtagsWithIndices.length; i++) {
      hashtagsOnly.push(hashtagsWithIndices[i].hashtag);
    }

    return hashtagsOnly;
  }

  // Copyright 2018 Twitter, Inc.
  function extractMentionsWithIndices (text) {
    var mentions = [];
    var mentionOrList;
    var mentionsOrLists = extractMentionsOrListsWithIndices(text);

    for (var i = 0; i < mentionsOrLists.length; i++) {
      mentionOrList = mentionsOrLists[i];

      if (mentionOrList.listSlug === '') {
        mentions.push({
          screenName: mentionOrList.screenName,
          indices: mentionOrList.indices
        });
      }
    }

    return mentions;
  }

  // Copyright 2018 Twitter, Inc.
  function extractMentions (text) {
    var screenNamesOnly = [],
        screenNamesWithIndices = extractMentionsWithIndices(text);

    for (var i = 0; i < screenNamesWithIndices.length; i++) {
      var screenName = screenNamesWithIndices[i].screenName;
      screenNamesOnly.push(screenName);
    }

    return screenNamesOnly;
  }

  // Copyright 2018 Twitter, Inc.
  var validReply = regexSupplant(/^(?:#{spaces})*#{atSigns}([a-zA-Z0-9_]{1,20})/, {
    atSigns: atSigns,
    spaces: spaces
  });

  function extractReplies (text) {
    if (!text) {
      return null;
    }

    var possibleScreenName = text.match(validReply);

    if (!possibleScreenName || RegExp.rightContext.match(endMentionMatch)) {
      return null;
    }

    return possibleScreenName[1];
  }

  // Copyright 2018 Twitter, Inc.
  function extractUrls (text, options) {
    var urlsOnly = [];
    var urlsWithIndices = extractUrlsWithIndices(text, options);

    for (var i = 0; i < urlsWithIndices.length; i++) {
      urlsOnly.push(urlsWithIndices[i].url);
    }

    return urlsOnly;
  }

  // 7.2.2 IsArray(argument)

  var _isArray = Array.isArray || function isArray(arg) {
    return cof(arg) == 'Array';
  };

  var _isArray$1 = /*#__PURE__*/Object.freeze({
    default: _isArray,
    __moduleExports: _isArray
  });

  var require$$0$d = ( _isArray$1 && _isArray ) || _isArray$1;

  // 22.1.2.2 / 15.4.3.2 Array.isArray(arg)


  $export$1($export$1.S, 'Array', { isArray: require$$0$d });

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var getCharacterWeight = function getCharacterWeight(ch, options) {
    var defaultWeight = options.defaultWeight,
        ranges = options.ranges;
    var weight = defaultWeight;
    var chCodePoint = ch.charCodeAt(0);

    if (Array.isArray(ranges)) {
      for (var i = 0, length = ranges.length; i < length; i++) {
        var currRange = ranges[i];

        if (chCodePoint >= currRange.start && chCodePoint <= currRange.end) {
          weight = currRange.weight;
          break;
        }
      }
    }

    return weight;
  };

  // Copyright 2018 Twitter, Inc.
  function modifyIndicesFromUTF16ToUnicode (text, entities) {
    convertUnicodeIndices(text, entities, true);
  }

  var _arrayReduce = function (that, callbackfn, aLen, memo, isRight) {
    aFunction(callbackfn);
    var O = toObject(that);
    var self = IObject(O);
    var length = toLength(O.length);
    var index = isRight ? length - 1 : 0;
    var i = isRight ? -1 : 1;
    if (aLen < 2) for (;;) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (isRight ? index < 0 : length <= index) {
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };

  var _arrayReduce$1 = /*#__PURE__*/Object.freeze({
    default: _arrayReduce,
    __moduleExports: _arrayReduce
  });

  var $reduce = ( _arrayReduce$1 && _arrayReduce ) || _arrayReduce$1;

  $export$1($export$1.P + $export$1.F * !require$$0$9([].reduce, true), 'Array', {
    // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
    reduce: function reduce(callbackfn /* , initialValue */) {
      return $reduce(this, callbackfn, arguments.length, arguments[1], false);
    }
  });

  // 22.1.3.31 Array.prototype[@@unscopables]
  var UNSCOPABLES = require$$0$3('unscopables');
  var ArrayProto = Array.prototype;
  if (ArrayProto[UNSCOPABLES] == undefined) require$$0$5(ArrayProto, UNSCOPABLES, {});
  var _addToUnscopables = function (key) {
    ArrayProto[UNSCOPABLES][key] = true;
  };

  var _addToUnscopables$1 = /*#__PURE__*/Object.freeze({
    default: _addToUnscopables,
    __moduleExports: _addToUnscopables
  });

  var _iterStep = function (done, value) {
    return { value: value, done: !!done };
  };

  var _iterStep$1 = /*#__PURE__*/Object.freeze({
    default: _iterStep,
    __moduleExports: _iterStep
  });

  var _iterators = {};

  var _iterators$1 = /*#__PURE__*/Object.freeze({
    default: _iterators,
    __moduleExports: _iterators
  });

  // 19.1.2.14 / 15.2.3.14 Object.keys(O)



  var _objectKeys = Object.keys || function keys(O) {
    return $keys(O, enumBugKeys);
  };

  var _objectKeys$1 = /*#__PURE__*/Object.freeze({
    default: _objectKeys,
    __moduleExports: _objectKeys
  });

  var getKeys = ( _objectKeys$1 && _objectKeys ) || _objectKeys$1;

  var _objectDps = require$$0$4 ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject(O);
    var keys = getKeys(Properties);
    var length = keys.length;
    var i = 0;
    var P;
    while (length > i) require$$1$2.f(O, P = keys[i++], Properties[P]);
    return O;
  };

  var _objectDps$1 = /*#__PURE__*/Object.freeze({
    default: _objectDps,
    __moduleExports: _objectDps
  });

  var document$1 = require$$0$1.document;
  var _html = document$1 && document$1.documentElement;

  var _html$1 = /*#__PURE__*/Object.freeze({
    default: _html,
    __moduleExports: _html
  });

  var dPs = ( _objectDps$1 && _objectDps ) || _objectDps$1;

  var require$$2$1 = ( _html$1 && _html ) || _html$1;

  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



  var IE_PROTO$1 = require$$0$b('IE_PROTO');
  var Empty = function () { /* empty */ };
  var PROTOTYPE$1 = 'prototype';

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var createDict = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = require$$2('iframe');
    var i = enumBugKeys.length;
    var lt = '<';
    var gt = '>';
    var iframeDocument;
    iframe.style.display = 'none';
    require$$2$1.appendChild(iframe);
    iframe.src = 'javascript:'; // eslint-disable-line no-script-url
    // createDict = iframe.contentWindow.Object;
    // html.removeChild(iframe);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
    iframeDocument.close();
    createDict = iframeDocument.F;
    while (i--) delete createDict[PROTOTYPE$1][enumBugKeys[i]];
    return createDict();
  };

  var _objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      Empty[PROTOTYPE$1] = anObject(O);
      result = new Empty();
      Empty[PROTOTYPE$1] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO$1] = O;
    } else result = createDict();
    return Properties === undefined ? result : dPs(result, Properties);
  };

  var _objectCreate$1 = /*#__PURE__*/Object.freeze({
    default: _objectCreate,
    __moduleExports: _objectCreate
  });

  var def = require$$1$2.f;

  var TAG$1 = require$$0$3('toStringTag');

  var _setToStringTag = function (it, tag, stat) {
    if (it && !has(it = stat ? it : it.prototype, TAG$1)) def(it, TAG$1, { configurable: true, value: tag });
  };

  var _setToStringTag$1 = /*#__PURE__*/Object.freeze({
    default: _setToStringTag,
    __moduleExports: _setToStringTag
  });

  var create = ( _objectCreate$1 && _objectCreate ) || _objectCreate$1;

  var setToStringTag = ( _setToStringTag$1 && _setToStringTag ) || _setToStringTag$1;

  var IteratorPrototype = {};

  // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
  require$$0$5(IteratorPrototype, require$$0$3('iterator'), function () { return this; });

  var _iterCreate = function (Constructor, NAME, next) {
    Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
    setToStringTag(Constructor, NAME + ' Iterator');
  };

  var _iterCreate$1 = /*#__PURE__*/Object.freeze({
    default: _iterCreate,
    __moduleExports: _iterCreate
  });

  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


  var IE_PROTO$2 = require$$0$b('IE_PROTO');
  var ObjectProto = Object.prototype;

  var _objectGpo = Object.getPrototypeOf || function (O) {
    O = toObject(O);
    if (has(O, IE_PROTO$2)) return O[IE_PROTO$2];
    if (typeof O.constructor == 'function' && O instanceof O.constructor) {
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  };

  var _objectGpo$1 = /*#__PURE__*/Object.freeze({
    default: _objectGpo,
    __moduleExports: _objectGpo
  });

  var Iterators = ( _iterators$1 && _iterators ) || _iterators$1;

  var $iterCreate = ( _iterCreate$1 && _iterCreate ) || _iterCreate$1;

  var getPrototypeOf = ( _objectGpo$1 && _objectGpo ) || _objectGpo$1;

  var ITERATOR = require$$0$3('iterator');
  var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
  var FF_ITERATOR = '@@iterator';
  var KEYS = 'keys';
  var VALUES = 'values';

  var returnThis = function () { return this; };

  var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
    $iterCreate(Constructor, NAME, next);
    var getMethod = function (kind) {
      if (!BUGGY && kind in proto) return proto[kind];
      switch (kind) {
        case KEYS: return function keys() { return new Constructor(this, kind); };
        case VALUES: return function values() { return new Constructor(this, kind); };
      } return function entries() { return new Constructor(this, kind); };
    };
    var TAG = NAME + ' Iterator';
    var DEF_VALUES = DEFAULT == VALUES;
    var VALUES_BUG = false;
    var proto = Base.prototype;
    var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
    var $default = $native || getMethod(DEFAULT);
    var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
    var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
    var methods, key, IteratorPrototype;
    // Fix native
    if ($anyNative) {
      IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
      if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
        // Set @@toStringTag to native iterators
        setToStringTag(IteratorPrototype, TAG, true);
        // fix for some old engines
        if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') require$$0$5(IteratorPrototype, ITERATOR, returnThis);
      }
    }
    // fix Array#{values, @@iterator}.name in V8 / FF
    if (DEF_VALUES && $native && $native.name !== VALUES) {
      VALUES_BUG = true;
      $default = function values() { return $native.call(this); };
    }
    // Define iterator
    if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
      require$$0$5(proto, ITERATOR, $default);
    }
    // Plug for library
    Iterators[NAME] = $default;
    Iterators[TAG] = returnThis;
    if (DEFAULT) {
      methods = {
        values: DEF_VALUES ? $default : getMethod(VALUES),
        keys: IS_SET ? $default : getMethod(KEYS),
        entries: $entries
      };
      if (FORCED) for (key in methods) {
        if (!(key in proto)) redefine(proto, key, methods[key]);
      } else $export$1($export$1.P + $export$1.F * (BUGGY || VALUES_BUG), NAME, methods);
    }
    return methods;
  };

  var _iterDefine$1 = /*#__PURE__*/Object.freeze({
    default: _iterDefine,
    __moduleExports: _iterDefine
  });

  var addToUnscopables = ( _addToUnscopables$1 && _addToUnscopables ) || _addToUnscopables$1;

  var step = ( _iterStep$1 && _iterStep ) || _iterStep$1;

  var require$$1$4 = ( _iterDefine$1 && _iterDefine ) || _iterDefine$1;

  // 22.1.3.4 Array.prototype.entries()
  // 22.1.3.13 Array.prototype.keys()
  // 22.1.3.29 Array.prototype.values()
  // 22.1.3.30 Array.prototype[@@iterator]()
  var es6_array_iterator = require$$1$4(Array, 'Array', function (iterated, kind) {
    this._t = toIObject(iterated); // target
    this._i = 0;                   // next index
    this._k = kind;                // kind
  // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
  }, function () {
    var O = this._t;
    var kind = this._k;
    var index = this._i++;
    if (!O || index >= O.length) {
      this._t = undefined;
      return step(1);
    }
    if (kind == 'keys') return step(0, index);
    if (kind == 'values') return step(0, O[index]);
    return step(0, [index, O[index]]);
  }, 'values');

  // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
  Iterators.Arguments = Iterators.Array;

  addToUnscopables('keys');
  addToUnscopables('values');
  addToUnscopables('entries');

  var ITERATOR$1 = require$$0$3('iterator');
  var TO_STRING_TAG = require$$0$3('toStringTag');
  var ArrayValues = Iterators.Array;

  var DOMIterables = {
    CSSRuleList: true, // TODO: Not spec compliant, should be false.
    CSSStyleDeclaration: false,
    CSSValueList: false,
    ClientRectList: false,
    DOMRectList: false,
    DOMStringList: false,
    DOMTokenList: true,
    DataTransferItemList: false,
    FileList: false,
    HTMLAllCollection: false,
    HTMLCollection: false,
    HTMLFormElement: false,
    HTMLSelectElement: false,
    MediaList: true, // TODO: Not spec compliant, should be false.
    MimeTypeArray: false,
    NamedNodeMap: false,
    NodeList: true,
    PaintRequestList: false,
    Plugin: false,
    PluginArray: false,
    SVGLengthList: false,
    SVGNumberList: false,
    SVGPathSegList: false,
    SVGPointList: false,
    SVGStringList: false,
    SVGTransformList: false,
    SourceBufferList: false,
    StyleSheetList: true, // TODO: Not spec compliant, should be false.
    TextTrackCueList: false,
    TextTrackList: false,
    TouchList: false
  };

  for (var collections = getKeys(DOMIterables), i$1 = 0; i$1 < collections.length; i$1++) {
    var NAME = collections[i$1];
    var explicit = DOMIterables[NAME];
    var Collection = require$$0$1[NAME];
    var proto$1 = Collection && Collection.prototype;
    var key;
    if (proto$1) {
      if (!proto$1[ITERATOR$1]) require$$0$5(proto$1, ITERATOR$1, ArrayValues);
      if (!proto$1[TO_STRING_TAG]) require$$0$5(proto$1, TO_STRING_TAG, NAME);
      Iterators[NAME] = ArrayValues;
      if (explicit) for (key in es6_array_iterator) if (!proto$1[key]) redefine(proto$1, key, es6_array_iterator[key], true);
    }
  }

  // most Object methods by ES6 should accept primitives



  var _objectSap = function (KEY, exec) {
    var fn = (require$$1.Object || {})[KEY] || Object[KEY];
    var exp = {};
    exp[KEY] = exec(fn);
    $export$1($export$1.S + $export$1.F * require$$1$1(function () { fn(1); }), 'Object', exp);
  };

  var _objectSap$1 = /*#__PURE__*/Object.freeze({
    default: _objectSap,
    __moduleExports: _objectSap
  });

  var require$$0$e = ( _objectSap$1 && _objectSap ) || _objectSap$1;

  // 19.1.2.14 Object.keys(O)



  require$$0$e('keys', function () {
    return function keys(it) {
      return getKeys(toObject(it));
    };
  });

  // Copyright 2018 Twitter, Inc.
  var invalidChars = regexSupplant(/[#{invalidCharsGroup}]/, {
    invalidCharsGroup: invalidCharsGroup
  });

  // Copyright 2018 Twitter, Inc.
  function hasInvalidCharacters (text) {
    return invalidChars.test(text);
  }

  var regex = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  // Copyright Twitter Inc. Licensed under MIT
  // https://github.com/twitter/twemoji-parser/blob/master/LICENSE.md

  // This file is auto-generated
  exports.default = /(?:\ud83d[\udc68\udc69])(?:\ud83c[\udffb-\udfff])?\u200d(?:\u2695\ufe0f|\u2696\ufe0f|\u2708\ufe0f|\ud83c[\udf3e\udf73\udf93\udfa4\udfa8\udfeb\udfed]|\ud83d[\udcbb\udcbc\udd27\udd2c\ude80\ude92]|\ud83e[\uddb0-\uddb3])|(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75]|\u26f9)((?:\ud83c[\udffb-\udfff]|\ufe0f)\u200d[\u2640\u2642]\ufe0f)|(?:\ud83c[\udfc3\udfc4\udfca]|\ud83d[\udc6e\udc71\udc73\udc77\udc81\udc82\udc86\udc87\ude45-\ude47\ude4b\ude4d\ude4e\udea3\udeb4-\udeb6]|\ud83e[\udd26\udd35\udd37-\udd39\udd3d\udd3e\uddb8\uddb9\uddd6-\udddd])(?:\ud83c[\udffb-\udfff])?\u200d[\u2640\u2642]\ufe0f|(?:\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d\udc8b\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\u2764\ufe0f\u200d\ud83d\udc68|\ud83d\udc68\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc68\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc68\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\u2764\ufe0f\u200d\ud83d[\udc68\udc69]|\ud83d\udc69\u200d\ud83d\udc66\u200d\ud83d\udc66|\ud83d\udc69\u200d\ud83d\udc67\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83c\udff3\ufe0f\u200d\ud83c\udf08|\ud83c\udff4\u200d\u2620\ufe0f|\ud83d\udc41\u200d\ud83d\udde8|\ud83d\udc68\u200d\ud83d[\udc66\udc67]|\ud83d\udc69\u200d\ud83d[\udc66\udc67]|\ud83d\udc6f\u200d\u2640\ufe0f|\ud83d\udc6f\u200d\u2642\ufe0f|\ud83e\udd3c\u200d\u2640\ufe0f|\ud83e\udd3c\u200d\u2642\ufe0f|\ud83e\uddde\u200d\u2640\ufe0f|\ud83e\uddde\u200d\u2642\ufe0f|\ud83e\udddf\u200d\u2640\ufe0f|\ud83e\udddf\u200d\u2642\ufe0f)|[#*0-9]\ufe0f?\u20e3|(?:[©®\u2122\u265f]\ufe0f)|(?:\ud83c[\udc04\udd70\udd71\udd7e\udd7f\ude02\ude1a\ude2f\ude37\udf21\udf24-\udf2c\udf36\udf7d\udf96\udf97\udf99-\udf9b\udf9e\udf9f\udfcd\udfce\udfd4-\udfdf\udff3\udff5\udff7]|\ud83d[\udc3f\udc41\udcfd\udd49\udd4a\udd6f\udd70\udd73\udd76-\udd79\udd87\udd8a-\udd8d\udda5\udda8\uddb1\uddb2\uddbc\uddc2-\uddc4\uddd1-\uddd3\udddc-\uddde\udde1\udde3\udde8\uddef\uddf3\uddfa\udecb\udecd-\udecf\udee0-\udee5\udee9\udef0\udef3]|[\u203c\u2049\u2139\u2194-\u2199\u21a9\u21aa\u231a\u231b\u2328\u23cf\u23ed-\u23ef\u23f1\u23f2\u23f8-\u23fa\u24c2\u25aa\u25ab\u25b6\u25c0\u25fb-\u25fe\u2600-\u2604\u260e\u2611\u2614\u2615\u2618\u2620\u2622\u2623\u2626\u262a\u262e\u262f\u2638-\u263a\u2640\u2642\u2648-\u2653\u2660\u2663\u2665\u2666\u2668\u267b\u267f\u2692-\u2697\u2699\u269b\u269c\u26a0\u26a1\u26aa\u26ab\u26b0\u26b1\u26bd\u26be\u26c4\u26c5\u26c8\u26cf\u26d1\u26d3\u26d4\u26e9\u26ea\u26f0-\u26f5\u26f8\u26fa\u26fd\u2702\u2708\u2709\u270f\u2712\u2714\u2716\u271d\u2721\u2733\u2734\u2744\u2747\u2757\u2763\u2764\u27a1\u2934\u2935\u2b05-\u2b07\u2b1b\u2b1c\u2b50\u2b55\u3030\u303d\u3297\u3299])(?:\ufe0f|(?!\ufe0e))|(?:(?:\ud83c[\udfcb\udfcc]|\ud83d[\udd74\udd75\udd90]|[\u261d\u26f7\u26f9\u270c\u270d])(?:\ufe0f|(?!\ufe0e))|(?:\ud83c[\udf85\udfc2-\udfc4\udfc7\udfca]|\ud83d[\udc42\udc43\udc46-\udc50\udc66-\udc69\udc6e\udc70-\udc78\udc7c\udc81-\udc83\udc85-\udc87\udcaa\udd7a\udd95\udd96\ude45-\ude47\ude4b-\ude4f\udea3\udeb4-\udeb6\udec0\udecc]|\ud83e[\udd18-\udd1c\udd1e\udd1f\udd26\udd30-\udd39\udd3d\udd3e\uddb5\uddb6\uddb8\uddb9\uddd1-\udddd]|[\u270a\u270b]))(?:\ud83c[\udffb-\udfff])?|(?:\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc65\udb40\udc6e\udb40\udc67\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc73\udb40\udc63\udb40\udc74\udb40\udc7f|\ud83c\udff4\udb40\udc67\udb40\udc62\udb40\udc77\udb40\udc6c\udb40\udc73\udb40\udc7f|\ud83c\udde6\ud83c[\udde8-\uddec\uddee\uddf1\uddf2\uddf4\uddf6-\uddfa\uddfc\uddfd\uddff]|\ud83c\udde7\ud83c[\udde6\udde7\udde9-\uddef\uddf1-\uddf4\uddf6-\uddf9\uddfb\uddfc\uddfe\uddff]|\ud83c\udde8\ud83c[\udde6\udde8\udde9\uddeb-\uddee\uddf0-\uddf5\uddf7\uddfa-\uddff]|\ud83c\udde9\ud83c[\uddea\uddec\uddef\uddf0\uddf2\uddf4\uddff]|\ud83c\uddea\ud83c[\udde6\udde8\uddea\uddec\udded\uddf7-\uddfa]|\ud83c\uddeb\ud83c[\uddee-\uddf0\uddf2\uddf4\uddf7]|\ud83c\uddec\ud83c[\udde6\udde7\udde9-\uddee\uddf1-\uddf3\uddf5-\uddfa\uddfc\uddfe]|\ud83c\udded\ud83c[\uddf0\uddf2\uddf3\uddf7\uddf9\uddfa]|\ud83c\uddee\ud83c[\udde8-\uddea\uddf1-\uddf4\uddf6-\uddf9]|\ud83c\uddef\ud83c[\uddea\uddf2\uddf4\uddf5]|\ud83c\uddf0\ud83c[\uddea\uddec-\uddee\uddf2\uddf3\uddf5\uddf7\uddfc\uddfe\uddff]|\ud83c\uddf1\ud83c[\udde6-\udde8\uddee\uddf0\uddf7-\uddfb\uddfe]|\ud83c\uddf2\ud83c[\udde6\udde8-\udded\uddf0-\uddff]|\ud83c\uddf3\ud83c[\udde6\udde8\uddea-\uddec\uddee\uddf1\uddf4\uddf5\uddf7\uddfa\uddff]|\ud83c\uddf4\ud83c\uddf2|\ud83c\uddf5\ud83c[\udde6\uddea-\udded\uddf0-\uddf3\uddf7-\uddf9\uddfc\uddfe]|\ud83c\uddf6\ud83c\udde6|\ud83c\uddf7\ud83c[\uddea\uddf4\uddf8\uddfa\uddfc]|\ud83c\uddf8\ud83c[\udde6-\uddea\uddec-\uddf4\uddf7-\uddf9\uddfb\uddfd-\uddff]|\ud83c\uddf9\ud83c[\udde6\udde8\udde9\uddeb-\udded\uddef-\uddf4\uddf7\uddf9\uddfb\uddfc\uddff]|\ud83c\uddfa\ud83c[\udde6\uddec\uddf2\uddf3\uddf8\uddfe\uddff]|\ud83c\uddfb\ud83c[\udde6\udde8\uddea\uddec\uddee\uddf3\uddfa]|\ud83c\uddfc\ud83c[\uddeb\uddf8]|\ud83c\uddfd\ud83c\uddf0|\ud83c\uddfe\ud83c[\uddea\uddf9]|\ud83c\uddff\ud83c[\udde6\uddf2\uddfc]|\ud83c[\udccf\udd8e\udd91-\udd9a\udde6-\uddff\ude01\ude32-\ude36\ude38-\ude3a\ude50\ude51\udf00-\udf20\udf2d-\udf35\udf37-\udf7c\udf7e-\udf84\udf86-\udf93\udfa0-\udfc1\udfc5\udfc6\udfc8\udfc9\udfcf-\udfd3\udfe0-\udff0\udff4\udff8-\udfff]|\ud83d[\udc00-\udc3e\udc40\udc44\udc45\udc51-\udc65\udc6a-\udc6d\udc6f\udc79-\udc7b\udc7d-\udc80\udc84\udc88-\udca9\udcab-\udcfc\udcff-\udd3d\udd4b-\udd4e\udd50-\udd67\udda4\uddfb-\ude44\ude48-\ude4a\ude80-\udea2\udea4-\udeb3\udeb7-\udebf\udec1-\udec5\uded0-\uded2\udeeb\udeec\udef4-\udef9]|\ud83e[\udd10-\udd17\udd1d\udd20-\udd25\udd27-\udd2f\udd3a\udd3c\udd40-\udd45\udd47-\udd70\udd73-\udd76\udd7a\udd7c-\udda2\uddb4\uddb7\uddc0-\uddc2\uddd0\uddde-\uddff]|[\u23e9-\u23ec\u23f0\u23f3\u267e\u26ce\u2705\u2728\u274c\u274e\u2753-\u2755\u2795-\u2797\u27b0\u27bf\ue50a])|\ufe0f/g;
  });

  var regex$1 = unwrapExports(regex);

  var regex$2 = /*#__PURE__*/Object.freeze({
    default: regex$1,
    __moduleExports: regex
  });

  var _regex = ( regex$2 && regex$1 ) || regex$2;

  var dist = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TypeName = undefined;
  exports.parse = parse;
  exports.toCodePoints = toCodePoints;



  var _regex2 = _interopRequireDefault(_regex);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var TypeName = exports.TypeName = 'emoji';
  // Copyright Twitter Inc. Licensed under MIT
  // https://github.com/twitter/twemoji-parser/blob/master/LICENSE.md
  function parse(text, options) {
    var assetType = options && options.assetType ? options.assetType : 'svg';
    var getTwemojiUrl = options && options.buildUrl ? options.buildUrl : function (codepoints, assetType) {
      return assetType === 'png' ? 'https://twemoji.maxcdn.com/2/72x72/' + codepoints + '.png' : 'https://twemoji.maxcdn.com/2/svg/' + codepoints + '.svg';
    };

    var entities = [];

    _regex2.default.lastIndex = 0;
    while (true) {
      var result = _regex2.default.exec(text);
      if (!result) {
        break;
      }

      var emojiText = result[0];
      var codepoints = toCodePoints(removeVS16s(emojiText)).join('-');

      entities.push({
        url: codepoints ? getTwemojiUrl(codepoints, assetType) : '',
        indices: [result.index, _regex2.default.lastIndex],
        text: emojiText,
        type: TypeName
      });
    }
    return entities;
  }

  var vs16RegExp = /\uFE0F/g;
  // avoid using a string literal like '\u200D' here because minifiers expand it inline
  var zeroWidthJoiner = String.fromCharCode(0x200d);

  var removeVS16s = function removeVS16s(rawEmoji) {
    return rawEmoji.indexOf(zeroWidthJoiner) < 0 ? rawEmoji.replace(vs16RegExp, '') : rawEmoji;
  };

  function toCodePoints(unicodeSurrogates) {
    var points = [];
    var char = 0;
    var previous = 0;
    var i = 0;
    while (i < unicodeSurrogates.length) {
      char = unicodeSurrogates.charCodeAt(i++);
      if (previous) {
        points.push((0x10000 + (previous - 0xd800 << 10) + (char - 0xdc00)).toString(16));
        previous = 0;
      } else if (char > 0xd800 && char <= 0xdbff) {
        previous = char;
      } else {
        points.push(char.toString(16));
      }
    }
    return points;
  }
  });

  unwrapExports(dist);
  var dist_1 = dist.TypeName;
  var dist_2 = dist.parse;
  var dist_3 = dist.toCodePoints;

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var urlHasHttps = /^https:\/\//i;

  /**
   * [parseTweet description]
   * @param  {string} text tweet text to parse
   * @param  {Object} options config options to pass
   * @return {Object} Fields in response described below:
   *
   * Response fields:
   * weightedLength {int} the weighted length of tweet based on weights specified in the config
   * valid {bool} If tweet is valid
   * permillage {float} permillage of the tweet over the max length specified in config
   * validRangeStart {int} beginning of valid text
   * validRangeEnd {int} End index of valid part of the tweet text (inclusive) in utf16
   * displayRangeStart {int} beginning index of display text
   * displayRangeEnd {int} end index of display text (inclusive) in utf16
   */

  var parseTweet = function parseTweet() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : configs.defaults;
    var mergedOptions = Object.keys(options).length ? options : configs.defaults;
    var defaultWeight = mergedOptions.defaultWeight,
        emojiParsingEnabled = mergedOptions.emojiParsingEnabled,
        scale = mergedOptions.scale,
        maxWeightedTweetLength = mergedOptions.maxWeightedTweetLength,
        transformedURLLength = mergedOptions.transformedURLLength;
    var normalizedText = typeof String.prototype.normalize === 'function' ? text.normalize() : text; // Hash all entities by their startIndex for fast lookup

    var urlEntitiesMap = transformEntitiesToHash(extractUrlsWithIndices(normalizedText));
    var emojiEntitiesMap = emojiParsingEnabled ? transformEntitiesToHash(dist_2(normalizedText)) : [];
    var tweetLength = normalizedText.length;
    var weightedLength = 0;
    var validDisplayIndex = 0;
    var valid = true; // Go through every character and calculate weight

    for (var charIndex = 0; charIndex < tweetLength; charIndex++) {
      // If a url begins at the specified index handle, add constant length
      if (urlEntitiesMap[charIndex]) {
        var _urlEntitiesMap$charI = urlEntitiesMap[charIndex],
            url = _urlEntitiesMap$charI.url,
            indices = _urlEntitiesMap$charI.indices;
        weightedLength += transformedURLLength * scale;
        charIndex += url.length - 1;
      } else if (emojiParsingEnabled && emojiEntitiesMap[charIndex]) {
        var _emojiEntitiesMap$cha = emojiEntitiesMap[charIndex],
            emoji = _emojiEntitiesMap$cha.text,
            _indices = _emojiEntitiesMap$cha.indices;
        weightedLength += defaultWeight;
        charIndex += emoji.length - 1;
      } else {
        charIndex += isSurrogatePair(normalizedText, charIndex) ? 1 : 0;
        weightedLength += getCharacterWeight(normalizedText.charAt(charIndex), mergedOptions);
      } // Only test for validity of character if it is still valid


      if (valid) {
        valid = !hasInvalidCharacters(normalizedText.substring(charIndex, charIndex + 1));
      }

      if (valid && weightedLength <= maxWeightedTweetLength * scale) {
        validDisplayIndex = charIndex;
      }
    }

    weightedLength = weightedLength / scale;
    valid = valid && weightedLength > 0 && weightedLength <= maxWeightedTweetLength;
    var permillage = Math.floor(weightedLength / maxWeightedTweetLength * 1000);
    var normalizationOffset = text.length - normalizedText.length;
    validDisplayIndex += normalizationOffset;
    return {
      weightedLength: weightedLength,
      valid: valid,
      permillage: permillage,
      validRangeStart: 0,
      validRangeEnd: validDisplayIndex,
      displayRangeStart: 0,
      displayRangeEnd: text.length > 0 ? text.length - 1 : 0
    };
  };

  var transformEntitiesToHash = function transformEntitiesToHash(entities) {
    return entities.reduce(function (map, entity) {
      map[entity.indices[0]] = entity;
      return map;
    }, {});
  };

  var isSurrogatePair = function isSurrogatePair(text, cIndex) {
    // Test if a character is the beginning of a surrogate pair
    if (cIndex < text.length - 1) {
      var c = text.charCodeAt(cIndex);
      var cNext = text.charCodeAt(cIndex + 1);
      return 0xd800 <= c && c <= 0xdbff && 0xdc00 <= cNext && cNext <= 0xdfff;
    }

    return false;
  };

  // Copyright 2018 Twitter, Inc.

  var getTweetLength = function getTweetLength(text) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : configs.defaults;
    return parseTweet(text, options).weightedLength;
  };

  function getUnicodeTextLength (text) {
    return text.replace(nonBmpCodePairs, ' ').length;
  }

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  // this essentially does text.split(/<|>/)
  // except that won't work in IE, where empty strings are ommitted
  // so "<>".split(/<|>/) => [] in IE, but is ["", "", ""] in all others
  // but "<<".split("<") => ["", "", ""]
  function splitTags (text) {
    var firstSplits = text.split('<'),
        secondSplits,
        allSplits = [],
        split;

    for (var i = 0; i < firstSplits.length; i += 1) {
      split = firstSplits[i];

      if (!split) {
        allSplits.push('');
      } else {
        secondSplits = split.split('>');

        for (var j = 0; j < secondSplits.length; j += 1) {
          allSplits.push(secondSplits[j]);
        }
      }
    }

    return allSplits;
  }

  // Copyright 2018 Twitter, Inc.
  function hitHighlight (text, hits, options) {
    var defaultHighlightTag = 'em';
    hits = hits || [];
    options = options || {};

    if (hits.length === 0) {
      return text;
    }

    var tagName = options.tag || defaultHighlightTag,
        tags = ["<".concat(tagName, ">"), "</".concat(tagName, ">")],
        chunks = splitTags(text),
        i,
        j,
        result = '',
        chunkIndex = 0,
        chunk = chunks[0],
        prevChunksLen = 0,
        chunkCursor = 0,
        startInChunk = false,
        chunkChars = chunk,
        flatHits = [],
        index,
        hit,
        tag,
        placed,
        hitSpot;

    for (i = 0; i < hits.length; i += 1) {
      for (j = 0; j < hits[i].length; j += 1) {
        flatHits.push(hits[i][j]);
      }
    }

    for (index = 0; index < flatHits.length; index += 1) {
      hit = flatHits[index];
      tag = tags[index % 2];
      placed = false;

      while (chunk != null && hit >= prevChunksLen + chunk.length) {
        result += chunkChars.slice(chunkCursor);

        if (startInChunk && hit === prevChunksLen + chunkChars.length) {
          result += tag;
          placed = true;
        }

        if (chunks[chunkIndex + 1]) {
          result += "<".concat(chunks[chunkIndex + 1], ">");
        }

        prevChunksLen += chunkChars.length;
        chunkCursor = 0;
        chunkIndex += 2;
        chunk = chunks[chunkIndex];
        chunkChars = chunk;
        startInChunk = false;
      }

      if (!placed && chunk != null) {
        hitSpot = hit - prevChunksLen;
        result += chunkChars.slice(chunkCursor, hitSpot) + tag;
        chunkCursor = hitSpot;

        if (index % 2 === 0) {
          startInChunk = true;
        } else {
          startInChunk = false;
        }
      } else if (!placed) {
        placed = true;
        result += tag;
      }
    }

    if (chunk != null) {
      if (chunkCursor < chunkChars.length) {
        result += chunkChars.slice(chunkCursor);
      }

      for (index = chunkIndex + 1; index < chunks.length; index += 1) {
        result += index % 2 === 0 ? chunks[index] : "<".concat(chunks[index], ">");
      }
    }

    return result;
  }

  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
  $export$1($export$1.S + $export$1.F * !require$$0$4, 'Object', { defineProperty: require$$1$2.f });

  // 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
  $export$1($export$1.S + $export$1.F * !require$$0$4, 'Object', { defineProperties: dPs });

  var f$4 = Object.getOwnPropertySymbols;

  var _objectGops = {
  	f: f$4
  };

  var _objectGops$1 = /*#__PURE__*/Object.freeze({
    default: _objectGops,
    __moduleExports: _objectGops,
    f: f$4
  });

  var gOPS = ( _objectGops$1 && _objectGops ) || _objectGops$1;

  // all object keys, includes non-enumerable and symbols



  var Reflect = require$$0$1.Reflect;
  var _ownKeys = Reflect && Reflect.ownKeys || function ownKeys(it) {
    var keys = require$$0$c.f(anObject(it));
    var getSymbols = gOPS.f;
    return getSymbols ? keys.concat(getSymbols(it)) : keys;
  };

  var _ownKeys$1 = /*#__PURE__*/Object.freeze({
    default: _ownKeys,
    __moduleExports: _ownKeys
  });

  var _createProperty = function (object, index, value) {
    if (index in object) require$$1$2.f(object, index, descriptor(0, value));
    else object[index] = value;
  };

  var _createProperty$1 = /*#__PURE__*/Object.freeze({
    default: _createProperty,
    __moduleExports: _createProperty
  });

  var ownKeys = ( _ownKeys$1 && _ownKeys ) || _ownKeys$1;

  var createProperty = ( _createProperty$1 && _createProperty ) || _createProperty$1;

  // https://github.com/tc39/proposal-object-getownpropertydescriptors






  $export$1($export$1.S, 'Object', {
    getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
      var O = toIObject(object);
      var getDesc = require$$1$3.f;
      var keys = ownKeys(O);
      var result = {};
      var i = 0;
      var key, desc;
      while (keys.length > i) {
        desc = getDesc(O, key = keys[i++]);
        if (desc !== undefined) createProperty(result, key, desc);
      }
      return result;
    }
  });

  var SPECIES$3 = require$$0$3('species');

  var _arraySpeciesConstructor = function (original) {
    var C;
    if (require$$0$d(original)) {
      C = original.constructor;
      // cross-realm fallback
      if (typeof C == 'function' && (C === Array || require$$0$d(C.prototype))) C = undefined;
      if (isObject(C)) {
        C = C[SPECIES$3];
        if (C === null) C = undefined;
      }
    } return C === undefined ? Array : C;
  };

  var _arraySpeciesConstructor$1 = /*#__PURE__*/Object.freeze({
    default: _arraySpeciesConstructor,
    __moduleExports: _arraySpeciesConstructor
  });

  var speciesConstructor$1 = ( _arraySpeciesConstructor$1 && _arraySpeciesConstructor ) || _arraySpeciesConstructor$1;

  // 9.4.2.3 ArraySpeciesCreate(originalArray, length)


  var _arraySpeciesCreate = function (original, length) {
    return new (speciesConstructor$1(original))(length);
  };

  var _arraySpeciesCreate$1 = /*#__PURE__*/Object.freeze({
    default: _arraySpeciesCreate,
    __moduleExports: _arraySpeciesCreate
  });

  var asc = ( _arraySpeciesCreate$1 && _arraySpeciesCreate ) || _arraySpeciesCreate$1;

  // 0 -> Array#forEach
  // 1 -> Array#map
  // 2 -> Array#filter
  // 3 -> Array#some
  // 4 -> Array#every
  // 5 -> Array#find
  // 6 -> Array#findIndex





  var _arrayMethods = function (TYPE, $create) {
    var IS_MAP = TYPE == 1;
    var IS_FILTER = TYPE == 2;
    var IS_SOME = TYPE == 3;
    var IS_EVERY = TYPE == 4;
    var IS_FIND_INDEX = TYPE == 6;
    var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
    var create = $create || asc;
    return function ($this, callbackfn, that) {
      var O = toObject($this);
      var self = IObject(O);
      var f = require$$0$6(callbackfn, that, 3);
      var length = toLength(self.length);
      var index = 0;
      var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
      var val, res;
      for (;length > index; index++) if (NO_HOLES || index in self) {
        val = self[index];
        res = f(val, index, O);
        if (TYPE) {
          if (IS_MAP) result[index] = res;   // map
          else if (res) switch (TYPE) {
            case 3: return true;             // some
            case 5: return val;              // find
            case 6: return index;            // findIndex
            case 2: result.push(val);        // filter
          } else if (IS_EVERY) return false; // every
        }
      }
      return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
    };
  };

  var _arrayMethods$1 = /*#__PURE__*/Object.freeze({
    default: _arrayMethods,
    __moduleExports: _arrayMethods
  });

  var require$$0$f = ( _arrayMethods$1 && _arrayMethods ) || _arrayMethods$1;

  var $forEach = require$$0$f(0);
  var STRICT = require$$0$9([].forEach, true);

  $export$1($export$1.P + $export$1.F * !STRICT, 'Array', {
    // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
    forEach: function forEach(callbackfn /* , thisArg */) {
      return $forEach(this, callbackfn, arguments[1]);
    }
  });

  var $filter = require$$0$f(2);

  $export$1($export$1.P + $export$1.F * !require$$0$9([].filter, true), 'Array', {
    // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
    filter: function filter(callbackfn /* , thisArg */) {
      return $filter(this, callbackfn, arguments[1]);
    }
  });

  var _meta = createCommonjsModule(function (module) {
  var META = uid('meta');


  var setDesc = require$$1$2.f;
  var id = 0;
  var isExtensible = Object.isExtensible || function () {
    return true;
  };
  var FREEZE = !require$$1$1(function () {
    return isExtensible(Object.preventExtensions({}));
  });
  var setMeta = function (it) {
    setDesc(it, META, { value: {
      i: 'O' + ++id, // object ID
      w: {}          // weak collections IDs
    } });
  };
  var fastKey = function (it, create) {
    // return primitive with prefix
    if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
    if (!has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return 'F';
      // not necessary to add metadata
      if (!create) return 'E';
      // add missing metadata
      setMeta(it);
    // return object ID
    } return it[META].i;
  };
  var getWeak = function (it, create) {
    if (!has(it, META)) {
      // can't set metadata to uncaught frozen object
      if (!isExtensible(it)) return true;
      // not necessary to add metadata
      if (!create) return false;
      // add missing metadata
      setMeta(it);
    // return hash weak collections IDs
    } return it[META].w;
  };
  // add metadata on freeze-family methods calling
  var onFreeze = function (it) {
    if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
    return it;
  };
  var meta = module.exports = {
    KEY: META,
    NEED: false,
    fastKey: fastKey,
    getWeak: getWeak,
    onFreeze: onFreeze
  };
  });
  var _meta_1 = _meta.KEY;
  var _meta_2 = _meta.NEED;
  var _meta_3 = _meta.fastKey;
  var _meta_4 = _meta.getWeak;
  var _meta_5 = _meta.onFreeze;

  var _meta$1 = /*#__PURE__*/Object.freeze({
    default: _meta,
    __moduleExports: _meta,
    KEY: _meta_1,
    NEED: _meta_2,
    fastKey: _meta_3,
    getWeak: _meta_4,
    onFreeze: _meta_5
  });

  var f$5 = require$$0$3;

  var _wksExt = {
  	f: f$5
  };

  var _wksExt$1 = /*#__PURE__*/Object.freeze({
    default: _wksExt,
    __moduleExports: _wksExt,
    f: f$5
  });

  var wksExt = ( _wksExt$1 && _wksExt ) || _wksExt$1;

  var defineProperty = require$$1$2.f;
  var _wksDefine = function (name) {
    var $Symbol = require$$1.Symbol || (require$$1.Symbol = LIBRARY ? {} : require$$0$1.Symbol || {});
    if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
  };

  var _wksDefine$1 = /*#__PURE__*/Object.freeze({
    default: _wksDefine,
    __moduleExports: _wksDefine
  });

  // all enumerable object keys, includes symbols



  var _enumKeys = function (it) {
    var result = getKeys(it);
    var getSymbols = gOPS.f;
    if (getSymbols) {
      var symbols = getSymbols(it);
      var isEnum = pIE.f;
      var i = 0;
      var key;
      while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
    } return result;
  };

  var _enumKeys$1 = /*#__PURE__*/Object.freeze({
    default: _enumKeys,
    __moduleExports: _enumKeys
  });

  // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

  var gOPN$1 = require$$0$c.f;
  var toString$1 = {}.toString;

  var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
    ? Object.getOwnPropertyNames(window) : [];

  var getWindowNames = function (it) {
    try {
      return gOPN$1(it);
    } catch (e) {
      return windowNames.slice();
    }
  };

  var f$6 = function getOwnPropertyNames(it) {
    return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN$1(toIObject(it));
  };

  var _objectGopnExt = {
  	f: f$6
  };

  var _objectGopnExt$1 = /*#__PURE__*/Object.freeze({
    default: _objectGopnExt,
    __moduleExports: _objectGopnExt,
    f: f$6
  });

  var require$$0$g = ( _meta$1 && _meta ) || _meta$1;

  var wksDefine = ( _wksDefine$1 && _wksDefine ) || _wksDefine$1;

  var enumKeys = ( _enumKeys$1 && _enumKeys ) || _enumKeys$1;

  var gOPNExt = ( _objectGopnExt$1 && _objectGopnExt ) || _objectGopnExt$1;

  // ECMAScript 6 symbols shim





  var META = require$$0$g.KEY;





















  var gOPD$1 = require$$1$3.f;
  var dP$2 = require$$1$2.f;
  var gOPN$2 = gOPNExt.f;
  var $Symbol = require$$0$1.Symbol;
  var $JSON = require$$0$1.JSON;
  var _stringify = $JSON && $JSON.stringify;
  var PROTOTYPE$2 = 'prototype';
  var HIDDEN = require$$0$3('_hidden');
  var TO_PRIMITIVE = require$$0$3('toPrimitive');
  var isEnum = {}.propertyIsEnumerable;
  var SymbolRegistry = require$$0$2('symbol-registry');
  var AllSymbols = require$$0$2('symbols');
  var OPSymbols = require$$0$2('op-symbols');
  var ObjectProto$1 = Object[PROTOTYPE$2];
  var USE_NATIVE = typeof $Symbol == 'function' && !!gOPS.f;
  var QObject = require$$0$1.QObject;
  // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
  var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

  // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
  var setSymbolDesc = require$$0$4 && require$$1$1(function () {
    return create(dP$2({}, 'a', {
      get: function () { return dP$2(this, 'a', { value: 7 }).a; }
    })).a != 7;
  }) ? function (it, key, D) {
    var protoDesc = gOPD$1(ObjectProto$1, key);
    if (protoDesc) delete ObjectProto$1[key];
    dP$2(it, key, D);
    if (protoDesc && it !== ObjectProto$1) dP$2(ObjectProto$1, key, protoDesc);
  } : dP$2;

  var wrap = function (tag) {
    var sym = AllSymbols[tag] = create($Symbol[PROTOTYPE$2]);
    sym._k = tag;
    return sym;
  };

  var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    return it instanceof $Symbol;
  };

  var $defineProperty = function defineProperty(it, key, D) {
    if (it === ObjectProto$1) $defineProperty(OPSymbols, key, D);
    anObject(it);
    key = toPrimitive(key, true);
    anObject(D);
    if (has(AllSymbols, key)) {
      if (!D.enumerable) {
        if (!has(it, HIDDEN)) dP$2(it, HIDDEN, descriptor(1, {}));
        it[HIDDEN][key] = true;
      } else {
        if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
        D = create(D, { enumerable: descriptor(0, false) });
      } return setSymbolDesc(it, key, D);
    } return dP$2(it, key, D);
  };
  var $defineProperties = function defineProperties(it, P) {
    anObject(it);
    var keys = enumKeys(P = toIObject(P));
    var i = 0;
    var l = keys.length;
    var key;
    while (l > i) $defineProperty(it, key = keys[i++], P[key]);
    return it;
  };
  var $create = function create$1(it, P) {
    return P === undefined ? create(it) : $defineProperties(create(it), P);
  };
  var $propertyIsEnumerable = function propertyIsEnumerable(key) {
    var E = isEnum.call(this, key = toPrimitive(key, true));
    if (this === ObjectProto$1 && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
    return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
  };
  var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
    it = toIObject(it);
    key = toPrimitive(key, true);
    if (it === ObjectProto$1 && has(AllSymbols, key) && !has(OPSymbols, key)) return;
    var D = gOPD$1(it, key);
    if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
    return D;
  };
  var $getOwnPropertyNames = function getOwnPropertyNames(it) {
    var names = gOPN$2(toIObject(it));
    var result = [];
    var i = 0;
    var key;
    while (names.length > i) {
      if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
    } return result;
  };
  var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
    var IS_OP = it === ObjectProto$1;
    var names = gOPN$2(IS_OP ? OPSymbols : toIObject(it));
    var result = [];
    var i = 0;
    var key;
    while (names.length > i) {
      if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
    } return result;
  };

  // 19.4.1.1 Symbol([description])
  if (!USE_NATIVE) {
    $Symbol = function Symbol() {
      if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
      var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
      var $set = function (value) {
        if (this === ObjectProto$1) $set.call(OPSymbols, value);
        if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
        setSymbolDesc(this, tag, descriptor(1, value));
      };
      if (require$$0$4 && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });
      return wrap(tag);
    };
    redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
      return this._k;
    });

    require$$1$3.f = $getOwnPropertyDescriptor;
    require$$1$2.f = $defineProperty;
    require$$0$c.f = gOPNExt.f = $getOwnPropertyNames;
    pIE.f = $propertyIsEnumerable;
    gOPS.f = $getOwnPropertySymbols;

    if (require$$0$4 && !LIBRARY) {
      redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
    }

    wksExt.f = function (name) {
      return wrap(require$$0$3(name));
    };
  }

  $export$1($export$1.G + $export$1.W + $export$1.F * !USE_NATIVE, { Symbol: $Symbol });

  for (var es6Symbols = (
    // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
    'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
  ).split(','), j = 0; es6Symbols.length > j;)require$$0$3(es6Symbols[j++]);

  for (var wellKnownSymbols = getKeys(require$$0$3.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

  $export$1($export$1.S + $export$1.F * !USE_NATIVE, 'Symbol', {
    // 19.4.2.1 Symbol.for(key)
    'for': function (key) {
      return has(SymbolRegistry, key += '')
        ? SymbolRegistry[key]
        : SymbolRegistry[key] = $Symbol(key);
    },
    // 19.4.2.5 Symbol.keyFor(sym)
    keyFor: function keyFor(sym) {
      if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
      for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
    },
    useSetter: function () { setter = true; },
    useSimple: function () { setter = false; }
  });

  $export$1($export$1.S + $export$1.F * !USE_NATIVE, 'Object', {
    // 19.1.2.2 Object.create(O [, Properties])
    create: $create,
    // 19.1.2.4 Object.defineProperty(O, P, Attributes)
    defineProperty: $defineProperty,
    // 19.1.2.3 Object.defineProperties(O, Properties)
    defineProperties: $defineProperties,
    // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
    getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
    // 19.1.2.7 Object.getOwnPropertyNames(O)
    getOwnPropertyNames: $getOwnPropertyNames,
    // 19.1.2.8 Object.getOwnPropertySymbols(O)
    getOwnPropertySymbols: $getOwnPropertySymbols
  });

  // Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
  // https://bugs.chromium.org/p/v8/issues/detail?id=3443
  var FAILS_ON_PRIMITIVES = require$$1$1(function () { gOPS.f(1); });

  $export$1($export$1.S + $export$1.F * FAILS_ON_PRIMITIVES, 'Object', {
    getOwnPropertySymbols: function getOwnPropertySymbols(it) {
      return gOPS.f(toObject(it));
    }
  });

  // 24.3.2 JSON.stringify(value [, replacer [, space]])
  $JSON && $export$1($export$1.S + $export$1.F * (!USE_NATIVE || require$$1$1(function () {
    var S = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    // WebKit converts symbol values to JSON as null
    // V8 throws on boxed symbols
    return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
  })), 'JSON', {
    stringify: function stringify(it) {
      var args = [it];
      var i = 1;
      var replacer, $replacer;
      while (arguments.length > i) args.push(arguments[i++]);
      $replacer = replacer = args[1];
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!require$$0$d(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return _stringify.apply($JSON, args);
    }
  });

  // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
  $Symbol[PROTOTYPE$2][TO_PRIMITIVE] || require$$0$5($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
  // 19.4.3.5 Symbol.prototype[@@toStringTag]
  setToStringTag($Symbol, 'Symbol');
  // 20.2.1.9 Math[@@toStringTag]
  setToStringTag(Math, 'Math', true);
  // 24.3.3 JSON[@@toStringTag]
  setToStringTag(require$$0$1.JSON, 'JSON', true);

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty$1 = _defineProperty;

  function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(source, true).forEach(function (key) { defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  function isInvalidTweet (text) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : configs.defaults;

    if (!text) {
      return 'empty';
    }

    var mergedOptions = _objectSpread({}, configs.defaults, {}, options);

    var maxLength = mergedOptions.maxWeightedTweetLength; // Determine max length independent of URL length

    if (getTweetLength(text, mergedOptions) > maxLength) {
      return 'too_long';
    }

    if (hasInvalidCharacters(text)) {
      return 'invalid_characters';
    }

    return false;
  }

  // Copyright 2018 Twitter, Inc.
  function isValidHashtag (hashtag) {
    if (!hashtag) {
      return false;
    }

    var extracted = extractHashtags(hashtag); // Should extract the hashtag minus the # sign, hence the .slice(1)

    return extracted.length === 1 && extracted[0] === hashtag.slice(1);
  }

  var VALID_LIST_RE = regexSupplant(/^#{validMentionOrList}$/, {
    validMentionOrList: validMentionOrList
  });
  function isValidList (usernameList) {
    var match = usernameList.match(VALID_LIST_RE); // Must have matched and had nothing before or after

    return !!(match && match[1] == '' && match[4]);
  }

  // Copyright 2018 Twitter, Inc.
  function isValidTweetText (text, options) {
    return !isInvalidTweet(text, options);
  }

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var validateUrlUnreserved = /[a-z\u0400-\u04FF0-9\-._~]/i;

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var validateUrlPctEncoded = /(?:%[0-9a-f]{2})/i;

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var validateUrlSubDelims = /[!$&'()*+,;=]/i;

  // Copyright 2018 Twitter, Inc.
  var validateUrlUserinfo = regexSupplant('(?:' + '#{validateUrlUnreserved}|' + '#{validateUrlPctEncoded}|' + '#{validateUrlSubDelims}|' + ':' + ')*', {
    validateUrlUnreserved: validateUrlUnreserved,
    validateUrlPctEncoded: validateUrlPctEncoded,
    validateUrlSubDelims: validateUrlSubDelims
  }, 'i');

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var validateUrlDomainSegment = /(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?)/i;

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var validateUrlDomainTld = /(?:[a-z](?:[a-z0-9\-]*[a-z0-9])?)/i;

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var validateUrlSubDomainSegment = /(?:[a-z0-9](?:[a-z0-9_\-]*[a-z0-9])?)/i;

  // Copyright 2018 Twitter, Inc.
  var validateUrlDomain = regexSupplant(/(?:(?:#{validateUrlSubDomainSegment}\.)*(?:#{validateUrlDomainSegment}\.)#{validateUrlDomainTld})/i, {
    validateUrlSubDomainSegment: validateUrlSubDomainSegment,
    validateUrlDomainSegment: validateUrlDomainSegment,
    validateUrlDomainTld: validateUrlDomainTld
  });

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var validateUrlDecOctet = /(?:[0-9]|(?:[1-9][0-9])|(?:1[0-9]{2})|(?:2[0-4][0-9])|(?:25[0-5]))/i;

  // Copyright 2018 Twitter, Inc.
  var validateUrlIpv4 = regexSupplant(/(?:#{validateUrlDecOctet}(?:\.#{validateUrlDecOctet}){3})/i, {
    validateUrlDecOctet: validateUrlDecOctet
  });

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  // Punting on real IPv6 validation for now
  var validateUrlIpv6 = /(?:\[[a-f0-9:\.]+\])/i;

  // Copyright 2018 Twitter, Inc.

  var validateUrlIp = regexSupplant('(?:' + '#{validateUrlIpv4}|' + '#{validateUrlIpv6}' + ')', {
    validateUrlIpv4: validateUrlIpv4,
    validateUrlIpv6: validateUrlIpv6
  }, 'i');

  // Copyright 2018 Twitter, Inc.
  var validateUrlHost = regexSupplant('(?:' + '#{validateUrlIp}|' + '#{validateUrlDomain}' + ')', {
    validateUrlIp: validateUrlIp,
    validateUrlDomain: validateUrlDomain
  }, 'i');

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var validateUrlPort = /[0-9]{1,5}/;

  // Copyright 2018 Twitter, Inc.
  var validateUrlAuthority = regexSupplant( // $1 userinfo
  '(?:(#{validateUrlUserinfo})@)?' + // $2 host
  '(#{validateUrlHost})' + // $3 port
  '(?::(#{validateUrlPort}))?', {
    validateUrlUserinfo: validateUrlUserinfo,
    validateUrlHost: validateUrlHost,
    validateUrlPort: validateUrlPort
  }, 'i');

  // Copyright 2018 Twitter, Inc.

  var validateUrlPchar = regexSupplant('(?:' + '#{validateUrlUnreserved}|' + '#{validateUrlPctEncoded}|' + '#{validateUrlSubDelims}|' + '[:|@]' + ')', {
    validateUrlUnreserved: validateUrlUnreserved,
    validateUrlPctEncoded: validateUrlPctEncoded,
    validateUrlSubDelims: validateUrlSubDelims
  }, 'i');

  // Copyright 2018 Twitter, Inc.
  var validateUrlFragment = regexSupplant(/(#{validateUrlPchar}|\/|\?)*/i, {
    validateUrlPchar: validateUrlPchar
  });

  // Copyright 2018 Twitter, Inc.
  var validateUrlPath = regexSupplant(/(\/#{validateUrlPchar}*)*/i, {
    validateUrlPchar: validateUrlPchar
  });

  // Copyright 2018 Twitter, Inc.
  var validateUrlQuery = regexSupplant(/(#{validateUrlPchar}|\/|\?)*/i, {
    validateUrlPchar: validateUrlPchar
  });

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var validateUrlScheme = /(?:[a-z][a-z0-9+\-.]*)/i;

  // Copyright 2018 Twitter, Inc.

  var validateUrlUnencoded = regexSupplant('^' + // Full URL
  '(?:' + '([^:/?#]+):\\/\\/' + // $1 Scheme
  ')?' + '([^/?#]*)' + // $2 Authority
  '([^?#]*)' + // $3 Path
  '(?:' + '\\?([^#]*)' + // $4 Query
  ')?' + '(?:' + '#(.*)' + // $5 Fragment
  ')?$', 'i');

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var validateUrlUnicodeSubDomainSegment = /(?:(?:[a-z0-9]|[^\u0000-\u007f])(?:(?:[a-z0-9_\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  var validateUrlUnicodeDomainSegment = /(?:(?:[a-z0-9]|[^\u0000-\u007f])(?:(?:[a-z0-9\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;

  // Copyright 2018 Twitter, Inc.
  // Licensed under the Apache License, Version 2.0
  // http://www.apache.org/licenses/LICENSE-2.0
  // Unencoded internationalized domains - this doesn't check for invalid UTF-8 sequences
  var validateUrlUnicodeDomainTld = /(?:(?:[a-z]|[^\u0000-\u007f])(?:(?:[a-z0-9\-]|[^\u0000-\u007f])*(?:[a-z0-9]|[^\u0000-\u007f]))?)/i;

  // Copyright 2018 Twitter, Inc.

  var validateUrlUnicodeDomain = regexSupplant(/(?:(?:#{validateUrlUnicodeSubDomainSegment}\.)*(?:#{validateUrlUnicodeDomainSegment}\.)#{validateUrlUnicodeDomainTld})/i, {
    validateUrlUnicodeSubDomainSegment: validateUrlUnicodeSubDomainSegment,
    validateUrlUnicodeDomainSegment: validateUrlUnicodeDomainSegment,
    validateUrlUnicodeDomainTld: validateUrlUnicodeDomainTld
  });

  // Copyright 2018 Twitter, Inc.
  var validateUrlUnicodeHost = regexSupplant('(?:' + '#{validateUrlIp}|' + '#{validateUrlUnicodeDomain}' + ')', {
    validateUrlIp: validateUrlIp,
    validateUrlUnicodeDomain: validateUrlUnicodeDomain
  }, 'i');

  // Copyright 2018 Twitter, Inc.
  var validateUrlUnicodeAuthority = regexSupplant( // $1 userinfo
  '(?:(#{validateUrlUserinfo})@)?' + // $2 host
  '(#{validateUrlUnicodeHost})' + // $3 port
  '(?::(#{validateUrlPort}))?', {
    validateUrlUserinfo: validateUrlUserinfo,
    validateUrlUnicodeHost: validateUrlUnicodeHost,
    validateUrlPort: validateUrlPort
  }, 'i');

  function isValidMatch(string, regex, optional) {
    if (!optional) {
      // RegExp["$&"] is the text of the last match
      // blank strings are ok, but are falsy, so we check stringiness instead of truthiness
      return typeof string === 'string' && string.match(regex) && RegExp['$&'] === string;
    } // RegExp["$&"] is the text of the last match


    return !string || string.match(regex) && RegExp['$&'] === string;
  }

  function isValidUrl$1 (url, unicodeDomains, requireProtocol) {
    if (unicodeDomains == null) {
      unicodeDomains = true;
    }

    if (requireProtocol == null) {
      requireProtocol = true;
    }

    if (!url) {
      return false;
    }

    var urlParts = url.match(validateUrlUnencoded);

    if (!urlParts || urlParts[0] !== url) {
      return false;
    }

    var scheme = urlParts[1],
        authority = urlParts[2],
        path = urlParts[3],
        query = urlParts[4],
        fragment = urlParts[5];

    if (!((!requireProtocol || isValidMatch(scheme, validateUrlScheme) && scheme.match(/^https?$/i)) && isValidMatch(path, validateUrlPath) && isValidMatch(query, validateUrlQuery, true) && isValidMatch(fragment, validateUrlFragment, true))) {
      return false;
    }

    return unicodeDomains && isValidMatch(authority, validateUrlUnicodeAuthority) || !unicodeDomains && isValidMatch(authority, validateUrlAuthority);
  }

  // Copyright 2018 Twitter, Inc.
  function isValidUsername (username) {
    if (!username) {
      return false;
    }

    var extracted = extractMentions(username); // Should extract the username minus the @ sign, hence the .slice(1)

    return extracted.length === 1 && extracted[0] === username.slice(1);
  }

  // Copyright 2018 Twitter, Inc.
  var regexen = {
    astralLetterAndMarks: astralLetterAndMarks,
    astralNumerals: astralNumerals,
    atSigns: atSigns,
    bmpLetterAndMarks: bmpLetterAndMarks,
    bmpNumerals: bmpNumerals,
    cashtag: cashtag,
    codePoint: codePoint,
    cyrillicLettersAndMarks: cyrillicLettersAndMarks,
    endHashtagMatch: endHashtagMatch,
    endMentionMatch: endMentionMatch,
    extractUrl: extractUrl,
    hashSigns: hashSigns,
    hashtagAlpha: hashtagAlpha,
    hashtagAlphaNumeric: hashtagAlphaNumeric,
    hashtagBoundary: hashtagBoundary,
    hashtagSpecialChars: hashtagSpecialChars,
    invalidChars: invalidChars,
    invalidCharsGroup: invalidCharsGroup,
    invalidDomainChars: invalidDomainChars,
    invalidUrlWithoutProtocolPrecedingChars: invalidUrlWithoutProtocolPrecedingChars,
    latinAccentChars: latinAccentChars,
    nonBmpCodePairs: nonBmpCodePairs,
    punct: punct,
    rtlChars: rtlChars,
    spaces: spaces,
    spacesGroup: spacesGroup,
    urlHasHttps: urlHasHttps,
    urlHasProtocol: urlHasProtocol,
    validAsciiDomain: validAsciiDomain,
    validateUrlAuthority: validateUrlAuthority,
    validateUrlDecOctet: validateUrlDecOctet,
    validateUrlDomain: validateUrlDomain,
    validateUrlDomainSegment: validateUrlDomainSegment,
    validateUrlDomainTld: validateUrlDomainTld,
    validateUrlFragment: validateUrlFragment,
    validateUrlHost: validateUrlHost,
    validateUrlIp: validateUrlIp,
    validateUrlIpv4: validateUrlIpv4,
    validateUrlIpv6: validateUrlIpv6,
    validateUrlPath: validateUrlPath,
    validateUrlPchar: validateUrlPchar,
    validateUrlPctEncoded: validateUrlPctEncoded,
    validateUrlPort: validateUrlPort,
    validateUrlQuery: validateUrlQuery,
    validateUrlScheme: validateUrlScheme,
    validateUrlSubDelims: validateUrlSubDelims,
    validateUrlSubDomainSegment: validateUrlSubDomainSegment,
    validateUrlUnencoded: validateUrlUnencoded,
    validateUrlUnicodeAuthority: validateUrlUnicodeAuthority,
    validateUrlUnicodeDomain: validateUrlUnicodeDomain,
    validateUrlUnicodeDomainSegment: validateUrlUnicodeDomainSegment,
    validateUrlUnicodeDomainTld: validateUrlUnicodeDomainTld,
    validateUrlUnicodeHost: validateUrlUnicodeHost,
    validateUrlUnicodeSubDomainSegment: validateUrlUnicodeSubDomainSegment,
    validateUrlUnreserved: validateUrlUnreserved,
    validateUrlUserinfo: validateUrlUserinfo,
    validCashtag: validCashtag,
    validCCTLD: validCCTLD,
    validDomain: validDomain,
    validDomainChars: validDomainChars,
    validDomainName: validDomainName,
    validGeneralUrlPathChars: validGeneralUrlPathChars,
    validGTLD: validGTLD,
    validHashtag: validHashtag,
    validMentionOrList: validMentionOrList,
    validMentionPrecedingChars: validMentionPrecedingChars,
    validPortNumber: validPortNumber,
    validPunycode: validPunycode,
    validReply: validReply,
    validSubdomain: validSubdomain,
    validTcoUrl: validTcoUrl,
    validUrlBalancedParens: validUrlBalancedParens,
    validUrlPath: validUrlPath,
    validUrlPathEndingChars: validUrlPathEndingChars,
    validUrlPrecedingChars: validUrlPrecedingChars,
    validUrlQueryChars: validUrlQueryChars,
    validUrlQueryEndingChars: validUrlQueryEndingChars
  };

  var $at = require$$0(true);

  // 21.1.3.27 String.prototype[@@iterator]()
  require$$1$4(String, 'String', function (iterated) {
    this._t = String(iterated); // target
    this._i = 0;                // next index
  // 21.1.5.2.1 %StringIteratorPrototype%.next()
  }, function () {
    var O = this._t;
    var index = this._i;
    var point;
    if (index >= O.length) return { value: undefined, done: true };
    point = $at(O, index);
    this._i += point.length;
    return { value: point, done: false };
  });

  // call something on iterator step with safe closing on error

  var _iterCall = function (iterator, fn, value, entries) {
    try {
      return entries ? fn(anObject(value)[0], value[1]) : fn(value);
    // 7.4.6 IteratorClose(iterator, completion)
    } catch (e) {
      var ret = iterator['return'];
      if (ret !== undefined) anObject(ret.call(iterator));
      throw e;
    }
  };

  var _iterCall$1 = /*#__PURE__*/Object.freeze({
    default: _iterCall,
    __moduleExports: _iterCall
  });

  // check on default Array iterator

  var ITERATOR$2 = require$$0$3('iterator');
  var ArrayProto$1 = Array.prototype;

  var _isArrayIter = function (it) {
    return it !== undefined && (Iterators.Array === it || ArrayProto$1[ITERATOR$2] === it);
  };

  var _isArrayIter$1 = /*#__PURE__*/Object.freeze({
    default: _isArrayIter,
    __moduleExports: _isArrayIter
  });

  var ITERATOR$3 = require$$0$3('iterator');

  var core_getIteratorMethod = require$$1.getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR$3]
      || it['@@iterator']
      || Iterators[classof(it)];
  };

  var core_getIteratorMethod$1 = /*#__PURE__*/Object.freeze({
    default: core_getIteratorMethod,
    __moduleExports: core_getIteratorMethod
  });

  var ITERATOR$4 = require$$0$3('iterator');
  var SAFE_CLOSING = false;

  try {
    var riter = [7][ITERATOR$4]();
    riter['return'] = function () { SAFE_CLOSING = true; };
  } catch (e) { /* empty */ }

  var _iterDetect = function (exec, skipClosing) {
    if (!skipClosing && !SAFE_CLOSING) return false;
    var safe = false;
    try {
      var arr = [7];
      var iter = arr[ITERATOR$4]();
      iter.next = function () { return { done: safe = true }; };
      arr[ITERATOR$4] = function () { return iter; };
      exec(arr);
    } catch (e) { /* empty */ }
    return safe;
  };

  var _iterDetect$1 = /*#__PURE__*/Object.freeze({
    default: _iterDetect,
    __moduleExports: _iterDetect
  });

  var call = ( _iterCall$1 && _iterCall ) || _iterCall$1;

  var isArrayIter = ( _isArrayIter$1 && _isArrayIter ) || _isArrayIter$1;

  var getIterFn = ( core_getIteratorMethod$1 && core_getIteratorMethod ) || core_getIteratorMethod$1;

  var require$$0$h = ( _iterDetect$1 && _iterDetect ) || _iterDetect$1;

  $export$1($export$1.S + $export$1.F * !require$$0$h(function (iter) { }), 'Array', {
    // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
    from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
      var O = toObject(arrayLike);
      var C = typeof this == 'function' ? this : Array;
      var aLen = arguments.length;
      var mapfn = aLen > 1 ? arguments[1] : undefined;
      var mapping = mapfn !== undefined;
      var index = 0;
      var iterFn = getIterFn(O);
      var length, result, step, iterator;
      if (mapping) mapfn = require$$0$6(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
      // if object isn't iterable or it's array with default iterator - use simple case
      if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
        for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
          createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
        }
      } else {
        length = toLength(O.length);
        for (result = new C(length); length > index; index++) {
          createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
        }
      }
      result.length = index;
      return result;
    }
  });

  function standardizeIndices(text, startIndex, endIndex) {
    var totalUnicodeTextLength = getUnicodeTextLength(text);
    var encodingDiff = text.length - totalUnicodeTextLength;

    if (encodingDiff > 0) {
      // split the string into codepoints which will map to the API's indices
      var byCodePair = Array.from(text);
      var beforeText = startIndex === 0 ? '' : byCodePair.slice(0, startIndex).join('');
      var actualText = byCodePair.slice(startIndex, endIndex).join('');
      return [beforeText.length, beforeText.length + actualText.length];
    }

    return [startIndex, endIndex];
  }

  // Copyright 2018 Twitter, Inc.
  var index = {
    autoLink: autoLink,
    autoLinkCashtags: autoLinkCashtags,
    autoLinkEntities: autoLinkEntities,
    autoLinkHashtags: autoLinkHashtags,
    autoLinkUrlsCustom: autoLinkUrlsCustom,
    autoLinkUsernamesOrLists: autoLinkUsernamesOrLists,
    autoLinkWithJSON: autoLinkWithJSON,
    configs: configs,
    convertUnicodeIndices: convertUnicodeIndices$1,
    extractCashtags: extractCashtags,
    extractCashtagsWithIndices: extractCashtagsWithIndices,
    extractEntitiesWithIndices: extractEntitiesWithIndices,
    extractHashtags: extractHashtags,
    extractHashtagsWithIndices: extractHashtagsWithIndices,
    extractHtmlAttrsFromOptions: extractHtmlAttrsFromOptions,
    extractMentions: extractMentions,
    extractMentionsOrListsWithIndices: extractMentionsOrListsWithIndices,
    extractMentionsWithIndices: extractMentionsWithIndices,
    extractReplies: extractReplies,
    extractUrls: extractUrls,
    extractUrlsWithIndices: extractUrlsWithIndices,
    getTweetLength: getTweetLength,
    getUnicodeTextLength: getUnicodeTextLength,
    hasInvalidCharacters: hasInvalidCharacters,
    hitHighlight: hitHighlight,
    htmlEscape: htmlEscape,
    isInvalidTweet: isInvalidTweet,
    isValidHashtag: isValidHashtag,
    isValidList: isValidList,
    isValidTweetText: isValidTweetText,
    isValidUrl: isValidUrl$1,
    isValidUsername: isValidUsername,
    linkTextWithEntity: linkTextWithEntity,
    linkToCashtag: linkToCashtag,
    linkToHashtag: linkToHashtag,
    linkToMentionAndList: linkToMentionAndList,
    linkToText: linkToText,
    linkToTextWithSymbol: linkToTextWithSymbol,
    linkToUrl: linkToUrl,
    modifyIndicesFromUTF16ToUnicode: modifyIndicesFromUTF16ToUnicode,
    modifyIndicesFromUnicodeToUTF16: modifyIndicesFromUnicodeToUTF16,
    regexen: regexen,
    removeOverlappingEntities: removeOverlappingEntities,
    parseTweet: parseTweet,
    splitTags: splitTags,
    standardizeIndices: standardizeIndices,
    tagAttrs: tagAttrs
  };

  return index;

}));
