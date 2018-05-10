// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({13:[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};
},{}],3:[function(require,module,exports) {
var process = require("process");
var global = (1,eval)("this");
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
	'use strict';

	function F2(fun) {
		function wrapper(a) {
			return function (b) {
				return fun(a, b);
			};
		}
		wrapper.arity = 2;
		wrapper.func = fun;
		return wrapper;
	}

	function F3(fun) {
		function wrapper(a) {
			return function (b) {
				return function (c) {
					return fun(a, b, c);
				};
			};
		}
		wrapper.arity = 3;
		wrapper.func = fun;
		return wrapper;
	}

	function F4(fun) {
		function wrapper(a) {
			return function (b) {
				return function (c) {
					return function (d) {
						return fun(a, b, c, d);
					};
				};
			};
		}
		wrapper.arity = 4;
		wrapper.func = fun;
		return wrapper;
	}

	function F5(fun) {
		function wrapper(a) {
			return function (b) {
				return function (c) {
					return function (d) {
						return function (e) {
							return fun(a, b, c, d, e);
						};
					};
				};
			};
		}
		wrapper.arity = 5;
		wrapper.func = fun;
		return wrapper;
	}

	function F6(fun) {
		function wrapper(a) {
			return function (b) {
				return function (c) {
					return function (d) {
						return function (e) {
							return function (f) {
								return fun(a, b, c, d, e, f);
							};
						};
					};
				};
			};
		}
		wrapper.arity = 6;
		wrapper.func = fun;
		return wrapper;
	}

	function F7(fun) {
		function wrapper(a) {
			return function (b) {
				return function (c) {
					return function (d) {
						return function (e) {
							return function (f) {
								return function (g) {
									return fun(a, b, c, d, e, f, g);
								};
							};
						};
					};
				};
			};
		}
		wrapper.arity = 7;
		wrapper.func = fun;
		return wrapper;
	}

	function F8(fun) {
		function wrapper(a) {
			return function (b) {
				return function (c) {
					return function (d) {
						return function (e) {
							return function (f) {
								return function (g) {
									return function (h) {
										return fun(a, b, c, d, e, f, g, h);
									};
								};
							};
						};
					};
				};
			};
		}
		wrapper.arity = 8;
		wrapper.func = fun;
		return wrapper;
	}

	function F9(fun) {
		function wrapper(a) {
			return function (b) {
				return function (c) {
					return function (d) {
						return function (e) {
							return function (f) {
								return function (g) {
									return function (h) {
										return function (i) {
											return fun(a, b, c, d, e, f, g, h, i);
										};
									};
								};
							};
						};
					};
				};
			};
		}
		wrapper.arity = 9;
		wrapper.func = fun;
		return wrapper;
	}

	function A2(fun, a, b) {
		return fun.arity === 2 ? fun.func(a, b) : fun(a)(b);
	}
	function A3(fun, a, b, c) {
		return fun.arity === 3 ? fun.func(a, b, c) : fun(a)(b)(c);
	}
	function A4(fun, a, b, c, d) {
		return fun.arity === 4 ? fun.func(a, b, c, d) : fun(a)(b)(c)(d);
	}
	function A5(fun, a, b, c, d, e) {
		return fun.arity === 5 ? fun.func(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
	}
	function A6(fun, a, b, c, d, e, f) {
		return fun.arity === 6 ? fun.func(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
	}
	function A7(fun, a, b, c, d, e, f, g) {
		return fun.arity === 7 ? fun.func(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
	}
	function A8(fun, a, b, c, d, e, f, g, h) {
		return fun.arity === 8 ? fun.func(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
	}
	function A9(fun, a, b, c, d, e, f, g, h, i) {
		return fun.arity === 9 ? fun.func(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
	}

	var _elm_lang$lazy$Native_Lazy = function () {

		function memoize(thunk) {
			var value;
			var isForced = false;
			return function (tuple0) {
				if (!isForced) {
					value = thunk(tuple0);
					isForced = true;
				}
				return value;
			};
		}

		return {
			memoize: memoize
		};
	}();

	//import Native.Utils //

	var _elm_lang$core$Native_Basics = function () {

		function div(a, b) {
			return a / b | 0;
		}
		function rem(a, b) {
			return a % b;
		}
		function mod(a, b) {
			if (b === 0) {
				throw new Error('Cannot perform mod 0. Division by zero error.');
			}
			var r = a % b;
			var m = a === 0 ? 0 : b > 0 ? a >= 0 ? r : r + b : -mod(-a, -b);

			return m === b ? 0 : m;
		}
		function logBase(base, n) {
			return Math.log(n) / Math.log(base);
		}
		function negate(n) {
			return -n;
		}
		function abs(n) {
			return n < 0 ? -n : n;
		}

		function min(a, b) {
			return _elm_lang$core$Native_Utils.cmp(a, b) < 0 ? a : b;
		}
		function max(a, b) {
			return _elm_lang$core$Native_Utils.cmp(a, b) > 0 ? a : b;
		}
		function clamp(lo, hi, n) {
			return _elm_lang$core$Native_Utils.cmp(n, lo) < 0 ? lo : _elm_lang$core$Native_Utils.cmp(n, hi) > 0 ? hi : n;
		}

		var ord = ['LT', 'EQ', 'GT'];

		function compare(x, y) {
			return { ctor: ord[_elm_lang$core$Native_Utils.cmp(x, y) + 1] };
		}

		function xor(a, b) {
			return a !== b;
		}
		function not(b) {
			return !b;
		}
		function isInfinite(n) {
			return n === Infinity || n === -Infinity;
		}

		function truncate(n) {
			return n | 0;
		}

		function degrees(d) {
			return d * Math.PI / 180;
		}
		function turns(t) {
			return 2 * Math.PI * t;
		}
		function fromPolar(point) {
			var r = point._0;
			var t = point._1;
			return _elm_lang$core$Native_Utils.Tuple2(r * Math.cos(t), r * Math.sin(t));
		}
		function toPolar(point) {
			var x = point._0;
			var y = point._1;
			return _elm_lang$core$Native_Utils.Tuple2(Math.sqrt(x * x + y * y), Math.atan2(y, x));
		}

		return {
			div: F2(div),
			rem: F2(rem),
			mod: F2(mod),

			pi: Math.PI,
			e: Math.E,
			cos: Math.cos,
			sin: Math.sin,
			tan: Math.tan,
			acos: Math.acos,
			asin: Math.asin,
			atan: Math.atan,
			atan2: F2(Math.atan2),

			degrees: degrees,
			turns: turns,
			fromPolar: fromPolar,
			toPolar: toPolar,

			sqrt: Math.sqrt,
			logBase: F2(logBase),
			negate: negate,
			abs: abs,
			min: F2(min),
			max: F2(max),
			clamp: F3(clamp),
			compare: F2(compare),

			xor: F2(xor),
			not: not,

			truncate: truncate,
			ceiling: Math.ceil,
			floor: Math.floor,
			round: Math.round,
			toFloat: function toFloat(x) {
				return x;
			},
			isNaN: isNaN,
			isInfinite: isInfinite
		};
	}();
	//import //

	var _elm_lang$core$Native_Utils = function () {

		// COMPARISONS

		function eq(x, y) {
			var stack = [];
			var isEqual = eqHelp(x, y, 0, stack);
			var pair;
			while (isEqual && (pair = stack.pop())) {
				isEqual = eqHelp(pair.x, pair.y, 0, stack);
			}
			return isEqual;
		}

		function eqHelp(x, y, depth, stack) {
			if (depth > 100) {
				stack.push({ x: x, y: y });
				return true;
			}

			if (x === y) {
				return true;
			}

			if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object') {
				if (typeof x === 'function') {
					throw new Error('Trying to use `(==)` on functions. There is no way to know if functions are "the same" in the Elm sense.' + ' Read more about this at http://package.elm-lang.org/packages/elm-lang/core/latest/Basics#==' + ' which describes why it is this way and what the better version will look like.');
				}
				return false;
			}

			if (x === null || y === null) {
				return false;
			}

			if (x instanceof Date) {
				return x.getTime() === y.getTime();
			}

			if (!('ctor' in x)) {
				for (var key in x) {
					if (!eqHelp(x[key], y[key], depth + 1, stack)) {
						return false;
					}
				}
				return true;
			}

			// convert Dicts and Sets to lists
			if (x.ctor === 'RBNode_elm_builtin' || x.ctor === 'RBEmpty_elm_builtin') {
				x = _elm_lang$core$Dict$toList(x);
				y = _elm_lang$core$Dict$toList(y);
			}
			if (x.ctor === 'Set_elm_builtin') {
				x = _elm_lang$core$Set$toList(x);
				y = _elm_lang$core$Set$toList(y);
			}

			// check if lists are equal without recursion
			if (x.ctor === '::') {
				var a = x;
				var b = y;
				while (a.ctor === '::' && b.ctor === '::') {
					if (!eqHelp(a._0, b._0, depth + 1, stack)) {
						return false;
					}
					a = a._1;
					b = b._1;
				}
				return a.ctor === b.ctor;
			}

			// check if Arrays are equal
			if (x.ctor === '_Array') {
				var xs = _elm_lang$core$Native_Array.toJSArray(x);
				var ys = _elm_lang$core$Native_Array.toJSArray(y);
				if (xs.length !== ys.length) {
					return false;
				}
				for (var i = 0; i < xs.length; i++) {
					if (!eqHelp(xs[i], ys[i], depth + 1, stack)) {
						return false;
					}
				}
				return true;
			}

			if (!eqHelp(x.ctor, y.ctor, depth + 1, stack)) {
				return false;
			}

			for (var key in x) {
				if (!eqHelp(x[key], y[key], depth + 1, stack)) {
					return false;
				}
			}
			return true;
		}

		// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
		// the particular integer values assigned to LT, EQ, and GT.

		var LT = -1,
		    EQ = 0,
		    GT = 1;

		function cmp(x, y) {
			if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object') {
				return x === y ? EQ : x < y ? LT : GT;
			}

			if (x instanceof String) {
				var a = x.valueOf();
				var b = y.valueOf();
				return a === b ? EQ : a < b ? LT : GT;
			}

			if (x.ctor === '::' || x.ctor === '[]') {
				while (x.ctor === '::' && y.ctor === '::') {
					var ord = cmp(x._0, y._0);
					if (ord !== EQ) {
						return ord;
					}
					x = x._1;
					y = y._1;
				}
				return x.ctor === y.ctor ? EQ : x.ctor === '[]' ? LT : GT;
			}

			if (x.ctor.slice(0, 6) === '_Tuple') {
				var ord;
				var n = x.ctor.slice(6) - 0;
				var err = 'cannot compare tuples with more than 6 elements.';
				if (n === 0) return EQ;
				if (n >= 1) {
					ord = cmp(x._0, y._0);if (ord !== EQ) return ord;
					if (n >= 2) {
						ord = cmp(x._1, y._1);if (ord !== EQ) return ord;
						if (n >= 3) {
							ord = cmp(x._2, y._2);if (ord !== EQ) return ord;
							if (n >= 4) {
								ord = cmp(x._3, y._3);if (ord !== EQ) return ord;
								if (n >= 5) {
									ord = cmp(x._4, y._4);if (ord !== EQ) return ord;
									if (n >= 6) {
										ord = cmp(x._5, y._5);if (ord !== EQ) return ord;
										if (n >= 7) throw new Error('Comparison error: ' + err);
									}
								}
							}
						}
					}
				}
				return EQ;
			}

			throw new Error('Comparison error: comparison is only defined on ints, ' + 'floats, times, chars, strings, lists of comparable values, ' + 'and tuples of comparable values.');
		}

		// COMMON VALUES

		var Tuple0 = {
			ctor: '_Tuple0'
		};

		function Tuple2(x, y) {
			return {
				ctor: '_Tuple2',
				_0: x,
				_1: y
			};
		}

		function chr(c) {
			return new String(c);
		}

		// GUID

		var count = 0;
		function guid(_) {
			return count++;
		}

		// RECORDS

		function update(oldRecord, updatedFields) {
			var newRecord = {};

			for (var key in oldRecord) {
				newRecord[key] = oldRecord[key];
			}

			for (var key in updatedFields) {
				newRecord[key] = updatedFields[key];
			}

			return newRecord;
		}

		//// LIST STUFF ////

		var Nil = { ctor: '[]' };

		function Cons(hd, tl) {
			return {
				ctor: '::',
				_0: hd,
				_1: tl
			};
		}

		function append(xs, ys) {
			// append Strings
			if (typeof xs === 'string') {
				return xs + ys;
			}

			// append Lists
			if (xs.ctor === '[]') {
				return ys;
			}
			var root = Cons(xs._0, Nil);
			var curr = root;
			xs = xs._1;
			while (xs.ctor !== '[]') {
				curr._1 = Cons(xs._0, Nil);
				xs = xs._1;
				curr = curr._1;
			}
			curr._1 = ys;
			return root;
		}

		// CRASHES

		function crash(moduleName, region) {
			return function (message) {
				throw new Error('Ran into a `Debug.crash` in module `' + moduleName + '` ' + regionToString(region) + '\n' + 'The message provided by the code author is:\n\n    ' + message);
			};
		}

		function crashCase(moduleName, region, value) {
			return function (message) {
				throw new Error('Ran into a `Debug.crash` in module `' + moduleName + '`\n\n' + 'This was caused by the `case` expression ' + regionToString(region) + '.\n' + 'One of the branches ended with a crash and the following value got through:\n\n    ' + toString(value) + '\n\n' + 'The message provided by the code author is:\n\n    ' + message);
			};
		}

		function regionToString(region) {
			if (region.start.line == region.end.line) {
				return 'on line ' + region.start.line;
			}
			return 'between lines ' + region.start.line + ' and ' + region.end.line;
		}

		// TO STRING

		function toString(v) {
			var type = typeof v === 'undefined' ? 'undefined' : _typeof(v);
			if (type === 'function') {
				return '<function>';
			}

			if (type === 'boolean') {
				return v ? 'True' : 'False';
			}

			if (type === 'number') {
				return v + '';
			}

			if (v instanceof String) {
				return '\'' + addSlashes(v, true) + '\'';
			}

			if (type === 'string') {
				return '"' + addSlashes(v, false) + '"';
			}

			if (v === null) {
				return 'null';
			}

			if (type === 'object' && 'ctor' in v) {
				var ctorStarter = v.ctor.substring(0, 5);

				if (ctorStarter === '_Tupl') {
					var output = [];
					for (var k in v) {
						if (k === 'ctor') continue;
						output.push(toString(v[k]));
					}
					return '(' + output.join(',') + ')';
				}

				if (ctorStarter === '_Task') {
					return '<task>';
				}

				if (v.ctor === '_Array') {
					var list = _elm_lang$core$Array$toList(v);
					return 'Array.fromList ' + toString(list);
				}

				if (v.ctor === '<decoder>') {
					return '<decoder>';
				}

				if (v.ctor === '_Process') {
					return '<process:' + v.id + '>';
				}

				if (v.ctor === '::') {
					var output = '[' + toString(v._0);
					v = v._1;
					while (v.ctor === '::') {
						output += ',' + toString(v._0);
						v = v._1;
					}
					return output + ']';
				}

				if (v.ctor === '[]') {
					return '[]';
				}

				if (v.ctor === 'Set_elm_builtin') {
					return 'Set.fromList ' + toString(_elm_lang$core$Set$toList(v));
				}

				if (v.ctor === 'RBNode_elm_builtin' || v.ctor === 'RBEmpty_elm_builtin') {
					return 'Dict.fromList ' + toString(_elm_lang$core$Dict$toList(v));
				}

				var output = '';
				for (var i in v) {
					if (i === 'ctor') continue;
					var str = toString(v[i]);
					var c0 = str[0];
					var parenless = c0 === '{' || c0 === '(' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
					output += ' ' + (parenless ? str : '(' + str + ')');
				}
				return v.ctor + output;
			}

			if (type === 'object') {
				if (v instanceof Date) {
					return '<' + v.toString() + '>';
				}

				if (v.elm_web_socket) {
					return '<websocket>';
				}

				var output = [];
				for (var k in v) {
					output.push(k + ' = ' + toString(v[k]));
				}
				if (output.length === 0) {
					return '{}';
				}
				return '{ ' + output.join(', ') + ' }';
			}

			return '<internal structure>';
		}

		function addSlashes(str, isChar) {
			var s = str.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r').replace(/\v/g, '\\v').replace(/\0/g, '\\0');
			if (isChar) {
				return s.replace(/\'/g, '\\\'');
			} else {
				return s.replace(/\"/g, '\\"');
			}
		}

		return {
			eq: eq,
			cmp: cmp,
			Tuple0: Tuple0,
			Tuple2: Tuple2,
			chr: chr,
			update: update,
			guid: guid,

			append: F2(append),

			crash: crash,
			crashCase: crashCase,

			toString: toString
		};
	}();
	var _elm_lang$core$Basics$never = function _elm_lang$core$Basics$never(_p0) {
		never: while (true) {
			var _p1 = _p0;
			var _v1 = _p1._0;
			_p0 = _v1;
			continue never;
		}
	};
	var _elm_lang$core$Basics$uncurry = F2(function (f, _p2) {
		var _p3 = _p2;
		return A2(f, _p3._0, _p3._1);
	});
	var _elm_lang$core$Basics$curry = F3(function (f, a, b) {
		return f({ ctor: '_Tuple2', _0: a, _1: b });
	});
	var _elm_lang$core$Basics$flip = F3(function (f, b, a) {
		return A2(f, a, b);
	});
	var _elm_lang$core$Basics$always = F2(function (a, _p4) {
		return a;
	});
	var _elm_lang$core$Basics$identity = function _elm_lang$core$Basics$identity(x) {
		return x;
	};
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['<|'] = F2(function (f, x) {
		return f(x);
	});
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['|>'] = F2(function (x, f) {
		return f(x);
	});
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['>>'] = F3(function (f, g, x) {
		return g(f(x));
	});
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['<<'] = F3(function (g, f, x) {
		return g(f(x));
	});
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['++'] = _elm_lang$core$Native_Utils.append;
	var _elm_lang$core$Basics$toString = _elm_lang$core$Native_Utils.toString;
	var _elm_lang$core$Basics$isInfinite = _elm_lang$core$Native_Basics.isInfinite;
	var _elm_lang$core$Basics$isNaN = _elm_lang$core$Native_Basics.isNaN;
	var _elm_lang$core$Basics$toFloat = _elm_lang$core$Native_Basics.toFloat;
	var _elm_lang$core$Basics$ceiling = _elm_lang$core$Native_Basics.ceiling;
	var _elm_lang$core$Basics$floor = _elm_lang$core$Native_Basics.floor;
	var _elm_lang$core$Basics$truncate = _elm_lang$core$Native_Basics.truncate;
	var _elm_lang$core$Basics$round = _elm_lang$core$Native_Basics.round;
	var _elm_lang$core$Basics$not = _elm_lang$core$Native_Basics.not;
	var _elm_lang$core$Basics$xor = _elm_lang$core$Native_Basics.xor;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['||'] = _elm_lang$core$Native_Basics.or;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['&&'] = _elm_lang$core$Native_Basics.and;
	var _elm_lang$core$Basics$max = _elm_lang$core$Native_Basics.max;
	var _elm_lang$core$Basics$min = _elm_lang$core$Native_Basics.min;
	var _elm_lang$core$Basics$compare = _elm_lang$core$Native_Basics.compare;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['>='] = _elm_lang$core$Native_Basics.ge;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['<='] = _elm_lang$core$Native_Basics.le;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['>'] = _elm_lang$core$Native_Basics.gt;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['<'] = _elm_lang$core$Native_Basics.lt;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['/='] = _elm_lang$core$Native_Basics.neq;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['=='] = _elm_lang$core$Native_Basics.eq;
	var _elm_lang$core$Basics$e = _elm_lang$core$Native_Basics.e;
	var _elm_lang$core$Basics$pi = _elm_lang$core$Native_Basics.pi;
	var _elm_lang$core$Basics$clamp = _elm_lang$core$Native_Basics.clamp;
	var _elm_lang$core$Basics$logBase = _elm_lang$core$Native_Basics.logBase;
	var _elm_lang$core$Basics$abs = _elm_lang$core$Native_Basics.abs;
	var _elm_lang$core$Basics$negate = _elm_lang$core$Native_Basics.negate;
	var _elm_lang$core$Basics$sqrt = _elm_lang$core$Native_Basics.sqrt;
	var _elm_lang$core$Basics$atan2 = _elm_lang$core$Native_Basics.atan2;
	var _elm_lang$core$Basics$atan = _elm_lang$core$Native_Basics.atan;
	var _elm_lang$core$Basics$asin = _elm_lang$core$Native_Basics.asin;
	var _elm_lang$core$Basics$acos = _elm_lang$core$Native_Basics.acos;
	var _elm_lang$core$Basics$tan = _elm_lang$core$Native_Basics.tan;
	var _elm_lang$core$Basics$sin = _elm_lang$core$Native_Basics.sin;
	var _elm_lang$core$Basics$cos = _elm_lang$core$Native_Basics.cos;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['^'] = _elm_lang$core$Native_Basics.exp;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['%'] = _elm_lang$core$Native_Basics.mod;
	var _elm_lang$core$Basics$rem = _elm_lang$core$Native_Basics.rem;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['//'] = _elm_lang$core$Native_Basics.div;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['/'] = _elm_lang$core$Native_Basics.floatDiv;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['*'] = _elm_lang$core$Native_Basics.mul;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['-'] = _elm_lang$core$Native_Basics.sub;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['+'] = _elm_lang$core$Native_Basics.add;
	var _elm_lang$core$Basics$toPolar = _elm_lang$core$Native_Basics.toPolar;
	var _elm_lang$core$Basics$fromPolar = _elm_lang$core$Native_Basics.fromPolar;
	var _elm_lang$core$Basics$turns = _elm_lang$core$Native_Basics.turns;
	var _elm_lang$core$Basics$degrees = _elm_lang$core$Native_Basics.degrees;
	var _elm_lang$core$Basics$radians = function _elm_lang$core$Basics$radians(t) {
		return t;
	};
	var _elm_lang$core$Basics$GT = { ctor: 'GT' };
	var _elm_lang$core$Basics$EQ = { ctor: 'EQ' };
	var _elm_lang$core$Basics$LT = { ctor: 'LT' };
	var _elm_lang$core$Basics$JustOneMore = function _elm_lang$core$Basics$JustOneMore(a) {
		return { ctor: 'JustOneMore', _0: a };
	};

	//import Native.Utils //

	var _elm_lang$core$Native_Debug = function () {

		function log(tag, value) {
			var msg = tag + ': ' + _elm_lang$core$Native_Utils.toString(value);
			var process = process || {};
			if (process.stdout) {
				process.stdout.write(msg);
			} else {
				console.log(msg);
			}
			return value;
		}

		function crash(message) {
			throw new Error(message);
		}

		return {
			crash: crash,
			log: F2(log)
		};
	}();
	var _elm_lang$core$Debug$crash = _elm_lang$core$Native_Debug.crash;
	var _elm_lang$core$Debug$log = _elm_lang$core$Native_Debug.log;

	var _elm_lang$core$Maybe$withDefault = F2(function ($default, maybe) {
		var _p0 = maybe;
		if (_p0.ctor === 'Just') {
			return _p0._0;
		} else {
			return $default;
		}
	});
	var _elm_lang$core$Maybe$Nothing = { ctor: 'Nothing' };
	var _elm_lang$core$Maybe$andThen = F2(function (callback, maybeValue) {
		var _p1 = maybeValue;
		if (_p1.ctor === 'Just') {
			return callback(_p1._0);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
	var _elm_lang$core$Maybe$Just = function _elm_lang$core$Maybe$Just(a) {
		return { ctor: 'Just', _0: a };
	};
	var _elm_lang$core$Maybe$map = F2(function (f, maybe) {
		var _p2 = maybe;
		if (_p2.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(f(_p2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
	var _elm_lang$core$Maybe$map2 = F3(function (func, ma, mb) {
		var _p3 = { ctor: '_Tuple2', _0: ma, _1: mb };
		if (_p3.ctor === '_Tuple2' && _p3._0.ctor === 'Just' && _p3._1.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(A2(func, _p3._0._0, _p3._1._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
	var _elm_lang$core$Maybe$map3 = F4(function (func, ma, mb, mc) {
		var _p4 = { ctor: '_Tuple3', _0: ma, _1: mb, _2: mc };
		if (_p4.ctor === '_Tuple3' && _p4._0.ctor === 'Just' && _p4._1.ctor === 'Just' && _p4._2.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(A3(func, _p4._0._0, _p4._1._0, _p4._2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
	var _elm_lang$core$Maybe$map4 = F5(function (func, ma, mb, mc, md) {
		var _p5 = { ctor: '_Tuple4', _0: ma, _1: mb, _2: mc, _3: md };
		if (_p5.ctor === '_Tuple4' && _p5._0.ctor === 'Just' && _p5._1.ctor === 'Just' && _p5._2.ctor === 'Just' && _p5._3.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(A4(func, _p5._0._0, _p5._1._0, _p5._2._0, _p5._3._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
	var _elm_lang$core$Maybe$map5 = F6(function (func, ma, mb, mc, md, me) {
		var _p6 = { ctor: '_Tuple5', _0: ma, _1: mb, _2: mc, _3: md, _4: me };
		if (_p6.ctor === '_Tuple5' && _p6._0.ctor === 'Just' && _p6._1.ctor === 'Just' && _p6._2.ctor === 'Just' && _p6._3.ctor === 'Just' && _p6._4.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(A5(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0, _p6._4._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});

	//import Native.Utils //

	var _elm_lang$core$Native_List = function () {

		var Nil = { ctor: '[]' };

		function Cons(hd, tl) {
			return { ctor: '::', _0: hd, _1: tl };
		}

		function fromArray(arr) {
			var out = Nil;
			for (var i = arr.length; i--;) {
				out = Cons(arr[i], out);
			}
			return out;
		}

		function toArray(xs) {
			var out = [];
			while (xs.ctor !== '[]') {
				out.push(xs._0);
				xs = xs._1;
			}
			return out;
		}

		function foldr(f, b, xs) {
			var arr = toArray(xs);
			var acc = b;
			for (var i = arr.length; i--;) {
				acc = A2(f, arr[i], acc);
			}
			return acc;
		}

		function map2(f, xs, ys) {
			var arr = [];
			while (xs.ctor !== '[]' && ys.ctor !== '[]') {
				arr.push(A2(f, xs._0, ys._0));
				xs = xs._1;
				ys = ys._1;
			}
			return fromArray(arr);
		}

		function map3(f, xs, ys, zs) {
			var arr = [];
			while (xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]') {
				arr.push(A3(f, xs._0, ys._0, zs._0));
				xs = xs._1;
				ys = ys._1;
				zs = zs._1;
			}
			return fromArray(arr);
		}

		function map4(f, ws, xs, ys, zs) {
			var arr = [];
			while (ws.ctor !== '[]' && xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]') {
				arr.push(A4(f, ws._0, xs._0, ys._0, zs._0));
				ws = ws._1;
				xs = xs._1;
				ys = ys._1;
				zs = zs._1;
			}
			return fromArray(arr);
		}

		function map5(f, vs, ws, xs, ys, zs) {
			var arr = [];
			while (vs.ctor !== '[]' && ws.ctor !== '[]' && xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]') {
				arr.push(A5(f, vs._0, ws._0, xs._0, ys._0, zs._0));
				vs = vs._1;
				ws = ws._1;
				xs = xs._1;
				ys = ys._1;
				zs = zs._1;
			}
			return fromArray(arr);
		}

		function sortBy(f, xs) {
			return fromArray(toArray(xs).sort(function (a, b) {
				return _elm_lang$core$Native_Utils.cmp(f(a), f(b));
			}));
		}

		function sortWith(f, xs) {
			return fromArray(toArray(xs).sort(function (a, b) {
				var ord = f(a)(b).ctor;
				return ord === 'EQ' ? 0 : ord === 'LT' ? -1 : 1;
			}));
		}

		return {
			Nil: Nil,
			Cons: Cons,
			cons: F2(Cons),
			toArray: toArray,
			fromArray: fromArray,

			foldr: F3(foldr),

			map2: F3(map2),
			map3: F4(map3),
			map4: F5(map4),
			map5: F6(map5),
			sortBy: F2(sortBy),
			sortWith: F2(sortWith)
		};
	}();
	var _elm_lang$core$List$sortWith = _elm_lang$core$Native_List.sortWith;
	var _elm_lang$core$List$sortBy = _elm_lang$core$Native_List.sortBy;
	var _elm_lang$core$List$sort = function _elm_lang$core$List$sort(xs) {
		return A2(_elm_lang$core$List$sortBy, _elm_lang$core$Basics$identity, xs);
	};
	var _elm_lang$core$List$singleton = function _elm_lang$core$List$singleton(value) {
		return {
			ctor: '::',
			_0: value,
			_1: { ctor: '[]' }
		};
	};
	var _elm_lang$core$List$drop = F2(function (n, list) {
		drop: while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return list;
			} else {
				var _p0 = list;
				if (_p0.ctor === '[]') {
					return list;
				} else {
					var _v1 = n - 1,
					    _v2 = _p0._1;
					n = _v1;
					list = _v2;
					continue drop;
				}
			}
		}
	});
	var _elm_lang$core$List$map5 = _elm_lang$core$Native_List.map5;
	var _elm_lang$core$List$map4 = _elm_lang$core$Native_List.map4;
	var _elm_lang$core$List$map3 = _elm_lang$core$Native_List.map3;
	var _elm_lang$core$List$map2 = _elm_lang$core$Native_List.map2;
	var _elm_lang$core$List$any = F2(function (isOkay, list) {
		any: while (true) {
			var _p1 = list;
			if (_p1.ctor === '[]') {
				return false;
			} else {
				if (isOkay(_p1._0)) {
					return true;
				} else {
					var _v4 = isOkay,
					    _v5 = _p1._1;
					isOkay = _v4;
					list = _v5;
					continue any;
				}
			}
		}
	});
	var _elm_lang$core$List$all = F2(function (isOkay, list) {
		return !A2(_elm_lang$core$List$any, function (_p2) {
			return !isOkay(_p2);
		}, list);
	});
	var _elm_lang$core$List$foldr = _elm_lang$core$Native_List.foldr;
	var _elm_lang$core$List$foldl = F3(function (func, acc, list) {
		foldl: while (true) {
			var _p3 = list;
			if (_p3.ctor === '[]') {
				return acc;
			} else {
				var _v7 = func,
				    _v8 = A2(func, _p3._0, acc),
				    _v9 = _p3._1;
				func = _v7;
				acc = _v8;
				list = _v9;
				continue foldl;
			}
		}
	});
	var _elm_lang$core$List$length = function _elm_lang$core$List$length(xs) {
		return A3(_elm_lang$core$List$foldl, F2(function (_p4, i) {
			return i + 1;
		}), 0, xs);
	};
	var _elm_lang$core$List$sum = function _elm_lang$core$List$sum(numbers) {
		return A3(_elm_lang$core$List$foldl, F2(function (x, y) {
			return x + y;
		}), 0, numbers);
	};
	var _elm_lang$core$List$product = function _elm_lang$core$List$product(numbers) {
		return A3(_elm_lang$core$List$foldl, F2(function (x, y) {
			return x * y;
		}), 1, numbers);
	};
	var _elm_lang$core$List$maximum = function _elm_lang$core$List$maximum(list) {
		var _p5 = list;
		if (_p5.ctor === '::') {
			return _elm_lang$core$Maybe$Just(A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$max, _p5._0, _p5._1));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	};
	var _elm_lang$core$List$minimum = function _elm_lang$core$List$minimum(list) {
		var _p6 = list;
		if (_p6.ctor === '::') {
			return _elm_lang$core$Maybe$Just(A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$min, _p6._0, _p6._1));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	};
	var _elm_lang$core$List$member = F2(function (x, xs) {
		return A2(_elm_lang$core$List$any, function (a) {
			return _elm_lang$core$Native_Utils.eq(a, x);
		}, xs);
	});
	var _elm_lang$core$List$isEmpty = function _elm_lang$core$List$isEmpty(xs) {
		var _p7 = xs;
		if (_p7.ctor === '[]') {
			return true;
		} else {
			return false;
		}
	};
	var _elm_lang$core$List$tail = function _elm_lang$core$List$tail(list) {
		var _p8 = list;
		if (_p8.ctor === '::') {
			return _elm_lang$core$Maybe$Just(_p8._1);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	};
	var _elm_lang$core$List$head = function _elm_lang$core$List$head(list) {
		var _p9 = list;
		if (_p9.ctor === '::') {
			return _elm_lang$core$Maybe$Just(_p9._0);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	};
	var _elm_lang$core$List_ops = _elm_lang$core$List_ops || {};
	_elm_lang$core$List_ops['::'] = _elm_lang$core$Native_List.cons;
	var _elm_lang$core$List$map = F2(function (f, xs) {
		return A3(_elm_lang$core$List$foldr, F2(function (x, acc) {
			return {
				ctor: '::',
				_0: f(x),
				_1: acc
			};
		}), { ctor: '[]' }, xs);
	});
	var _elm_lang$core$List$filter = F2(function (pred, xs) {
		var conditionalCons = F2(function (front, back) {
			return pred(front) ? { ctor: '::', _0: front, _1: back } : back;
		});
		return A3(_elm_lang$core$List$foldr, conditionalCons, { ctor: '[]' }, xs);
	});
	var _elm_lang$core$List$maybeCons = F3(function (f, mx, xs) {
		var _p10 = f(mx);
		if (_p10.ctor === 'Just') {
			return { ctor: '::', _0: _p10._0, _1: xs };
		} else {
			return xs;
		}
	});
	var _elm_lang$core$List$filterMap = F2(function (f, xs) {
		return A3(_elm_lang$core$List$foldr, _elm_lang$core$List$maybeCons(f), { ctor: '[]' }, xs);
	});
	var _elm_lang$core$List$reverse = function _elm_lang$core$List$reverse(list) {
		return A3(_elm_lang$core$List$foldl, F2(function (x, y) {
			return { ctor: '::', _0: x, _1: y };
		}), { ctor: '[]' }, list);
	};
	var _elm_lang$core$List$scanl = F3(function (f, b, xs) {
		var scan1 = F2(function (x, accAcc) {
			var _p11 = accAcc;
			if (_p11.ctor === '::') {
				return {
					ctor: '::',
					_0: A2(f, x, _p11._0),
					_1: accAcc
				};
			} else {
				return { ctor: '[]' };
			}
		});
		return _elm_lang$core$List$reverse(A3(_elm_lang$core$List$foldl, scan1, {
			ctor: '::',
			_0: b,
			_1: { ctor: '[]' }
		}, xs));
	});
	var _elm_lang$core$List$append = F2(function (xs, ys) {
		var _p12 = ys;
		if (_p12.ctor === '[]') {
			return xs;
		} else {
			return A3(_elm_lang$core$List$foldr, F2(function (x, y) {
				return { ctor: '::', _0: x, _1: y };
			}), ys, xs);
		}
	});
	var _elm_lang$core$List$concat = function _elm_lang$core$List$concat(lists) {
		return A3(_elm_lang$core$List$foldr, _elm_lang$core$List$append, { ctor: '[]' }, lists);
	};
	var _elm_lang$core$List$concatMap = F2(function (f, list) {
		return _elm_lang$core$List$concat(A2(_elm_lang$core$List$map, f, list));
	});
	var _elm_lang$core$List$partition = F2(function (pred, list) {
		var step = F2(function (x, _p13) {
			var _p14 = _p13;
			var _p16 = _p14._0;
			var _p15 = _p14._1;
			return pred(x) ? {
				ctor: '_Tuple2',
				_0: { ctor: '::', _0: x, _1: _p16 },
				_1: _p15
			} : {
				ctor: '_Tuple2',
				_0: _p16,
				_1: { ctor: '::', _0: x, _1: _p15 }
			};
		});
		return A3(_elm_lang$core$List$foldr, step, {
			ctor: '_Tuple2',
			_0: { ctor: '[]' },
			_1: { ctor: '[]' }
		}, list);
	});
	var _elm_lang$core$List$unzip = function _elm_lang$core$List$unzip(pairs) {
		var step = F2(function (_p18, _p17) {
			var _p19 = _p18;
			var _p20 = _p17;
			return {
				ctor: '_Tuple2',
				_0: { ctor: '::', _0: _p19._0, _1: _p20._0 },
				_1: { ctor: '::', _0: _p19._1, _1: _p20._1 }
			};
		});
		return A3(_elm_lang$core$List$foldr, step, {
			ctor: '_Tuple2',
			_0: { ctor: '[]' },
			_1: { ctor: '[]' }
		}, pairs);
	};
	var _elm_lang$core$List$intersperse = F2(function (sep, xs) {
		var _p21 = xs;
		if (_p21.ctor === '[]') {
			return { ctor: '[]' };
		} else {
			var step = F2(function (x, rest) {
				return {
					ctor: '::',
					_0: sep,
					_1: { ctor: '::', _0: x, _1: rest }
				};
			});
			var spersed = A3(_elm_lang$core$List$foldr, step, { ctor: '[]' }, _p21._1);
			return { ctor: '::', _0: _p21._0, _1: spersed };
		}
	});
	var _elm_lang$core$List$takeReverse = F3(function (n, list, taken) {
		takeReverse: while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return taken;
			} else {
				var _p22 = list;
				if (_p22.ctor === '[]') {
					return taken;
				} else {
					var _v23 = n - 1,
					    _v24 = _p22._1,
					    _v25 = { ctor: '::', _0: _p22._0, _1: taken };
					n = _v23;
					list = _v24;
					taken = _v25;
					continue takeReverse;
				}
			}
		}
	});
	var _elm_lang$core$List$takeTailRec = F2(function (n, list) {
		return _elm_lang$core$List$reverse(A3(_elm_lang$core$List$takeReverse, n, list, { ctor: '[]' }));
	});
	var _elm_lang$core$List$takeFast = F3(function (ctr, n, list) {
		if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
			return { ctor: '[]' };
		} else {
			var _p23 = { ctor: '_Tuple2', _0: n, _1: list };
			_v26_5: do {
				_v26_1: do {
					if (_p23.ctor === '_Tuple2') {
						if (_p23._1.ctor === '[]') {
							return list;
						} else {
							if (_p23._1._1.ctor === '::') {
								switch (_p23._0) {
									case 1:
										break _v26_1;
									case 2:
										return {
											ctor: '::',
											_0: _p23._1._0,
											_1: {
												ctor: '::',
												_0: _p23._1._1._0,
												_1: { ctor: '[]' }
											}
										};
									case 3:
										if (_p23._1._1._1.ctor === '::') {
											return {
												ctor: '::',
												_0: _p23._1._0,
												_1: {
													ctor: '::',
													_0: _p23._1._1._0,
													_1: {
														ctor: '::',
														_0: _p23._1._1._1._0,
														_1: { ctor: '[]' }
													}
												}
											};
										} else {
											break _v26_5;
										}
									default:
										if (_p23._1._1._1.ctor === '::' && _p23._1._1._1._1.ctor === '::') {
											var _p28 = _p23._1._1._1._0;
											var _p27 = _p23._1._1._0;
											var _p26 = _p23._1._0;
											var _p25 = _p23._1._1._1._1._0;
											var _p24 = _p23._1._1._1._1._1;
											return _elm_lang$core$Native_Utils.cmp(ctr, 1000) > 0 ? {
												ctor: '::',
												_0: _p26,
												_1: {
													ctor: '::',
													_0: _p27,
													_1: {
														ctor: '::',
														_0: _p28,
														_1: {
															ctor: '::',
															_0: _p25,
															_1: A2(_elm_lang$core$List$takeTailRec, n - 4, _p24)
														}
													}
												}
											} : {
												ctor: '::',
												_0: _p26,
												_1: {
													ctor: '::',
													_0: _p27,
													_1: {
														ctor: '::',
														_0: _p28,
														_1: {
															ctor: '::',
															_0: _p25,
															_1: A3(_elm_lang$core$List$takeFast, ctr + 1, n - 4, _p24)
														}
													}
												}
											};
										} else {
											break _v26_5;
										}
								}
							} else {
								if (_p23._0 === 1) {
									break _v26_1;
								} else {
									break _v26_5;
								}
							}
						}
					} else {
						break _v26_5;
					}
				} while (false);
				return {
					ctor: '::',
					_0: _p23._1._0,
					_1: { ctor: '[]' }
				};
			} while (false);
			return list;
		}
	});
	var _elm_lang$core$List$take = F2(function (n, list) {
		return A3(_elm_lang$core$List$takeFast, 0, n, list);
	});
	var _elm_lang$core$List$repeatHelp = F3(function (result, n, value) {
		repeatHelp: while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return result;
			} else {
				var _v27 = { ctor: '::', _0: value, _1: result },
				    _v28 = n - 1,
				    _v29 = value;
				result = _v27;
				n = _v28;
				value = _v29;
				continue repeatHelp;
			}
		}
	});
	var _elm_lang$core$List$repeat = F2(function (n, value) {
		return A3(_elm_lang$core$List$repeatHelp, { ctor: '[]' }, n, value);
	});
	var _elm_lang$core$List$rangeHelp = F3(function (lo, hi, list) {
		rangeHelp: while (true) {
			if (_elm_lang$core$Native_Utils.cmp(lo, hi) < 1) {
				var _v30 = lo,
				    _v31 = hi - 1,
				    _v32 = { ctor: '::', _0: hi, _1: list };
				lo = _v30;
				hi = _v31;
				list = _v32;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
	var _elm_lang$core$List$range = F2(function (lo, hi) {
		return A3(_elm_lang$core$List$rangeHelp, lo, hi, { ctor: '[]' });
	});
	var _elm_lang$core$List$indexedMap = F2(function (f, xs) {
		return A3(_elm_lang$core$List$map2, f, A2(_elm_lang$core$List$range, 0, _elm_lang$core$List$length(xs) - 1), xs);
	});

	var _elm_lang$core$Result$toMaybe = function _elm_lang$core$Result$toMaybe(result) {
		var _p0 = result;
		if (_p0.ctor === 'Ok') {
			return _elm_lang$core$Maybe$Just(_p0._0);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	};
	var _elm_lang$core$Result$withDefault = F2(function (def, result) {
		var _p1 = result;
		if (_p1.ctor === 'Ok') {
			return _p1._0;
		} else {
			return def;
		}
	});
	var _elm_lang$core$Result$Err = function _elm_lang$core$Result$Err(a) {
		return { ctor: 'Err', _0: a };
	};
	var _elm_lang$core$Result$andThen = F2(function (callback, result) {
		var _p2 = result;
		if (_p2.ctor === 'Ok') {
			return callback(_p2._0);
		} else {
			return _elm_lang$core$Result$Err(_p2._0);
		}
	});
	var _elm_lang$core$Result$Ok = function _elm_lang$core$Result$Ok(a) {
		return { ctor: 'Ok', _0: a };
	};
	var _elm_lang$core$Result$map = F2(function (func, ra) {
		var _p3 = ra;
		if (_p3.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(func(_p3._0));
		} else {
			return _elm_lang$core$Result$Err(_p3._0);
		}
	});
	var _elm_lang$core$Result$map2 = F3(function (func, ra, rb) {
		var _p4 = { ctor: '_Tuple2', _0: ra, _1: rb };
		if (_p4._0.ctor === 'Ok') {
			if (_p4._1.ctor === 'Ok') {
				return _elm_lang$core$Result$Ok(A2(func, _p4._0._0, _p4._1._0));
			} else {
				return _elm_lang$core$Result$Err(_p4._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p4._0._0);
		}
	});
	var _elm_lang$core$Result$map3 = F4(function (func, ra, rb, rc) {
		var _p5 = { ctor: '_Tuple3', _0: ra, _1: rb, _2: rc };
		if (_p5._0.ctor === 'Ok') {
			if (_p5._1.ctor === 'Ok') {
				if (_p5._2.ctor === 'Ok') {
					return _elm_lang$core$Result$Ok(A3(func, _p5._0._0, _p5._1._0, _p5._2._0));
				} else {
					return _elm_lang$core$Result$Err(_p5._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p5._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p5._0._0);
		}
	});
	var _elm_lang$core$Result$map4 = F5(function (func, ra, rb, rc, rd) {
		var _p6 = { ctor: '_Tuple4', _0: ra, _1: rb, _2: rc, _3: rd };
		if (_p6._0.ctor === 'Ok') {
			if (_p6._1.ctor === 'Ok') {
				if (_p6._2.ctor === 'Ok') {
					if (_p6._3.ctor === 'Ok') {
						return _elm_lang$core$Result$Ok(A4(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0));
					} else {
						return _elm_lang$core$Result$Err(_p6._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p6._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p6._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p6._0._0);
		}
	});
	var _elm_lang$core$Result$map5 = F6(function (func, ra, rb, rc, rd, re) {
		var _p7 = { ctor: '_Tuple5', _0: ra, _1: rb, _2: rc, _3: rd, _4: re };
		if (_p7._0.ctor === 'Ok') {
			if (_p7._1.ctor === 'Ok') {
				if (_p7._2.ctor === 'Ok') {
					if (_p7._3.ctor === 'Ok') {
						if (_p7._4.ctor === 'Ok') {
							return _elm_lang$core$Result$Ok(A5(func, _p7._0._0, _p7._1._0, _p7._2._0, _p7._3._0, _p7._4._0));
						} else {
							return _elm_lang$core$Result$Err(_p7._4._0);
						}
					} else {
						return _elm_lang$core$Result$Err(_p7._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p7._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p7._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p7._0._0);
		}
	});
	var _elm_lang$core$Result$mapError = F2(function (f, result) {
		var _p8 = result;
		if (_p8.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(_p8._0);
		} else {
			return _elm_lang$core$Result$Err(f(_p8._0));
		}
	});
	var _elm_lang$core$Result$fromMaybe = F2(function (err, maybe) {
		var _p9 = maybe;
		if (_p9.ctor === 'Just') {
			return _elm_lang$core$Result$Ok(_p9._0);
		} else {
			return _elm_lang$core$Result$Err(err);
		}
	});

	//import Maybe, Native.List, Native.Utils, Result //

	var _elm_lang$core$Native_String = function () {

		function isEmpty(str) {
			return str.length === 0;
		}
		function cons(chr, str) {
			return chr + str;
		}
		function uncons(str) {
			var hd = str[0];
			if (hd) {
				return _elm_lang$core$Maybe$Just(_elm_lang$core$Native_Utils.Tuple2(_elm_lang$core$Native_Utils.chr(hd), str.slice(1)));
			}
			return _elm_lang$core$Maybe$Nothing;
		}
		function append(a, b) {
			return a + b;
		}
		function concat(strs) {
			return _elm_lang$core$Native_List.toArray(strs).join('');
		}
		function length(str) {
			return str.length;
		}
		function map(f, str) {
			var out = str.split('');
			for (var i = out.length; i--;) {
				out[i] = f(_elm_lang$core$Native_Utils.chr(out[i]));
			}
			return out.join('');
		}
		function filter(pred, str) {
			return str.split('').map(_elm_lang$core$Native_Utils.chr).filter(pred).join('');
		}
		function reverse(str) {
			return str.split('').reverse().join('');
		}
		function foldl(f, b, str) {
			var len = str.length;
			for (var i = 0; i < len; ++i) {
				b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
			}
			return b;
		}
		function foldr(f, b, str) {
			for (var i = str.length; i--;) {
				b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
			}
			return b;
		}
		function split(sep, str) {
			return _elm_lang$core$Native_List.fromArray(str.split(sep));
		}
		function join(sep, strs) {
			return _elm_lang$core$Native_List.toArray(strs).join(sep);
		}
		function repeat(n, str) {
			var result = '';
			while (n > 0) {
				if (n & 1) {
					result += str;
				}
				n >>= 1, str += str;
			}
			return result;
		}
		function slice(start, end, str) {
			return str.slice(start, end);
		}
		function left(n, str) {
			return n < 1 ? '' : str.slice(0, n);
		}
		function right(n, str) {
			return n < 1 ? '' : str.slice(-n);
		}
		function dropLeft(n, str) {
			return n < 1 ? str : str.slice(n);
		}
		function dropRight(n, str) {
			return n < 1 ? str : str.slice(0, -n);
		}
		function pad(n, chr, str) {
			var half = (n - str.length) / 2;
			return repeat(Math.ceil(half), chr) + str + repeat(half | 0, chr);
		}
		function padRight(n, chr, str) {
			return str + repeat(n - str.length, chr);
		}
		function padLeft(n, chr, str) {
			return repeat(n - str.length, chr) + str;
		}

		function trim(str) {
			return str.trim();
		}
		function trimLeft(str) {
			return str.replace(/^\s+/, '');
		}
		function trimRight(str) {
			return str.replace(/\s+$/, '');
		}

		function words(str) {
			return _elm_lang$core$Native_List.fromArray(str.trim().split(/\s+/g));
		}
		function lines(str) {
			return _elm_lang$core$Native_List.fromArray(str.split(/\r\n|\r|\n/g));
		}

		function toUpper(str) {
			return str.toUpperCase();
		}
		function toLower(str) {
			return str.toLowerCase();
		}

		function any(pred, str) {
			for (var i = str.length; i--;) {
				if (pred(_elm_lang$core$Native_Utils.chr(str[i]))) {
					return true;
				}
			}
			return false;
		}
		function all(pred, str) {
			for (var i = str.length; i--;) {
				if (!pred(_elm_lang$core$Native_Utils.chr(str[i]))) {
					return false;
				}
			}
			return true;
		}

		function contains(sub, str) {
			return str.indexOf(sub) > -1;
		}
		function startsWith(sub, str) {
			return str.indexOf(sub) === 0;
		}
		function endsWith(sub, str) {
			return str.length >= sub.length && str.lastIndexOf(sub) === str.length - sub.length;
		}
		function indexes(sub, str) {
			var subLen = sub.length;

			if (subLen < 1) {
				return _elm_lang$core$Native_List.Nil;
			}

			var i = 0;
			var is = [];

			while ((i = str.indexOf(sub, i)) > -1) {
				is.push(i);
				i = i + subLen;
			}

			return _elm_lang$core$Native_List.fromArray(is);
		}

		function toInt(s) {
			var len = s.length;

			// if empty
			if (len === 0) {
				return intErr(s);
			}

			// if hex
			var c = s[0];
			if (c === '0' && s[1] === 'x') {
				for (var i = 2; i < len; ++i) {
					var c = s[i];
					if ('0' <= c && c <= '9' || 'A' <= c && c <= 'F' || 'a' <= c && c <= 'f') {
						continue;
					}
					return intErr(s);
				}
				return _elm_lang$core$Result$Ok(parseInt(s, 16));
			}

			// is decimal
			if (c > '9' || c < '0' && c !== '-' && c !== '+') {
				return intErr(s);
			}
			for (var i = 1; i < len; ++i) {
				var c = s[i];
				if (c < '0' || '9' < c) {
					return intErr(s);
				}
			}

			return _elm_lang$core$Result$Ok(parseInt(s, 10));
		}

		function intErr(s) {
			return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int");
		}

		function toFloat(s) {
			// check if it is a hex, octal, or binary number
			if (s.length === 0 || /[\sxbo]/.test(s)) {
				return floatErr(s);
			}
			var n = +s;
			// faster isNaN check
			return n === n ? _elm_lang$core$Result$Ok(n) : floatErr(s);
		}

		function floatErr(s) {
			return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float");
		}

		function toList(str) {
			return _elm_lang$core$Native_List.fromArray(str.split('').map(_elm_lang$core$Native_Utils.chr));
		}
		function fromList(chars) {
			return _elm_lang$core$Native_List.toArray(chars).join('');
		}

		return {
			isEmpty: isEmpty,
			cons: F2(cons),
			uncons: uncons,
			append: F2(append),
			concat: concat,
			length: length,
			map: F2(map),
			filter: F2(filter),
			reverse: reverse,
			foldl: F3(foldl),
			foldr: F3(foldr),

			split: F2(split),
			join: F2(join),
			repeat: F2(repeat),

			slice: F3(slice),
			left: F2(left),
			right: F2(right),
			dropLeft: F2(dropLeft),
			dropRight: F2(dropRight),

			pad: F3(pad),
			padLeft: F3(padLeft),
			padRight: F3(padRight),

			trim: trim,
			trimLeft: trimLeft,
			trimRight: trimRight,

			words: words,
			lines: lines,

			toUpper: toUpper,
			toLower: toLower,

			any: F2(any),
			all: F2(all),

			contains: F2(contains),
			startsWith: F2(startsWith),
			endsWith: F2(endsWith),
			indexes: F2(indexes),

			toInt: toInt,
			toFloat: toFloat,
			toList: toList,
			fromList: fromList
		};
	}();

	//import Native.Utils //

	var _elm_lang$core$Native_Char = function () {

		return {
			fromCode: function fromCode(c) {
				return _elm_lang$core$Native_Utils.chr(String.fromCharCode(c));
			},
			toCode: function toCode(c) {
				return c.charCodeAt(0);
			},
			toUpper: function toUpper(c) {
				return _elm_lang$core$Native_Utils.chr(c.toUpperCase());
			},
			toLower: function toLower(c) {
				return _elm_lang$core$Native_Utils.chr(c.toLowerCase());
			},
			toLocaleUpper: function toLocaleUpper(c) {
				return _elm_lang$core$Native_Utils.chr(c.toLocaleUpperCase());
			},
			toLocaleLower: function toLocaleLower(c) {
				return _elm_lang$core$Native_Utils.chr(c.toLocaleLowerCase());
			}
		};
	}();
	var _elm_lang$core$Char$fromCode = _elm_lang$core$Native_Char.fromCode;
	var _elm_lang$core$Char$toCode = _elm_lang$core$Native_Char.toCode;
	var _elm_lang$core$Char$toLocaleLower = _elm_lang$core$Native_Char.toLocaleLower;
	var _elm_lang$core$Char$toLocaleUpper = _elm_lang$core$Native_Char.toLocaleUpper;
	var _elm_lang$core$Char$toLower = _elm_lang$core$Native_Char.toLower;
	var _elm_lang$core$Char$toUpper = _elm_lang$core$Native_Char.toUpper;
	var _elm_lang$core$Char$isBetween = F3(function (low, high, $char) {
		var code = _elm_lang$core$Char$toCode($char);
		return _elm_lang$core$Native_Utils.cmp(code, _elm_lang$core$Char$toCode(low)) > -1 && _elm_lang$core$Native_Utils.cmp(code, _elm_lang$core$Char$toCode(high)) < 1;
	});
	var _elm_lang$core$Char$isUpper = A2(_elm_lang$core$Char$isBetween, _elm_lang$core$Native_Utils.chr('A'), _elm_lang$core$Native_Utils.chr('Z'));
	var _elm_lang$core$Char$isLower = A2(_elm_lang$core$Char$isBetween, _elm_lang$core$Native_Utils.chr('a'), _elm_lang$core$Native_Utils.chr('z'));
	var _elm_lang$core$Char$isDigit = A2(_elm_lang$core$Char$isBetween, _elm_lang$core$Native_Utils.chr('0'), _elm_lang$core$Native_Utils.chr('9'));
	var _elm_lang$core$Char$isOctDigit = A2(_elm_lang$core$Char$isBetween, _elm_lang$core$Native_Utils.chr('0'), _elm_lang$core$Native_Utils.chr('7'));
	var _elm_lang$core$Char$isHexDigit = function _elm_lang$core$Char$isHexDigit($char) {
		return _elm_lang$core$Char$isDigit($char) || A3(_elm_lang$core$Char$isBetween, _elm_lang$core$Native_Utils.chr('a'), _elm_lang$core$Native_Utils.chr('f'), $char) || A3(_elm_lang$core$Char$isBetween, _elm_lang$core$Native_Utils.chr('A'), _elm_lang$core$Native_Utils.chr('F'), $char);
	};

	var _elm_lang$core$String$fromList = _elm_lang$core$Native_String.fromList;
	var _elm_lang$core$String$toList = _elm_lang$core$Native_String.toList;
	var _elm_lang$core$String$toFloat = _elm_lang$core$Native_String.toFloat;
	var _elm_lang$core$String$toInt = _elm_lang$core$Native_String.toInt;
	var _elm_lang$core$String$indices = _elm_lang$core$Native_String.indexes;
	var _elm_lang$core$String$indexes = _elm_lang$core$Native_String.indexes;
	var _elm_lang$core$String$endsWith = _elm_lang$core$Native_String.endsWith;
	var _elm_lang$core$String$startsWith = _elm_lang$core$Native_String.startsWith;
	var _elm_lang$core$String$contains = _elm_lang$core$Native_String.contains;
	var _elm_lang$core$String$all = _elm_lang$core$Native_String.all;
	var _elm_lang$core$String$any = _elm_lang$core$Native_String.any;
	var _elm_lang$core$String$toLower = _elm_lang$core$Native_String.toLower;
	var _elm_lang$core$String$toUpper = _elm_lang$core$Native_String.toUpper;
	var _elm_lang$core$String$lines = _elm_lang$core$Native_String.lines;
	var _elm_lang$core$String$words = _elm_lang$core$Native_String.words;
	var _elm_lang$core$String$trimRight = _elm_lang$core$Native_String.trimRight;
	var _elm_lang$core$String$trimLeft = _elm_lang$core$Native_String.trimLeft;
	var _elm_lang$core$String$trim = _elm_lang$core$Native_String.trim;
	var _elm_lang$core$String$padRight = _elm_lang$core$Native_String.padRight;
	var _elm_lang$core$String$padLeft = _elm_lang$core$Native_String.padLeft;
	var _elm_lang$core$String$pad = _elm_lang$core$Native_String.pad;
	var _elm_lang$core$String$dropRight = _elm_lang$core$Native_String.dropRight;
	var _elm_lang$core$String$dropLeft = _elm_lang$core$Native_String.dropLeft;
	var _elm_lang$core$String$right = _elm_lang$core$Native_String.right;
	var _elm_lang$core$String$left = _elm_lang$core$Native_String.left;
	var _elm_lang$core$String$slice = _elm_lang$core$Native_String.slice;
	var _elm_lang$core$String$repeat = _elm_lang$core$Native_String.repeat;
	var _elm_lang$core$String$join = _elm_lang$core$Native_String.join;
	var _elm_lang$core$String$split = _elm_lang$core$Native_String.split;
	var _elm_lang$core$String$foldr = _elm_lang$core$Native_String.foldr;
	var _elm_lang$core$String$foldl = _elm_lang$core$Native_String.foldl;
	var _elm_lang$core$String$reverse = _elm_lang$core$Native_String.reverse;
	var _elm_lang$core$String$filter = _elm_lang$core$Native_String.filter;
	var _elm_lang$core$String$map = _elm_lang$core$Native_String.map;
	var _elm_lang$core$String$length = _elm_lang$core$Native_String.length;
	var _elm_lang$core$String$concat = _elm_lang$core$Native_String.concat;
	var _elm_lang$core$String$append = _elm_lang$core$Native_String.append;
	var _elm_lang$core$String$uncons = _elm_lang$core$Native_String.uncons;
	var _elm_lang$core$String$cons = _elm_lang$core$Native_String.cons;
	var _elm_lang$core$String$fromChar = function _elm_lang$core$String$fromChar($char) {
		return A2(_elm_lang$core$String$cons, $char, '');
	};
	var _elm_lang$core$String$isEmpty = _elm_lang$core$Native_String.isEmpty;

	var _elm_lang$core$Tuple$mapSecond = F2(function (func, _p0) {
		var _p1 = _p0;
		return {
			ctor: '_Tuple2',
			_0: _p1._0,
			_1: func(_p1._1)
		};
	});
	var _elm_lang$core$Tuple$mapFirst = F2(function (func, _p2) {
		var _p3 = _p2;
		return {
			ctor: '_Tuple2',
			_0: func(_p3._0),
			_1: _p3._1
		};
	});
	var _elm_lang$core$Tuple$second = function _elm_lang$core$Tuple$second(_p4) {
		var _p5 = _p4;
		return _p5._1;
	};
	var _elm_lang$core$Tuple$first = function _elm_lang$core$Tuple$first(_p6) {
		var _p7 = _p6;
		return _p7._0;
	};

	//import //

	var _elm_lang$core$Native_Platform = function () {

		// PROGRAMS

		function program(impl) {
			return function (flagDecoder) {
				return function (object, moduleName) {
					object['worker'] = function worker(flags) {
						if (typeof flags !== 'undefined') {
							throw new Error('The `' + moduleName + '` module does not need flags.\n' + 'Call ' + moduleName + '.worker() with no arguments and you should be all set!');
						}

						return initialize(impl.init, impl.update, impl.subscriptions, renderer);
					};
				};
			};
		}

		function programWithFlags(impl) {
			return function (flagDecoder) {
				return function (object, moduleName) {
					object['worker'] = function worker(flags) {
						if (typeof flagDecoder === 'undefined') {
							throw new Error('Are you trying to sneak a Never value into Elm? Trickster!\n' + 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n' + 'Use `program` instead if you do not want flags.');
						}

						var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
						if (result.ctor === 'Err') {
							throw new Error(moduleName + '.worker(...) was called with an unexpected argument.\n' + 'I tried to convert it to an Elm value, but ran into this problem:\n\n' + result._0);
						}

						return initialize(impl.init(result._0), impl.update, impl.subscriptions, renderer);
					};
				};
			};
		}

		function renderer(enqueue, _) {
			return function (_) {};
		}

		// HTML TO PROGRAM

		function htmlToProgram(vnode) {
			var emptyBag = batch(_elm_lang$core$Native_List.Nil);
			var noChange = _elm_lang$core$Native_Utils.Tuple2(_elm_lang$core$Native_Utils.Tuple0, emptyBag);

			return _elm_lang$virtual_dom$VirtualDom$program({
				init: noChange,
				view: function view(model) {
					return main;
				},
				update: F2(function (msg, model) {
					return noChange;
				}),
				subscriptions: function subscriptions(model) {
					return emptyBag;
				}
			});
		}

		// INITIALIZE A PROGRAM

		function initialize(init, update, subscriptions, renderer) {
			// ambient state
			var managers = {};
			var updateView;

			// init and update state in main process
			var initApp = _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
				var model = init._0;
				updateView = renderer(enqueue, model);
				var cmds = init._1;
				var subs = subscriptions(model);
				dispatchEffects(managers, cmds, subs);
				callback(_elm_lang$core$Native_Scheduler.succeed(model));
			});

			function onMessage(msg, model) {
				return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
					var results = A2(update, msg, model);
					model = results._0;
					updateView(model);
					var cmds = results._1;
					var subs = subscriptions(model);
					dispatchEffects(managers, cmds, subs);
					callback(_elm_lang$core$Native_Scheduler.succeed(model));
				});
			}

			var mainProcess = spawnLoop(initApp, onMessage);

			function enqueue(msg) {
				_elm_lang$core$Native_Scheduler.rawSend(mainProcess, msg);
			}

			var ports = setupEffects(managers, enqueue);

			return ports ? { ports: ports } : {};
		}

		// EFFECT MANAGERS

		var effectManagers = {};

		function setupEffects(managers, callback) {
			var ports;

			// setup all necessary effect managers
			for (var key in effectManagers) {
				var manager = effectManagers[key];

				if (manager.isForeign) {
					ports = ports || {};
					ports[key] = manager.tag === 'cmd' ? setupOutgoingPort(key) : setupIncomingPort(key, callback);
				}

				managers[key] = makeManager(manager, callback);
			}

			return ports;
		}

		function makeManager(info, callback) {
			var router = {
				main: callback,
				self: undefined
			};

			var tag = info.tag;
			var onEffects = info.onEffects;
			var onSelfMsg = info.onSelfMsg;

			function onMessage(msg, state) {
				if (msg.ctor === 'self') {
					return A3(onSelfMsg, router, msg._0, state);
				}

				var fx = msg._0;
				switch (tag) {
					case 'cmd':
						return A3(onEffects, router, fx.cmds, state);

					case 'sub':
						return A3(onEffects, router, fx.subs, state);

					case 'fx':
						return A4(onEffects, router, fx.cmds, fx.subs, state);
				}
			}

			var process = spawnLoop(info.init, onMessage);
			router.self = process;
			return process;
		}

		function sendToApp(router, msg) {
			return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
				router.main(msg);
				callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
			});
		}

		function sendToSelf(router, msg) {
			return A2(_elm_lang$core$Native_Scheduler.send, router.self, {
				ctor: 'self',
				_0: msg
			});
		}

		// HELPER for STATEFUL LOOPS

		function spawnLoop(init, onMessage) {
			var andThen = _elm_lang$core$Native_Scheduler.andThen;

			function loop(state) {
				var handleMsg = _elm_lang$core$Native_Scheduler.receive(function (msg) {
					return onMessage(msg, state);
				});
				return A2(andThen, loop, handleMsg);
			}

			var task = A2(andThen, loop, init);

			return _elm_lang$core$Native_Scheduler.rawSpawn(task);
		}

		// BAGS

		function leaf(home) {
			return function (value) {
				return {
					type: 'leaf',
					home: home,
					value: value
				};
			};
		}

		function batch(list) {
			return {
				type: 'node',
				branches: list
			};
		}

		function map(tagger, bag) {
			return {
				type: 'map',
				tagger: tagger,
				tree: bag
			};
		}

		// PIPE BAGS INTO EFFECT MANAGERS

		function dispatchEffects(managers, cmdBag, subBag) {
			var effectsDict = {};
			gatherEffects(true, cmdBag, effectsDict, null);
			gatherEffects(false, subBag, effectsDict, null);

			for (var home in managers) {
				var fx = home in effectsDict ? effectsDict[home] : {
					cmds: _elm_lang$core$Native_List.Nil,
					subs: _elm_lang$core$Native_List.Nil
				};

				_elm_lang$core$Native_Scheduler.rawSend(managers[home], { ctor: 'fx', _0: fx });
			}
		}

		function gatherEffects(isCmd, bag, effectsDict, taggers) {
			switch (bag.type) {
				case 'leaf':
					var home = bag.home;
					var effect = toEffect(isCmd, home, taggers, bag.value);
					effectsDict[home] = insert(isCmd, effect, effectsDict[home]);
					return;

				case 'node':
					var list = bag.branches;
					while (list.ctor !== '[]') {
						gatherEffects(isCmd, list._0, effectsDict, taggers);
						list = list._1;
					}
					return;

				case 'map':
					gatherEffects(isCmd, bag.tree, effectsDict, {
						tagger: bag.tagger,
						rest: taggers
					});
					return;
			}
		}

		function toEffect(isCmd, home, taggers, value) {
			function applyTaggers(x) {
				var temp = taggers;
				while (temp) {
					x = temp.tagger(x);
					temp = temp.rest;
				}
				return x;
			}

			var map = isCmd ? effectManagers[home].cmdMap : effectManagers[home].subMap;

			return A2(map, applyTaggers, value);
		}

		function insert(isCmd, newEffect, effects) {
			effects = effects || {
				cmds: _elm_lang$core$Native_List.Nil,
				subs: _elm_lang$core$Native_List.Nil
			};
			if (isCmd) {
				effects.cmds = _elm_lang$core$Native_List.Cons(newEffect, effects.cmds);
				return effects;
			}
			effects.subs = _elm_lang$core$Native_List.Cons(newEffect, effects.subs);
			return effects;
		}

		// PORTS

		function checkPortName(name) {
			if (name in effectManagers) {
				throw new Error('There can only be one port named `' + name + '`, but your program has multiple.');
			}
		}

		// OUTGOING PORTS

		function outgoingPort(name, converter) {
			checkPortName(name);
			effectManagers[name] = {
				tag: 'cmd',
				cmdMap: outgoingPortMap,
				converter: converter,
				isForeign: true
			};
			return leaf(name);
		}

		var outgoingPortMap = F2(function cmdMap(tagger, value) {
			return value;
		});

		function setupOutgoingPort(name) {
			var subs = [];
			var converter = effectManagers[name].converter;

			// CREATE MANAGER

			var init = _elm_lang$core$Native_Scheduler.succeed(null);

			function onEffects(router, cmdList, state) {
				while (cmdList.ctor !== '[]') {
					// grab a separate reference to subs in case unsubscribe is called
					var currentSubs = subs;
					var value = converter(cmdList._0);
					for (var i = 0; i < currentSubs.length; i++) {
						currentSubs[i](value);
					}
					cmdList = cmdList._1;
				}
				return init;
			}

			effectManagers[name].init = init;
			effectManagers[name].onEffects = F3(onEffects);

			// PUBLIC API

			function subscribe(callback) {
				subs.push(callback);
			}

			function unsubscribe(callback) {
				// copy subs into a new array in case unsubscribe is called within a
				// subscribed callback
				subs = subs.slice();
				var index = subs.indexOf(callback);
				if (index >= 0) {
					subs.splice(index, 1);
				}
			}

			return {
				subscribe: subscribe,
				unsubscribe: unsubscribe
			};
		}

		// INCOMING PORTS

		function incomingPort(name, converter) {
			checkPortName(name);
			effectManagers[name] = {
				tag: 'sub',
				subMap: incomingPortMap,
				converter: converter,
				isForeign: true
			};
			return leaf(name);
		}

		var incomingPortMap = F2(function subMap(tagger, finalTagger) {
			return function (value) {
				return tagger(finalTagger(value));
			};
		});

		function setupIncomingPort(name, callback) {
			var sentBeforeInit = [];
			var subs = _elm_lang$core$Native_List.Nil;
			var converter = effectManagers[name].converter;
			var currentOnEffects = preInitOnEffects;
			var currentSend = preInitSend;

			// CREATE MANAGER

			var init = _elm_lang$core$Native_Scheduler.succeed(null);

			function preInitOnEffects(router, subList, state) {
				var postInitResult = postInitOnEffects(router, subList, state);

				for (var i = 0; i < sentBeforeInit.length; i++) {
					postInitSend(sentBeforeInit[i]);
				}

				sentBeforeInit = null; // to release objects held in queue
				currentSend = postInitSend;
				currentOnEffects = postInitOnEffects;
				return postInitResult;
			}

			function postInitOnEffects(router, subList, state) {
				subs = subList;
				return init;
			}

			function onEffects(router, subList, state) {
				return currentOnEffects(router, subList, state);
			}

			effectManagers[name].init = init;
			effectManagers[name].onEffects = F3(onEffects);

			// PUBLIC API

			function preInitSend(value) {
				sentBeforeInit.push(value);
			}

			function postInitSend(value) {
				var temp = subs;
				while (temp.ctor !== '[]') {
					callback(temp._0(value));
					temp = temp._1;
				}
			}

			function send(incomingValue) {
				var result = A2(_elm_lang$core$Json_Decode$decodeValue, converter, incomingValue);
				if (result.ctor === 'Err') {
					throw new Error('Trying to send an unexpected type of value through port `' + name + '`:\n' + result._0);
				}

				currentSend(result._0);
			}

			return { send: send };
		}

		return {
			// routers
			sendToApp: F2(sendToApp),
			sendToSelf: F2(sendToSelf),

			// global setup
			effectManagers: effectManagers,
			outgoingPort: outgoingPort,
			incomingPort: incomingPort,

			htmlToProgram: htmlToProgram,
			program: program,
			programWithFlags: programWithFlags,
			initialize: initialize,

			// effect bags
			leaf: leaf,
			batch: batch,
			map: F2(map)
		};
	}();

	//import Native.Utils //

	var _elm_lang$core$Native_Scheduler = function () {

		var MAX_STEPS = 10000;

		// TASKS

		function succeed(value) {
			return {
				ctor: '_Task_succeed',
				value: value
			};
		}

		function fail(error) {
			return {
				ctor: '_Task_fail',
				value: error
			};
		}

		function nativeBinding(callback) {
			return {
				ctor: '_Task_nativeBinding',
				callback: callback,
				cancel: null
			};
		}

		function andThen(callback, task) {
			return {
				ctor: '_Task_andThen',
				callback: callback,
				task: task
			};
		}

		function onError(callback, task) {
			return {
				ctor: '_Task_onError',
				callback: callback,
				task: task
			};
		}

		function receive(callback) {
			return {
				ctor: '_Task_receive',
				callback: callback
			};
		}

		// PROCESSES

		function rawSpawn(task) {
			var process = {
				ctor: '_Process',
				id: _elm_lang$core$Native_Utils.guid(),
				root: task,
				stack: null,
				mailbox: []
			};

			enqueue(process);

			return process;
		}

		function spawn(task) {
			return nativeBinding(function (callback) {
				var process = rawSpawn(task);
				callback(succeed(process));
			});
		}

		function rawSend(process, msg) {
			process.mailbox.push(msg);
			enqueue(process);
		}

		function send(process, msg) {
			return nativeBinding(function (callback) {
				rawSend(process, msg);
				callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
			});
		}

		function kill(process) {
			return nativeBinding(function (callback) {
				var root = process.root;
				if (root.ctor === '_Task_nativeBinding' && root.cancel) {
					root.cancel();
				}

				process.root = null;

				callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
			});
		}

		function sleep(time) {
			return nativeBinding(function (callback) {
				var id = setTimeout(function () {
					callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
				}, time);

				return function () {
					clearTimeout(id);
				};
			});
		}

		// STEP PROCESSES

		function step(numSteps, process) {
			while (numSteps < MAX_STEPS) {
				var ctor = process.root.ctor;

				if (ctor === '_Task_succeed') {
					while (process.stack && process.stack.ctor === '_Task_onError') {
						process.stack = process.stack.rest;
					}
					if (process.stack === null) {
						break;
					}
					process.root = process.stack.callback(process.root.value);
					process.stack = process.stack.rest;
					++numSteps;
					continue;
				}

				if (ctor === '_Task_fail') {
					while (process.stack && process.stack.ctor === '_Task_andThen') {
						process.stack = process.stack.rest;
					}
					if (process.stack === null) {
						break;
					}
					process.root = process.stack.callback(process.root.value);
					process.stack = process.stack.rest;
					++numSteps;
					continue;
				}

				if (ctor === '_Task_andThen') {
					process.stack = {
						ctor: '_Task_andThen',
						callback: process.root.callback,
						rest: process.stack
					};
					process.root = process.root.task;
					++numSteps;
					continue;
				}

				if (ctor === '_Task_onError') {
					process.stack = {
						ctor: '_Task_onError',
						callback: process.root.callback,
						rest: process.stack
					};
					process.root = process.root.task;
					++numSteps;
					continue;
				}

				if (ctor === '_Task_nativeBinding') {
					process.root.cancel = process.root.callback(function (newRoot) {
						process.root = newRoot;
						enqueue(process);
					});

					break;
				}

				if (ctor === '_Task_receive') {
					var mailbox = process.mailbox;
					if (mailbox.length === 0) {
						break;
					}

					process.root = process.root.callback(mailbox.shift());
					++numSteps;
					continue;
				}

				throw new Error(ctor);
			}

			if (numSteps < MAX_STEPS) {
				return numSteps + 1;
			}
			enqueue(process);

			return numSteps;
		}

		// WORK QUEUE

		var working = false;
		var workQueue = [];

		function enqueue(process) {
			workQueue.push(process);

			if (!working) {
				setTimeout(work, 0);
				working = true;
			}
		}

		function work() {
			var numSteps = 0;
			var process;
			while (numSteps < MAX_STEPS && (process = workQueue.shift())) {
				if (process.root) {
					numSteps = step(numSteps, process);
				}
			}
			if (!process) {
				working = false;
				return;
			}
			setTimeout(work, 0);
		}

		return {
			succeed: succeed,
			fail: fail,
			nativeBinding: nativeBinding,
			andThen: F2(andThen),
			onError: F2(onError),
			receive: receive,

			spawn: spawn,
			kill: kill,
			sleep: sleep,
			send: F2(send),

			rawSpawn: rawSpawn,
			rawSend: rawSend
		};
	}();
	var _elm_lang$core$Platform_Cmd$batch = _elm_lang$core$Native_Platform.batch;
	var _elm_lang$core$Platform_Cmd$none = _elm_lang$core$Platform_Cmd$batch({ ctor: '[]' });
	var _elm_lang$core$Platform_Cmd_ops = _elm_lang$core$Platform_Cmd_ops || {};
	_elm_lang$core$Platform_Cmd_ops['!'] = F2(function (model, commands) {
		return {
			ctor: '_Tuple2',
			_0: model,
			_1: _elm_lang$core$Platform_Cmd$batch(commands)
		};
	});
	var _elm_lang$core$Platform_Cmd$map = _elm_lang$core$Native_Platform.map;
	var _elm_lang$core$Platform_Cmd$Cmd = { ctor: 'Cmd' };

	var _elm_lang$core$Platform_Sub$batch = _elm_lang$core$Native_Platform.batch;
	var _elm_lang$core$Platform_Sub$none = _elm_lang$core$Platform_Sub$batch({ ctor: '[]' });
	var _elm_lang$core$Platform_Sub$map = _elm_lang$core$Native_Platform.map;
	var _elm_lang$core$Platform_Sub$Sub = { ctor: 'Sub' };

	var _elm_lang$core$Platform$hack = _elm_lang$core$Native_Scheduler.succeed;
	var _elm_lang$core$Platform$sendToSelf = _elm_lang$core$Native_Platform.sendToSelf;
	var _elm_lang$core$Platform$sendToApp = _elm_lang$core$Native_Platform.sendToApp;
	var _elm_lang$core$Platform$programWithFlags = _elm_lang$core$Native_Platform.programWithFlags;
	var _elm_lang$core$Platform$program = _elm_lang$core$Native_Platform.program;
	var _elm_lang$core$Platform$Program = { ctor: 'Program' };
	var _elm_lang$core$Platform$Task = { ctor: 'Task' };
	var _elm_lang$core$Platform$ProcessId = { ctor: 'ProcessId' };
	var _elm_lang$core$Platform$Router = { ctor: 'Router' };

	var _elm_lang$lazy$Lazy$force = function _elm_lang$lazy$Lazy$force(_p0) {
		var _p1 = _p0;
		return _p1._0({ ctor: '_Tuple0' });
	};
	var _elm_lang$lazy$Lazy$Lazy = function _elm_lang$lazy$Lazy$Lazy(a) {
		return { ctor: 'Lazy', _0: a };
	};
	var _elm_lang$lazy$Lazy$lazy = function _elm_lang$lazy$Lazy$lazy(thunk) {
		return _elm_lang$lazy$Lazy$Lazy(_elm_lang$lazy$Native_Lazy.memoize(thunk));
	};
	var _elm_lang$lazy$Lazy$map = F2(function (f, a) {
		return _elm_lang$lazy$Lazy$lazy(function (_p2) {
			var _p3 = _p2;
			return f(_elm_lang$lazy$Lazy$force(a));
		});
	});
	var _elm_lang$lazy$Lazy$map2 = F3(function (f, a, b) {
		return _elm_lang$lazy$Lazy$lazy(function (_p4) {
			var _p5 = _p4;
			return A2(f, _elm_lang$lazy$Lazy$force(a), _elm_lang$lazy$Lazy$force(b));
		});
	});
	var _elm_lang$lazy$Lazy$map3 = F4(function (f, a, b, c) {
		return _elm_lang$lazy$Lazy$lazy(function (_p6) {
			var _p7 = _p6;
			return A3(f, _elm_lang$lazy$Lazy$force(a), _elm_lang$lazy$Lazy$force(b), _elm_lang$lazy$Lazy$force(c));
		});
	});
	var _elm_lang$lazy$Lazy$map4 = F5(function (f, a, b, c, d) {
		return _elm_lang$lazy$Lazy$lazy(function (_p8) {
			var _p9 = _p8;
			return A4(f, _elm_lang$lazy$Lazy$force(a), _elm_lang$lazy$Lazy$force(b), _elm_lang$lazy$Lazy$force(c), _elm_lang$lazy$Lazy$force(d));
		});
	});
	var _elm_lang$lazy$Lazy$map5 = F6(function (f, a, b, c, d, e) {
		return _elm_lang$lazy$Lazy$lazy(function (_p10) {
			var _p11 = _p10;
			return A5(f, _elm_lang$lazy$Lazy$force(a), _elm_lang$lazy$Lazy$force(b), _elm_lang$lazy$Lazy$force(c), _elm_lang$lazy$Lazy$force(d), _elm_lang$lazy$Lazy$force(e));
		});
	});
	var _elm_lang$lazy$Lazy$apply = F2(function (f, x) {
		return _elm_lang$lazy$Lazy$lazy(function (_p12) {
			var _p13 = _p12;
			return A2(_elm_lang$lazy$Lazy$force, f, _elm_lang$lazy$Lazy$force(x));
		});
	});
	var _elm_lang$lazy$Lazy$andThen = F2(function (callback, a) {
		return _elm_lang$lazy$Lazy$lazy(function (_p14) {
			var _p15 = _p14;
			return _elm_lang$lazy$Lazy$force(callback(_elm_lang$lazy$Lazy$force(a)));
		});
	});

	//import Maybe, Native.List //

	var _elm_lang$core$Native_Regex = function () {

		function escape(str) {
			return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
		}
		function caseInsensitive(re) {
			return new RegExp(re.source, 'gi');
		}
		function regex(raw) {
			return new RegExp(raw, 'g');
		}

		function contains(re, string) {
			return string.match(re) !== null;
		}

		function find(n, re, str) {
			n = n.ctor === 'All' ? Infinity : n._0;
			var out = [];
			var number = 0;
			var string = str;
			var lastIndex = re.lastIndex;
			var prevLastIndex = -1;
			var result;
			while (number++ < n && (result = re.exec(string))) {
				if (prevLastIndex === re.lastIndex) break;
				var i = result.length - 1;
				var subs = new Array(i);
				while (i > 0) {
					var submatch = result[i];
					subs[--i] = submatch === undefined ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$Maybe$Just(submatch);
				}
				out.push({
					match: result[0],
					submatches: _elm_lang$core$Native_List.fromArray(subs),
					index: result.index,
					number: number
				});
				prevLastIndex = re.lastIndex;
			}
			re.lastIndex = lastIndex;
			return _elm_lang$core$Native_List.fromArray(out);
		}

		function replace(n, re, replacer, string) {
			n = n.ctor === 'All' ? Infinity : n._0;
			var count = 0;
			function jsReplacer(match) {
				if (count++ >= n) {
					return match;
				}
				var i = arguments.length - 3;
				var submatches = new Array(i);
				while (i > 0) {
					var submatch = arguments[i];
					submatches[--i] = submatch === undefined ? _elm_lang$core$Maybe$Nothing : _elm_lang$core$Maybe$Just(submatch);
				}
				return replacer({
					match: match,
					submatches: _elm_lang$core$Native_List.fromArray(submatches),
					index: arguments[arguments.length - 2],
					number: count
				});
			}
			return string.replace(re, jsReplacer);
		}

		function split(n, re, str) {
			n = n.ctor === 'All' ? Infinity : n._0;
			if (n === Infinity) {
				return _elm_lang$core$Native_List.fromArray(str.split(re));
			}
			var string = str;
			var result;
			var out = [];
			var start = re.lastIndex;
			var restoreLastIndex = re.lastIndex;
			while (n--) {
				if (!(result = re.exec(string))) break;
				out.push(string.slice(start, result.index));
				start = re.lastIndex;
			}
			out.push(string.slice(start));
			re.lastIndex = restoreLastIndex;
			return _elm_lang$core$Native_List.fromArray(out);
		}

		return {
			regex: regex,
			caseInsensitive: caseInsensitive,
			escape: escape,

			contains: F2(contains),
			find: F3(find),
			replace: F4(replace),
			split: F3(split)
		};
	}();

	var _elm_lang$core$Regex$split = _elm_lang$core$Native_Regex.split;
	var _elm_lang$core$Regex$replace = _elm_lang$core$Native_Regex.replace;
	var _elm_lang$core$Regex$find = _elm_lang$core$Native_Regex.find;
	var _elm_lang$core$Regex$contains = _elm_lang$core$Native_Regex.contains;
	var _elm_lang$core$Regex$caseInsensitive = _elm_lang$core$Native_Regex.caseInsensitive;
	var _elm_lang$core$Regex$regex = _elm_lang$core$Native_Regex.regex;
	var _elm_lang$core$Regex$escape = _elm_lang$core$Native_Regex.escape;
	var _elm_lang$core$Regex$Match = F4(function (a, b, c, d) {
		return { match: a, submatches: b, index: c, number: d };
	});
	var _elm_lang$core$Regex$Regex = { ctor: 'Regex' };
	var _elm_lang$core$Regex$AtMost = function _elm_lang$core$Regex$AtMost(a) {
		return { ctor: 'AtMost', _0: a };
	};
	var _elm_lang$core$Regex$All = { ctor: 'All' };

	var _Bogdanp$elm_combine$Combine$app = function _Bogdanp$elm_combine$Combine$app(p) {
		var _p0 = p;
		if (_p0.ctor === 'Parser') {
			return _p0._0;
		} else {
			return _elm_lang$lazy$Lazy$force(_p0._0);
		}
	};
	var _Bogdanp$elm_combine$Combine$InputStream = F3(function (a, b, c) {
		return { data: a, input: b, position: c };
	});
	var _Bogdanp$elm_combine$Combine$initStream = function _Bogdanp$elm_combine$Combine$initStream(s) {
		return A3(_Bogdanp$elm_combine$Combine$InputStream, s, s, 0);
	};
	var _Bogdanp$elm_combine$Combine$runParser = F3(function (p, st, s) {
		var _p1 = A3(_Bogdanp$elm_combine$Combine$app, p, st, _Bogdanp$elm_combine$Combine$initStream(s));
		if (_p1._2.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok({ ctor: '_Tuple3', _0: _p1._0, _1: _p1._1, _2: _p1._2._0 });
		} else {
			return _elm_lang$core$Result$Err({ ctor: '_Tuple3', _0: _p1._0, _1: _p1._1, _2: _p1._2._0 });
		}
	});
	var _Bogdanp$elm_combine$Combine$parse = function _Bogdanp$elm_combine$Combine$parse(p) {
		return A2(_Bogdanp$elm_combine$Combine$runParser, p, { ctor: '_Tuple0' });
	};
	var _Bogdanp$elm_combine$Combine$ParseLocation = F3(function (a, b, c) {
		return { source: a, line: b, column: c };
	});
	var _Bogdanp$elm_combine$Combine$currentLocation = function _Bogdanp$elm_combine$Combine$currentLocation(stream) {
		var find = F3(function (position, currentLine, lines) {
			find: while (true) {
				var _p2 = lines;
				if (_p2.ctor === '[]') {
					return A3(_Bogdanp$elm_combine$Combine$ParseLocation, '', 1, position);
				} else {
					if (_p2._1.ctor === '[]') {
						return A3(_Bogdanp$elm_combine$Combine$ParseLocation, _p2._0, currentLine + 1, position);
					} else {
						var _p3 = _p2._0;
						var length = _elm_lang$core$String$length(_p3);
						if (_elm_lang$core$Native_Utils.cmp(position, length) > -1) {
							var _v3 = position - length - 1,
							    _v4 = currentLine + 1,
							    _v5 = _p2._1;
							position = _v3;
							currentLine = _v4;
							lines = _v5;
							continue find;
						} else {
							if (_elm_lang$core$Native_Utils.eq(currentLine, 0)) {
								return A3(_Bogdanp$elm_combine$Combine$ParseLocation, _p3, 1, position);
							} else {
								return A3(_Bogdanp$elm_combine$Combine$ParseLocation, _p3, currentLine, position - 1);
							}
						}
					}
				}
			}
		});
		var lines = A2(_elm_lang$core$String$split, '\n', stream.data);
		return A3(find, stream.position, 0, lines);
	};
	var _Bogdanp$elm_combine$Combine$currentSourceLine = function _Bogdanp$elm_combine$Combine$currentSourceLine(_p4) {
		return function (_) {
			return _.source;
		}(_Bogdanp$elm_combine$Combine$currentLocation(_p4));
	};
	var _Bogdanp$elm_combine$Combine$currentLine = function _Bogdanp$elm_combine$Combine$currentLine(_p5) {
		return function (_) {
			return _.line;
		}(_Bogdanp$elm_combine$Combine$currentLocation(_p5));
	};
	var _Bogdanp$elm_combine$Combine$currentColumn = function _Bogdanp$elm_combine$Combine$currentColumn(_p6) {
		return function (_) {
			return _.column;
		}(_Bogdanp$elm_combine$Combine$currentLocation(_p6));
	};
	var _Bogdanp$elm_combine$Combine$RecursiveParser = function _Bogdanp$elm_combine$Combine$RecursiveParser(a) {
		return { ctor: 'RecursiveParser', _0: a };
	};
	var _Bogdanp$elm_combine$Combine$lazy = function _Bogdanp$elm_combine$Combine$lazy(t) {
		return _Bogdanp$elm_combine$Combine$RecursiveParser(_elm_lang$lazy$Lazy$lazy(function (_p7) {
			var _p8 = _p7;
			return _Bogdanp$elm_combine$Combine$app(t({ ctor: '_Tuple0' }));
		}));
	};
	var _Bogdanp$elm_combine$Combine$Parser = function _Bogdanp$elm_combine$Combine$Parser(a) {
		return { ctor: 'Parser', _0: a };
	};
	var _Bogdanp$elm_combine$Combine$primitive = _Bogdanp$elm_combine$Combine$Parser;
	var _Bogdanp$elm_combine$Combine$bimap = F3(function (fok, ferr, p) {
		return _Bogdanp$elm_combine$Combine$Parser(F2(function (state, stream) {
			var _p9 = A3(_Bogdanp$elm_combine$Combine$app, p, state, stream);
			if (_p9._2.ctor === 'Ok') {
				return {
					ctor: '_Tuple3',
					_0: _p9._0,
					_1: _p9._1,
					_2: _elm_lang$core$Result$Ok(fok(_p9._2._0))
				};
			} else {
				return {
					ctor: '_Tuple3',
					_0: _p9._0,
					_1: _p9._1,
					_2: _elm_lang$core$Result$Err(ferr(_p9._2._0))
				};
			}
		}));
	});
	var _Bogdanp$elm_combine$Combine$map = F2(function (f, p) {
		return A3(_Bogdanp$elm_combine$Combine$bimap, f, _elm_lang$core$Basics$identity, p);
	});
	var _Bogdanp$elm_combine$Combine_ops = _Bogdanp$elm_combine$Combine_ops || {};
	_Bogdanp$elm_combine$Combine_ops['<$>'] = _Bogdanp$elm_combine$Combine$map;
	var _Bogdanp$elm_combine$Combine_ops = _Bogdanp$elm_combine$Combine_ops || {};
	_Bogdanp$elm_combine$Combine_ops['<$'] = function (res) {
		return _Bogdanp$elm_combine$Combine$map(_elm_lang$core$Basics$always(res));
	};
	var _Bogdanp$elm_combine$Combine$skip = function _Bogdanp$elm_combine$Combine$skip(p) {
		return A2(_Bogdanp$elm_combine$Combine_ops['<$'], { ctor: '_Tuple0' }, p);
	};
	var _Bogdanp$elm_combine$Combine_ops = _Bogdanp$elm_combine$Combine_ops || {};
	_Bogdanp$elm_combine$Combine_ops['$>'] = _elm_lang$core$Basics$flip(F2(function (x, y) {
		return A2(_Bogdanp$elm_combine$Combine_ops['<$'], x, y);
	}));
	var _Bogdanp$elm_combine$Combine$mapError = _Bogdanp$elm_combine$Combine$bimap(_elm_lang$core$Basics$identity);
	var _Bogdanp$elm_combine$Combine_ops = _Bogdanp$elm_combine$Combine_ops || {};
	_Bogdanp$elm_combine$Combine_ops['<?>'] = F2(function (p, m) {
		return A2(_Bogdanp$elm_combine$Combine$mapError, _elm_lang$core$Basics$always({
			ctor: '::',
			_0: m,
			_1: { ctor: '[]' }
		}), p);
	});
	var _Bogdanp$elm_combine$Combine$withState = function _Bogdanp$elm_combine$Combine$withState(f) {
		return _Bogdanp$elm_combine$Combine$Parser(F2(function (state, stream) {
			return A3(_Bogdanp$elm_combine$Combine$app, f(state), state, stream);
		}));
	};
	var _Bogdanp$elm_combine$Combine$withLocation = function _Bogdanp$elm_combine$Combine$withLocation(f) {
		return _Bogdanp$elm_combine$Combine$Parser(F2(function (state, stream) {
			return A3(_Bogdanp$elm_combine$Combine$app, f(_Bogdanp$elm_combine$Combine$currentLocation(stream)), state, stream);
		}));
	};
	var _Bogdanp$elm_combine$Combine$withLine = function _Bogdanp$elm_combine$Combine$withLine(f) {
		return _Bogdanp$elm_combine$Combine$Parser(F2(function (state, stream) {
			return A3(_Bogdanp$elm_combine$Combine$app, f(_Bogdanp$elm_combine$Combine$currentLine(stream)), state, stream);
		}));
	};
	var _Bogdanp$elm_combine$Combine$withColumn = function _Bogdanp$elm_combine$Combine$withColumn(f) {
		return _Bogdanp$elm_combine$Combine$Parser(F2(function (state, stream) {
			return A3(_Bogdanp$elm_combine$Combine$app, f(_Bogdanp$elm_combine$Combine$currentColumn(stream)), state, stream);
		}));
	};
	var _Bogdanp$elm_combine$Combine$andThen = F2(function (f, p) {
		return _Bogdanp$elm_combine$Combine$Parser(F2(function (state, stream) {
			var _p10 = A3(_Bogdanp$elm_combine$Combine$app, p, state, stream);
			if (_p10._2.ctor === 'Ok') {
				return A3(_Bogdanp$elm_combine$Combine$app, f(_p10._2._0), _p10._0, _p10._1);
			} else {
				return {
					ctor: '_Tuple3',
					_0: _p10._0,
					_1: _p10._1,
					_2: _elm_lang$core$Result$Err(_p10._2._0)
				};
			}
		}));
	});
	var _Bogdanp$elm_combine$Combine_ops = _Bogdanp$elm_combine$Combine_ops || {};
	_Bogdanp$elm_combine$Combine_ops['>>='] = _elm_lang$core$Basics$flip(_Bogdanp$elm_combine$Combine$andThen);
	var _Bogdanp$elm_combine$Combine$andMap = F2(function (rp, lp) {
		return A2(_Bogdanp$elm_combine$Combine_ops['>>='], lp, A2(_elm_lang$core$Basics$flip, _Bogdanp$elm_combine$Combine$map, rp));
	});
	var _Bogdanp$elm_combine$Combine_ops = _Bogdanp$elm_combine$Combine_ops || {};
	_Bogdanp$elm_combine$Combine_ops['<*>'] = _elm_lang$core$Basics$flip(_Bogdanp$elm_combine$Combine$andMap);
	var _Bogdanp$elm_combine$Combine_ops = _Bogdanp$elm_combine$Combine_ops || {};
	_Bogdanp$elm_combine$Combine_ops['<*'] = F2(function (lp, rp) {
		return A2(_Bogdanp$elm_combine$Combine$andMap, rp, A2(_Bogdanp$elm_combine$Combine$map, _elm_lang$core$Basics$always, lp));
	});
	var _Bogdanp$elm_combine$Combine_ops = _Bogdanp$elm_combine$Combine_ops || {};
	_Bogdanp$elm_combine$Combine_ops['*>'] = F2(function (lp, rp) {
		return A2(_Bogdanp$elm_combine$Combine$andMap, rp, A2(_Bogdanp$elm_combine$Combine$map, _elm_lang$core$Basics$flip(_elm_lang$core$Basics$always), lp));
	});
	var _Bogdanp$elm_combine$Combine$between = F3(function (lp, rp, p) {
		return A2(_Bogdanp$elm_combine$Combine_ops['<*'], A2(_Bogdanp$elm_combine$Combine_ops['*>'], lp, p), rp);
	});
	var _Bogdanp$elm_combine$Combine$sequence = function _Bogdanp$elm_combine$Combine$sequence(ps) {
		var accumulate = F4(function (acc, ps, state, stream) {
			accumulate: while (true) {
				var _p11 = ps;
				if (_p11.ctor === '[]') {
					return {
						ctor: '_Tuple3',
						_0: state,
						_1: stream,
						_2: _elm_lang$core$Result$Ok(_elm_lang$core$List$reverse(acc))
					};
				} else {
					var _p12 = A3(_Bogdanp$elm_combine$Combine$app, _p11._0, state, stream);
					if (_p12._2.ctor === 'Ok') {
						var _v11 = { ctor: '::', _0: _p12._2._0, _1: acc },
						    _v12 = _p11._1,
						    _v13 = _p12._0,
						    _v14 = _p12._1;
						acc = _v11;
						ps = _v12;
						state = _v13;
						stream = _v14;
						continue accumulate;
					} else {
						return {
							ctor: '_Tuple3',
							_0: _p12._0,
							_1: _p12._1,
							_2: _elm_lang$core$Result$Err(_p12._2._0)
						};
					}
				}
			}
		});
		return _Bogdanp$elm_combine$Combine$Parser(F2(function (state, stream) {
			return A4(accumulate, { ctor: '[]' }, ps, state, stream);
		}));
	};
	var _Bogdanp$elm_combine$Combine$fail = function _Bogdanp$elm_combine$Combine$fail(m) {
		return _Bogdanp$elm_combine$Combine$Parser(F2(function (state, stream) {
			return {
				ctor: '_Tuple3',
				_0: state,
				_1: stream,
				_2: _elm_lang$core$Result$Err({
					ctor: '::',
					_0: m,
					_1: { ctor: '[]' }
				})
			};
		}));
	};
	var _Bogdanp$elm_combine$Combine$emptyErr = _Bogdanp$elm_combine$Combine$Parser(F2(function (state, stream) {
		return {
			ctor: '_Tuple3',
			_0: state,
			_1: stream,
			_2: _elm_lang$core$Result$Err({ ctor: '[]' })
		};
	}));
	var _Bogdanp$elm_combine$Combine$succeed = function _Bogdanp$elm_combine$Combine$succeed(res) {
		return _Bogdanp$elm_combine$Combine$Parser(F2(function (state, stream) {
			return {
				ctor: '_Tuple3',
				_0: state,
				_1: stream,
				_2: _elm_lang$core$Result$Ok(res)
			};
		}));
	};
	var _Bogdanp$elm_combine$Combine$putState = function _Bogdanp$elm_combine$Combine$putState(state) {
		return _Bogdanp$elm_combine$Combine$Parser(F2(function (_p13, stream) {
			return A3(_Bogdanp$elm_combine$Combine$app, _Bogdanp$elm_combine$Combine$succeed({ ctor: '_Tuple0' }), state, stream);
		}));
	};
	var _Bogdanp$elm_combine$Combine$modifyState = function _Bogdanp$elm_combine$Combine$modifyState(f) {
		return _Bogdanp$elm_combine$Combine$Parser(F2(function (state, stream) {
			return A3(_Bogdanp$elm_combine$Combine$app, _Bogdanp$elm_combine$Combine$succeed({ ctor: '_Tuple0' }), f(state), stream);
		}));
	};
	var _Bogdanp$elm_combine$Combine$count = F2(function (n, p) {
		var accumulate = F2(function (x, acc) {
			return _elm_lang$core$Native_Utils.cmp(x, 0) < 1 ? _Bogdanp$elm_combine$Combine$succeed(_elm_lang$core$List$reverse(acc)) : A2(_Bogdanp$elm_combine$Combine$andThen, function (res) {
				return A2(accumulate, x - 1, { ctor: '::', _0: res, _1: acc });
			}, p);
		});
		return A2(accumulate, n, { ctor: '[]' });
	});
	var _Bogdanp$elm_combine$Combine$string = function _Bogdanp$elm_combine$Combine$string(s) {
		return _Bogdanp$elm_combine$Combine$Parser(F2(function (state, stream) {
			if (A2(_elm_lang$core$String$startsWith, s, stream.input)) {
				var len = _elm_lang$core$String$length(s);
				var rem = A2(_elm_lang$core$String$dropLeft, len, stream.input);
				var pos = stream.position + len;
				return {
					ctor: '_Tuple3',
					_0: state,
					_1: _elm_lang$core$Native_Utils.update(stream, { input: rem, position: pos }),
					_2: _elm_lang$core$Result$Ok(s)
				};
			} else {
				return {
					ctor: '_Tuple3',
					_0: state,
					_1: stream,
					_2: _elm_lang$core$Result$Err({
						ctor: '::',
						_0: A2(_elm_lang$core$Basics_ops['++'], 'expected ', _elm_lang$core$Basics$toString(s)),
						_1: { ctor: '[]' }
					})
				};
			}
		}));
	};
	var _Bogdanp$elm_combine$Combine$parens = A2(_Bogdanp$elm_combine$Combine$between, _Bogdanp$elm_combine$Combine$string('('), _Bogdanp$elm_combine$Combine$string(')'));
	var _Bogdanp$elm_combine$Combine$braces = A2(_Bogdanp$elm_combine$Combine$between, _Bogdanp$elm_combine$Combine$string('{'), _Bogdanp$elm_combine$Combine$string('}'));
	var _Bogdanp$elm_combine$Combine$brackets = A2(_Bogdanp$elm_combine$Combine$between, _Bogdanp$elm_combine$Combine$string('['), _Bogdanp$elm_combine$Combine$string(']'));
	var _Bogdanp$elm_combine$Combine$regex = function _Bogdanp$elm_combine$Combine$regex(pat) {
		var pattern = A2(_elm_lang$core$String$startsWith, '^', pat) ? pat : A2(_elm_lang$core$Basics_ops['++'], '^', pat);
		return _Bogdanp$elm_combine$Combine$Parser(F2(function (state, stream) {
			var _p14 = A3(_elm_lang$core$Regex$find, _elm_lang$core$Regex$AtMost(1), _elm_lang$core$Regex$regex(pattern), stream.input);
			if (_p14.ctor === '::' && _p14._1.ctor === '[]') {
				var _p15 = _p14._0;
				var len = _elm_lang$core$String$length(_p15.match);
				var rem = A2(_elm_lang$core$String$dropLeft, len, stream.input);
				var pos = stream.position + len;
				return {
					ctor: '_Tuple3',
					_0: state,
					_1: _elm_lang$core$Native_Utils.update(stream, { input: rem, position: pos }),
					_2: _elm_lang$core$Result$Ok(_p15.match)
				};
			} else {
				return {
					ctor: '_Tuple3',
					_0: state,
					_1: stream,
					_2: _elm_lang$core$Result$Err({
						ctor: '::',
						_0: A2(_elm_lang$core$Basics_ops['++'], 'expected input matching Regexp /', A2(_elm_lang$core$Basics_ops['++'], pattern, '/')),
						_1: { ctor: '[]' }
					})
				};
			}
		}));
	};
	var _Bogdanp$elm_combine$Combine$whitespace = A2(_Bogdanp$elm_combine$Combine_ops['<?>'], _Bogdanp$elm_combine$Combine$regex('[ \t\r\n]*'), 'whitespace');
	var _Bogdanp$elm_combine$Combine$while = function _Bogdanp$elm_combine$Combine$while(pred) {
		var accumulate = F3(function (acc, state, stream) {
			accumulate: while (true) {
				var _p16 = _elm_lang$core$String$uncons(stream.input);
				if (_p16.ctor === 'Just') {
					var _p17 = _p16._0._0;
					if (pred(_p17)) {
						var pos = stream.position + 1;
						var c = A2(_elm_lang$core$String$cons, _p17, '');
						var _v17 = A2(_elm_lang$core$Basics_ops['++'], acc, c),
						    _v18 = state,
						    _v19 = _elm_lang$core$Native_Utils.update(stream, { input: _p16._0._1, position: pos });
						acc = _v17;
						state = _v18;
						stream = _v19;
						continue accumulate;
					} else {
						return { ctor: '_Tuple3', _0: state, _1: stream, _2: acc };
					}
				} else {
					return { ctor: '_Tuple3', _0: state, _1: stream, _2: acc };
				}
			}
		});
		return _Bogdanp$elm_combine$Combine$Parser(F2(function (state, stream) {
			var _p18 = A3(accumulate, '', state, stream);
			var rstate = _p18._0;
			var rstream = _p18._1;
			var res = _p18._2;
			return {
				ctor: '_Tuple3',
				_0: rstate,
				_1: rstream,
				_2: _elm_lang$core$Result$Ok(res)
			};
		}));
	};
	var _Bogdanp$elm_combine$Combine$end = _Bogdanp$elm_combine$Combine$Parser(F2(function (state, stream) {
		return _elm_lang$core$Native_Utils.eq(stream.input, '') ? {
			ctor: '_Tuple3',
			_0: state,
			_1: stream,
			_2: _elm_lang$core$Result$Ok({ ctor: '_Tuple0' })
		} : {
			ctor: '_Tuple3',
			_0: state,
			_1: stream,
			_2: _elm_lang$core$Result$Err({
				ctor: '::',
				_0: 'expected end of input',
				_1: { ctor: '[]' }
			})
		};
	}));
	var _Bogdanp$elm_combine$Combine$lookAhead = function _Bogdanp$elm_combine$Combine$lookAhead(p) {
		return _Bogdanp$elm_combine$Combine$Parser(F2(function (state, stream) {
			var _p19 = A3(_Bogdanp$elm_combine$Combine$app, p, state, stream);
			if (_p19.ctor === '_Tuple3' && _p19._2.ctor === 'Ok') {
				return {
					ctor: '_Tuple3',
					_0: _p19._0,
					_1: stream,
					_2: _elm_lang$core$Result$Ok(_p19._2._0)
				};
			} else {
				return _p19;
			}
		}));
	};
	var _Bogdanp$elm_combine$Combine$or = F2(function (lp, rp) {
		return _Bogdanp$elm_combine$Combine$Parser(F2(function (state, stream) {
			var _p20 = A3(_Bogdanp$elm_combine$Combine$app, lp, state, stream);
			if (_p20._2.ctor === 'Ok') {
				return _p20;
			} else {
				var _p21 = A3(_Bogdanp$elm_combine$Combine$app, rp, state, stream);
				if (_p21._2.ctor === 'Ok') {
					return _p21;
				} else {
					return {
						ctor: '_Tuple3',
						_0: state,
						_1: stream,
						_2: _elm_lang$core$Result$Err(A2(_elm_lang$core$Basics_ops['++'], _p20._2._0, _p21._2._0))
					};
				}
			}
		}));
	});
	var _Bogdanp$elm_combine$Combine$choice = function _Bogdanp$elm_combine$Combine$choice(xs) {
		return A3(_elm_lang$core$List$foldr, _Bogdanp$elm_combine$Combine$or, _Bogdanp$elm_combine$Combine$emptyErr, xs);
	};
	var _Bogdanp$elm_combine$Combine_ops = _Bogdanp$elm_combine$Combine_ops || {};
	_Bogdanp$elm_combine$Combine_ops['<|>'] = _Bogdanp$elm_combine$Combine$or;
	var _Bogdanp$elm_combine$Combine$optional = F2(function (res, p) {
		return A2(_Bogdanp$elm_combine$Combine_ops['<|>'], p, _Bogdanp$elm_combine$Combine$succeed(res));
	});
	var _Bogdanp$elm_combine$Combine$chainl = F2(function (op, p) {
		var accumulate = function accumulate(x) {
			return A2(_Bogdanp$elm_combine$Combine_ops['<|>'], A2(_Bogdanp$elm_combine$Combine$andThen, function (f) {
				return A2(_Bogdanp$elm_combine$Combine$andThen, function (y) {
					return accumulate(A2(f, x, y));
				}, p);
			}, op), _Bogdanp$elm_combine$Combine$succeed(x));
		};
		return A2(_Bogdanp$elm_combine$Combine$andThen, accumulate, p);
	});
	var _Bogdanp$elm_combine$Combine$chainr = F2(function (op, p) {
		var accumulate = function accumulate(x) {
			return A2(_Bogdanp$elm_combine$Combine_ops['<|>'], A2(_Bogdanp$elm_combine$Combine$andThen, function (f) {
				return A2(_Bogdanp$elm_combine$Combine$andThen, function (y) {
					return _Bogdanp$elm_combine$Combine$succeed(A2(f, x, y));
				}, A2(_Bogdanp$elm_combine$Combine$andThen, accumulate, p));
			}, op), _Bogdanp$elm_combine$Combine$succeed(x));
		};
		return A2(_Bogdanp$elm_combine$Combine$andThen, accumulate, p);
	});
	var _Bogdanp$elm_combine$Combine$maybe = function _Bogdanp$elm_combine$Combine$maybe(p) {
		return _Bogdanp$elm_combine$Combine$Parser(F2(function (state, stream) {
			var _p22 = A3(_Bogdanp$elm_combine$Combine$app, p, state, stream);
			if (_p22.ctor === '_Tuple3' && _p22._2.ctor === 'Ok') {
				return {
					ctor: '_Tuple3',
					_0: _p22._0,
					_1: _p22._1,
					_2: _elm_lang$core$Result$Ok(_elm_lang$core$Maybe$Just(_p22._2._0))
				};
			} else {
				return {
					ctor: '_Tuple3',
					_0: state,
					_1: stream,
					_2: _elm_lang$core$Result$Ok(_elm_lang$core$Maybe$Nothing)
				};
			}
		}));
	};
	var _Bogdanp$elm_combine$Combine$many = function _Bogdanp$elm_combine$Combine$many(p) {
		var accumulate = F3(function (acc, state, stream) {
			accumulate: while (true) {
				var _p23 = A3(_Bogdanp$elm_combine$Combine$app, p, state, stream);
				if (_p23.ctor === '_Tuple3' && _p23._2.ctor === 'Ok') {
					var _p25 = _p23._1;
					var _p24 = _p23._0;
					if (_elm_lang$core$Native_Utils.eq(stream, _p25)) {
						return {
							ctor: '_Tuple3',
							_0: _p24,
							_1: _p25,
							_2: _elm_lang$core$List$reverse(acc)
						};
					} else {
						var _v25 = { ctor: '::', _0: _p23._2._0, _1: acc },
						    _v26 = _p24,
						    _v27 = _p25;
						acc = _v25;
						state = _v26;
						stream = _v27;
						continue accumulate;
					}
				} else {
					return {
						ctor: '_Tuple3',
						_0: state,
						_1: stream,
						_2: _elm_lang$core$List$reverse(acc)
					};
				}
			}
		});
		return _Bogdanp$elm_combine$Combine$Parser(F2(function (state, stream) {
			var _p26 = A3(accumulate, { ctor: '[]' }, state, stream);
			var rstate = _p26._0;
			var rstream = _p26._1;
			var res = _p26._2;
			return {
				ctor: '_Tuple3',
				_0: rstate,
				_1: rstream,
				_2: _elm_lang$core$Result$Ok(res)
			};
		}));
	};
	var _Bogdanp$elm_combine$Combine$many1 = function _Bogdanp$elm_combine$Combine$many1(p) {
		return A2(_Bogdanp$elm_combine$Combine_ops['<*>'], A2(_Bogdanp$elm_combine$Combine_ops['<$>'], F2(function (x, y) {
			return { ctor: '::', _0: x, _1: y };
		}), p), _Bogdanp$elm_combine$Combine$many(p));
	};
	var _Bogdanp$elm_combine$Combine$skipMany1 = function _Bogdanp$elm_combine$Combine$skipMany1(p) {
		return A2(_Bogdanp$elm_combine$Combine_ops['<$'], { ctor: '_Tuple0' }, _Bogdanp$elm_combine$Combine$many1(_Bogdanp$elm_combine$Combine$skip(p)));
	};
	var _Bogdanp$elm_combine$Combine$sepBy1 = F2(function (sep, p) {
		return A2(_Bogdanp$elm_combine$Combine_ops['<*>'], A2(_Bogdanp$elm_combine$Combine_ops['<$>'], F2(function (x, y) {
			return { ctor: '::', _0: x, _1: y };
		}), p), _Bogdanp$elm_combine$Combine$many(A2(_Bogdanp$elm_combine$Combine_ops['*>'], sep, p)));
	});
	var _Bogdanp$elm_combine$Combine$sepBy = F2(function (sep, p) {
		return A2(_Bogdanp$elm_combine$Combine_ops['<|>'], A2(_Bogdanp$elm_combine$Combine$sepBy1, sep, p), _Bogdanp$elm_combine$Combine$succeed({ ctor: '[]' }));
	});
	var _Bogdanp$elm_combine$Combine$sepEndBy1 = F2(function (sep, p) {
		return A2(_Bogdanp$elm_combine$Combine_ops['<*'], A2(_Bogdanp$elm_combine$Combine$sepBy1, sep, p), _Bogdanp$elm_combine$Combine$maybe(sep));
	});
	var _Bogdanp$elm_combine$Combine$sepEndBy = F2(function (sep, p) {
		return A2(_Bogdanp$elm_combine$Combine_ops['<|>'], A2(_Bogdanp$elm_combine$Combine$sepEndBy1, sep, p), _Bogdanp$elm_combine$Combine$succeed({ ctor: '[]' }));
	});
	var _Bogdanp$elm_combine$Combine$skipMany = function _Bogdanp$elm_combine$Combine$skipMany(p) {
		return A2(_Bogdanp$elm_combine$Combine_ops['<$'], { ctor: '_Tuple0' }, _Bogdanp$elm_combine$Combine$many(_Bogdanp$elm_combine$Combine$skip(p)));
	};
	var _Bogdanp$elm_combine$Combine$manyTill = F2(function (p, end) {
		var accumulate = F3(function (acc, state, stream) {
			accumulate: while (true) {
				var _p27 = A3(_Bogdanp$elm_combine$Combine$app, end, state, stream);
				if (_p27._2.ctor === 'Ok') {
					return {
						ctor: '_Tuple3',
						_0: _p27._0,
						_1: _p27._1,
						_2: _elm_lang$core$Result$Ok(_elm_lang$core$List$reverse(acc))
					};
				} else {
					var _p28 = A3(_Bogdanp$elm_combine$Combine$app, p, state, stream);
					if (_p28.ctor === '_Tuple3' && _p28._2.ctor === 'Ok') {
						var _v30 = { ctor: '::', _0: _p28._2._0, _1: acc },
						    _v31 = _p28._0,
						    _v32 = _p28._1;
						acc = _v30;
						state = _v31;
						stream = _v32;
						continue accumulate;
					} else {
						return {
							ctor: '_Tuple3',
							_0: _p27._0,
							_1: _p27._1,
							_2: _elm_lang$core$Result$Err(_p27._2._0)
						};
					}
				}
			}
		});
		return _Bogdanp$elm_combine$Combine$Parser(accumulate({ ctor: '[]' }));
	});

	var _Bogdanp$elm_combine$Combine_Char$crlf = A2(_Bogdanp$elm_combine$Combine_ops['<$'], _elm_lang$core$Native_Utils.chr('\n'), A2(_Bogdanp$elm_combine$Combine_ops['<?>'], _Bogdanp$elm_combine$Combine$regex('\r\n'), 'expected crlf'));
	var _Bogdanp$elm_combine$Combine_Char$satisfy = function _Bogdanp$elm_combine$Combine_Char$satisfy(pred) {
		return _Bogdanp$elm_combine$Combine$primitive(F2(function (state, stream) {
			var message = 'could not satisfy predicate';
			var _p0 = _elm_lang$core$String$uncons(stream.input);
			if (_p0.ctor === 'Just') {
				var _p1 = _p0._0._0;
				return pred(_p1) ? {
					ctor: '_Tuple3',
					_0: state,
					_1: _elm_lang$core$Native_Utils.update(stream, { input: _p0._0._1, position: stream.position + 1 }),
					_2: _elm_lang$core$Result$Ok(_p1)
				} : {
					ctor: '_Tuple3',
					_0: state,
					_1: stream,
					_2: _elm_lang$core$Result$Err({
						ctor: '::',
						_0: message,
						_1: { ctor: '[]' }
					})
				};
			} else {
				return {
					ctor: '_Tuple3',
					_0: state,
					_1: stream,
					_2: _elm_lang$core$Result$Err({
						ctor: '::',
						_0: message,
						_1: { ctor: '[]' }
					})
				};
			}
		}));
	};
	var _Bogdanp$elm_combine$Combine_Char$char = function _Bogdanp$elm_combine$Combine_Char$char(c) {
		return A2(_Bogdanp$elm_combine$Combine_ops['<?>'], _Bogdanp$elm_combine$Combine_Char$satisfy(F2(function (x, y) {
			return _elm_lang$core$Native_Utils.eq(x, y);
		})(c)), A2(_elm_lang$core$Basics_ops['++'], 'expected ', _elm_lang$core$Basics$toString(c)));
	};
	var _Bogdanp$elm_combine$Combine_Char$anyChar = A2(_Bogdanp$elm_combine$Combine_ops['<?>'], _Bogdanp$elm_combine$Combine_Char$satisfy(_elm_lang$core$Basics$always(true)), 'expected any character');
	var _Bogdanp$elm_combine$Combine_Char$oneOf = function _Bogdanp$elm_combine$Combine_Char$oneOf(cs) {
		return A2(_Bogdanp$elm_combine$Combine_ops['<?>'], _Bogdanp$elm_combine$Combine_Char$satisfy(A2(_elm_lang$core$Basics$flip, _elm_lang$core$List$member, cs)), A2(_elm_lang$core$Basics_ops['++'], 'expected one of ', _elm_lang$core$Basics$toString(cs)));
	};
	var _Bogdanp$elm_combine$Combine_Char$noneOf = function _Bogdanp$elm_combine$Combine_Char$noneOf(cs) {
		return A2(_Bogdanp$elm_combine$Combine_ops['<?>'], _Bogdanp$elm_combine$Combine_Char$satisfy(function (_p2) {
			return !A3(_elm_lang$core$Basics$flip, _elm_lang$core$List$member, cs, _p2);
		}), A2(_elm_lang$core$Basics_ops['++'], 'expected none of ', _elm_lang$core$Basics$toString(cs)));
	};
	var _Bogdanp$elm_combine$Combine_Char$space = A2(_Bogdanp$elm_combine$Combine_ops['<?>'], _Bogdanp$elm_combine$Combine_Char$satisfy(F2(function (x, y) {
		return _elm_lang$core$Native_Utils.eq(x, y);
	})(_elm_lang$core$Native_Utils.chr(' '))), 'expected space');
	var _Bogdanp$elm_combine$Combine_Char$tab = A2(_Bogdanp$elm_combine$Combine_ops['<?>'], _Bogdanp$elm_combine$Combine_Char$satisfy(F2(function (x, y) {
		return _elm_lang$core$Native_Utils.eq(x, y);
	})(_elm_lang$core$Native_Utils.chr('\t'))), 'expected tab');
	var _Bogdanp$elm_combine$Combine_Char$newline = A2(_Bogdanp$elm_combine$Combine_ops['<?>'], _Bogdanp$elm_combine$Combine_Char$satisfy(F2(function (x, y) {
		return _elm_lang$core$Native_Utils.eq(x, y);
	})(_elm_lang$core$Native_Utils.chr('\n'))), 'expected newline');
	var _Bogdanp$elm_combine$Combine_Char$eol = A2(_Bogdanp$elm_combine$Combine_ops['<|>'], _Bogdanp$elm_combine$Combine_Char$newline, _Bogdanp$elm_combine$Combine_Char$crlf);
	var _Bogdanp$elm_combine$Combine_Char$lower = A2(_Bogdanp$elm_combine$Combine_ops['<?>'], _Bogdanp$elm_combine$Combine_Char$satisfy(_elm_lang$core$Char$isLower), 'expected a lowercase character');
	var _Bogdanp$elm_combine$Combine_Char$upper = A2(_Bogdanp$elm_combine$Combine_ops['<?>'], _Bogdanp$elm_combine$Combine_Char$satisfy(_elm_lang$core$Char$isUpper), 'expected an uppercase character');
	var _Bogdanp$elm_combine$Combine_Char$digit = A2(_Bogdanp$elm_combine$Combine_ops['<?>'], _Bogdanp$elm_combine$Combine_Char$satisfy(_elm_lang$core$Char$isDigit), 'expected a digit');
	var _Bogdanp$elm_combine$Combine_Char$octDigit = A2(_Bogdanp$elm_combine$Combine_ops['<?>'], _Bogdanp$elm_combine$Combine_Char$satisfy(_elm_lang$core$Char$isOctDigit), 'expected an octal digit');
	var _Bogdanp$elm_combine$Combine_Char$hexDigit = A2(_Bogdanp$elm_combine$Combine_ops['<?>'], _Bogdanp$elm_combine$Combine_Char$satisfy(_elm_lang$core$Char$isHexDigit), 'expected a hexadecimal digit');

	var _Bogdanp$elm_combine$Combine_Num$digit = function () {
		var toDigit = function toDigit(c) {
			return _elm_lang$core$Char$toCode(c) - _elm_lang$core$Char$toCode(_elm_lang$core$Native_Utils.chr('0'));
		};
		return A2(_Bogdanp$elm_combine$Combine_ops['<$>'], toDigit, A2(_Bogdanp$elm_combine$Combine_ops['<?>'], _Bogdanp$elm_combine$Combine_Char$digit, 'expected a digit'));
	}();
	var _Bogdanp$elm_combine$Combine_Num$sign = A2(_Bogdanp$elm_combine$Combine$optional, 1, _Bogdanp$elm_combine$Combine$choice({
		ctor: '::',
		_0: A2(_Bogdanp$elm_combine$Combine_ops['<$'], 1, _Bogdanp$elm_combine$Combine$string('+')),
		_1: {
			ctor: '::',
			_0: A2(_Bogdanp$elm_combine$Combine_ops['<$'], -1, _Bogdanp$elm_combine$Combine$string('-')),
			_1: { ctor: '[]' }
		}
	}));
	var _Bogdanp$elm_combine$Combine_Num$unwrap = F2(function (f, s) {
		var _p0 = f(s);
		if (_p0.ctor === 'Ok') {
			return _p0._0;
		} else {
			return _elm_lang$core$Native_Utils.crashCase('Combine.Num', {
				start: { line: 23, column: 3 },
				end: { line: 28, column: 79 }
			}, _p0)(A2(_elm_lang$core$Basics_ops['++'], 'impossible state in Combine.Num.unwrap: ', _elm_lang$core$Basics$toString(_p0._0)));
		}
	});
	var _Bogdanp$elm_combine$Combine_Num$toInt = _Bogdanp$elm_combine$Combine_Num$unwrap(_elm_lang$core$String$toInt);
	var _Bogdanp$elm_combine$Combine_Num$int = A2(_Bogdanp$elm_combine$Combine_ops['<*>'], A2(_Bogdanp$elm_combine$Combine_ops['<$>'], F2(function (x, y) {
		return x * y;
	}), _Bogdanp$elm_combine$Combine_Num$sign), A2(_Bogdanp$elm_combine$Combine_ops['<?>'], A2(_Bogdanp$elm_combine$Combine_ops['<$>'], _Bogdanp$elm_combine$Combine_Num$toInt, _Bogdanp$elm_combine$Combine$regex('(0|[1-9][0-9]*)')), 'expected an integer'));
	var _Bogdanp$elm_combine$Combine_Num$toFloat = _Bogdanp$elm_combine$Combine_Num$unwrap(_elm_lang$core$String$toFloat);
	var _Bogdanp$elm_combine$Combine_Num$float = A2(_Bogdanp$elm_combine$Combine_ops['<*>'], A2(_Bogdanp$elm_combine$Combine_ops['<$>'], function (_p2) {
		return F2(function (x, y) {
			return x * y;
		})(_elm_lang$core$Basics$toFloat(_p2));
	}, _Bogdanp$elm_combine$Combine_Num$sign), A2(_Bogdanp$elm_combine$Combine_ops['<?>'], A2(_Bogdanp$elm_combine$Combine_ops['<$>'], _Bogdanp$elm_combine$Combine_Num$toFloat, _Bogdanp$elm_combine$Combine$regex('(0|[1-9][0-9]*)(\\.[0-9]+)')), 'expected a float'));

	var _Bogdanp$elm_time$Time_Internal$paddedInt = A2(_Bogdanp$elm_combine$Combine_ops['*>'], A2(_Bogdanp$elm_combine$Combine$optional, '', _Bogdanp$elm_combine$Combine$string('0')), _Bogdanp$elm_combine$Combine_Num$int);
	var _Bogdanp$elm_time$Time_Internal$intRange = F2(function (lo, hi) {
		var validate = function validate(n) {
			return _elm_lang$core$Native_Utils.cmp(n, lo) > -1 && _elm_lang$core$Native_Utils.cmp(n, hi) < 1 ? _Bogdanp$elm_combine$Combine$succeed(n) : _Bogdanp$elm_combine$Combine$fail(A2(_elm_lang$core$Basics_ops['++'], 'expected an integer in the range [', A2(_elm_lang$core$Basics_ops['++'], _elm_lang$core$Basics$toString(lo), A2(_elm_lang$core$Basics_ops['++'], ', ', A2(_elm_lang$core$Basics_ops['++'], _elm_lang$core$Basics$toString(hi), ']')))));
		};
		return A2(_Bogdanp$elm_combine$Combine_ops['>>='], _Bogdanp$elm_time$Time_Internal$paddedInt, validate);
	});
	var _Bogdanp$elm_time$Time_Internal$secondMs = 1000;
	var _Bogdanp$elm_time$Time_Internal$minuteMs = 60000;
	var _Bogdanp$elm_time$Time_Internal$hourMs = 3600000;
	var _Bogdanp$elm_time$Time_Internal$dayMs = 86400000;
	var _Bogdanp$elm_time$Time_Internal$padded = function _Bogdanp$elm_time$Time_Internal$padded(n) {
		return _elm_lang$core$Native_Utils.cmp(n, 10) < 0 ? A2(_elm_lang$core$Basics_ops['++'], '0', _elm_lang$core$Basics$toString(n)) : _elm_lang$core$Basics$toString(n);
	};
	var _Bogdanp$elm_time$Time_Internal$zero = { year: 0, month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0 };
	var _Bogdanp$elm_time$Time_Internal$offsetFromTimeData = function _Bogdanp$elm_time$Time_Internal$offsetFromTimeData(_p0) {
		var _p1 = _p0;
		return A3(_elm_lang$core$Basics$clamp, 0, 23, _p1.hour) * _Bogdanp$elm_time$Time_Internal$hourMs + A3(_elm_lang$core$Basics$clamp, 0, 59, _p1.minute) * _Bogdanp$elm_time$Time_Internal$minuteMs + A3(_elm_lang$core$Basics$clamp, 0, 59, _p1.second) * _Bogdanp$elm_time$Time_Internal$secondMs + A3(_elm_lang$core$Basics$clamp, 0, 999, _p1.millisecond);
	};
	var _Bogdanp$elm_time$Time_Internal$DateTimeData = F7(function (a, b, c, d, e, f, g) {
		return { year: a, month: b, day: c, hour: d, minute: e, second: f, millisecond: g };
	});

	var _Bogdanp$elm_time$Time_Date$clampDay = function _Bogdanp$elm_time$Time_Date$clampDay(day) {
		return A3(_elm_lang$core$Basics$clamp, 1, 31, day);
	};
	var _Bogdanp$elm_time$Time_Date$clampMonth = function _Bogdanp$elm_time$Time_Date$clampMonth(month) {
		return A3(_elm_lang$core$Basics$clamp, 1, 12, month);
	};
	var _Bogdanp$elm_time$Time_Date$daysFromYear = function _Bogdanp$elm_time$Time_Date$daysFromYear(y) {
		return _elm_lang$core$Native_Utils.cmp(y, 0) > 0 ? 366 + (y - 1) * 365 + ((y - 1) / 4 | 0) - ((y - 1) / 100 | 0) + ((y - 1) / 400 | 0) : _elm_lang$core$Native_Utils.cmp(y, 0) < 0 ? y * 365 + (y / 4 | 0) - (y / 100 | 0) + (y / 400 | 0) : 0;
	};
	var _Bogdanp$elm_time$Time_Date$yearFromDays = function _Bogdanp$elm_time$Time_Date$yearFromDays(ds) {
		var y = ds / 365 | 0;
		var d = _Bogdanp$elm_time$Time_Date$daysFromYear(y);
		return _elm_lang$core$Native_Utils.cmp(ds, d) < 1 ? y - 1 : y;
	};
	var _Bogdanp$elm_time$Time_Date$isLeapYear = function _Bogdanp$elm_time$Time_Date$isLeapYear(y) {
		return _elm_lang$core$Native_Utils.eq(A2(_elm_lang$core$Basics_ops['%'], y, 400), 0) || !_elm_lang$core$Native_Utils.eq(A2(_elm_lang$core$Basics_ops['%'], y, 100), 0) && _elm_lang$core$Native_Utils.eq(A2(_elm_lang$core$Basics_ops['%'], y, 4), 0);
	};
	var _Bogdanp$elm_time$Time_Date$unsafeDaysInMonth = F2(function (y, m) {
		return _elm_lang$core$Native_Utils.eq(m, 1) ? 31 : _elm_lang$core$Native_Utils.eq(m, 2) && _Bogdanp$elm_time$Time_Date$isLeapYear(y) ? 29 : _elm_lang$core$Native_Utils.eq(m, 2) ? 28 : _elm_lang$core$Native_Utils.eq(m, 3) ? 31 : _elm_lang$core$Native_Utils.eq(m, 4) ? 30 : _elm_lang$core$Native_Utils.eq(m, 5) ? 31 : _elm_lang$core$Native_Utils.eq(m, 6) ? 30 : _elm_lang$core$Native_Utils.eq(m, 7) ? 31 : _elm_lang$core$Native_Utils.eq(m, 8) ? 31 : _elm_lang$core$Native_Utils.eq(m, 9) ? 30 : _elm_lang$core$Native_Utils.eq(m, 10) ? 31 : _elm_lang$core$Native_Utils.eq(m, 11) ? 30 : _elm_lang$core$Native_Utils.eq(m, 12) ? 31 : _elm_lang$core$Native_Utils.crash('Time.Date', {
			start: { line: 343, column: 9 },
			end: { line: 343, column: 20 }
		})(A2(_elm_lang$core$Basics_ops['++'], 'invalid call to unsafeDaysInMonth: year=', A2(_elm_lang$core$Basics_ops['++'], _elm_lang$core$Basics$toString(y), A2(_elm_lang$core$Basics_ops['++'], ' month=', _elm_lang$core$Basics$toString(m)))));
	});
	var _Bogdanp$elm_time$Time_Date$daysInMonth = F2(function (y, m) {
		return _elm_lang$core$Native_Utils.cmp(m, 1) > -1 && _elm_lang$core$Native_Utils.cmp(m, 12) < 1 ? _elm_lang$core$Maybe$Just(A2(_Bogdanp$elm_time$Time_Date$unsafeDaysInMonth, y, m)) : _elm_lang$core$Maybe$Nothing;
	});
	var _Bogdanp$elm_time$Time_Date$daysFromYearMonth = F2(function (year, month) {
		var go = F3(function (year, month, acc) {
			go: while (true) {
				if (_elm_lang$core$Native_Utils.eq(month, 0)) {
					return acc;
				} else {
					var _v0 = year,
					    _v1 = month - 1,
					    _v2 = acc + A2(_Bogdanp$elm_time$Time_Date$unsafeDaysInMonth, year, month);
					year = _v0;
					month = _v1;
					acc = _v2;
					continue go;
				}
			}
		});
		return A3(go, year, month - 1, 0);
	});
	var _Bogdanp$elm_time$Time_Date$daysFromYearMonthDay = F3(function (year, month, day) {
		var dds = day - 1;
		var mds = A2(_Bogdanp$elm_time$Time_Date$daysFromYearMonth, year, month);
		var yds = _Bogdanp$elm_time$Time_Date$daysFromYear(year);
		return yds + mds + dds;
	});
	var _Bogdanp$elm_time$Time_Date$isValidDate = F3(function (year, month, day) {
		return A2(_elm_lang$core$Maybe$withDefault, false, A2(_elm_lang$core$Maybe$map, function (days) {
			return _elm_lang$core$Native_Utils.cmp(day, 1) > -1 && _elm_lang$core$Native_Utils.cmp(day, days) < 1;
		}, A2(_Bogdanp$elm_time$Time_Date$daysInMonth, year, month)));
	});
	var _Bogdanp$elm_time$Time_Date$toTuple = function _Bogdanp$elm_time$Time_Date$toTuple(_p0) {
		var _p1 = _p0;
		return { ctor: '_Tuple3', _0: _p1._0.year, _1: _p1._0.month, _2: _p1._0.day };
	};
	var _Bogdanp$elm_time$Time_Date$delta = F2(function (_p3, _p2) {
		var _p4 = _p3;
		var _p7 = _p4._0;
		var _p5 = _p2;
		var _p6 = _p5._0;
		return {
			years: _p7.year - _p6.year,
			months: _elm_lang$core$Basics$abs(_p7.year) * 12 + _p7.month - (_elm_lang$core$Basics$abs(_p6.year) * 12 + _p6.month),
			days: A3(_Bogdanp$elm_time$Time_Date$daysFromYearMonthDay, _p7.year, _p7.month, _p7.day) - A3(_Bogdanp$elm_time$Time_Date$daysFromYearMonthDay, _p6.year, _p6.month, _p6.day)
		};
	});
	var _Bogdanp$elm_time$Time_Date$compare = F2(function (d1, d2) {
		return A2(_elm_lang$core$Basics$compare, _Bogdanp$elm_time$Time_Date$toTuple(d1), _Bogdanp$elm_time$Time_Date$toTuple(d2));
	});
	var _Bogdanp$elm_time$Time_Date$day = function _Bogdanp$elm_time$Time_Date$day(_p8) {
		var _p9 = _p8;
		return _p9._0.day;
	};
	var _Bogdanp$elm_time$Time_Date$month = function _Bogdanp$elm_time$Time_Date$month(_p10) {
		var _p11 = _p10;
		return _p11._0.month;
	};
	var _Bogdanp$elm_time$Time_Date$year = function _Bogdanp$elm_time$Time_Date$year(_p12) {
		var _p13 = _p12;
		return _p13._0.year;
	};
	var _Bogdanp$elm_time$Time_Date$toISO8601 = function _Bogdanp$elm_time$Time_Date$toISO8601(d) {
		return A2(_elm_lang$core$Basics_ops['++'], _elm_lang$core$Basics$toString(_Bogdanp$elm_time$Time_Date$year(d)), A2(_elm_lang$core$Basics_ops['++'], '-', A2(_elm_lang$core$Basics_ops['++'], _Bogdanp$elm_time$Time_Internal$padded(_Bogdanp$elm_time$Time_Date$month(d)), A2(_elm_lang$core$Basics_ops['++'], '-', _Bogdanp$elm_time$Time_Internal$padded(_Bogdanp$elm_time$Time_Date$day(d))))));
	};
	var _Bogdanp$elm_time$Time_Date$DateDelta = F3(function (a, b, c) {
		return { years: a, months: b, days: c };
	});
	var _Bogdanp$elm_time$Time_Date$Date = function _Bogdanp$elm_time$Time_Date$Date(a) {
		return { ctor: 'Date', _0: a };
	};
	var _Bogdanp$elm_time$Time_Date$firstValid = F3(function (year, month, day) {
		var _p14 = A3(_Bogdanp$elm_time$Time_Date$isValidDate, year, month, day) ? { ctor: '_Tuple3', _0: year, _1: month, _2: day } : A3(_Bogdanp$elm_time$Time_Date$isValidDate, year, month, day - 1) ? { ctor: '_Tuple3', _0: year, _1: month, _2: day - 1 } : A3(_Bogdanp$elm_time$Time_Date$isValidDate, year, month, day - 2) ? { ctor: '_Tuple3', _0: year, _1: month, _2: day - 2 } : { ctor: '_Tuple3', _0: year, _1: month, _2: day - 3 };
		var y = _p14._0;
		var m = _p14._1;
		var d = _p14._2;
		return _Bogdanp$elm_time$Time_Date$Date({ year: y, month: m, day: d });
	});
	var _Bogdanp$elm_time$Time_Date$date = F3(function (year, month, day) {
		return A3(_Bogdanp$elm_time$Time_Date$firstValid, year, _Bogdanp$elm_time$Time_Date$clampMonth(month), _Bogdanp$elm_time$Time_Date$clampDay(day));
	});
	var _Bogdanp$elm_time$Time_Date$fromTuple = function _Bogdanp$elm_time$Time_Date$fromTuple(_p15) {
		var _p16 = _p15;
		return A3(_Bogdanp$elm_time$Time_Date$date, _p16._0, _p16._1, _p16._2);
	};
	var _Bogdanp$elm_time$Time_Date$fromISO8601 = function _Bogdanp$elm_time$Time_Date$fromISO8601(input) {
		var convert = function convert(_p17) {
			var _p18 = _p17;
			var _p21 = _p18._0;
			var _p20 = _p18._1;
			var _p19 = _p18._2;
			return A3(_Bogdanp$elm_time$Time_Date$isValidDate, _p21, _p20, _p19) ? _Bogdanp$elm_combine$Combine$succeed(A3(_Bogdanp$elm_time$Time_Date$date, _p21, _p20, _p19)) : _Bogdanp$elm_combine$Combine$fail('invalid date');
		};
		var dateTuple = A2(_Bogdanp$elm_combine$Combine_ops['<*>'], A2(_Bogdanp$elm_combine$Combine_ops['<*>'], A2(_Bogdanp$elm_combine$Combine_ops['<$>'], F3(function (v0, v1, v2) {
			return { ctor: '_Tuple3', _0: v0, _1: v1, _2: v2 };
		}), _Bogdanp$elm_combine$Combine_Num$int), A2(_Bogdanp$elm_combine$Combine_ops['*>'], _Bogdanp$elm_combine$Combine$string('-'), A2(_Bogdanp$elm_time$Time_Internal$intRange, 1, 12))), A2(_Bogdanp$elm_combine$Combine_ops['*>'], _Bogdanp$elm_combine$Combine$string('-'), A2(_Bogdanp$elm_time$Time_Internal$intRange, 1, 31)));
		var _p22 = A2(_Bogdanp$elm_combine$Combine$parse, A2(_Bogdanp$elm_combine$Combine_ops['>>='], dateTuple, convert), input);
		if (_p22.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(_p22._0._2);
		} else {
			var messages = A2(_elm_lang$core$String$join, ' or ', _p22._0._2);
			return _elm_lang$core$Result$Err(A2(_elm_lang$core$Basics_ops['++'], 'Errors encountered at position ', A2(_elm_lang$core$Basics_ops['++'], _elm_lang$core$Basics$toString(_p22._0._1.position), A2(_elm_lang$core$Basics_ops['++'], ': ', messages))));
		}
	};
	var _Bogdanp$elm_time$Time_Date$setYear = F2(function (year, _p23) {
		var _p24 = _p23;
		return A3(_Bogdanp$elm_time$Time_Date$firstValid, year, _p24._0.month, _p24._0.day);
	});
	var _Bogdanp$elm_time$Time_Date$setMonth = F2(function (month, _p25) {
		var _p26 = _p25;
		return A3(_Bogdanp$elm_time$Time_Date$firstValid, _p26._0.year, _Bogdanp$elm_time$Time_Date$clampMonth(month), _p26._0.day);
	});
	var _Bogdanp$elm_time$Time_Date$setDay = F2(function (day, _p27) {
		var _p28 = _p27;
		return A3(_Bogdanp$elm_time$Time_Date$firstValid, _p28._0.year, _p28._0.month, _Bogdanp$elm_time$Time_Date$clampDay(day));
	});
	var _Bogdanp$elm_time$Time_Date$addYears = F2(function (years, _p29) {
		var _p30 = _p29;
		return A3(_Bogdanp$elm_time$Time_Date$firstValid, _p30._0.year + years, _p30._0.month, _p30._0.day);
	});
	var _Bogdanp$elm_time$Time_Date$addMonths = F2(function (months, _p31) {
		var _p32 = _p31;
		var _p33 = _p32._0.year;
		var ms = _elm_lang$core$Basics$abs(_p33) * 12 + _p32._0.month - 1 + months;
		var sign = _elm_lang$core$Native_Utils.cmp(_p33, 0) < 0 ? -1 : 1;
		return A3(_Bogdanp$elm_time$Time_Date$firstValid, sign * ms / 12 | 0, A2(_elm_lang$core$Basics_ops['%'], ms, 12) + 1, _p32._0.day);
	});
	var _Bogdanp$elm_time$Time_Date$dateFromDays = function _Bogdanp$elm_time$Time_Date$dateFromDays(ds) {
		var d400 = _Bogdanp$elm_time$Time_Date$daysFromYear(400);
		var y400 = ds / d400 | 0;
		var d = A2(_elm_lang$core$Basics$rem, ds, d400);
		var year = _Bogdanp$elm_time$Time_Date$yearFromDays(d + 1);
		var leap = _Bogdanp$elm_time$Time_Date$isLeapYear(year) ? F2(function (x, y) {
			return x + y;
		})(1) : _elm_lang$core$Basics$identity;
		var doy = d - _Bogdanp$elm_time$Time_Date$daysFromYear(year);
		var _p34 = _elm_lang$core$Native_Utils.cmp(doy, 31) < 0 ? { ctor: '_Tuple2', _0: 1, _1: doy + 1 } : _elm_lang$core$Native_Utils.cmp(doy, leap(59)) < 0 ? { ctor: '_Tuple2', _0: 2, _1: doy - 31 + 1 } : _elm_lang$core$Native_Utils.cmp(doy, leap(90)) < 0 ? {
			ctor: '_Tuple2',
			_0: 3,
			_1: doy - leap(59) + 1
		} : _elm_lang$core$Native_Utils.cmp(doy, leap(120)) < 0 ? {
			ctor: '_Tuple2',
			_0: 4,
			_1: doy - leap(90) + 1
		} : _elm_lang$core$Native_Utils.cmp(doy, leap(151)) < 0 ? {
			ctor: '_Tuple2',
			_0: 5,
			_1: doy - leap(120) + 1
		} : _elm_lang$core$Native_Utils.cmp(doy, leap(181)) < 0 ? {
			ctor: '_Tuple2',
			_0: 6,
			_1: doy - leap(151) + 1
		} : _elm_lang$core$Native_Utils.cmp(doy, leap(212)) < 0 ? {
			ctor: '_Tuple2',
			_0: 7,
			_1: doy - leap(181) + 1
		} : _elm_lang$core$Native_Utils.cmp(doy, leap(243)) < 0 ? {
			ctor: '_Tuple2',
			_0: 8,
			_1: doy - leap(212) + 1
		} : _elm_lang$core$Native_Utils.cmp(doy, leap(273)) < 0 ? {
			ctor: '_Tuple2',
			_0: 9,
			_1: doy - leap(243) + 1
		} : _elm_lang$core$Native_Utils.cmp(doy, leap(304)) < 0 ? {
			ctor: '_Tuple2',
			_0: 10,
			_1: doy - leap(273) + 1
		} : _elm_lang$core$Native_Utils.cmp(doy, leap(334)) < 0 ? {
			ctor: '_Tuple2',
			_0: 11,
			_1: doy - leap(304) + 1
		} : {
			ctor: '_Tuple2',
			_0: 12,
			_1: doy - leap(334) + 1
		};
		var month = _p34._0;
		var day = _p34._1;
		return _Bogdanp$elm_time$Time_Date$Date({ year: year + y400 * 400, month: month, day: day });
	};
	var _Bogdanp$elm_time$Time_Date$addDays = F2(function (days, _p35) {
		var _p36 = _p35;
		return _Bogdanp$elm_time$Time_Date$dateFromDays(A2(F2(function (x, y) {
			return x + y;
		}), days, A3(_Bogdanp$elm_time$Time_Date$daysFromYearMonthDay, _p36._0.year, _p36._0.month, _p36._0.day)));
	});
	var _Bogdanp$elm_time$Time_Date$Sun = { ctor: 'Sun' };
	var _Bogdanp$elm_time$Time_Date$Sat = { ctor: 'Sat' };
	var _Bogdanp$elm_time$Time_Date$Fri = { ctor: 'Fri' };
	var _Bogdanp$elm_time$Time_Date$Thu = { ctor: 'Thu' };
	var _Bogdanp$elm_time$Time_Date$Wed = { ctor: 'Wed' };
	var _Bogdanp$elm_time$Time_Date$Tue = { ctor: 'Tue' };
	var _Bogdanp$elm_time$Time_Date$Mon = { ctor: 'Mon' };
	var _Bogdanp$elm_time$Time_Date$weekday = function _Bogdanp$elm_time$Time_Date$weekday(_p37) {
		var _p38 = _p37;
		var _p40 = _p38._0.year;
		var _p39 = _p38._0.month;
		var y = _elm_lang$core$Native_Utils.cmp(_p39, 3) < 0 ? _p40 - 1 : _p40;
		var m = _elm_lang$core$Native_Utils.eq(_p39, 1) ? 0 : _elm_lang$core$Native_Utils.eq(_p39, 2) ? 3 : _elm_lang$core$Native_Utils.eq(_p39, 3) ? 2 : _elm_lang$core$Native_Utils.eq(_p39, 4) ? 5 : _elm_lang$core$Native_Utils.eq(_p39, 5) ? 0 : _elm_lang$core$Native_Utils.eq(_p39, 6) ? 3 : _elm_lang$core$Native_Utils.eq(_p39, 7) ? 5 : _elm_lang$core$Native_Utils.eq(_p39, 8) ? 1 : _elm_lang$core$Native_Utils.eq(_p39, 9) ? 4 : _elm_lang$core$Native_Utils.eq(_p39, 10) ? 6 : _elm_lang$core$Native_Utils.eq(_p39, 11) ? 2 : 4;
		var d = A2(_elm_lang$core$Basics_ops['%'], y + (y / 4 | 0) - (y / 100 | 0) + (y / 400 | 0) + m + _p38._0.day, 7);
		return _elm_lang$core$Native_Utils.eq(d, 0) ? _Bogdanp$elm_time$Time_Date$Sun : _elm_lang$core$Native_Utils.eq(d, 1) ? _Bogdanp$elm_time$Time_Date$Mon : _elm_lang$core$Native_Utils.eq(d, 2) ? _Bogdanp$elm_time$Time_Date$Tue : _elm_lang$core$Native_Utils.eq(d, 3) ? _Bogdanp$elm_time$Time_Date$Wed : _elm_lang$core$Native_Utils.eq(d, 4) ? _Bogdanp$elm_time$Time_Date$Thu : _elm_lang$core$Native_Utils.eq(d, 5) ? _Bogdanp$elm_time$Time_Date$Fri : _Bogdanp$elm_time$Time_Date$Sat;
	};

	var _elm_lang$core$Dict$foldr = F3(function (f, acc, t) {
		foldr: while (true) {
			var _p0 = t;
			if (_p0.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v1 = f,
				    _v2 = A3(f, _p0._1, _p0._2, A3(_elm_lang$core$Dict$foldr, f, acc, _p0._4)),
				    _v3 = _p0._3;
				f = _v1;
				acc = _v2;
				t = _v3;
				continue foldr;
			}
		}
	});
	var _elm_lang$core$Dict$keys = function _elm_lang$core$Dict$keys(dict) {
		return A3(_elm_lang$core$Dict$foldr, F3(function (key, value, keyList) {
			return { ctor: '::', _0: key, _1: keyList };
		}), { ctor: '[]' }, dict);
	};
	var _elm_lang$core$Dict$values = function _elm_lang$core$Dict$values(dict) {
		return A3(_elm_lang$core$Dict$foldr, F3(function (key, value, valueList) {
			return { ctor: '::', _0: value, _1: valueList };
		}), { ctor: '[]' }, dict);
	};
	var _elm_lang$core$Dict$toList = function _elm_lang$core$Dict$toList(dict) {
		return A3(_elm_lang$core$Dict$foldr, F3(function (key, value, list) {
			return {
				ctor: '::',
				_0: { ctor: '_Tuple2', _0: key, _1: value },
				_1: list
			};
		}), { ctor: '[]' }, dict);
	};
	var _elm_lang$core$Dict$foldl = F3(function (f, acc, dict) {
		foldl: while (true) {
			var _p1 = dict;
			if (_p1.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v5 = f,
				    _v6 = A3(f, _p1._1, _p1._2, A3(_elm_lang$core$Dict$foldl, f, acc, _p1._3)),
				    _v7 = _p1._4;
				f = _v5;
				acc = _v6;
				dict = _v7;
				continue foldl;
			}
		}
	});
	var _elm_lang$core$Dict$merge = F6(function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(function (rKey, rValue, _p2) {
			stepState: while (true) {
				var _p3 = _p2;
				var _p9 = _p3._1;
				var _p8 = _p3._0;
				var _p4 = _p8;
				if (_p4.ctor === '[]') {
					return {
						ctor: '_Tuple2',
						_0: _p8,
						_1: A3(rightStep, rKey, rValue, _p9)
					};
				} else {
					var _p7 = _p4._1;
					var _p6 = _p4._0._1;
					var _p5 = _p4._0._0;
					if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) < 0) {
						var _v10 = rKey,
						    _v11 = rValue,
						    _v12 = {
							ctor: '_Tuple2',
							_0: _p7,
							_1: A3(leftStep, _p5, _p6, _p9)
						};
						rKey = _v10;
						rValue = _v11;
						_p2 = _v12;
						continue stepState;
					} else {
						if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) > 0) {
							return {
								ctor: '_Tuple2',
								_0: _p8,
								_1: A3(rightStep, rKey, rValue, _p9)
							};
						} else {
							return {
								ctor: '_Tuple2',
								_0: _p7,
								_1: A4(bothStep, _p5, _p6, rValue, _p9)
							};
						}
					}
				}
			}
		});
		var _p10 = A3(_elm_lang$core$Dict$foldl, stepState, {
			ctor: '_Tuple2',
			_0: _elm_lang$core$Dict$toList(leftDict),
			_1: initialResult
		}, rightDict);
		var leftovers = _p10._0;
		var intermediateResult = _p10._1;
		return A3(_elm_lang$core$List$foldl, F2(function (_p11, result) {
			var _p12 = _p11;
			return A3(leftStep, _p12._0, _p12._1, result);
		}), intermediateResult, leftovers);
	});
	var _elm_lang$core$Dict$reportRemBug = F4(function (msg, c, lgot, rgot) {
		return _elm_lang$core$Native_Debug.crash(_elm_lang$core$String$concat({
			ctor: '::',
			_0: 'Internal red-black tree invariant violated, expected ',
			_1: {
				ctor: '::',
				_0: msg,
				_1: {
					ctor: '::',
					_0: ' and got ',
					_1: {
						ctor: '::',
						_0: _elm_lang$core$Basics$toString(c),
						_1: {
							ctor: '::',
							_0: '/',
							_1: {
								ctor: '::',
								_0: lgot,
								_1: {
									ctor: '::',
									_0: '/',
									_1: {
										ctor: '::',
										_0: rgot,
										_1: {
											ctor: '::',
											_0: '\nPlease report this bug to <https://github.com/elm-lang/core/issues>',
											_1: { ctor: '[]' }
										}
									}
								}
							}
						}
					}
				}
			}
		}));
	});
	var _elm_lang$core$Dict$isBBlack = function _elm_lang$core$Dict$isBBlack(dict) {
		var _p13 = dict;
		_v14_2: do {
			if (_p13.ctor === 'RBNode_elm_builtin') {
				if (_p13._0.ctor === 'BBlack') {
					return true;
				} else {
					break _v14_2;
				}
			} else {
				if (_p13._0.ctor === 'LBBlack') {
					return true;
				} else {
					break _v14_2;
				}
			}
		} while (false);
		return false;
	};
	var _elm_lang$core$Dict$sizeHelp = F2(function (n, dict) {
		sizeHelp: while (true) {
			var _p14 = dict;
			if (_p14.ctor === 'RBEmpty_elm_builtin') {
				return n;
			} else {
				var _v16 = A2(_elm_lang$core$Dict$sizeHelp, n + 1, _p14._4),
				    _v17 = _p14._3;
				n = _v16;
				dict = _v17;
				continue sizeHelp;
			}
		}
	});
	var _elm_lang$core$Dict$size = function _elm_lang$core$Dict$size(dict) {
		return A2(_elm_lang$core$Dict$sizeHelp, 0, dict);
	};
	var _elm_lang$core$Dict$get = F2(function (targetKey, dict) {
		get: while (true) {
			var _p15 = dict;
			if (_p15.ctor === 'RBEmpty_elm_builtin') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				var _p16 = A2(_elm_lang$core$Basics$compare, targetKey, _p15._1);
				switch (_p16.ctor) {
					case 'LT':
						var _v20 = targetKey,
						    _v21 = _p15._3;
						targetKey = _v20;
						dict = _v21;
						continue get;
					case 'EQ':
						return _elm_lang$core$Maybe$Just(_p15._2);
					default:
						var _v22 = targetKey,
						    _v23 = _p15._4;
						targetKey = _v22;
						dict = _v23;
						continue get;
				}
			}
		}
	});
	var _elm_lang$core$Dict$member = F2(function (key, dict) {
		var _p17 = A2(_elm_lang$core$Dict$get, key, dict);
		if (_p17.ctor === 'Just') {
			return true;
		} else {
			return false;
		}
	});
	var _elm_lang$core$Dict$maxWithDefault = F3(function (k, v, r) {
		maxWithDefault: while (true) {
			var _p18 = r;
			if (_p18.ctor === 'RBEmpty_elm_builtin') {
				return { ctor: '_Tuple2', _0: k, _1: v };
			} else {
				var _v26 = _p18._1,
				    _v27 = _p18._2,
				    _v28 = _p18._4;
				k = _v26;
				v = _v27;
				r = _v28;
				continue maxWithDefault;
			}
		}
	});
	var _elm_lang$core$Dict$NBlack = { ctor: 'NBlack' };
	var _elm_lang$core$Dict$BBlack = { ctor: 'BBlack' };
	var _elm_lang$core$Dict$Black = { ctor: 'Black' };
	var _elm_lang$core$Dict$blackish = function _elm_lang$core$Dict$blackish(t) {
		var _p19 = t;
		if (_p19.ctor === 'RBNode_elm_builtin') {
			var _p20 = _p19._0;
			return _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$Black) || _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$BBlack);
		} else {
			return true;
		}
	};
	var _elm_lang$core$Dict$Red = { ctor: 'Red' };
	var _elm_lang$core$Dict$moreBlack = function _elm_lang$core$Dict$moreBlack(color) {
		var _p21 = color;
		switch (_p21.ctor) {
			case 'Black':
				return _elm_lang$core$Dict$BBlack;
			case 'Red':
				return _elm_lang$core$Dict$Black;
			case 'NBlack':
				return _elm_lang$core$Dict$Red;
			default:
				return _elm_lang$core$Native_Debug.crash('Can\'t make a double black node more black!');
		}
	};
	var _elm_lang$core$Dict$lessBlack = function _elm_lang$core$Dict$lessBlack(color) {
		var _p22 = color;
		switch (_p22.ctor) {
			case 'BBlack':
				return _elm_lang$core$Dict$Black;
			case 'Black':
				return _elm_lang$core$Dict$Red;
			case 'Red':
				return _elm_lang$core$Dict$NBlack;
			default:
				return _elm_lang$core$Native_Debug.crash('Can\'t make a negative black node less black!');
		}
	};
	var _elm_lang$core$Dict$LBBlack = { ctor: 'LBBlack' };
	var _elm_lang$core$Dict$LBlack = { ctor: 'LBlack' };
	var _elm_lang$core$Dict$RBEmpty_elm_builtin = function _elm_lang$core$Dict$RBEmpty_elm_builtin(a) {
		return { ctor: 'RBEmpty_elm_builtin', _0: a };
	};
	var _elm_lang$core$Dict$empty = _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	var _elm_lang$core$Dict$isEmpty = function _elm_lang$core$Dict$isEmpty(dict) {
		return _elm_lang$core$Native_Utils.eq(dict, _elm_lang$core$Dict$empty);
	};
	var _elm_lang$core$Dict$RBNode_elm_builtin = F5(function (a, b, c, d, e) {
		return { ctor: 'RBNode_elm_builtin', _0: a, _1: b, _2: c, _3: d, _4: e };
	});
	var _elm_lang$core$Dict$ensureBlackRoot = function _elm_lang$core$Dict$ensureBlackRoot(dict) {
		var _p23 = dict;
		if (_p23.ctor === 'RBNode_elm_builtin' && _p23._0.ctor === 'Red') {
			return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p23._1, _p23._2, _p23._3, _p23._4);
		} else {
			return dict;
		}
	};
	var _elm_lang$core$Dict$lessBlackTree = function _elm_lang$core$Dict$lessBlackTree(dict) {
		var _p24 = dict;
		if (_p24.ctor === 'RBNode_elm_builtin') {
			return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$lessBlack(_p24._0), _p24._1, _p24._2, _p24._3, _p24._4);
		} else {
			return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
		}
	};
	var _elm_lang$core$Dict$balancedTree = function _elm_lang$core$Dict$balancedTree(col) {
		return function (xk) {
			return function (xv) {
				return function (yk) {
					return function (yv) {
						return function (zk) {
							return function (zv) {
								return function (a) {
									return function (b) {
										return function (c) {
											return function (d) {
												return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$lessBlack(col), yk, yv, A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, xk, xv, a, b), A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, zk, zv, c, d));
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
	var _elm_lang$core$Dict$blacken = function _elm_lang$core$Dict$blacken(t) {
		var _p25 = t;
		if (_p25.ctor === 'RBEmpty_elm_builtin') {
			return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
		} else {
			return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p25._1, _p25._2, _p25._3, _p25._4);
		}
	};
	var _elm_lang$core$Dict$redden = function _elm_lang$core$Dict$redden(t) {
		var _p26 = t;
		if (_p26.ctor === 'RBEmpty_elm_builtin') {
			return _elm_lang$core$Native_Debug.crash('can\'t make a Leaf red');
		} else {
			return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, _p26._1, _p26._2, _p26._3, _p26._4);
		}
	};
	var _elm_lang$core$Dict$balanceHelp = function _elm_lang$core$Dict$balanceHelp(tree) {
		var _p27 = tree;
		_v36_6: do {
			_v36_5: do {
				_v36_4: do {
					_v36_3: do {
						_v36_2: do {
							_v36_1: do {
								_v36_0: do {
									if (_p27.ctor === 'RBNode_elm_builtin') {
										if (_p27._3.ctor === 'RBNode_elm_builtin') {
											if (_p27._4.ctor === 'RBNode_elm_builtin') {
												switch (_p27._3._0.ctor) {
													case 'Red':
														switch (_p27._4._0.ctor) {
															case 'Red':
																if (_p27._3._3.ctor === 'RBNode_elm_builtin' && _p27._3._3._0.ctor === 'Red') {
																	break _v36_0;
																} else {
																	if (_p27._3._4.ctor === 'RBNode_elm_builtin' && _p27._3._4._0.ctor === 'Red') {
																		break _v36_1;
																	} else {
																		if (_p27._4._3.ctor === 'RBNode_elm_builtin' && _p27._4._3._0.ctor === 'Red') {
																			break _v36_2;
																		} else {
																			if (_p27._4._4.ctor === 'RBNode_elm_builtin' && _p27._4._4._0.ctor === 'Red') {
																				break _v36_3;
																			} else {
																				break _v36_6;
																			}
																		}
																	}
																}
															case 'NBlack':
																if (_p27._3._3.ctor === 'RBNode_elm_builtin' && _p27._3._3._0.ctor === 'Red') {
																	break _v36_0;
																} else {
																	if (_p27._3._4.ctor === 'RBNode_elm_builtin' && _p27._3._4._0.ctor === 'Red') {
																		break _v36_1;
																	} else {
																		if (_p27._0.ctor === 'BBlack' && _p27._4._3.ctor === 'RBNode_elm_builtin' && _p27._4._3._0.ctor === 'Black' && _p27._4._4.ctor === 'RBNode_elm_builtin' && _p27._4._4._0.ctor === 'Black') {
																			break _v36_4;
																		} else {
																			break _v36_6;
																		}
																	}
																}
															default:
																if (_p27._3._3.ctor === 'RBNode_elm_builtin' && _p27._3._3._0.ctor === 'Red') {
																	break _v36_0;
																} else {
																	if (_p27._3._4.ctor === 'RBNode_elm_builtin' && _p27._3._4._0.ctor === 'Red') {
																		break _v36_1;
																	} else {
																		break _v36_6;
																	}
																}
														}
													case 'NBlack':
														switch (_p27._4._0.ctor) {
															case 'Red':
																if (_p27._4._3.ctor === 'RBNode_elm_builtin' && _p27._4._3._0.ctor === 'Red') {
																	break _v36_2;
																} else {
																	if (_p27._4._4.ctor === 'RBNode_elm_builtin' && _p27._4._4._0.ctor === 'Red') {
																		break _v36_3;
																	} else {
																		if (_p27._0.ctor === 'BBlack' && _p27._3._3.ctor === 'RBNode_elm_builtin' && _p27._3._3._0.ctor === 'Black' && _p27._3._4.ctor === 'RBNode_elm_builtin' && _p27._3._4._0.ctor === 'Black') {
																			break _v36_5;
																		} else {
																			break _v36_6;
																		}
																	}
																}
															case 'NBlack':
																if (_p27._0.ctor === 'BBlack') {
																	if (_p27._4._3.ctor === 'RBNode_elm_builtin' && _p27._4._3._0.ctor === 'Black' && _p27._4._4.ctor === 'RBNode_elm_builtin' && _p27._4._4._0.ctor === 'Black') {
																		break _v36_4;
																	} else {
																		if (_p27._3._3.ctor === 'RBNode_elm_builtin' && _p27._3._3._0.ctor === 'Black' && _p27._3._4.ctor === 'RBNode_elm_builtin' && _p27._3._4._0.ctor === 'Black') {
																			break _v36_5;
																		} else {
																			break _v36_6;
																		}
																	}
																} else {
																	break _v36_6;
																}
															default:
																if (_p27._0.ctor === 'BBlack' && _p27._3._3.ctor === 'RBNode_elm_builtin' && _p27._3._3._0.ctor === 'Black' && _p27._3._4.ctor === 'RBNode_elm_builtin' && _p27._3._4._0.ctor === 'Black') {
																	break _v36_5;
																} else {
																	break _v36_6;
																}
														}
													default:
														switch (_p27._4._0.ctor) {
															case 'Red':
																if (_p27._4._3.ctor === 'RBNode_elm_builtin' && _p27._4._3._0.ctor === 'Red') {
																	break _v36_2;
																} else {
																	if (_p27._4._4.ctor === 'RBNode_elm_builtin' && _p27._4._4._0.ctor === 'Red') {
																		break _v36_3;
																	} else {
																		break _v36_6;
																	}
																}
															case 'NBlack':
																if (_p27._0.ctor === 'BBlack' && _p27._4._3.ctor === 'RBNode_elm_builtin' && _p27._4._3._0.ctor === 'Black' && _p27._4._4.ctor === 'RBNode_elm_builtin' && _p27._4._4._0.ctor === 'Black') {
																	break _v36_4;
																} else {
																	break _v36_6;
																}
															default:
																break _v36_6;
														}
												}
											} else {
												switch (_p27._3._0.ctor) {
													case 'Red':
														if (_p27._3._3.ctor === 'RBNode_elm_builtin' && _p27._3._3._0.ctor === 'Red') {
															break _v36_0;
														} else {
															if (_p27._3._4.ctor === 'RBNode_elm_builtin' && _p27._3._4._0.ctor === 'Red') {
																break _v36_1;
															} else {
																break _v36_6;
															}
														}
													case 'NBlack':
														if (_p27._0.ctor === 'BBlack' && _p27._3._3.ctor === 'RBNode_elm_builtin' && _p27._3._3._0.ctor === 'Black' && _p27._3._4.ctor === 'RBNode_elm_builtin' && _p27._3._4._0.ctor === 'Black') {
															break _v36_5;
														} else {
															break _v36_6;
														}
													default:
														break _v36_6;
												}
											}
										} else {
											if (_p27._4.ctor === 'RBNode_elm_builtin') {
												switch (_p27._4._0.ctor) {
													case 'Red':
														if (_p27._4._3.ctor === 'RBNode_elm_builtin' && _p27._4._3._0.ctor === 'Red') {
															break _v36_2;
														} else {
															if (_p27._4._4.ctor === 'RBNode_elm_builtin' && _p27._4._4._0.ctor === 'Red') {
																break _v36_3;
															} else {
																break _v36_6;
															}
														}
													case 'NBlack':
														if (_p27._0.ctor === 'BBlack' && _p27._4._3.ctor === 'RBNode_elm_builtin' && _p27._4._3._0.ctor === 'Black' && _p27._4._4.ctor === 'RBNode_elm_builtin' && _p27._4._4._0.ctor === 'Black') {
															break _v36_4;
														} else {
															break _v36_6;
														}
													default:
														break _v36_6;
												}
											} else {
												break _v36_6;
											}
										}
									} else {
										break _v36_6;
									}
								} while (false);
								return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._3._1)(_p27._3._3._2)(_p27._3._1)(_p27._3._2)(_p27._1)(_p27._2)(_p27._3._3._3)(_p27._3._3._4)(_p27._3._4)(_p27._4);
							} while (false);
							return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._1)(_p27._3._2)(_p27._3._4._1)(_p27._3._4._2)(_p27._1)(_p27._2)(_p27._3._3)(_p27._3._4._3)(_p27._3._4._4)(_p27._4);
						} while (false);
						return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._3._1)(_p27._4._3._2)(_p27._4._1)(_p27._4._2)(_p27._3)(_p27._4._3._3)(_p27._4._3._4)(_p27._4._4);
					} while (false);
					return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._1)(_p27._4._2)(_p27._4._4._1)(_p27._4._4._2)(_p27._3)(_p27._4._3)(_p27._4._4._3)(_p27._4._4._4);
				} while (false);
				return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._4._3._1, _p27._4._3._2, A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3, _p27._4._3._3), A5(_elm_lang$core$Dict$balance, _elm_lang$core$Dict$Black, _p27._4._1, _p27._4._2, _p27._4._3._4, _elm_lang$core$Dict$redden(_p27._4._4)));
			} while (false);
			return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._3._4._1, _p27._3._4._2, A5(_elm_lang$core$Dict$balance, _elm_lang$core$Dict$Black, _p27._3._1, _p27._3._2, _elm_lang$core$Dict$redden(_p27._3._3), _p27._3._4._3), A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3._4._4, _p27._4));
		} while (false);
		return tree;
	};
	var _elm_lang$core$Dict$balance = F5(function (c, k, v, l, r) {
		var tree = A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
		return _elm_lang$core$Dict$blackish(tree) ? _elm_lang$core$Dict$balanceHelp(tree) : tree;
	});
	var _elm_lang$core$Dict$bubble = F5(function (c, k, v, l, r) {
		return _elm_lang$core$Dict$isBBlack(l) || _elm_lang$core$Dict$isBBlack(r) ? A5(_elm_lang$core$Dict$balance, _elm_lang$core$Dict$moreBlack(c), k, v, _elm_lang$core$Dict$lessBlackTree(l), _elm_lang$core$Dict$lessBlackTree(r)) : A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
	});
	var _elm_lang$core$Dict$removeMax = F5(function (c, k, v, l, r) {
		var _p28 = r;
		if (_p28.ctor === 'RBEmpty_elm_builtin') {
			return A3(_elm_lang$core$Dict$rem, c, l, r);
		} else {
			return A5(_elm_lang$core$Dict$bubble, c, k, v, l, A5(_elm_lang$core$Dict$removeMax, _p28._0, _p28._1, _p28._2, _p28._3, _p28._4));
		}
	});
	var _elm_lang$core$Dict$rem = F3(function (color, left, right) {
		var _p29 = { ctor: '_Tuple2', _0: left, _1: right };
		if (_p29._0.ctor === 'RBEmpty_elm_builtin') {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p30 = color;
				switch (_p30.ctor) {
					case 'Red':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
					case 'Black':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBBlack);
					default:
						return _elm_lang$core$Native_Debug.crash('cannot have bblack or nblack nodes at this point');
				}
			} else {
				var _p33 = _p29._1._0;
				var _p32 = _p29._0._0;
				var _p31 = { ctor: '_Tuple3', _0: color, _1: _p32, _2: _p33 };
				if (_p31.ctor === '_Tuple3' && _p31._0.ctor === 'Black' && _p31._1.ctor === 'LBlack' && _p31._2.ctor === 'Red') {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._1._1, _p29._1._2, _p29._1._3, _p29._1._4);
				} else {
					return A4(_elm_lang$core$Dict$reportRemBug, 'Black/LBlack/Red', color, _elm_lang$core$Basics$toString(_p32), _elm_lang$core$Basics$toString(_p33));
				}
			}
		} else {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p36 = _p29._1._0;
				var _p35 = _p29._0._0;
				var _p34 = { ctor: '_Tuple3', _0: color, _1: _p35, _2: _p36 };
				if (_p34.ctor === '_Tuple3' && _p34._0.ctor === 'Black' && _p34._1.ctor === 'Red' && _p34._2.ctor === 'LBlack') {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._0._1, _p29._0._2, _p29._0._3, _p29._0._4);
				} else {
					return A4(_elm_lang$core$Dict$reportRemBug, 'Black/Red/LBlack', color, _elm_lang$core$Basics$toString(_p35), _elm_lang$core$Basics$toString(_p36));
				}
			} else {
				var _p40 = _p29._0._2;
				var _p39 = _p29._0._4;
				var _p38 = _p29._0._1;
				var newLeft = A5(_elm_lang$core$Dict$removeMax, _p29._0._0, _p38, _p40, _p29._0._3, _p39);
				var _p37 = A3(_elm_lang$core$Dict$maxWithDefault, _p38, _p40, _p39);
				var k = _p37._0;
				var v = _p37._1;
				return A5(_elm_lang$core$Dict$bubble, color, k, v, newLeft, right);
			}
		}
	});
	var _elm_lang$core$Dict$map = F2(function (f, dict) {
		var _p41 = dict;
		if (_p41.ctor === 'RBEmpty_elm_builtin') {
			return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
		} else {
			var _p42 = _p41._1;
			return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p41._0, _p42, A2(f, _p42, _p41._2), A2(_elm_lang$core$Dict$map, f, _p41._3), A2(_elm_lang$core$Dict$map, f, _p41._4));
		}
	});
	var _elm_lang$core$Dict$Same = { ctor: 'Same' };
	var _elm_lang$core$Dict$Remove = { ctor: 'Remove' };
	var _elm_lang$core$Dict$Insert = { ctor: 'Insert' };
	var _elm_lang$core$Dict$update = F3(function (k, alter, dict) {
		var up = function up(dict) {
			var _p43 = dict;
			if (_p43.ctor === 'RBEmpty_elm_builtin') {
				var _p44 = alter(_elm_lang$core$Maybe$Nothing);
				if (_p44.ctor === 'Nothing') {
					return { ctor: '_Tuple2', _0: _elm_lang$core$Dict$Same, _1: _elm_lang$core$Dict$empty };
				} else {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Dict$Insert,
						_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, k, _p44._0, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty)
					};
				}
			} else {
				var _p55 = _p43._2;
				var _p54 = _p43._4;
				var _p53 = _p43._3;
				var _p52 = _p43._1;
				var _p51 = _p43._0;
				var _p45 = A2(_elm_lang$core$Basics$compare, k, _p52);
				switch (_p45.ctor) {
					case 'EQ':
						var _p46 = alter(_elm_lang$core$Maybe$Just(_p55));
						if (_p46.ctor === 'Nothing') {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Remove,
								_1: A3(_elm_lang$core$Dict$rem, _p51, _p53, _p54)
							};
						} else {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Same,
								_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p46._0, _p53, _p54)
							};
						}
					case 'LT':
						var _p47 = up(_p53);
						var flag = _p47._0;
						var newLeft = _p47._1;
						var _p48 = flag;
						switch (_p48.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, newLeft, _p54)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, newLeft, _p54)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, newLeft, _p54)
								};
						}
					default:
						var _p49 = up(_p54);
						var flag = _p49._0;
						var newRight = _p49._1;
						var _p50 = flag;
						switch (_p50.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, _p53, newRight)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, _p53, newRight)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, _p53, newRight)
								};
						}
				}
			}
		};
		var _p56 = up(dict);
		var flag = _p56._0;
		var updatedDict = _p56._1;
		var _p57 = flag;
		switch (_p57.ctor) {
			case 'Same':
				return updatedDict;
			case 'Insert':
				return _elm_lang$core$Dict$ensureBlackRoot(updatedDict);
			default:
				return _elm_lang$core$Dict$blacken(updatedDict);
		}
	});
	var _elm_lang$core$Dict$insert = F3(function (key, value, dict) {
		return A3(_elm_lang$core$Dict$update, key, _elm_lang$core$Basics$always(_elm_lang$core$Maybe$Just(value)), dict);
	});
	var _elm_lang$core$Dict$singleton = F2(function (key, value) {
		return A3(_elm_lang$core$Dict$insert, key, value, _elm_lang$core$Dict$empty);
	});
	var _elm_lang$core$Dict$union = F2(function (t1, t2) {
		return A3(_elm_lang$core$Dict$foldl, _elm_lang$core$Dict$insert, t2, t1);
	});
	var _elm_lang$core$Dict$filter = F2(function (predicate, dictionary) {
		var add = F3(function (key, value, dict) {
			return A2(predicate, key, value) ? A3(_elm_lang$core$Dict$insert, key, value, dict) : dict;
		});
		return A3(_elm_lang$core$Dict$foldl, add, _elm_lang$core$Dict$empty, dictionary);
	});
	var _elm_lang$core$Dict$intersect = F2(function (t1, t2) {
		return A2(_elm_lang$core$Dict$filter, F2(function (k, _p58) {
			return A2(_elm_lang$core$Dict$member, k, t2);
		}), t1);
	});
	var _elm_lang$core$Dict$partition = F2(function (predicate, dict) {
		var add = F3(function (key, value, _p59) {
			var _p60 = _p59;
			var _p62 = _p60._1;
			var _p61 = _p60._0;
			return A2(predicate, key, value) ? {
				ctor: '_Tuple2',
				_0: A3(_elm_lang$core$Dict$insert, key, value, _p61),
				_1: _p62
			} : {
				ctor: '_Tuple2',
				_0: _p61,
				_1: A3(_elm_lang$core$Dict$insert, key, value, _p62)
			};
		});
		return A3(_elm_lang$core$Dict$foldl, add, { ctor: '_Tuple2', _0: _elm_lang$core$Dict$empty, _1: _elm_lang$core$Dict$empty }, dict);
	});
	var _elm_lang$core$Dict$fromList = function _elm_lang$core$Dict$fromList(assocs) {
		return A3(_elm_lang$core$List$foldl, F2(function (_p63, dict) {
			var _p64 = _p63;
			return A3(_elm_lang$core$Dict$insert, _p64._0, _p64._1, dict);
		}), _elm_lang$core$Dict$empty, assocs);
	};
	var _elm_lang$core$Dict$remove = F2(function (key, dict) {
		return A3(_elm_lang$core$Dict$update, key, _elm_lang$core$Basics$always(_elm_lang$core$Maybe$Nothing), dict);
	});
	var _elm_lang$core$Dict$diff = F2(function (t1, t2) {
		return A3(_elm_lang$core$Dict$foldl, F3(function (k, v, t) {
			return A2(_elm_lang$core$Dict$remove, k, t);
		}), t1, t2);
	});

	//import Native.Scheduler //

	var _elm_lang$core$Native_Time = function () {

		var now = _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
			callback(_elm_lang$core$Native_Scheduler.succeed(Date.now()));
		});

		function setInterval_(interval, task) {
			return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
				var id = setInterval(function () {
					_elm_lang$core$Native_Scheduler.rawSpawn(task);
				}, interval);

				return function () {
					clearInterval(id);
				};
			});
		}

		return {
			now: now,
			setInterval_: F2(setInterval_)
		};
	}();
	var _elm_lang$core$Task$onError = _elm_lang$core$Native_Scheduler.onError;
	var _elm_lang$core$Task$andThen = _elm_lang$core$Native_Scheduler.andThen;
	var _elm_lang$core$Task$spawnCmd = F2(function (router, _p0) {
		var _p1 = _p0;
		return _elm_lang$core$Native_Scheduler.spawn(A2(_elm_lang$core$Task$andThen, _elm_lang$core$Platform$sendToApp(router), _p1._0));
	});
	var _elm_lang$core$Task$fail = _elm_lang$core$Native_Scheduler.fail;
	var _elm_lang$core$Task$mapError = F2(function (convert, task) {
		return A2(_elm_lang$core$Task$onError, function (_p2) {
			return _elm_lang$core$Task$fail(convert(_p2));
		}, task);
	});
	var _elm_lang$core$Task$succeed = _elm_lang$core$Native_Scheduler.succeed;
	var _elm_lang$core$Task$map = F2(function (func, taskA) {
		return A2(_elm_lang$core$Task$andThen, function (a) {
			return _elm_lang$core$Task$succeed(func(a));
		}, taskA);
	});
	var _elm_lang$core$Task$map2 = F3(function (func, taskA, taskB) {
		return A2(_elm_lang$core$Task$andThen, function (a) {
			return A2(_elm_lang$core$Task$andThen, function (b) {
				return _elm_lang$core$Task$succeed(A2(func, a, b));
			}, taskB);
		}, taskA);
	});
	var _elm_lang$core$Task$map3 = F4(function (func, taskA, taskB, taskC) {
		return A2(_elm_lang$core$Task$andThen, function (a) {
			return A2(_elm_lang$core$Task$andThen, function (b) {
				return A2(_elm_lang$core$Task$andThen, function (c) {
					return _elm_lang$core$Task$succeed(A3(func, a, b, c));
				}, taskC);
			}, taskB);
		}, taskA);
	});
	var _elm_lang$core$Task$map4 = F5(function (func, taskA, taskB, taskC, taskD) {
		return A2(_elm_lang$core$Task$andThen, function (a) {
			return A2(_elm_lang$core$Task$andThen, function (b) {
				return A2(_elm_lang$core$Task$andThen, function (c) {
					return A2(_elm_lang$core$Task$andThen, function (d) {
						return _elm_lang$core$Task$succeed(A4(func, a, b, c, d));
					}, taskD);
				}, taskC);
			}, taskB);
		}, taskA);
	});
	var _elm_lang$core$Task$map5 = F6(function (func, taskA, taskB, taskC, taskD, taskE) {
		return A2(_elm_lang$core$Task$andThen, function (a) {
			return A2(_elm_lang$core$Task$andThen, function (b) {
				return A2(_elm_lang$core$Task$andThen, function (c) {
					return A2(_elm_lang$core$Task$andThen, function (d) {
						return A2(_elm_lang$core$Task$andThen, function (e) {
							return _elm_lang$core$Task$succeed(A5(func, a, b, c, d, e));
						}, taskE);
					}, taskD);
				}, taskC);
			}, taskB);
		}, taskA);
	});
	var _elm_lang$core$Task$sequence = function _elm_lang$core$Task$sequence(tasks) {
		var _p3 = tasks;
		if (_p3.ctor === '[]') {
			return _elm_lang$core$Task$succeed({ ctor: '[]' });
		} else {
			return A3(_elm_lang$core$Task$map2, F2(function (x, y) {
				return { ctor: '::', _0: x, _1: y };
			}), _p3._0, _elm_lang$core$Task$sequence(_p3._1));
		}
	};
	var _elm_lang$core$Task$onEffects = F3(function (router, commands, state) {
		return A2(_elm_lang$core$Task$map, function (_p4) {
			return { ctor: '_Tuple0' };
		}, _elm_lang$core$Task$sequence(A2(_elm_lang$core$List$map, _elm_lang$core$Task$spawnCmd(router), commands)));
	});
	var _elm_lang$core$Task$init = _elm_lang$core$Task$succeed({ ctor: '_Tuple0' });
	var _elm_lang$core$Task$onSelfMsg = F3(function (_p7, _p6, _p5) {
		return _elm_lang$core$Task$succeed({ ctor: '_Tuple0' });
	});
	var _elm_lang$core$Task$command = _elm_lang$core$Native_Platform.leaf('Task');
	var _elm_lang$core$Task$Perform = function _elm_lang$core$Task$Perform(a) {
		return { ctor: 'Perform', _0: a };
	};
	var _elm_lang$core$Task$perform = F2(function (toMessage, task) {
		return _elm_lang$core$Task$command(_elm_lang$core$Task$Perform(A2(_elm_lang$core$Task$map, toMessage, task)));
	});
	var _elm_lang$core$Task$attempt = F2(function (resultToMessage, task) {
		return _elm_lang$core$Task$command(_elm_lang$core$Task$Perform(A2(_elm_lang$core$Task$onError, function (_p8) {
			return _elm_lang$core$Task$succeed(resultToMessage(_elm_lang$core$Result$Err(_p8)));
		}, A2(_elm_lang$core$Task$andThen, function (_p9) {
			return _elm_lang$core$Task$succeed(resultToMessage(_elm_lang$core$Result$Ok(_p9)));
		}, task))));
	});
	var _elm_lang$core$Task$cmdMap = F2(function (tagger, _p10) {
		var _p11 = _p10;
		return _elm_lang$core$Task$Perform(A2(_elm_lang$core$Task$map, tagger, _p11._0));
	});
	_elm_lang$core$Native_Platform.effectManagers['Task'] = { pkg: 'elm-lang/core', init: _elm_lang$core$Task$init, onEffects: _elm_lang$core$Task$onEffects, onSelfMsg: _elm_lang$core$Task$onSelfMsg, tag: 'cmd', cmdMap: _elm_lang$core$Task$cmdMap };

	var _elm_lang$core$Time$setInterval = _elm_lang$core$Native_Time.setInterval_;
	var _elm_lang$core$Time$spawnHelp = F3(function (router, intervals, processes) {
		var _p0 = intervals;
		if (_p0.ctor === '[]') {
			return _elm_lang$core$Task$succeed(processes);
		} else {
			var _p1 = _p0._0;
			var spawnRest = function spawnRest(id) {
				return A3(_elm_lang$core$Time$spawnHelp, router, _p0._1, A3(_elm_lang$core$Dict$insert, _p1, id, processes));
			};
			var spawnTimer = _elm_lang$core$Native_Scheduler.spawn(A2(_elm_lang$core$Time$setInterval, _p1, A2(_elm_lang$core$Platform$sendToSelf, router, _p1)));
			return A2(_elm_lang$core$Task$andThen, spawnRest, spawnTimer);
		}
	});
	var _elm_lang$core$Time$addMySub = F2(function (_p2, state) {
		var _p3 = _p2;
		var _p6 = _p3._1;
		var _p5 = _p3._0;
		var _p4 = A2(_elm_lang$core$Dict$get, _p5, state);
		if (_p4.ctor === 'Nothing') {
			return A3(_elm_lang$core$Dict$insert, _p5, {
				ctor: '::',
				_0: _p6,
				_1: { ctor: '[]' }
			}, state);
		} else {
			return A3(_elm_lang$core$Dict$insert, _p5, { ctor: '::', _0: _p6, _1: _p4._0 }, state);
		}
	});
	var _elm_lang$core$Time$inMilliseconds = function _elm_lang$core$Time$inMilliseconds(t) {
		return t;
	};
	var _elm_lang$core$Time$millisecond = 1;
	var _elm_lang$core$Time$second = 1000 * _elm_lang$core$Time$millisecond;
	var _elm_lang$core$Time$minute = 60 * _elm_lang$core$Time$second;
	var _elm_lang$core$Time$hour = 60 * _elm_lang$core$Time$minute;
	var _elm_lang$core$Time$inHours = function _elm_lang$core$Time$inHours(t) {
		return t / _elm_lang$core$Time$hour;
	};
	var _elm_lang$core$Time$inMinutes = function _elm_lang$core$Time$inMinutes(t) {
		return t / _elm_lang$core$Time$minute;
	};
	var _elm_lang$core$Time$inSeconds = function _elm_lang$core$Time$inSeconds(t) {
		return t / _elm_lang$core$Time$second;
	};
	var _elm_lang$core$Time$now = _elm_lang$core$Native_Time.now;
	var _elm_lang$core$Time$onSelfMsg = F3(function (router, interval, state) {
		var _p7 = A2(_elm_lang$core$Dict$get, interval, state.taggers);
		if (_p7.ctor === 'Nothing') {
			return _elm_lang$core$Task$succeed(state);
		} else {
			var tellTaggers = function tellTaggers(time) {
				return _elm_lang$core$Task$sequence(A2(_elm_lang$core$List$map, function (tagger) {
					return A2(_elm_lang$core$Platform$sendToApp, router, tagger(time));
				}, _p7._0));
			};
			return A2(_elm_lang$core$Task$andThen, function (_p8) {
				return _elm_lang$core$Task$succeed(state);
			}, A2(_elm_lang$core$Task$andThen, tellTaggers, _elm_lang$core$Time$now));
		}
	});
	var _elm_lang$core$Time$subscription = _elm_lang$core$Native_Platform.leaf('Time');
	var _elm_lang$core$Time$State = F2(function (a, b) {
		return { taggers: a, processes: b };
	});
	var _elm_lang$core$Time$init = _elm_lang$core$Task$succeed(A2(_elm_lang$core$Time$State, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty));
	var _elm_lang$core$Time$onEffects = F3(function (router, subs, _p9) {
		var _p10 = _p9;
		var rightStep = F3(function (_p12, id, _p11) {
			var _p13 = _p11;
			return {
				ctor: '_Tuple3',
				_0: _p13._0,
				_1: _p13._1,
				_2: A2(_elm_lang$core$Task$andThen, function (_p14) {
					return _p13._2;
				}, _elm_lang$core$Native_Scheduler.kill(id))
			};
		});
		var bothStep = F4(function (interval, taggers, id, _p15) {
			var _p16 = _p15;
			return {
				ctor: '_Tuple3',
				_0: _p16._0,
				_1: A3(_elm_lang$core$Dict$insert, interval, id, _p16._1),
				_2: _p16._2
			};
		});
		var leftStep = F3(function (interval, taggers, _p17) {
			var _p18 = _p17;
			return {
				ctor: '_Tuple3',
				_0: { ctor: '::', _0: interval, _1: _p18._0 },
				_1: _p18._1,
				_2: _p18._2
			};
		});
		var newTaggers = A3(_elm_lang$core$List$foldl, _elm_lang$core$Time$addMySub, _elm_lang$core$Dict$empty, subs);
		var _p19 = A6(_elm_lang$core$Dict$merge, leftStep, bothStep, rightStep, newTaggers, _p10.processes, {
			ctor: '_Tuple3',
			_0: { ctor: '[]' },
			_1: _elm_lang$core$Dict$empty,
			_2: _elm_lang$core$Task$succeed({ ctor: '_Tuple0' })
		});
		var spawnList = _p19._0;
		var existingDict = _p19._1;
		var killTask = _p19._2;
		return A2(_elm_lang$core$Task$andThen, function (newProcesses) {
			return _elm_lang$core$Task$succeed(A2(_elm_lang$core$Time$State, newTaggers, newProcesses));
		}, A2(_elm_lang$core$Task$andThen, function (_p20) {
			return A3(_elm_lang$core$Time$spawnHelp, router, spawnList, existingDict);
		}, killTask));
	});
	var _elm_lang$core$Time$Every = F2(function (a, b) {
		return { ctor: 'Every', _0: a, _1: b };
	});
	var _elm_lang$core$Time$every = F2(function (interval, tagger) {
		return _elm_lang$core$Time$subscription(A2(_elm_lang$core$Time$Every, interval, tagger));
	});
	var _elm_lang$core$Time$subMap = F2(function (f, _p21) {
		var _p22 = _p21;
		return A2(_elm_lang$core$Time$Every, _p22._0, function (_p23) {
			return f(_p22._1(_p23));
		});
	});
	_elm_lang$core$Native_Platform.effectManagers['Time'] = { pkg: 'elm-lang/core', init: _elm_lang$core$Time$init, onEffects: _elm_lang$core$Time$onEffects, onSelfMsg: _elm_lang$core$Time$onSelfMsg, tag: 'sub', subMap: _elm_lang$core$Time$subMap };

	//import Native.List //

	var _elm_lang$core$Native_Array = function () {

		// A RRB-Tree has two distinct data types.
		// Leaf -> "height"  is always 0
		//         "table"   is an array of elements
		// Node -> "height"  is always greater than 0
		//         "table"   is an array of child nodes
		//         "lengths" is an array of accumulated lengths of the child nodes

		// M is the maximal table size. 32 seems fast. E is the allowed increase
		// of search steps when concatting to find an index. Lower values will
		// decrease balancing, but will increase search steps.
		var M = 32;
		var E = 2;

		// An empty array.
		var empty = {
			ctor: '_Array',
			height: 0,
			table: []
		};

		function get(i, array) {
			if (i < 0 || i >= length(array)) {
				throw new Error('Index ' + i + ' is out of range. Check the length of ' + 'your array first or use getMaybe or getWithDefault.');
			}
			return unsafeGet(i, array);
		}

		function unsafeGet(i, array) {
			for (var x = array.height; x > 0; x--) {
				var slot = i >> x * 5;
				while (array.lengths[slot] <= i) {
					slot++;
				}
				if (slot > 0) {
					i -= array.lengths[slot - 1];
				}
				array = array.table[slot];
			}
			return array.table[i];
		}

		// Sets the value at the index i. Only the nodes leading to i will get
		// copied and updated.
		function set(i, item, array) {
			if (i < 0 || length(array) <= i) {
				return array;
			}
			return unsafeSet(i, item, array);
		}

		function unsafeSet(i, item, array) {
			array = nodeCopy(array);

			if (array.height === 0) {
				array.table[i] = item;
			} else {
				var slot = getSlot(i, array);
				if (slot > 0) {
					i -= array.lengths[slot - 1];
				}
				array.table[slot] = unsafeSet(i, item, array.table[slot]);
			}
			return array;
		}

		function initialize(len, f) {
			if (len <= 0) {
				return empty;
			}
			var h = Math.floor(Math.log(len) / Math.log(M));
			return initialize_(f, h, 0, len);
		}

		function initialize_(f, h, from, to) {
			if (h === 0) {
				var table = new Array((to - from) % (M + 1));
				for (var i = 0; i < table.length; i++) {
					table[i] = f(from + i);
				}
				return {
					ctor: '_Array',
					height: 0,
					table: table
				};
			}

			var step = Math.pow(M, h);
			var table = new Array(Math.ceil((to - from) / step));
			var lengths = new Array(table.length);
			for (var i = 0; i < table.length; i++) {
				table[i] = initialize_(f, h - 1, from + i * step, Math.min(from + (i + 1) * step, to));
				lengths[i] = length(table[i]) + (i > 0 ? lengths[i - 1] : 0);
			}
			return {
				ctor: '_Array',
				height: h,
				table: table,
				lengths: lengths
			};
		}

		function fromList(list) {
			if (list.ctor === '[]') {
				return empty;
			}

			// Allocate M sized blocks (table) and write list elements to it.
			var table = new Array(M);
			var nodes = [];
			var i = 0;

			while (list.ctor !== '[]') {
				table[i] = list._0;
				list = list._1;
				i++;

				// table is full, so we can push a leaf containing it into the
				// next node.
				if (i === M) {
					var leaf = {
						ctor: '_Array',
						height: 0,
						table: table
					};
					fromListPush(leaf, nodes);
					table = new Array(M);
					i = 0;
				}
			}

			// Maybe there is something left on the table.
			if (i > 0) {
				var leaf = {
					ctor: '_Array',
					height: 0,
					table: table.splice(0, i)
				};
				fromListPush(leaf, nodes);
			}

			// Go through all of the nodes and eventually push them into higher nodes.
			for (var h = 0; h < nodes.length - 1; h++) {
				if (nodes[h].table.length > 0) {
					fromListPush(nodes[h], nodes);
				}
			}

			var head = nodes[nodes.length - 1];
			if (head.height > 0 && head.table.length === 1) {
				return head.table[0];
			} else {
				return head;
			}
		}

		// Push a node into a higher node as a child.
		function fromListPush(toPush, nodes) {
			var h = toPush.height;

			// Maybe the node on this height does not exist.
			if (nodes.length === h) {
				var node = {
					ctor: '_Array',
					height: h + 1,
					table: [],
					lengths: []
				};
				nodes.push(node);
			}

			nodes[h].table.push(toPush);
			var len = length(toPush);
			if (nodes[h].lengths.length > 0) {
				len += nodes[h].lengths[nodes[h].lengths.length - 1];
			}
			nodes[h].lengths.push(len);

			if (nodes[h].table.length === M) {
				fromListPush(nodes[h], nodes);
				nodes[h] = {
					ctor: '_Array',
					height: h + 1,
					table: [],
					lengths: []
				};
			}
		}

		// Pushes an item via push_ to the bottom right of a tree.
		function push(item, a) {
			var pushed = push_(item, a);
			if (pushed !== null) {
				return pushed;
			}

			var newTree = create(item, a.height);
			return siblise(a, newTree);
		}

		// Recursively tries to push an item to the bottom-right most
		// tree possible. If there is no space left for the item,
		// null will be returned.
		function push_(item, a) {
			// Handle resursion stop at leaf level.
			if (a.height === 0) {
				if (a.table.length < M) {
					var newA = {
						ctor: '_Array',
						height: 0,
						table: a.table.slice()
					};
					newA.table.push(item);
					return newA;
				} else {
					return null;
				}
			}

			// Recursively push
			var pushed = push_(item, botRight(a));

			// There was space in the bottom right tree, so the slot will
			// be updated.
			if (pushed !== null) {
				var newA = nodeCopy(a);
				newA.table[newA.table.length - 1] = pushed;
				newA.lengths[newA.lengths.length - 1]++;
				return newA;
			}

			// When there was no space left, check if there is space left
			// for a new slot with a tree which contains only the item
			// at the bottom.
			if (a.table.length < M) {
				var newSlot = create(item, a.height - 1);
				var newA = nodeCopy(a);
				newA.table.push(newSlot);
				newA.lengths.push(newA.lengths[newA.lengths.length - 1] + length(newSlot));
				return newA;
			} else {
				return null;
			}
		}

		// Converts an array into a list of elements.
		function toList(a) {
			return toList_(_elm_lang$core$Native_List.Nil, a);
		}

		function toList_(list, a) {
			for (var i = a.table.length - 1; i >= 0; i--) {
				list = a.height === 0 ? _elm_lang$core$Native_List.Cons(a.table[i], list) : toList_(list, a.table[i]);
			}
			return list;
		}

		// Maps a function over the elements of an array.
		function map(f, a) {
			var newA = {
				ctor: '_Array',
				height: a.height,
				table: new Array(a.table.length)
			};
			if (a.height > 0) {
				newA.lengths = a.lengths;
			}
			for (var i = 0; i < a.table.length; i++) {
				newA.table[i] = a.height === 0 ? f(a.table[i]) : map(f, a.table[i]);
			}
			return newA;
		}

		// Maps a function over the elements with their index as first argument.
		function indexedMap(f, a) {
			return indexedMap_(f, a, 0);
		}

		function indexedMap_(f, a, from) {
			var newA = {
				ctor: '_Array',
				height: a.height,
				table: new Array(a.table.length)
			};
			if (a.height > 0) {
				newA.lengths = a.lengths;
			}
			for (var i = 0; i < a.table.length; i++) {
				newA.table[i] = a.height === 0 ? A2(f, from + i, a.table[i]) : indexedMap_(f, a.table[i], i == 0 ? from : from + a.lengths[i - 1]);
			}
			return newA;
		}

		function foldl(f, b, a) {
			if (a.height === 0) {
				for (var i = 0; i < a.table.length; i++) {
					b = A2(f, a.table[i], b);
				}
			} else {
				for (var i = 0; i < a.table.length; i++) {
					b = foldl(f, b, a.table[i]);
				}
			}
			return b;
		}

		function foldr(f, b, a) {
			if (a.height === 0) {
				for (var i = a.table.length; i--;) {
					b = A2(f, a.table[i], b);
				}
			} else {
				for (var i = a.table.length; i--;) {
					b = foldr(f, b, a.table[i]);
				}
			}
			return b;
		}

		// TODO: currently, it slices the right, then the left. This can be
		// optimized.
		function slice(from, to, a) {
			if (from < 0) {
				from += length(a);
			}
			if (to < 0) {
				to += length(a);
			}
			return sliceLeft(from, sliceRight(to, a));
		}

		function sliceRight(to, a) {
			if (to === length(a)) {
				return a;
			}

			// Handle leaf level.
			if (a.height === 0) {
				var newA = { ctor: '_Array', height: 0 };
				newA.table = a.table.slice(0, to);
				return newA;
			}

			// Slice the right recursively.
			var right = getSlot(to, a);
			var sliced = sliceRight(to - (right > 0 ? a.lengths[right - 1] : 0), a.table[right]);

			// Maybe the a node is not even needed, as sliced contains the whole slice.
			if (right === 0) {
				return sliced;
			}

			// Create new node.
			var newA = {
				ctor: '_Array',
				height: a.height,
				table: a.table.slice(0, right),
				lengths: a.lengths.slice(0, right)
			};
			if (sliced.table.length > 0) {
				newA.table[right] = sliced;
				newA.lengths[right] = length(sliced) + (right > 0 ? newA.lengths[right - 1] : 0);
			}
			return newA;
		}

		function sliceLeft(from, a) {
			if (from === 0) {
				return a;
			}

			// Handle leaf level.
			if (a.height === 0) {
				var newA = { ctor: '_Array', height: 0 };
				newA.table = a.table.slice(from, a.table.length + 1);
				return newA;
			}

			// Slice the left recursively.
			var left = getSlot(from, a);
			var sliced = sliceLeft(from - (left > 0 ? a.lengths[left - 1] : 0), a.table[left]);

			// Maybe the a node is not even needed, as sliced contains the whole slice.
			if (left === a.table.length - 1) {
				return sliced;
			}

			// Create new node.
			var newA = {
				ctor: '_Array',
				height: a.height,
				table: a.table.slice(left, a.table.length + 1),
				lengths: new Array(a.table.length - left)
			};
			newA.table[0] = sliced;
			var len = 0;
			for (var i = 0; i < newA.table.length; i++) {
				len += length(newA.table[i]);
				newA.lengths[i] = len;
			}

			return newA;
		}

		// Appends two trees.
		function append(a, b) {
			if (a.table.length === 0) {
				return b;
			}
			if (b.table.length === 0) {
				return a;
			}

			var c = append_(a, b);

			// Check if both nodes can be crunshed together.
			if (c[0].table.length + c[1].table.length <= M) {
				if (c[0].table.length === 0) {
					return c[1];
				}
				if (c[1].table.length === 0) {
					return c[0];
				}

				// Adjust .table and .lengths
				c[0].table = c[0].table.concat(c[1].table);
				if (c[0].height > 0) {
					var len = length(c[0]);
					for (var i = 0; i < c[1].lengths.length; i++) {
						c[1].lengths[i] += len;
					}
					c[0].lengths = c[0].lengths.concat(c[1].lengths);
				}

				return c[0];
			}

			if (c[0].height > 0) {
				var toRemove = calcToRemove(a, b);
				if (toRemove > E) {
					c = shuffle(c[0], c[1], toRemove);
				}
			}

			return siblise(c[0], c[1]);
		}

		// Returns an array of two nodes; right and left. One node _may_ be empty.
		function append_(a, b) {
			if (a.height === 0 && b.height === 0) {
				return [a, b];
			}

			if (a.height !== 1 || b.height !== 1) {
				if (a.height === b.height) {
					a = nodeCopy(a);
					b = nodeCopy(b);
					var appended = append_(botRight(a), botLeft(b));

					insertRight(a, appended[1]);
					insertLeft(b, appended[0]);
				} else if (a.height > b.height) {
					a = nodeCopy(a);
					var appended = append_(botRight(a), b);

					insertRight(a, appended[0]);
					b = parentise(appended[1], appended[1].height + 1);
				} else {
					b = nodeCopy(b);
					var appended = append_(a, botLeft(b));

					var left = appended[0].table.length === 0 ? 0 : 1;
					var right = left === 0 ? 1 : 0;
					insertLeft(b, appended[left]);
					a = parentise(appended[right], appended[right].height + 1);
				}
			}

			// Check if balancing is needed and return based on that.
			if (a.table.length === 0 || b.table.length === 0) {
				return [a, b];
			}

			var toRemove = calcToRemove(a, b);
			if (toRemove <= E) {
				return [a, b];
			}
			return shuffle(a, b, toRemove);
		}

		// Helperfunctions for append_. Replaces a child node at the side of the parent.
		function insertRight(parent, node) {
			var index = parent.table.length - 1;
			parent.table[index] = node;
			parent.lengths[index] = length(node);
			parent.lengths[index] += index > 0 ? parent.lengths[index - 1] : 0;
		}

		function insertLeft(parent, node) {
			if (node.table.length > 0) {
				parent.table[0] = node;
				parent.lengths[0] = length(node);

				var len = length(parent.table[0]);
				for (var i = 1; i < parent.lengths.length; i++) {
					len += length(parent.table[i]);
					parent.lengths[i] = len;
				}
			} else {
				parent.table.shift();
				for (var i = 1; i < parent.lengths.length; i++) {
					parent.lengths[i] = parent.lengths[i] - parent.lengths[0];
				}
				parent.lengths.shift();
			}
		}

		// Returns the extra search steps for E. Refer to the paper.
		function calcToRemove(a, b) {
			var subLengths = 0;
			for (var i = 0; i < a.table.length; i++) {
				subLengths += a.table[i].table.length;
			}
			for (var i = 0; i < b.table.length; i++) {
				subLengths += b.table[i].table.length;
			}

			var toRemove = a.table.length + b.table.length;
			return toRemove - (Math.floor((subLengths - 1) / M) + 1);
		}

		// get2, set2 and saveSlot are helpers for accessing elements over two arrays.
		function get2(a, b, index) {
			return index < a.length ? a[index] : b[index - a.length];
		}

		function set2(a, b, index, value) {
			if (index < a.length) {
				a[index] = value;
			} else {
				b[index - a.length] = value;
			}
		}

		function saveSlot(a, b, index, slot) {
			set2(a.table, b.table, index, slot);

			var l = index === 0 || index === a.lengths.length ? 0 : get2(a.lengths, a.lengths, index - 1);

			set2(a.lengths, b.lengths, index, l + length(slot));
		}

		// Creates a node or leaf with a given length at their arrays for perfomance.
		// Is only used by shuffle.
		function createNode(h, length) {
			if (length < 0) {
				length = 0;
			}
			var a = {
				ctor: '_Array',
				height: h,
				table: new Array(length)
			};
			if (h > 0) {
				a.lengths = new Array(length);
			}
			return a;
		}

		// Returns an array of two balanced nodes.
		function shuffle(a, b, toRemove) {
			var newA = createNode(a.height, Math.min(M, a.table.length + b.table.length - toRemove));
			var newB = createNode(a.height, newA.table.length - (a.table.length + b.table.length - toRemove));

			// Skip the slots with size M. More precise: copy the slot references
			// to the new node
			var read = 0;
			while (get2(a.table, b.table, read).table.length % M === 0) {
				set2(newA.table, newB.table, read, get2(a.table, b.table, read));
				set2(newA.lengths, newB.lengths, read, get2(a.lengths, b.lengths, read));
				read++;
			}

			// Pulling items from left to right, caching in a slot before writing
			// it into the new nodes.
			var write = read;
			var slot = new createNode(a.height - 1, 0);
			var from = 0;

			// If the current slot is still containing data, then there will be at
			// least one more write, so we do not break this loop yet.
			while (read - write - (slot.table.length > 0 ? 1 : 0) < toRemove) {
				// Find out the max possible items for copying.
				var source = get2(a.table, b.table, read);
				var to = Math.min(M - slot.table.length, source.table.length);

				// Copy and adjust size table.
				slot.table = slot.table.concat(source.table.slice(from, to));
				if (slot.height > 0) {
					var len = slot.lengths.length;
					for (var i = len; i < len + to - from; i++) {
						slot.lengths[i] = length(slot.table[i]);
						slot.lengths[i] += i > 0 ? slot.lengths[i - 1] : 0;
					}
				}

				from += to;

				// Only proceed to next slots[i] if the current one was
				// fully copied.
				if (source.table.length <= to) {
					read++;from = 0;
				}

				// Only create a new slot if the current one is filled up.
				if (slot.table.length === M) {
					saveSlot(newA, newB, write, slot);
					slot = createNode(a.height - 1, 0);
					write++;
				}
			}

			// Cleanup after the loop. Copy the last slot into the new nodes.
			if (slot.table.length > 0) {
				saveSlot(newA, newB, write, slot);
				write++;
			}

			// Shift the untouched slots to the left
			while (read < a.table.length + b.table.length) {
				saveSlot(newA, newB, write, get2(a.table, b.table, read));
				read++;
				write++;
			}

			return [newA, newB];
		}

		// Navigation functions
		function botRight(a) {
			return a.table[a.table.length - 1];
		}
		function botLeft(a) {
			return a.table[0];
		}

		// Copies a node for updating. Note that you should not use this if
		// only updating only one of "table" or "lengths" for performance reasons.
		function nodeCopy(a) {
			var newA = {
				ctor: '_Array',
				height: a.height,
				table: a.table.slice()
			};
			if (a.height > 0) {
				newA.lengths = a.lengths.slice();
			}
			return newA;
		}

		// Returns how many items are in the tree.
		function length(array) {
			if (array.height === 0) {
				return array.table.length;
			} else {
				return array.lengths[array.lengths.length - 1];
			}
		}

		// Calculates in which slot of "table" the item probably is, then
		// find the exact slot via forward searching in  "lengths". Returns the index.
		function getSlot(i, a) {
			var slot = i >> 5 * a.height;
			while (a.lengths[slot] <= i) {
				slot++;
			}
			return slot;
		}

		// Recursively creates a tree with a given height containing
		// only the given item.
		function create(item, h) {
			if (h === 0) {
				return {
					ctor: '_Array',
					height: 0,
					table: [item]
				};
			}
			return {
				ctor: '_Array',
				height: h,
				table: [create(item, h - 1)],
				lengths: [1]
			};
		}

		// Recursively creates a tree that contains the given tree.
		function parentise(tree, h) {
			if (h === tree.height) {
				return tree;
			}

			return {
				ctor: '_Array',
				height: h,
				table: [parentise(tree, h - 1)],
				lengths: [length(tree)]
			};
		}

		// Emphasizes blood brotherhood beneath two trees.
		function siblise(a, b) {
			return {
				ctor: '_Array',
				height: a.height + 1,
				table: [a, b],
				lengths: [length(a), length(a) + length(b)]
			};
		}

		function toJSArray(a) {
			var jsArray = new Array(length(a));
			toJSArray_(jsArray, 0, a);
			return jsArray;
		}

		function toJSArray_(jsArray, i, a) {
			for (var t = 0; t < a.table.length; t++) {
				if (a.height === 0) {
					jsArray[i + t] = a.table[t];
				} else {
					var inc = t === 0 ? 0 : a.lengths[t - 1];
					toJSArray_(jsArray, i + inc, a.table[t]);
				}
			}
		}

		function fromJSArray(jsArray) {
			if (jsArray.length === 0) {
				return empty;
			}
			var h = Math.floor(Math.log(jsArray.length) / Math.log(M));
			return fromJSArray_(jsArray, h, 0, jsArray.length);
		}

		function fromJSArray_(jsArray, h, from, to) {
			if (h === 0) {
				return {
					ctor: '_Array',
					height: 0,
					table: jsArray.slice(from, to)
				};
			}

			var step = Math.pow(M, h);
			var table = new Array(Math.ceil((to - from) / step));
			var lengths = new Array(table.length);
			for (var i = 0; i < table.length; i++) {
				table[i] = fromJSArray_(jsArray, h - 1, from + i * step, Math.min(from + (i + 1) * step, to));
				lengths[i] = length(table[i]) + (i > 0 ? lengths[i - 1] : 0);
			}
			return {
				ctor: '_Array',
				height: h,
				table: table,
				lengths: lengths
			};
		}

		return {
			empty: empty,
			fromList: fromList,
			toList: toList,
			initialize: F2(initialize),
			append: F2(append),
			push: F2(push),
			slice: F3(slice),
			get: F2(get),
			set: F3(set),
			map: F2(map),
			indexedMap: F2(indexedMap),
			foldl: F3(foldl),
			foldr: F3(foldr),
			length: length,

			toJSArray: toJSArray,
			fromJSArray: fromJSArray
		};
	}();
	var _elm_lang$core$Array$append = _elm_lang$core$Native_Array.append;
	var _elm_lang$core$Array$length = _elm_lang$core$Native_Array.length;
	var _elm_lang$core$Array$isEmpty = function _elm_lang$core$Array$isEmpty(array) {
		return _elm_lang$core$Native_Utils.eq(_elm_lang$core$Array$length(array), 0);
	};
	var _elm_lang$core$Array$slice = _elm_lang$core$Native_Array.slice;
	var _elm_lang$core$Array$set = _elm_lang$core$Native_Array.set;
	var _elm_lang$core$Array$get = F2(function (i, array) {
		return _elm_lang$core$Native_Utils.cmp(0, i) < 1 && _elm_lang$core$Native_Utils.cmp(i, _elm_lang$core$Native_Array.length(array)) < 0 ? _elm_lang$core$Maybe$Just(A2(_elm_lang$core$Native_Array.get, i, array)) : _elm_lang$core$Maybe$Nothing;
	});
	var _elm_lang$core$Array$push = _elm_lang$core$Native_Array.push;
	var _elm_lang$core$Array$empty = _elm_lang$core$Native_Array.empty;
	var _elm_lang$core$Array$filter = F2(function (isOkay, arr) {
		var update = F2(function (x, xs) {
			return isOkay(x) ? A2(_elm_lang$core$Native_Array.push, x, xs) : xs;
		});
		return A3(_elm_lang$core$Native_Array.foldl, update, _elm_lang$core$Native_Array.empty, arr);
	});
	var _elm_lang$core$Array$foldr = _elm_lang$core$Native_Array.foldr;
	var _elm_lang$core$Array$foldl = _elm_lang$core$Native_Array.foldl;
	var _elm_lang$core$Array$indexedMap = _elm_lang$core$Native_Array.indexedMap;
	var _elm_lang$core$Array$map = _elm_lang$core$Native_Array.map;
	var _elm_lang$core$Array$toIndexedList = function _elm_lang$core$Array$toIndexedList(array) {
		return A3(_elm_lang$core$List$map2, F2(function (v0, v1) {
			return { ctor: '_Tuple2', _0: v0, _1: v1 };
		}), A2(_elm_lang$core$List$range, 0, _elm_lang$core$Native_Array.length(array) - 1), _elm_lang$core$Native_Array.toList(array));
	};
	var _elm_lang$core$Array$toList = _elm_lang$core$Native_Array.toList;
	var _elm_lang$core$Array$fromList = _elm_lang$core$Native_Array.fromList;
	var _elm_lang$core$Array$initialize = _elm_lang$core$Native_Array.initialize;
	var _elm_lang$core$Array$repeat = F2(function (n, e) {
		return A2(_elm_lang$core$Array$initialize, n, _elm_lang$core$Basics$always(e));
	});
	var _elm_lang$core$Array$Array = { ctor: 'Array' };

	//import Maybe, Native.Array, Native.List, Native.Utils, Result //

	var _elm_lang$core$Native_Json = function () {

		// CORE DECODERS

		function succeed(msg) {
			return {
				ctor: '<decoder>',
				tag: 'succeed',
				msg: msg
			};
		}

		function fail(msg) {
			return {
				ctor: '<decoder>',
				tag: 'fail',
				msg: msg
			};
		}

		function decodePrimitive(tag) {
			return {
				ctor: '<decoder>',
				tag: tag
			};
		}

		function decodeContainer(tag, decoder) {
			return {
				ctor: '<decoder>',
				tag: tag,
				decoder: decoder
			};
		}

		function decodeNull(value) {
			return {
				ctor: '<decoder>',
				tag: 'null',
				value: value
			};
		}

		function decodeField(field, decoder) {
			return {
				ctor: '<decoder>',
				tag: 'field',
				field: field,
				decoder: decoder
			};
		}

		function decodeIndex(index, decoder) {
			return {
				ctor: '<decoder>',
				tag: 'index',
				index: index,
				decoder: decoder
			};
		}

		function decodeKeyValuePairs(decoder) {
			return {
				ctor: '<decoder>',
				tag: 'key-value',
				decoder: decoder
			};
		}

		function mapMany(f, decoders) {
			return {
				ctor: '<decoder>',
				tag: 'map-many',
				func: f,
				decoders: decoders
			};
		}

		function andThen(callback, decoder) {
			return {
				ctor: '<decoder>',
				tag: 'andThen',
				decoder: decoder,
				callback: callback
			};
		}

		function oneOf(decoders) {
			return {
				ctor: '<decoder>',
				tag: 'oneOf',
				decoders: decoders
			};
		}

		// DECODING OBJECTS

		function map1(f, d1) {
			return mapMany(f, [d1]);
		}

		function map2(f, d1, d2) {
			return mapMany(f, [d1, d2]);
		}

		function map3(f, d1, d2, d3) {
			return mapMany(f, [d1, d2, d3]);
		}

		function map4(f, d1, d2, d3, d4) {
			return mapMany(f, [d1, d2, d3, d4]);
		}

		function map5(f, d1, d2, d3, d4, d5) {
			return mapMany(f, [d1, d2, d3, d4, d5]);
		}

		function map6(f, d1, d2, d3, d4, d5, d6) {
			return mapMany(f, [d1, d2, d3, d4, d5, d6]);
		}

		function map7(f, d1, d2, d3, d4, d5, d6, d7) {
			return mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
		}

		function map8(f, d1, d2, d3, d4, d5, d6, d7, d8) {
			return mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
		}

		// DECODE HELPERS

		function ok(value) {
			return { tag: 'ok', value: value };
		}

		function badPrimitive(type, value) {
			return { tag: 'primitive', type: type, value: value };
		}

		function badIndex(index, nestedProblems) {
			return { tag: 'index', index: index, rest: nestedProblems };
		}

		function badField(field, nestedProblems) {
			return { tag: 'field', field: field, rest: nestedProblems };
		}

		function badIndex(index, nestedProblems) {
			return { tag: 'index', index: index, rest: nestedProblems };
		}

		function badOneOf(problems) {
			return { tag: 'oneOf', problems: problems };
		}

		function bad(msg) {
			return { tag: 'fail', msg: msg };
		}

		function badToString(problem) {
			var context = '_';
			while (problem) {
				switch (problem.tag) {
					case 'primitive':
						return 'Expecting ' + problem.type + (context === '_' ? '' : ' at ' + context) + ' but instead got: ' + jsToString(problem.value);

					case 'index':
						context += '[' + problem.index + ']';
						problem = problem.rest;
						break;

					case 'field':
						context += '.' + problem.field;
						problem = problem.rest;
						break;

					case 'oneOf':
						var problems = problem.problems;
						for (var i = 0; i < problems.length; i++) {
							problems[i] = badToString(problems[i]);
						}
						return 'I ran into the following problems' + (context === '_' ? '' : ' at ' + context) + ':\n\n' + problems.join('\n');

					case 'fail':
						return 'I ran into a `fail` decoder' + (context === '_' ? '' : ' at ' + context) + ': ' + problem.msg;
				}
			}
		}

		function jsToString(value) {
			return value === undefined ? 'undefined' : JSON.stringify(value);
		}

		// DECODE

		function runOnString(decoder, string) {
			var json;
			try {
				json = JSON.parse(string);
			} catch (e) {
				return _elm_lang$core$Result$Err('Given an invalid JSON: ' + e.message);
			}
			return run(decoder, json);
		}

		function run(decoder, value) {
			var result = runHelp(decoder, value);
			return result.tag === 'ok' ? _elm_lang$core$Result$Ok(result.value) : _elm_lang$core$Result$Err(badToString(result));
		}

		function runHelp(decoder, value) {
			switch (decoder.tag) {
				case 'bool':
					return typeof value === 'boolean' ? ok(value) : badPrimitive('a Bool', value);

				case 'int':
					if (typeof value !== 'number') {
						return badPrimitive('an Int', value);
					}

					if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
						return ok(value);
					}

					if (isFinite(value) && !(value % 1)) {
						return ok(value);
					}

					return badPrimitive('an Int', value);

				case 'float':
					return typeof value === 'number' ? ok(value) : badPrimitive('a Float', value);

				case 'string':
					return typeof value === 'string' ? ok(value) : value instanceof String ? ok(value + '') : badPrimitive('a String', value);

				case 'null':
					return value === null ? ok(decoder.value) : badPrimitive('null', value);

				case 'value':
					return ok(value);

				case 'list':
					if (!(value instanceof Array)) {
						return badPrimitive('a List', value);
					}

					var list = _elm_lang$core$Native_List.Nil;
					for (var i = value.length; i--;) {
						var result = runHelp(decoder.decoder, value[i]);
						if (result.tag !== 'ok') {
							return badIndex(i, result);
						}
						list = _elm_lang$core$Native_List.Cons(result.value, list);
					}
					return ok(list);

				case 'array':
					if (!(value instanceof Array)) {
						return badPrimitive('an Array', value);
					}

					var len = value.length;
					var array = new Array(len);
					for (var i = len; i--;) {
						var result = runHelp(decoder.decoder, value[i]);
						if (result.tag !== 'ok') {
							return badIndex(i, result);
						}
						array[i] = result.value;
					}
					return ok(_elm_lang$core$Native_Array.fromJSArray(array));

				case 'maybe':
					var result = runHelp(decoder.decoder, value);
					return result.tag === 'ok' ? ok(_elm_lang$core$Maybe$Just(result.value)) : ok(_elm_lang$core$Maybe$Nothing);

				case 'field':
					var field = decoder.field;
					if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' || value === null || !(field in value)) {
						return badPrimitive('an object with a field named `' + field + '`', value);
					}

					var result = runHelp(decoder.decoder, value[field]);
					return result.tag === 'ok' ? result : badField(field, result);

				case 'index':
					var index = decoder.index;
					if (!(value instanceof Array)) {
						return badPrimitive('an array', value);
					}
					if (index >= value.length) {
						return badPrimitive('a longer array. Need index ' + index + ' but there are only ' + value.length + ' entries', value);
					}

					var result = runHelp(decoder.decoder, value[index]);
					return result.tag === 'ok' ? result : badIndex(index, result);

				case 'key-value':
					if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' || value === null || value instanceof Array) {
						return badPrimitive('an object', value);
					}

					var keyValuePairs = _elm_lang$core$Native_List.Nil;
					for (var key in value) {
						var result = runHelp(decoder.decoder, value[key]);
						if (result.tag !== 'ok') {
							return badField(key, result);
						}
						var pair = _elm_lang$core$Native_Utils.Tuple2(key, result.value);
						keyValuePairs = _elm_lang$core$Native_List.Cons(pair, keyValuePairs);
					}
					return ok(keyValuePairs);

				case 'map-many':
					var answer = decoder.func;
					var decoders = decoder.decoders;
					for (var i = 0; i < decoders.length; i++) {
						var result = runHelp(decoders[i], value);
						if (result.tag !== 'ok') {
							return result;
						}
						answer = answer(result.value);
					}
					return ok(answer);

				case 'andThen':
					var result = runHelp(decoder.decoder, value);
					return result.tag !== 'ok' ? result : runHelp(decoder.callback(result.value), value);

				case 'oneOf':
					var errors = [];
					var temp = decoder.decoders;
					while (temp.ctor !== '[]') {
						var result = runHelp(temp._0, value);

						if (result.tag === 'ok') {
							return result;
						}

						errors.push(result);

						temp = temp._1;
					}
					return badOneOf(errors);

				case 'fail':
					return bad(decoder.msg);

				case 'succeed':
					return ok(decoder.msg);
			}
		}

		// EQUALITY

		function equality(a, b) {
			if (a === b) {
				return true;
			}

			if (a.tag !== b.tag) {
				return false;
			}

			switch (a.tag) {
				case 'succeed':
				case 'fail':
					return a.msg === b.msg;

				case 'bool':
				case 'int':
				case 'float':
				case 'string':
				case 'value':
					return true;

				case 'null':
					return a.value === b.value;

				case 'list':
				case 'array':
				case 'maybe':
				case 'key-value':
					return equality(a.decoder, b.decoder);

				case 'field':
					return a.field === b.field && equality(a.decoder, b.decoder);

				case 'index':
					return a.index === b.index && equality(a.decoder, b.decoder);

				case 'map-many':
					if (a.func !== b.func) {
						return false;
					}
					return listEquality(a.decoders, b.decoders);

				case 'andThen':
					return a.callback === b.callback && equality(a.decoder, b.decoder);

				case 'oneOf':
					return listEquality(a.decoders, b.decoders);
			}
		}

		function listEquality(aDecoders, bDecoders) {
			var len = aDecoders.length;
			if (len !== bDecoders.length) {
				return false;
			}
			for (var i = 0; i < len; i++) {
				if (!equality(aDecoders[i], bDecoders[i])) {
					return false;
				}
			}
			return true;
		}

		// ENCODE

		function encode(indentLevel, value) {
			return JSON.stringify(value, null, indentLevel);
		}

		function identity(value) {
			return value;
		}

		function encodeObject(keyValuePairs) {
			var obj = {};
			while (keyValuePairs.ctor !== '[]') {
				var pair = keyValuePairs._0;
				obj[pair._0] = pair._1;
				keyValuePairs = keyValuePairs._1;
			}
			return obj;
		}

		return {
			encode: F2(encode),
			runOnString: F2(runOnString),
			run: F2(run),

			decodeNull: decodeNull,
			decodePrimitive: decodePrimitive,
			decodeContainer: F2(decodeContainer),

			decodeField: F2(decodeField),
			decodeIndex: F2(decodeIndex),

			map1: F2(map1),
			map2: F3(map2),
			map3: F4(map3),
			map4: F5(map4),
			map5: F6(map5),
			map6: F7(map6),
			map7: F8(map7),
			map8: F9(map8),
			decodeKeyValuePairs: decodeKeyValuePairs,

			andThen: F2(andThen),
			fail: fail,
			succeed: succeed,
			oneOf: oneOf,

			identity: identity,
			encodeNull: null,
			encodeArray: _elm_lang$core$Native_Array.toJSArray,
			encodeList: _elm_lang$core$Native_List.toArray,
			encodeObject: encodeObject,

			equality: equality
		};
	}();

	var _elm_lang$core$Json_Encode$list = _elm_lang$core$Native_Json.encodeList;
	var _elm_lang$core$Json_Encode$array = _elm_lang$core$Native_Json.encodeArray;
	var _elm_lang$core$Json_Encode$object = _elm_lang$core$Native_Json.encodeObject;
	var _elm_lang$core$Json_Encode$null = _elm_lang$core$Native_Json.encodeNull;
	var _elm_lang$core$Json_Encode$bool = _elm_lang$core$Native_Json.identity;
	var _elm_lang$core$Json_Encode$float = _elm_lang$core$Native_Json.identity;
	var _elm_lang$core$Json_Encode$int = _elm_lang$core$Native_Json.identity;
	var _elm_lang$core$Json_Encode$string = _elm_lang$core$Native_Json.identity;
	var _elm_lang$core$Json_Encode$encode = _elm_lang$core$Native_Json.encode;
	var _elm_lang$core$Json_Encode$Value = { ctor: 'Value' };

	var _elm_lang$core$Json_Decode$null = _elm_lang$core$Native_Json.decodeNull;
	var _elm_lang$core$Json_Decode$value = _elm_lang$core$Native_Json.decodePrimitive('value');
	var _elm_lang$core$Json_Decode$andThen = _elm_lang$core$Native_Json.andThen;
	var _elm_lang$core$Json_Decode$fail = _elm_lang$core$Native_Json.fail;
	var _elm_lang$core$Json_Decode$succeed = _elm_lang$core$Native_Json.succeed;
	var _elm_lang$core$Json_Decode$lazy = function _elm_lang$core$Json_Decode$lazy(thunk) {
		return A2(_elm_lang$core$Json_Decode$andThen, thunk, _elm_lang$core$Json_Decode$succeed({ ctor: '_Tuple0' }));
	};
	var _elm_lang$core$Json_Decode$decodeValue = _elm_lang$core$Native_Json.run;
	var _elm_lang$core$Json_Decode$decodeString = _elm_lang$core$Native_Json.runOnString;
	var _elm_lang$core$Json_Decode$map8 = _elm_lang$core$Native_Json.map8;
	var _elm_lang$core$Json_Decode$map7 = _elm_lang$core$Native_Json.map7;
	var _elm_lang$core$Json_Decode$map6 = _elm_lang$core$Native_Json.map6;
	var _elm_lang$core$Json_Decode$map5 = _elm_lang$core$Native_Json.map5;
	var _elm_lang$core$Json_Decode$map4 = _elm_lang$core$Native_Json.map4;
	var _elm_lang$core$Json_Decode$map3 = _elm_lang$core$Native_Json.map3;
	var _elm_lang$core$Json_Decode$map2 = _elm_lang$core$Native_Json.map2;
	var _elm_lang$core$Json_Decode$map = _elm_lang$core$Native_Json.map1;
	var _elm_lang$core$Json_Decode$oneOf = _elm_lang$core$Native_Json.oneOf;
	var _elm_lang$core$Json_Decode$maybe = function _elm_lang$core$Json_Decode$maybe(decoder) {
		return A2(_elm_lang$core$Native_Json.decodeContainer, 'maybe', decoder);
	};
	var _elm_lang$core$Json_Decode$index = _elm_lang$core$Native_Json.decodeIndex;
	var _elm_lang$core$Json_Decode$field = _elm_lang$core$Native_Json.decodeField;
	var _elm_lang$core$Json_Decode$at = F2(function (fields, decoder) {
		return A3(_elm_lang$core$List$foldr, _elm_lang$core$Json_Decode$field, decoder, fields);
	});
	var _elm_lang$core$Json_Decode$keyValuePairs = _elm_lang$core$Native_Json.decodeKeyValuePairs;
	var _elm_lang$core$Json_Decode$dict = function _elm_lang$core$Json_Decode$dict(decoder) {
		return A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Dict$fromList, _elm_lang$core$Json_Decode$keyValuePairs(decoder));
	};
	var _elm_lang$core$Json_Decode$array = function _elm_lang$core$Json_Decode$array(decoder) {
		return A2(_elm_lang$core$Native_Json.decodeContainer, 'array', decoder);
	};
	var _elm_lang$core$Json_Decode$list = function _elm_lang$core$Json_Decode$list(decoder) {
		return A2(_elm_lang$core$Native_Json.decodeContainer, 'list', decoder);
	};
	var _elm_lang$core$Json_Decode$nullable = function _elm_lang$core$Json_Decode$nullable(decoder) {
		return _elm_lang$core$Json_Decode$oneOf({
			ctor: '::',
			_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
			_1: {
				ctor: '::',
				_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, decoder),
				_1: { ctor: '[]' }
			}
		});
	};
	var _elm_lang$core$Json_Decode$float = _elm_lang$core$Native_Json.decodePrimitive('float');
	var _elm_lang$core$Json_Decode$int = _elm_lang$core$Native_Json.decodePrimitive('int');
	var _elm_lang$core$Json_Decode$bool = _elm_lang$core$Native_Json.decodePrimitive('bool');
	var _elm_lang$core$Json_Decode$string = _elm_lang$core$Native_Json.decodePrimitive('string');
	var _elm_lang$core$Json_Decode$Decoder = { ctor: 'Decoder' };

	var _elm_lang$dom$Native_Dom = function () {

		var fakeNode = {
			addEventListener: function addEventListener() {},
			removeEventListener: function removeEventListener() {}
		};

		var onDocument = on(typeof document !== 'undefined' ? document : fakeNode);
		var onWindow = on(typeof window !== 'undefined' ? window : fakeNode);

		function on(node) {
			return function (eventName, decoder, toTask) {
				return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {

					function performTask(event) {
						var result = A2(_elm_lang$core$Json_Decode$decodeValue, decoder, event);
						if (result.ctor === 'Ok') {
							_elm_lang$core$Native_Scheduler.rawSpawn(toTask(result._0));
						}
					}

					node.addEventListener(eventName, performTask);

					return function () {
						node.removeEventListener(eventName, performTask);
					};
				});
			};
		}

		var rAF = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : function (callback) {
			callback();
		};

		function withNode(id, doStuff) {
			return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
				rAF(function () {
					var node = document.getElementById(id);
					if (node === null) {
						callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'NotFound', _0: id }));
						return;
					}
					callback(_elm_lang$core$Native_Scheduler.succeed(doStuff(node)));
				});
			});
		}

		// FOCUS

		function focus(id) {
			return withNode(id, function (node) {
				node.focus();
				return _elm_lang$core$Native_Utils.Tuple0;
			});
		}

		function blur(id) {
			return withNode(id, function (node) {
				node.blur();
				return _elm_lang$core$Native_Utils.Tuple0;
			});
		}

		// SCROLLING

		function getScrollTop(id) {
			return withNode(id, function (node) {
				return node.scrollTop;
			});
		}

		function setScrollTop(id, desiredScrollTop) {
			return withNode(id, function (node) {
				node.scrollTop = desiredScrollTop;
				return _elm_lang$core$Native_Utils.Tuple0;
			});
		}

		function toBottom(id) {
			return withNode(id, function (node) {
				node.scrollTop = node.scrollHeight;
				return _elm_lang$core$Native_Utils.Tuple0;
			});
		}

		function getScrollLeft(id) {
			return withNode(id, function (node) {
				return node.scrollLeft;
			});
		}

		function setScrollLeft(id, desiredScrollLeft) {
			return withNode(id, function (node) {
				node.scrollLeft = desiredScrollLeft;
				return _elm_lang$core$Native_Utils.Tuple0;
			});
		}

		function toRight(id) {
			return withNode(id, function (node) {
				node.scrollLeft = node.scrollWidth;
				return _elm_lang$core$Native_Utils.Tuple0;
			});
		}

		// SIZE

		function width(options, id) {
			return withNode(id, function (node) {
				switch (options.ctor) {
					case 'Content':
						return node.scrollWidth;
					case 'VisibleContent':
						return node.clientWidth;
					case 'VisibleContentWithBorders':
						return node.offsetWidth;
					case 'VisibleContentWithBordersAndMargins':
						var rect = node.getBoundingClientRect();
						return rect.right - rect.left;
				}
			});
		}

		function height(options, id) {
			return withNode(id, function (node) {
				switch (options.ctor) {
					case 'Content':
						return node.scrollHeight;
					case 'VisibleContent':
						return node.clientHeight;
					case 'VisibleContentWithBorders':
						return node.offsetHeight;
					case 'VisibleContentWithBordersAndMargins':
						var rect = node.getBoundingClientRect();
						return rect.bottom - rect.top;
				}
			});
		}

		return {
			onDocument: F3(onDocument),
			onWindow: F3(onWindow),

			focus: focus,
			blur: blur,

			getScrollTop: getScrollTop,
			setScrollTop: F2(setScrollTop),
			getScrollLeft: getScrollLeft,
			setScrollLeft: F2(setScrollLeft),
			toBottom: toBottom,
			toRight: toRight,

			height: F2(height),
			width: F2(width)
		};
	}();

	var _elm_lang$dom$Dom$blur = _elm_lang$dom$Native_Dom.blur;
	var _elm_lang$dom$Dom$focus = _elm_lang$dom$Native_Dom.focus;
	var _elm_lang$dom$Dom$NotFound = function _elm_lang$dom$Dom$NotFound(a) {
		return { ctor: 'NotFound', _0: a };
	};

	var _elm_lang$virtual_dom$VirtualDom_Debug$wrap;
	var _elm_lang$virtual_dom$VirtualDom_Debug$wrapWithFlags;

	var _elm_lang$virtual_dom$Native_VirtualDom = function () {

		var STYLE_KEY = 'STYLE';
		var EVENT_KEY = 'EVENT';
		var ATTR_KEY = 'ATTR';
		var ATTR_NS_KEY = 'ATTR_NS';

		var localDoc = typeof document !== 'undefined' ? document : {};

		////////////  VIRTUAL DOM NODES  ////////////


		function text(string) {
			return {
				type: 'text',
				text: string
			};
		}

		function node(tag) {
			return F2(function (factList, kidList) {
				return nodeHelp(tag, factList, kidList);
			});
		}

		function nodeHelp(tag, factList, kidList) {
			var organized = organizeFacts(factList);
			var namespace = organized.namespace;
			var facts = organized.facts;

			var children = [];
			var descendantsCount = 0;
			while (kidList.ctor !== '[]') {
				var kid = kidList._0;
				descendantsCount += kid.descendantsCount || 0;
				children.push(kid);
				kidList = kidList._1;
			}
			descendantsCount += children.length;

			return {
				type: 'node',
				tag: tag,
				facts: facts,
				children: children,
				namespace: namespace,
				descendantsCount: descendantsCount
			};
		}

		function keyedNode(tag, factList, kidList) {
			var organized = organizeFacts(factList);
			var namespace = organized.namespace;
			var facts = organized.facts;

			var children = [];
			var descendantsCount = 0;
			while (kidList.ctor !== '[]') {
				var kid = kidList._0;
				descendantsCount += kid._1.descendantsCount || 0;
				children.push(kid);
				kidList = kidList._1;
			}
			descendantsCount += children.length;

			return {
				type: 'keyed-node',
				tag: tag,
				facts: facts,
				children: children,
				namespace: namespace,
				descendantsCount: descendantsCount
			};
		}

		function custom(factList, model, impl) {
			var facts = organizeFacts(factList).facts;

			return {
				type: 'custom',
				facts: facts,
				model: model,
				impl: impl
			};
		}

		function map(tagger, node) {
			return {
				type: 'tagger',
				tagger: tagger,
				node: node,
				descendantsCount: 1 + (node.descendantsCount || 0)
			};
		}

		function thunk(func, args, thunk) {
			return {
				type: 'thunk',
				func: func,
				args: args,
				thunk: thunk,
				node: undefined
			};
		}

		function lazy(fn, a) {
			return thunk(fn, [a], function () {
				return fn(a);
			});
		}

		function lazy2(fn, a, b) {
			return thunk(fn, [a, b], function () {
				return A2(fn, a, b);
			});
		}

		function lazy3(fn, a, b, c) {
			return thunk(fn, [a, b, c], function () {
				return A3(fn, a, b, c);
			});
		}

		// FACTS


		function organizeFacts(factList) {
			var namespace,
			    facts = {};

			while (factList.ctor !== '[]') {
				var entry = factList._0;
				var key = entry.key;

				if (key === ATTR_KEY || key === ATTR_NS_KEY || key === EVENT_KEY) {
					var subFacts = facts[key] || {};
					subFacts[entry.realKey] = entry.value;
					facts[key] = subFacts;
				} else if (key === STYLE_KEY) {
					var styles = facts[key] || {};
					var styleList = entry.value;
					while (styleList.ctor !== '[]') {
						var style = styleList._0;
						styles[style._0] = style._1;
						styleList = styleList._1;
					}
					facts[key] = styles;
				} else if (key === 'namespace') {
					namespace = entry.value;
				} else if (key === 'className') {
					var classes = facts[key];
					facts[key] = typeof classes === 'undefined' ? entry.value : classes + ' ' + entry.value;
				} else {
					facts[key] = entry.value;
				}
				factList = factList._1;
			}

			return {
				facts: facts,
				namespace: namespace
			};
		}

		////////////  PROPERTIES AND ATTRIBUTES  ////////////


		function style(value) {
			return {
				key: STYLE_KEY,
				value: value
			};
		}

		function property(key, value) {
			return {
				key: key,
				value: value
			};
		}

		function attribute(key, value) {
			return {
				key: ATTR_KEY,
				realKey: key,
				value: value
			};
		}

		function attributeNS(namespace, key, value) {
			return {
				key: ATTR_NS_KEY,
				realKey: key,
				value: {
					value: value,
					namespace: namespace
				}
			};
		}

		function on(name, options, decoder) {
			return {
				key: EVENT_KEY,
				realKey: name,
				value: {
					options: options,
					decoder: decoder
				}
			};
		}

		function equalEvents(a, b) {
			if (a.options !== b.options) {
				if (a.options.stopPropagation !== b.options.stopPropagation || a.options.preventDefault !== b.options.preventDefault) {
					return false;
				}
			}
			return _elm_lang$core$Native_Json.equality(a.decoder, b.decoder);
		}

		function mapProperty(func, property) {
			if (property.key !== EVENT_KEY) {
				return property;
			}
			return on(property.realKey, property.value.options, A2(_elm_lang$core$Json_Decode$map, func, property.value.decoder));
		}

		////////////  RENDER  ////////////


		function render(vNode, eventNode) {
			switch (vNode.type) {
				case 'thunk':
					if (!vNode.node) {
						vNode.node = vNode.thunk();
					}
					return render(vNode.node, eventNode);

				case 'tagger':
					var subNode = vNode.node;
					var tagger = vNode.tagger;

					while (subNode.type === 'tagger') {
						(typeof tagger === 'undefined' ? 'undefined' : _typeof(tagger)) !== 'object' ? tagger = [tagger, subNode.tagger] : tagger.push(subNode.tagger);

						subNode = subNode.node;
					}

					var subEventRoot = { tagger: tagger, parent: eventNode };
					var domNode = render(subNode, subEventRoot);
					domNode.elm_event_node_ref = subEventRoot;
					return domNode;

				case 'text':
					return localDoc.createTextNode(vNode.text);

				case 'node':
					var domNode = vNode.namespace ? localDoc.createElementNS(vNode.namespace, vNode.tag) : localDoc.createElement(vNode.tag);

					applyFacts(domNode, eventNode, vNode.facts);

					var children = vNode.children;

					for (var i = 0; i < children.length; i++) {
						domNode.appendChild(render(children[i], eventNode));
					}

					return domNode;

				case 'keyed-node':
					var domNode = vNode.namespace ? localDoc.createElementNS(vNode.namespace, vNode.tag) : localDoc.createElement(vNode.tag);

					applyFacts(domNode, eventNode, vNode.facts);

					var children = vNode.children;

					for (var i = 0; i < children.length; i++) {
						domNode.appendChild(render(children[i]._1, eventNode));
					}

					return domNode;

				case 'custom':
					var domNode = vNode.impl.render(vNode.model);
					applyFacts(domNode, eventNode, vNode.facts);
					return domNode;
			}
		}

		////////////  APPLY FACTS  ////////////


		function applyFacts(domNode, eventNode, facts) {
			for (var key in facts) {
				var value = facts[key];

				switch (key) {
					case STYLE_KEY:
						applyStyles(domNode, value);
						break;

					case EVENT_KEY:
						applyEvents(domNode, eventNode, value);
						break;

					case ATTR_KEY:
						applyAttrs(domNode, value);
						break;

					case ATTR_NS_KEY:
						applyAttrsNS(domNode, value);
						break;

					case 'value':
						if (domNode[key] !== value) {
							domNode[key] = value;
						}
						break;

					default:
						domNode[key] = value;
						break;
				}
			}
		}

		function applyStyles(domNode, styles) {
			var domNodeStyle = domNode.style;

			for (var key in styles) {
				domNodeStyle[key] = styles[key];
			}
		}

		function applyEvents(domNode, eventNode, events) {
			var allHandlers = domNode.elm_handlers || {};

			for (var key in events) {
				var handler = allHandlers[key];
				var value = events[key];

				if (typeof value === 'undefined') {
					domNode.removeEventListener(key, handler);
					allHandlers[key] = undefined;
				} else if (typeof handler === 'undefined') {
					var handler = makeEventHandler(eventNode, value);
					domNode.addEventListener(key, handler);
					allHandlers[key] = handler;
				} else {
					handler.info = value;
				}
			}

			domNode.elm_handlers = allHandlers;
		}

		function makeEventHandler(eventNode, info) {
			function eventHandler(event) {
				var info = eventHandler.info;

				var value = A2(_elm_lang$core$Native_Json.run, info.decoder, event);

				if (value.ctor === 'Ok') {
					var options = info.options;
					if (options.stopPropagation) {
						event.stopPropagation();
					}
					if (options.preventDefault) {
						event.preventDefault();
					}

					var message = value._0;

					var currentEventNode = eventNode;
					while (currentEventNode) {
						var tagger = currentEventNode.tagger;
						if (typeof tagger === 'function') {
							message = tagger(message);
						} else {
							for (var i = tagger.length; i--;) {
								message = tagger[i](message);
							}
						}
						currentEventNode = currentEventNode.parent;
					}
				}
			};

			eventHandler.info = info;

			return eventHandler;
		}

		function applyAttrs(domNode, attrs) {
			for (var key in attrs) {
				var value = attrs[key];
				if (typeof value === 'undefined') {
					domNode.removeAttribute(key);
				} else {
					domNode.setAttribute(key, value);
				}
			}
		}

		function applyAttrsNS(domNode, nsAttrs) {
			for (var key in nsAttrs) {
				var pair = nsAttrs[key];
				var namespace = pair.namespace;
				var value = pair.value;

				if (typeof value === 'undefined') {
					domNode.removeAttributeNS(namespace, key);
				} else {
					domNode.setAttributeNS(namespace, key, value);
				}
			}
		}

		////////////  DIFF  ////////////


		function diff(a, b) {
			var patches = [];
			diffHelp(a, b, patches, 0);
			return patches;
		}

		function makePatch(type, index, data) {
			return {
				index: index,
				type: type,
				data: data,
				domNode: undefined,
				eventNode: undefined
			};
		}

		function diffHelp(a, b, patches, index) {
			if (a === b) {
				return;
			}

			var aType = a.type;
			var bType = b.type;

			// Bail if you run into different types of nodes. Implies that the
			// structure has changed significantly and it's not worth a diff.
			if (aType !== bType) {
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			// Now we know that both nodes are the same type.
			switch (bType) {
				case 'thunk':
					var aArgs = a.args;
					var bArgs = b.args;
					var i = aArgs.length;
					var same = a.func === b.func && i === bArgs.length;
					while (same && i--) {
						same = aArgs[i] === bArgs[i];
					}
					if (same) {
						b.node = a.node;
						return;
					}
					b.node = b.thunk();
					var subPatches = [];
					diffHelp(a.node, b.node, subPatches, 0);
					if (subPatches.length > 0) {
						patches.push(makePatch('p-thunk', index, subPatches));
					}
					return;

				case 'tagger':
					// gather nested taggers
					var aTaggers = a.tagger;
					var bTaggers = b.tagger;
					var nesting = false;

					var aSubNode = a.node;
					while (aSubNode.type === 'tagger') {
						nesting = true;

						(typeof aTaggers === 'undefined' ? 'undefined' : _typeof(aTaggers)) !== 'object' ? aTaggers = [aTaggers, aSubNode.tagger] : aTaggers.push(aSubNode.tagger);

						aSubNode = aSubNode.node;
					}

					var bSubNode = b.node;
					while (bSubNode.type === 'tagger') {
						nesting = true;

						(typeof bTaggers === 'undefined' ? 'undefined' : _typeof(bTaggers)) !== 'object' ? bTaggers = [bTaggers, bSubNode.tagger] : bTaggers.push(bSubNode.tagger);

						bSubNode = bSubNode.node;
					}

					// Just bail if different numbers of taggers. This implies the
					// structure of the virtual DOM has changed.
					if (nesting && aTaggers.length !== bTaggers.length) {
						patches.push(makePatch('p-redraw', index, b));
						return;
					}

					// check if taggers are "the same"
					if (nesting ? !pairwiseRefEqual(aTaggers, bTaggers) : aTaggers !== bTaggers) {
						patches.push(makePatch('p-tagger', index, bTaggers));
					}

					// diff everything below the taggers
					diffHelp(aSubNode, bSubNode, patches, index + 1);
					return;

				case 'text':
					if (a.text !== b.text) {
						patches.push(makePatch('p-text', index, b.text));
						return;
					}

					return;

				case 'node':
					// Bail if obvious indicators have changed. Implies more serious
					// structural changes such that it's not worth it to diff.
					if (a.tag !== b.tag || a.namespace !== b.namespace) {
						patches.push(makePatch('p-redraw', index, b));
						return;
					}

					var factsDiff = diffFacts(a.facts, b.facts);

					if (typeof factsDiff !== 'undefined') {
						patches.push(makePatch('p-facts', index, factsDiff));
					}

					diffChildren(a, b, patches, index);
					return;

				case 'keyed-node':
					// Bail if obvious indicators have changed. Implies more serious
					// structural changes such that it's not worth it to diff.
					if (a.tag !== b.tag || a.namespace !== b.namespace) {
						patches.push(makePatch('p-redraw', index, b));
						return;
					}

					var factsDiff = diffFacts(a.facts, b.facts);

					if (typeof factsDiff !== 'undefined') {
						patches.push(makePatch('p-facts', index, factsDiff));
					}

					diffKeyedChildren(a, b, patches, index);
					return;

				case 'custom':
					if (a.impl !== b.impl) {
						patches.push(makePatch('p-redraw', index, b));
						return;
					}

					var factsDiff = diffFacts(a.facts, b.facts);
					if (typeof factsDiff !== 'undefined') {
						patches.push(makePatch('p-facts', index, factsDiff));
					}

					var patch = b.impl.diff(a, b);
					if (patch) {
						patches.push(makePatch('p-custom', index, patch));
						return;
					}

					return;
			}
		}

		// assumes the incoming arrays are the same length
		function pairwiseRefEqual(as, bs) {
			for (var i = 0; i < as.length; i++) {
				if (as[i] !== bs[i]) {
					return false;
				}
			}

			return true;
		}

		// TODO Instead of creating a new diff object, it's possible to just test if
		// there *is* a diff. During the actual patch, do the diff again and make the
		// modifications directly. This way, there's no new allocations. Worth it?
		function diffFacts(a, b, category) {
			var diff;

			// look for changes and removals
			for (var aKey in a) {
				if (aKey === STYLE_KEY || aKey === EVENT_KEY || aKey === ATTR_KEY || aKey === ATTR_NS_KEY) {
					var subDiff = diffFacts(a[aKey], b[aKey] || {}, aKey);
					if (subDiff) {
						diff = diff || {};
						diff[aKey] = subDiff;
					}
					continue;
				}

				// remove if not in the new facts
				if (!(aKey in b)) {
					diff = diff || {};
					diff[aKey] = typeof category === 'undefined' ? typeof a[aKey] === 'string' ? '' : null : category === STYLE_KEY ? '' : category === EVENT_KEY || category === ATTR_KEY ? undefined : { namespace: a[aKey].namespace, value: undefined };

					continue;
				}

				var aValue = a[aKey];
				var bValue = b[aKey];

				// reference equal, so don't worry about it
				if (aValue === bValue && aKey !== 'value' || category === EVENT_KEY && equalEvents(aValue, bValue)) {
					continue;
				}

				diff = diff || {};
				diff[aKey] = bValue;
			}

			// add new stuff
			for (var bKey in b) {
				if (!(bKey in a)) {
					diff = diff || {};
					diff[bKey] = b[bKey];
				}
			}

			return diff;
		}

		function diffChildren(aParent, bParent, patches, rootIndex) {
			var aChildren = aParent.children;
			var bChildren = bParent.children;

			var aLen = aChildren.length;
			var bLen = bChildren.length;

			// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

			if (aLen > bLen) {
				patches.push(makePatch('p-remove-last', rootIndex, aLen - bLen));
			} else if (aLen < bLen) {
				patches.push(makePatch('p-append', rootIndex, bChildren.slice(aLen)));
			}

			// PAIRWISE DIFF EVERYTHING ELSE

			var index = rootIndex;
			var minLen = aLen < bLen ? aLen : bLen;
			for (var i = 0; i < minLen; i++) {
				index++;
				var aChild = aChildren[i];
				diffHelp(aChild, bChildren[i], patches, index);
				index += aChild.descendantsCount || 0;
			}
		}

		////////////  KEYED DIFF  ////////////


		function diffKeyedChildren(aParent, bParent, patches, rootIndex) {
			var localPatches = [];

			var changes = {}; // Dict String Entry
			var inserts = []; // Array { index : Int, entry : Entry }
			// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

			var aChildren = aParent.children;
			var bChildren = bParent.children;
			var aLen = aChildren.length;
			var bLen = bChildren.length;
			var aIndex = 0;
			var bIndex = 0;

			var index = rootIndex;

			while (aIndex < aLen && bIndex < bLen) {
				var a = aChildren[aIndex];
				var b = bChildren[bIndex];

				var aKey = a._0;
				var bKey = b._0;
				var aNode = a._1;
				var bNode = b._1;

				// check if keys match

				if (aKey === bKey) {
					index++;
					diffHelp(aNode, bNode, localPatches, index);
					index += aNode.descendantsCount || 0;

					aIndex++;
					bIndex++;
					continue;
				}

				// look ahead 1 to detect insertions and removals.

				var aLookAhead = aIndex + 1 < aLen;
				var bLookAhead = bIndex + 1 < bLen;

				if (aLookAhead) {
					var aNext = aChildren[aIndex + 1];
					var aNextKey = aNext._0;
					var aNextNode = aNext._1;
					var oldMatch = bKey === aNextKey;
				}

				if (bLookAhead) {
					var bNext = bChildren[bIndex + 1];
					var bNextKey = bNext._0;
					var bNextNode = bNext._1;
					var newMatch = aKey === bNextKey;
				}

				// swap a and b
				if (aLookAhead && bLookAhead && newMatch && oldMatch) {
					index++;
					diffHelp(aNode, bNextNode, localPatches, index);
					insertNode(changes, localPatches, aKey, bNode, bIndex, inserts);
					index += aNode.descendantsCount || 0;

					index++;
					removeNode(changes, localPatches, aKey, aNextNode, index);
					index += aNextNode.descendantsCount || 0;

					aIndex += 2;
					bIndex += 2;
					continue;
				}

				// insert b
				if (bLookAhead && newMatch) {
					index++;
					insertNode(changes, localPatches, bKey, bNode, bIndex, inserts);
					diffHelp(aNode, bNextNode, localPatches, index);
					index += aNode.descendantsCount || 0;

					aIndex += 1;
					bIndex += 2;
					continue;
				}

				// remove a
				if (aLookAhead && oldMatch) {
					index++;
					removeNode(changes, localPatches, aKey, aNode, index);
					index += aNode.descendantsCount || 0;

					index++;
					diffHelp(aNextNode, bNode, localPatches, index);
					index += aNextNode.descendantsCount || 0;

					aIndex += 2;
					bIndex += 1;
					continue;
				}

				// remove a, insert b
				if (aLookAhead && bLookAhead && aNextKey === bNextKey) {
					index++;
					removeNode(changes, localPatches, aKey, aNode, index);
					insertNode(changes, localPatches, bKey, bNode, bIndex, inserts);
					index += aNode.descendantsCount || 0;

					index++;
					diffHelp(aNextNode, bNextNode, localPatches, index);
					index += aNextNode.descendantsCount || 0;

					aIndex += 2;
					bIndex += 2;
					continue;
				}

				break;
			}

			// eat up any remaining nodes with removeNode and insertNode

			while (aIndex < aLen) {
				index++;
				var a = aChildren[aIndex];
				var aNode = a._1;
				removeNode(changes, localPatches, a._0, aNode, index);
				index += aNode.descendantsCount || 0;
				aIndex++;
			}

			var endInserts;
			while (bIndex < bLen) {
				endInserts = endInserts || [];
				var b = bChildren[bIndex];
				insertNode(changes, localPatches, b._0, b._1, undefined, endInserts);
				bIndex++;
			}

			if (localPatches.length > 0 || inserts.length > 0 || typeof endInserts !== 'undefined') {
				patches.push(makePatch('p-reorder', rootIndex, {
					patches: localPatches,
					inserts: inserts,
					endInserts: endInserts
				}));
			}
		}

		////////////  CHANGES FROM KEYED DIFF  ////////////


		var POSTFIX = '_elmW6BL';

		function insertNode(changes, localPatches, key, vnode, bIndex, inserts) {
			var entry = changes[key];

			// never seen this key before
			if (typeof entry === 'undefined') {
				entry = {
					tag: 'insert',
					vnode: vnode,
					index: bIndex,
					data: undefined
				};

				inserts.push({ index: bIndex, entry: entry });
				changes[key] = entry;

				return;
			}

			// this key was removed earlier, a match!
			if (entry.tag === 'remove') {
				inserts.push({ index: bIndex, entry: entry });

				entry.tag = 'move';
				var subPatches = [];
				diffHelp(entry.vnode, vnode, subPatches, entry.index);
				entry.index = bIndex;
				entry.data.data = {
					patches: subPatches,
					entry: entry
				};

				return;
			}

			// this key has already been inserted or moved, a duplicate!
			insertNode(changes, localPatches, key + POSTFIX, vnode, bIndex, inserts);
		}

		function removeNode(changes, localPatches, key, vnode, index) {
			var entry = changes[key];

			// never seen this key before
			if (typeof entry === 'undefined') {
				var patch = makePatch('p-remove', index, undefined);
				localPatches.push(patch);

				changes[key] = {
					tag: 'remove',
					vnode: vnode,
					index: index,
					data: patch
				};

				return;
			}

			// this key was inserted earlier, a match!
			if (entry.tag === 'insert') {
				entry.tag = 'move';
				var subPatches = [];
				diffHelp(vnode, entry.vnode, subPatches, index);

				var patch = makePatch('p-remove', index, {
					patches: subPatches,
					entry: entry
				});
				localPatches.push(patch);

				return;
			}

			// this key has already been removed or moved, a duplicate!
			removeNode(changes, localPatches, key + POSTFIX, vnode, index);
		}

		////////////  ADD DOM NODES  ////////////
		//
		// Each DOM node has an "index" assigned in order of traversal. It is important
		// to minimize our crawl over the actual DOM, so these indexes (along with the
		// descendantsCount of virtual nodes) let us skip touching entire subtrees of
		// the DOM if we know there are no patches there.


		function addDomNodes(domNode, vNode, patches, eventNode) {
			addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.descendantsCount, eventNode);
		}

		// assumes `patches` is non-empty and indexes increase monotonically.
		function addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode) {
			var patch = patches[i];
			var index = patch.index;

			while (index === low) {
				var patchType = patch.type;

				if (patchType === 'p-thunk') {
					addDomNodes(domNode, vNode.node, patch.data, eventNode);
				} else if (patchType === 'p-reorder') {
					patch.domNode = domNode;
					patch.eventNode = eventNode;

					var subPatches = patch.data.patches;
					if (subPatches.length > 0) {
						addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
					}
				} else if (patchType === 'p-remove') {
					patch.domNode = domNode;
					patch.eventNode = eventNode;

					var data = patch.data;
					if (typeof data !== 'undefined') {
						data.entry.data = domNode;
						var subPatches = data.patches;
						if (subPatches.length > 0) {
							addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
						}
					}
				} else {
					patch.domNode = domNode;
					patch.eventNode = eventNode;
				}

				i++;

				if (!(patch = patches[i]) || (index = patch.index) > high) {
					return i;
				}
			}

			switch (vNode.type) {
				case 'tagger':
					var subNode = vNode.node;

					while (subNode.type === "tagger") {
						subNode = subNode.node;
					}

					return addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);

				case 'node':
					var vChildren = vNode.children;
					var childNodes = domNode.childNodes;
					for (var j = 0; j < vChildren.length; j++) {
						low++;
						var vChild = vChildren[j];
						var nextLow = low + (vChild.descendantsCount || 0);
						if (low <= index && index <= nextLow) {
							i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
							if (!(patch = patches[i]) || (index = patch.index) > high) {
								return i;
							}
						}
						low = nextLow;
					}
					return i;

				case 'keyed-node':
					var vChildren = vNode.children;
					var childNodes = domNode.childNodes;
					for (var j = 0; j < vChildren.length; j++) {
						low++;
						var vChild = vChildren[j]._1;
						var nextLow = low + (vChild.descendantsCount || 0);
						if (low <= index && index <= nextLow) {
							i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
							if (!(patch = patches[i]) || (index = patch.index) > high) {
								return i;
							}
						}
						low = nextLow;
					}
					return i;

				case 'text':
				case 'thunk':
					throw new Error('should never traverse `text` or `thunk` nodes like this');
			}
		}

		////////////  APPLY PATCHES  ////////////


		function applyPatches(rootDomNode, oldVirtualNode, patches, eventNode) {
			if (patches.length === 0) {
				return rootDomNode;
			}

			addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
			return applyPatchesHelp(rootDomNode, patches);
		}

		function applyPatchesHelp(rootDomNode, patches) {
			for (var i = 0; i < patches.length; i++) {
				var patch = patches[i];
				var localDomNode = patch.domNode;
				var newNode = applyPatch(localDomNode, patch);
				if (localDomNode === rootDomNode) {
					rootDomNode = newNode;
				}
			}
			return rootDomNode;
		}

		function applyPatch(domNode, patch) {
			switch (patch.type) {
				case 'p-redraw':
					return applyPatchRedraw(domNode, patch.data, patch.eventNode);

				case 'p-facts':
					applyFacts(domNode, patch.eventNode, patch.data);
					return domNode;

				case 'p-text':
					domNode.replaceData(0, domNode.length, patch.data);
					return domNode;

				case 'p-thunk':
					return applyPatchesHelp(domNode, patch.data);

				case 'p-tagger':
					if (typeof domNode.elm_event_node_ref !== 'undefined') {
						domNode.elm_event_node_ref.tagger = patch.data;
					} else {
						domNode.elm_event_node_ref = { tagger: patch.data, parent: patch.eventNode };
					}
					return domNode;

				case 'p-remove-last':
					var i = patch.data;
					while (i--) {
						domNode.removeChild(domNode.lastChild);
					}
					return domNode;

				case 'p-append':
					var newNodes = patch.data;
					for (var i = 0; i < newNodes.length; i++) {
						domNode.appendChild(render(newNodes[i], patch.eventNode));
					}
					return domNode;

				case 'p-remove':
					var data = patch.data;
					if (typeof data === 'undefined') {
						domNode.parentNode.removeChild(domNode);
						return domNode;
					}
					var entry = data.entry;
					if (typeof entry.index !== 'undefined') {
						domNode.parentNode.removeChild(domNode);
					}
					entry.data = applyPatchesHelp(domNode, data.patches);
					return domNode;

				case 'p-reorder':
					return applyPatchReorder(domNode, patch);

				case 'p-custom':
					var impl = patch.data;
					return impl.applyPatch(domNode, impl.data);

				default:
					throw new Error('Ran into an unknown patch!');
			}
		}

		function applyPatchRedraw(domNode, vNode, eventNode) {
			var parentNode = domNode.parentNode;
			var newNode = render(vNode, eventNode);

			if (typeof newNode.elm_event_node_ref === 'undefined') {
				newNode.elm_event_node_ref = domNode.elm_event_node_ref;
			}

			if (parentNode && newNode !== domNode) {
				parentNode.replaceChild(newNode, domNode);
			}
			return newNode;
		}

		function applyPatchReorder(domNode, patch) {
			var data = patch.data;

			// remove end inserts
			var frag = applyPatchReorderEndInsertsHelp(data.endInserts, patch);

			// removals
			domNode = applyPatchesHelp(domNode, data.patches);

			// inserts
			var inserts = data.inserts;
			for (var i = 0; i < inserts.length; i++) {
				var insert = inserts[i];
				var entry = insert.entry;
				var node = entry.tag === 'move' ? entry.data : render(entry.vnode, patch.eventNode);
				domNode.insertBefore(node, domNode.childNodes[insert.index]);
			}

			// add end inserts
			if (typeof frag !== 'undefined') {
				domNode.appendChild(frag);
			}

			return domNode;
		}

		function applyPatchReorderEndInsertsHelp(endInserts, patch) {
			if (typeof endInserts === 'undefined') {
				return;
			}

			var frag = localDoc.createDocumentFragment();
			for (var i = 0; i < endInserts.length; i++) {
				var insert = endInserts[i];
				var entry = insert.entry;
				frag.appendChild(entry.tag === 'move' ? entry.data : render(entry.vnode, patch.eventNode));
			}
			return frag;
		}

		// PROGRAMS

		var program = makeProgram(checkNoFlags);
		var programWithFlags = makeProgram(checkYesFlags);

		function makeProgram(flagChecker) {
			return F2(function (debugWrap, impl) {
				return function (flagDecoder) {
					return function (object, moduleName, debugMetadata) {
						var checker = flagChecker(flagDecoder, moduleName);
						if (typeof debugMetadata === 'undefined') {
							normalSetup(impl, object, moduleName, checker);
						} else {
							debugSetup(A2(debugWrap, debugMetadata, impl), object, moduleName, checker);
						}
					};
				};
			});
		}

		function staticProgram(vNode) {
			var nothing = _elm_lang$core$Native_Utils.Tuple2(_elm_lang$core$Native_Utils.Tuple0, _elm_lang$core$Platform_Cmd$none);
			return A2(program, _elm_lang$virtual_dom$VirtualDom_Debug$wrap, {
				init: nothing,
				view: function view() {
					return vNode;
				},
				update: F2(function () {
					return nothing;
				}),
				subscriptions: function subscriptions() {
					return _elm_lang$core$Platform_Sub$none;
				}
			})();
		}

		// FLAG CHECKERS

		function checkNoFlags(flagDecoder, moduleName) {
			return function (init, flags, domNode) {
				if (typeof flags === 'undefined') {
					return init;
				}

				var errorMessage = 'The `' + moduleName + '` module does not need flags.\n' + 'Initialize it with no arguments and you should be all set!';

				crash(errorMessage, domNode);
			};
		}

		function checkYesFlags(flagDecoder, moduleName) {
			return function (init, flags, domNode) {
				if (typeof flagDecoder === 'undefined') {
					var errorMessage = 'Are you trying to sneak a Never value into Elm? Trickster!\n' + 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n' + 'Use `program` instead if you do not want flags.';

					crash(errorMessage, domNode);
				}

				var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
				if (result.ctor === 'Ok') {
					return init(result._0);
				}

				var errorMessage = 'Trying to initialize the `' + moduleName + '` module with an unexpected flag.\n' + 'I tried to convert it to an Elm value, but ran into this problem:\n\n' + result._0;

				crash(errorMessage, domNode);
			};
		}

		function crash(errorMessage, domNode) {
			if (domNode) {
				domNode.innerHTML = '<div style="padding-left:1em;">' + '<h2 style="font-weight:normal;"><b>Oops!</b> Something went wrong when starting your Elm program.</h2>' + '<pre style="padding-left:1em;">' + errorMessage + '</pre>' + '</div>';
			}

			throw new Error(errorMessage);
		}

		//  NORMAL SETUP

		function normalSetup(impl, object, moduleName, flagChecker) {
			object['embed'] = function embed(node, flags) {
				while (node.lastChild) {
					node.removeChild(node.lastChild);
				}

				return _elm_lang$core$Native_Platform.initialize(flagChecker(impl.init, flags, node), impl.update, impl.subscriptions, normalRenderer(node, impl.view));
			};

			object['fullscreen'] = function fullscreen(flags) {
				return _elm_lang$core$Native_Platform.initialize(flagChecker(impl.init, flags, document.body), impl.update, impl.subscriptions, normalRenderer(document.body, impl.view));
			};
		}

		function normalRenderer(parentNode, view) {
			return function (tagger, initialModel) {
				var eventNode = { tagger: tagger, parent: undefined };
				var initialVirtualNode = view(initialModel);
				var domNode = render(initialVirtualNode, eventNode);
				parentNode.appendChild(domNode);
				return makeStepper(domNode, view, initialVirtualNode, eventNode);
			};
		}

		// STEPPER

		var rAF = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : function (callback) {
			setTimeout(callback, 1000 / 60);
		};

		function makeStepper(domNode, view, initialVirtualNode, eventNode) {
			var state = 'NO_REQUEST';
			var currNode = initialVirtualNode;
			var nextModel;

			function updateIfNeeded() {
				switch (state) {
					case 'NO_REQUEST':
						throw new Error('Unexpected draw callback.\n' + 'Please report this to <https://github.com/elm-lang/virtual-dom/issues>.');

					case 'PENDING_REQUEST':
						rAF(updateIfNeeded);
						state = 'EXTRA_REQUEST';

						var nextNode = view(nextModel);
						var patches = diff(currNode, nextNode);
						domNode = applyPatches(domNode, currNode, patches, eventNode);
						currNode = nextNode;

						return;

					case 'EXTRA_REQUEST':
						state = 'NO_REQUEST';
						return;
				}
			}

			return function stepper(model) {
				if (state === 'NO_REQUEST') {
					rAF(updateIfNeeded);
				}
				state = 'PENDING_REQUEST';
				nextModel = model;
			};
		}

		// DEBUG SETUP

		function debugSetup(impl, object, moduleName, flagChecker) {
			object['fullscreen'] = function fullscreen(flags) {
				var popoutRef = { doc: undefined };
				return _elm_lang$core$Native_Platform.initialize(flagChecker(impl.init, flags, document.body), impl.update(scrollTask(popoutRef)), impl.subscriptions, debugRenderer(moduleName, document.body, popoutRef, impl.view, impl.viewIn, impl.viewOut));
			};

			object['embed'] = function fullscreen(node, flags) {
				var popoutRef = { doc: undefined };
				return _elm_lang$core$Native_Platform.initialize(flagChecker(impl.init, flags, node), impl.update(scrollTask(popoutRef)), impl.subscriptions, debugRenderer(moduleName, node, popoutRef, impl.view, impl.viewIn, impl.viewOut));
			};
		}

		function scrollTask(popoutRef) {
			return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
				var doc = popoutRef.doc;
				if (doc) {
					var msgs = doc.getElementsByClassName('debugger-sidebar-messages')[0];
					if (msgs) {
						msgs.scrollTop = msgs.scrollHeight;
					}
				}
				callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
			});
		}

		function debugRenderer(moduleName, parentNode, popoutRef, view, viewIn, viewOut) {
			return function (tagger, initialModel) {
				var appEventNode = { tagger: tagger, parent: undefined };
				var eventNode = { tagger: tagger, parent: undefined };

				// make normal stepper
				var appVirtualNode = view(initialModel);
				var appNode = render(appVirtualNode, appEventNode);
				parentNode.appendChild(appNode);
				var appStepper = makeStepper(appNode, view, appVirtualNode, appEventNode);

				// make overlay stepper
				var overVirtualNode = viewIn(initialModel)._1;
				var overNode = render(overVirtualNode, eventNode);
				parentNode.appendChild(overNode);
				var wrappedViewIn = wrapViewIn(appEventNode, overNode, viewIn);
				var overStepper = makeStepper(overNode, wrappedViewIn, overVirtualNode, eventNode);

				// make debugger stepper
				var debugStepper = makeDebugStepper(initialModel, viewOut, eventNode, parentNode, moduleName, popoutRef);

				return function stepper(model) {
					appStepper(model);
					overStepper(model);
					debugStepper(model);
				};
			};
		}

		function makeDebugStepper(initialModel, view, eventNode, parentNode, moduleName, popoutRef) {
			var curr;
			var domNode;

			return function stepper(model) {
				if (!model.isDebuggerOpen) {
					return;
				}

				if (!popoutRef.doc) {
					curr = view(model);
					domNode = openDebugWindow(moduleName, popoutRef, curr, eventNode);
					return;
				}

				// switch to document of popout
				localDoc = popoutRef.doc;

				var next = view(model);
				var patches = diff(curr, next);
				domNode = applyPatches(domNode, curr, patches, eventNode);
				curr = next;

				// switch back to normal document
				localDoc = document;
			};
		}

		function openDebugWindow(moduleName, popoutRef, virtualNode, eventNode) {
			var w = 900;
			var h = 360;
			var x = screen.width - w;
			var y = screen.height - h;
			var debugWindow = window.open('', '', 'width=' + w + ',height=' + h + ',left=' + x + ',top=' + y);

			// switch to window document
			localDoc = debugWindow.document;

			popoutRef.doc = localDoc;
			localDoc.title = 'Debugger - ' + moduleName;
			localDoc.body.style.margin = '0';
			localDoc.body.style.padding = '0';
			var domNode = render(virtualNode, eventNode);
			localDoc.body.appendChild(domNode);

			localDoc.addEventListener('keydown', function (event) {
				if (event.metaKey && event.which === 82) {
					window.location.reload();
				}
				if (event.which === 38) {
					eventNode.tagger({ ctor: 'Up' });
					event.preventDefault();
				}
				if (event.which === 40) {
					eventNode.tagger({ ctor: 'Down' });
					event.preventDefault();
				}
			});

			function close() {
				popoutRef.doc = undefined;
				debugWindow.close();
			}
			window.addEventListener('unload', close);
			debugWindow.addEventListener('unload', function () {
				popoutRef.doc = undefined;
				window.removeEventListener('unload', close);
				eventNode.tagger({ ctor: 'Close' });
			});

			// switch back to the normal document
			localDoc = document;

			return domNode;
		}

		// BLOCK EVENTS

		function wrapViewIn(appEventNode, overlayNode, viewIn) {
			var ignorer = makeIgnorer(overlayNode);
			var blocking = 'Normal';
			var overflow;

			var normalTagger = appEventNode.tagger;
			var blockTagger = function blockTagger() {};

			return function (model) {
				var tuple = viewIn(model);
				var newBlocking = tuple._0.ctor;
				appEventNode.tagger = newBlocking === 'Normal' ? normalTagger : blockTagger;
				if (blocking !== newBlocking) {
					traverse('removeEventListener', ignorer, blocking);
					traverse('addEventListener', ignorer, newBlocking);

					if (blocking === 'Normal') {
						overflow = document.body.style.overflow;
						document.body.style.overflow = 'hidden';
					}

					if (newBlocking === 'Normal') {
						document.body.style.overflow = overflow;
					}

					blocking = newBlocking;
				}
				return tuple._1;
			};
		}

		function traverse(verbEventListener, ignorer, blocking) {
			switch (blocking) {
				case 'Normal':
					return;

				case 'Pause':
					return traverseHelp(verbEventListener, ignorer, mostEvents);

				case 'Message':
					return traverseHelp(verbEventListener, ignorer, allEvents);
			}
		}

		function traverseHelp(verbEventListener, handler, eventNames) {
			for (var i = 0; i < eventNames.length; i++) {
				document.body[verbEventListener](eventNames[i], handler, true);
			}
		}

		function makeIgnorer(overlayNode) {
			return function (event) {
				if (event.type === 'keydown' && event.metaKey && event.which === 82) {
					return;
				}

				var isScroll = event.type === 'scroll' || event.type === 'wheel';

				var node = event.target;
				while (node !== null) {
					if (node.className === 'elm-overlay-message-details' && isScroll) {
						return;
					}

					if (node === overlayNode && !isScroll) {
						return;
					}
					node = node.parentNode;
				}

				event.stopPropagation();
				event.preventDefault();
			};
		}

		var mostEvents = ['click', 'dblclick', 'mousemove', 'mouseup', 'mousedown', 'mouseenter', 'mouseleave', 'touchstart', 'touchend', 'touchcancel', 'touchmove', 'pointerdown', 'pointerup', 'pointerover', 'pointerout', 'pointerenter', 'pointerleave', 'pointermove', 'pointercancel', 'dragstart', 'drag', 'dragend', 'dragenter', 'dragover', 'dragleave', 'drop', 'keyup', 'keydown', 'keypress', 'input', 'change', 'focus', 'blur'];

		var allEvents = mostEvents.concat('wheel', 'scroll');

		return {
			node: node,
			text: text,
			custom: custom,
			map: F2(map),

			on: F3(on),
			style: style,
			property: F2(property),
			attribute: F2(attribute),
			attributeNS: F3(attributeNS),
			mapProperty: F2(mapProperty),

			lazy: F2(lazy),
			lazy2: F3(lazy2),
			lazy3: F4(lazy3),
			keyedNode: F3(keyedNode),

			program: program,
			programWithFlags: programWithFlags,
			staticProgram: staticProgram
		};
	}();

	var _elm_lang$virtual_dom$VirtualDom$programWithFlags = function _elm_lang$virtual_dom$VirtualDom$programWithFlags(impl) {
		return A2(_elm_lang$virtual_dom$Native_VirtualDom.programWithFlags, _elm_lang$virtual_dom$VirtualDom_Debug$wrapWithFlags, impl);
	};
	var _elm_lang$virtual_dom$VirtualDom$program = function _elm_lang$virtual_dom$VirtualDom$program(impl) {
		return A2(_elm_lang$virtual_dom$Native_VirtualDom.program, _elm_lang$virtual_dom$VirtualDom_Debug$wrap, impl);
	};
	var _elm_lang$virtual_dom$VirtualDom$keyedNode = _elm_lang$virtual_dom$Native_VirtualDom.keyedNode;
	var _elm_lang$virtual_dom$VirtualDom$lazy3 = _elm_lang$virtual_dom$Native_VirtualDom.lazy3;
	var _elm_lang$virtual_dom$VirtualDom$lazy2 = _elm_lang$virtual_dom$Native_VirtualDom.lazy2;
	var _elm_lang$virtual_dom$VirtualDom$lazy = _elm_lang$virtual_dom$Native_VirtualDom.lazy;
	var _elm_lang$virtual_dom$VirtualDom$defaultOptions = { stopPropagation: false, preventDefault: false };
	var _elm_lang$virtual_dom$VirtualDom$onWithOptions = _elm_lang$virtual_dom$Native_VirtualDom.on;
	var _elm_lang$virtual_dom$VirtualDom$on = F2(function (eventName, decoder) {
		return A3(_elm_lang$virtual_dom$VirtualDom$onWithOptions, eventName, _elm_lang$virtual_dom$VirtualDom$defaultOptions, decoder);
	});
	var _elm_lang$virtual_dom$VirtualDom$style = _elm_lang$virtual_dom$Native_VirtualDom.style;
	var _elm_lang$virtual_dom$VirtualDom$mapProperty = _elm_lang$virtual_dom$Native_VirtualDom.mapProperty;
	var _elm_lang$virtual_dom$VirtualDom$attributeNS = _elm_lang$virtual_dom$Native_VirtualDom.attributeNS;
	var _elm_lang$virtual_dom$VirtualDom$attribute = _elm_lang$virtual_dom$Native_VirtualDom.attribute;
	var _elm_lang$virtual_dom$VirtualDom$property = _elm_lang$virtual_dom$Native_VirtualDom.property;
	var _elm_lang$virtual_dom$VirtualDom$map = _elm_lang$virtual_dom$Native_VirtualDom.map;
	var _elm_lang$virtual_dom$VirtualDom$text = _elm_lang$virtual_dom$Native_VirtualDom.text;
	var _elm_lang$virtual_dom$VirtualDom$node = _elm_lang$virtual_dom$Native_VirtualDom.node;
	var _elm_lang$virtual_dom$VirtualDom$Options = F2(function (a, b) {
		return { stopPropagation: a, preventDefault: b };
	});
	var _elm_lang$virtual_dom$VirtualDom$Node = { ctor: 'Node' };
	var _elm_lang$virtual_dom$VirtualDom$Property = { ctor: 'Property' };

	var _elm_lang$html$Html$programWithFlags = _elm_lang$virtual_dom$VirtualDom$programWithFlags;
	var _elm_lang$html$Html$program = _elm_lang$virtual_dom$VirtualDom$program;
	var _elm_lang$html$Html$beginnerProgram = function _elm_lang$html$Html$beginnerProgram(_p0) {
		var _p1 = _p0;
		return _elm_lang$html$Html$program({
			init: A2(_elm_lang$core$Platform_Cmd_ops['!'], _p1.model, { ctor: '[]' }),
			update: F2(function (msg, model) {
				return A2(_elm_lang$core$Platform_Cmd_ops['!'], A2(_p1.update, msg, model), { ctor: '[]' });
			}),
			view: _p1.view,
			subscriptions: function subscriptions(_p2) {
				return _elm_lang$core$Platform_Sub$none;
			}
		});
	};
	var _elm_lang$html$Html$map = _elm_lang$virtual_dom$VirtualDom$map;
	var _elm_lang$html$Html$text = _elm_lang$virtual_dom$VirtualDom$text;
	var _elm_lang$html$Html$node = _elm_lang$virtual_dom$VirtualDom$node;
	var _elm_lang$html$Html$body = _elm_lang$html$Html$node('body');
	var _elm_lang$html$Html$section = _elm_lang$html$Html$node('section');
	var _elm_lang$html$Html$nav = _elm_lang$html$Html$node('nav');
	var _elm_lang$html$Html$article = _elm_lang$html$Html$node('article');
	var _elm_lang$html$Html$aside = _elm_lang$html$Html$node('aside');
	var _elm_lang$html$Html$h1 = _elm_lang$html$Html$node('h1');
	var _elm_lang$html$Html$h2 = _elm_lang$html$Html$node('h2');
	var _elm_lang$html$Html$h3 = _elm_lang$html$Html$node('h3');
	var _elm_lang$html$Html$h4 = _elm_lang$html$Html$node('h4');
	var _elm_lang$html$Html$h5 = _elm_lang$html$Html$node('h5');
	var _elm_lang$html$Html$h6 = _elm_lang$html$Html$node('h6');
	var _elm_lang$html$Html$header = _elm_lang$html$Html$node('header');
	var _elm_lang$html$Html$footer = _elm_lang$html$Html$node('footer');
	var _elm_lang$html$Html$address = _elm_lang$html$Html$node('address');
	var _elm_lang$html$Html$main_ = _elm_lang$html$Html$node('main');
	var _elm_lang$html$Html$p = _elm_lang$html$Html$node('p');
	var _elm_lang$html$Html$hr = _elm_lang$html$Html$node('hr');
	var _elm_lang$html$Html$pre = _elm_lang$html$Html$node('pre');
	var _elm_lang$html$Html$blockquote = _elm_lang$html$Html$node('blockquote');
	var _elm_lang$html$Html$ol = _elm_lang$html$Html$node('ol');
	var _elm_lang$html$Html$ul = _elm_lang$html$Html$node('ul');
	var _elm_lang$html$Html$li = _elm_lang$html$Html$node('li');
	var _elm_lang$html$Html$dl = _elm_lang$html$Html$node('dl');
	var _elm_lang$html$Html$dt = _elm_lang$html$Html$node('dt');
	var _elm_lang$html$Html$dd = _elm_lang$html$Html$node('dd');
	var _elm_lang$html$Html$figure = _elm_lang$html$Html$node('figure');
	var _elm_lang$html$Html$figcaption = _elm_lang$html$Html$node('figcaption');
	var _elm_lang$html$Html$div = _elm_lang$html$Html$node('div');
	var _elm_lang$html$Html$a = _elm_lang$html$Html$node('a');
	var _elm_lang$html$Html$em = _elm_lang$html$Html$node('em');
	var _elm_lang$html$Html$strong = _elm_lang$html$Html$node('strong');
	var _elm_lang$html$Html$small = _elm_lang$html$Html$node('small');
	var _elm_lang$html$Html$s = _elm_lang$html$Html$node('s');
	var _elm_lang$html$Html$cite = _elm_lang$html$Html$node('cite');
	var _elm_lang$html$Html$q = _elm_lang$html$Html$node('q');
	var _elm_lang$html$Html$dfn = _elm_lang$html$Html$node('dfn');
	var _elm_lang$html$Html$abbr = _elm_lang$html$Html$node('abbr');
	var _elm_lang$html$Html$time = _elm_lang$html$Html$node('time');
	var _elm_lang$html$Html$code = _elm_lang$html$Html$node('code');
	var _elm_lang$html$Html$var = _elm_lang$html$Html$node('var');
	var _elm_lang$html$Html$samp = _elm_lang$html$Html$node('samp');
	var _elm_lang$html$Html$kbd = _elm_lang$html$Html$node('kbd');
	var _elm_lang$html$Html$sub = _elm_lang$html$Html$node('sub');
	var _elm_lang$html$Html$sup = _elm_lang$html$Html$node('sup');
	var _elm_lang$html$Html$i = _elm_lang$html$Html$node('i');
	var _elm_lang$html$Html$b = _elm_lang$html$Html$node('b');
	var _elm_lang$html$Html$u = _elm_lang$html$Html$node('u');
	var _elm_lang$html$Html$mark = _elm_lang$html$Html$node('mark');
	var _elm_lang$html$Html$ruby = _elm_lang$html$Html$node('ruby');
	var _elm_lang$html$Html$rt = _elm_lang$html$Html$node('rt');
	var _elm_lang$html$Html$rp = _elm_lang$html$Html$node('rp');
	var _elm_lang$html$Html$bdi = _elm_lang$html$Html$node('bdi');
	var _elm_lang$html$Html$bdo = _elm_lang$html$Html$node('bdo');
	var _elm_lang$html$Html$span = _elm_lang$html$Html$node('span');
	var _elm_lang$html$Html$br = _elm_lang$html$Html$node('br');
	var _elm_lang$html$Html$wbr = _elm_lang$html$Html$node('wbr');
	var _elm_lang$html$Html$ins = _elm_lang$html$Html$node('ins');
	var _elm_lang$html$Html$del = _elm_lang$html$Html$node('del');
	var _elm_lang$html$Html$img = _elm_lang$html$Html$node('img');
	var _elm_lang$html$Html$iframe = _elm_lang$html$Html$node('iframe');
	var _elm_lang$html$Html$embed = _elm_lang$html$Html$node('embed');
	var _elm_lang$html$Html$object = _elm_lang$html$Html$node('object');
	var _elm_lang$html$Html$param = _elm_lang$html$Html$node('param');
	var _elm_lang$html$Html$video = _elm_lang$html$Html$node('video');
	var _elm_lang$html$Html$audio = _elm_lang$html$Html$node('audio');
	var _elm_lang$html$Html$source = _elm_lang$html$Html$node('source');
	var _elm_lang$html$Html$track = _elm_lang$html$Html$node('track');
	var _elm_lang$html$Html$canvas = _elm_lang$html$Html$node('canvas');
	var _elm_lang$html$Html$math = _elm_lang$html$Html$node('math');
	var _elm_lang$html$Html$table = _elm_lang$html$Html$node('table');
	var _elm_lang$html$Html$caption = _elm_lang$html$Html$node('caption');
	var _elm_lang$html$Html$colgroup = _elm_lang$html$Html$node('colgroup');
	var _elm_lang$html$Html$col = _elm_lang$html$Html$node('col');
	var _elm_lang$html$Html$tbody = _elm_lang$html$Html$node('tbody');
	var _elm_lang$html$Html$thead = _elm_lang$html$Html$node('thead');
	var _elm_lang$html$Html$tfoot = _elm_lang$html$Html$node('tfoot');
	var _elm_lang$html$Html$tr = _elm_lang$html$Html$node('tr');
	var _elm_lang$html$Html$td = _elm_lang$html$Html$node('td');
	var _elm_lang$html$Html$th = _elm_lang$html$Html$node('th');
	var _elm_lang$html$Html$form = _elm_lang$html$Html$node('form');
	var _elm_lang$html$Html$fieldset = _elm_lang$html$Html$node('fieldset');
	var _elm_lang$html$Html$legend = _elm_lang$html$Html$node('legend');
	var _elm_lang$html$Html$label = _elm_lang$html$Html$node('label');
	var _elm_lang$html$Html$input = _elm_lang$html$Html$node('input');
	var _elm_lang$html$Html$button = _elm_lang$html$Html$node('button');
	var _elm_lang$html$Html$select = _elm_lang$html$Html$node('select');
	var _elm_lang$html$Html$datalist = _elm_lang$html$Html$node('datalist');
	var _elm_lang$html$Html$optgroup = _elm_lang$html$Html$node('optgroup');
	var _elm_lang$html$Html$option = _elm_lang$html$Html$node('option');
	var _elm_lang$html$Html$textarea = _elm_lang$html$Html$node('textarea');
	var _elm_lang$html$Html$keygen = _elm_lang$html$Html$node('keygen');
	var _elm_lang$html$Html$output = _elm_lang$html$Html$node('output');
	var _elm_lang$html$Html$progress = _elm_lang$html$Html$node('progress');
	var _elm_lang$html$Html$meter = _elm_lang$html$Html$node('meter');
	var _elm_lang$html$Html$details = _elm_lang$html$Html$node('details');
	var _elm_lang$html$Html$summary = _elm_lang$html$Html$node('summary');
	var _elm_lang$html$Html$menuitem = _elm_lang$html$Html$node('menuitem');
	var _elm_lang$html$Html$menu = _elm_lang$html$Html$node('menu');

	var _elm_lang$html$Html_Attributes$map = _elm_lang$virtual_dom$VirtualDom$mapProperty;
	var _elm_lang$html$Html_Attributes$attribute = _elm_lang$virtual_dom$VirtualDom$attribute;
	var _elm_lang$html$Html_Attributes$contextmenu = function _elm_lang$html$Html_Attributes$contextmenu(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'contextmenu', value);
	};
	var _elm_lang$html$Html_Attributes$draggable = function _elm_lang$html$Html_Attributes$draggable(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'draggable', value);
	};
	var _elm_lang$html$Html_Attributes$itemprop = function _elm_lang$html$Html_Attributes$itemprop(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'itemprop', value);
	};
	var _elm_lang$html$Html_Attributes$tabindex = function _elm_lang$html$Html_Attributes$tabindex(n) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'tabIndex', _elm_lang$core$Basics$toString(n));
	};
	var _elm_lang$html$Html_Attributes$charset = function _elm_lang$html$Html_Attributes$charset(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'charset', value);
	};
	var _elm_lang$html$Html_Attributes$height = function _elm_lang$html$Html_Attributes$height(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'height', _elm_lang$core$Basics$toString(value));
	};
	var _elm_lang$html$Html_Attributes$width = function _elm_lang$html$Html_Attributes$width(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'width', _elm_lang$core$Basics$toString(value));
	};
	var _elm_lang$html$Html_Attributes$formaction = function _elm_lang$html$Html_Attributes$formaction(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'formAction', value);
	};
	var _elm_lang$html$Html_Attributes$list = function _elm_lang$html$Html_Attributes$list(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'list', value);
	};
	var _elm_lang$html$Html_Attributes$minlength = function _elm_lang$html$Html_Attributes$minlength(n) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'minLength', _elm_lang$core$Basics$toString(n));
	};
	var _elm_lang$html$Html_Attributes$maxlength = function _elm_lang$html$Html_Attributes$maxlength(n) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'maxlength', _elm_lang$core$Basics$toString(n));
	};
	var _elm_lang$html$Html_Attributes$size = function _elm_lang$html$Html_Attributes$size(n) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'size', _elm_lang$core$Basics$toString(n));
	};
	var _elm_lang$html$Html_Attributes$form = function _elm_lang$html$Html_Attributes$form(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'form', value);
	};
	var _elm_lang$html$Html_Attributes$cols = function _elm_lang$html$Html_Attributes$cols(n) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'cols', _elm_lang$core$Basics$toString(n));
	};
	var _elm_lang$html$Html_Attributes$rows = function _elm_lang$html$Html_Attributes$rows(n) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'rows', _elm_lang$core$Basics$toString(n));
	};
	var _elm_lang$html$Html_Attributes$challenge = function _elm_lang$html$Html_Attributes$challenge(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'challenge', value);
	};
	var _elm_lang$html$Html_Attributes$media = function _elm_lang$html$Html_Attributes$media(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'media', value);
	};
	var _elm_lang$html$Html_Attributes$rel = function _elm_lang$html$Html_Attributes$rel(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'rel', value);
	};
	var _elm_lang$html$Html_Attributes$datetime = function _elm_lang$html$Html_Attributes$datetime(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'datetime', value);
	};
	var _elm_lang$html$Html_Attributes$pubdate = function _elm_lang$html$Html_Attributes$pubdate(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'pubdate', value);
	};
	var _elm_lang$html$Html_Attributes$colspan = function _elm_lang$html$Html_Attributes$colspan(n) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'colspan', _elm_lang$core$Basics$toString(n));
	};
	var _elm_lang$html$Html_Attributes$rowspan = function _elm_lang$html$Html_Attributes$rowspan(n) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'rowspan', _elm_lang$core$Basics$toString(n));
	};
	var _elm_lang$html$Html_Attributes$manifest = function _elm_lang$html$Html_Attributes$manifest(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'manifest', value);
	};
	var _elm_lang$html$Html_Attributes$property = _elm_lang$virtual_dom$VirtualDom$property;
	var _elm_lang$html$Html_Attributes$stringProperty = F2(function (name, string) {
		return A2(_elm_lang$html$Html_Attributes$property, name, _elm_lang$core$Json_Encode$string(string));
	});
	var _elm_lang$html$Html_Attributes$class = function _elm_lang$html$Html_Attributes$class(name) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'className', name);
	};
	var _elm_lang$html$Html_Attributes$id = function _elm_lang$html$Html_Attributes$id(name) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'id', name);
	};
	var _elm_lang$html$Html_Attributes$title = function _elm_lang$html$Html_Attributes$title(name) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'title', name);
	};
	var _elm_lang$html$Html_Attributes$accesskey = function _elm_lang$html$Html_Attributes$accesskey($char) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'accessKey', _elm_lang$core$String$fromChar($char));
	};
	var _elm_lang$html$Html_Attributes$dir = function _elm_lang$html$Html_Attributes$dir(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dir', value);
	};
	var _elm_lang$html$Html_Attributes$dropzone = function _elm_lang$html$Html_Attributes$dropzone(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dropzone', value);
	};
	var _elm_lang$html$Html_Attributes$lang = function _elm_lang$html$Html_Attributes$lang(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'lang', value);
	};
	var _elm_lang$html$Html_Attributes$content = function _elm_lang$html$Html_Attributes$content(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'content', value);
	};
	var _elm_lang$html$Html_Attributes$httpEquiv = function _elm_lang$html$Html_Attributes$httpEquiv(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'httpEquiv', value);
	};
	var _elm_lang$html$Html_Attributes$language = function _elm_lang$html$Html_Attributes$language(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'language', value);
	};
	var _elm_lang$html$Html_Attributes$src = function _elm_lang$html$Html_Attributes$src(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'src', value);
	};
	var _elm_lang$html$Html_Attributes$alt = function _elm_lang$html$Html_Attributes$alt(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'alt', value);
	};
	var _elm_lang$html$Html_Attributes$preload = function _elm_lang$html$Html_Attributes$preload(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'preload', value);
	};
	var _elm_lang$html$Html_Attributes$poster = function _elm_lang$html$Html_Attributes$poster(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'poster', value);
	};
	var _elm_lang$html$Html_Attributes$kind = function _elm_lang$html$Html_Attributes$kind(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'kind', value);
	};
	var _elm_lang$html$Html_Attributes$srclang = function _elm_lang$html$Html_Attributes$srclang(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srclang', value);
	};
	var _elm_lang$html$Html_Attributes$sandbox = function _elm_lang$html$Html_Attributes$sandbox(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'sandbox', value);
	};
	var _elm_lang$html$Html_Attributes$srcdoc = function _elm_lang$html$Html_Attributes$srcdoc(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srcdoc', value);
	};
	var _elm_lang$html$Html_Attributes$type_ = function _elm_lang$html$Html_Attributes$type_(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'type', value);
	};
	var _elm_lang$html$Html_Attributes$value = function _elm_lang$html$Html_Attributes$value(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'value', value);
	};
	var _elm_lang$html$Html_Attributes$defaultValue = function _elm_lang$html$Html_Attributes$defaultValue(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'defaultValue', value);
	};
	var _elm_lang$html$Html_Attributes$placeholder = function _elm_lang$html$Html_Attributes$placeholder(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'placeholder', value);
	};
	var _elm_lang$html$Html_Attributes$accept = function _elm_lang$html$Html_Attributes$accept(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'accept', value);
	};
	var _elm_lang$html$Html_Attributes$acceptCharset = function _elm_lang$html$Html_Attributes$acceptCharset(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'acceptCharset', value);
	};
	var _elm_lang$html$Html_Attributes$action = function _elm_lang$html$Html_Attributes$action(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'action', value);
	};
	var _elm_lang$html$Html_Attributes$autocomplete = function _elm_lang$html$Html_Attributes$autocomplete(bool) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'autocomplete', bool ? 'on' : 'off');
	};
	var _elm_lang$html$Html_Attributes$enctype = function _elm_lang$html$Html_Attributes$enctype(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'enctype', value);
	};
	var _elm_lang$html$Html_Attributes$method = function _elm_lang$html$Html_Attributes$method(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'method', value);
	};
	var _elm_lang$html$Html_Attributes$name = function _elm_lang$html$Html_Attributes$name(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'name', value);
	};
	var _elm_lang$html$Html_Attributes$pattern = function _elm_lang$html$Html_Attributes$pattern(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'pattern', value);
	};
	var _elm_lang$html$Html_Attributes$for = function _elm_lang$html$Html_Attributes$for(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'htmlFor', value);
	};
	var _elm_lang$html$Html_Attributes$max = function _elm_lang$html$Html_Attributes$max(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'max', value);
	};
	var _elm_lang$html$Html_Attributes$min = function _elm_lang$html$Html_Attributes$min(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'min', value);
	};
	var _elm_lang$html$Html_Attributes$step = function _elm_lang$html$Html_Attributes$step(n) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'step', n);
	};
	var _elm_lang$html$Html_Attributes$wrap = function _elm_lang$html$Html_Attributes$wrap(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'wrap', value);
	};
	var _elm_lang$html$Html_Attributes$usemap = function _elm_lang$html$Html_Attributes$usemap(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'useMap', value);
	};
	var _elm_lang$html$Html_Attributes$shape = function _elm_lang$html$Html_Attributes$shape(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'shape', value);
	};
	var _elm_lang$html$Html_Attributes$coords = function _elm_lang$html$Html_Attributes$coords(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'coords', value);
	};
	var _elm_lang$html$Html_Attributes$keytype = function _elm_lang$html$Html_Attributes$keytype(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'keytype', value);
	};
	var _elm_lang$html$Html_Attributes$align = function _elm_lang$html$Html_Attributes$align(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'align', value);
	};
	var _elm_lang$html$Html_Attributes$cite = function _elm_lang$html$Html_Attributes$cite(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'cite', value);
	};
	var _elm_lang$html$Html_Attributes$href = function _elm_lang$html$Html_Attributes$href(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'href', value);
	};
	var _elm_lang$html$Html_Attributes$target = function _elm_lang$html$Html_Attributes$target(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'target', value);
	};
	var _elm_lang$html$Html_Attributes$downloadAs = function _elm_lang$html$Html_Attributes$downloadAs(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'download', value);
	};
	var _elm_lang$html$Html_Attributes$hreflang = function _elm_lang$html$Html_Attributes$hreflang(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'hreflang', value);
	};
	var _elm_lang$html$Html_Attributes$ping = function _elm_lang$html$Html_Attributes$ping(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'ping', value);
	};
	var _elm_lang$html$Html_Attributes$start = function _elm_lang$html$Html_Attributes$start(n) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'start', _elm_lang$core$Basics$toString(n));
	};
	var _elm_lang$html$Html_Attributes$headers = function _elm_lang$html$Html_Attributes$headers(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'headers', value);
	};
	var _elm_lang$html$Html_Attributes$scope = function _elm_lang$html$Html_Attributes$scope(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'scope', value);
	};
	var _elm_lang$html$Html_Attributes$boolProperty = F2(function (name, bool) {
		return A2(_elm_lang$html$Html_Attributes$property, name, _elm_lang$core$Json_Encode$bool(bool));
	});
	var _elm_lang$html$Html_Attributes$hidden = function _elm_lang$html$Html_Attributes$hidden(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'hidden', bool);
	};
	var _elm_lang$html$Html_Attributes$contenteditable = function _elm_lang$html$Html_Attributes$contenteditable(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'contentEditable', bool);
	};
	var _elm_lang$html$Html_Attributes$spellcheck = function _elm_lang$html$Html_Attributes$spellcheck(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'spellcheck', bool);
	};
	var _elm_lang$html$Html_Attributes$async = function _elm_lang$html$Html_Attributes$async(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'async', bool);
	};
	var _elm_lang$html$Html_Attributes$defer = function _elm_lang$html$Html_Attributes$defer(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'defer', bool);
	};
	var _elm_lang$html$Html_Attributes$scoped = function _elm_lang$html$Html_Attributes$scoped(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'scoped', bool);
	};
	var _elm_lang$html$Html_Attributes$autoplay = function _elm_lang$html$Html_Attributes$autoplay(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autoplay', bool);
	};
	var _elm_lang$html$Html_Attributes$controls = function _elm_lang$html$Html_Attributes$controls(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'controls', bool);
	};
	var _elm_lang$html$Html_Attributes$loop = function _elm_lang$html$Html_Attributes$loop(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'loop', bool);
	};
	var _elm_lang$html$Html_Attributes$default = function _elm_lang$html$Html_Attributes$default(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'default', bool);
	};
	var _elm_lang$html$Html_Attributes$seamless = function _elm_lang$html$Html_Attributes$seamless(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'seamless', bool);
	};
	var _elm_lang$html$Html_Attributes$checked = function _elm_lang$html$Html_Attributes$checked(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'checked', bool);
	};
	var _elm_lang$html$Html_Attributes$selected = function _elm_lang$html$Html_Attributes$selected(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'selected', bool);
	};
	var _elm_lang$html$Html_Attributes$autofocus = function _elm_lang$html$Html_Attributes$autofocus(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autofocus', bool);
	};
	var _elm_lang$html$Html_Attributes$disabled = function _elm_lang$html$Html_Attributes$disabled(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'disabled', bool);
	};
	var _elm_lang$html$Html_Attributes$multiple = function _elm_lang$html$Html_Attributes$multiple(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'multiple', bool);
	};
	var _elm_lang$html$Html_Attributes$novalidate = function _elm_lang$html$Html_Attributes$novalidate(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'noValidate', bool);
	};
	var _elm_lang$html$Html_Attributes$readonly = function _elm_lang$html$Html_Attributes$readonly(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'readOnly', bool);
	};
	var _elm_lang$html$Html_Attributes$required = function _elm_lang$html$Html_Attributes$required(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'required', bool);
	};
	var _elm_lang$html$Html_Attributes$ismap = function _elm_lang$html$Html_Attributes$ismap(value) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'isMap', value);
	};
	var _elm_lang$html$Html_Attributes$download = function _elm_lang$html$Html_Attributes$download(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'download', bool);
	};
	var _elm_lang$html$Html_Attributes$reversed = function _elm_lang$html$Html_Attributes$reversed(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'reversed', bool);
	};
	var _elm_lang$html$Html_Attributes$classList = function _elm_lang$html$Html_Attributes$classList(list) {
		return _elm_lang$html$Html_Attributes$class(A2(_elm_lang$core$String$join, ' ', A2(_elm_lang$core$List$map, _elm_lang$core$Tuple$first, A2(_elm_lang$core$List$filter, _elm_lang$core$Tuple$second, list))));
	};
	var _elm_lang$html$Html_Attributes$style = _elm_lang$virtual_dom$VirtualDom$style;

	var _elm_lang$html$Html_Events$keyCode = A2(_elm_lang$core$Json_Decode$field, 'keyCode', _elm_lang$core$Json_Decode$int);
	var _elm_lang$html$Html_Events$targetChecked = A2(_elm_lang$core$Json_Decode$at, {
		ctor: '::',
		_0: 'target',
		_1: {
			ctor: '::',
			_0: 'checked',
			_1: { ctor: '[]' }
		}
	}, _elm_lang$core$Json_Decode$bool);
	var _elm_lang$html$Html_Events$targetValue = A2(_elm_lang$core$Json_Decode$at, {
		ctor: '::',
		_0: 'target',
		_1: {
			ctor: '::',
			_0: 'value',
			_1: { ctor: '[]' }
		}
	}, _elm_lang$core$Json_Decode$string);
	var _elm_lang$html$Html_Events$defaultOptions = _elm_lang$virtual_dom$VirtualDom$defaultOptions;
	var _elm_lang$html$Html_Events$onWithOptions = _elm_lang$virtual_dom$VirtualDom$onWithOptions;
	var _elm_lang$html$Html_Events$on = _elm_lang$virtual_dom$VirtualDom$on;
	var _elm_lang$html$Html_Events$onFocus = function _elm_lang$html$Html_Events$onFocus(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'focus', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onBlur = function _elm_lang$html$Html_Events$onBlur(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'blur', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onSubmitOptions = _elm_lang$core$Native_Utils.update(_elm_lang$html$Html_Events$defaultOptions, { preventDefault: true });
	var _elm_lang$html$Html_Events$onSubmit = function _elm_lang$html$Html_Events$onSubmit(msg) {
		return A3(_elm_lang$html$Html_Events$onWithOptions, 'submit', _elm_lang$html$Html_Events$onSubmitOptions, _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onCheck = function _elm_lang$html$Html_Events$onCheck(tagger) {
		return A2(_elm_lang$html$Html_Events$on, 'change', A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetChecked));
	};
	var _elm_lang$html$Html_Events$onInput = function _elm_lang$html$Html_Events$onInput(tagger) {
		return A2(_elm_lang$html$Html_Events$on, 'input', A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetValue));
	};
	var _elm_lang$html$Html_Events$onMouseOut = function _elm_lang$html$Html_Events$onMouseOut(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'mouseout', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onMouseOver = function _elm_lang$html$Html_Events$onMouseOver(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'mouseover', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onMouseLeave = function _elm_lang$html$Html_Events$onMouseLeave(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'mouseleave', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onMouseEnter = function _elm_lang$html$Html_Events$onMouseEnter(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'mouseenter', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onMouseUp = function _elm_lang$html$Html_Events$onMouseUp(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'mouseup', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onMouseDown = function _elm_lang$html$Html_Events$onMouseDown(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'mousedown', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onDoubleClick = function _elm_lang$html$Html_Events$onDoubleClick(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'dblclick', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onClick = function _elm_lang$html$Html_Events$onClick(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'click', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$Options = F2(function (a, b) {
		return { stopPropagation: a, preventDefault: b };
	});

	var _elm_lang$http$Native_Http = function () {

		// ENCODING AND DECODING

		function encodeUri(string) {
			return encodeURIComponent(string);
		}

		function decodeUri(string) {
			try {
				return _elm_lang$core$Maybe$Just(decodeURIComponent(string));
			} catch (e) {
				return _elm_lang$core$Maybe$Nothing;
			}
		}

		// SEND REQUEST

		function toTask(request, maybeProgress) {
			return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
				var xhr = new XMLHttpRequest();

				configureProgress(xhr, maybeProgress);

				xhr.addEventListener('error', function () {
					callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'NetworkError' }));
				});
				xhr.addEventListener('timeout', function () {
					callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'Timeout' }));
				});
				xhr.addEventListener('load', function () {
					callback(handleResponse(xhr, request.expect.responseToResult));
				});

				try {
					xhr.open(request.method, request.url, true);
				} catch (e) {
					return callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'BadUrl', _0: request.url }));
				}

				configureRequest(xhr, request);
				send(xhr, request.body);

				return function () {
					xhr.abort();
				};
			});
		}

		function configureProgress(xhr, maybeProgress) {
			if (maybeProgress.ctor === 'Nothing') {
				return;
			}

			xhr.addEventListener('progress', function (event) {
				if (!event.lengthComputable) {
					return;
				}
				_elm_lang$core$Native_Scheduler.rawSpawn(maybeProgress._0({
					bytes: event.loaded,
					bytesExpected: event.total
				}));
			});
		}

		function configureRequest(xhr, request) {
			function setHeader(pair) {
				xhr.setRequestHeader(pair._0, pair._1);
			}

			A2(_elm_lang$core$List$map, setHeader, request.headers);
			xhr.responseType = request.expect.responseType;
			xhr.withCredentials = request.withCredentials;

			if (request.timeout.ctor === 'Just') {
				xhr.timeout = request.timeout._0;
			}
		}

		function send(xhr, body) {
			switch (body.ctor) {
				case 'EmptyBody':
					xhr.send();
					return;

				case 'StringBody':
					xhr.setRequestHeader('Content-Type', body._0);
					xhr.send(body._1);
					return;

				case 'FormDataBody':
					xhr.send(body._0);
					return;
			}
		}

		// RESPONSES

		function handleResponse(xhr, responseToResult) {
			var response = toResponse(xhr);

			if (xhr.status < 200 || 300 <= xhr.status) {
				response.body = xhr.responseText;
				return _elm_lang$core$Native_Scheduler.fail({
					ctor: 'BadStatus',
					_0: response
				});
			}

			var result = responseToResult(response);

			if (result.ctor === 'Ok') {
				return _elm_lang$core$Native_Scheduler.succeed(result._0);
			} else {
				response.body = xhr.responseText;
				return _elm_lang$core$Native_Scheduler.fail({
					ctor: 'BadPayload',
					_0: result._0,
					_1: response
				});
			}
		}

		function toResponse(xhr) {
			return {
				status: { code: xhr.status, message: xhr.statusText },
				headers: parseHeaders(xhr.getAllResponseHeaders()),
				url: xhr.responseURL,
				body: xhr.response
			};
		}

		function parseHeaders(rawHeaders) {
			var headers = _elm_lang$core$Dict$empty;

			if (!rawHeaders) {
				return headers;
			}

			var headerPairs = rawHeaders.split('\r\n');
			for (var i = headerPairs.length; i--;) {
				var headerPair = headerPairs[i];
				var index = headerPair.indexOf(': ');
				if (index > 0) {
					var key = headerPair.substring(0, index);
					var value = headerPair.substring(index + 2);

					headers = A3(_elm_lang$core$Dict$update, key, function (oldValue) {
						if (oldValue.ctor === 'Just') {
							return _elm_lang$core$Maybe$Just(value + ', ' + oldValue._0);
						}
						return _elm_lang$core$Maybe$Just(value);
					}, headers);
				}
			}

			return headers;
		}

		// EXPECTORS

		function expectStringResponse(responseToResult) {
			return {
				responseType: 'text',
				responseToResult: responseToResult
			};
		}

		function mapExpect(func, expect) {
			return {
				responseType: expect.responseType,
				responseToResult: function responseToResult(response) {
					var convertedResponse = expect.responseToResult(response);
					return A2(_elm_lang$core$Result$map, func, convertedResponse);
				}
			};
		}

		// BODY

		function multipart(parts) {
			var formData = new FormData();

			while (parts.ctor !== '[]') {
				var part = parts._0;
				formData.append(part._0, part._1);
				parts = parts._1;
			}

			return { ctor: 'FormDataBody', _0: formData };
		}

		return {
			toTask: F2(toTask),
			expectStringResponse: expectStringResponse,
			mapExpect: F2(mapExpect),
			multipart: multipart,
			encodeUri: encodeUri,
			decodeUri: decodeUri
		};
	}();

	var _elm_lang$http$Http_Internal$map = F2(function (func, request) {
		return _elm_lang$core$Native_Utils.update(request, {
			expect: A2(_elm_lang$http$Native_Http.mapExpect, func, request.expect)
		});
	});
	var _elm_lang$http$Http_Internal$RawRequest = F7(function (a, b, c, d, e, f, g) {
		return { method: a, headers: b, url: c, body: d, expect: e, timeout: f, withCredentials: g };
	});
	var _elm_lang$http$Http_Internal$Request = function _elm_lang$http$Http_Internal$Request(a) {
		return { ctor: 'Request', _0: a };
	};
	var _elm_lang$http$Http_Internal$Expect = { ctor: 'Expect' };
	var _elm_lang$http$Http_Internal$FormDataBody = { ctor: 'FormDataBody' };
	var _elm_lang$http$Http_Internal$StringBody = F2(function (a, b) {
		return { ctor: 'StringBody', _0: a, _1: b };
	});
	var _elm_lang$http$Http_Internal$EmptyBody = { ctor: 'EmptyBody' };
	var _elm_lang$http$Http_Internal$Header = F2(function (a, b) {
		return { ctor: 'Header', _0: a, _1: b };
	});

	var _elm_lang$http$Http$decodeUri = _elm_lang$http$Native_Http.decodeUri;
	var _elm_lang$http$Http$encodeUri = _elm_lang$http$Native_Http.encodeUri;
	var _elm_lang$http$Http$expectStringResponse = _elm_lang$http$Native_Http.expectStringResponse;
	var _elm_lang$http$Http$expectJson = function _elm_lang$http$Http$expectJson(decoder) {
		return _elm_lang$http$Http$expectStringResponse(function (response) {
			return A2(_elm_lang$core$Json_Decode$decodeString, decoder, response.body);
		});
	};
	var _elm_lang$http$Http$expectString = _elm_lang$http$Http$expectStringResponse(function (response) {
		return _elm_lang$core$Result$Ok(response.body);
	});
	var _elm_lang$http$Http$multipartBody = _elm_lang$http$Native_Http.multipart;
	var _elm_lang$http$Http$stringBody = _elm_lang$http$Http_Internal$StringBody;
	var _elm_lang$http$Http$jsonBody = function _elm_lang$http$Http$jsonBody(value) {
		return A2(_elm_lang$http$Http_Internal$StringBody, 'application/json', A2(_elm_lang$core$Json_Encode$encode, 0, value));
	};
	var _elm_lang$http$Http$emptyBody = _elm_lang$http$Http_Internal$EmptyBody;
	var _elm_lang$http$Http$header = _elm_lang$http$Http_Internal$Header;
	var _elm_lang$http$Http$request = _elm_lang$http$Http_Internal$Request;
	var _elm_lang$http$Http$post = F3(function (url, body, decoder) {
		return _elm_lang$http$Http$request({
			method: 'POST',
			headers: { ctor: '[]' },
			url: url,
			body: body,
			expect: _elm_lang$http$Http$expectJson(decoder),
			timeout: _elm_lang$core$Maybe$Nothing,
			withCredentials: false
		});
	});
	var _elm_lang$http$Http$get = F2(function (url, decoder) {
		return _elm_lang$http$Http$request({
			method: 'GET',
			headers: { ctor: '[]' },
			url: url,
			body: _elm_lang$http$Http$emptyBody,
			expect: _elm_lang$http$Http$expectJson(decoder),
			timeout: _elm_lang$core$Maybe$Nothing,
			withCredentials: false
		});
	});
	var _elm_lang$http$Http$getString = function _elm_lang$http$Http$getString(url) {
		return _elm_lang$http$Http$request({
			method: 'GET',
			headers: { ctor: '[]' },
			url: url,
			body: _elm_lang$http$Http$emptyBody,
			expect: _elm_lang$http$Http$expectString,
			timeout: _elm_lang$core$Maybe$Nothing,
			withCredentials: false
		});
	};
	var _elm_lang$http$Http$toTask = function _elm_lang$http$Http$toTask(_p0) {
		var _p1 = _p0;
		return A2(_elm_lang$http$Native_Http.toTask, _p1._0, _elm_lang$core$Maybe$Nothing);
	};
	var _elm_lang$http$Http$send = F2(function (resultToMessage, request) {
		return A2(_elm_lang$core$Task$attempt, resultToMessage, _elm_lang$http$Http$toTask(request));
	});
	var _elm_lang$http$Http$Response = F4(function (a, b, c, d) {
		return { url: a, status: b, headers: c, body: d };
	});
	var _elm_lang$http$Http$BadPayload = F2(function (a, b) {
		return { ctor: 'BadPayload', _0: a, _1: b };
	});
	var _elm_lang$http$Http$BadStatus = function _elm_lang$http$Http$BadStatus(a) {
		return { ctor: 'BadStatus', _0: a };
	};
	var _elm_lang$http$Http$NetworkError = { ctor: 'NetworkError' };
	var _elm_lang$http$Http$Timeout = { ctor: 'Timeout' };
	var _elm_lang$http$Http$BadUrl = function _elm_lang$http$Http$BadUrl(a) {
		return { ctor: 'BadUrl', _0: a };
	};
	var _elm_lang$http$Http$StringPart = F2(function (a, b) {
		return { ctor: 'StringPart', _0: a, _1: b };
	});
	var _elm_lang$http$Http$stringPart = _elm_lang$http$Http$StringPart;

	var _evancz$elm_markdown$Native_Markdown = function () {

		// VIRTUAL-DOM WIDGETS

		function toHtml(options, factList, rawMarkdown) {
			var model = {
				options: options,
				markdown: rawMarkdown
			};
			return _elm_lang$virtual_dom$Native_VirtualDom.custom(factList, model, implementation);
		}

		// WIDGET IMPLEMENTATION

		var implementation = {
			render: render,
			diff: diff
		};

		function render(model) {
			var html = marked(model.markdown, formatOptions(model.options));
			var div = document.createElement('div');
			div.innerHTML = html;
			return div;
		}

		function diff(a, b) {

			if (a.model.markdown === b.model.markdown && a.model.options === b.model.options) {
				return null;
			}

			return {
				applyPatch: applyPatch,
				data: marked(b.model.markdown, formatOptions(b.model.options))
			};
		}

		function applyPatch(domNode, data) {
			domNode.innerHTML = data;
			return domNode;
		}

		// ACTUAL MARKDOWN PARSER

		var marked = function () {
			// catch the `marked` object regardless of the outer environment.
			// (ex. a CommonJS module compatible environment.)
			// note that this depends on marked's implementation of environment detection.
			var module = {};
			var exports = module.exports = {};

			/**
    * marked - a markdown parser
    * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
    * https://github.com/chjj/marked
    * commit cd2f6f5b7091154c5526e79b5f3bfb4d15995a51
    */
			(function () {
				var block = { newline: /^\n+/, code: /^( {4}[^\n]+\n*)+/, fences: noop, hr: /^( *[-*_]){3,} *(?:\n+|$)/, heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/, nptable: noop, lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/, blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/, list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/, html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/, def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/, table: noop, paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/, text: /^[^\n]+/ };block.bullet = /(?:[*+-]|\d+\.)/;block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;block.item = replace(block.item, "gm")(/bull/g, block.bullet)();block.list = replace(block.list)(/bull/g, block.bullet)("hr", "\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))")("def", "\\n+(?=" + block.def.source + ")")();block.blockquote = replace(block.blockquote)("def", block.def)();block._tag = "(?!(?:" + "a|em|strong|small|s|cite|q|dfn|abbr|data|time|code" + "|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo" + "|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b";block.html = replace(block.html)("comment", /<!--[\s\S]*?-->/)("closed", /<(tag)[\s\S]+?<\/\1>/)("closing", /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)(/tag/g, block._tag)();block.paragraph = replace(block.paragraph)("hr", block.hr)("heading", block.heading)("lheading", block.lheading)("blockquote", block.blockquote)("tag", "<" + block._tag)("def", block.def)();block.normal = merge({}, block);block.gfm = merge({}, block.normal, { fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/, paragraph: /^/, heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/ });block.gfm.paragraph = replace(block.paragraph)("(?!", "(?!" + block.gfm.fences.source.replace("\\1", "\\2") + "|" + block.list.source.replace("\\1", "\\3") + "|")();block.tables = merge({}, block.gfm, { nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/, table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/ });function Lexer(options) {
					this.tokens = [];this.tokens.links = {};this.options = options || marked.defaults;this.rules = block.normal;if (this.options.gfm) {
						if (this.options.tables) {
							this.rules = block.tables;
						} else {
							this.rules = block.gfm;
						}
					}
				}Lexer.rules = block;Lexer.lex = function (src, options) {
					var lexer = new Lexer(options);return lexer.lex(src);
				};Lexer.prototype.lex = function (src) {
					src = src.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    ").replace(/\u00a0/g, " ").replace(/\u2424/g, "\n");return this.token(src, true);
				};Lexer.prototype.token = function (src, top, bq) {
					var src = src.replace(/^ +$/gm, ""),
					    next,
					    loose,
					    cap,
					    bull,
					    b,
					    item,
					    space,
					    i,
					    l;while (src) {
						if (cap = this.rules.newline.exec(src)) {
							src = src.substring(cap[0].length);if (cap[0].length > 1) {
								this.tokens.push({ type: "space" });
							}
						}if (cap = this.rules.code.exec(src)) {
							src = src.substring(cap[0].length);cap = cap[0].replace(/^ {4}/gm, "");this.tokens.push({ type: "code", text: !this.options.pedantic ? cap.replace(/\n+$/, "") : cap });continue;
						}if (cap = this.rules.fences.exec(src)) {
							src = src.substring(cap[0].length);this.tokens.push({ type: "code", lang: cap[2], text: cap[3] || "" });continue;
						}if (cap = this.rules.heading.exec(src)) {
							src = src.substring(cap[0].length);this.tokens.push({ type: "heading", depth: cap[1].length, text: cap[2] });continue;
						}if (top && (cap = this.rules.nptable.exec(src))) {
							src = src.substring(cap[0].length);item = { type: "table", header: cap[1].replace(/^ *| *\| *$/g, "").split(/ *\| */), align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */), cells: cap[3].replace(/\n$/, "").split("\n") };for (i = 0; i < item.align.length; i++) {
								if (/^ *-+: *$/.test(item.align[i])) {
									item.align[i] = "right";
								} else if (/^ *:-+: *$/.test(item.align[i])) {
									item.align[i] = "center";
								} else if (/^ *:-+ *$/.test(item.align[i])) {
									item.align[i] = "left";
								} else {
									item.align[i] = null;
								}
							}for (i = 0; i < item.cells.length; i++) {
								item.cells[i] = item.cells[i].split(/ *\| */);
							}this.tokens.push(item);continue;
						}if (cap = this.rules.lheading.exec(src)) {
							src = src.substring(cap[0].length);this.tokens.push({ type: "heading", depth: cap[2] === "=" ? 1 : 2, text: cap[1] });continue;
						}if (cap = this.rules.hr.exec(src)) {
							src = src.substring(cap[0].length);this.tokens.push({ type: "hr" });continue;
						}if (cap = this.rules.blockquote.exec(src)) {
							src = src.substring(cap[0].length);this.tokens.push({ type: "blockquote_start" });cap = cap[0].replace(/^ *> ?/gm, "");this.token(cap, top, true);this.tokens.push({ type: "blockquote_end" });continue;
						}if (cap = this.rules.list.exec(src)) {
							src = src.substring(cap[0].length);bull = cap[2];this.tokens.push({ type: "list_start", ordered: bull.length > 1 });cap = cap[0].match(this.rules.item);next = false;l = cap.length;i = 0;for (; i < l; i++) {
								item = cap[i];space = item.length;item = item.replace(/^ *([*+-]|\d+\.) +/, "");if (~item.indexOf("\n ")) {
									space -= item.length;item = !this.options.pedantic ? item.replace(new RegExp("^ {1," + space + "}", "gm"), "") : item.replace(/^ {1,4}/gm, "");
								}if (this.options.smartLists && i !== l - 1) {
									b = block.bullet.exec(cap[i + 1])[0];if (bull !== b && !(bull.length > 1 && b.length > 1)) {
										src = cap.slice(i + 1).join("\n") + src;i = l - 1;
									}
								}loose = next || /\n\n(?!\s*$)/.test(item);if (i !== l - 1) {
									next = item.charAt(item.length - 1) === "\n";if (!loose) loose = next;
								}this.tokens.push({ type: loose ? "loose_item_start" : "list_item_start" });this.token(item, false, bq);this.tokens.push({ type: "list_item_end" });
							}this.tokens.push({ type: "list_end" });continue;
						}if (cap = this.rules.html.exec(src)) {
							src = src.substring(cap[0].length);this.tokens.push({ type: this.options.sanitize ? "paragraph" : "html", pre: !this.options.sanitizer && (cap[1] === "pre" || cap[1] === "script" || cap[1] === "style"), text: cap[0] });continue;
						}if (!bq && top && (cap = this.rules.def.exec(src))) {
							src = src.substring(cap[0].length);this.tokens.links[cap[1].toLowerCase()] = { href: cap[2], title: cap[3] };continue;
						}if (top && (cap = this.rules.table.exec(src))) {
							src = src.substring(cap[0].length);item = { type: "table", header: cap[1].replace(/^ *| *\| *$/g, "").split(/ *\| */), align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */), cells: cap[3].replace(/(?: *\| *)?\n$/, "").split("\n") };for (i = 0; i < item.align.length; i++) {
								if (/^ *-+: *$/.test(item.align[i])) {
									item.align[i] = "right";
								} else if (/^ *:-+: *$/.test(item.align[i])) {
									item.align[i] = "center";
								} else if (/^ *:-+ *$/.test(item.align[i])) {
									item.align[i] = "left";
								} else {
									item.align[i] = null;
								}
							}for (i = 0; i < item.cells.length; i++) {
								item.cells[i] = item.cells[i].replace(/^ *\| *| *\| *$/g, "").split(/ *\| */);
							}this.tokens.push(item);continue;
						}if (top && (cap = this.rules.paragraph.exec(src))) {
							src = src.substring(cap[0].length);this.tokens.push({ type: "paragraph", text: cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1] });continue;
						}if (cap = this.rules.text.exec(src)) {
							src = src.substring(cap[0].length);this.tokens.push({ type: "text", text: cap[0] });continue;
						}if (src) {
							throw new Error("Infinite loop on byte: " + src.charCodeAt(0));
						}
					}return this.tokens;
				};var inline = { escape: /^\\([\\`*{}\[\]()#+\-.!_>])/, autolink: /^<([^ >]+(@|:\/)[^ >]+)>/, url: noop, tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/, link: /^!?\[(inside)\]\(href\)/, reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/, nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/, strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/, em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/, code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/, br: /^ {2,}\n(?!\s*$)/, del: noop, text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/ };inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;inline.link = replace(inline.link)("inside", inline._inside)("href", inline._href)();inline.reflink = replace(inline.reflink)("inside", inline._inside)();inline.normal = merge({}, inline);inline.pedantic = merge({}, inline.normal, { strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/, em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/ });inline.gfm = merge({}, inline.normal, { escape: replace(inline.escape)("])", "~|])")(), url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/, del: /^~~(?=\S)([\s\S]*?\S)~~/, text: replace(inline.text)("]|", "~]|")("|", "|https?://|")() });inline.breaks = merge({}, inline.gfm, { br: replace(inline.br)("{2,}", "*")(), text: replace(inline.gfm.text)("{2,}", "*")() });function InlineLexer(links, options) {
					this.options = options || marked.defaults;this.links = links;this.rules = inline.normal;this.renderer = this.options.renderer || new Renderer();this.renderer.options = this.options;if (!this.links) {
						throw new Error("Tokens array requires a `links` property.");
					}if (this.options.gfm) {
						if (this.options.breaks) {
							this.rules = inline.breaks;
						} else {
							this.rules = inline.gfm;
						}
					} else if (this.options.pedantic) {
						this.rules = inline.pedantic;
					}
				}InlineLexer.rules = inline;InlineLexer.output = function (src, links, options) {
					var inline = new InlineLexer(links, options);return inline.output(src);
				};InlineLexer.prototype.output = function (src) {
					var out = "",
					    link,
					    text,
					    href,
					    cap;while (src) {
						if (cap = this.rules.escape.exec(src)) {
							src = src.substring(cap[0].length);out += cap[1];continue;
						}if (cap = this.rules.autolink.exec(src)) {
							src = src.substring(cap[0].length);if (cap[2] === "@") {
								text = cap[1].charAt(6) === ":" ? this.mangle(cap[1].substring(7)) : this.mangle(cap[1]);href = this.mangle("mailto:") + text;
							} else {
								text = escape(cap[1]);href = text;
							}out += this.renderer.link(href, null, text);continue;
						}if (!this.inLink && (cap = this.rules.url.exec(src))) {
							src = src.substring(cap[0].length);text = escape(cap[1]);href = text;out += this.renderer.link(href, null, text);continue;
						}if (cap = this.rules.tag.exec(src)) {
							if (!this.inLink && /^<a /i.test(cap[0])) {
								this.inLink = true;
							} else if (this.inLink && /^<\/a>/i.test(cap[0])) {
								this.inLink = false;
							}src = src.substring(cap[0].length);out += this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape(cap[0]) : cap[0];continue;
						}if (cap = this.rules.link.exec(src)) {
							src = src.substring(cap[0].length);this.inLink = true;out += this.outputLink(cap, { href: cap[2], title: cap[3] });this.inLink = false;continue;
						}if ((cap = this.rules.reflink.exec(src)) || (cap = this.rules.nolink.exec(src))) {
							src = src.substring(cap[0].length);link = (cap[2] || cap[1]).replace(/\s+/g, " ");link = this.links[link.toLowerCase()];if (!link || !link.href) {
								out += cap[0].charAt(0);src = cap[0].substring(1) + src;continue;
							}this.inLink = true;out += this.outputLink(cap, link);this.inLink = false;continue;
						}if (cap = this.rules.strong.exec(src)) {
							src = src.substring(cap[0].length);out += this.renderer.strong(this.output(cap[2] || cap[1]));continue;
						}if (cap = this.rules.em.exec(src)) {
							src = src.substring(cap[0].length);out += this.renderer.em(this.output(cap[2] || cap[1]));continue;
						}if (cap = this.rules.code.exec(src)) {
							src = src.substring(cap[0].length);out += this.renderer.codespan(escape(cap[2], true));continue;
						}if (cap = this.rules.br.exec(src)) {
							src = src.substring(cap[0].length);out += this.renderer.br();continue;
						}if (cap = this.rules.del.exec(src)) {
							src = src.substring(cap[0].length);out += this.renderer.del(this.output(cap[1]));continue;
						}if (cap = this.rules.text.exec(src)) {
							src = src.substring(cap[0].length);out += this.renderer.text(escape(this.smartypants(cap[0])));continue;
						}if (src) {
							throw new Error("Infinite loop on byte: " + src.charCodeAt(0));
						}
					}return out;
				};InlineLexer.prototype.outputLink = function (cap, link) {
					var href = escape(link.href),
					    title = link.title ? escape(link.title) : null;return cap[0].charAt(0) !== "!" ? this.renderer.link(href, title, this.output(cap[1])) : this.renderer.image(href, title, escape(cap[1]));
				};InlineLexer.prototype.smartypants = function (text) {
					if (!this.options.smartypants) return text;return text.replace(/---/g, "—").replace(/--/g, "–").replace(/(^|[-\u2014\/(\[{"\s])'/g, "$1‘").replace(/'/g, "’").replace(/(^|[-\u2014\/(\[{\u2018\s])"/g, "$1“").replace(/"/g, "”").replace(/\.{3}/g, "…");
				};InlineLexer.prototype.mangle = function (text) {
					if (!this.options.mangle) return text;var out = "",
					    l = text.length,
					    i = 0,
					    ch;for (; i < l; i++) {
						ch = text.charCodeAt(i);if (Math.random() > .5) {
							ch = "x" + ch.toString(16);
						}out += "&#" + ch + ";";
					}return out;
				};function Renderer(options) {
					this.options = options || {};
				}Renderer.prototype.code = function (code, lang, escaped) {
					if (this.options.highlight) {
						var out = this.options.highlight(code, lang);if (out != null && out !== code) {
							escaped = true;code = out;
						}
					}if (!lang) {
						return "<pre><code>" + (escaped ? code : escape(code, true)) + "\n</code></pre>";
					}return '<pre><code class="' + this.options.langPrefix + escape(lang, true) + '">' + (escaped ? code : escape(code, true)) + "\n</code></pre>\n";
				};Renderer.prototype.blockquote = function (quote) {
					return "<blockquote>\n" + quote + "</blockquote>\n";
				};Renderer.prototype.html = function (html) {
					return html;
				};Renderer.prototype.heading = function (text, level, raw) {
					return "<h" + level + ' id="' + this.options.headerPrefix + raw.toLowerCase().replace(/[^\w]+/g, "-") + '">' + text + "</h" + level + ">\n";
				};Renderer.prototype.hr = function () {
					return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
				};Renderer.prototype.list = function (body, ordered) {
					var type = ordered ? "ol" : "ul";return "<" + type + ">\n" + body + "</" + type + ">\n";
				};Renderer.prototype.listitem = function (text) {
					return "<li>" + text + "</li>\n";
				};Renderer.prototype.paragraph = function (text) {
					return "<p>" + text + "</p>\n";
				};Renderer.prototype.table = function (header, body) {
					return "<table>\n" + "<thead>\n" + header + "</thead>\n" + "<tbody>\n" + body + "</tbody>\n" + "</table>\n";
				};Renderer.prototype.tablerow = function (content) {
					return "<tr>\n" + content + "</tr>\n";
				};Renderer.prototype.tablecell = function (content, flags) {
					var type = flags.header ? "th" : "td";var tag = flags.align ? "<" + type + ' style="text-align:' + flags.align + '">' : "<" + type + ">";return tag + content + "</" + type + ">\n";
				};Renderer.prototype.strong = function (text) {
					return "<strong>" + text + "</strong>";
				};Renderer.prototype.em = function (text) {
					return "<em>" + text + "</em>";
				};Renderer.prototype.codespan = function (text) {
					return "<code>" + text + "</code>";
				};Renderer.prototype.br = function () {
					return this.options.xhtml ? "<br/>" : "<br>";
				};Renderer.prototype.del = function (text) {
					return "<del>" + text + "</del>";
				};Renderer.prototype.link = function (href, title, text) {
					if (this.options.sanitize) {
						try {
							var prot = decodeURIComponent(unescape(href)).replace(/[^\w:]/g, "").toLowerCase();
						} catch (e) {
							return "";
						}if (prot.indexOf("javascript:") === 0 || prot.indexOf("vbscript:") === 0 || prot.indexOf("data:") === 0) {
							return "";
						}
					}var out = '<a href="' + href + '"';if (title) {
						out += ' title="' + title + '"';
					}out += ">" + text + "</a>";return out;
				};Renderer.prototype.image = function (href, title, text) {
					var out = '<img src="' + href + '" alt="' + text + '"';if (title) {
						out += ' title="' + title + '"';
					}out += this.options.xhtml ? "/>" : ">";return out;
				};Renderer.prototype.text = function (text) {
					return text;
				};function Parser(options) {
					this.tokens = [];this.token = null;this.options = options || marked.defaults;this.options.renderer = this.options.renderer || new Renderer();this.renderer = this.options.renderer;this.renderer.options = this.options;
				}Parser.parse = function (src, options, renderer) {
					var parser = new Parser(options, renderer);return parser.parse(src);
				};Parser.prototype.parse = function (src) {
					this.inline = new InlineLexer(src.links, this.options, this.renderer);this.tokens = src.reverse();var out = "";while (this.next()) {
						out += this.tok();
					}return out;
				};Parser.prototype.next = function () {
					return this.token = this.tokens.pop();
				};Parser.prototype.peek = function () {
					return this.tokens[this.tokens.length - 1] || 0;
				};Parser.prototype.parseText = function () {
					var body = this.token.text;while (this.peek().type === "text") {
						body += "\n" + this.next().text;
					}return this.inline.output(body);
				};Parser.prototype.tok = function () {
					switch (this.token.type) {case "space":
							{
								return "";
							}case "hr":
							{
								return this.renderer.hr();
							}case "heading":
							{
								return this.renderer.heading(this.inline.output(this.token.text), this.token.depth, this.token.text);
							}case "code":
							{
								return this.renderer.code(this.token.text, this.token.lang, this.token.escaped);
							}case "table":
							{
								var header = "",
								    body = "",
								    i,
								    row,
								    cell,
								    flags,
								    j;cell = "";for (i = 0; i < this.token.header.length; i++) {
									flags = { header: true, align: this.token.align[i] };cell += this.renderer.tablecell(this.inline.output(this.token.header[i]), { header: true, align: this.token.align[i] });
								}header += this.renderer.tablerow(cell);for (i = 0; i < this.token.cells.length; i++) {
									row = this.token.cells[i];cell = "";for (j = 0; j < row.length; j++) {
										cell += this.renderer.tablecell(this.inline.output(row[j]), { header: false, align: this.token.align[j] });
									}body += this.renderer.tablerow(cell);
								}return this.renderer.table(header, body);
							}case "blockquote_start":
							{
								var body = "";while (this.next().type !== "blockquote_end") {
									body += this.tok();
								}return this.renderer.blockquote(body);
							}case "list_start":
							{
								var body = "",
								    ordered = this.token.ordered;while (this.next().type !== "list_end") {
									body += this.tok();
								}return this.renderer.list(body, ordered);
							}case "list_item_start":
							{
								var body = "";while (this.next().type !== "list_item_end") {
									body += this.token.type === "text" ? this.parseText() : this.tok();
								}return this.renderer.listitem(body);
							}case "loose_item_start":
							{
								var body = "";while (this.next().type !== "list_item_end") {
									body += this.tok();
								}return this.renderer.listitem(body);
							}case "html":
							{
								var html = !this.token.pre && !this.options.pedantic ? this.inline.output(this.token.text) : this.token.text;return this.renderer.html(html);
							}case "paragraph":
							{
								return this.renderer.paragraph(this.inline.output(this.token.text));
							}case "text":
							{
								return this.renderer.paragraph(this.parseText());
							}}
				};function escape(html, encode) {
					return html.replace(!encode ? /&(?!#?\w+;)/g : /&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
				}function unescape(html) {
					return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g, function (_, n) {
						n = n.toLowerCase();if (n === "colon") return ":";if (n.charAt(0) === "#") {
							return n.charAt(1) === "x" ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
						}return "";
					});
				}function replace(regex, opt) {
					regex = regex.source;opt = opt || "";return function self(name, val) {
						if (!name) return new RegExp(regex, opt);val = val.source || val;val = val.replace(/(^|[^\[])\^/g, "$1");regex = regex.replace(name, val);return self;
					};
				}function noop() {}noop.exec = noop;function merge(obj) {
					var i = 1,
					    target,
					    key;for (; i < arguments.length; i++) {
						target = arguments[i];for (key in target) {
							if (Object.prototype.hasOwnProperty.call(target, key)) {
								obj[key] = target[key];
							}
						}
					}return obj;
				}function marked(src, opt, callback) {
					if (callback || typeof opt === "function") {
						if (!callback) {
							callback = opt;opt = null;
						}opt = merge({}, marked.defaults, opt || {});var highlight = opt.highlight,
						    tokens,
						    pending,
						    i = 0;try {
							tokens = Lexer.lex(src, opt);
						} catch (e) {
							return callback(e);
						}pending = tokens.length;var done = function done(err) {
							if (err) {
								opt.highlight = highlight;return callback(err);
							}var out;try {
								out = Parser.parse(tokens, opt);
							} catch (e) {
								err = e;
							}opt.highlight = highlight;return err ? callback(err) : callback(null, out);
						};if (!highlight || highlight.length < 3) {
							return done();
						}delete opt.highlight;if (!pending) return done();for (; i < tokens.length; i++) {
							(function (token) {
								if (token.type !== "code") {
									return --pending || done();
								}return highlight(token.text, token.lang, function (err, code) {
									if (err) return done(err);if (code == null || code === token.text) {
										return --pending || done();
									}token.text = code;token.escaped = true;--pending || done();
								});
							})(tokens[i]);
						}return;
					}try {
						if (opt) opt = merge({}, marked.defaults, opt);return Parser.parse(Lexer.lex(src, opt), opt);
					} catch (e) {
						e.message += "\nPlease report this to https://github.com/chjj/marked.";if ((opt || marked.defaults).silent) {
							return "<p>An error occured:</p><pre>" + escape(e.message + "", true) + "</pre>";
						}throw e;
					}
				}marked.options = marked.setOptions = function (opt) {
					merge(marked.defaults, opt);return marked;
				};marked.defaults = { gfm: true, tables: true, breaks: false, pedantic: false, sanitize: false, sanitizer: null, mangle: true, smartLists: false, silent: false, highlight: null, langPrefix: "lang-", smartypants: false, headerPrefix: "", renderer: new Renderer(), xhtml: false };marked.Parser = Parser;marked.parser = Parser.parse;marked.Renderer = Renderer;marked.Lexer = Lexer;marked.lexer = Lexer.lex;marked.InlineLexer = InlineLexer;marked.inlineLexer = InlineLexer.output;marked.parse = marked;if (typeof module !== "undefined" && (typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === "object") {
					module.exports = marked;
				} else if (typeof define === "function" && define.amd) {
					define(function () {
						return marked;
					});
				} else {
					this.marked = marked;
				}
			}).call(function () {
				return this || (typeof window !== "undefined" ? window : global);
			}());

			return module.exports;
		}();

		// FORMAT OPTIONS FOR MARKED IMPLEMENTATION

		function formatOptions(options) {
			function toHighlight(code, lang) {
				if (!lang && options.defaultHighlighting.ctor === 'Just') {
					lang = options.defaultHighlighting._0;
				}

				if (typeof hljs !== 'undefined' && lang && hljs.listLanguages().indexOf(lang) >= 0) {
					return hljs.highlight(lang, code, true).value;
				}

				return code;
			}

			var gfm = options.githubFlavored;
			if (gfm.ctor === 'Just') {
				return {
					highlight: toHighlight,
					gfm: true,
					tables: gfm._0.tables,
					breaks: gfm._0.breaks,
					sanitize: options.sanitize,
					smartypants: options.smartypants
				};
			}

			return {
				highlight: toHighlight,
				gfm: false,
				tables: false,
				breaks: false,
				sanitize: options.sanitize,
				smartypants: options.smartypants
			};
		}

		// EXPORTS

		return {
			toHtml: F3(toHtml)
		};
	}();

	var _evancz$elm_markdown$Markdown$toHtmlWith = _evancz$elm_markdown$Native_Markdown.toHtml;
	var _evancz$elm_markdown$Markdown$defaultOptions = {
		githubFlavored: _elm_lang$core$Maybe$Just({ tables: false, breaks: false }),
		defaultHighlighting: _elm_lang$core$Maybe$Nothing,
		sanitize: false,
		smartypants: false
	};
	var _evancz$elm_markdown$Markdown$toHtml = F2(function (attrs, string) {
		return A3(_evancz$elm_markdown$Native_Markdown.toHtml, _evancz$elm_markdown$Markdown$defaultOptions, attrs, string);
	});
	var _evancz$elm_markdown$Markdown$Options = F4(function (a, b, c, d) {
		return { githubFlavored: a, defaultHighlighting: b, sanitize: c, smartypants: d };
	});

	var _larribas$elm_image_slider$ImageSlider$onKeyDown = function _larribas$elm_image_slider$ImageSlider$onKeyDown(keysAndMsgs) {
		var handle = function handle(keyCode) {
			var _p0 = A2(_elm_lang$core$Dict$get, keyCode, keysAndMsgs);
			if (_p0.ctor === 'Just') {
				return _elm_lang$core$Json_Decode$succeed(_p0._0);
			} else {
				return _elm_lang$core$Json_Decode$fail(A2(_elm_lang$core$Basics_ops['++'], 'Unexpected keyCode ', _elm_lang$core$Basics$toString(keyCode)));
			}
		};
		return A2(_elm_lang$html$Html_Events$on, 'keydown', A2(_elm_lang$core$Json_Decode$andThen, handle, _elm_lang$html$Html_Events$keyCode));
	};
	var _larribas$elm_image_slider$ImageSlider$Config = F4(function (a, b, c, d) {
		return { originalUrl: a, thumbnailUrl: b, alt: c, caption: d };
	});
	var _larribas$elm_image_slider$ImageSlider$ShowSlide = function _larribas$elm_image_slider$ImageSlider$ShowSlide(a) {
		return { ctor: 'ShowSlide', _0: a };
	};
	var _larribas$elm_image_slider$ImageSlider$viewThumbnail = F5(function (conf, offset, focusedSlide, i, image) {
		return A2(_elm_lang$html$Html$img, {
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$src(conf.thumbnailUrl(image)),
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$alt(conf.alt(image)),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$classList({
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'image-slider-current-image',
							_1: _elm_lang$core$Native_Utils.eq(i, focusedSlide - offset)
						},
						_1: { ctor: '[]' }
					}),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Events$onClick(_larribas$elm_image_slider$ImageSlider$ShowSlide(i + offset)),
						_1: { ctor: '[]' }
					}
				}
			}
		}, { ctor: '[]' });
	});
	var _larribas$elm_image_slider$ImageSlider$viewThumbnails = F3(function (conf, slides, focusedSlide) {
		var totalSlides = _elm_lang$core$Array$length(slides);
		var _p1 = function () {
			var _p2 = { ctor: '_Tuple2', _0: focusedSlide - 2, _1: focusedSlide + 2 };
			var lowerIndex = _p2._0;
			var upperIndex = _p2._1;
			return _elm_lang$core$Native_Utils.cmp(totalSlides, 5) < 1 ? { ctor: '_Tuple2', _0: slides, _1: 0 } : _elm_lang$core$Native_Utils.cmp(lowerIndex, 0) < 0 ? {
				ctor: '_Tuple2',
				_0: A3(_elm_lang$core$Array$slice, 0, 4, slides),
				_1: 0
			} : _elm_lang$core$Native_Utils.cmp(upperIndex, totalSlides) > -1 ? {
				ctor: '_Tuple2',
				_0: A3(_elm_lang$core$Array$slice, -4, totalSlides, slides),
				_1: totalSlides - 4
			} : {
				ctor: '_Tuple2',
				_0: A3(_elm_lang$core$Array$slice, lowerIndex, upperIndex, slides),
				_1: lowerIndex
			};
		}();
		var slidesToShow = _p1._0;
		var offset = _p1._1;
		return A2(_elm_lang$html$Html$div, {
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('image-slider-all-images-container'),
			_1: { ctor: '[]' }
		}, _elm_lang$core$Array$toList(A2(_elm_lang$core$Array$indexedMap, A3(_larribas$elm_image_slider$ImageSlider$viewThumbnail, conf, offset, focusedSlide), slidesToShow)));
	});
	var _larribas$elm_image_slider$ImageSlider$view = F3(function (conf, slides, _p3) {
		var _p4 = _p3;
		var _p7 = _p4._0;
		var previous = _elm_lang$core$Native_Utils.cmp(_p7, 0) > 0 ? _p7 - 1 : 0;
		var length = _elm_lang$core$Array$length(slides);
		var isLastSlide = _elm_lang$core$Native_Utils.cmp(_p7, length - 1) > -1;
		var focused = _elm_lang$core$Native_Utils.cmp(_p7, 0) > -1 && _elm_lang$core$Native_Utils.cmp(_p7, length) < 0 ? _p7 : 0;
		var next = _elm_lang$core$Native_Utils.cmp(_p7, 0) > -1 && _elm_lang$core$Native_Utils.cmp(_p7, length - 1) < 0 ? _p7 + 1 : length - 1;
		var isFirstSlide = _elm_lang$core$Native_Utils.eq(_p7, 0);
		return A2(_elm_lang$html$Html$div, {
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$id('image-slider-container'),
			_1: {
				ctor: '::',
				_0: _larribas$elm_image_slider$ImageSlider$onKeyDown(_elm_lang$core$Dict$fromList({
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 37,
						_1: _larribas$elm_image_slider$ImageSlider$ShowSlide(previous)
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 39,
							_1: _larribas$elm_image_slider$ImageSlider$ShowSlide(next)
						},
						_1: { ctor: '[]' }
					}
				})),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$tabindex(1),
					_1: { ctor: '[]' }
				}
			}
		}, {
			ctor: '::',
			_0: A2(_elm_lang$html$Html$div, {
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('image-slider-navigation-container'),
				_1: { ctor: '[]' }
			}, {
				ctor: '::',
				_0: A2(_elm_lang$html$Html$i, {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('image-slider-button image-slider-previous-button fa fa-chevron-left'),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Events$onClick(_larribas$elm_image_slider$ImageSlider$ShowSlide(previous)),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$classList({
								ctor: '::',
								_0: { ctor: '_Tuple2', _0: 'image-slider-hidden', _1: isFirstSlide },
								_1: { ctor: '[]' }
							}),
							_1: { ctor: '[]' }
						}
					}
				}, { ctor: '[]' }),
				_1: {
					ctor: '::',
					_0: A2(_elm_lang$html$Html$div, {
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('image-slider-image-container'),
						_1: { ctor: '[]' }
					}, function () {
						var _p5 = A2(_elm_lang$core$Array$get, focused, slides);
						if (_p5.ctor === 'Just') {
							var _p6 = _p5._0;
							return {
								ctor: '::',
								_0: A2(_elm_lang$html$Html$img, {
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('image-slider-image-main'),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$src(conf.originalUrl(_p6)),
										_1: {
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$alt(conf.alt(_p6)),
											_1: { ctor: '[]' }
										}
									}
								}, { ctor: '[]' }),
								_1: {
									ctor: '::',
									_0: conf.caption(_p6),
									_1: { ctor: '[]' }
								}
							};
						} else {
							return {
								ctor: '::',
								_0: A2(_elm_lang$html$Html$span, {
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('image-slider-no-images'),
									_1: { ctor: '[]' }
								}, { ctor: '[]' }),
								_1: { ctor: '[]' }
							};
						}
					}()),
					_1: {
						ctor: '::',
						_0: A2(_elm_lang$html$Html$i, {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('image-slider-button image-slider-next-button fa fa-chevron-right'),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Events$onClick(_larribas$elm_image_slider$ImageSlider$ShowSlide(next)),
								_1: {
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$classList({
										ctor: '::',
										_0: { ctor: '_Tuple2', _0: 'image-slider-hidden', _1: isLastSlide },
										_1: { ctor: '[]' }
									}),
									_1: { ctor: '[]' }
								}
							}
						}, { ctor: '[]' }),
						_1: { ctor: '[]' }
					}
				}
			}),
			_1: {
				ctor: '::',
				_0: A3(_larribas$elm_image_slider$ImageSlider$viewThumbnails, conf, slides, _p7),
				_1: { ctor: '[]' }
			}
		});
	});
	var _larribas$elm_image_slider$ImageSlider$State = function _larribas$elm_image_slider$ImageSlider$State(a) {
		return { ctor: 'State', _0: a };
	};
	var _larribas$elm_image_slider$ImageSlider$init = function _larribas$elm_image_slider$ImageSlider$init(i) {
		return {
			ctor: '_Tuple2',
			_0: _larribas$elm_image_slider$ImageSlider$State(i),
			_1: A2(_elm_lang$core$Task$attempt, function (_p8) {
				return _larribas$elm_image_slider$ImageSlider$ShowSlide(i);
			}, _elm_lang$dom$Dom$focus('image-slider-container'))
		};
	};
	var _larribas$elm_image_slider$ImageSlider$update = F2(function (msg, _p9) {
		var _p10 = msg;
		return _larribas$elm_image_slider$ImageSlider$State(_p10._0);
	});

	var _user$project$Types$Url = F2(function (a, b) {
		return { de: a, en: b };
	});
	var _user$project$Types$MaybeUrl = F2(function (a, b) {
		return { name: a, url: b };
	});
	var _user$project$Types$Event = F3(function (a, b, c) {
		return { date: a, event: b, location: c };
	});
	var _user$project$Types$Content = F4(function (a, b, c, d) {
		return { news: a, events: b, about: c, contact: d };
	});
	var _user$project$Types$Model = F2(function (a, b) {
		return { content: a, language: b };
	});
	var _user$project$Types$MarkdownOptions = F4(function (a, b, c, d) {
		return { githubFlavored: a, defaultHighlighting: b, sanitize: c, smartypants: d };
	});
	var _user$project$Types$NewContent = function _user$project$Types$NewContent(a) {
		return { ctor: 'NewContent', _0: a };
	};
	var _user$project$Types$ToggleLanguage = { ctor: 'ToggleLanguage' };

	var _user$project$Main$rowH2 = function _user$project$Main$rowH2(title) {
		return A2(_elm_lang$html$Html$tr, {
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('colspan3'),
			_1: { ctor: '[]' }
		}, {
			ctor: '::',
			_0: A2(_elm_lang$html$Html$td, {
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('colspan3'),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$colspan(3),
					_1: { ctor: '[]' }
				}
			}, {
				ctor: '::',
				_0: A2(_elm_lang$html$Html$h2, { ctor: '[]' }, {
					ctor: '::',
					_0: _elm_lang$html$Html$text(title),
					_1: { ctor: '[]' }
				}),
				_1: { ctor: '[]' }
			}),
			_1: { ctor: '[]' }
		});
	};
	var _user$project$Main$months = {
		ctor: '::',
		_0: 'Jan',
		_1: {
			ctor: '::',
			_0: 'Feb',
			_1: {
				ctor: '::',
				_0: 'März',
				_1: {
					ctor: '::',
					_0: 'Apr',
					_1: {
						ctor: '::',
						_0: 'Mai',
						_1: {
							ctor: '::',
							_0: 'Juni',
							_1: {
								ctor: '::',
								_0: 'July',
								_1: {
									ctor: '::',
									_0: 'Aug',
									_1: {
										ctor: '::',
										_0: 'Sept',
										_1: {
											ctor: '::',
											_0: 'Okt',
											_1: {
												ctor: '::',
												_0: 'Nov',
												_1: {
													ctor: '::',
													_0: 'Dez',
													_1: { ctor: '[]' }
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};
	var _user$project$Main$monthName = function _user$project$Main$monthName(index) {
		return A2(_elm_lang$core$Maybe$withDefault, '', A2(_elm_lang$core$Array$get, index - 1, _elm_lang$core$Array$fromList(_user$project$Main$months)));
	};
	var _user$project$Main$parseDate = function _user$project$Main$parseDate(d) {
		var _p0 = _Bogdanp$elm_time$Time_Date$fromISO8601(d);
		if (_p0.ctor === 'Ok') {
			return _p0._0;
		} else {
			return A3(_Bogdanp$elm_time$Time_Date$date, 0, 0, 0);
		}
	};
	var _user$project$Main$compareDate = function _user$project$Main$compareDate(d) {
		var _p1 = A2(_Bogdanp$elm_time$Time_Date$compare, A3(_Bogdanp$elm_time$Time_Date$date, 1993, 2, 28), _user$project$Main$parseDate(d.date));
		switch (_p1.ctor) {
			case 'GT':
				return false;
			case 'EQ':
				return true;
			default:
				return true;
		}
	};
	var _user$project$Main$maybeLink = function _user$project$Main$maybeLink(_p2) {
		var _p3 = _p2;
		var _p5 = _p3.name;
		var _p4 = _p3.url;
		if (_p4.ctor === 'Just') {
			return A2(_elm_lang$html$Html$a, {
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$href(_p4._0),
				_1: { ctor: '[]' }
			}, {
				ctor: '::',
				_0: _elm_lang$html$Html$text(_p5),
				_1: { ctor: '[]' }
			});
		} else {
			return _elm_lang$html$Html$text(_p5);
		}
	};
	var _user$project$Main$row = function _user$project$Main$row(a) {
		var dat = _user$project$Main$parseDate(a.date);
		return A2(_elm_lang$html$Html$tr, { ctor: '[]' }, {
			ctor: '::',
			_0: A2(_elm_lang$html$Html$td, { ctor: '[]' }, {
				ctor: '::',
				_0: _elm_lang$html$Html$text(A2(_elm_lang$core$Basics_ops['++'], _elm_lang$core$Basics$toString(_Bogdanp$elm_time$Time_Date$day(dat)), A2(_elm_lang$core$Basics_ops['++'], '. ', _user$project$Main$monthName(_Bogdanp$elm_time$Time_Date$month(dat))))),
				_1: { ctor: '[]' }
			}),
			_1: {
				ctor: '::',
				_0: A2(_elm_lang$html$Html$td, { ctor: '[]' }, {
					ctor: '::',
					_0: _user$project$Main$maybeLink(a.event),
					_1: { ctor: '[]' }
				}),
				_1: {
					ctor: '::',
					_0: A2(_elm_lang$html$Html$td, { ctor: '[]' }, {
						ctor: '::',
						_0: _user$project$Main$maybeLink(a.location),
						_1: { ctor: '[]' }
					}),
					_1: { ctor: '[]' }
				}
			}
		});
	};
	var _user$project$Main$concerts = function _user$project$Main$concerts(events) {
		var _p6 = events;
		if (_p6.ctor === 'Just') {
			return A2(_elm_lang$html$Html$div, { ctor: '[]' }, {
				ctor: '::',
				_0: A2(_elm_lang$html$Html$h1, {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$id('concerts'),
					_1: { ctor: '[]' }
				}, {
					ctor: '::',
					_0: _elm_lang$html$Html$text('concerts'),
					_1: { ctor: '[]' }
				}),
				_1: {
					ctor: '::',
					_0: A2(_elm_lang$html$Html$table, { ctor: '[]' }, {
						ctor: '::',
						_0: function () {
							var sortedEvents = A2(_elm_lang$core$List$partition, _user$project$Main$compareDate, _elm_lang$core$List$reverse(A2(_elm_lang$core$List$sortBy, function (_) {
								return _.date;
							}, _p6._0)));
							var upcoming = A2(_elm_lang$core$List$map, _user$project$Main$row, _elm_lang$core$Tuple$first(sortedEvents));
							return A2(_elm_lang$html$Html$tbody, { ctor: '[]' }, _elm_lang$core$List$concat({
								ctor: '::',
								_0: {
									ctor: '::',
									_0: _user$project$Main$rowH2('upcoming'),
									_1: { ctor: '[]' }
								},
								_1: {
									ctor: '::',
									_0: upcoming,
									_1: { ctor: '[]' }
								}
							}));
						}(),
						_1: { ctor: '[]' }
					}),
					_1: { ctor: '[]' }
				}
			});
		} else {
			return A2(_elm_lang$html$Html$div, { ctor: '[]' }, {
				ctor: '::',
				_0: A2(_elm_lang$html$Html$h1, {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$id('concerts'),
					_1: { ctor: '[]' }
				}, {
					ctor: '::',
					_0: _elm_lang$html$Html$text('concerts'),
					_1: { ctor: '[]' }
				}),
				_1: {
					ctor: '::',
					_0: A2(_elm_lang$html$Html$p, { ctor: '[]' }, {
						ctor: '::',
						_0: _elm_lang$html$Html$text('no concerts available'),
						_1: { ctor: '[]' }
					}),
					_1: { ctor: '[]' }
				}
			});
		}
	};
	var _user$project$Main$defaultOptions = {
		githubFlavored: _elm_lang$core$Maybe$Just({ tables: false, breaks: false }),
		defaultHighlighting: _elm_lang$core$Maybe$Nothing,
		sanitize: false,
		smartypants: false
	};
	var _user$project$Main$options = _elm_lang$core$Native_Utils.update(_user$project$Main$defaultOptions, {
		githubFlavored: _elm_lang$core$Maybe$Just({ tables: true, breaks: false })
	});
	var _user$project$Main$toMarkdown = function _user$project$Main$toMarkdown(userInput) {
		return A3(_evancz$elm_markdown$Markdown$toHtmlWith, _user$project$Main$options, { ctor: '[]' }, userInput);
	};
	var _user$project$Main$view = function _user$project$Main$view(model) {
		return A2(_elm_lang$html$Html$span, { ctor: '[]' }, {
			ctor: '::',
			_0: A2(_elm_lang$html$Html$header, { ctor: '[]' }, {
				ctor: '::',
				_0: A2(_elm_lang$html$Html$a, {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$href('#top'),
					_1: { ctor: '[]' }
				}, {
					ctor: '::',
					_0: A2(_elm_lang$html$Html$h1, { ctor: '[]' }, {
						ctor: '::',
						_0: _elm_lang$html$Html$text('GIVE ME A REASON'),
						_1: { ctor: '[]' }
					}),
					_1: { ctor: '[]' }
				}),
				_1: {
					ctor: '::',
					_0: A2(_elm_lang$html$Html$nav, { ctor: '[]' }, {
						ctor: '::',
						_0: A2(_elm_lang$html$Html$a, {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$href('#concerts'),
							_1: { ctor: '[]' }
						}, {
							ctor: '::',
							_0: _elm_lang$html$Html$text('concerts'),
							_1: { ctor: '[]' }
						}),
						_1: {
							ctor: '::',
							_0: A2(_elm_lang$html$Html$a, {
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$href('#about'),
								_1: { ctor: '[]' }
							}, {
								ctor: '::',
								_0: _elm_lang$html$Html$text('about'),
								_1: { ctor: '[]' }
							}),
							_1: {
								ctor: '::',
								_0: A2(_elm_lang$html$Html$a, {
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$href('#contact-booking'),
									_1: { ctor: '[]' }
								}, {
									ctor: '::',
									_0: _elm_lang$html$Html$text('contact / booking'),
									_1: { ctor: '[]' }
								}),
								_1: { ctor: '[]' }
							}
						}
					}),
					_1: { ctor: '[]' }
				}
			}),
			_1: {
				ctor: '::',
				_0: A2(_elm_lang$html$Html$main_, {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$id('top'),
					_1: { ctor: '[]' }
				}, {
					ctor: '::',
					_0: A2(_evancz$elm_markdown$Markdown$toHtml, { ctor: '[]' }, model.content.news),
					_1: {
						ctor: '::',
						_0: _user$project$Main$concerts(model.content.events),
						_1: {
							ctor: '::',
							_0: _user$project$Main$toMarkdown(model.content.about),
							_1: {
								ctor: '::',
								_0: A2(_evancz$elm_markdown$Markdown$toHtml, { ctor: '[]' }, model.content.contact),
								_1: { ctor: '[]' }
							}
						}
					}
				}),
				_1: { ctor: '[]' }
			}
		});
	};
	var _user$project$Main$toggleLanguage = function _user$project$Main$toggleLanguage(model) {
		var _p7 = model.language;
		if (_p7 === 'en') {
			return _elm_lang$core$Native_Utils.update(model, { language: 'de' });
		} else {
			return _elm_lang$core$Native_Utils.update(model, { language: 'en' });
		}
	};
	var _user$project$Main$update = F2(function (msg, model) {
		var _p8 = msg;
		if (_p8.ctor === 'ToggleLanguage') {
			return {
				ctor: '_Tuple2',
				_0: _user$project$Main$toggleLanguage(model),
				_1: _elm_lang$core$Platform_Cmd$none
			};
		} else {
			return {
				ctor: '_Tuple2',
				_0: _elm_lang$core$Native_Utils.update(model, { content: _p8._0 }),
				_1: _elm_lang$core$Platform_Cmd$none
			};
		}
	});
	var _user$project$Main$initContent = { news: '# LOADING', events: _elm_lang$core$Maybe$Nothing, about: '', contact: '' };
	var _user$project$Main$initModel = { content: _user$project$Main$initContent, language: 'de' };
	var _user$project$Main$content = _elm_lang$core$Native_Platform.incomingPort('content', A2(_elm_lang$core$Json_Decode$andThen, function (news) {
		return A2(_elm_lang$core$Json_Decode$andThen, function (events) {
			return A2(_elm_lang$core$Json_Decode$andThen, function (about) {
				return A2(_elm_lang$core$Json_Decode$andThen, function (contact) {
					return _elm_lang$core$Json_Decode$succeed({ news: news, events: events, about: about, contact: contact });
				}, A2(_elm_lang$core$Json_Decode$field, 'contact', _elm_lang$core$Json_Decode$string));
			}, A2(_elm_lang$core$Json_Decode$field, 'about', _elm_lang$core$Json_Decode$string));
		}, A2(_elm_lang$core$Json_Decode$field, 'events', _elm_lang$core$Json_Decode$oneOf({
			ctor: '::',
			_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
			_1: {
				ctor: '::',
				_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, _elm_lang$core$Json_Decode$list(A2(_elm_lang$core$Json_Decode$andThen, function (date) {
					return A2(_elm_lang$core$Json_Decode$andThen, function (event) {
						return A2(_elm_lang$core$Json_Decode$andThen, function (location) {
							return _elm_lang$core$Json_Decode$succeed({ date: date, event: event, location: location });
						}, A2(_elm_lang$core$Json_Decode$field, 'location', A2(_elm_lang$core$Json_Decode$andThen, function (name) {
							return A2(_elm_lang$core$Json_Decode$andThen, function (url) {
								return _elm_lang$core$Json_Decode$succeed({ name: name, url: url });
							}, A2(_elm_lang$core$Json_Decode$field, 'url', _elm_lang$core$Json_Decode$oneOf({
								ctor: '::',
								_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
								_1: {
									ctor: '::',
									_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, _elm_lang$core$Json_Decode$string),
									_1: { ctor: '[]' }
								}
							})));
						}, A2(_elm_lang$core$Json_Decode$field, 'name', _elm_lang$core$Json_Decode$string))));
					}, A2(_elm_lang$core$Json_Decode$field, 'event', A2(_elm_lang$core$Json_Decode$andThen, function (name) {
						return A2(_elm_lang$core$Json_Decode$andThen, function (url) {
							return _elm_lang$core$Json_Decode$succeed({ name: name, url: url });
						}, A2(_elm_lang$core$Json_Decode$field, 'url', _elm_lang$core$Json_Decode$oneOf({
							ctor: '::',
							_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
							_1: {
								ctor: '::',
								_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, _elm_lang$core$Json_Decode$string),
								_1: { ctor: '[]' }
							}
						})));
					}, A2(_elm_lang$core$Json_Decode$field, 'name', _elm_lang$core$Json_Decode$string))));
				}, A2(_elm_lang$core$Json_Decode$field, 'date', _elm_lang$core$Json_Decode$string)))),
				_1: { ctor: '[]' }
			}
		})));
	}, A2(_elm_lang$core$Json_Decode$field, 'news', _elm_lang$core$Json_Decode$string)));
	var _user$project$Main$subscriptions = function _user$project$Main$subscriptions(model) {
		return _user$project$Main$content(_user$project$Types$NewContent);
	};
	var _user$project$Main$main = _elm_lang$html$Html$program({
		init: { ctor: '_Tuple2', _0: _user$project$Main$initModel, _1: _elm_lang$core$Platform_Cmd$none },
		view: _user$project$Main$view,
		update: _user$project$Main$update,
		subscriptions: _user$project$Main$subscriptions
	})();

	var Elm = {};
	Elm['Main'] = Elm['Main'] || {};
	if (typeof _user$project$Main$main !== 'undefined') {
		_user$project$Main$main(Elm['Main'], 'Main', undefined);
	}

	if (typeof define === "function" && define['amd']) {
		define([], function () {
			return Elm;
		});
		return;
	}

	if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === "object") {
		module['exports'] = Elm;
		return;
	}

	var globalElm = this['Elm'];
	if (typeof globalElm === "undefined") {
		this['Elm'] = Elm;
		return;
	}

	for (var publicModule in Elm) {
		if (publicModule in globalElm) {
			throw new Error('There are two Elm modules called `' + publicModule + '` on this page! Rename one of them.');
		}
		globalElm[publicModule] = Elm[publicModule];
	}
}).call(this);
},{"process":13}],4:[function(require,module,exports) {
var process = require("process");
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
	'use strict';

	function F2(fun) {
		function wrapper(a) {
			return function (b) {
				return fun(a, b);
			};
		}
		wrapper.arity = 2;
		wrapper.func = fun;
		return wrapper;
	}

	function F3(fun) {
		function wrapper(a) {
			return function (b) {
				return function (c) {
					return fun(a, b, c);
				};
			};
		}
		wrapper.arity = 3;
		wrapper.func = fun;
		return wrapper;
	}

	function F4(fun) {
		function wrapper(a) {
			return function (b) {
				return function (c) {
					return function (d) {
						return fun(a, b, c, d);
					};
				};
			};
		}
		wrapper.arity = 4;
		wrapper.func = fun;
		return wrapper;
	}

	function F5(fun) {
		function wrapper(a) {
			return function (b) {
				return function (c) {
					return function (d) {
						return function (e) {
							return fun(a, b, c, d, e);
						};
					};
				};
			};
		}
		wrapper.arity = 5;
		wrapper.func = fun;
		return wrapper;
	}

	function F6(fun) {
		function wrapper(a) {
			return function (b) {
				return function (c) {
					return function (d) {
						return function (e) {
							return function (f) {
								return fun(a, b, c, d, e, f);
							};
						};
					};
				};
			};
		}
		wrapper.arity = 6;
		wrapper.func = fun;
		return wrapper;
	}

	function F7(fun) {
		function wrapper(a) {
			return function (b) {
				return function (c) {
					return function (d) {
						return function (e) {
							return function (f) {
								return function (g) {
									return fun(a, b, c, d, e, f, g);
								};
							};
						};
					};
				};
			};
		}
		wrapper.arity = 7;
		wrapper.func = fun;
		return wrapper;
	}

	function F8(fun) {
		function wrapper(a) {
			return function (b) {
				return function (c) {
					return function (d) {
						return function (e) {
							return function (f) {
								return function (g) {
									return function (h) {
										return fun(a, b, c, d, e, f, g, h);
									};
								};
							};
						};
					};
				};
			};
		}
		wrapper.arity = 8;
		wrapper.func = fun;
		return wrapper;
	}

	function F9(fun) {
		function wrapper(a) {
			return function (b) {
				return function (c) {
					return function (d) {
						return function (e) {
							return function (f) {
								return function (g) {
									return function (h) {
										return function (i) {
											return fun(a, b, c, d, e, f, g, h, i);
										};
									};
								};
							};
						};
					};
				};
			};
		}
		wrapper.arity = 9;
		wrapper.func = fun;
		return wrapper;
	}

	function A2(fun, a, b) {
		return fun.arity === 2 ? fun.func(a, b) : fun(a)(b);
	}
	function A3(fun, a, b, c) {
		return fun.arity === 3 ? fun.func(a, b, c) : fun(a)(b)(c);
	}
	function A4(fun, a, b, c, d) {
		return fun.arity === 4 ? fun.func(a, b, c, d) : fun(a)(b)(c)(d);
	}
	function A5(fun, a, b, c, d, e) {
		return fun.arity === 5 ? fun.func(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
	}
	function A6(fun, a, b, c, d, e, f) {
		return fun.arity === 6 ? fun.func(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
	}
	function A7(fun, a, b, c, d, e, f, g) {
		return fun.arity === 7 ? fun.func(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
	}
	function A8(fun, a, b, c, d, e, f, g, h) {
		return fun.arity === 8 ? fun.func(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
	}
	function A9(fun, a, b, c, d, e, f, g, h, i) {
		return fun.arity === 9 ? fun.func(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
	}

	//import Native.List //

	var _elm_lang$core$Native_Array = function () {

		// A RRB-Tree has two distinct data types.
		// Leaf -> "height"  is always 0
		//         "table"   is an array of elements
		// Node -> "height"  is always greater than 0
		//         "table"   is an array of child nodes
		//         "lengths" is an array of accumulated lengths of the child nodes

		// M is the maximal table size. 32 seems fast. E is the allowed increase
		// of search steps when concatting to find an index. Lower values will
		// decrease balancing, but will increase search steps.
		var M = 32;
		var E = 2;

		// An empty array.
		var empty = {
			ctor: '_Array',
			height: 0,
			table: []
		};

		function get(i, array) {
			if (i < 0 || i >= length(array)) {
				throw new Error('Index ' + i + ' is out of range. Check the length of ' + 'your array first or use getMaybe or getWithDefault.');
			}
			return unsafeGet(i, array);
		}

		function unsafeGet(i, array) {
			for (var x = array.height; x > 0; x--) {
				var slot = i >> x * 5;
				while (array.lengths[slot] <= i) {
					slot++;
				}
				if (slot > 0) {
					i -= array.lengths[slot - 1];
				}
				array = array.table[slot];
			}
			return array.table[i];
		}

		// Sets the value at the index i. Only the nodes leading to i will get
		// copied and updated.
		function set(i, item, array) {
			if (i < 0 || length(array) <= i) {
				return array;
			}
			return unsafeSet(i, item, array);
		}

		function unsafeSet(i, item, array) {
			array = nodeCopy(array);

			if (array.height === 0) {
				array.table[i] = item;
			} else {
				var slot = getSlot(i, array);
				if (slot > 0) {
					i -= array.lengths[slot - 1];
				}
				array.table[slot] = unsafeSet(i, item, array.table[slot]);
			}
			return array;
		}

		function initialize(len, f) {
			if (len <= 0) {
				return empty;
			}
			var h = Math.floor(Math.log(len) / Math.log(M));
			return initialize_(f, h, 0, len);
		}

		function initialize_(f, h, from, to) {
			if (h === 0) {
				var table = new Array((to - from) % (M + 1));
				for (var i = 0; i < table.length; i++) {
					table[i] = f(from + i);
				}
				return {
					ctor: '_Array',
					height: 0,
					table: table
				};
			}

			var step = Math.pow(M, h);
			var table = new Array(Math.ceil((to - from) / step));
			var lengths = new Array(table.length);
			for (var i = 0; i < table.length; i++) {
				table[i] = initialize_(f, h - 1, from + i * step, Math.min(from + (i + 1) * step, to));
				lengths[i] = length(table[i]) + (i > 0 ? lengths[i - 1] : 0);
			}
			return {
				ctor: '_Array',
				height: h,
				table: table,
				lengths: lengths
			};
		}

		function fromList(list) {
			if (list.ctor === '[]') {
				return empty;
			}

			// Allocate M sized blocks (table) and write list elements to it.
			var table = new Array(M);
			var nodes = [];
			var i = 0;

			while (list.ctor !== '[]') {
				table[i] = list._0;
				list = list._1;
				i++;

				// table is full, so we can push a leaf containing it into the
				// next node.
				if (i === M) {
					var leaf = {
						ctor: '_Array',
						height: 0,
						table: table
					};
					fromListPush(leaf, nodes);
					table = new Array(M);
					i = 0;
				}
			}

			// Maybe there is something left on the table.
			if (i > 0) {
				var leaf = {
					ctor: '_Array',
					height: 0,
					table: table.splice(0, i)
				};
				fromListPush(leaf, nodes);
			}

			// Go through all of the nodes and eventually push them into higher nodes.
			for (var h = 0; h < nodes.length - 1; h++) {
				if (nodes[h].table.length > 0) {
					fromListPush(nodes[h], nodes);
				}
			}

			var head = nodes[nodes.length - 1];
			if (head.height > 0 && head.table.length === 1) {
				return head.table[0];
			} else {
				return head;
			}
		}

		// Push a node into a higher node as a child.
		function fromListPush(toPush, nodes) {
			var h = toPush.height;

			// Maybe the node on this height does not exist.
			if (nodes.length === h) {
				var node = {
					ctor: '_Array',
					height: h + 1,
					table: [],
					lengths: []
				};
				nodes.push(node);
			}

			nodes[h].table.push(toPush);
			var len = length(toPush);
			if (nodes[h].lengths.length > 0) {
				len += nodes[h].lengths[nodes[h].lengths.length - 1];
			}
			nodes[h].lengths.push(len);

			if (nodes[h].table.length === M) {
				fromListPush(nodes[h], nodes);
				nodes[h] = {
					ctor: '_Array',
					height: h + 1,
					table: [],
					lengths: []
				};
			}
		}

		// Pushes an item via push_ to the bottom right of a tree.
		function push(item, a) {
			var pushed = push_(item, a);
			if (pushed !== null) {
				return pushed;
			}

			var newTree = create(item, a.height);
			return siblise(a, newTree);
		}

		// Recursively tries to push an item to the bottom-right most
		// tree possible. If there is no space left for the item,
		// null will be returned.
		function push_(item, a) {
			// Handle resursion stop at leaf level.
			if (a.height === 0) {
				if (a.table.length < M) {
					var newA = {
						ctor: '_Array',
						height: 0,
						table: a.table.slice()
					};
					newA.table.push(item);
					return newA;
				} else {
					return null;
				}
			}

			// Recursively push
			var pushed = push_(item, botRight(a));

			// There was space in the bottom right tree, so the slot will
			// be updated.
			if (pushed !== null) {
				var newA = nodeCopy(a);
				newA.table[newA.table.length - 1] = pushed;
				newA.lengths[newA.lengths.length - 1]++;
				return newA;
			}

			// When there was no space left, check if there is space left
			// for a new slot with a tree which contains only the item
			// at the bottom.
			if (a.table.length < M) {
				var newSlot = create(item, a.height - 1);
				var newA = nodeCopy(a);
				newA.table.push(newSlot);
				newA.lengths.push(newA.lengths[newA.lengths.length - 1] + length(newSlot));
				return newA;
			} else {
				return null;
			}
		}

		// Converts an array into a list of elements.
		function toList(a) {
			return toList_(_elm_lang$core$Native_List.Nil, a);
		}

		function toList_(list, a) {
			for (var i = a.table.length - 1; i >= 0; i--) {
				list = a.height === 0 ? _elm_lang$core$Native_List.Cons(a.table[i], list) : toList_(list, a.table[i]);
			}
			return list;
		}

		// Maps a function over the elements of an array.
		function map(f, a) {
			var newA = {
				ctor: '_Array',
				height: a.height,
				table: new Array(a.table.length)
			};
			if (a.height > 0) {
				newA.lengths = a.lengths;
			}
			for (var i = 0; i < a.table.length; i++) {
				newA.table[i] = a.height === 0 ? f(a.table[i]) : map(f, a.table[i]);
			}
			return newA;
		}

		// Maps a function over the elements with their index as first argument.
		function indexedMap(f, a) {
			return indexedMap_(f, a, 0);
		}

		function indexedMap_(f, a, from) {
			var newA = {
				ctor: '_Array',
				height: a.height,
				table: new Array(a.table.length)
			};
			if (a.height > 0) {
				newA.lengths = a.lengths;
			}
			for (var i = 0; i < a.table.length; i++) {
				newA.table[i] = a.height === 0 ? A2(f, from + i, a.table[i]) : indexedMap_(f, a.table[i], i == 0 ? from : from + a.lengths[i - 1]);
			}
			return newA;
		}

		function foldl(f, b, a) {
			if (a.height === 0) {
				for (var i = 0; i < a.table.length; i++) {
					b = A2(f, a.table[i], b);
				}
			} else {
				for (var i = 0; i < a.table.length; i++) {
					b = foldl(f, b, a.table[i]);
				}
			}
			return b;
		}

		function foldr(f, b, a) {
			if (a.height === 0) {
				for (var i = a.table.length; i--;) {
					b = A2(f, a.table[i], b);
				}
			} else {
				for (var i = a.table.length; i--;) {
					b = foldr(f, b, a.table[i]);
				}
			}
			return b;
		}

		// TODO: currently, it slices the right, then the left. This can be
		// optimized.
		function slice(from, to, a) {
			if (from < 0) {
				from += length(a);
			}
			if (to < 0) {
				to += length(a);
			}
			return sliceLeft(from, sliceRight(to, a));
		}

		function sliceRight(to, a) {
			if (to === length(a)) {
				return a;
			}

			// Handle leaf level.
			if (a.height === 0) {
				var newA = { ctor: '_Array', height: 0 };
				newA.table = a.table.slice(0, to);
				return newA;
			}

			// Slice the right recursively.
			var right = getSlot(to, a);
			var sliced = sliceRight(to - (right > 0 ? a.lengths[right - 1] : 0), a.table[right]);

			// Maybe the a node is not even needed, as sliced contains the whole slice.
			if (right === 0) {
				return sliced;
			}

			// Create new node.
			var newA = {
				ctor: '_Array',
				height: a.height,
				table: a.table.slice(0, right),
				lengths: a.lengths.slice(0, right)
			};
			if (sliced.table.length > 0) {
				newA.table[right] = sliced;
				newA.lengths[right] = length(sliced) + (right > 0 ? newA.lengths[right - 1] : 0);
			}
			return newA;
		}

		function sliceLeft(from, a) {
			if (from === 0) {
				return a;
			}

			// Handle leaf level.
			if (a.height === 0) {
				var newA = { ctor: '_Array', height: 0 };
				newA.table = a.table.slice(from, a.table.length + 1);
				return newA;
			}

			// Slice the left recursively.
			var left = getSlot(from, a);
			var sliced = sliceLeft(from - (left > 0 ? a.lengths[left - 1] : 0), a.table[left]);

			// Maybe the a node is not even needed, as sliced contains the whole slice.
			if (left === a.table.length - 1) {
				return sliced;
			}

			// Create new node.
			var newA = {
				ctor: '_Array',
				height: a.height,
				table: a.table.slice(left, a.table.length + 1),
				lengths: new Array(a.table.length - left)
			};
			newA.table[0] = sliced;
			var len = 0;
			for (var i = 0; i < newA.table.length; i++) {
				len += length(newA.table[i]);
				newA.lengths[i] = len;
			}

			return newA;
		}

		// Appends two trees.
		function append(a, b) {
			if (a.table.length === 0) {
				return b;
			}
			if (b.table.length === 0) {
				return a;
			}

			var c = append_(a, b);

			// Check if both nodes can be crunshed together.
			if (c[0].table.length + c[1].table.length <= M) {
				if (c[0].table.length === 0) {
					return c[1];
				}
				if (c[1].table.length === 0) {
					return c[0];
				}

				// Adjust .table and .lengths
				c[0].table = c[0].table.concat(c[1].table);
				if (c[0].height > 0) {
					var len = length(c[0]);
					for (var i = 0; i < c[1].lengths.length; i++) {
						c[1].lengths[i] += len;
					}
					c[0].lengths = c[0].lengths.concat(c[1].lengths);
				}

				return c[0];
			}

			if (c[0].height > 0) {
				var toRemove = calcToRemove(a, b);
				if (toRemove > E) {
					c = shuffle(c[0], c[1], toRemove);
				}
			}

			return siblise(c[0], c[1]);
		}

		// Returns an array of two nodes; right and left. One node _may_ be empty.
		function append_(a, b) {
			if (a.height === 0 && b.height === 0) {
				return [a, b];
			}

			if (a.height !== 1 || b.height !== 1) {
				if (a.height === b.height) {
					a = nodeCopy(a);
					b = nodeCopy(b);
					var appended = append_(botRight(a), botLeft(b));

					insertRight(a, appended[1]);
					insertLeft(b, appended[0]);
				} else if (a.height > b.height) {
					a = nodeCopy(a);
					var appended = append_(botRight(a), b);

					insertRight(a, appended[0]);
					b = parentise(appended[1], appended[1].height + 1);
				} else {
					b = nodeCopy(b);
					var appended = append_(a, botLeft(b));

					var left = appended[0].table.length === 0 ? 0 : 1;
					var right = left === 0 ? 1 : 0;
					insertLeft(b, appended[left]);
					a = parentise(appended[right], appended[right].height + 1);
				}
			}

			// Check if balancing is needed and return based on that.
			if (a.table.length === 0 || b.table.length === 0) {
				return [a, b];
			}

			var toRemove = calcToRemove(a, b);
			if (toRemove <= E) {
				return [a, b];
			}
			return shuffle(a, b, toRemove);
		}

		// Helperfunctions for append_. Replaces a child node at the side of the parent.
		function insertRight(parent, node) {
			var index = parent.table.length - 1;
			parent.table[index] = node;
			parent.lengths[index] = length(node);
			parent.lengths[index] += index > 0 ? parent.lengths[index - 1] : 0;
		}

		function insertLeft(parent, node) {
			if (node.table.length > 0) {
				parent.table[0] = node;
				parent.lengths[0] = length(node);

				var len = length(parent.table[0]);
				for (var i = 1; i < parent.lengths.length; i++) {
					len += length(parent.table[i]);
					parent.lengths[i] = len;
				}
			} else {
				parent.table.shift();
				for (var i = 1; i < parent.lengths.length; i++) {
					parent.lengths[i] = parent.lengths[i] - parent.lengths[0];
				}
				parent.lengths.shift();
			}
		}

		// Returns the extra search steps for E. Refer to the paper.
		function calcToRemove(a, b) {
			var subLengths = 0;
			for (var i = 0; i < a.table.length; i++) {
				subLengths += a.table[i].table.length;
			}
			for (var i = 0; i < b.table.length; i++) {
				subLengths += b.table[i].table.length;
			}

			var toRemove = a.table.length + b.table.length;
			return toRemove - (Math.floor((subLengths - 1) / M) + 1);
		}

		// get2, set2 and saveSlot are helpers for accessing elements over two arrays.
		function get2(a, b, index) {
			return index < a.length ? a[index] : b[index - a.length];
		}

		function set2(a, b, index, value) {
			if (index < a.length) {
				a[index] = value;
			} else {
				b[index - a.length] = value;
			}
		}

		function saveSlot(a, b, index, slot) {
			set2(a.table, b.table, index, slot);

			var l = index === 0 || index === a.lengths.length ? 0 : get2(a.lengths, a.lengths, index - 1);

			set2(a.lengths, b.lengths, index, l + length(slot));
		}

		// Creates a node or leaf with a given length at their arrays for perfomance.
		// Is only used by shuffle.
		function createNode(h, length) {
			if (length < 0) {
				length = 0;
			}
			var a = {
				ctor: '_Array',
				height: h,
				table: new Array(length)
			};
			if (h > 0) {
				a.lengths = new Array(length);
			}
			return a;
		}

		// Returns an array of two balanced nodes.
		function shuffle(a, b, toRemove) {
			var newA = createNode(a.height, Math.min(M, a.table.length + b.table.length - toRemove));
			var newB = createNode(a.height, newA.table.length - (a.table.length + b.table.length - toRemove));

			// Skip the slots with size M. More precise: copy the slot references
			// to the new node
			var read = 0;
			while (get2(a.table, b.table, read).table.length % M === 0) {
				set2(newA.table, newB.table, read, get2(a.table, b.table, read));
				set2(newA.lengths, newB.lengths, read, get2(a.lengths, b.lengths, read));
				read++;
			}

			// Pulling items from left to right, caching in a slot before writing
			// it into the new nodes.
			var write = read;
			var slot = new createNode(a.height - 1, 0);
			var from = 0;

			// If the current slot is still containing data, then there will be at
			// least one more write, so we do not break this loop yet.
			while (read - write - (slot.table.length > 0 ? 1 : 0) < toRemove) {
				// Find out the max possible items for copying.
				var source = get2(a.table, b.table, read);
				var to = Math.min(M - slot.table.length, source.table.length);

				// Copy and adjust size table.
				slot.table = slot.table.concat(source.table.slice(from, to));
				if (slot.height > 0) {
					var len = slot.lengths.length;
					for (var i = len; i < len + to - from; i++) {
						slot.lengths[i] = length(slot.table[i]);
						slot.lengths[i] += i > 0 ? slot.lengths[i - 1] : 0;
					}
				}

				from += to;

				// Only proceed to next slots[i] if the current one was
				// fully copied.
				if (source.table.length <= to) {
					read++;from = 0;
				}

				// Only create a new slot if the current one is filled up.
				if (slot.table.length === M) {
					saveSlot(newA, newB, write, slot);
					slot = createNode(a.height - 1, 0);
					write++;
				}
			}

			// Cleanup after the loop. Copy the last slot into the new nodes.
			if (slot.table.length > 0) {
				saveSlot(newA, newB, write, slot);
				write++;
			}

			// Shift the untouched slots to the left
			while (read < a.table.length + b.table.length) {
				saveSlot(newA, newB, write, get2(a.table, b.table, read));
				read++;
				write++;
			}

			return [newA, newB];
		}

		// Navigation functions
		function botRight(a) {
			return a.table[a.table.length - 1];
		}
		function botLeft(a) {
			return a.table[0];
		}

		// Copies a node for updating. Note that you should not use this if
		// only updating only one of "table" or "lengths" for performance reasons.
		function nodeCopy(a) {
			var newA = {
				ctor: '_Array',
				height: a.height,
				table: a.table.slice()
			};
			if (a.height > 0) {
				newA.lengths = a.lengths.slice();
			}
			return newA;
		}

		// Returns how many items are in the tree.
		function length(array) {
			if (array.height === 0) {
				return array.table.length;
			} else {
				return array.lengths[array.lengths.length - 1];
			}
		}

		// Calculates in which slot of "table" the item probably is, then
		// find the exact slot via forward searching in  "lengths". Returns the index.
		function getSlot(i, a) {
			var slot = i >> 5 * a.height;
			while (a.lengths[slot] <= i) {
				slot++;
			}
			return slot;
		}

		// Recursively creates a tree with a given height containing
		// only the given item.
		function create(item, h) {
			if (h === 0) {
				return {
					ctor: '_Array',
					height: 0,
					table: [item]
				};
			}
			return {
				ctor: '_Array',
				height: h,
				table: [create(item, h - 1)],
				lengths: [1]
			};
		}

		// Recursively creates a tree that contains the given tree.
		function parentise(tree, h) {
			if (h === tree.height) {
				return tree;
			}

			return {
				ctor: '_Array',
				height: h,
				table: [parentise(tree, h - 1)],
				lengths: [length(tree)]
			};
		}

		// Emphasizes blood brotherhood beneath two trees.
		function siblise(a, b) {
			return {
				ctor: '_Array',
				height: a.height + 1,
				table: [a, b],
				lengths: [length(a), length(a) + length(b)]
			};
		}

		function toJSArray(a) {
			var jsArray = new Array(length(a));
			toJSArray_(jsArray, 0, a);
			return jsArray;
		}

		function toJSArray_(jsArray, i, a) {
			for (var t = 0; t < a.table.length; t++) {
				if (a.height === 0) {
					jsArray[i + t] = a.table[t];
				} else {
					var inc = t === 0 ? 0 : a.lengths[t - 1];
					toJSArray_(jsArray, i + inc, a.table[t]);
				}
			}
		}

		function fromJSArray(jsArray) {
			if (jsArray.length === 0) {
				return empty;
			}
			var h = Math.floor(Math.log(jsArray.length) / Math.log(M));
			return fromJSArray_(jsArray, h, 0, jsArray.length);
		}

		function fromJSArray_(jsArray, h, from, to) {
			if (h === 0) {
				return {
					ctor: '_Array',
					height: 0,
					table: jsArray.slice(from, to)
				};
			}

			var step = Math.pow(M, h);
			var table = new Array(Math.ceil((to - from) / step));
			var lengths = new Array(table.length);
			for (var i = 0; i < table.length; i++) {
				table[i] = fromJSArray_(jsArray, h - 1, from + i * step, Math.min(from + (i + 1) * step, to));
				lengths[i] = length(table[i]) + (i > 0 ? lengths[i - 1] : 0);
			}
			return {
				ctor: '_Array',
				height: h,
				table: table,
				lengths: lengths
			};
		}

		return {
			empty: empty,
			fromList: fromList,
			toList: toList,
			initialize: F2(initialize),
			append: F2(append),
			push: F2(push),
			slice: F3(slice),
			get: F2(get),
			set: F3(set),
			map: F2(map),
			indexedMap: F2(indexedMap),
			foldl: F3(foldl),
			foldr: F3(foldr),
			length: length,

			toJSArray: toJSArray,
			fromJSArray: fromJSArray
		};
	}();
	//import Native.Utils //

	var _elm_lang$core$Native_Basics = function () {

		function div(a, b) {
			return a / b | 0;
		}
		function rem(a, b) {
			return a % b;
		}
		function mod(a, b) {
			if (b === 0) {
				throw new Error('Cannot perform mod 0. Division by zero error.');
			}
			var r = a % b;
			var m = a === 0 ? 0 : b > 0 ? a >= 0 ? r : r + b : -mod(-a, -b);

			return m === b ? 0 : m;
		}
		function logBase(base, n) {
			return Math.log(n) / Math.log(base);
		}
		function negate(n) {
			return -n;
		}
		function abs(n) {
			return n < 0 ? -n : n;
		}

		function min(a, b) {
			return _elm_lang$core$Native_Utils.cmp(a, b) < 0 ? a : b;
		}
		function max(a, b) {
			return _elm_lang$core$Native_Utils.cmp(a, b) > 0 ? a : b;
		}
		function clamp(lo, hi, n) {
			return _elm_lang$core$Native_Utils.cmp(n, lo) < 0 ? lo : _elm_lang$core$Native_Utils.cmp(n, hi) > 0 ? hi : n;
		}

		var ord = ['LT', 'EQ', 'GT'];

		function compare(x, y) {
			return { ctor: ord[_elm_lang$core$Native_Utils.cmp(x, y) + 1] };
		}

		function xor(a, b) {
			return a !== b;
		}
		function not(b) {
			return !b;
		}
		function isInfinite(n) {
			return n === Infinity || n === -Infinity;
		}

		function truncate(n) {
			return n | 0;
		}

		function degrees(d) {
			return d * Math.PI / 180;
		}
		function turns(t) {
			return 2 * Math.PI * t;
		}
		function fromPolar(point) {
			var r = point._0;
			var t = point._1;
			return _elm_lang$core$Native_Utils.Tuple2(r * Math.cos(t), r * Math.sin(t));
		}
		function toPolar(point) {
			var x = point._0;
			var y = point._1;
			return _elm_lang$core$Native_Utils.Tuple2(Math.sqrt(x * x + y * y), Math.atan2(y, x));
		}

		return {
			div: F2(div),
			rem: F2(rem),
			mod: F2(mod),

			pi: Math.PI,
			e: Math.E,
			cos: Math.cos,
			sin: Math.sin,
			tan: Math.tan,
			acos: Math.acos,
			asin: Math.asin,
			atan: Math.atan,
			atan2: F2(Math.atan2),

			degrees: degrees,
			turns: turns,
			fromPolar: fromPolar,
			toPolar: toPolar,

			sqrt: Math.sqrt,
			logBase: F2(logBase),
			negate: negate,
			abs: abs,
			min: F2(min),
			max: F2(max),
			clamp: F3(clamp),
			compare: F2(compare),

			xor: F2(xor),
			not: not,

			truncate: truncate,
			ceiling: Math.ceil,
			floor: Math.floor,
			round: Math.round,
			toFloat: function toFloat(x) {
				return x;
			},
			isNaN: isNaN,
			isInfinite: isInfinite
		};
	}();
	//import //

	var _elm_lang$core$Native_Utils = function () {

		// COMPARISONS

		function eq(x, y) {
			var stack = [];
			var isEqual = eqHelp(x, y, 0, stack);
			var pair;
			while (isEqual && (pair = stack.pop())) {
				isEqual = eqHelp(pair.x, pair.y, 0, stack);
			}
			return isEqual;
		}

		function eqHelp(x, y, depth, stack) {
			if (depth > 100) {
				stack.push({ x: x, y: y });
				return true;
			}

			if (x === y) {
				return true;
			}

			if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object') {
				if (typeof x === 'function') {
					throw new Error('Trying to use `(==)` on functions. There is no way to know if functions are "the same" in the Elm sense.' + ' Read more about this at http://package.elm-lang.org/packages/elm-lang/core/latest/Basics#==' + ' which describes why it is this way and what the better version will look like.');
				}
				return false;
			}

			if (x === null || y === null) {
				return false;
			}

			if (x instanceof Date) {
				return x.getTime() === y.getTime();
			}

			if (!('ctor' in x)) {
				for (var key in x) {
					if (!eqHelp(x[key], y[key], depth + 1, stack)) {
						return false;
					}
				}
				return true;
			}

			// convert Dicts and Sets to lists
			if (x.ctor === 'RBNode_elm_builtin' || x.ctor === 'RBEmpty_elm_builtin') {
				x = _elm_lang$core$Dict$toList(x);
				y = _elm_lang$core$Dict$toList(y);
			}
			if (x.ctor === 'Set_elm_builtin') {
				x = _elm_lang$core$Set$toList(x);
				y = _elm_lang$core$Set$toList(y);
			}

			// check if lists are equal without recursion
			if (x.ctor === '::') {
				var a = x;
				var b = y;
				while (a.ctor === '::' && b.ctor === '::') {
					if (!eqHelp(a._0, b._0, depth + 1, stack)) {
						return false;
					}
					a = a._1;
					b = b._1;
				}
				return a.ctor === b.ctor;
			}

			// check if Arrays are equal
			if (x.ctor === '_Array') {
				var xs = _elm_lang$core$Native_Array.toJSArray(x);
				var ys = _elm_lang$core$Native_Array.toJSArray(y);
				if (xs.length !== ys.length) {
					return false;
				}
				for (var i = 0; i < xs.length; i++) {
					if (!eqHelp(xs[i], ys[i], depth + 1, stack)) {
						return false;
					}
				}
				return true;
			}

			if (!eqHelp(x.ctor, y.ctor, depth + 1, stack)) {
				return false;
			}

			for (var key in x) {
				if (!eqHelp(x[key], y[key], depth + 1, stack)) {
					return false;
				}
			}
			return true;
		}

		// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
		// the particular integer values assigned to LT, EQ, and GT.

		var LT = -1,
		    EQ = 0,
		    GT = 1;

		function cmp(x, y) {
			if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object') {
				return x === y ? EQ : x < y ? LT : GT;
			}

			if (x instanceof String) {
				var a = x.valueOf();
				var b = y.valueOf();
				return a === b ? EQ : a < b ? LT : GT;
			}

			if (x.ctor === '::' || x.ctor === '[]') {
				while (x.ctor === '::' && y.ctor === '::') {
					var ord = cmp(x._0, y._0);
					if (ord !== EQ) {
						return ord;
					}
					x = x._1;
					y = y._1;
				}
				return x.ctor === y.ctor ? EQ : x.ctor === '[]' ? LT : GT;
			}

			if (x.ctor.slice(0, 6) === '_Tuple') {
				var ord;
				var n = x.ctor.slice(6) - 0;
				var err = 'cannot compare tuples with more than 6 elements.';
				if (n === 0) return EQ;
				if (n >= 1) {
					ord = cmp(x._0, y._0);if (ord !== EQ) return ord;
					if (n >= 2) {
						ord = cmp(x._1, y._1);if (ord !== EQ) return ord;
						if (n >= 3) {
							ord = cmp(x._2, y._2);if (ord !== EQ) return ord;
							if (n >= 4) {
								ord = cmp(x._3, y._3);if (ord !== EQ) return ord;
								if (n >= 5) {
									ord = cmp(x._4, y._4);if (ord !== EQ) return ord;
									if (n >= 6) {
										ord = cmp(x._5, y._5);if (ord !== EQ) return ord;
										if (n >= 7) throw new Error('Comparison error: ' + err);
									}
								}
							}
						}
					}
				}
				return EQ;
			}

			throw new Error('Comparison error: comparison is only defined on ints, ' + 'floats, times, chars, strings, lists of comparable values, ' + 'and tuples of comparable values.');
		}

		// COMMON VALUES

		var Tuple0 = {
			ctor: '_Tuple0'
		};

		function Tuple2(x, y) {
			return {
				ctor: '_Tuple2',
				_0: x,
				_1: y
			};
		}

		function chr(c) {
			return new String(c);
		}

		// GUID

		var count = 0;
		function guid(_) {
			return count++;
		}

		// RECORDS

		function update(oldRecord, updatedFields) {
			var newRecord = {};

			for (var key in oldRecord) {
				newRecord[key] = oldRecord[key];
			}

			for (var key in updatedFields) {
				newRecord[key] = updatedFields[key];
			}

			return newRecord;
		}

		//// LIST STUFF ////

		var Nil = { ctor: '[]' };

		function Cons(hd, tl) {
			return {
				ctor: '::',
				_0: hd,
				_1: tl
			};
		}

		function append(xs, ys) {
			// append Strings
			if (typeof xs === 'string') {
				return xs + ys;
			}

			// append Lists
			if (xs.ctor === '[]') {
				return ys;
			}
			var root = Cons(xs._0, Nil);
			var curr = root;
			xs = xs._1;
			while (xs.ctor !== '[]') {
				curr._1 = Cons(xs._0, Nil);
				xs = xs._1;
				curr = curr._1;
			}
			curr._1 = ys;
			return root;
		}

		// CRASHES

		function crash(moduleName, region) {
			return function (message) {
				throw new Error('Ran into a `Debug.crash` in module `' + moduleName + '` ' + regionToString(region) + '\n' + 'The message provided by the code author is:\n\n    ' + message);
			};
		}

		function crashCase(moduleName, region, value) {
			return function (message) {
				throw new Error('Ran into a `Debug.crash` in module `' + moduleName + '`\n\n' + 'This was caused by the `case` expression ' + regionToString(region) + '.\n' + 'One of the branches ended with a crash and the following value got through:\n\n    ' + toString(value) + '\n\n' + 'The message provided by the code author is:\n\n    ' + message);
			};
		}

		function regionToString(region) {
			if (region.start.line == region.end.line) {
				return 'on line ' + region.start.line;
			}
			return 'between lines ' + region.start.line + ' and ' + region.end.line;
		}

		// TO STRING

		function toString(v) {
			var type = typeof v === 'undefined' ? 'undefined' : _typeof(v);
			if (type === 'function') {
				return '<function>';
			}

			if (type === 'boolean') {
				return v ? 'True' : 'False';
			}

			if (type === 'number') {
				return v + '';
			}

			if (v instanceof String) {
				return '\'' + addSlashes(v, true) + '\'';
			}

			if (type === 'string') {
				return '"' + addSlashes(v, false) + '"';
			}

			if (v === null) {
				return 'null';
			}

			if (type === 'object' && 'ctor' in v) {
				var ctorStarter = v.ctor.substring(0, 5);

				if (ctorStarter === '_Tupl') {
					var output = [];
					for (var k in v) {
						if (k === 'ctor') continue;
						output.push(toString(v[k]));
					}
					return '(' + output.join(',') + ')';
				}

				if (ctorStarter === '_Task') {
					return '<task>';
				}

				if (v.ctor === '_Array') {
					var list = _elm_lang$core$Array$toList(v);
					return 'Array.fromList ' + toString(list);
				}

				if (v.ctor === '<decoder>') {
					return '<decoder>';
				}

				if (v.ctor === '_Process') {
					return '<process:' + v.id + '>';
				}

				if (v.ctor === '::') {
					var output = '[' + toString(v._0);
					v = v._1;
					while (v.ctor === '::') {
						output += ',' + toString(v._0);
						v = v._1;
					}
					return output + ']';
				}

				if (v.ctor === '[]') {
					return '[]';
				}

				if (v.ctor === 'Set_elm_builtin') {
					return 'Set.fromList ' + toString(_elm_lang$core$Set$toList(v));
				}

				if (v.ctor === 'RBNode_elm_builtin' || v.ctor === 'RBEmpty_elm_builtin') {
					return 'Dict.fromList ' + toString(_elm_lang$core$Dict$toList(v));
				}

				var output = '';
				for (var i in v) {
					if (i === 'ctor') continue;
					var str = toString(v[i]);
					var c0 = str[0];
					var parenless = c0 === '{' || c0 === '(' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
					output += ' ' + (parenless ? str : '(' + str + ')');
				}
				return v.ctor + output;
			}

			if (type === 'object') {
				if (v instanceof Date) {
					return '<' + v.toString() + '>';
				}

				if (v.elm_web_socket) {
					return '<websocket>';
				}

				var output = [];
				for (var k in v) {
					output.push(k + ' = ' + toString(v[k]));
				}
				if (output.length === 0) {
					return '{}';
				}
				return '{ ' + output.join(', ') + ' }';
			}

			return '<internal structure>';
		}

		function addSlashes(str, isChar) {
			var s = str.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\r/g, '\\r').replace(/\v/g, '\\v').replace(/\0/g, '\\0');
			if (isChar) {
				return s.replace(/\'/g, '\\\'');
			} else {
				return s.replace(/\"/g, '\\"');
			}
		}

		return {
			eq: eq,
			cmp: cmp,
			Tuple0: Tuple0,
			Tuple2: Tuple2,
			chr: chr,
			update: update,
			guid: guid,

			append: F2(append),

			crash: crash,
			crashCase: crashCase,

			toString: toString
		};
	}();
	var _elm_lang$core$Basics$never = function _elm_lang$core$Basics$never(_p0) {
		never: while (true) {
			var _p1 = _p0;
			var _v1 = _p1._0;
			_p0 = _v1;
			continue never;
		}
	};
	var _elm_lang$core$Basics$uncurry = F2(function (f, _p2) {
		var _p3 = _p2;
		return A2(f, _p3._0, _p3._1);
	});
	var _elm_lang$core$Basics$curry = F3(function (f, a, b) {
		return f({ ctor: '_Tuple2', _0: a, _1: b });
	});
	var _elm_lang$core$Basics$flip = F3(function (f, b, a) {
		return A2(f, a, b);
	});
	var _elm_lang$core$Basics$always = F2(function (a, _p4) {
		return a;
	});
	var _elm_lang$core$Basics$identity = function _elm_lang$core$Basics$identity(x) {
		return x;
	};
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['<|'] = F2(function (f, x) {
		return f(x);
	});
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['|>'] = F2(function (x, f) {
		return f(x);
	});
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['>>'] = F3(function (f, g, x) {
		return g(f(x));
	});
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['<<'] = F3(function (g, f, x) {
		return g(f(x));
	});
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['++'] = _elm_lang$core$Native_Utils.append;
	var _elm_lang$core$Basics$toString = _elm_lang$core$Native_Utils.toString;
	var _elm_lang$core$Basics$isInfinite = _elm_lang$core$Native_Basics.isInfinite;
	var _elm_lang$core$Basics$isNaN = _elm_lang$core$Native_Basics.isNaN;
	var _elm_lang$core$Basics$toFloat = _elm_lang$core$Native_Basics.toFloat;
	var _elm_lang$core$Basics$ceiling = _elm_lang$core$Native_Basics.ceiling;
	var _elm_lang$core$Basics$floor = _elm_lang$core$Native_Basics.floor;
	var _elm_lang$core$Basics$truncate = _elm_lang$core$Native_Basics.truncate;
	var _elm_lang$core$Basics$round = _elm_lang$core$Native_Basics.round;
	var _elm_lang$core$Basics$not = _elm_lang$core$Native_Basics.not;
	var _elm_lang$core$Basics$xor = _elm_lang$core$Native_Basics.xor;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['||'] = _elm_lang$core$Native_Basics.or;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['&&'] = _elm_lang$core$Native_Basics.and;
	var _elm_lang$core$Basics$max = _elm_lang$core$Native_Basics.max;
	var _elm_lang$core$Basics$min = _elm_lang$core$Native_Basics.min;
	var _elm_lang$core$Basics$compare = _elm_lang$core$Native_Basics.compare;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['>='] = _elm_lang$core$Native_Basics.ge;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['<='] = _elm_lang$core$Native_Basics.le;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['>'] = _elm_lang$core$Native_Basics.gt;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['<'] = _elm_lang$core$Native_Basics.lt;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['/='] = _elm_lang$core$Native_Basics.neq;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['=='] = _elm_lang$core$Native_Basics.eq;
	var _elm_lang$core$Basics$e = _elm_lang$core$Native_Basics.e;
	var _elm_lang$core$Basics$pi = _elm_lang$core$Native_Basics.pi;
	var _elm_lang$core$Basics$clamp = _elm_lang$core$Native_Basics.clamp;
	var _elm_lang$core$Basics$logBase = _elm_lang$core$Native_Basics.logBase;
	var _elm_lang$core$Basics$abs = _elm_lang$core$Native_Basics.abs;
	var _elm_lang$core$Basics$negate = _elm_lang$core$Native_Basics.negate;
	var _elm_lang$core$Basics$sqrt = _elm_lang$core$Native_Basics.sqrt;
	var _elm_lang$core$Basics$atan2 = _elm_lang$core$Native_Basics.atan2;
	var _elm_lang$core$Basics$atan = _elm_lang$core$Native_Basics.atan;
	var _elm_lang$core$Basics$asin = _elm_lang$core$Native_Basics.asin;
	var _elm_lang$core$Basics$acos = _elm_lang$core$Native_Basics.acos;
	var _elm_lang$core$Basics$tan = _elm_lang$core$Native_Basics.tan;
	var _elm_lang$core$Basics$sin = _elm_lang$core$Native_Basics.sin;
	var _elm_lang$core$Basics$cos = _elm_lang$core$Native_Basics.cos;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['^'] = _elm_lang$core$Native_Basics.exp;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['%'] = _elm_lang$core$Native_Basics.mod;
	var _elm_lang$core$Basics$rem = _elm_lang$core$Native_Basics.rem;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['//'] = _elm_lang$core$Native_Basics.div;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['/'] = _elm_lang$core$Native_Basics.floatDiv;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['*'] = _elm_lang$core$Native_Basics.mul;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['-'] = _elm_lang$core$Native_Basics.sub;
	var _elm_lang$core$Basics_ops = _elm_lang$core$Basics_ops || {};
	_elm_lang$core$Basics_ops['+'] = _elm_lang$core$Native_Basics.add;
	var _elm_lang$core$Basics$toPolar = _elm_lang$core$Native_Basics.toPolar;
	var _elm_lang$core$Basics$fromPolar = _elm_lang$core$Native_Basics.fromPolar;
	var _elm_lang$core$Basics$turns = _elm_lang$core$Native_Basics.turns;
	var _elm_lang$core$Basics$degrees = _elm_lang$core$Native_Basics.degrees;
	var _elm_lang$core$Basics$radians = function _elm_lang$core$Basics$radians(t) {
		return t;
	};
	var _elm_lang$core$Basics$GT = { ctor: 'GT' };
	var _elm_lang$core$Basics$EQ = { ctor: 'EQ' };
	var _elm_lang$core$Basics$LT = { ctor: 'LT' };
	var _elm_lang$core$Basics$JustOneMore = function _elm_lang$core$Basics$JustOneMore(a) {
		return { ctor: 'JustOneMore', _0: a };
	};

	var _elm_lang$core$Maybe$withDefault = F2(function ($default, maybe) {
		var _p0 = maybe;
		if (_p0.ctor === 'Just') {
			return _p0._0;
		} else {
			return $default;
		}
	});
	var _elm_lang$core$Maybe$Nothing = { ctor: 'Nothing' };
	var _elm_lang$core$Maybe$andThen = F2(function (callback, maybeValue) {
		var _p1 = maybeValue;
		if (_p1.ctor === 'Just') {
			return callback(_p1._0);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
	var _elm_lang$core$Maybe$Just = function _elm_lang$core$Maybe$Just(a) {
		return { ctor: 'Just', _0: a };
	};
	var _elm_lang$core$Maybe$map = F2(function (f, maybe) {
		var _p2 = maybe;
		if (_p2.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(f(_p2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
	var _elm_lang$core$Maybe$map2 = F3(function (func, ma, mb) {
		var _p3 = { ctor: '_Tuple2', _0: ma, _1: mb };
		if (_p3.ctor === '_Tuple2' && _p3._0.ctor === 'Just' && _p3._1.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(A2(func, _p3._0._0, _p3._1._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
	var _elm_lang$core$Maybe$map3 = F4(function (func, ma, mb, mc) {
		var _p4 = { ctor: '_Tuple3', _0: ma, _1: mb, _2: mc };
		if (_p4.ctor === '_Tuple3' && _p4._0.ctor === 'Just' && _p4._1.ctor === 'Just' && _p4._2.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(A3(func, _p4._0._0, _p4._1._0, _p4._2._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
	var _elm_lang$core$Maybe$map4 = F5(function (func, ma, mb, mc, md) {
		var _p5 = { ctor: '_Tuple4', _0: ma, _1: mb, _2: mc, _3: md };
		if (_p5.ctor === '_Tuple4' && _p5._0.ctor === 'Just' && _p5._1.ctor === 'Just' && _p5._2.ctor === 'Just' && _p5._3.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(A4(func, _p5._0._0, _p5._1._0, _p5._2._0, _p5._3._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});
	var _elm_lang$core$Maybe$map5 = F6(function (func, ma, mb, mc, md, me) {
		var _p6 = { ctor: '_Tuple5', _0: ma, _1: mb, _2: mc, _3: md, _4: me };
		if (_p6.ctor === '_Tuple5' && _p6._0.ctor === 'Just' && _p6._1.ctor === 'Just' && _p6._2.ctor === 'Just' && _p6._3.ctor === 'Just' && _p6._4.ctor === 'Just') {
			return _elm_lang$core$Maybe$Just(A5(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0, _p6._4._0));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	});

	//import Native.Utils //

	var _elm_lang$core$Native_List = function () {

		var Nil = { ctor: '[]' };

		function Cons(hd, tl) {
			return { ctor: '::', _0: hd, _1: tl };
		}

		function fromArray(arr) {
			var out = Nil;
			for (var i = arr.length; i--;) {
				out = Cons(arr[i], out);
			}
			return out;
		}

		function toArray(xs) {
			var out = [];
			while (xs.ctor !== '[]') {
				out.push(xs._0);
				xs = xs._1;
			}
			return out;
		}

		function foldr(f, b, xs) {
			var arr = toArray(xs);
			var acc = b;
			for (var i = arr.length; i--;) {
				acc = A2(f, arr[i], acc);
			}
			return acc;
		}

		function map2(f, xs, ys) {
			var arr = [];
			while (xs.ctor !== '[]' && ys.ctor !== '[]') {
				arr.push(A2(f, xs._0, ys._0));
				xs = xs._1;
				ys = ys._1;
			}
			return fromArray(arr);
		}

		function map3(f, xs, ys, zs) {
			var arr = [];
			while (xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]') {
				arr.push(A3(f, xs._0, ys._0, zs._0));
				xs = xs._1;
				ys = ys._1;
				zs = zs._1;
			}
			return fromArray(arr);
		}

		function map4(f, ws, xs, ys, zs) {
			var arr = [];
			while (ws.ctor !== '[]' && xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]') {
				arr.push(A4(f, ws._0, xs._0, ys._0, zs._0));
				ws = ws._1;
				xs = xs._1;
				ys = ys._1;
				zs = zs._1;
			}
			return fromArray(arr);
		}

		function map5(f, vs, ws, xs, ys, zs) {
			var arr = [];
			while (vs.ctor !== '[]' && ws.ctor !== '[]' && xs.ctor !== '[]' && ys.ctor !== '[]' && zs.ctor !== '[]') {
				arr.push(A5(f, vs._0, ws._0, xs._0, ys._0, zs._0));
				vs = vs._1;
				ws = ws._1;
				xs = xs._1;
				ys = ys._1;
				zs = zs._1;
			}
			return fromArray(arr);
		}

		function sortBy(f, xs) {
			return fromArray(toArray(xs).sort(function (a, b) {
				return _elm_lang$core$Native_Utils.cmp(f(a), f(b));
			}));
		}

		function sortWith(f, xs) {
			return fromArray(toArray(xs).sort(function (a, b) {
				var ord = f(a)(b).ctor;
				return ord === 'EQ' ? 0 : ord === 'LT' ? -1 : 1;
			}));
		}

		return {
			Nil: Nil,
			Cons: Cons,
			cons: F2(Cons),
			toArray: toArray,
			fromArray: fromArray,

			foldr: F3(foldr),

			map2: F3(map2),
			map3: F4(map3),
			map4: F5(map4),
			map5: F6(map5),
			sortBy: F2(sortBy),
			sortWith: F2(sortWith)
		};
	}();
	var _elm_lang$core$List$sortWith = _elm_lang$core$Native_List.sortWith;
	var _elm_lang$core$List$sortBy = _elm_lang$core$Native_List.sortBy;
	var _elm_lang$core$List$sort = function _elm_lang$core$List$sort(xs) {
		return A2(_elm_lang$core$List$sortBy, _elm_lang$core$Basics$identity, xs);
	};
	var _elm_lang$core$List$singleton = function _elm_lang$core$List$singleton(value) {
		return {
			ctor: '::',
			_0: value,
			_1: { ctor: '[]' }
		};
	};
	var _elm_lang$core$List$drop = F2(function (n, list) {
		drop: while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return list;
			} else {
				var _p0 = list;
				if (_p0.ctor === '[]') {
					return list;
				} else {
					var _v1 = n - 1,
					    _v2 = _p0._1;
					n = _v1;
					list = _v2;
					continue drop;
				}
			}
		}
	});
	var _elm_lang$core$List$map5 = _elm_lang$core$Native_List.map5;
	var _elm_lang$core$List$map4 = _elm_lang$core$Native_List.map4;
	var _elm_lang$core$List$map3 = _elm_lang$core$Native_List.map3;
	var _elm_lang$core$List$map2 = _elm_lang$core$Native_List.map2;
	var _elm_lang$core$List$any = F2(function (isOkay, list) {
		any: while (true) {
			var _p1 = list;
			if (_p1.ctor === '[]') {
				return false;
			} else {
				if (isOkay(_p1._0)) {
					return true;
				} else {
					var _v4 = isOkay,
					    _v5 = _p1._1;
					isOkay = _v4;
					list = _v5;
					continue any;
				}
			}
		}
	});
	var _elm_lang$core$List$all = F2(function (isOkay, list) {
		return !A2(_elm_lang$core$List$any, function (_p2) {
			return !isOkay(_p2);
		}, list);
	});
	var _elm_lang$core$List$foldr = _elm_lang$core$Native_List.foldr;
	var _elm_lang$core$List$foldl = F3(function (func, acc, list) {
		foldl: while (true) {
			var _p3 = list;
			if (_p3.ctor === '[]') {
				return acc;
			} else {
				var _v7 = func,
				    _v8 = A2(func, _p3._0, acc),
				    _v9 = _p3._1;
				func = _v7;
				acc = _v8;
				list = _v9;
				continue foldl;
			}
		}
	});
	var _elm_lang$core$List$length = function _elm_lang$core$List$length(xs) {
		return A3(_elm_lang$core$List$foldl, F2(function (_p4, i) {
			return i + 1;
		}), 0, xs);
	};
	var _elm_lang$core$List$sum = function _elm_lang$core$List$sum(numbers) {
		return A3(_elm_lang$core$List$foldl, F2(function (x, y) {
			return x + y;
		}), 0, numbers);
	};
	var _elm_lang$core$List$product = function _elm_lang$core$List$product(numbers) {
		return A3(_elm_lang$core$List$foldl, F2(function (x, y) {
			return x * y;
		}), 1, numbers);
	};
	var _elm_lang$core$List$maximum = function _elm_lang$core$List$maximum(list) {
		var _p5 = list;
		if (_p5.ctor === '::') {
			return _elm_lang$core$Maybe$Just(A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$max, _p5._0, _p5._1));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	};
	var _elm_lang$core$List$minimum = function _elm_lang$core$List$minimum(list) {
		var _p6 = list;
		if (_p6.ctor === '::') {
			return _elm_lang$core$Maybe$Just(A3(_elm_lang$core$List$foldl, _elm_lang$core$Basics$min, _p6._0, _p6._1));
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	};
	var _elm_lang$core$List$member = F2(function (x, xs) {
		return A2(_elm_lang$core$List$any, function (a) {
			return _elm_lang$core$Native_Utils.eq(a, x);
		}, xs);
	});
	var _elm_lang$core$List$isEmpty = function _elm_lang$core$List$isEmpty(xs) {
		var _p7 = xs;
		if (_p7.ctor === '[]') {
			return true;
		} else {
			return false;
		}
	};
	var _elm_lang$core$List$tail = function _elm_lang$core$List$tail(list) {
		var _p8 = list;
		if (_p8.ctor === '::') {
			return _elm_lang$core$Maybe$Just(_p8._1);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	};
	var _elm_lang$core$List$head = function _elm_lang$core$List$head(list) {
		var _p9 = list;
		if (_p9.ctor === '::') {
			return _elm_lang$core$Maybe$Just(_p9._0);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	};
	var _elm_lang$core$List_ops = _elm_lang$core$List_ops || {};
	_elm_lang$core$List_ops['::'] = _elm_lang$core$Native_List.cons;
	var _elm_lang$core$List$map = F2(function (f, xs) {
		return A3(_elm_lang$core$List$foldr, F2(function (x, acc) {
			return {
				ctor: '::',
				_0: f(x),
				_1: acc
			};
		}), { ctor: '[]' }, xs);
	});
	var _elm_lang$core$List$filter = F2(function (pred, xs) {
		var conditionalCons = F2(function (front, back) {
			return pred(front) ? { ctor: '::', _0: front, _1: back } : back;
		});
		return A3(_elm_lang$core$List$foldr, conditionalCons, { ctor: '[]' }, xs);
	});
	var _elm_lang$core$List$maybeCons = F3(function (f, mx, xs) {
		var _p10 = f(mx);
		if (_p10.ctor === 'Just') {
			return { ctor: '::', _0: _p10._0, _1: xs };
		} else {
			return xs;
		}
	});
	var _elm_lang$core$List$filterMap = F2(function (f, xs) {
		return A3(_elm_lang$core$List$foldr, _elm_lang$core$List$maybeCons(f), { ctor: '[]' }, xs);
	});
	var _elm_lang$core$List$reverse = function _elm_lang$core$List$reverse(list) {
		return A3(_elm_lang$core$List$foldl, F2(function (x, y) {
			return { ctor: '::', _0: x, _1: y };
		}), { ctor: '[]' }, list);
	};
	var _elm_lang$core$List$scanl = F3(function (f, b, xs) {
		var scan1 = F2(function (x, accAcc) {
			var _p11 = accAcc;
			if (_p11.ctor === '::') {
				return {
					ctor: '::',
					_0: A2(f, x, _p11._0),
					_1: accAcc
				};
			} else {
				return { ctor: '[]' };
			}
		});
		return _elm_lang$core$List$reverse(A3(_elm_lang$core$List$foldl, scan1, {
			ctor: '::',
			_0: b,
			_1: { ctor: '[]' }
		}, xs));
	});
	var _elm_lang$core$List$append = F2(function (xs, ys) {
		var _p12 = ys;
		if (_p12.ctor === '[]') {
			return xs;
		} else {
			return A3(_elm_lang$core$List$foldr, F2(function (x, y) {
				return { ctor: '::', _0: x, _1: y };
			}), ys, xs);
		}
	});
	var _elm_lang$core$List$concat = function _elm_lang$core$List$concat(lists) {
		return A3(_elm_lang$core$List$foldr, _elm_lang$core$List$append, { ctor: '[]' }, lists);
	};
	var _elm_lang$core$List$concatMap = F2(function (f, list) {
		return _elm_lang$core$List$concat(A2(_elm_lang$core$List$map, f, list));
	});
	var _elm_lang$core$List$partition = F2(function (pred, list) {
		var step = F2(function (x, _p13) {
			var _p14 = _p13;
			var _p16 = _p14._0;
			var _p15 = _p14._1;
			return pred(x) ? {
				ctor: '_Tuple2',
				_0: { ctor: '::', _0: x, _1: _p16 },
				_1: _p15
			} : {
				ctor: '_Tuple2',
				_0: _p16,
				_1: { ctor: '::', _0: x, _1: _p15 }
			};
		});
		return A3(_elm_lang$core$List$foldr, step, {
			ctor: '_Tuple2',
			_0: { ctor: '[]' },
			_1: { ctor: '[]' }
		}, list);
	});
	var _elm_lang$core$List$unzip = function _elm_lang$core$List$unzip(pairs) {
		var step = F2(function (_p18, _p17) {
			var _p19 = _p18;
			var _p20 = _p17;
			return {
				ctor: '_Tuple2',
				_0: { ctor: '::', _0: _p19._0, _1: _p20._0 },
				_1: { ctor: '::', _0: _p19._1, _1: _p20._1 }
			};
		});
		return A3(_elm_lang$core$List$foldr, step, {
			ctor: '_Tuple2',
			_0: { ctor: '[]' },
			_1: { ctor: '[]' }
		}, pairs);
	};
	var _elm_lang$core$List$intersperse = F2(function (sep, xs) {
		var _p21 = xs;
		if (_p21.ctor === '[]') {
			return { ctor: '[]' };
		} else {
			var step = F2(function (x, rest) {
				return {
					ctor: '::',
					_0: sep,
					_1: { ctor: '::', _0: x, _1: rest }
				};
			});
			var spersed = A3(_elm_lang$core$List$foldr, step, { ctor: '[]' }, _p21._1);
			return { ctor: '::', _0: _p21._0, _1: spersed };
		}
	});
	var _elm_lang$core$List$takeReverse = F3(function (n, list, taken) {
		takeReverse: while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return taken;
			} else {
				var _p22 = list;
				if (_p22.ctor === '[]') {
					return taken;
				} else {
					var _v23 = n - 1,
					    _v24 = _p22._1,
					    _v25 = { ctor: '::', _0: _p22._0, _1: taken };
					n = _v23;
					list = _v24;
					taken = _v25;
					continue takeReverse;
				}
			}
		}
	});
	var _elm_lang$core$List$takeTailRec = F2(function (n, list) {
		return _elm_lang$core$List$reverse(A3(_elm_lang$core$List$takeReverse, n, list, { ctor: '[]' }));
	});
	var _elm_lang$core$List$takeFast = F3(function (ctr, n, list) {
		if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
			return { ctor: '[]' };
		} else {
			var _p23 = { ctor: '_Tuple2', _0: n, _1: list };
			_v26_5: do {
				_v26_1: do {
					if (_p23.ctor === '_Tuple2') {
						if (_p23._1.ctor === '[]') {
							return list;
						} else {
							if (_p23._1._1.ctor === '::') {
								switch (_p23._0) {
									case 1:
										break _v26_1;
									case 2:
										return {
											ctor: '::',
											_0: _p23._1._0,
											_1: {
												ctor: '::',
												_0: _p23._1._1._0,
												_1: { ctor: '[]' }
											}
										};
									case 3:
										if (_p23._1._1._1.ctor === '::') {
											return {
												ctor: '::',
												_0: _p23._1._0,
												_1: {
													ctor: '::',
													_0: _p23._1._1._0,
													_1: {
														ctor: '::',
														_0: _p23._1._1._1._0,
														_1: { ctor: '[]' }
													}
												}
											};
										} else {
											break _v26_5;
										}
									default:
										if (_p23._1._1._1.ctor === '::' && _p23._1._1._1._1.ctor === '::') {
											var _p28 = _p23._1._1._1._0;
											var _p27 = _p23._1._1._0;
											var _p26 = _p23._1._0;
											var _p25 = _p23._1._1._1._1._0;
											var _p24 = _p23._1._1._1._1._1;
											return _elm_lang$core$Native_Utils.cmp(ctr, 1000) > 0 ? {
												ctor: '::',
												_0: _p26,
												_1: {
													ctor: '::',
													_0: _p27,
													_1: {
														ctor: '::',
														_0: _p28,
														_1: {
															ctor: '::',
															_0: _p25,
															_1: A2(_elm_lang$core$List$takeTailRec, n - 4, _p24)
														}
													}
												}
											} : {
												ctor: '::',
												_0: _p26,
												_1: {
													ctor: '::',
													_0: _p27,
													_1: {
														ctor: '::',
														_0: _p28,
														_1: {
															ctor: '::',
															_0: _p25,
															_1: A3(_elm_lang$core$List$takeFast, ctr + 1, n - 4, _p24)
														}
													}
												}
											};
										} else {
											break _v26_5;
										}
								}
							} else {
								if (_p23._0 === 1) {
									break _v26_1;
								} else {
									break _v26_5;
								}
							}
						}
					} else {
						break _v26_5;
					}
				} while (false);
				return {
					ctor: '::',
					_0: _p23._1._0,
					_1: { ctor: '[]' }
				};
			} while (false);
			return list;
		}
	});
	var _elm_lang$core$List$take = F2(function (n, list) {
		return A3(_elm_lang$core$List$takeFast, 0, n, list);
	});
	var _elm_lang$core$List$repeatHelp = F3(function (result, n, value) {
		repeatHelp: while (true) {
			if (_elm_lang$core$Native_Utils.cmp(n, 0) < 1) {
				return result;
			} else {
				var _v27 = { ctor: '::', _0: value, _1: result },
				    _v28 = n - 1,
				    _v29 = value;
				result = _v27;
				n = _v28;
				value = _v29;
				continue repeatHelp;
			}
		}
	});
	var _elm_lang$core$List$repeat = F2(function (n, value) {
		return A3(_elm_lang$core$List$repeatHelp, { ctor: '[]' }, n, value);
	});
	var _elm_lang$core$List$rangeHelp = F3(function (lo, hi, list) {
		rangeHelp: while (true) {
			if (_elm_lang$core$Native_Utils.cmp(lo, hi) < 1) {
				var _v30 = lo,
				    _v31 = hi - 1,
				    _v32 = { ctor: '::', _0: hi, _1: list };
				lo = _v30;
				hi = _v31;
				list = _v32;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
	var _elm_lang$core$List$range = F2(function (lo, hi) {
		return A3(_elm_lang$core$List$rangeHelp, lo, hi, { ctor: '[]' });
	});
	var _elm_lang$core$List$indexedMap = F2(function (f, xs) {
		return A3(_elm_lang$core$List$map2, f, A2(_elm_lang$core$List$range, 0, _elm_lang$core$List$length(xs) - 1), xs);
	});

	var _elm_lang$core$Array$append = _elm_lang$core$Native_Array.append;
	var _elm_lang$core$Array$length = _elm_lang$core$Native_Array.length;
	var _elm_lang$core$Array$isEmpty = function _elm_lang$core$Array$isEmpty(array) {
		return _elm_lang$core$Native_Utils.eq(_elm_lang$core$Array$length(array), 0);
	};
	var _elm_lang$core$Array$slice = _elm_lang$core$Native_Array.slice;
	var _elm_lang$core$Array$set = _elm_lang$core$Native_Array.set;
	var _elm_lang$core$Array$get = F2(function (i, array) {
		return _elm_lang$core$Native_Utils.cmp(0, i) < 1 && _elm_lang$core$Native_Utils.cmp(i, _elm_lang$core$Native_Array.length(array)) < 0 ? _elm_lang$core$Maybe$Just(A2(_elm_lang$core$Native_Array.get, i, array)) : _elm_lang$core$Maybe$Nothing;
	});
	var _elm_lang$core$Array$push = _elm_lang$core$Native_Array.push;
	var _elm_lang$core$Array$empty = _elm_lang$core$Native_Array.empty;
	var _elm_lang$core$Array$filter = F2(function (isOkay, arr) {
		var update = F2(function (x, xs) {
			return isOkay(x) ? A2(_elm_lang$core$Native_Array.push, x, xs) : xs;
		});
		return A3(_elm_lang$core$Native_Array.foldl, update, _elm_lang$core$Native_Array.empty, arr);
	});
	var _elm_lang$core$Array$foldr = _elm_lang$core$Native_Array.foldr;
	var _elm_lang$core$Array$foldl = _elm_lang$core$Native_Array.foldl;
	var _elm_lang$core$Array$indexedMap = _elm_lang$core$Native_Array.indexedMap;
	var _elm_lang$core$Array$map = _elm_lang$core$Native_Array.map;
	var _elm_lang$core$Array$toIndexedList = function _elm_lang$core$Array$toIndexedList(array) {
		return A3(_elm_lang$core$List$map2, F2(function (v0, v1) {
			return { ctor: '_Tuple2', _0: v0, _1: v1 };
		}), A2(_elm_lang$core$List$range, 0, _elm_lang$core$Native_Array.length(array) - 1), _elm_lang$core$Native_Array.toList(array));
	};
	var _elm_lang$core$Array$toList = _elm_lang$core$Native_Array.toList;
	var _elm_lang$core$Array$fromList = _elm_lang$core$Native_Array.fromList;
	var _elm_lang$core$Array$initialize = _elm_lang$core$Native_Array.initialize;
	var _elm_lang$core$Array$repeat = F2(function (n, e) {
		return A2(_elm_lang$core$Array$initialize, n, _elm_lang$core$Basics$always(e));
	});
	var _elm_lang$core$Array$Array = { ctor: 'Array' };

	//import Native.Utils //

	var _elm_lang$core$Native_Char = function () {

		return {
			fromCode: function fromCode(c) {
				return _elm_lang$core$Native_Utils.chr(String.fromCharCode(c));
			},
			toCode: function toCode(c) {
				return c.charCodeAt(0);
			},
			toUpper: function toUpper(c) {
				return _elm_lang$core$Native_Utils.chr(c.toUpperCase());
			},
			toLower: function toLower(c) {
				return _elm_lang$core$Native_Utils.chr(c.toLowerCase());
			},
			toLocaleUpper: function toLocaleUpper(c) {
				return _elm_lang$core$Native_Utils.chr(c.toLocaleUpperCase());
			},
			toLocaleLower: function toLocaleLower(c) {
				return _elm_lang$core$Native_Utils.chr(c.toLocaleLowerCase());
			}
		};
	}();
	var _elm_lang$core$Char$fromCode = _elm_lang$core$Native_Char.fromCode;
	var _elm_lang$core$Char$toCode = _elm_lang$core$Native_Char.toCode;
	var _elm_lang$core$Char$toLocaleLower = _elm_lang$core$Native_Char.toLocaleLower;
	var _elm_lang$core$Char$toLocaleUpper = _elm_lang$core$Native_Char.toLocaleUpper;
	var _elm_lang$core$Char$toLower = _elm_lang$core$Native_Char.toLower;
	var _elm_lang$core$Char$toUpper = _elm_lang$core$Native_Char.toUpper;
	var _elm_lang$core$Char$isBetween = F3(function (low, high, $char) {
		var code = _elm_lang$core$Char$toCode($char);
		return _elm_lang$core$Native_Utils.cmp(code, _elm_lang$core$Char$toCode(low)) > -1 && _elm_lang$core$Native_Utils.cmp(code, _elm_lang$core$Char$toCode(high)) < 1;
	});
	var _elm_lang$core$Char$isUpper = A2(_elm_lang$core$Char$isBetween, _elm_lang$core$Native_Utils.chr('A'), _elm_lang$core$Native_Utils.chr('Z'));
	var _elm_lang$core$Char$isLower = A2(_elm_lang$core$Char$isBetween, _elm_lang$core$Native_Utils.chr('a'), _elm_lang$core$Native_Utils.chr('z'));
	var _elm_lang$core$Char$isDigit = A2(_elm_lang$core$Char$isBetween, _elm_lang$core$Native_Utils.chr('0'), _elm_lang$core$Native_Utils.chr('9'));
	var _elm_lang$core$Char$isOctDigit = A2(_elm_lang$core$Char$isBetween, _elm_lang$core$Native_Utils.chr('0'), _elm_lang$core$Native_Utils.chr('7'));
	var _elm_lang$core$Char$isHexDigit = function _elm_lang$core$Char$isHexDigit($char) {
		return _elm_lang$core$Char$isDigit($char) || A3(_elm_lang$core$Char$isBetween, _elm_lang$core$Native_Utils.chr('a'), _elm_lang$core$Native_Utils.chr('f'), $char) || A3(_elm_lang$core$Char$isBetween, _elm_lang$core$Native_Utils.chr('A'), _elm_lang$core$Native_Utils.chr('F'), $char);
	};

	//import Native.Utils //

	var _elm_lang$core$Native_Scheduler = function () {

		var MAX_STEPS = 10000;

		// TASKS

		function succeed(value) {
			return {
				ctor: '_Task_succeed',
				value: value
			};
		}

		function fail(error) {
			return {
				ctor: '_Task_fail',
				value: error
			};
		}

		function nativeBinding(callback) {
			return {
				ctor: '_Task_nativeBinding',
				callback: callback,
				cancel: null
			};
		}

		function andThen(callback, task) {
			return {
				ctor: '_Task_andThen',
				callback: callback,
				task: task
			};
		}

		function onError(callback, task) {
			return {
				ctor: '_Task_onError',
				callback: callback,
				task: task
			};
		}

		function receive(callback) {
			return {
				ctor: '_Task_receive',
				callback: callback
			};
		}

		// PROCESSES

		function rawSpawn(task) {
			var process = {
				ctor: '_Process',
				id: _elm_lang$core$Native_Utils.guid(),
				root: task,
				stack: null,
				mailbox: []
			};

			enqueue(process);

			return process;
		}

		function spawn(task) {
			return nativeBinding(function (callback) {
				var process = rawSpawn(task);
				callback(succeed(process));
			});
		}

		function rawSend(process, msg) {
			process.mailbox.push(msg);
			enqueue(process);
		}

		function send(process, msg) {
			return nativeBinding(function (callback) {
				rawSend(process, msg);
				callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
			});
		}

		function kill(process) {
			return nativeBinding(function (callback) {
				var root = process.root;
				if (root.ctor === '_Task_nativeBinding' && root.cancel) {
					root.cancel();
				}

				process.root = null;

				callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
			});
		}

		function sleep(time) {
			return nativeBinding(function (callback) {
				var id = setTimeout(function () {
					callback(succeed(_elm_lang$core$Native_Utils.Tuple0));
				}, time);

				return function () {
					clearTimeout(id);
				};
			});
		}

		// STEP PROCESSES

		function step(numSteps, process) {
			while (numSteps < MAX_STEPS) {
				var ctor = process.root.ctor;

				if (ctor === '_Task_succeed') {
					while (process.stack && process.stack.ctor === '_Task_onError') {
						process.stack = process.stack.rest;
					}
					if (process.stack === null) {
						break;
					}
					process.root = process.stack.callback(process.root.value);
					process.stack = process.stack.rest;
					++numSteps;
					continue;
				}

				if (ctor === '_Task_fail') {
					while (process.stack && process.stack.ctor === '_Task_andThen') {
						process.stack = process.stack.rest;
					}
					if (process.stack === null) {
						break;
					}
					process.root = process.stack.callback(process.root.value);
					process.stack = process.stack.rest;
					++numSteps;
					continue;
				}

				if (ctor === '_Task_andThen') {
					process.stack = {
						ctor: '_Task_andThen',
						callback: process.root.callback,
						rest: process.stack
					};
					process.root = process.root.task;
					++numSteps;
					continue;
				}

				if (ctor === '_Task_onError') {
					process.stack = {
						ctor: '_Task_onError',
						callback: process.root.callback,
						rest: process.stack
					};
					process.root = process.root.task;
					++numSteps;
					continue;
				}

				if (ctor === '_Task_nativeBinding') {
					process.root.cancel = process.root.callback(function (newRoot) {
						process.root = newRoot;
						enqueue(process);
					});

					break;
				}

				if (ctor === '_Task_receive') {
					var mailbox = process.mailbox;
					if (mailbox.length === 0) {
						break;
					}

					process.root = process.root.callback(mailbox.shift());
					++numSteps;
					continue;
				}

				throw new Error(ctor);
			}

			if (numSteps < MAX_STEPS) {
				return numSteps + 1;
			}
			enqueue(process);

			return numSteps;
		}

		// WORK QUEUE

		var working = false;
		var workQueue = [];

		function enqueue(process) {
			workQueue.push(process);

			if (!working) {
				setTimeout(work, 0);
				working = true;
			}
		}

		function work() {
			var numSteps = 0;
			var process;
			while (numSteps < MAX_STEPS && (process = workQueue.shift())) {
				if (process.root) {
					numSteps = step(numSteps, process);
				}
			}
			if (!process) {
				working = false;
				return;
			}
			setTimeout(work, 0);
		}

		return {
			succeed: succeed,
			fail: fail,
			nativeBinding: nativeBinding,
			andThen: F2(andThen),
			onError: F2(onError),
			receive: receive,

			spawn: spawn,
			kill: kill,
			sleep: sleep,
			send: F2(send),

			rawSpawn: rawSpawn,
			rawSend: rawSend
		};
	}();
	//import //

	var _elm_lang$core$Native_Platform = function () {

		// PROGRAMS

		function program(impl) {
			return function (flagDecoder) {
				return function (object, moduleName) {
					object['worker'] = function worker(flags) {
						if (typeof flags !== 'undefined') {
							throw new Error('The `' + moduleName + '` module does not need flags.\n' + 'Call ' + moduleName + '.worker() with no arguments and you should be all set!');
						}

						return initialize(impl.init, impl.update, impl.subscriptions, renderer);
					};
				};
			};
		}

		function programWithFlags(impl) {
			return function (flagDecoder) {
				return function (object, moduleName) {
					object['worker'] = function worker(flags) {
						if (typeof flagDecoder === 'undefined') {
							throw new Error('Are you trying to sneak a Never value into Elm? Trickster!\n' + 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n' + 'Use `program` instead if you do not want flags.');
						}

						var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
						if (result.ctor === 'Err') {
							throw new Error(moduleName + '.worker(...) was called with an unexpected argument.\n' + 'I tried to convert it to an Elm value, but ran into this problem:\n\n' + result._0);
						}

						return initialize(impl.init(result._0), impl.update, impl.subscriptions, renderer);
					};
				};
			};
		}

		function renderer(enqueue, _) {
			return function (_) {};
		}

		// HTML TO PROGRAM

		function htmlToProgram(vnode) {
			var emptyBag = batch(_elm_lang$core$Native_List.Nil);
			var noChange = _elm_lang$core$Native_Utils.Tuple2(_elm_lang$core$Native_Utils.Tuple0, emptyBag);

			return _elm_lang$virtual_dom$VirtualDom$program({
				init: noChange,
				view: function view(model) {
					return main;
				},
				update: F2(function (msg, model) {
					return noChange;
				}),
				subscriptions: function subscriptions(model) {
					return emptyBag;
				}
			});
		}

		// INITIALIZE A PROGRAM

		function initialize(init, update, subscriptions, renderer) {
			// ambient state
			var managers = {};
			var updateView;

			// init and update state in main process
			var initApp = _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
				var model = init._0;
				updateView = renderer(enqueue, model);
				var cmds = init._1;
				var subs = subscriptions(model);
				dispatchEffects(managers, cmds, subs);
				callback(_elm_lang$core$Native_Scheduler.succeed(model));
			});

			function onMessage(msg, model) {
				return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
					var results = A2(update, msg, model);
					model = results._0;
					updateView(model);
					var cmds = results._1;
					var subs = subscriptions(model);
					dispatchEffects(managers, cmds, subs);
					callback(_elm_lang$core$Native_Scheduler.succeed(model));
				});
			}

			var mainProcess = spawnLoop(initApp, onMessage);

			function enqueue(msg) {
				_elm_lang$core$Native_Scheduler.rawSend(mainProcess, msg);
			}

			var ports = setupEffects(managers, enqueue);

			return ports ? { ports: ports } : {};
		}

		// EFFECT MANAGERS

		var effectManagers = {};

		function setupEffects(managers, callback) {
			var ports;

			// setup all necessary effect managers
			for (var key in effectManagers) {
				var manager = effectManagers[key];

				if (manager.isForeign) {
					ports = ports || {};
					ports[key] = manager.tag === 'cmd' ? setupOutgoingPort(key) : setupIncomingPort(key, callback);
				}

				managers[key] = makeManager(manager, callback);
			}

			return ports;
		}

		function makeManager(info, callback) {
			var router = {
				main: callback,
				self: undefined
			};

			var tag = info.tag;
			var onEffects = info.onEffects;
			var onSelfMsg = info.onSelfMsg;

			function onMessage(msg, state) {
				if (msg.ctor === 'self') {
					return A3(onSelfMsg, router, msg._0, state);
				}

				var fx = msg._0;
				switch (tag) {
					case 'cmd':
						return A3(onEffects, router, fx.cmds, state);

					case 'sub':
						return A3(onEffects, router, fx.subs, state);

					case 'fx':
						return A4(onEffects, router, fx.cmds, fx.subs, state);
				}
			}

			var process = spawnLoop(info.init, onMessage);
			router.self = process;
			return process;
		}

		function sendToApp(router, msg) {
			return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
				router.main(msg);
				callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
			});
		}

		function sendToSelf(router, msg) {
			return A2(_elm_lang$core$Native_Scheduler.send, router.self, {
				ctor: 'self',
				_0: msg
			});
		}

		// HELPER for STATEFUL LOOPS

		function spawnLoop(init, onMessage) {
			var andThen = _elm_lang$core$Native_Scheduler.andThen;

			function loop(state) {
				var handleMsg = _elm_lang$core$Native_Scheduler.receive(function (msg) {
					return onMessage(msg, state);
				});
				return A2(andThen, loop, handleMsg);
			}

			var task = A2(andThen, loop, init);

			return _elm_lang$core$Native_Scheduler.rawSpawn(task);
		}

		// BAGS

		function leaf(home) {
			return function (value) {
				return {
					type: 'leaf',
					home: home,
					value: value
				};
			};
		}

		function batch(list) {
			return {
				type: 'node',
				branches: list
			};
		}

		function map(tagger, bag) {
			return {
				type: 'map',
				tagger: tagger,
				tree: bag
			};
		}

		// PIPE BAGS INTO EFFECT MANAGERS

		function dispatchEffects(managers, cmdBag, subBag) {
			var effectsDict = {};
			gatherEffects(true, cmdBag, effectsDict, null);
			gatherEffects(false, subBag, effectsDict, null);

			for (var home in managers) {
				var fx = home in effectsDict ? effectsDict[home] : {
					cmds: _elm_lang$core$Native_List.Nil,
					subs: _elm_lang$core$Native_List.Nil
				};

				_elm_lang$core$Native_Scheduler.rawSend(managers[home], { ctor: 'fx', _0: fx });
			}
		}

		function gatherEffects(isCmd, bag, effectsDict, taggers) {
			switch (bag.type) {
				case 'leaf':
					var home = bag.home;
					var effect = toEffect(isCmd, home, taggers, bag.value);
					effectsDict[home] = insert(isCmd, effect, effectsDict[home]);
					return;

				case 'node':
					var list = bag.branches;
					while (list.ctor !== '[]') {
						gatherEffects(isCmd, list._0, effectsDict, taggers);
						list = list._1;
					}
					return;

				case 'map':
					gatherEffects(isCmd, bag.tree, effectsDict, {
						tagger: bag.tagger,
						rest: taggers
					});
					return;
			}
		}

		function toEffect(isCmd, home, taggers, value) {
			function applyTaggers(x) {
				var temp = taggers;
				while (temp) {
					x = temp.tagger(x);
					temp = temp.rest;
				}
				return x;
			}

			var map = isCmd ? effectManagers[home].cmdMap : effectManagers[home].subMap;

			return A2(map, applyTaggers, value);
		}

		function insert(isCmd, newEffect, effects) {
			effects = effects || {
				cmds: _elm_lang$core$Native_List.Nil,
				subs: _elm_lang$core$Native_List.Nil
			};
			if (isCmd) {
				effects.cmds = _elm_lang$core$Native_List.Cons(newEffect, effects.cmds);
				return effects;
			}
			effects.subs = _elm_lang$core$Native_List.Cons(newEffect, effects.subs);
			return effects;
		}

		// PORTS

		function checkPortName(name) {
			if (name in effectManagers) {
				throw new Error('There can only be one port named `' + name + '`, but your program has multiple.');
			}
		}

		// OUTGOING PORTS

		function outgoingPort(name, converter) {
			checkPortName(name);
			effectManagers[name] = {
				tag: 'cmd',
				cmdMap: outgoingPortMap,
				converter: converter,
				isForeign: true
			};
			return leaf(name);
		}

		var outgoingPortMap = F2(function cmdMap(tagger, value) {
			return value;
		});

		function setupOutgoingPort(name) {
			var subs = [];
			var converter = effectManagers[name].converter;

			// CREATE MANAGER

			var init = _elm_lang$core$Native_Scheduler.succeed(null);

			function onEffects(router, cmdList, state) {
				while (cmdList.ctor !== '[]') {
					// grab a separate reference to subs in case unsubscribe is called
					var currentSubs = subs;
					var value = converter(cmdList._0);
					for (var i = 0; i < currentSubs.length; i++) {
						currentSubs[i](value);
					}
					cmdList = cmdList._1;
				}
				return init;
			}

			effectManagers[name].init = init;
			effectManagers[name].onEffects = F3(onEffects);

			// PUBLIC API

			function subscribe(callback) {
				subs.push(callback);
			}

			function unsubscribe(callback) {
				// copy subs into a new array in case unsubscribe is called within a
				// subscribed callback
				subs = subs.slice();
				var index = subs.indexOf(callback);
				if (index >= 0) {
					subs.splice(index, 1);
				}
			}

			return {
				subscribe: subscribe,
				unsubscribe: unsubscribe
			};
		}

		// INCOMING PORTS

		function incomingPort(name, converter) {
			checkPortName(name);
			effectManagers[name] = {
				tag: 'sub',
				subMap: incomingPortMap,
				converter: converter,
				isForeign: true
			};
			return leaf(name);
		}

		var incomingPortMap = F2(function subMap(tagger, finalTagger) {
			return function (value) {
				return tagger(finalTagger(value));
			};
		});

		function setupIncomingPort(name, callback) {
			var sentBeforeInit = [];
			var subs = _elm_lang$core$Native_List.Nil;
			var converter = effectManagers[name].converter;
			var currentOnEffects = preInitOnEffects;
			var currentSend = preInitSend;

			// CREATE MANAGER

			var init = _elm_lang$core$Native_Scheduler.succeed(null);

			function preInitOnEffects(router, subList, state) {
				var postInitResult = postInitOnEffects(router, subList, state);

				for (var i = 0; i < sentBeforeInit.length; i++) {
					postInitSend(sentBeforeInit[i]);
				}

				sentBeforeInit = null; // to release objects held in queue
				currentSend = postInitSend;
				currentOnEffects = postInitOnEffects;
				return postInitResult;
			}

			function postInitOnEffects(router, subList, state) {
				subs = subList;
				return init;
			}

			function onEffects(router, subList, state) {
				return currentOnEffects(router, subList, state);
			}

			effectManagers[name].init = init;
			effectManagers[name].onEffects = F3(onEffects);

			// PUBLIC API

			function preInitSend(value) {
				sentBeforeInit.push(value);
			}

			function postInitSend(value) {
				var temp = subs;
				while (temp.ctor !== '[]') {
					callback(temp._0(value));
					temp = temp._1;
				}
			}

			function send(incomingValue) {
				var result = A2(_elm_lang$core$Json_Decode$decodeValue, converter, incomingValue);
				if (result.ctor === 'Err') {
					throw new Error('Trying to send an unexpected type of value through port `' + name + '`:\n' + result._0);
				}

				currentSend(result._0);
			}

			return { send: send };
		}

		return {
			// routers
			sendToApp: F2(sendToApp),
			sendToSelf: F2(sendToSelf),

			// global setup
			effectManagers: effectManagers,
			outgoingPort: outgoingPort,
			incomingPort: incomingPort,

			htmlToProgram: htmlToProgram,
			program: program,
			programWithFlags: programWithFlags,
			initialize: initialize,

			// effect bags
			leaf: leaf,
			batch: batch,
			map: F2(map)
		};
	}();

	var _elm_lang$core$Platform_Cmd$batch = _elm_lang$core$Native_Platform.batch;
	var _elm_lang$core$Platform_Cmd$none = _elm_lang$core$Platform_Cmd$batch({ ctor: '[]' });
	var _elm_lang$core$Platform_Cmd_ops = _elm_lang$core$Platform_Cmd_ops || {};
	_elm_lang$core$Platform_Cmd_ops['!'] = F2(function (model, commands) {
		return {
			ctor: '_Tuple2',
			_0: model,
			_1: _elm_lang$core$Platform_Cmd$batch(commands)
		};
	});
	var _elm_lang$core$Platform_Cmd$map = _elm_lang$core$Native_Platform.map;
	var _elm_lang$core$Platform_Cmd$Cmd = { ctor: 'Cmd' };

	var _elm_lang$core$Platform_Sub$batch = _elm_lang$core$Native_Platform.batch;
	var _elm_lang$core$Platform_Sub$none = _elm_lang$core$Platform_Sub$batch({ ctor: '[]' });
	var _elm_lang$core$Platform_Sub$map = _elm_lang$core$Native_Platform.map;
	var _elm_lang$core$Platform_Sub$Sub = { ctor: 'Sub' };

	var _elm_lang$core$Platform$hack = _elm_lang$core$Native_Scheduler.succeed;
	var _elm_lang$core$Platform$sendToSelf = _elm_lang$core$Native_Platform.sendToSelf;
	var _elm_lang$core$Platform$sendToApp = _elm_lang$core$Native_Platform.sendToApp;
	var _elm_lang$core$Platform$programWithFlags = _elm_lang$core$Native_Platform.programWithFlags;
	var _elm_lang$core$Platform$program = _elm_lang$core$Native_Platform.program;
	var _elm_lang$core$Platform$Program = { ctor: 'Program' };
	var _elm_lang$core$Platform$Task = { ctor: 'Task' };
	var _elm_lang$core$Platform$ProcessId = { ctor: 'ProcessId' };
	var _elm_lang$core$Platform$Router = { ctor: 'Router' };

	var _elm_lang$core$Result$toMaybe = function _elm_lang$core$Result$toMaybe(result) {
		var _p0 = result;
		if (_p0.ctor === 'Ok') {
			return _elm_lang$core$Maybe$Just(_p0._0);
		} else {
			return _elm_lang$core$Maybe$Nothing;
		}
	};
	var _elm_lang$core$Result$withDefault = F2(function (def, result) {
		var _p1 = result;
		if (_p1.ctor === 'Ok') {
			return _p1._0;
		} else {
			return def;
		}
	});
	var _elm_lang$core$Result$Err = function _elm_lang$core$Result$Err(a) {
		return { ctor: 'Err', _0: a };
	};
	var _elm_lang$core$Result$andThen = F2(function (callback, result) {
		var _p2 = result;
		if (_p2.ctor === 'Ok') {
			return callback(_p2._0);
		} else {
			return _elm_lang$core$Result$Err(_p2._0);
		}
	});
	var _elm_lang$core$Result$Ok = function _elm_lang$core$Result$Ok(a) {
		return { ctor: 'Ok', _0: a };
	};
	var _elm_lang$core$Result$map = F2(function (func, ra) {
		var _p3 = ra;
		if (_p3.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(func(_p3._0));
		} else {
			return _elm_lang$core$Result$Err(_p3._0);
		}
	});
	var _elm_lang$core$Result$map2 = F3(function (func, ra, rb) {
		var _p4 = { ctor: '_Tuple2', _0: ra, _1: rb };
		if (_p4._0.ctor === 'Ok') {
			if (_p4._1.ctor === 'Ok') {
				return _elm_lang$core$Result$Ok(A2(func, _p4._0._0, _p4._1._0));
			} else {
				return _elm_lang$core$Result$Err(_p4._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p4._0._0);
		}
	});
	var _elm_lang$core$Result$map3 = F4(function (func, ra, rb, rc) {
		var _p5 = { ctor: '_Tuple3', _0: ra, _1: rb, _2: rc };
		if (_p5._0.ctor === 'Ok') {
			if (_p5._1.ctor === 'Ok') {
				if (_p5._2.ctor === 'Ok') {
					return _elm_lang$core$Result$Ok(A3(func, _p5._0._0, _p5._1._0, _p5._2._0));
				} else {
					return _elm_lang$core$Result$Err(_p5._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p5._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p5._0._0);
		}
	});
	var _elm_lang$core$Result$map4 = F5(function (func, ra, rb, rc, rd) {
		var _p6 = { ctor: '_Tuple4', _0: ra, _1: rb, _2: rc, _3: rd };
		if (_p6._0.ctor === 'Ok') {
			if (_p6._1.ctor === 'Ok') {
				if (_p6._2.ctor === 'Ok') {
					if (_p6._3.ctor === 'Ok') {
						return _elm_lang$core$Result$Ok(A4(func, _p6._0._0, _p6._1._0, _p6._2._0, _p6._3._0));
					} else {
						return _elm_lang$core$Result$Err(_p6._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p6._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p6._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p6._0._0);
		}
	});
	var _elm_lang$core$Result$map5 = F6(function (func, ra, rb, rc, rd, re) {
		var _p7 = { ctor: '_Tuple5', _0: ra, _1: rb, _2: rc, _3: rd, _4: re };
		if (_p7._0.ctor === 'Ok') {
			if (_p7._1.ctor === 'Ok') {
				if (_p7._2.ctor === 'Ok') {
					if (_p7._3.ctor === 'Ok') {
						if (_p7._4.ctor === 'Ok') {
							return _elm_lang$core$Result$Ok(A5(func, _p7._0._0, _p7._1._0, _p7._2._0, _p7._3._0, _p7._4._0));
						} else {
							return _elm_lang$core$Result$Err(_p7._4._0);
						}
					} else {
						return _elm_lang$core$Result$Err(_p7._3._0);
					}
				} else {
					return _elm_lang$core$Result$Err(_p7._2._0);
				}
			} else {
				return _elm_lang$core$Result$Err(_p7._1._0);
			}
		} else {
			return _elm_lang$core$Result$Err(_p7._0._0);
		}
	});
	var _elm_lang$core$Result$mapError = F2(function (f, result) {
		var _p8 = result;
		if (_p8.ctor === 'Ok') {
			return _elm_lang$core$Result$Ok(_p8._0);
		} else {
			return _elm_lang$core$Result$Err(f(_p8._0));
		}
	});
	var _elm_lang$core$Result$fromMaybe = F2(function (err, maybe) {
		var _p9 = maybe;
		if (_p9.ctor === 'Just') {
			return _elm_lang$core$Result$Ok(_p9._0);
		} else {
			return _elm_lang$core$Result$Err(err);
		}
	});

	var _elm_lang$core$Task$onError = _elm_lang$core$Native_Scheduler.onError;
	var _elm_lang$core$Task$andThen = _elm_lang$core$Native_Scheduler.andThen;
	var _elm_lang$core$Task$spawnCmd = F2(function (router, _p0) {
		var _p1 = _p0;
		return _elm_lang$core$Native_Scheduler.spawn(A2(_elm_lang$core$Task$andThen, _elm_lang$core$Platform$sendToApp(router), _p1._0));
	});
	var _elm_lang$core$Task$fail = _elm_lang$core$Native_Scheduler.fail;
	var _elm_lang$core$Task$mapError = F2(function (convert, task) {
		return A2(_elm_lang$core$Task$onError, function (_p2) {
			return _elm_lang$core$Task$fail(convert(_p2));
		}, task);
	});
	var _elm_lang$core$Task$succeed = _elm_lang$core$Native_Scheduler.succeed;
	var _elm_lang$core$Task$map = F2(function (func, taskA) {
		return A2(_elm_lang$core$Task$andThen, function (a) {
			return _elm_lang$core$Task$succeed(func(a));
		}, taskA);
	});
	var _elm_lang$core$Task$map2 = F3(function (func, taskA, taskB) {
		return A2(_elm_lang$core$Task$andThen, function (a) {
			return A2(_elm_lang$core$Task$andThen, function (b) {
				return _elm_lang$core$Task$succeed(A2(func, a, b));
			}, taskB);
		}, taskA);
	});
	var _elm_lang$core$Task$map3 = F4(function (func, taskA, taskB, taskC) {
		return A2(_elm_lang$core$Task$andThen, function (a) {
			return A2(_elm_lang$core$Task$andThen, function (b) {
				return A2(_elm_lang$core$Task$andThen, function (c) {
					return _elm_lang$core$Task$succeed(A3(func, a, b, c));
				}, taskC);
			}, taskB);
		}, taskA);
	});
	var _elm_lang$core$Task$map4 = F5(function (func, taskA, taskB, taskC, taskD) {
		return A2(_elm_lang$core$Task$andThen, function (a) {
			return A2(_elm_lang$core$Task$andThen, function (b) {
				return A2(_elm_lang$core$Task$andThen, function (c) {
					return A2(_elm_lang$core$Task$andThen, function (d) {
						return _elm_lang$core$Task$succeed(A4(func, a, b, c, d));
					}, taskD);
				}, taskC);
			}, taskB);
		}, taskA);
	});
	var _elm_lang$core$Task$map5 = F6(function (func, taskA, taskB, taskC, taskD, taskE) {
		return A2(_elm_lang$core$Task$andThen, function (a) {
			return A2(_elm_lang$core$Task$andThen, function (b) {
				return A2(_elm_lang$core$Task$andThen, function (c) {
					return A2(_elm_lang$core$Task$andThen, function (d) {
						return A2(_elm_lang$core$Task$andThen, function (e) {
							return _elm_lang$core$Task$succeed(A5(func, a, b, c, d, e));
						}, taskE);
					}, taskD);
				}, taskC);
			}, taskB);
		}, taskA);
	});
	var _elm_lang$core$Task$sequence = function _elm_lang$core$Task$sequence(tasks) {
		var _p3 = tasks;
		if (_p3.ctor === '[]') {
			return _elm_lang$core$Task$succeed({ ctor: '[]' });
		} else {
			return A3(_elm_lang$core$Task$map2, F2(function (x, y) {
				return { ctor: '::', _0: x, _1: y };
			}), _p3._0, _elm_lang$core$Task$sequence(_p3._1));
		}
	};
	var _elm_lang$core$Task$onEffects = F3(function (router, commands, state) {
		return A2(_elm_lang$core$Task$map, function (_p4) {
			return { ctor: '_Tuple0' };
		}, _elm_lang$core$Task$sequence(A2(_elm_lang$core$List$map, _elm_lang$core$Task$spawnCmd(router), commands)));
	});
	var _elm_lang$core$Task$init = _elm_lang$core$Task$succeed({ ctor: '_Tuple0' });
	var _elm_lang$core$Task$onSelfMsg = F3(function (_p7, _p6, _p5) {
		return _elm_lang$core$Task$succeed({ ctor: '_Tuple0' });
	});
	var _elm_lang$core$Task$command = _elm_lang$core$Native_Platform.leaf('Task');
	var _elm_lang$core$Task$Perform = function _elm_lang$core$Task$Perform(a) {
		return { ctor: 'Perform', _0: a };
	};
	var _elm_lang$core$Task$perform = F2(function (toMessage, task) {
		return _elm_lang$core$Task$command(_elm_lang$core$Task$Perform(A2(_elm_lang$core$Task$map, toMessage, task)));
	});
	var _elm_lang$core$Task$attempt = F2(function (resultToMessage, task) {
		return _elm_lang$core$Task$command(_elm_lang$core$Task$Perform(A2(_elm_lang$core$Task$onError, function (_p8) {
			return _elm_lang$core$Task$succeed(resultToMessage(_elm_lang$core$Result$Err(_p8)));
		}, A2(_elm_lang$core$Task$andThen, function (_p9) {
			return _elm_lang$core$Task$succeed(resultToMessage(_elm_lang$core$Result$Ok(_p9)));
		}, task))));
	});
	var _elm_lang$core$Task$cmdMap = F2(function (tagger, _p10) {
		var _p11 = _p10;
		return _elm_lang$core$Task$Perform(A2(_elm_lang$core$Task$map, tagger, _p11._0));
	});
	_elm_lang$core$Native_Platform.effectManagers['Task'] = { pkg: 'elm-lang/core', init: _elm_lang$core$Task$init, onEffects: _elm_lang$core$Task$onEffects, onSelfMsg: _elm_lang$core$Task$onSelfMsg, tag: 'cmd', cmdMap: _elm_lang$core$Task$cmdMap };

	//import Native.Utils //

	var _elm_lang$core$Native_Debug = function () {

		function log(tag, value) {
			var msg = tag + ': ' + _elm_lang$core$Native_Utils.toString(value);
			var process = process || {};
			if (process.stdout) {
				process.stdout.write(msg);
			} else {
				console.log(msg);
			}
			return value;
		}

		function crash(message) {
			throw new Error(message);
		}

		return {
			crash: crash,
			log: F2(log)
		};
	}();
	//import Maybe, Native.List, Native.Utils, Result //

	var _elm_lang$core$Native_String = function () {

		function isEmpty(str) {
			return str.length === 0;
		}
		function cons(chr, str) {
			return chr + str;
		}
		function uncons(str) {
			var hd = str[0];
			if (hd) {
				return _elm_lang$core$Maybe$Just(_elm_lang$core$Native_Utils.Tuple2(_elm_lang$core$Native_Utils.chr(hd), str.slice(1)));
			}
			return _elm_lang$core$Maybe$Nothing;
		}
		function append(a, b) {
			return a + b;
		}
		function concat(strs) {
			return _elm_lang$core$Native_List.toArray(strs).join('');
		}
		function length(str) {
			return str.length;
		}
		function map(f, str) {
			var out = str.split('');
			for (var i = out.length; i--;) {
				out[i] = f(_elm_lang$core$Native_Utils.chr(out[i]));
			}
			return out.join('');
		}
		function filter(pred, str) {
			return str.split('').map(_elm_lang$core$Native_Utils.chr).filter(pred).join('');
		}
		function reverse(str) {
			return str.split('').reverse().join('');
		}
		function foldl(f, b, str) {
			var len = str.length;
			for (var i = 0; i < len; ++i) {
				b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
			}
			return b;
		}
		function foldr(f, b, str) {
			for (var i = str.length; i--;) {
				b = A2(f, _elm_lang$core$Native_Utils.chr(str[i]), b);
			}
			return b;
		}
		function split(sep, str) {
			return _elm_lang$core$Native_List.fromArray(str.split(sep));
		}
		function join(sep, strs) {
			return _elm_lang$core$Native_List.toArray(strs).join(sep);
		}
		function repeat(n, str) {
			var result = '';
			while (n > 0) {
				if (n & 1) {
					result += str;
				}
				n >>= 1, str += str;
			}
			return result;
		}
		function slice(start, end, str) {
			return str.slice(start, end);
		}
		function left(n, str) {
			return n < 1 ? '' : str.slice(0, n);
		}
		function right(n, str) {
			return n < 1 ? '' : str.slice(-n);
		}
		function dropLeft(n, str) {
			return n < 1 ? str : str.slice(n);
		}
		function dropRight(n, str) {
			return n < 1 ? str : str.slice(0, -n);
		}
		function pad(n, chr, str) {
			var half = (n - str.length) / 2;
			return repeat(Math.ceil(half), chr) + str + repeat(half | 0, chr);
		}
		function padRight(n, chr, str) {
			return str + repeat(n - str.length, chr);
		}
		function padLeft(n, chr, str) {
			return repeat(n - str.length, chr) + str;
		}

		function trim(str) {
			return str.trim();
		}
		function trimLeft(str) {
			return str.replace(/^\s+/, '');
		}
		function trimRight(str) {
			return str.replace(/\s+$/, '');
		}

		function words(str) {
			return _elm_lang$core$Native_List.fromArray(str.trim().split(/\s+/g));
		}
		function lines(str) {
			return _elm_lang$core$Native_List.fromArray(str.split(/\r\n|\r|\n/g));
		}

		function toUpper(str) {
			return str.toUpperCase();
		}
		function toLower(str) {
			return str.toLowerCase();
		}

		function any(pred, str) {
			for (var i = str.length; i--;) {
				if (pred(_elm_lang$core$Native_Utils.chr(str[i]))) {
					return true;
				}
			}
			return false;
		}
		function all(pred, str) {
			for (var i = str.length; i--;) {
				if (!pred(_elm_lang$core$Native_Utils.chr(str[i]))) {
					return false;
				}
			}
			return true;
		}

		function contains(sub, str) {
			return str.indexOf(sub) > -1;
		}
		function startsWith(sub, str) {
			return str.indexOf(sub) === 0;
		}
		function endsWith(sub, str) {
			return str.length >= sub.length && str.lastIndexOf(sub) === str.length - sub.length;
		}
		function indexes(sub, str) {
			var subLen = sub.length;

			if (subLen < 1) {
				return _elm_lang$core$Native_List.Nil;
			}

			var i = 0;
			var is = [];

			while ((i = str.indexOf(sub, i)) > -1) {
				is.push(i);
				i = i + subLen;
			}

			return _elm_lang$core$Native_List.fromArray(is);
		}

		function toInt(s) {
			var len = s.length;

			// if empty
			if (len === 0) {
				return intErr(s);
			}

			// if hex
			var c = s[0];
			if (c === '0' && s[1] === 'x') {
				for (var i = 2; i < len; ++i) {
					var c = s[i];
					if ('0' <= c && c <= '9' || 'A' <= c && c <= 'F' || 'a' <= c && c <= 'f') {
						continue;
					}
					return intErr(s);
				}
				return _elm_lang$core$Result$Ok(parseInt(s, 16));
			}

			// is decimal
			if (c > '9' || c < '0' && c !== '-' && c !== '+') {
				return intErr(s);
			}
			for (var i = 1; i < len; ++i) {
				var c = s[i];
				if (c < '0' || '9' < c) {
					return intErr(s);
				}
			}

			return _elm_lang$core$Result$Ok(parseInt(s, 10));
		}

		function intErr(s) {
			return _elm_lang$core$Result$Err("could not convert string '" + s + "' to an Int");
		}

		function toFloat(s) {
			// check if it is a hex, octal, or binary number
			if (s.length === 0 || /[\sxbo]/.test(s)) {
				return floatErr(s);
			}
			var n = +s;
			// faster isNaN check
			return n === n ? _elm_lang$core$Result$Ok(n) : floatErr(s);
		}

		function floatErr(s) {
			return _elm_lang$core$Result$Err("could not convert string '" + s + "' to a Float");
		}

		function toList(str) {
			return _elm_lang$core$Native_List.fromArray(str.split('').map(_elm_lang$core$Native_Utils.chr));
		}
		function fromList(chars) {
			return _elm_lang$core$Native_List.toArray(chars).join('');
		}

		return {
			isEmpty: isEmpty,
			cons: F2(cons),
			uncons: uncons,
			append: F2(append),
			concat: concat,
			length: length,
			map: F2(map),
			filter: F2(filter),
			reverse: reverse,
			foldl: F3(foldl),
			foldr: F3(foldr),

			split: F2(split),
			join: F2(join),
			repeat: F2(repeat),

			slice: F3(slice),
			left: F2(left),
			right: F2(right),
			dropLeft: F2(dropLeft),
			dropRight: F2(dropRight),

			pad: F3(pad),
			padLeft: F3(padLeft),
			padRight: F3(padRight),

			trim: trim,
			trimLeft: trimLeft,
			trimRight: trimRight,

			words: words,
			lines: lines,

			toUpper: toUpper,
			toLower: toLower,

			any: F2(any),
			all: F2(all),

			contains: F2(contains),
			startsWith: F2(startsWith),
			endsWith: F2(endsWith),
			indexes: F2(indexes),

			toInt: toInt,
			toFloat: toFloat,
			toList: toList,
			fromList: fromList
		};
	}();

	var _elm_lang$core$String$fromList = _elm_lang$core$Native_String.fromList;
	var _elm_lang$core$String$toList = _elm_lang$core$Native_String.toList;
	var _elm_lang$core$String$toFloat = _elm_lang$core$Native_String.toFloat;
	var _elm_lang$core$String$toInt = _elm_lang$core$Native_String.toInt;
	var _elm_lang$core$String$indices = _elm_lang$core$Native_String.indexes;
	var _elm_lang$core$String$indexes = _elm_lang$core$Native_String.indexes;
	var _elm_lang$core$String$endsWith = _elm_lang$core$Native_String.endsWith;
	var _elm_lang$core$String$startsWith = _elm_lang$core$Native_String.startsWith;
	var _elm_lang$core$String$contains = _elm_lang$core$Native_String.contains;
	var _elm_lang$core$String$all = _elm_lang$core$Native_String.all;
	var _elm_lang$core$String$any = _elm_lang$core$Native_String.any;
	var _elm_lang$core$String$toLower = _elm_lang$core$Native_String.toLower;
	var _elm_lang$core$String$toUpper = _elm_lang$core$Native_String.toUpper;
	var _elm_lang$core$String$lines = _elm_lang$core$Native_String.lines;
	var _elm_lang$core$String$words = _elm_lang$core$Native_String.words;
	var _elm_lang$core$String$trimRight = _elm_lang$core$Native_String.trimRight;
	var _elm_lang$core$String$trimLeft = _elm_lang$core$Native_String.trimLeft;
	var _elm_lang$core$String$trim = _elm_lang$core$Native_String.trim;
	var _elm_lang$core$String$padRight = _elm_lang$core$Native_String.padRight;
	var _elm_lang$core$String$padLeft = _elm_lang$core$Native_String.padLeft;
	var _elm_lang$core$String$pad = _elm_lang$core$Native_String.pad;
	var _elm_lang$core$String$dropRight = _elm_lang$core$Native_String.dropRight;
	var _elm_lang$core$String$dropLeft = _elm_lang$core$Native_String.dropLeft;
	var _elm_lang$core$String$right = _elm_lang$core$Native_String.right;
	var _elm_lang$core$String$left = _elm_lang$core$Native_String.left;
	var _elm_lang$core$String$slice = _elm_lang$core$Native_String.slice;
	var _elm_lang$core$String$repeat = _elm_lang$core$Native_String.repeat;
	var _elm_lang$core$String$join = _elm_lang$core$Native_String.join;
	var _elm_lang$core$String$split = _elm_lang$core$Native_String.split;
	var _elm_lang$core$String$foldr = _elm_lang$core$Native_String.foldr;
	var _elm_lang$core$String$foldl = _elm_lang$core$Native_String.foldl;
	var _elm_lang$core$String$reverse = _elm_lang$core$Native_String.reverse;
	var _elm_lang$core$String$filter = _elm_lang$core$Native_String.filter;
	var _elm_lang$core$String$map = _elm_lang$core$Native_String.map;
	var _elm_lang$core$String$length = _elm_lang$core$Native_String.length;
	var _elm_lang$core$String$concat = _elm_lang$core$Native_String.concat;
	var _elm_lang$core$String$append = _elm_lang$core$Native_String.append;
	var _elm_lang$core$String$uncons = _elm_lang$core$Native_String.uncons;
	var _elm_lang$core$String$cons = _elm_lang$core$Native_String.cons;
	var _elm_lang$core$String$fromChar = function _elm_lang$core$String$fromChar($char) {
		return A2(_elm_lang$core$String$cons, $char, '');
	};
	var _elm_lang$core$String$isEmpty = _elm_lang$core$Native_String.isEmpty;

	var _elm_lang$core$Dict$foldr = F3(function (f, acc, t) {
		foldr: while (true) {
			var _p0 = t;
			if (_p0.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v1 = f,
				    _v2 = A3(f, _p0._1, _p0._2, A3(_elm_lang$core$Dict$foldr, f, acc, _p0._4)),
				    _v3 = _p0._3;
				f = _v1;
				acc = _v2;
				t = _v3;
				continue foldr;
			}
		}
	});
	var _elm_lang$core$Dict$keys = function _elm_lang$core$Dict$keys(dict) {
		return A3(_elm_lang$core$Dict$foldr, F3(function (key, value, keyList) {
			return { ctor: '::', _0: key, _1: keyList };
		}), { ctor: '[]' }, dict);
	};
	var _elm_lang$core$Dict$values = function _elm_lang$core$Dict$values(dict) {
		return A3(_elm_lang$core$Dict$foldr, F3(function (key, value, valueList) {
			return { ctor: '::', _0: value, _1: valueList };
		}), { ctor: '[]' }, dict);
	};
	var _elm_lang$core$Dict$toList = function _elm_lang$core$Dict$toList(dict) {
		return A3(_elm_lang$core$Dict$foldr, F3(function (key, value, list) {
			return {
				ctor: '::',
				_0: { ctor: '_Tuple2', _0: key, _1: value },
				_1: list
			};
		}), { ctor: '[]' }, dict);
	};
	var _elm_lang$core$Dict$foldl = F3(function (f, acc, dict) {
		foldl: while (true) {
			var _p1 = dict;
			if (_p1.ctor === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var _v5 = f,
				    _v6 = A3(f, _p1._1, _p1._2, A3(_elm_lang$core$Dict$foldl, f, acc, _p1._3)),
				    _v7 = _p1._4;
				f = _v5;
				acc = _v6;
				dict = _v7;
				continue foldl;
			}
		}
	});
	var _elm_lang$core$Dict$merge = F6(function (leftStep, bothStep, rightStep, leftDict, rightDict, initialResult) {
		var stepState = F3(function (rKey, rValue, _p2) {
			stepState: while (true) {
				var _p3 = _p2;
				var _p9 = _p3._1;
				var _p8 = _p3._0;
				var _p4 = _p8;
				if (_p4.ctor === '[]') {
					return {
						ctor: '_Tuple2',
						_0: _p8,
						_1: A3(rightStep, rKey, rValue, _p9)
					};
				} else {
					var _p7 = _p4._1;
					var _p6 = _p4._0._1;
					var _p5 = _p4._0._0;
					if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) < 0) {
						var _v10 = rKey,
						    _v11 = rValue,
						    _v12 = {
							ctor: '_Tuple2',
							_0: _p7,
							_1: A3(leftStep, _p5, _p6, _p9)
						};
						rKey = _v10;
						rValue = _v11;
						_p2 = _v12;
						continue stepState;
					} else {
						if (_elm_lang$core$Native_Utils.cmp(_p5, rKey) > 0) {
							return {
								ctor: '_Tuple2',
								_0: _p8,
								_1: A3(rightStep, rKey, rValue, _p9)
							};
						} else {
							return {
								ctor: '_Tuple2',
								_0: _p7,
								_1: A4(bothStep, _p5, _p6, rValue, _p9)
							};
						}
					}
				}
			}
		});
		var _p10 = A3(_elm_lang$core$Dict$foldl, stepState, {
			ctor: '_Tuple2',
			_0: _elm_lang$core$Dict$toList(leftDict),
			_1: initialResult
		}, rightDict);
		var leftovers = _p10._0;
		var intermediateResult = _p10._1;
		return A3(_elm_lang$core$List$foldl, F2(function (_p11, result) {
			var _p12 = _p11;
			return A3(leftStep, _p12._0, _p12._1, result);
		}), intermediateResult, leftovers);
	});
	var _elm_lang$core$Dict$reportRemBug = F4(function (msg, c, lgot, rgot) {
		return _elm_lang$core$Native_Debug.crash(_elm_lang$core$String$concat({
			ctor: '::',
			_0: 'Internal red-black tree invariant violated, expected ',
			_1: {
				ctor: '::',
				_0: msg,
				_1: {
					ctor: '::',
					_0: ' and got ',
					_1: {
						ctor: '::',
						_0: _elm_lang$core$Basics$toString(c),
						_1: {
							ctor: '::',
							_0: '/',
							_1: {
								ctor: '::',
								_0: lgot,
								_1: {
									ctor: '::',
									_0: '/',
									_1: {
										ctor: '::',
										_0: rgot,
										_1: {
											ctor: '::',
											_0: '\nPlease report this bug to <https://github.com/elm-lang/core/issues>',
											_1: { ctor: '[]' }
										}
									}
								}
							}
						}
					}
				}
			}
		}));
	});
	var _elm_lang$core$Dict$isBBlack = function _elm_lang$core$Dict$isBBlack(dict) {
		var _p13 = dict;
		_v14_2: do {
			if (_p13.ctor === 'RBNode_elm_builtin') {
				if (_p13._0.ctor === 'BBlack') {
					return true;
				} else {
					break _v14_2;
				}
			} else {
				if (_p13._0.ctor === 'LBBlack') {
					return true;
				} else {
					break _v14_2;
				}
			}
		} while (false);
		return false;
	};
	var _elm_lang$core$Dict$sizeHelp = F2(function (n, dict) {
		sizeHelp: while (true) {
			var _p14 = dict;
			if (_p14.ctor === 'RBEmpty_elm_builtin') {
				return n;
			} else {
				var _v16 = A2(_elm_lang$core$Dict$sizeHelp, n + 1, _p14._4),
				    _v17 = _p14._3;
				n = _v16;
				dict = _v17;
				continue sizeHelp;
			}
		}
	});
	var _elm_lang$core$Dict$size = function _elm_lang$core$Dict$size(dict) {
		return A2(_elm_lang$core$Dict$sizeHelp, 0, dict);
	};
	var _elm_lang$core$Dict$get = F2(function (targetKey, dict) {
		get: while (true) {
			var _p15 = dict;
			if (_p15.ctor === 'RBEmpty_elm_builtin') {
				return _elm_lang$core$Maybe$Nothing;
			} else {
				var _p16 = A2(_elm_lang$core$Basics$compare, targetKey, _p15._1);
				switch (_p16.ctor) {
					case 'LT':
						var _v20 = targetKey,
						    _v21 = _p15._3;
						targetKey = _v20;
						dict = _v21;
						continue get;
					case 'EQ':
						return _elm_lang$core$Maybe$Just(_p15._2);
					default:
						var _v22 = targetKey,
						    _v23 = _p15._4;
						targetKey = _v22;
						dict = _v23;
						continue get;
				}
			}
		}
	});
	var _elm_lang$core$Dict$member = F2(function (key, dict) {
		var _p17 = A2(_elm_lang$core$Dict$get, key, dict);
		if (_p17.ctor === 'Just') {
			return true;
		} else {
			return false;
		}
	});
	var _elm_lang$core$Dict$maxWithDefault = F3(function (k, v, r) {
		maxWithDefault: while (true) {
			var _p18 = r;
			if (_p18.ctor === 'RBEmpty_elm_builtin') {
				return { ctor: '_Tuple2', _0: k, _1: v };
			} else {
				var _v26 = _p18._1,
				    _v27 = _p18._2,
				    _v28 = _p18._4;
				k = _v26;
				v = _v27;
				r = _v28;
				continue maxWithDefault;
			}
		}
	});
	var _elm_lang$core$Dict$NBlack = { ctor: 'NBlack' };
	var _elm_lang$core$Dict$BBlack = { ctor: 'BBlack' };
	var _elm_lang$core$Dict$Black = { ctor: 'Black' };
	var _elm_lang$core$Dict$blackish = function _elm_lang$core$Dict$blackish(t) {
		var _p19 = t;
		if (_p19.ctor === 'RBNode_elm_builtin') {
			var _p20 = _p19._0;
			return _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$Black) || _elm_lang$core$Native_Utils.eq(_p20, _elm_lang$core$Dict$BBlack);
		} else {
			return true;
		}
	};
	var _elm_lang$core$Dict$Red = { ctor: 'Red' };
	var _elm_lang$core$Dict$moreBlack = function _elm_lang$core$Dict$moreBlack(color) {
		var _p21 = color;
		switch (_p21.ctor) {
			case 'Black':
				return _elm_lang$core$Dict$BBlack;
			case 'Red':
				return _elm_lang$core$Dict$Black;
			case 'NBlack':
				return _elm_lang$core$Dict$Red;
			default:
				return _elm_lang$core$Native_Debug.crash('Can\'t make a double black node more black!');
		}
	};
	var _elm_lang$core$Dict$lessBlack = function _elm_lang$core$Dict$lessBlack(color) {
		var _p22 = color;
		switch (_p22.ctor) {
			case 'BBlack':
				return _elm_lang$core$Dict$Black;
			case 'Black':
				return _elm_lang$core$Dict$Red;
			case 'Red':
				return _elm_lang$core$Dict$NBlack;
			default:
				return _elm_lang$core$Native_Debug.crash('Can\'t make a negative black node less black!');
		}
	};
	var _elm_lang$core$Dict$LBBlack = { ctor: 'LBBlack' };
	var _elm_lang$core$Dict$LBlack = { ctor: 'LBlack' };
	var _elm_lang$core$Dict$RBEmpty_elm_builtin = function _elm_lang$core$Dict$RBEmpty_elm_builtin(a) {
		return { ctor: 'RBEmpty_elm_builtin', _0: a };
	};
	var _elm_lang$core$Dict$empty = _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
	var _elm_lang$core$Dict$isEmpty = function _elm_lang$core$Dict$isEmpty(dict) {
		return _elm_lang$core$Native_Utils.eq(dict, _elm_lang$core$Dict$empty);
	};
	var _elm_lang$core$Dict$RBNode_elm_builtin = F5(function (a, b, c, d, e) {
		return { ctor: 'RBNode_elm_builtin', _0: a, _1: b, _2: c, _3: d, _4: e };
	});
	var _elm_lang$core$Dict$ensureBlackRoot = function _elm_lang$core$Dict$ensureBlackRoot(dict) {
		var _p23 = dict;
		if (_p23.ctor === 'RBNode_elm_builtin' && _p23._0.ctor === 'Red') {
			return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p23._1, _p23._2, _p23._3, _p23._4);
		} else {
			return dict;
		}
	};
	var _elm_lang$core$Dict$lessBlackTree = function _elm_lang$core$Dict$lessBlackTree(dict) {
		var _p24 = dict;
		if (_p24.ctor === 'RBNode_elm_builtin') {
			return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$lessBlack(_p24._0), _p24._1, _p24._2, _p24._3, _p24._4);
		} else {
			return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
		}
	};
	var _elm_lang$core$Dict$balancedTree = function _elm_lang$core$Dict$balancedTree(col) {
		return function (xk) {
			return function (xv) {
				return function (yk) {
					return function (yv) {
						return function (zk) {
							return function (zv) {
								return function (a) {
									return function (b) {
										return function (c) {
											return function (d) {
												return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$lessBlack(col), yk, yv, A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, xk, xv, a, b), A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, zk, zv, c, d));
											};
										};
									};
								};
							};
						};
					};
				};
			};
		};
	};
	var _elm_lang$core$Dict$blacken = function _elm_lang$core$Dict$blacken(t) {
		var _p25 = t;
		if (_p25.ctor === 'RBEmpty_elm_builtin') {
			return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
		} else {
			return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p25._1, _p25._2, _p25._3, _p25._4);
		}
	};
	var _elm_lang$core$Dict$redden = function _elm_lang$core$Dict$redden(t) {
		var _p26 = t;
		if (_p26.ctor === 'RBEmpty_elm_builtin') {
			return _elm_lang$core$Native_Debug.crash('can\'t make a Leaf red');
		} else {
			return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, _p26._1, _p26._2, _p26._3, _p26._4);
		}
	};
	var _elm_lang$core$Dict$balanceHelp = function _elm_lang$core$Dict$balanceHelp(tree) {
		var _p27 = tree;
		_v36_6: do {
			_v36_5: do {
				_v36_4: do {
					_v36_3: do {
						_v36_2: do {
							_v36_1: do {
								_v36_0: do {
									if (_p27.ctor === 'RBNode_elm_builtin') {
										if (_p27._3.ctor === 'RBNode_elm_builtin') {
											if (_p27._4.ctor === 'RBNode_elm_builtin') {
												switch (_p27._3._0.ctor) {
													case 'Red':
														switch (_p27._4._0.ctor) {
															case 'Red':
																if (_p27._3._3.ctor === 'RBNode_elm_builtin' && _p27._3._3._0.ctor === 'Red') {
																	break _v36_0;
																} else {
																	if (_p27._3._4.ctor === 'RBNode_elm_builtin' && _p27._3._4._0.ctor === 'Red') {
																		break _v36_1;
																	} else {
																		if (_p27._4._3.ctor === 'RBNode_elm_builtin' && _p27._4._3._0.ctor === 'Red') {
																			break _v36_2;
																		} else {
																			if (_p27._4._4.ctor === 'RBNode_elm_builtin' && _p27._4._4._0.ctor === 'Red') {
																				break _v36_3;
																			} else {
																				break _v36_6;
																			}
																		}
																	}
																}
															case 'NBlack':
																if (_p27._3._3.ctor === 'RBNode_elm_builtin' && _p27._3._3._0.ctor === 'Red') {
																	break _v36_0;
																} else {
																	if (_p27._3._4.ctor === 'RBNode_elm_builtin' && _p27._3._4._0.ctor === 'Red') {
																		break _v36_1;
																	} else {
																		if (_p27._0.ctor === 'BBlack' && _p27._4._3.ctor === 'RBNode_elm_builtin' && _p27._4._3._0.ctor === 'Black' && _p27._4._4.ctor === 'RBNode_elm_builtin' && _p27._4._4._0.ctor === 'Black') {
																			break _v36_4;
																		} else {
																			break _v36_6;
																		}
																	}
																}
															default:
																if (_p27._3._3.ctor === 'RBNode_elm_builtin' && _p27._3._3._0.ctor === 'Red') {
																	break _v36_0;
																} else {
																	if (_p27._3._4.ctor === 'RBNode_elm_builtin' && _p27._3._4._0.ctor === 'Red') {
																		break _v36_1;
																	} else {
																		break _v36_6;
																	}
																}
														}
													case 'NBlack':
														switch (_p27._4._0.ctor) {
															case 'Red':
																if (_p27._4._3.ctor === 'RBNode_elm_builtin' && _p27._4._3._0.ctor === 'Red') {
																	break _v36_2;
																} else {
																	if (_p27._4._4.ctor === 'RBNode_elm_builtin' && _p27._4._4._0.ctor === 'Red') {
																		break _v36_3;
																	} else {
																		if (_p27._0.ctor === 'BBlack' && _p27._3._3.ctor === 'RBNode_elm_builtin' && _p27._3._3._0.ctor === 'Black' && _p27._3._4.ctor === 'RBNode_elm_builtin' && _p27._3._4._0.ctor === 'Black') {
																			break _v36_5;
																		} else {
																			break _v36_6;
																		}
																	}
																}
															case 'NBlack':
																if (_p27._0.ctor === 'BBlack') {
																	if (_p27._4._3.ctor === 'RBNode_elm_builtin' && _p27._4._3._0.ctor === 'Black' && _p27._4._4.ctor === 'RBNode_elm_builtin' && _p27._4._4._0.ctor === 'Black') {
																		break _v36_4;
																	} else {
																		if (_p27._3._3.ctor === 'RBNode_elm_builtin' && _p27._3._3._0.ctor === 'Black' && _p27._3._4.ctor === 'RBNode_elm_builtin' && _p27._3._4._0.ctor === 'Black') {
																			break _v36_5;
																		} else {
																			break _v36_6;
																		}
																	}
																} else {
																	break _v36_6;
																}
															default:
																if (_p27._0.ctor === 'BBlack' && _p27._3._3.ctor === 'RBNode_elm_builtin' && _p27._3._3._0.ctor === 'Black' && _p27._3._4.ctor === 'RBNode_elm_builtin' && _p27._3._4._0.ctor === 'Black') {
																	break _v36_5;
																} else {
																	break _v36_6;
																}
														}
													default:
														switch (_p27._4._0.ctor) {
															case 'Red':
																if (_p27._4._3.ctor === 'RBNode_elm_builtin' && _p27._4._3._0.ctor === 'Red') {
																	break _v36_2;
																} else {
																	if (_p27._4._4.ctor === 'RBNode_elm_builtin' && _p27._4._4._0.ctor === 'Red') {
																		break _v36_3;
																	} else {
																		break _v36_6;
																	}
																}
															case 'NBlack':
																if (_p27._0.ctor === 'BBlack' && _p27._4._3.ctor === 'RBNode_elm_builtin' && _p27._4._3._0.ctor === 'Black' && _p27._4._4.ctor === 'RBNode_elm_builtin' && _p27._4._4._0.ctor === 'Black') {
																	break _v36_4;
																} else {
																	break _v36_6;
																}
															default:
																break _v36_6;
														}
												}
											} else {
												switch (_p27._3._0.ctor) {
													case 'Red':
														if (_p27._3._3.ctor === 'RBNode_elm_builtin' && _p27._3._3._0.ctor === 'Red') {
															break _v36_0;
														} else {
															if (_p27._3._4.ctor === 'RBNode_elm_builtin' && _p27._3._4._0.ctor === 'Red') {
																break _v36_1;
															} else {
																break _v36_6;
															}
														}
													case 'NBlack':
														if (_p27._0.ctor === 'BBlack' && _p27._3._3.ctor === 'RBNode_elm_builtin' && _p27._3._3._0.ctor === 'Black' && _p27._3._4.ctor === 'RBNode_elm_builtin' && _p27._3._4._0.ctor === 'Black') {
															break _v36_5;
														} else {
															break _v36_6;
														}
													default:
														break _v36_6;
												}
											}
										} else {
											if (_p27._4.ctor === 'RBNode_elm_builtin') {
												switch (_p27._4._0.ctor) {
													case 'Red':
														if (_p27._4._3.ctor === 'RBNode_elm_builtin' && _p27._4._3._0.ctor === 'Red') {
															break _v36_2;
														} else {
															if (_p27._4._4.ctor === 'RBNode_elm_builtin' && _p27._4._4._0.ctor === 'Red') {
																break _v36_3;
															} else {
																break _v36_6;
															}
														}
													case 'NBlack':
														if (_p27._0.ctor === 'BBlack' && _p27._4._3.ctor === 'RBNode_elm_builtin' && _p27._4._3._0.ctor === 'Black' && _p27._4._4.ctor === 'RBNode_elm_builtin' && _p27._4._4._0.ctor === 'Black') {
															break _v36_4;
														} else {
															break _v36_6;
														}
													default:
														break _v36_6;
												}
											} else {
												break _v36_6;
											}
										}
									} else {
										break _v36_6;
									}
								} while (false);
								return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._3._1)(_p27._3._3._2)(_p27._3._1)(_p27._3._2)(_p27._1)(_p27._2)(_p27._3._3._3)(_p27._3._3._4)(_p27._3._4)(_p27._4);
							} while (false);
							return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._3._1)(_p27._3._2)(_p27._3._4._1)(_p27._3._4._2)(_p27._1)(_p27._2)(_p27._3._3)(_p27._3._4._3)(_p27._3._4._4)(_p27._4);
						} while (false);
						return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._3._1)(_p27._4._3._2)(_p27._4._1)(_p27._4._2)(_p27._3)(_p27._4._3._3)(_p27._4._3._4)(_p27._4._4);
					} while (false);
					return _elm_lang$core$Dict$balancedTree(_p27._0)(_p27._1)(_p27._2)(_p27._4._1)(_p27._4._2)(_p27._4._4._1)(_p27._4._4._2)(_p27._3)(_p27._4._3)(_p27._4._4._3)(_p27._4._4._4);
				} while (false);
				return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._4._3._1, _p27._4._3._2, A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3, _p27._4._3._3), A5(_elm_lang$core$Dict$balance, _elm_lang$core$Dict$Black, _p27._4._1, _p27._4._2, _p27._4._3._4, _elm_lang$core$Dict$redden(_p27._4._4)));
			} while (false);
			return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._3._4._1, _p27._3._4._2, A5(_elm_lang$core$Dict$balance, _elm_lang$core$Dict$Black, _p27._3._1, _p27._3._2, _elm_lang$core$Dict$redden(_p27._3._3), _p27._3._4._3), A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p27._1, _p27._2, _p27._3._4._4, _p27._4));
		} while (false);
		return tree;
	};
	var _elm_lang$core$Dict$balance = F5(function (c, k, v, l, r) {
		var tree = A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
		return _elm_lang$core$Dict$blackish(tree) ? _elm_lang$core$Dict$balanceHelp(tree) : tree;
	});
	var _elm_lang$core$Dict$bubble = F5(function (c, k, v, l, r) {
		return _elm_lang$core$Dict$isBBlack(l) || _elm_lang$core$Dict$isBBlack(r) ? A5(_elm_lang$core$Dict$balance, _elm_lang$core$Dict$moreBlack(c), k, v, _elm_lang$core$Dict$lessBlackTree(l), _elm_lang$core$Dict$lessBlackTree(r)) : A5(_elm_lang$core$Dict$RBNode_elm_builtin, c, k, v, l, r);
	});
	var _elm_lang$core$Dict$removeMax = F5(function (c, k, v, l, r) {
		var _p28 = r;
		if (_p28.ctor === 'RBEmpty_elm_builtin') {
			return A3(_elm_lang$core$Dict$rem, c, l, r);
		} else {
			return A5(_elm_lang$core$Dict$bubble, c, k, v, l, A5(_elm_lang$core$Dict$removeMax, _p28._0, _p28._1, _p28._2, _p28._3, _p28._4));
		}
	});
	var _elm_lang$core$Dict$rem = F3(function (color, left, right) {
		var _p29 = { ctor: '_Tuple2', _0: left, _1: right };
		if (_p29._0.ctor === 'RBEmpty_elm_builtin') {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p30 = color;
				switch (_p30.ctor) {
					case 'Red':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
					case 'Black':
						return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBBlack);
					default:
						return _elm_lang$core$Native_Debug.crash('cannot have bblack or nblack nodes at this point');
				}
			} else {
				var _p33 = _p29._1._0;
				var _p32 = _p29._0._0;
				var _p31 = { ctor: '_Tuple3', _0: color, _1: _p32, _2: _p33 };
				if (_p31.ctor === '_Tuple3' && _p31._0.ctor === 'Black' && _p31._1.ctor === 'LBlack' && _p31._2.ctor === 'Red') {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._1._1, _p29._1._2, _p29._1._3, _p29._1._4);
				} else {
					return A4(_elm_lang$core$Dict$reportRemBug, 'Black/LBlack/Red', color, _elm_lang$core$Basics$toString(_p32), _elm_lang$core$Basics$toString(_p33));
				}
			}
		} else {
			if (_p29._1.ctor === 'RBEmpty_elm_builtin') {
				var _p36 = _p29._1._0;
				var _p35 = _p29._0._0;
				var _p34 = { ctor: '_Tuple3', _0: color, _1: _p35, _2: _p36 };
				if (_p34.ctor === '_Tuple3' && _p34._0.ctor === 'Black' && _p34._1.ctor === 'Red' && _p34._2.ctor === 'LBlack') {
					return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Black, _p29._0._1, _p29._0._2, _p29._0._3, _p29._0._4);
				} else {
					return A4(_elm_lang$core$Dict$reportRemBug, 'Black/Red/LBlack', color, _elm_lang$core$Basics$toString(_p35), _elm_lang$core$Basics$toString(_p36));
				}
			} else {
				var _p40 = _p29._0._2;
				var _p39 = _p29._0._4;
				var _p38 = _p29._0._1;
				var newLeft = A5(_elm_lang$core$Dict$removeMax, _p29._0._0, _p38, _p40, _p29._0._3, _p39);
				var _p37 = A3(_elm_lang$core$Dict$maxWithDefault, _p38, _p40, _p39);
				var k = _p37._0;
				var v = _p37._1;
				return A5(_elm_lang$core$Dict$bubble, color, k, v, newLeft, right);
			}
		}
	});
	var _elm_lang$core$Dict$map = F2(function (f, dict) {
		var _p41 = dict;
		if (_p41.ctor === 'RBEmpty_elm_builtin') {
			return _elm_lang$core$Dict$RBEmpty_elm_builtin(_elm_lang$core$Dict$LBlack);
		} else {
			var _p42 = _p41._1;
			return A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p41._0, _p42, A2(f, _p42, _p41._2), A2(_elm_lang$core$Dict$map, f, _p41._3), A2(_elm_lang$core$Dict$map, f, _p41._4));
		}
	});
	var _elm_lang$core$Dict$Same = { ctor: 'Same' };
	var _elm_lang$core$Dict$Remove = { ctor: 'Remove' };
	var _elm_lang$core$Dict$Insert = { ctor: 'Insert' };
	var _elm_lang$core$Dict$update = F3(function (k, alter, dict) {
		var up = function up(dict) {
			var _p43 = dict;
			if (_p43.ctor === 'RBEmpty_elm_builtin') {
				var _p44 = alter(_elm_lang$core$Maybe$Nothing);
				if (_p44.ctor === 'Nothing') {
					return { ctor: '_Tuple2', _0: _elm_lang$core$Dict$Same, _1: _elm_lang$core$Dict$empty };
				} else {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Dict$Insert,
						_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _elm_lang$core$Dict$Red, k, _p44._0, _elm_lang$core$Dict$empty, _elm_lang$core$Dict$empty)
					};
				}
			} else {
				var _p55 = _p43._2;
				var _p54 = _p43._4;
				var _p53 = _p43._3;
				var _p52 = _p43._1;
				var _p51 = _p43._0;
				var _p45 = A2(_elm_lang$core$Basics$compare, k, _p52);
				switch (_p45.ctor) {
					case 'EQ':
						var _p46 = alter(_elm_lang$core$Maybe$Just(_p55));
						if (_p46.ctor === 'Nothing') {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Remove,
								_1: A3(_elm_lang$core$Dict$rem, _p51, _p53, _p54)
							};
						} else {
							return {
								ctor: '_Tuple2',
								_0: _elm_lang$core$Dict$Same,
								_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p46._0, _p53, _p54)
							};
						}
					case 'LT':
						var _p47 = up(_p53);
						var flag = _p47._0;
						var newLeft = _p47._1;
						var _p48 = flag;
						switch (_p48.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, newLeft, _p54)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, newLeft, _p54)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, newLeft, _p54)
								};
						}
					default:
						var _p49 = up(_p54);
						var flag = _p49._0;
						var newRight = _p49._1;
						var _p50 = flag;
						switch (_p50.ctor) {
							case 'Same':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Same,
									_1: A5(_elm_lang$core$Dict$RBNode_elm_builtin, _p51, _p52, _p55, _p53, newRight)
								};
							case 'Insert':
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Insert,
									_1: A5(_elm_lang$core$Dict$balance, _p51, _p52, _p55, _p53, newRight)
								};
							default:
								return {
									ctor: '_Tuple2',
									_0: _elm_lang$core$Dict$Remove,
									_1: A5(_elm_lang$core$Dict$bubble, _p51, _p52, _p55, _p53, newRight)
								};
						}
				}
			}
		};
		var _p56 = up(dict);
		var flag = _p56._0;
		var updatedDict = _p56._1;
		var _p57 = flag;
		switch (_p57.ctor) {
			case 'Same':
				return updatedDict;
			case 'Insert':
				return _elm_lang$core$Dict$ensureBlackRoot(updatedDict);
			default:
				return _elm_lang$core$Dict$blacken(updatedDict);
		}
	});
	var _elm_lang$core$Dict$insert = F3(function (key, value, dict) {
		return A3(_elm_lang$core$Dict$update, key, _elm_lang$core$Basics$always(_elm_lang$core$Maybe$Just(value)), dict);
	});
	var _elm_lang$core$Dict$singleton = F2(function (key, value) {
		return A3(_elm_lang$core$Dict$insert, key, value, _elm_lang$core$Dict$empty);
	});
	var _elm_lang$core$Dict$union = F2(function (t1, t2) {
		return A3(_elm_lang$core$Dict$foldl, _elm_lang$core$Dict$insert, t2, t1);
	});
	var _elm_lang$core$Dict$filter = F2(function (predicate, dictionary) {
		var add = F3(function (key, value, dict) {
			return A2(predicate, key, value) ? A3(_elm_lang$core$Dict$insert, key, value, dict) : dict;
		});
		return A3(_elm_lang$core$Dict$foldl, add, _elm_lang$core$Dict$empty, dictionary);
	});
	var _elm_lang$core$Dict$intersect = F2(function (t1, t2) {
		return A2(_elm_lang$core$Dict$filter, F2(function (k, _p58) {
			return A2(_elm_lang$core$Dict$member, k, t2);
		}), t1);
	});
	var _elm_lang$core$Dict$partition = F2(function (predicate, dict) {
		var add = F3(function (key, value, _p59) {
			var _p60 = _p59;
			var _p62 = _p60._1;
			var _p61 = _p60._0;
			return A2(predicate, key, value) ? {
				ctor: '_Tuple2',
				_0: A3(_elm_lang$core$Dict$insert, key, value, _p61),
				_1: _p62
			} : {
				ctor: '_Tuple2',
				_0: _p61,
				_1: A3(_elm_lang$core$Dict$insert, key, value, _p62)
			};
		});
		return A3(_elm_lang$core$Dict$foldl, add, { ctor: '_Tuple2', _0: _elm_lang$core$Dict$empty, _1: _elm_lang$core$Dict$empty }, dict);
	});
	var _elm_lang$core$Dict$fromList = function _elm_lang$core$Dict$fromList(assocs) {
		return A3(_elm_lang$core$List$foldl, F2(function (_p63, dict) {
			var _p64 = _p63;
			return A3(_elm_lang$core$Dict$insert, _p64._0, _p64._1, dict);
		}), _elm_lang$core$Dict$empty, assocs);
	};
	var _elm_lang$core$Dict$remove = F2(function (key, dict) {
		return A3(_elm_lang$core$Dict$update, key, _elm_lang$core$Basics$always(_elm_lang$core$Maybe$Nothing), dict);
	});
	var _elm_lang$core$Dict$diff = F2(function (t1, t2) {
		return A3(_elm_lang$core$Dict$foldl, F3(function (k, v, t) {
			return A2(_elm_lang$core$Dict$remove, k, t);
		}), t1, t2);
	});

	var _elm_lang$core$Debug$crash = _elm_lang$core$Native_Debug.crash;
	var _elm_lang$core$Debug$log = _elm_lang$core$Native_Debug.log;

	//import Maybe, Native.Array, Native.List, Native.Utils, Result //

	var _elm_lang$core$Native_Json = function () {

		// CORE DECODERS

		function succeed(msg) {
			return {
				ctor: '<decoder>',
				tag: 'succeed',
				msg: msg
			};
		}

		function fail(msg) {
			return {
				ctor: '<decoder>',
				tag: 'fail',
				msg: msg
			};
		}

		function decodePrimitive(tag) {
			return {
				ctor: '<decoder>',
				tag: tag
			};
		}

		function decodeContainer(tag, decoder) {
			return {
				ctor: '<decoder>',
				tag: tag,
				decoder: decoder
			};
		}

		function decodeNull(value) {
			return {
				ctor: '<decoder>',
				tag: 'null',
				value: value
			};
		}

		function decodeField(field, decoder) {
			return {
				ctor: '<decoder>',
				tag: 'field',
				field: field,
				decoder: decoder
			};
		}

		function decodeIndex(index, decoder) {
			return {
				ctor: '<decoder>',
				tag: 'index',
				index: index,
				decoder: decoder
			};
		}

		function decodeKeyValuePairs(decoder) {
			return {
				ctor: '<decoder>',
				tag: 'key-value',
				decoder: decoder
			};
		}

		function mapMany(f, decoders) {
			return {
				ctor: '<decoder>',
				tag: 'map-many',
				func: f,
				decoders: decoders
			};
		}

		function andThen(callback, decoder) {
			return {
				ctor: '<decoder>',
				tag: 'andThen',
				decoder: decoder,
				callback: callback
			};
		}

		function oneOf(decoders) {
			return {
				ctor: '<decoder>',
				tag: 'oneOf',
				decoders: decoders
			};
		}

		// DECODING OBJECTS

		function map1(f, d1) {
			return mapMany(f, [d1]);
		}

		function map2(f, d1, d2) {
			return mapMany(f, [d1, d2]);
		}

		function map3(f, d1, d2, d3) {
			return mapMany(f, [d1, d2, d3]);
		}

		function map4(f, d1, d2, d3, d4) {
			return mapMany(f, [d1, d2, d3, d4]);
		}

		function map5(f, d1, d2, d3, d4, d5) {
			return mapMany(f, [d1, d2, d3, d4, d5]);
		}

		function map6(f, d1, d2, d3, d4, d5, d6) {
			return mapMany(f, [d1, d2, d3, d4, d5, d6]);
		}

		function map7(f, d1, d2, d3, d4, d5, d6, d7) {
			return mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
		}

		function map8(f, d1, d2, d3, d4, d5, d6, d7, d8) {
			return mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
		}

		// DECODE HELPERS

		function ok(value) {
			return { tag: 'ok', value: value };
		}

		function badPrimitive(type, value) {
			return { tag: 'primitive', type: type, value: value };
		}

		function badIndex(index, nestedProblems) {
			return { tag: 'index', index: index, rest: nestedProblems };
		}

		function badField(field, nestedProblems) {
			return { tag: 'field', field: field, rest: nestedProblems };
		}

		function badIndex(index, nestedProblems) {
			return { tag: 'index', index: index, rest: nestedProblems };
		}

		function badOneOf(problems) {
			return { tag: 'oneOf', problems: problems };
		}

		function bad(msg) {
			return { tag: 'fail', msg: msg };
		}

		function badToString(problem) {
			var context = '_';
			while (problem) {
				switch (problem.tag) {
					case 'primitive':
						return 'Expecting ' + problem.type + (context === '_' ? '' : ' at ' + context) + ' but instead got: ' + jsToString(problem.value);

					case 'index':
						context += '[' + problem.index + ']';
						problem = problem.rest;
						break;

					case 'field':
						context += '.' + problem.field;
						problem = problem.rest;
						break;

					case 'oneOf':
						var problems = problem.problems;
						for (var i = 0; i < problems.length; i++) {
							problems[i] = badToString(problems[i]);
						}
						return 'I ran into the following problems' + (context === '_' ? '' : ' at ' + context) + ':\n\n' + problems.join('\n');

					case 'fail':
						return 'I ran into a `fail` decoder' + (context === '_' ? '' : ' at ' + context) + ': ' + problem.msg;
				}
			}
		}

		function jsToString(value) {
			return value === undefined ? 'undefined' : JSON.stringify(value);
		}

		// DECODE

		function runOnString(decoder, string) {
			var json;
			try {
				json = JSON.parse(string);
			} catch (e) {
				return _elm_lang$core$Result$Err('Given an invalid JSON: ' + e.message);
			}
			return run(decoder, json);
		}

		function run(decoder, value) {
			var result = runHelp(decoder, value);
			return result.tag === 'ok' ? _elm_lang$core$Result$Ok(result.value) : _elm_lang$core$Result$Err(badToString(result));
		}

		function runHelp(decoder, value) {
			switch (decoder.tag) {
				case 'bool':
					return typeof value === 'boolean' ? ok(value) : badPrimitive('a Bool', value);

				case 'int':
					if (typeof value !== 'number') {
						return badPrimitive('an Int', value);
					}

					if (-2147483647 < value && value < 2147483647 && (value | 0) === value) {
						return ok(value);
					}

					if (isFinite(value) && !(value % 1)) {
						return ok(value);
					}

					return badPrimitive('an Int', value);

				case 'float':
					return typeof value === 'number' ? ok(value) : badPrimitive('a Float', value);

				case 'string':
					return typeof value === 'string' ? ok(value) : value instanceof String ? ok(value + '') : badPrimitive('a String', value);

				case 'null':
					return value === null ? ok(decoder.value) : badPrimitive('null', value);

				case 'value':
					return ok(value);

				case 'list':
					if (!(value instanceof Array)) {
						return badPrimitive('a List', value);
					}

					var list = _elm_lang$core$Native_List.Nil;
					for (var i = value.length; i--;) {
						var result = runHelp(decoder.decoder, value[i]);
						if (result.tag !== 'ok') {
							return badIndex(i, result);
						}
						list = _elm_lang$core$Native_List.Cons(result.value, list);
					}
					return ok(list);

				case 'array':
					if (!(value instanceof Array)) {
						return badPrimitive('an Array', value);
					}

					var len = value.length;
					var array = new Array(len);
					for (var i = len; i--;) {
						var result = runHelp(decoder.decoder, value[i]);
						if (result.tag !== 'ok') {
							return badIndex(i, result);
						}
						array[i] = result.value;
					}
					return ok(_elm_lang$core$Native_Array.fromJSArray(array));

				case 'maybe':
					var result = runHelp(decoder.decoder, value);
					return result.tag === 'ok' ? ok(_elm_lang$core$Maybe$Just(result.value)) : ok(_elm_lang$core$Maybe$Nothing);

				case 'field':
					var field = decoder.field;
					if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' || value === null || !(field in value)) {
						return badPrimitive('an object with a field named `' + field + '`', value);
					}

					var result = runHelp(decoder.decoder, value[field]);
					return result.tag === 'ok' ? result : badField(field, result);

				case 'index':
					var index = decoder.index;
					if (!(value instanceof Array)) {
						return badPrimitive('an array', value);
					}
					if (index >= value.length) {
						return badPrimitive('a longer array. Need index ' + index + ' but there are only ' + value.length + ' entries', value);
					}

					var result = runHelp(decoder.decoder, value[index]);
					return result.tag === 'ok' ? result : badIndex(index, result);

				case 'key-value':
					if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' || value === null || value instanceof Array) {
						return badPrimitive('an object', value);
					}

					var keyValuePairs = _elm_lang$core$Native_List.Nil;
					for (var key in value) {
						var result = runHelp(decoder.decoder, value[key]);
						if (result.tag !== 'ok') {
							return badField(key, result);
						}
						var pair = _elm_lang$core$Native_Utils.Tuple2(key, result.value);
						keyValuePairs = _elm_lang$core$Native_List.Cons(pair, keyValuePairs);
					}
					return ok(keyValuePairs);

				case 'map-many':
					var answer = decoder.func;
					var decoders = decoder.decoders;
					for (var i = 0; i < decoders.length; i++) {
						var result = runHelp(decoders[i], value);
						if (result.tag !== 'ok') {
							return result;
						}
						answer = answer(result.value);
					}
					return ok(answer);

				case 'andThen':
					var result = runHelp(decoder.decoder, value);
					return result.tag !== 'ok' ? result : runHelp(decoder.callback(result.value), value);

				case 'oneOf':
					var errors = [];
					var temp = decoder.decoders;
					while (temp.ctor !== '[]') {
						var result = runHelp(temp._0, value);

						if (result.tag === 'ok') {
							return result;
						}

						errors.push(result);

						temp = temp._1;
					}
					return badOneOf(errors);

				case 'fail':
					return bad(decoder.msg);

				case 'succeed':
					return ok(decoder.msg);
			}
		}

		// EQUALITY

		function equality(a, b) {
			if (a === b) {
				return true;
			}

			if (a.tag !== b.tag) {
				return false;
			}

			switch (a.tag) {
				case 'succeed':
				case 'fail':
					return a.msg === b.msg;

				case 'bool':
				case 'int':
				case 'float':
				case 'string':
				case 'value':
					return true;

				case 'null':
					return a.value === b.value;

				case 'list':
				case 'array':
				case 'maybe':
				case 'key-value':
					return equality(a.decoder, b.decoder);

				case 'field':
					return a.field === b.field && equality(a.decoder, b.decoder);

				case 'index':
					return a.index === b.index && equality(a.decoder, b.decoder);

				case 'map-many':
					if (a.func !== b.func) {
						return false;
					}
					return listEquality(a.decoders, b.decoders);

				case 'andThen':
					return a.callback === b.callback && equality(a.decoder, b.decoder);

				case 'oneOf':
					return listEquality(a.decoders, b.decoders);
			}
		}

		function listEquality(aDecoders, bDecoders) {
			var len = aDecoders.length;
			if (len !== bDecoders.length) {
				return false;
			}
			for (var i = 0; i < len; i++) {
				if (!equality(aDecoders[i], bDecoders[i])) {
					return false;
				}
			}
			return true;
		}

		// ENCODE

		function encode(indentLevel, value) {
			return JSON.stringify(value, null, indentLevel);
		}

		function identity(value) {
			return value;
		}

		function encodeObject(keyValuePairs) {
			var obj = {};
			while (keyValuePairs.ctor !== '[]') {
				var pair = keyValuePairs._0;
				obj[pair._0] = pair._1;
				keyValuePairs = keyValuePairs._1;
			}
			return obj;
		}

		return {
			encode: F2(encode),
			runOnString: F2(runOnString),
			run: F2(run),

			decodeNull: decodeNull,
			decodePrimitive: decodePrimitive,
			decodeContainer: F2(decodeContainer),

			decodeField: F2(decodeField),
			decodeIndex: F2(decodeIndex),

			map1: F2(map1),
			map2: F3(map2),
			map3: F4(map3),
			map4: F5(map4),
			map5: F6(map5),
			map6: F7(map6),
			map7: F8(map7),
			map8: F9(map8),
			decodeKeyValuePairs: decodeKeyValuePairs,

			andThen: F2(andThen),
			fail: fail,
			succeed: succeed,
			oneOf: oneOf,

			identity: identity,
			encodeNull: null,
			encodeArray: _elm_lang$core$Native_Array.toJSArray,
			encodeList: _elm_lang$core$Native_List.toArray,
			encodeObject: encodeObject,

			equality: equality
		};
	}();

	var _elm_lang$core$Json_Encode$list = _elm_lang$core$Native_Json.encodeList;
	var _elm_lang$core$Json_Encode$array = _elm_lang$core$Native_Json.encodeArray;
	var _elm_lang$core$Json_Encode$object = _elm_lang$core$Native_Json.encodeObject;
	var _elm_lang$core$Json_Encode$null = _elm_lang$core$Native_Json.encodeNull;
	var _elm_lang$core$Json_Encode$bool = _elm_lang$core$Native_Json.identity;
	var _elm_lang$core$Json_Encode$float = _elm_lang$core$Native_Json.identity;
	var _elm_lang$core$Json_Encode$int = _elm_lang$core$Native_Json.identity;
	var _elm_lang$core$Json_Encode$string = _elm_lang$core$Native_Json.identity;
	var _elm_lang$core$Json_Encode$encode = _elm_lang$core$Native_Json.encode;
	var _elm_lang$core$Json_Encode$Value = { ctor: 'Value' };

	var _elm_lang$core$Json_Decode$null = _elm_lang$core$Native_Json.decodeNull;
	var _elm_lang$core$Json_Decode$value = _elm_lang$core$Native_Json.decodePrimitive('value');
	var _elm_lang$core$Json_Decode$andThen = _elm_lang$core$Native_Json.andThen;
	var _elm_lang$core$Json_Decode$fail = _elm_lang$core$Native_Json.fail;
	var _elm_lang$core$Json_Decode$succeed = _elm_lang$core$Native_Json.succeed;
	var _elm_lang$core$Json_Decode$lazy = function _elm_lang$core$Json_Decode$lazy(thunk) {
		return A2(_elm_lang$core$Json_Decode$andThen, thunk, _elm_lang$core$Json_Decode$succeed({ ctor: '_Tuple0' }));
	};
	var _elm_lang$core$Json_Decode$decodeValue = _elm_lang$core$Native_Json.run;
	var _elm_lang$core$Json_Decode$decodeString = _elm_lang$core$Native_Json.runOnString;
	var _elm_lang$core$Json_Decode$map8 = _elm_lang$core$Native_Json.map8;
	var _elm_lang$core$Json_Decode$map7 = _elm_lang$core$Native_Json.map7;
	var _elm_lang$core$Json_Decode$map6 = _elm_lang$core$Native_Json.map6;
	var _elm_lang$core$Json_Decode$map5 = _elm_lang$core$Native_Json.map5;
	var _elm_lang$core$Json_Decode$map4 = _elm_lang$core$Native_Json.map4;
	var _elm_lang$core$Json_Decode$map3 = _elm_lang$core$Native_Json.map3;
	var _elm_lang$core$Json_Decode$map2 = _elm_lang$core$Native_Json.map2;
	var _elm_lang$core$Json_Decode$map = _elm_lang$core$Native_Json.map1;
	var _elm_lang$core$Json_Decode$oneOf = _elm_lang$core$Native_Json.oneOf;
	var _elm_lang$core$Json_Decode$maybe = function _elm_lang$core$Json_Decode$maybe(decoder) {
		return A2(_elm_lang$core$Native_Json.decodeContainer, 'maybe', decoder);
	};
	var _elm_lang$core$Json_Decode$index = _elm_lang$core$Native_Json.decodeIndex;
	var _elm_lang$core$Json_Decode$field = _elm_lang$core$Native_Json.decodeField;
	var _elm_lang$core$Json_Decode$at = F2(function (fields, decoder) {
		return A3(_elm_lang$core$List$foldr, _elm_lang$core$Json_Decode$field, decoder, fields);
	});
	var _elm_lang$core$Json_Decode$keyValuePairs = _elm_lang$core$Native_Json.decodeKeyValuePairs;
	var _elm_lang$core$Json_Decode$dict = function _elm_lang$core$Json_Decode$dict(decoder) {
		return A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Dict$fromList, _elm_lang$core$Json_Decode$keyValuePairs(decoder));
	};
	var _elm_lang$core$Json_Decode$array = function _elm_lang$core$Json_Decode$array(decoder) {
		return A2(_elm_lang$core$Native_Json.decodeContainer, 'array', decoder);
	};
	var _elm_lang$core$Json_Decode$list = function _elm_lang$core$Json_Decode$list(decoder) {
		return A2(_elm_lang$core$Native_Json.decodeContainer, 'list', decoder);
	};
	var _elm_lang$core$Json_Decode$nullable = function _elm_lang$core$Json_Decode$nullable(decoder) {
		return _elm_lang$core$Json_Decode$oneOf({
			ctor: '::',
			_0: _elm_lang$core$Json_Decode$null(_elm_lang$core$Maybe$Nothing),
			_1: {
				ctor: '::',
				_0: A2(_elm_lang$core$Json_Decode$map, _elm_lang$core$Maybe$Just, decoder),
				_1: { ctor: '[]' }
			}
		});
	};
	var _elm_lang$core$Json_Decode$float = _elm_lang$core$Native_Json.decodePrimitive('float');
	var _elm_lang$core$Json_Decode$int = _elm_lang$core$Native_Json.decodePrimitive('int');
	var _elm_lang$core$Json_Decode$bool = _elm_lang$core$Native_Json.decodePrimitive('bool');
	var _elm_lang$core$Json_Decode$string = _elm_lang$core$Native_Json.decodePrimitive('string');
	var _elm_lang$core$Json_Decode$Decoder = { ctor: 'Decoder' };

	var _elm_lang$core$Tuple$mapSecond = F2(function (func, _p0) {
		var _p1 = _p0;
		return {
			ctor: '_Tuple2',
			_0: _p1._0,
			_1: func(_p1._1)
		};
	});
	var _elm_lang$core$Tuple$mapFirst = F2(function (func, _p2) {
		var _p3 = _p2;
		return {
			ctor: '_Tuple2',
			_0: func(_p3._0),
			_1: _p3._1
		};
	});
	var _elm_lang$core$Tuple$second = function _elm_lang$core$Tuple$second(_p4) {
		var _p5 = _p4;
		return _p5._1;
	};
	var _elm_lang$core$Tuple$first = function _elm_lang$core$Tuple$first(_p6) {
		var _p7 = _p6;
		return _p7._0;
	};

	var _elm_lang$dom$Native_Dom = function () {

		var fakeNode = {
			addEventListener: function addEventListener() {},
			removeEventListener: function removeEventListener() {}
		};

		var onDocument = on(typeof document !== 'undefined' ? document : fakeNode);
		var onWindow = on(typeof window !== 'undefined' ? window : fakeNode);

		function on(node) {
			return function (eventName, decoder, toTask) {
				return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {

					function performTask(event) {
						var result = A2(_elm_lang$core$Json_Decode$decodeValue, decoder, event);
						if (result.ctor === 'Ok') {
							_elm_lang$core$Native_Scheduler.rawSpawn(toTask(result._0));
						}
					}

					node.addEventListener(eventName, performTask);

					return function () {
						node.removeEventListener(eventName, performTask);
					};
				});
			};
		}

		var rAF = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : function (callback) {
			callback();
		};

		function withNode(id, doStuff) {
			return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
				rAF(function () {
					var node = document.getElementById(id);
					if (node === null) {
						callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'NotFound', _0: id }));
						return;
					}
					callback(_elm_lang$core$Native_Scheduler.succeed(doStuff(node)));
				});
			});
		}

		// FOCUS

		function focus(id) {
			return withNode(id, function (node) {
				node.focus();
				return _elm_lang$core$Native_Utils.Tuple0;
			});
		}

		function blur(id) {
			return withNode(id, function (node) {
				node.blur();
				return _elm_lang$core$Native_Utils.Tuple0;
			});
		}

		// SCROLLING

		function getScrollTop(id) {
			return withNode(id, function (node) {
				return node.scrollTop;
			});
		}

		function setScrollTop(id, desiredScrollTop) {
			return withNode(id, function (node) {
				node.scrollTop = desiredScrollTop;
				return _elm_lang$core$Native_Utils.Tuple0;
			});
		}

		function toBottom(id) {
			return withNode(id, function (node) {
				node.scrollTop = node.scrollHeight;
				return _elm_lang$core$Native_Utils.Tuple0;
			});
		}

		function getScrollLeft(id) {
			return withNode(id, function (node) {
				return node.scrollLeft;
			});
		}

		function setScrollLeft(id, desiredScrollLeft) {
			return withNode(id, function (node) {
				node.scrollLeft = desiredScrollLeft;
				return _elm_lang$core$Native_Utils.Tuple0;
			});
		}

		function toRight(id) {
			return withNode(id, function (node) {
				node.scrollLeft = node.scrollWidth;
				return _elm_lang$core$Native_Utils.Tuple0;
			});
		}

		// SIZE

		function width(options, id) {
			return withNode(id, function (node) {
				switch (options.ctor) {
					case 'Content':
						return node.scrollWidth;
					case 'VisibleContent':
						return node.clientWidth;
					case 'VisibleContentWithBorders':
						return node.offsetWidth;
					case 'VisibleContentWithBordersAndMargins':
						var rect = node.getBoundingClientRect();
						return rect.right - rect.left;
				}
			});
		}

		function height(options, id) {
			return withNode(id, function (node) {
				switch (options.ctor) {
					case 'Content':
						return node.scrollHeight;
					case 'VisibleContent':
						return node.clientHeight;
					case 'VisibleContentWithBorders':
						return node.offsetHeight;
					case 'VisibleContentWithBordersAndMargins':
						var rect = node.getBoundingClientRect();
						return rect.bottom - rect.top;
				}
			});
		}

		return {
			onDocument: F3(onDocument),
			onWindow: F3(onWindow),

			focus: focus,
			blur: blur,

			getScrollTop: getScrollTop,
			setScrollTop: F2(setScrollTop),
			getScrollLeft: getScrollLeft,
			setScrollLeft: F2(setScrollLeft),
			toBottom: toBottom,
			toRight: toRight,

			height: F2(height),
			width: F2(width)
		};
	}();

	var _elm_lang$dom$Dom$blur = _elm_lang$dom$Native_Dom.blur;
	var _elm_lang$dom$Dom$focus = _elm_lang$dom$Native_Dom.focus;
	var _elm_lang$dom$Dom$NotFound = function _elm_lang$dom$Dom$NotFound(a) {
		return { ctor: 'NotFound', _0: a };
	};

	var _elm_lang$virtual_dom$VirtualDom_Debug$wrap;
	var _elm_lang$virtual_dom$VirtualDom_Debug$wrapWithFlags;

	var _elm_lang$virtual_dom$Native_VirtualDom = function () {

		var STYLE_KEY = 'STYLE';
		var EVENT_KEY = 'EVENT';
		var ATTR_KEY = 'ATTR';
		var ATTR_NS_KEY = 'ATTR_NS';

		var localDoc = typeof document !== 'undefined' ? document : {};

		////////////  VIRTUAL DOM NODES  ////////////


		function text(string) {
			return {
				type: 'text',
				text: string
			};
		}

		function node(tag) {
			return F2(function (factList, kidList) {
				return nodeHelp(tag, factList, kidList);
			});
		}

		function nodeHelp(tag, factList, kidList) {
			var organized = organizeFacts(factList);
			var namespace = organized.namespace;
			var facts = organized.facts;

			var children = [];
			var descendantsCount = 0;
			while (kidList.ctor !== '[]') {
				var kid = kidList._0;
				descendantsCount += kid.descendantsCount || 0;
				children.push(kid);
				kidList = kidList._1;
			}
			descendantsCount += children.length;

			return {
				type: 'node',
				tag: tag,
				facts: facts,
				children: children,
				namespace: namespace,
				descendantsCount: descendantsCount
			};
		}

		function keyedNode(tag, factList, kidList) {
			var organized = organizeFacts(factList);
			var namespace = organized.namespace;
			var facts = organized.facts;

			var children = [];
			var descendantsCount = 0;
			while (kidList.ctor !== '[]') {
				var kid = kidList._0;
				descendantsCount += kid._1.descendantsCount || 0;
				children.push(kid);
				kidList = kidList._1;
			}
			descendantsCount += children.length;

			return {
				type: 'keyed-node',
				tag: tag,
				facts: facts,
				children: children,
				namespace: namespace,
				descendantsCount: descendantsCount
			};
		}

		function custom(factList, model, impl) {
			var facts = organizeFacts(factList).facts;

			return {
				type: 'custom',
				facts: facts,
				model: model,
				impl: impl
			};
		}

		function map(tagger, node) {
			return {
				type: 'tagger',
				tagger: tagger,
				node: node,
				descendantsCount: 1 + (node.descendantsCount || 0)
			};
		}

		function thunk(func, args, thunk) {
			return {
				type: 'thunk',
				func: func,
				args: args,
				thunk: thunk,
				node: undefined
			};
		}

		function lazy(fn, a) {
			return thunk(fn, [a], function () {
				return fn(a);
			});
		}

		function lazy2(fn, a, b) {
			return thunk(fn, [a, b], function () {
				return A2(fn, a, b);
			});
		}

		function lazy3(fn, a, b, c) {
			return thunk(fn, [a, b, c], function () {
				return A3(fn, a, b, c);
			});
		}

		// FACTS


		function organizeFacts(factList) {
			var namespace,
			    facts = {};

			while (factList.ctor !== '[]') {
				var entry = factList._0;
				var key = entry.key;

				if (key === ATTR_KEY || key === ATTR_NS_KEY || key === EVENT_KEY) {
					var subFacts = facts[key] || {};
					subFacts[entry.realKey] = entry.value;
					facts[key] = subFacts;
				} else if (key === STYLE_KEY) {
					var styles = facts[key] || {};
					var styleList = entry.value;
					while (styleList.ctor !== '[]') {
						var style = styleList._0;
						styles[style._0] = style._1;
						styleList = styleList._1;
					}
					facts[key] = styles;
				} else if (key === 'namespace') {
					namespace = entry.value;
				} else if (key === 'className') {
					var classes = facts[key];
					facts[key] = typeof classes === 'undefined' ? entry.value : classes + ' ' + entry.value;
				} else {
					facts[key] = entry.value;
				}
				factList = factList._1;
			}

			return {
				facts: facts,
				namespace: namespace
			};
		}

		////////////  PROPERTIES AND ATTRIBUTES  ////////////


		function style(value) {
			return {
				key: STYLE_KEY,
				value: value
			};
		}

		function property(key, value) {
			return {
				key: key,
				value: value
			};
		}

		function attribute(key, value) {
			return {
				key: ATTR_KEY,
				realKey: key,
				value: value
			};
		}

		function attributeNS(namespace, key, value) {
			return {
				key: ATTR_NS_KEY,
				realKey: key,
				value: {
					value: value,
					namespace: namespace
				}
			};
		}

		function on(name, options, decoder) {
			return {
				key: EVENT_KEY,
				realKey: name,
				value: {
					options: options,
					decoder: decoder
				}
			};
		}

		function equalEvents(a, b) {
			if (a.options !== b.options) {
				if (a.options.stopPropagation !== b.options.stopPropagation || a.options.preventDefault !== b.options.preventDefault) {
					return false;
				}
			}
			return _elm_lang$core$Native_Json.equality(a.decoder, b.decoder);
		}

		function mapProperty(func, property) {
			if (property.key !== EVENT_KEY) {
				return property;
			}
			return on(property.realKey, property.value.options, A2(_elm_lang$core$Json_Decode$map, func, property.value.decoder));
		}

		////////////  RENDER  ////////////


		function render(vNode, eventNode) {
			switch (vNode.type) {
				case 'thunk':
					if (!vNode.node) {
						vNode.node = vNode.thunk();
					}
					return render(vNode.node, eventNode);

				case 'tagger':
					var subNode = vNode.node;
					var tagger = vNode.tagger;

					while (subNode.type === 'tagger') {
						(typeof tagger === 'undefined' ? 'undefined' : _typeof(tagger)) !== 'object' ? tagger = [tagger, subNode.tagger] : tagger.push(subNode.tagger);

						subNode = subNode.node;
					}

					var subEventRoot = { tagger: tagger, parent: eventNode };
					var domNode = render(subNode, subEventRoot);
					domNode.elm_event_node_ref = subEventRoot;
					return domNode;

				case 'text':
					return localDoc.createTextNode(vNode.text);

				case 'node':
					var domNode = vNode.namespace ? localDoc.createElementNS(vNode.namespace, vNode.tag) : localDoc.createElement(vNode.tag);

					applyFacts(domNode, eventNode, vNode.facts);

					var children = vNode.children;

					for (var i = 0; i < children.length; i++) {
						domNode.appendChild(render(children[i], eventNode));
					}

					return domNode;

				case 'keyed-node':
					var domNode = vNode.namespace ? localDoc.createElementNS(vNode.namespace, vNode.tag) : localDoc.createElement(vNode.tag);

					applyFacts(domNode, eventNode, vNode.facts);

					var children = vNode.children;

					for (var i = 0; i < children.length; i++) {
						domNode.appendChild(render(children[i]._1, eventNode));
					}

					return domNode;

				case 'custom':
					var domNode = vNode.impl.render(vNode.model);
					applyFacts(domNode, eventNode, vNode.facts);
					return domNode;
			}
		}

		////////////  APPLY FACTS  ////////////


		function applyFacts(domNode, eventNode, facts) {
			for (var key in facts) {
				var value = facts[key];

				switch (key) {
					case STYLE_KEY:
						applyStyles(domNode, value);
						break;

					case EVENT_KEY:
						applyEvents(domNode, eventNode, value);
						break;

					case ATTR_KEY:
						applyAttrs(domNode, value);
						break;

					case ATTR_NS_KEY:
						applyAttrsNS(domNode, value);
						break;

					case 'value':
						if (domNode[key] !== value) {
							domNode[key] = value;
						}
						break;

					default:
						domNode[key] = value;
						break;
				}
			}
		}

		function applyStyles(domNode, styles) {
			var domNodeStyle = domNode.style;

			for (var key in styles) {
				domNodeStyle[key] = styles[key];
			}
		}

		function applyEvents(domNode, eventNode, events) {
			var allHandlers = domNode.elm_handlers || {};

			for (var key in events) {
				var handler = allHandlers[key];
				var value = events[key];

				if (typeof value === 'undefined') {
					domNode.removeEventListener(key, handler);
					allHandlers[key] = undefined;
				} else if (typeof handler === 'undefined') {
					var handler = makeEventHandler(eventNode, value);
					domNode.addEventListener(key, handler);
					allHandlers[key] = handler;
				} else {
					handler.info = value;
				}
			}

			domNode.elm_handlers = allHandlers;
		}

		function makeEventHandler(eventNode, info) {
			function eventHandler(event) {
				var info = eventHandler.info;

				var value = A2(_elm_lang$core$Native_Json.run, info.decoder, event);

				if (value.ctor === 'Ok') {
					var options = info.options;
					if (options.stopPropagation) {
						event.stopPropagation();
					}
					if (options.preventDefault) {
						event.preventDefault();
					}

					var message = value._0;

					var currentEventNode = eventNode;
					while (currentEventNode) {
						var tagger = currentEventNode.tagger;
						if (typeof tagger === 'function') {
							message = tagger(message);
						} else {
							for (var i = tagger.length; i--;) {
								message = tagger[i](message);
							}
						}
						currentEventNode = currentEventNode.parent;
					}
				}
			};

			eventHandler.info = info;

			return eventHandler;
		}

		function applyAttrs(domNode, attrs) {
			for (var key in attrs) {
				var value = attrs[key];
				if (typeof value === 'undefined') {
					domNode.removeAttribute(key);
				} else {
					domNode.setAttribute(key, value);
				}
			}
		}

		function applyAttrsNS(domNode, nsAttrs) {
			for (var key in nsAttrs) {
				var pair = nsAttrs[key];
				var namespace = pair.namespace;
				var value = pair.value;

				if (typeof value === 'undefined') {
					domNode.removeAttributeNS(namespace, key);
				} else {
					domNode.setAttributeNS(namespace, key, value);
				}
			}
		}

		////////////  DIFF  ////////////


		function diff(a, b) {
			var patches = [];
			diffHelp(a, b, patches, 0);
			return patches;
		}

		function makePatch(type, index, data) {
			return {
				index: index,
				type: type,
				data: data,
				domNode: undefined,
				eventNode: undefined
			};
		}

		function diffHelp(a, b, patches, index) {
			if (a === b) {
				return;
			}

			var aType = a.type;
			var bType = b.type;

			// Bail if you run into different types of nodes. Implies that the
			// structure has changed significantly and it's not worth a diff.
			if (aType !== bType) {
				patches.push(makePatch('p-redraw', index, b));
				return;
			}

			// Now we know that both nodes are the same type.
			switch (bType) {
				case 'thunk':
					var aArgs = a.args;
					var bArgs = b.args;
					var i = aArgs.length;
					var same = a.func === b.func && i === bArgs.length;
					while (same && i--) {
						same = aArgs[i] === bArgs[i];
					}
					if (same) {
						b.node = a.node;
						return;
					}
					b.node = b.thunk();
					var subPatches = [];
					diffHelp(a.node, b.node, subPatches, 0);
					if (subPatches.length > 0) {
						patches.push(makePatch('p-thunk', index, subPatches));
					}
					return;

				case 'tagger':
					// gather nested taggers
					var aTaggers = a.tagger;
					var bTaggers = b.tagger;
					var nesting = false;

					var aSubNode = a.node;
					while (aSubNode.type === 'tagger') {
						nesting = true;

						(typeof aTaggers === 'undefined' ? 'undefined' : _typeof(aTaggers)) !== 'object' ? aTaggers = [aTaggers, aSubNode.tagger] : aTaggers.push(aSubNode.tagger);

						aSubNode = aSubNode.node;
					}

					var bSubNode = b.node;
					while (bSubNode.type === 'tagger') {
						nesting = true;

						(typeof bTaggers === 'undefined' ? 'undefined' : _typeof(bTaggers)) !== 'object' ? bTaggers = [bTaggers, bSubNode.tagger] : bTaggers.push(bSubNode.tagger);

						bSubNode = bSubNode.node;
					}

					// Just bail if different numbers of taggers. This implies the
					// structure of the virtual DOM has changed.
					if (nesting && aTaggers.length !== bTaggers.length) {
						patches.push(makePatch('p-redraw', index, b));
						return;
					}

					// check if taggers are "the same"
					if (nesting ? !pairwiseRefEqual(aTaggers, bTaggers) : aTaggers !== bTaggers) {
						patches.push(makePatch('p-tagger', index, bTaggers));
					}

					// diff everything below the taggers
					diffHelp(aSubNode, bSubNode, patches, index + 1);
					return;

				case 'text':
					if (a.text !== b.text) {
						patches.push(makePatch('p-text', index, b.text));
						return;
					}

					return;

				case 'node':
					// Bail if obvious indicators have changed. Implies more serious
					// structural changes such that it's not worth it to diff.
					if (a.tag !== b.tag || a.namespace !== b.namespace) {
						patches.push(makePatch('p-redraw', index, b));
						return;
					}

					var factsDiff = diffFacts(a.facts, b.facts);

					if (typeof factsDiff !== 'undefined') {
						patches.push(makePatch('p-facts', index, factsDiff));
					}

					diffChildren(a, b, patches, index);
					return;

				case 'keyed-node':
					// Bail if obvious indicators have changed. Implies more serious
					// structural changes such that it's not worth it to diff.
					if (a.tag !== b.tag || a.namespace !== b.namespace) {
						patches.push(makePatch('p-redraw', index, b));
						return;
					}

					var factsDiff = diffFacts(a.facts, b.facts);

					if (typeof factsDiff !== 'undefined') {
						patches.push(makePatch('p-facts', index, factsDiff));
					}

					diffKeyedChildren(a, b, patches, index);
					return;

				case 'custom':
					if (a.impl !== b.impl) {
						patches.push(makePatch('p-redraw', index, b));
						return;
					}

					var factsDiff = diffFacts(a.facts, b.facts);
					if (typeof factsDiff !== 'undefined') {
						patches.push(makePatch('p-facts', index, factsDiff));
					}

					var patch = b.impl.diff(a, b);
					if (patch) {
						patches.push(makePatch('p-custom', index, patch));
						return;
					}

					return;
			}
		}

		// assumes the incoming arrays are the same length
		function pairwiseRefEqual(as, bs) {
			for (var i = 0; i < as.length; i++) {
				if (as[i] !== bs[i]) {
					return false;
				}
			}

			return true;
		}

		// TODO Instead of creating a new diff object, it's possible to just test if
		// there *is* a diff. During the actual patch, do the diff again and make the
		// modifications directly. This way, there's no new allocations. Worth it?
		function diffFacts(a, b, category) {
			var diff;

			// look for changes and removals
			for (var aKey in a) {
				if (aKey === STYLE_KEY || aKey === EVENT_KEY || aKey === ATTR_KEY || aKey === ATTR_NS_KEY) {
					var subDiff = diffFacts(a[aKey], b[aKey] || {}, aKey);
					if (subDiff) {
						diff = diff || {};
						diff[aKey] = subDiff;
					}
					continue;
				}

				// remove if not in the new facts
				if (!(aKey in b)) {
					diff = diff || {};
					diff[aKey] = typeof category === 'undefined' ? typeof a[aKey] === 'string' ? '' : null : category === STYLE_KEY ? '' : category === EVENT_KEY || category === ATTR_KEY ? undefined : { namespace: a[aKey].namespace, value: undefined };

					continue;
				}

				var aValue = a[aKey];
				var bValue = b[aKey];

				// reference equal, so don't worry about it
				if (aValue === bValue && aKey !== 'value' || category === EVENT_KEY && equalEvents(aValue, bValue)) {
					continue;
				}

				diff = diff || {};
				diff[aKey] = bValue;
			}

			// add new stuff
			for (var bKey in b) {
				if (!(bKey in a)) {
					diff = diff || {};
					diff[bKey] = b[bKey];
				}
			}

			return diff;
		}

		function diffChildren(aParent, bParent, patches, rootIndex) {
			var aChildren = aParent.children;
			var bChildren = bParent.children;

			var aLen = aChildren.length;
			var bLen = bChildren.length;

			// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

			if (aLen > bLen) {
				patches.push(makePatch('p-remove-last', rootIndex, aLen - bLen));
			} else if (aLen < bLen) {
				patches.push(makePatch('p-append', rootIndex, bChildren.slice(aLen)));
			}

			// PAIRWISE DIFF EVERYTHING ELSE

			var index = rootIndex;
			var minLen = aLen < bLen ? aLen : bLen;
			for (var i = 0; i < minLen; i++) {
				index++;
				var aChild = aChildren[i];
				diffHelp(aChild, bChildren[i], patches, index);
				index += aChild.descendantsCount || 0;
			}
		}

		////////////  KEYED DIFF  ////////////


		function diffKeyedChildren(aParent, bParent, patches, rootIndex) {
			var localPatches = [];

			var changes = {}; // Dict String Entry
			var inserts = []; // Array { index : Int, entry : Entry }
			// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

			var aChildren = aParent.children;
			var bChildren = bParent.children;
			var aLen = aChildren.length;
			var bLen = bChildren.length;
			var aIndex = 0;
			var bIndex = 0;

			var index = rootIndex;

			while (aIndex < aLen && bIndex < bLen) {
				var a = aChildren[aIndex];
				var b = bChildren[bIndex];

				var aKey = a._0;
				var bKey = b._0;
				var aNode = a._1;
				var bNode = b._1;

				// check if keys match

				if (aKey === bKey) {
					index++;
					diffHelp(aNode, bNode, localPatches, index);
					index += aNode.descendantsCount || 0;

					aIndex++;
					bIndex++;
					continue;
				}

				// look ahead 1 to detect insertions and removals.

				var aLookAhead = aIndex + 1 < aLen;
				var bLookAhead = bIndex + 1 < bLen;

				if (aLookAhead) {
					var aNext = aChildren[aIndex + 1];
					var aNextKey = aNext._0;
					var aNextNode = aNext._1;
					var oldMatch = bKey === aNextKey;
				}

				if (bLookAhead) {
					var bNext = bChildren[bIndex + 1];
					var bNextKey = bNext._0;
					var bNextNode = bNext._1;
					var newMatch = aKey === bNextKey;
				}

				// swap a and b
				if (aLookAhead && bLookAhead && newMatch && oldMatch) {
					index++;
					diffHelp(aNode, bNextNode, localPatches, index);
					insertNode(changes, localPatches, aKey, bNode, bIndex, inserts);
					index += aNode.descendantsCount || 0;

					index++;
					removeNode(changes, localPatches, aKey, aNextNode, index);
					index += aNextNode.descendantsCount || 0;

					aIndex += 2;
					bIndex += 2;
					continue;
				}

				// insert b
				if (bLookAhead && newMatch) {
					index++;
					insertNode(changes, localPatches, bKey, bNode, bIndex, inserts);
					diffHelp(aNode, bNextNode, localPatches, index);
					index += aNode.descendantsCount || 0;

					aIndex += 1;
					bIndex += 2;
					continue;
				}

				// remove a
				if (aLookAhead && oldMatch) {
					index++;
					removeNode(changes, localPatches, aKey, aNode, index);
					index += aNode.descendantsCount || 0;

					index++;
					diffHelp(aNextNode, bNode, localPatches, index);
					index += aNextNode.descendantsCount || 0;

					aIndex += 2;
					bIndex += 1;
					continue;
				}

				// remove a, insert b
				if (aLookAhead && bLookAhead && aNextKey === bNextKey) {
					index++;
					removeNode(changes, localPatches, aKey, aNode, index);
					insertNode(changes, localPatches, bKey, bNode, bIndex, inserts);
					index += aNode.descendantsCount || 0;

					index++;
					diffHelp(aNextNode, bNextNode, localPatches, index);
					index += aNextNode.descendantsCount || 0;

					aIndex += 2;
					bIndex += 2;
					continue;
				}

				break;
			}

			// eat up any remaining nodes with removeNode and insertNode

			while (aIndex < aLen) {
				index++;
				var a = aChildren[aIndex];
				var aNode = a._1;
				removeNode(changes, localPatches, a._0, aNode, index);
				index += aNode.descendantsCount || 0;
				aIndex++;
			}

			var endInserts;
			while (bIndex < bLen) {
				endInserts = endInserts || [];
				var b = bChildren[bIndex];
				insertNode(changes, localPatches, b._0, b._1, undefined, endInserts);
				bIndex++;
			}

			if (localPatches.length > 0 || inserts.length > 0 || typeof endInserts !== 'undefined') {
				patches.push(makePatch('p-reorder', rootIndex, {
					patches: localPatches,
					inserts: inserts,
					endInserts: endInserts
				}));
			}
		}

		////////////  CHANGES FROM KEYED DIFF  ////////////


		var POSTFIX = '_elmW6BL';

		function insertNode(changes, localPatches, key, vnode, bIndex, inserts) {
			var entry = changes[key];

			// never seen this key before
			if (typeof entry === 'undefined') {
				entry = {
					tag: 'insert',
					vnode: vnode,
					index: bIndex,
					data: undefined
				};

				inserts.push({ index: bIndex, entry: entry });
				changes[key] = entry;

				return;
			}

			// this key was removed earlier, a match!
			if (entry.tag === 'remove') {
				inserts.push({ index: bIndex, entry: entry });

				entry.tag = 'move';
				var subPatches = [];
				diffHelp(entry.vnode, vnode, subPatches, entry.index);
				entry.index = bIndex;
				entry.data.data = {
					patches: subPatches,
					entry: entry
				};

				return;
			}

			// this key has already been inserted or moved, a duplicate!
			insertNode(changes, localPatches, key + POSTFIX, vnode, bIndex, inserts);
		}

		function removeNode(changes, localPatches, key, vnode, index) {
			var entry = changes[key];

			// never seen this key before
			if (typeof entry === 'undefined') {
				var patch = makePatch('p-remove', index, undefined);
				localPatches.push(patch);

				changes[key] = {
					tag: 'remove',
					vnode: vnode,
					index: index,
					data: patch
				};

				return;
			}

			// this key was inserted earlier, a match!
			if (entry.tag === 'insert') {
				entry.tag = 'move';
				var subPatches = [];
				diffHelp(vnode, entry.vnode, subPatches, index);

				var patch = makePatch('p-remove', index, {
					patches: subPatches,
					entry: entry
				});
				localPatches.push(patch);

				return;
			}

			// this key has already been removed or moved, a duplicate!
			removeNode(changes, localPatches, key + POSTFIX, vnode, index);
		}

		////////////  ADD DOM NODES  ////////////
		//
		// Each DOM node has an "index" assigned in order of traversal. It is important
		// to minimize our crawl over the actual DOM, so these indexes (along with the
		// descendantsCount of virtual nodes) let us skip touching entire subtrees of
		// the DOM if we know there are no patches there.


		function addDomNodes(domNode, vNode, patches, eventNode) {
			addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.descendantsCount, eventNode);
		}

		// assumes `patches` is non-empty and indexes increase monotonically.
		function addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode) {
			var patch = patches[i];
			var index = patch.index;

			while (index === low) {
				var patchType = patch.type;

				if (patchType === 'p-thunk') {
					addDomNodes(domNode, vNode.node, patch.data, eventNode);
				} else if (patchType === 'p-reorder') {
					patch.domNode = domNode;
					patch.eventNode = eventNode;

					var subPatches = patch.data.patches;
					if (subPatches.length > 0) {
						addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
					}
				} else if (patchType === 'p-remove') {
					patch.domNode = domNode;
					patch.eventNode = eventNode;

					var data = patch.data;
					if (typeof data !== 'undefined') {
						data.entry.data = domNode;
						var subPatches = data.patches;
						if (subPatches.length > 0) {
							addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
						}
					}
				} else {
					patch.domNode = domNode;
					patch.eventNode = eventNode;
				}

				i++;

				if (!(patch = patches[i]) || (index = patch.index) > high) {
					return i;
				}
			}

			switch (vNode.type) {
				case 'tagger':
					var subNode = vNode.node;

					while (subNode.type === "tagger") {
						subNode = subNode.node;
					}

					return addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);

				case 'node':
					var vChildren = vNode.children;
					var childNodes = domNode.childNodes;
					for (var j = 0; j < vChildren.length; j++) {
						low++;
						var vChild = vChildren[j];
						var nextLow = low + (vChild.descendantsCount || 0);
						if (low <= index && index <= nextLow) {
							i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
							if (!(patch = patches[i]) || (index = patch.index) > high) {
								return i;
							}
						}
						low = nextLow;
					}
					return i;

				case 'keyed-node':
					var vChildren = vNode.children;
					var childNodes = domNode.childNodes;
					for (var j = 0; j < vChildren.length; j++) {
						low++;
						var vChild = vChildren[j]._1;
						var nextLow = low + (vChild.descendantsCount || 0);
						if (low <= index && index <= nextLow) {
							i = addDomNodesHelp(childNodes[j], vChild, patches, i, low, nextLow, eventNode);
							if (!(patch = patches[i]) || (index = patch.index) > high) {
								return i;
							}
						}
						low = nextLow;
					}
					return i;

				case 'text':
				case 'thunk':
					throw new Error('should never traverse `text` or `thunk` nodes like this');
			}
		}

		////////////  APPLY PATCHES  ////////////


		function applyPatches(rootDomNode, oldVirtualNode, patches, eventNode) {
			if (patches.length === 0) {
				return rootDomNode;
			}

			addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
			return applyPatchesHelp(rootDomNode, patches);
		}

		function applyPatchesHelp(rootDomNode, patches) {
			for (var i = 0; i < patches.length; i++) {
				var patch = patches[i];
				var localDomNode = patch.domNode;
				var newNode = applyPatch(localDomNode, patch);
				if (localDomNode === rootDomNode) {
					rootDomNode = newNode;
				}
			}
			return rootDomNode;
		}

		function applyPatch(domNode, patch) {
			switch (patch.type) {
				case 'p-redraw':
					return applyPatchRedraw(domNode, patch.data, patch.eventNode);

				case 'p-facts':
					applyFacts(domNode, patch.eventNode, patch.data);
					return domNode;

				case 'p-text':
					domNode.replaceData(0, domNode.length, patch.data);
					return domNode;

				case 'p-thunk':
					return applyPatchesHelp(domNode, patch.data);

				case 'p-tagger':
					if (typeof domNode.elm_event_node_ref !== 'undefined') {
						domNode.elm_event_node_ref.tagger = patch.data;
					} else {
						domNode.elm_event_node_ref = { tagger: patch.data, parent: patch.eventNode };
					}
					return domNode;

				case 'p-remove-last':
					var i = patch.data;
					while (i--) {
						domNode.removeChild(domNode.lastChild);
					}
					return domNode;

				case 'p-append':
					var newNodes = patch.data;
					for (var i = 0; i < newNodes.length; i++) {
						domNode.appendChild(render(newNodes[i], patch.eventNode));
					}
					return domNode;

				case 'p-remove':
					var data = patch.data;
					if (typeof data === 'undefined') {
						domNode.parentNode.removeChild(domNode);
						return domNode;
					}
					var entry = data.entry;
					if (typeof entry.index !== 'undefined') {
						domNode.parentNode.removeChild(domNode);
					}
					entry.data = applyPatchesHelp(domNode, data.patches);
					return domNode;

				case 'p-reorder':
					return applyPatchReorder(domNode, patch);

				case 'p-custom':
					var impl = patch.data;
					return impl.applyPatch(domNode, impl.data);

				default:
					throw new Error('Ran into an unknown patch!');
			}
		}

		function applyPatchRedraw(domNode, vNode, eventNode) {
			var parentNode = domNode.parentNode;
			var newNode = render(vNode, eventNode);

			if (typeof newNode.elm_event_node_ref === 'undefined') {
				newNode.elm_event_node_ref = domNode.elm_event_node_ref;
			}

			if (parentNode && newNode !== domNode) {
				parentNode.replaceChild(newNode, domNode);
			}
			return newNode;
		}

		function applyPatchReorder(domNode, patch) {
			var data = patch.data;

			// remove end inserts
			var frag = applyPatchReorderEndInsertsHelp(data.endInserts, patch);

			// removals
			domNode = applyPatchesHelp(domNode, data.patches);

			// inserts
			var inserts = data.inserts;
			for (var i = 0; i < inserts.length; i++) {
				var insert = inserts[i];
				var entry = insert.entry;
				var node = entry.tag === 'move' ? entry.data : render(entry.vnode, patch.eventNode);
				domNode.insertBefore(node, domNode.childNodes[insert.index]);
			}

			// add end inserts
			if (typeof frag !== 'undefined') {
				domNode.appendChild(frag);
			}

			return domNode;
		}

		function applyPatchReorderEndInsertsHelp(endInserts, patch) {
			if (typeof endInserts === 'undefined') {
				return;
			}

			var frag = localDoc.createDocumentFragment();
			for (var i = 0; i < endInserts.length; i++) {
				var insert = endInserts[i];
				var entry = insert.entry;
				frag.appendChild(entry.tag === 'move' ? entry.data : render(entry.vnode, patch.eventNode));
			}
			return frag;
		}

		// PROGRAMS

		var program = makeProgram(checkNoFlags);
		var programWithFlags = makeProgram(checkYesFlags);

		function makeProgram(flagChecker) {
			return F2(function (debugWrap, impl) {
				return function (flagDecoder) {
					return function (object, moduleName, debugMetadata) {
						var checker = flagChecker(flagDecoder, moduleName);
						if (typeof debugMetadata === 'undefined') {
							normalSetup(impl, object, moduleName, checker);
						} else {
							debugSetup(A2(debugWrap, debugMetadata, impl), object, moduleName, checker);
						}
					};
				};
			});
		}

		function staticProgram(vNode) {
			var nothing = _elm_lang$core$Native_Utils.Tuple2(_elm_lang$core$Native_Utils.Tuple0, _elm_lang$core$Platform_Cmd$none);
			return A2(program, _elm_lang$virtual_dom$VirtualDom_Debug$wrap, {
				init: nothing,
				view: function view() {
					return vNode;
				},
				update: F2(function () {
					return nothing;
				}),
				subscriptions: function subscriptions() {
					return _elm_lang$core$Platform_Sub$none;
				}
			})();
		}

		// FLAG CHECKERS

		function checkNoFlags(flagDecoder, moduleName) {
			return function (init, flags, domNode) {
				if (typeof flags === 'undefined') {
					return init;
				}

				var errorMessage = 'The `' + moduleName + '` module does not need flags.\n' + 'Initialize it with no arguments and you should be all set!';

				crash(errorMessage, domNode);
			};
		}

		function checkYesFlags(flagDecoder, moduleName) {
			return function (init, flags, domNode) {
				if (typeof flagDecoder === 'undefined') {
					var errorMessage = 'Are you trying to sneak a Never value into Elm? Trickster!\n' + 'It looks like ' + moduleName + '.main is defined with `programWithFlags` but has type `Program Never`.\n' + 'Use `program` instead if you do not want flags.';

					crash(errorMessage, domNode);
				}

				var result = A2(_elm_lang$core$Native_Json.run, flagDecoder, flags);
				if (result.ctor === 'Ok') {
					return init(result._0);
				}

				var errorMessage = 'Trying to initialize the `' + moduleName + '` module with an unexpected flag.\n' + 'I tried to convert it to an Elm value, but ran into this problem:\n\n' + result._0;

				crash(errorMessage, domNode);
			};
		}

		function crash(errorMessage, domNode) {
			if (domNode) {
				domNode.innerHTML = '<div style="padding-left:1em;">' + '<h2 style="font-weight:normal;"><b>Oops!</b> Something went wrong when starting your Elm program.</h2>' + '<pre style="padding-left:1em;">' + errorMessage + '</pre>' + '</div>';
			}

			throw new Error(errorMessage);
		}

		//  NORMAL SETUP

		function normalSetup(impl, object, moduleName, flagChecker) {
			object['embed'] = function embed(node, flags) {
				while (node.lastChild) {
					node.removeChild(node.lastChild);
				}

				return _elm_lang$core$Native_Platform.initialize(flagChecker(impl.init, flags, node), impl.update, impl.subscriptions, normalRenderer(node, impl.view));
			};

			object['fullscreen'] = function fullscreen(flags) {
				return _elm_lang$core$Native_Platform.initialize(flagChecker(impl.init, flags, document.body), impl.update, impl.subscriptions, normalRenderer(document.body, impl.view));
			};
		}

		function normalRenderer(parentNode, view) {
			return function (tagger, initialModel) {
				var eventNode = { tagger: tagger, parent: undefined };
				var initialVirtualNode = view(initialModel);
				var domNode = render(initialVirtualNode, eventNode);
				parentNode.appendChild(domNode);
				return makeStepper(domNode, view, initialVirtualNode, eventNode);
			};
		}

		// STEPPER

		var rAF = typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : function (callback) {
			setTimeout(callback, 1000 / 60);
		};

		function makeStepper(domNode, view, initialVirtualNode, eventNode) {
			var state = 'NO_REQUEST';
			var currNode = initialVirtualNode;
			var nextModel;

			function updateIfNeeded() {
				switch (state) {
					case 'NO_REQUEST':
						throw new Error('Unexpected draw callback.\n' + 'Please report this to <https://github.com/elm-lang/virtual-dom/issues>.');

					case 'PENDING_REQUEST':
						rAF(updateIfNeeded);
						state = 'EXTRA_REQUEST';

						var nextNode = view(nextModel);
						var patches = diff(currNode, nextNode);
						domNode = applyPatches(domNode, currNode, patches, eventNode);
						currNode = nextNode;

						return;

					case 'EXTRA_REQUEST':
						state = 'NO_REQUEST';
						return;
				}
			}

			return function stepper(model) {
				if (state === 'NO_REQUEST') {
					rAF(updateIfNeeded);
				}
				state = 'PENDING_REQUEST';
				nextModel = model;
			};
		}

		// DEBUG SETUP

		function debugSetup(impl, object, moduleName, flagChecker) {
			object['fullscreen'] = function fullscreen(flags) {
				var popoutRef = { doc: undefined };
				return _elm_lang$core$Native_Platform.initialize(flagChecker(impl.init, flags, document.body), impl.update(scrollTask(popoutRef)), impl.subscriptions, debugRenderer(moduleName, document.body, popoutRef, impl.view, impl.viewIn, impl.viewOut));
			};

			object['embed'] = function fullscreen(node, flags) {
				var popoutRef = { doc: undefined };
				return _elm_lang$core$Native_Platform.initialize(flagChecker(impl.init, flags, node), impl.update(scrollTask(popoutRef)), impl.subscriptions, debugRenderer(moduleName, node, popoutRef, impl.view, impl.viewIn, impl.viewOut));
			};
		}

		function scrollTask(popoutRef) {
			return _elm_lang$core$Native_Scheduler.nativeBinding(function (callback) {
				var doc = popoutRef.doc;
				if (doc) {
					var msgs = doc.getElementsByClassName('debugger-sidebar-messages')[0];
					if (msgs) {
						msgs.scrollTop = msgs.scrollHeight;
					}
				}
				callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
			});
		}

		function debugRenderer(moduleName, parentNode, popoutRef, view, viewIn, viewOut) {
			return function (tagger, initialModel) {
				var appEventNode = { tagger: tagger, parent: undefined };
				var eventNode = { tagger: tagger, parent: undefined };

				// make normal stepper
				var appVirtualNode = view(initialModel);
				var appNode = render(appVirtualNode, appEventNode);
				parentNode.appendChild(appNode);
				var appStepper = makeStepper(appNode, view, appVirtualNode, appEventNode);

				// make overlay stepper
				var overVirtualNode = viewIn(initialModel)._1;
				var overNode = render(overVirtualNode, eventNode);
				parentNode.appendChild(overNode);
				var wrappedViewIn = wrapViewIn(appEventNode, overNode, viewIn);
				var overStepper = makeStepper(overNode, wrappedViewIn, overVirtualNode, eventNode);

				// make debugger stepper
				var debugStepper = makeDebugStepper(initialModel, viewOut, eventNode, parentNode, moduleName, popoutRef);

				return function stepper(model) {
					appStepper(model);
					overStepper(model);
					debugStepper(model);
				};
			};
		}

		function makeDebugStepper(initialModel, view, eventNode, parentNode, moduleName, popoutRef) {
			var curr;
			var domNode;

			return function stepper(model) {
				if (!model.isDebuggerOpen) {
					return;
				}

				if (!popoutRef.doc) {
					curr = view(model);
					domNode = openDebugWindow(moduleName, popoutRef, curr, eventNode);
					return;
				}

				// switch to document of popout
				localDoc = popoutRef.doc;

				var next = view(model);
				var patches = diff(curr, next);
				domNode = applyPatches(domNode, curr, patches, eventNode);
				curr = next;

				// switch back to normal document
				localDoc = document;
			};
		}

		function openDebugWindow(moduleName, popoutRef, virtualNode, eventNode) {
			var w = 900;
			var h = 360;
			var x = screen.width - w;
			var y = screen.height - h;
			var debugWindow = window.open('', '', 'width=' + w + ',height=' + h + ',left=' + x + ',top=' + y);

			// switch to window document
			localDoc = debugWindow.document;

			popoutRef.doc = localDoc;
			localDoc.title = 'Debugger - ' + moduleName;
			localDoc.body.style.margin = '0';
			localDoc.body.style.padding = '0';
			var domNode = render(virtualNode, eventNode);
			localDoc.body.appendChild(domNode);

			localDoc.addEventListener('keydown', function (event) {
				if (event.metaKey && event.which === 82) {
					window.location.reload();
				}
				if (event.which === 38) {
					eventNode.tagger({ ctor: 'Up' });
					event.preventDefault();
				}
				if (event.which === 40) {
					eventNode.tagger({ ctor: 'Down' });
					event.preventDefault();
				}
			});

			function close() {
				popoutRef.doc = undefined;
				debugWindow.close();
			}
			window.addEventListener('unload', close);
			debugWindow.addEventListener('unload', function () {
				popoutRef.doc = undefined;
				window.removeEventListener('unload', close);
				eventNode.tagger({ ctor: 'Close' });
			});

			// switch back to the normal document
			localDoc = document;

			return domNode;
		}

		// BLOCK EVENTS

		function wrapViewIn(appEventNode, overlayNode, viewIn) {
			var ignorer = makeIgnorer(overlayNode);
			var blocking = 'Normal';
			var overflow;

			var normalTagger = appEventNode.tagger;
			var blockTagger = function blockTagger() {};

			return function (model) {
				var tuple = viewIn(model);
				var newBlocking = tuple._0.ctor;
				appEventNode.tagger = newBlocking === 'Normal' ? normalTagger : blockTagger;
				if (blocking !== newBlocking) {
					traverse('removeEventListener', ignorer, blocking);
					traverse('addEventListener', ignorer, newBlocking);

					if (blocking === 'Normal') {
						overflow = document.body.style.overflow;
						document.body.style.overflow = 'hidden';
					}

					if (newBlocking === 'Normal') {
						document.body.style.overflow = overflow;
					}

					blocking = newBlocking;
				}
				return tuple._1;
			};
		}

		function traverse(verbEventListener, ignorer, blocking) {
			switch (blocking) {
				case 'Normal':
					return;

				case 'Pause':
					return traverseHelp(verbEventListener, ignorer, mostEvents);

				case 'Message':
					return traverseHelp(verbEventListener, ignorer, allEvents);
			}
		}

		function traverseHelp(verbEventListener, handler, eventNames) {
			for (var i = 0; i < eventNames.length; i++) {
				document.body[verbEventListener](eventNames[i], handler, true);
			}
		}

		function makeIgnorer(overlayNode) {
			return function (event) {
				if (event.type === 'keydown' && event.metaKey && event.which === 82) {
					return;
				}

				var isScroll = event.type === 'scroll' || event.type === 'wheel';

				var node = event.target;
				while (node !== null) {
					if (node.className === 'elm-overlay-message-details' && isScroll) {
						return;
					}

					if (node === overlayNode && !isScroll) {
						return;
					}
					node = node.parentNode;
				}

				event.stopPropagation();
				event.preventDefault();
			};
		}

		var mostEvents = ['click', 'dblclick', 'mousemove', 'mouseup', 'mousedown', 'mouseenter', 'mouseleave', 'touchstart', 'touchend', 'touchcancel', 'touchmove', 'pointerdown', 'pointerup', 'pointerover', 'pointerout', 'pointerenter', 'pointerleave', 'pointermove', 'pointercancel', 'dragstart', 'drag', 'dragend', 'dragenter', 'dragover', 'dragleave', 'drop', 'keyup', 'keydown', 'keypress', 'input', 'change', 'focus', 'blur'];

		var allEvents = mostEvents.concat('wheel', 'scroll');

		return {
			node: node,
			text: text,
			custom: custom,
			map: F2(map),

			on: F3(on),
			style: style,
			property: F2(property),
			attribute: F2(attribute),
			attributeNS: F3(attributeNS),
			mapProperty: F2(mapProperty),

			lazy: F2(lazy),
			lazy2: F3(lazy2),
			lazy3: F4(lazy3),
			keyedNode: F3(keyedNode),

			program: program,
			programWithFlags: programWithFlags,
			staticProgram: staticProgram
		};
	}();

	var _elm_lang$virtual_dom$VirtualDom$programWithFlags = function _elm_lang$virtual_dom$VirtualDom$programWithFlags(impl) {
		return A2(_elm_lang$virtual_dom$Native_VirtualDom.programWithFlags, _elm_lang$virtual_dom$VirtualDom_Debug$wrapWithFlags, impl);
	};
	var _elm_lang$virtual_dom$VirtualDom$program = function _elm_lang$virtual_dom$VirtualDom$program(impl) {
		return A2(_elm_lang$virtual_dom$Native_VirtualDom.program, _elm_lang$virtual_dom$VirtualDom_Debug$wrap, impl);
	};
	var _elm_lang$virtual_dom$VirtualDom$keyedNode = _elm_lang$virtual_dom$Native_VirtualDom.keyedNode;
	var _elm_lang$virtual_dom$VirtualDom$lazy3 = _elm_lang$virtual_dom$Native_VirtualDom.lazy3;
	var _elm_lang$virtual_dom$VirtualDom$lazy2 = _elm_lang$virtual_dom$Native_VirtualDom.lazy2;
	var _elm_lang$virtual_dom$VirtualDom$lazy = _elm_lang$virtual_dom$Native_VirtualDom.lazy;
	var _elm_lang$virtual_dom$VirtualDom$defaultOptions = { stopPropagation: false, preventDefault: false };
	var _elm_lang$virtual_dom$VirtualDom$onWithOptions = _elm_lang$virtual_dom$Native_VirtualDom.on;
	var _elm_lang$virtual_dom$VirtualDom$on = F2(function (eventName, decoder) {
		return A3(_elm_lang$virtual_dom$VirtualDom$onWithOptions, eventName, _elm_lang$virtual_dom$VirtualDom$defaultOptions, decoder);
	});
	var _elm_lang$virtual_dom$VirtualDom$style = _elm_lang$virtual_dom$Native_VirtualDom.style;
	var _elm_lang$virtual_dom$VirtualDom$mapProperty = _elm_lang$virtual_dom$Native_VirtualDom.mapProperty;
	var _elm_lang$virtual_dom$VirtualDom$attributeNS = _elm_lang$virtual_dom$Native_VirtualDom.attributeNS;
	var _elm_lang$virtual_dom$VirtualDom$attribute = _elm_lang$virtual_dom$Native_VirtualDom.attribute;
	var _elm_lang$virtual_dom$VirtualDom$property = _elm_lang$virtual_dom$Native_VirtualDom.property;
	var _elm_lang$virtual_dom$VirtualDom$map = _elm_lang$virtual_dom$Native_VirtualDom.map;
	var _elm_lang$virtual_dom$VirtualDom$text = _elm_lang$virtual_dom$Native_VirtualDom.text;
	var _elm_lang$virtual_dom$VirtualDom$node = _elm_lang$virtual_dom$Native_VirtualDom.node;
	var _elm_lang$virtual_dom$VirtualDom$Options = F2(function (a, b) {
		return { stopPropagation: a, preventDefault: b };
	});
	var _elm_lang$virtual_dom$VirtualDom$Node = { ctor: 'Node' };
	var _elm_lang$virtual_dom$VirtualDom$Property = { ctor: 'Property' };

	var _elm_lang$html$Html$programWithFlags = _elm_lang$virtual_dom$VirtualDom$programWithFlags;
	var _elm_lang$html$Html$program = _elm_lang$virtual_dom$VirtualDom$program;
	var _elm_lang$html$Html$beginnerProgram = function _elm_lang$html$Html$beginnerProgram(_p0) {
		var _p1 = _p0;
		return _elm_lang$html$Html$program({
			init: A2(_elm_lang$core$Platform_Cmd_ops['!'], _p1.model, { ctor: '[]' }),
			update: F2(function (msg, model) {
				return A2(_elm_lang$core$Platform_Cmd_ops['!'], A2(_p1.update, msg, model), { ctor: '[]' });
			}),
			view: _p1.view,
			subscriptions: function subscriptions(_p2) {
				return _elm_lang$core$Platform_Sub$none;
			}
		});
	};
	var _elm_lang$html$Html$map = _elm_lang$virtual_dom$VirtualDom$map;
	var _elm_lang$html$Html$text = _elm_lang$virtual_dom$VirtualDom$text;
	var _elm_lang$html$Html$node = _elm_lang$virtual_dom$VirtualDom$node;
	var _elm_lang$html$Html$body = _elm_lang$html$Html$node('body');
	var _elm_lang$html$Html$section = _elm_lang$html$Html$node('section');
	var _elm_lang$html$Html$nav = _elm_lang$html$Html$node('nav');
	var _elm_lang$html$Html$article = _elm_lang$html$Html$node('article');
	var _elm_lang$html$Html$aside = _elm_lang$html$Html$node('aside');
	var _elm_lang$html$Html$h1 = _elm_lang$html$Html$node('h1');
	var _elm_lang$html$Html$h2 = _elm_lang$html$Html$node('h2');
	var _elm_lang$html$Html$h3 = _elm_lang$html$Html$node('h3');
	var _elm_lang$html$Html$h4 = _elm_lang$html$Html$node('h4');
	var _elm_lang$html$Html$h5 = _elm_lang$html$Html$node('h5');
	var _elm_lang$html$Html$h6 = _elm_lang$html$Html$node('h6');
	var _elm_lang$html$Html$header = _elm_lang$html$Html$node('header');
	var _elm_lang$html$Html$footer = _elm_lang$html$Html$node('footer');
	var _elm_lang$html$Html$address = _elm_lang$html$Html$node('address');
	var _elm_lang$html$Html$main_ = _elm_lang$html$Html$node('main');
	var _elm_lang$html$Html$p = _elm_lang$html$Html$node('p');
	var _elm_lang$html$Html$hr = _elm_lang$html$Html$node('hr');
	var _elm_lang$html$Html$pre = _elm_lang$html$Html$node('pre');
	var _elm_lang$html$Html$blockquote = _elm_lang$html$Html$node('blockquote');
	var _elm_lang$html$Html$ol = _elm_lang$html$Html$node('ol');
	var _elm_lang$html$Html$ul = _elm_lang$html$Html$node('ul');
	var _elm_lang$html$Html$li = _elm_lang$html$Html$node('li');
	var _elm_lang$html$Html$dl = _elm_lang$html$Html$node('dl');
	var _elm_lang$html$Html$dt = _elm_lang$html$Html$node('dt');
	var _elm_lang$html$Html$dd = _elm_lang$html$Html$node('dd');
	var _elm_lang$html$Html$figure = _elm_lang$html$Html$node('figure');
	var _elm_lang$html$Html$figcaption = _elm_lang$html$Html$node('figcaption');
	var _elm_lang$html$Html$div = _elm_lang$html$Html$node('div');
	var _elm_lang$html$Html$a = _elm_lang$html$Html$node('a');
	var _elm_lang$html$Html$em = _elm_lang$html$Html$node('em');
	var _elm_lang$html$Html$strong = _elm_lang$html$Html$node('strong');
	var _elm_lang$html$Html$small = _elm_lang$html$Html$node('small');
	var _elm_lang$html$Html$s = _elm_lang$html$Html$node('s');
	var _elm_lang$html$Html$cite = _elm_lang$html$Html$node('cite');
	var _elm_lang$html$Html$q = _elm_lang$html$Html$node('q');
	var _elm_lang$html$Html$dfn = _elm_lang$html$Html$node('dfn');
	var _elm_lang$html$Html$abbr = _elm_lang$html$Html$node('abbr');
	var _elm_lang$html$Html$time = _elm_lang$html$Html$node('time');
	var _elm_lang$html$Html$code = _elm_lang$html$Html$node('code');
	var _elm_lang$html$Html$var = _elm_lang$html$Html$node('var');
	var _elm_lang$html$Html$samp = _elm_lang$html$Html$node('samp');
	var _elm_lang$html$Html$kbd = _elm_lang$html$Html$node('kbd');
	var _elm_lang$html$Html$sub = _elm_lang$html$Html$node('sub');
	var _elm_lang$html$Html$sup = _elm_lang$html$Html$node('sup');
	var _elm_lang$html$Html$i = _elm_lang$html$Html$node('i');
	var _elm_lang$html$Html$b = _elm_lang$html$Html$node('b');
	var _elm_lang$html$Html$u = _elm_lang$html$Html$node('u');
	var _elm_lang$html$Html$mark = _elm_lang$html$Html$node('mark');
	var _elm_lang$html$Html$ruby = _elm_lang$html$Html$node('ruby');
	var _elm_lang$html$Html$rt = _elm_lang$html$Html$node('rt');
	var _elm_lang$html$Html$rp = _elm_lang$html$Html$node('rp');
	var _elm_lang$html$Html$bdi = _elm_lang$html$Html$node('bdi');
	var _elm_lang$html$Html$bdo = _elm_lang$html$Html$node('bdo');
	var _elm_lang$html$Html$span = _elm_lang$html$Html$node('span');
	var _elm_lang$html$Html$br = _elm_lang$html$Html$node('br');
	var _elm_lang$html$Html$wbr = _elm_lang$html$Html$node('wbr');
	var _elm_lang$html$Html$ins = _elm_lang$html$Html$node('ins');
	var _elm_lang$html$Html$del = _elm_lang$html$Html$node('del');
	var _elm_lang$html$Html$img = _elm_lang$html$Html$node('img');
	var _elm_lang$html$Html$iframe = _elm_lang$html$Html$node('iframe');
	var _elm_lang$html$Html$embed = _elm_lang$html$Html$node('embed');
	var _elm_lang$html$Html$object = _elm_lang$html$Html$node('object');
	var _elm_lang$html$Html$param = _elm_lang$html$Html$node('param');
	var _elm_lang$html$Html$video = _elm_lang$html$Html$node('video');
	var _elm_lang$html$Html$audio = _elm_lang$html$Html$node('audio');
	var _elm_lang$html$Html$source = _elm_lang$html$Html$node('source');
	var _elm_lang$html$Html$track = _elm_lang$html$Html$node('track');
	var _elm_lang$html$Html$canvas = _elm_lang$html$Html$node('canvas');
	var _elm_lang$html$Html$math = _elm_lang$html$Html$node('math');
	var _elm_lang$html$Html$table = _elm_lang$html$Html$node('table');
	var _elm_lang$html$Html$caption = _elm_lang$html$Html$node('caption');
	var _elm_lang$html$Html$colgroup = _elm_lang$html$Html$node('colgroup');
	var _elm_lang$html$Html$col = _elm_lang$html$Html$node('col');
	var _elm_lang$html$Html$tbody = _elm_lang$html$Html$node('tbody');
	var _elm_lang$html$Html$thead = _elm_lang$html$Html$node('thead');
	var _elm_lang$html$Html$tfoot = _elm_lang$html$Html$node('tfoot');
	var _elm_lang$html$Html$tr = _elm_lang$html$Html$node('tr');
	var _elm_lang$html$Html$td = _elm_lang$html$Html$node('td');
	var _elm_lang$html$Html$th = _elm_lang$html$Html$node('th');
	var _elm_lang$html$Html$form = _elm_lang$html$Html$node('form');
	var _elm_lang$html$Html$fieldset = _elm_lang$html$Html$node('fieldset');
	var _elm_lang$html$Html$legend = _elm_lang$html$Html$node('legend');
	var _elm_lang$html$Html$label = _elm_lang$html$Html$node('label');
	var _elm_lang$html$Html$input = _elm_lang$html$Html$node('input');
	var _elm_lang$html$Html$button = _elm_lang$html$Html$node('button');
	var _elm_lang$html$Html$select = _elm_lang$html$Html$node('select');
	var _elm_lang$html$Html$datalist = _elm_lang$html$Html$node('datalist');
	var _elm_lang$html$Html$optgroup = _elm_lang$html$Html$node('optgroup');
	var _elm_lang$html$Html$option = _elm_lang$html$Html$node('option');
	var _elm_lang$html$Html$textarea = _elm_lang$html$Html$node('textarea');
	var _elm_lang$html$Html$keygen = _elm_lang$html$Html$node('keygen');
	var _elm_lang$html$Html$output = _elm_lang$html$Html$node('output');
	var _elm_lang$html$Html$progress = _elm_lang$html$Html$node('progress');
	var _elm_lang$html$Html$meter = _elm_lang$html$Html$node('meter');
	var _elm_lang$html$Html$details = _elm_lang$html$Html$node('details');
	var _elm_lang$html$Html$summary = _elm_lang$html$Html$node('summary');
	var _elm_lang$html$Html$menuitem = _elm_lang$html$Html$node('menuitem');
	var _elm_lang$html$Html$menu = _elm_lang$html$Html$node('menu');

	var _elm_lang$html$Html_Attributes$map = _elm_lang$virtual_dom$VirtualDom$mapProperty;
	var _elm_lang$html$Html_Attributes$attribute = _elm_lang$virtual_dom$VirtualDom$attribute;
	var _elm_lang$html$Html_Attributes$contextmenu = function _elm_lang$html$Html_Attributes$contextmenu(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'contextmenu', value);
	};
	var _elm_lang$html$Html_Attributes$draggable = function _elm_lang$html$Html_Attributes$draggable(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'draggable', value);
	};
	var _elm_lang$html$Html_Attributes$itemprop = function _elm_lang$html$Html_Attributes$itemprop(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'itemprop', value);
	};
	var _elm_lang$html$Html_Attributes$tabindex = function _elm_lang$html$Html_Attributes$tabindex(n) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'tabIndex', _elm_lang$core$Basics$toString(n));
	};
	var _elm_lang$html$Html_Attributes$charset = function _elm_lang$html$Html_Attributes$charset(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'charset', value);
	};
	var _elm_lang$html$Html_Attributes$height = function _elm_lang$html$Html_Attributes$height(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'height', _elm_lang$core$Basics$toString(value));
	};
	var _elm_lang$html$Html_Attributes$width = function _elm_lang$html$Html_Attributes$width(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'width', _elm_lang$core$Basics$toString(value));
	};
	var _elm_lang$html$Html_Attributes$formaction = function _elm_lang$html$Html_Attributes$formaction(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'formAction', value);
	};
	var _elm_lang$html$Html_Attributes$list = function _elm_lang$html$Html_Attributes$list(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'list', value);
	};
	var _elm_lang$html$Html_Attributes$minlength = function _elm_lang$html$Html_Attributes$minlength(n) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'minLength', _elm_lang$core$Basics$toString(n));
	};
	var _elm_lang$html$Html_Attributes$maxlength = function _elm_lang$html$Html_Attributes$maxlength(n) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'maxlength', _elm_lang$core$Basics$toString(n));
	};
	var _elm_lang$html$Html_Attributes$size = function _elm_lang$html$Html_Attributes$size(n) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'size', _elm_lang$core$Basics$toString(n));
	};
	var _elm_lang$html$Html_Attributes$form = function _elm_lang$html$Html_Attributes$form(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'form', value);
	};
	var _elm_lang$html$Html_Attributes$cols = function _elm_lang$html$Html_Attributes$cols(n) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'cols', _elm_lang$core$Basics$toString(n));
	};
	var _elm_lang$html$Html_Attributes$rows = function _elm_lang$html$Html_Attributes$rows(n) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'rows', _elm_lang$core$Basics$toString(n));
	};
	var _elm_lang$html$Html_Attributes$challenge = function _elm_lang$html$Html_Attributes$challenge(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'challenge', value);
	};
	var _elm_lang$html$Html_Attributes$media = function _elm_lang$html$Html_Attributes$media(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'media', value);
	};
	var _elm_lang$html$Html_Attributes$rel = function _elm_lang$html$Html_Attributes$rel(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'rel', value);
	};
	var _elm_lang$html$Html_Attributes$datetime = function _elm_lang$html$Html_Attributes$datetime(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'datetime', value);
	};
	var _elm_lang$html$Html_Attributes$pubdate = function _elm_lang$html$Html_Attributes$pubdate(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'pubdate', value);
	};
	var _elm_lang$html$Html_Attributes$colspan = function _elm_lang$html$Html_Attributes$colspan(n) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'colspan', _elm_lang$core$Basics$toString(n));
	};
	var _elm_lang$html$Html_Attributes$rowspan = function _elm_lang$html$Html_Attributes$rowspan(n) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'rowspan', _elm_lang$core$Basics$toString(n));
	};
	var _elm_lang$html$Html_Attributes$manifest = function _elm_lang$html$Html_Attributes$manifest(value) {
		return A2(_elm_lang$html$Html_Attributes$attribute, 'manifest', value);
	};
	var _elm_lang$html$Html_Attributes$property = _elm_lang$virtual_dom$VirtualDom$property;
	var _elm_lang$html$Html_Attributes$stringProperty = F2(function (name, string) {
		return A2(_elm_lang$html$Html_Attributes$property, name, _elm_lang$core$Json_Encode$string(string));
	});
	var _elm_lang$html$Html_Attributes$class = function _elm_lang$html$Html_Attributes$class(name) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'className', name);
	};
	var _elm_lang$html$Html_Attributes$id = function _elm_lang$html$Html_Attributes$id(name) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'id', name);
	};
	var _elm_lang$html$Html_Attributes$title = function _elm_lang$html$Html_Attributes$title(name) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'title', name);
	};
	var _elm_lang$html$Html_Attributes$accesskey = function _elm_lang$html$Html_Attributes$accesskey($char) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'accessKey', _elm_lang$core$String$fromChar($char));
	};
	var _elm_lang$html$Html_Attributes$dir = function _elm_lang$html$Html_Attributes$dir(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dir', value);
	};
	var _elm_lang$html$Html_Attributes$dropzone = function _elm_lang$html$Html_Attributes$dropzone(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'dropzone', value);
	};
	var _elm_lang$html$Html_Attributes$lang = function _elm_lang$html$Html_Attributes$lang(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'lang', value);
	};
	var _elm_lang$html$Html_Attributes$content = function _elm_lang$html$Html_Attributes$content(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'content', value);
	};
	var _elm_lang$html$Html_Attributes$httpEquiv = function _elm_lang$html$Html_Attributes$httpEquiv(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'httpEquiv', value);
	};
	var _elm_lang$html$Html_Attributes$language = function _elm_lang$html$Html_Attributes$language(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'language', value);
	};
	var _elm_lang$html$Html_Attributes$src = function _elm_lang$html$Html_Attributes$src(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'src', value);
	};
	var _elm_lang$html$Html_Attributes$alt = function _elm_lang$html$Html_Attributes$alt(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'alt', value);
	};
	var _elm_lang$html$Html_Attributes$preload = function _elm_lang$html$Html_Attributes$preload(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'preload', value);
	};
	var _elm_lang$html$Html_Attributes$poster = function _elm_lang$html$Html_Attributes$poster(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'poster', value);
	};
	var _elm_lang$html$Html_Attributes$kind = function _elm_lang$html$Html_Attributes$kind(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'kind', value);
	};
	var _elm_lang$html$Html_Attributes$srclang = function _elm_lang$html$Html_Attributes$srclang(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srclang', value);
	};
	var _elm_lang$html$Html_Attributes$sandbox = function _elm_lang$html$Html_Attributes$sandbox(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'sandbox', value);
	};
	var _elm_lang$html$Html_Attributes$srcdoc = function _elm_lang$html$Html_Attributes$srcdoc(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'srcdoc', value);
	};
	var _elm_lang$html$Html_Attributes$type_ = function _elm_lang$html$Html_Attributes$type_(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'type', value);
	};
	var _elm_lang$html$Html_Attributes$value = function _elm_lang$html$Html_Attributes$value(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'value', value);
	};
	var _elm_lang$html$Html_Attributes$defaultValue = function _elm_lang$html$Html_Attributes$defaultValue(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'defaultValue', value);
	};
	var _elm_lang$html$Html_Attributes$placeholder = function _elm_lang$html$Html_Attributes$placeholder(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'placeholder', value);
	};
	var _elm_lang$html$Html_Attributes$accept = function _elm_lang$html$Html_Attributes$accept(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'accept', value);
	};
	var _elm_lang$html$Html_Attributes$acceptCharset = function _elm_lang$html$Html_Attributes$acceptCharset(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'acceptCharset', value);
	};
	var _elm_lang$html$Html_Attributes$action = function _elm_lang$html$Html_Attributes$action(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'action', value);
	};
	var _elm_lang$html$Html_Attributes$autocomplete = function _elm_lang$html$Html_Attributes$autocomplete(bool) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'autocomplete', bool ? 'on' : 'off');
	};
	var _elm_lang$html$Html_Attributes$enctype = function _elm_lang$html$Html_Attributes$enctype(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'enctype', value);
	};
	var _elm_lang$html$Html_Attributes$method = function _elm_lang$html$Html_Attributes$method(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'method', value);
	};
	var _elm_lang$html$Html_Attributes$name = function _elm_lang$html$Html_Attributes$name(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'name', value);
	};
	var _elm_lang$html$Html_Attributes$pattern = function _elm_lang$html$Html_Attributes$pattern(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'pattern', value);
	};
	var _elm_lang$html$Html_Attributes$for = function _elm_lang$html$Html_Attributes$for(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'htmlFor', value);
	};
	var _elm_lang$html$Html_Attributes$max = function _elm_lang$html$Html_Attributes$max(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'max', value);
	};
	var _elm_lang$html$Html_Attributes$min = function _elm_lang$html$Html_Attributes$min(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'min', value);
	};
	var _elm_lang$html$Html_Attributes$step = function _elm_lang$html$Html_Attributes$step(n) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'step', n);
	};
	var _elm_lang$html$Html_Attributes$wrap = function _elm_lang$html$Html_Attributes$wrap(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'wrap', value);
	};
	var _elm_lang$html$Html_Attributes$usemap = function _elm_lang$html$Html_Attributes$usemap(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'useMap', value);
	};
	var _elm_lang$html$Html_Attributes$shape = function _elm_lang$html$Html_Attributes$shape(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'shape', value);
	};
	var _elm_lang$html$Html_Attributes$coords = function _elm_lang$html$Html_Attributes$coords(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'coords', value);
	};
	var _elm_lang$html$Html_Attributes$keytype = function _elm_lang$html$Html_Attributes$keytype(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'keytype', value);
	};
	var _elm_lang$html$Html_Attributes$align = function _elm_lang$html$Html_Attributes$align(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'align', value);
	};
	var _elm_lang$html$Html_Attributes$cite = function _elm_lang$html$Html_Attributes$cite(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'cite', value);
	};
	var _elm_lang$html$Html_Attributes$href = function _elm_lang$html$Html_Attributes$href(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'href', value);
	};
	var _elm_lang$html$Html_Attributes$target = function _elm_lang$html$Html_Attributes$target(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'target', value);
	};
	var _elm_lang$html$Html_Attributes$downloadAs = function _elm_lang$html$Html_Attributes$downloadAs(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'download', value);
	};
	var _elm_lang$html$Html_Attributes$hreflang = function _elm_lang$html$Html_Attributes$hreflang(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'hreflang', value);
	};
	var _elm_lang$html$Html_Attributes$ping = function _elm_lang$html$Html_Attributes$ping(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'ping', value);
	};
	var _elm_lang$html$Html_Attributes$start = function _elm_lang$html$Html_Attributes$start(n) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'start', _elm_lang$core$Basics$toString(n));
	};
	var _elm_lang$html$Html_Attributes$headers = function _elm_lang$html$Html_Attributes$headers(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'headers', value);
	};
	var _elm_lang$html$Html_Attributes$scope = function _elm_lang$html$Html_Attributes$scope(value) {
		return A2(_elm_lang$html$Html_Attributes$stringProperty, 'scope', value);
	};
	var _elm_lang$html$Html_Attributes$boolProperty = F2(function (name, bool) {
		return A2(_elm_lang$html$Html_Attributes$property, name, _elm_lang$core$Json_Encode$bool(bool));
	});
	var _elm_lang$html$Html_Attributes$hidden = function _elm_lang$html$Html_Attributes$hidden(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'hidden', bool);
	};
	var _elm_lang$html$Html_Attributes$contenteditable = function _elm_lang$html$Html_Attributes$contenteditable(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'contentEditable', bool);
	};
	var _elm_lang$html$Html_Attributes$spellcheck = function _elm_lang$html$Html_Attributes$spellcheck(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'spellcheck', bool);
	};
	var _elm_lang$html$Html_Attributes$async = function _elm_lang$html$Html_Attributes$async(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'async', bool);
	};
	var _elm_lang$html$Html_Attributes$defer = function _elm_lang$html$Html_Attributes$defer(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'defer', bool);
	};
	var _elm_lang$html$Html_Attributes$scoped = function _elm_lang$html$Html_Attributes$scoped(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'scoped', bool);
	};
	var _elm_lang$html$Html_Attributes$autoplay = function _elm_lang$html$Html_Attributes$autoplay(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autoplay', bool);
	};
	var _elm_lang$html$Html_Attributes$controls = function _elm_lang$html$Html_Attributes$controls(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'controls', bool);
	};
	var _elm_lang$html$Html_Attributes$loop = function _elm_lang$html$Html_Attributes$loop(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'loop', bool);
	};
	var _elm_lang$html$Html_Attributes$default = function _elm_lang$html$Html_Attributes$default(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'default', bool);
	};
	var _elm_lang$html$Html_Attributes$seamless = function _elm_lang$html$Html_Attributes$seamless(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'seamless', bool);
	};
	var _elm_lang$html$Html_Attributes$checked = function _elm_lang$html$Html_Attributes$checked(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'checked', bool);
	};
	var _elm_lang$html$Html_Attributes$selected = function _elm_lang$html$Html_Attributes$selected(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'selected', bool);
	};
	var _elm_lang$html$Html_Attributes$autofocus = function _elm_lang$html$Html_Attributes$autofocus(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'autofocus', bool);
	};
	var _elm_lang$html$Html_Attributes$disabled = function _elm_lang$html$Html_Attributes$disabled(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'disabled', bool);
	};
	var _elm_lang$html$Html_Attributes$multiple = function _elm_lang$html$Html_Attributes$multiple(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'multiple', bool);
	};
	var _elm_lang$html$Html_Attributes$novalidate = function _elm_lang$html$Html_Attributes$novalidate(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'noValidate', bool);
	};
	var _elm_lang$html$Html_Attributes$readonly = function _elm_lang$html$Html_Attributes$readonly(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'readOnly', bool);
	};
	var _elm_lang$html$Html_Attributes$required = function _elm_lang$html$Html_Attributes$required(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'required', bool);
	};
	var _elm_lang$html$Html_Attributes$ismap = function _elm_lang$html$Html_Attributes$ismap(value) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'isMap', value);
	};
	var _elm_lang$html$Html_Attributes$download = function _elm_lang$html$Html_Attributes$download(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'download', bool);
	};
	var _elm_lang$html$Html_Attributes$reversed = function _elm_lang$html$Html_Attributes$reversed(bool) {
		return A2(_elm_lang$html$Html_Attributes$boolProperty, 'reversed', bool);
	};
	var _elm_lang$html$Html_Attributes$classList = function _elm_lang$html$Html_Attributes$classList(list) {
		return _elm_lang$html$Html_Attributes$class(A2(_elm_lang$core$String$join, ' ', A2(_elm_lang$core$List$map, _elm_lang$core$Tuple$first, A2(_elm_lang$core$List$filter, _elm_lang$core$Tuple$second, list))));
	};
	var _elm_lang$html$Html_Attributes$style = _elm_lang$virtual_dom$VirtualDom$style;

	var _elm_lang$html$Html_Events$keyCode = A2(_elm_lang$core$Json_Decode$field, 'keyCode', _elm_lang$core$Json_Decode$int);
	var _elm_lang$html$Html_Events$targetChecked = A2(_elm_lang$core$Json_Decode$at, {
		ctor: '::',
		_0: 'target',
		_1: {
			ctor: '::',
			_0: 'checked',
			_1: { ctor: '[]' }
		}
	}, _elm_lang$core$Json_Decode$bool);
	var _elm_lang$html$Html_Events$targetValue = A2(_elm_lang$core$Json_Decode$at, {
		ctor: '::',
		_0: 'target',
		_1: {
			ctor: '::',
			_0: 'value',
			_1: { ctor: '[]' }
		}
	}, _elm_lang$core$Json_Decode$string);
	var _elm_lang$html$Html_Events$defaultOptions = _elm_lang$virtual_dom$VirtualDom$defaultOptions;
	var _elm_lang$html$Html_Events$onWithOptions = _elm_lang$virtual_dom$VirtualDom$onWithOptions;
	var _elm_lang$html$Html_Events$on = _elm_lang$virtual_dom$VirtualDom$on;
	var _elm_lang$html$Html_Events$onFocus = function _elm_lang$html$Html_Events$onFocus(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'focus', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onBlur = function _elm_lang$html$Html_Events$onBlur(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'blur', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onSubmitOptions = _elm_lang$core$Native_Utils.update(_elm_lang$html$Html_Events$defaultOptions, { preventDefault: true });
	var _elm_lang$html$Html_Events$onSubmit = function _elm_lang$html$Html_Events$onSubmit(msg) {
		return A3(_elm_lang$html$Html_Events$onWithOptions, 'submit', _elm_lang$html$Html_Events$onSubmitOptions, _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onCheck = function _elm_lang$html$Html_Events$onCheck(tagger) {
		return A2(_elm_lang$html$Html_Events$on, 'change', A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetChecked));
	};
	var _elm_lang$html$Html_Events$onInput = function _elm_lang$html$Html_Events$onInput(tagger) {
		return A2(_elm_lang$html$Html_Events$on, 'input', A2(_elm_lang$core$Json_Decode$map, tagger, _elm_lang$html$Html_Events$targetValue));
	};
	var _elm_lang$html$Html_Events$onMouseOut = function _elm_lang$html$Html_Events$onMouseOut(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'mouseout', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onMouseOver = function _elm_lang$html$Html_Events$onMouseOver(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'mouseover', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onMouseLeave = function _elm_lang$html$Html_Events$onMouseLeave(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'mouseleave', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onMouseEnter = function _elm_lang$html$Html_Events$onMouseEnter(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'mouseenter', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onMouseUp = function _elm_lang$html$Html_Events$onMouseUp(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'mouseup', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onMouseDown = function _elm_lang$html$Html_Events$onMouseDown(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'mousedown', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onDoubleClick = function _elm_lang$html$Html_Events$onDoubleClick(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'dblclick', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$onClick = function _elm_lang$html$Html_Events$onClick(msg) {
		return A2(_elm_lang$html$Html_Events$on, 'click', _elm_lang$core$Json_Decode$succeed(msg));
	};
	var _elm_lang$html$Html_Events$Options = F2(function (a, b) {
		return { stopPropagation: a, preventDefault: b };
	});

	var _larribas$elm_image_slider$ImageSlider$onKeyDown = function _larribas$elm_image_slider$ImageSlider$onKeyDown(keysAndMsgs) {
		var handle = function handle(keyCode) {
			var _p0 = A2(_elm_lang$core$Dict$get, keyCode, keysAndMsgs);
			if (_p0.ctor === 'Just') {
				return _elm_lang$core$Json_Decode$succeed(_p0._0);
			} else {
				return _elm_lang$core$Json_Decode$fail(A2(_elm_lang$core$Basics_ops['++'], 'Unexpected keyCode ', _elm_lang$core$Basics$toString(keyCode)));
			}
		};
		return A2(_elm_lang$html$Html_Events$on, 'keydown', A2(_elm_lang$core$Json_Decode$andThen, handle, _elm_lang$html$Html_Events$keyCode));
	};
	var _larribas$elm_image_slider$ImageSlider$Config = F4(function (a, b, c, d) {
		return { originalUrl: a, thumbnailUrl: b, alt: c, caption: d };
	});
	var _larribas$elm_image_slider$ImageSlider$ShowSlide = function _larribas$elm_image_slider$ImageSlider$ShowSlide(a) {
		return { ctor: 'ShowSlide', _0: a };
	};
	var _larribas$elm_image_slider$ImageSlider$viewThumbnail = F5(function (conf, offset, focusedSlide, i, image) {
		return A2(_elm_lang$html$Html$img, {
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$src(conf.thumbnailUrl(image)),
			_1: {
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$alt(conf.alt(image)),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$classList({
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 'image-slider-current-image',
							_1: _elm_lang$core$Native_Utils.eq(i, focusedSlide - offset)
						},
						_1: { ctor: '[]' }
					}),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Events$onClick(_larribas$elm_image_slider$ImageSlider$ShowSlide(i + offset)),
						_1: { ctor: '[]' }
					}
				}
			}
		}, { ctor: '[]' });
	});
	var _larribas$elm_image_slider$ImageSlider$viewThumbnails = F3(function (conf, slides, focusedSlide) {
		var totalSlides = _elm_lang$core$Array$length(slides);
		var _p1 = function () {
			var _p2 = { ctor: '_Tuple2', _0: focusedSlide - 2, _1: focusedSlide + 2 };
			var lowerIndex = _p2._0;
			var upperIndex = _p2._1;
			return _elm_lang$core$Native_Utils.cmp(totalSlides, 5) < 1 ? { ctor: '_Tuple2', _0: slides, _1: 0 } : _elm_lang$core$Native_Utils.cmp(lowerIndex, 0) < 0 ? {
				ctor: '_Tuple2',
				_0: A3(_elm_lang$core$Array$slice, 0, 4, slides),
				_1: 0
			} : _elm_lang$core$Native_Utils.cmp(upperIndex, totalSlides) > -1 ? {
				ctor: '_Tuple2',
				_0: A3(_elm_lang$core$Array$slice, -4, totalSlides, slides),
				_1: totalSlides - 4
			} : {
				ctor: '_Tuple2',
				_0: A3(_elm_lang$core$Array$slice, lowerIndex, upperIndex, slides),
				_1: lowerIndex
			};
		}();
		var slidesToShow = _p1._0;
		var offset = _p1._1;
		return A2(_elm_lang$html$Html$div, {
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$class('image-slider-all-images-container'),
			_1: { ctor: '[]' }
		}, _elm_lang$core$Array$toList(A2(_elm_lang$core$Array$indexedMap, A3(_larribas$elm_image_slider$ImageSlider$viewThumbnail, conf, offset, focusedSlide), slidesToShow)));
	});
	var _larribas$elm_image_slider$ImageSlider$view = F3(function (conf, slides, _p3) {
		var _p4 = _p3;
		var _p7 = _p4._0;
		var previous = _elm_lang$core$Native_Utils.cmp(_p7, 0) > 0 ? _p7 - 1 : 0;
		var length = _elm_lang$core$Array$length(slides);
		var isLastSlide = _elm_lang$core$Native_Utils.cmp(_p7, length - 1) > -1;
		var focused = _elm_lang$core$Native_Utils.cmp(_p7, 0) > -1 && _elm_lang$core$Native_Utils.cmp(_p7, length) < 0 ? _p7 : 0;
		var next = _elm_lang$core$Native_Utils.cmp(_p7, 0) > -1 && _elm_lang$core$Native_Utils.cmp(_p7, length - 1) < 0 ? _p7 + 1 : length - 1;
		var isFirstSlide = _elm_lang$core$Native_Utils.eq(_p7, 0);
		return A2(_elm_lang$html$Html$div, {
			ctor: '::',
			_0: _elm_lang$html$Html_Attributes$id('image-slider-container'),
			_1: {
				ctor: '::',
				_0: _larribas$elm_image_slider$ImageSlider$onKeyDown(_elm_lang$core$Dict$fromList({
					ctor: '::',
					_0: {
						ctor: '_Tuple2',
						_0: 37,
						_1: _larribas$elm_image_slider$ImageSlider$ShowSlide(previous)
					},
					_1: {
						ctor: '::',
						_0: {
							ctor: '_Tuple2',
							_0: 39,
							_1: _larribas$elm_image_slider$ImageSlider$ShowSlide(next)
						},
						_1: { ctor: '[]' }
					}
				})),
				_1: {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$tabindex(1),
					_1: { ctor: '[]' }
				}
			}
		}, {
			ctor: '::',
			_0: A2(_elm_lang$html$Html$div, {
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('image-slider-navigation-container'),
				_1: { ctor: '[]' }
			}, {
				ctor: '::',
				_0: A2(_elm_lang$html$Html$i, {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('image-slider-button image-slider-previous-button fa fa-chevron-left'),
					_1: {
						ctor: '::',
						_0: _elm_lang$html$Html_Events$onClick(_larribas$elm_image_slider$ImageSlider$ShowSlide(previous)),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$classList({
								ctor: '::',
								_0: { ctor: '_Tuple2', _0: 'image-slider-hidden', _1: isFirstSlide },
								_1: { ctor: '[]' }
							}),
							_1: { ctor: '[]' }
						}
					}
				}, { ctor: '[]' }),
				_1: {
					ctor: '::',
					_0: A2(_elm_lang$html$Html$div, {
						ctor: '::',
						_0: _elm_lang$html$Html_Attributes$class('image-slider-image-container'),
						_1: { ctor: '[]' }
					}, function () {
						var _p5 = A2(_elm_lang$core$Array$get, focused, slides);
						if (_p5.ctor === 'Just') {
							var _p6 = _p5._0;
							return {
								ctor: '::',
								_0: A2(_elm_lang$html$Html$img, {
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('image-slider-image-main'),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Attributes$src(conf.originalUrl(_p6)),
										_1: {
											ctor: '::',
											_0: _elm_lang$html$Html_Attributes$alt(conf.alt(_p6)),
											_1: { ctor: '[]' }
										}
									}
								}, { ctor: '[]' }),
								_1: {
									ctor: '::',
									_0: conf.caption(_p6),
									_1: { ctor: '[]' }
								}
							};
						} else {
							return {
								ctor: '::',
								_0: A2(_elm_lang$html$Html$span, {
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('image-slider-no-images'),
									_1: { ctor: '[]' }
								}, { ctor: '[]' }),
								_1: { ctor: '[]' }
							};
						}
					}()),
					_1: {
						ctor: '::',
						_0: A2(_elm_lang$html$Html$i, {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('image-slider-button image-slider-next-button fa fa-chevron-right'),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Events$onClick(_larribas$elm_image_slider$ImageSlider$ShowSlide(next)),
								_1: {
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$classList({
										ctor: '::',
										_0: { ctor: '_Tuple2', _0: 'image-slider-hidden', _1: isLastSlide },
										_1: { ctor: '[]' }
									}),
									_1: { ctor: '[]' }
								}
							}
						}, { ctor: '[]' }),
						_1: { ctor: '[]' }
					}
				}
			}),
			_1: {
				ctor: '::',
				_0: A3(_larribas$elm_image_slider$ImageSlider$viewThumbnails, conf, slides, _p7),
				_1: { ctor: '[]' }
			}
		});
	});
	var _larribas$elm_image_slider$ImageSlider$State = function _larribas$elm_image_slider$ImageSlider$State(a) {
		return { ctor: 'State', _0: a };
	};
	var _larribas$elm_image_slider$ImageSlider$init = function _larribas$elm_image_slider$ImageSlider$init(i) {
		return {
			ctor: '_Tuple2',
			_0: _larribas$elm_image_slider$ImageSlider$State(i),
			_1: A2(_elm_lang$core$Task$attempt, function (_p8) {
				return _larribas$elm_image_slider$ImageSlider$ShowSlide(i);
			}, _elm_lang$dom$Dom$focus('image-slider-container'))
		};
	};
	var _larribas$elm_image_slider$ImageSlider$update = F2(function (msg, _p9) {
		var _p10 = msg;
		return _larribas$elm_image_slider$ImageSlider$State(_p10._0);
	});

	var _user$project$Gallery$exampleImages = {
		ctor: '::',
		_0: { alt: 'Alternativ Text', src: 'http://givemeareason-official.netlify.com/static/18672986_302050763573256_2992321066351487101_o-91e86ce4f17390cee9ae9f551174d6f0-d14e0.jpg' },
		_1: {
			ctor: '::',
			_0: { alt: 'alt 2', src: 'http://givemeareason-official.netlify.com/static/28378028_416887728756225_3617264513967785531_n-6cce4676f6bb54a95e5bb4c1723ddace-02605.jpg' },
			_1: { ctor: '[]' }
		}
	};
	var _user$project$Gallery$onEscape = function _user$project$Gallery$onEscape(msg) {
		var handle = function handle(keyCode) {
			return _elm_lang$core$Native_Utils.eq(keyCode, 27) ? _elm_lang$core$Json_Decode$succeed(msg) : _elm_lang$core$Json_Decode$fail(A2(_elm_lang$core$Basics_ops['++'], 'Unexpected keyCode ', _elm_lang$core$Basics$toString(keyCode)));
		};
		return A2(_elm_lang$html$Html_Events$on, 'keydown', A2(_elm_lang$core$Json_Decode$andThen, handle, _elm_lang$html$Html_Events$keyCode));
	};
	var _user$project$Gallery$subscriptions = function _user$project$Gallery$subscriptions(model) {
		return _elm_lang$core$Platform_Sub$none;
	};
	var _user$project$Gallery$init = {
		ctor: '_Tuple2',
		_0: { images: _user$project$Gallery$exampleImages, slider: _elm_lang$core$Maybe$Nothing },
		_1: _elm_lang$core$Platform_Cmd$none
	};
	var _user$project$Gallery$Image = F2(function (a, b) {
		return { src: a, alt: b };
	});
	var _user$project$Gallery$firstImage = function _user$project$Gallery$firstImage(images) {
		return function (_) {
			return _.src;
		}(A2(_elm_lang$core$Maybe$withDefault, A2(_user$project$Gallery$Image, '', ''), _elm_lang$core$List$head(images)));
	};
	var _user$project$Gallery$Model = F2(function (a, b) {
		return { images: a, slider: b };
	});
	var _user$project$Gallery$SliderMsg = function _user$project$Gallery$SliderMsg(a) {
		return { ctor: 'SliderMsg', _0: a };
	};
	var _user$project$Gallery$update = F2(function (msg, model) {
		var _p0 = msg;
		switch (_p0.ctor) {
			case 'OpenSlider':
				var _p1 = _larribas$elm_image_slider$ImageSlider$init(0);
				var sliderModel = _p1._0;
				var cmd = _p1._1;
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(model, {
						slider: _elm_lang$core$Maybe$Just(sliderModel)
					}),
					_1: A2(_elm_lang$core$Platform_Cmd$map, _user$project$Gallery$SliderMsg, cmd)
				};
			case 'SliderMsg':
				var _p2 = model.slider;
				if (_p2.ctor === 'Just') {
					return {
						ctor: '_Tuple2',
						_0: _elm_lang$core$Native_Utils.update(model, {
							slider: _elm_lang$core$Maybe$Just(A2(_larribas$elm_image_slider$ImageSlider$update, _p0._0, _p2._0))
						}),
						_1: _elm_lang$core$Platform_Cmd$none
					};
				} else {
					return { ctor: '_Tuple2', _0: model, _1: _elm_lang$core$Platform_Cmd$none };
				}
			default:
				return {
					ctor: '_Tuple2',
					_0: _elm_lang$core$Native_Utils.update(model, { slider: _elm_lang$core$Maybe$Nothing }),
					_1: _elm_lang$core$Platform_Cmd$none
				};
		}
	});
	var _user$project$Gallery$CloseSlider = { ctor: 'CloseSlider' };
	var _user$project$Gallery$OpenSlider = { ctor: 'OpenSlider' };
	var _user$project$Gallery$view = function _user$project$Gallery$view(model) {
		var sliderConf = {
			originalUrl: function originalUrl(_) {
				return _.src;
			},
			thumbnailUrl: function thumbnailUrl(_) {
				return _.src;
			},
			alt: function alt(_) {
				return _.alt;
			},
			caption: function caption(i) {
				return A2(_elm_lang$html$Html$span, {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('image-slider-image-caption'),
					_1: { ctor: '[]' }
				}, {
					ctor: '::',
					_0: _elm_lang$html$Html$text(i.alt),
					_1: { ctor: '[]' }
				});
			}
		};
		return A2(_elm_lang$html$Html$div, { ctor: '[]' }, {
			ctor: '::',
			_0: A2(_elm_lang$html$Html$div, {
				ctor: '::',
				_0: _elm_lang$html$Html_Attributes$class('image-gallery'),
				_1: { ctor: '[]' }
			}, {
				ctor: '::',
				_0: A2(_elm_lang$html$Html$div, {
					ctor: '::',
					_0: _elm_lang$html$Html_Attributes$class('title-picture-wrapper'),
					_1: { ctor: '[]' }
				}, {
					ctor: '::',
					_0: A2(_elm_lang$html$Html$img, {
						ctor: '::',
						_0: _elm_lang$html$Html_Events$onClick(_user$project$Gallery$OpenSlider),
						_1: {
							ctor: '::',
							_0: _elm_lang$html$Html_Attributes$class('title-picture'),
							_1: {
								ctor: '::',
								_0: _elm_lang$html$Html_Attributes$src(_user$project$Gallery$firstImage(model.images)),
								_1: { ctor: '[]' }
							}
						}
					}, { ctor: '[]' }),
					_1: { ctor: '[]' }
				}),
				_1: { ctor: '[]' }
			}),
			_1: {
				ctor: '::',
				_0: function () {
					var _p3 = model.slider;
					if (_p3.ctor === 'Just') {
						return A2(_elm_lang$html$Html$div, {
							ctor: '::',
							_0: _user$project$Gallery$onEscape(_user$project$Gallery$CloseSlider),
							_1: { ctor: '[]' }
						}, {
							ctor: '::',
							_0: A2(_elm_lang$html$Html$map, _user$project$Gallery$SliderMsg, A3(_larribas$elm_image_slider$ImageSlider$view, sliderConf, _elm_lang$core$Array$fromList(model.images), _p3._0)),
							_1: {
								ctor: '::',
								_0: A2(_elm_lang$html$Html$i, {
									ctor: '::',
									_0: _elm_lang$html$Html_Attributes$class('image-slider-button image-slider-quit-button fa fa-remove'),
									_1: {
										ctor: '::',
										_0: _elm_lang$html$Html_Events$onClick(_user$project$Gallery$CloseSlider),
										_1: { ctor: '[]' }
									}
								}, { ctor: '[]' }),
								_1: { ctor: '[]' }
							}
						});
					} else {
						return _elm_lang$html$Html$text('');
					}
				}(),
				_1: { ctor: '[]' }
			}
		});
	};
	var _user$project$Gallery$main = _elm_lang$html$Html$program({ init: _user$project$Gallery$init, update: _user$project$Gallery$update, view: _user$project$Gallery$view, subscriptions: _user$project$Gallery$subscriptions })();

	var Elm = {};
	Elm['Gallery'] = Elm['Gallery'] || {};
	if (typeof _user$project$Gallery$main !== 'undefined') {
		_user$project$Gallery$main(Elm['Gallery'], 'Gallery', undefined);
	}

	if (typeof define === "function" && define['amd']) {
		define([], function () {
			return Elm;
		});
		return;
	}

	if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === "object") {
		module['exports'] = Elm;
		return;
	}

	var globalElm = this['Elm'];
	if (typeof globalElm === "undefined") {
		this['Elm'] = Elm;
		return;
	}

	for (var publicModule in Elm) {
		if (publicModule in globalElm) {
			throw new Error('There are two Elm modules called `' + publicModule + '` on this page! Rename one of them.');
		}
		globalElm[publicModule] = Elm[publicModule];
	}
}).call(this);
},{"process":13}],10:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = register;
exports.unregister = unregister;
// In production, we register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the "N+1" visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.

var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
// [::1] is the IPv6 localhost address.
window.location.hostname === '[::1]' ||
// 127.0.0.1/8 is considered localhost for IPv4.
window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));

function register() {
  if ('development' === 'production' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    var publicUrl = new URL(undefined, window.location);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebookincubator/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', function () {
      var swUrl = undefined + '/service-worker.js';

      if (!isLocalhost) {
        // Is not local host. Just register service worker
        registerValidSW(swUrl);
      } else {
        // This is running on localhost. Lets check if a service worker still exists or not.
        checkValidServiceWorker(swUrl);
      }
    });
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker.register(swUrl).then(function (registration) {
    registration.onupdatefound = function () {
      var installingWorker = registration.installing;
      installingWorker.onstatechange = function () {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // At this point, the old content will have been purged and
            // the fresh content will have been added to the cache.
            // It's the perfect time to display a "New content is
            // available; please refresh." message in your web app.
            console.log('New content is available; please refresh.');
          } else {
            // At this point, everything has been precached.
            // It's the perfect time to display a
            // "Content is cached for offline use." message.
            console.log('Content is cached for offline use.');
          }
        }
      };
    };
  }).catch(function (error) {
    console.error('Error during service worker registration:', error);
  });
}

function checkValidServiceWorker(swUrl) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl).then(function (response) {
    // Ensure service worker exists, and that we really are getting a JS file.
    if (response.status === 404 || response.headers.get('content-type').indexOf('javascript') === -1) {
      // No service worker found. Probably a different app. Reload the page.
      navigator.serviceWorker.ready.then(function (registration) {
        registration.unregister().then(function () {
          window.location.reload();
        });
      });
    } else {
      // Service worker found. Proceed as normal.
      registerValidSW(swUrl);
    }
  }).catch(function () {
    console.log('No internet connection found. App is running in offline mode.');
  });
}

function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(function (registration) {
      registration.unregister();
    });
  }
}
},{}],21:[function(require,module,exports) {
var global = (1,eval)("this");
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    symbolTag = '[object Symbol]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    splice = arrayProto.splice;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.set`.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @param {Function} [customizer] The function to customize path creation.
 * @returns {Object} Returns `object`.
 */
function baseSet(object, path, value, customizer) {
  if (!isObject(object)) {
    return object;
  }
  path = isKey(path, object) ? [path] : castPath(path);

  var index = -1,
      length = path.length,
      lastIndex = length - 1,
      nested = object;

  while (nested != null && ++index < length) {
    var key = toKey(path[index]),
        newValue = value;

    if (index != lastIndex) {
      var objValue = nested[key];
      newValue = customizer ? customizer(objValue, key, nested) : undefined;
      if (newValue === undefined) {
        newValue = isObject(objValue)
          ? objValue
          : (isIndex(path[index + 1]) ? [] : {});
      }
    }
    assignValue(nested, key, newValue);
    nested = nested[key];
  }
  return object;
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Sets the value at `path` of `object`. If a portion of `path` doesn't exist,
 * it's created. Arrays are created for missing index properties while objects
 * are created for all other missing properties. Use `_.setWith` to customize
 * `path` creation.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to modify.
 * @param {Array|string} path The path of the property to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.set(object, 'a[0].b.c', 4);
 * console.log(object.a[0].b.c);
 * // => 4
 *
 * _.set(object, ['x', '0', 'y', 'z'], 5);
 * console.log(object.x[0].y.z);
 * // => 5
 */
function set(object, path, value) {
  return object == null ? object : baseSet(object, path, value);
}

module.exports = set;

},{}],14:[function(require,module,exports) {
module.exports="/about.5f13ca75.md";
},{}],18:[function(require,module,exports) {
module.exports="/news.8e8c1fcc.md";
},{}],20:[function(require,module,exports) {
module.exports="/about.3fe15f11.md";
},{}],15:[function(require,module,exports) {
module.exports="/news.87e59f93.md";
},{}],19:[function(require,module,exports) {
module.exports="/about.9013d5b4.md";
},{}],16:[function(require,module,exports) {
module.exports="/contact.8b9acf92.md";
},{}],17:[function(require,module,exports) {
module.exports="/news.41fb9af8.md";
},{}],5:[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _lodash = require('lodash.set');

var _lodash2 = _interopRequireDefault(_lodash);

var _about = require('./content/de/about.md');

var _about2 = _interopRequireDefault(_about);

var _news = require('./content/de/news.md');

var _news2 = _interopRequireDefault(_news);

var _about3 = require('./content/en/about.md');

var _about4 = _interopRequireDefault(_about3);

var _news3 = require('./content/en/news.md');

var _news4 = _interopRequireDefault(_news3);

var _about5 = require('./content/general/about.md');

var _about6 = _interopRequireDefault(_about5);

var _contact = require('./content/general/contact.md');

var _contact2 = _interopRequireDefault(_contact);

var _news5 = require('./content/general/news.md');

var _news6 = _interopRequireDefault(_news5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// automaticly created with dynamicImport.js

var exp = {};

(0, _lodash2.default)(exp, 'content.de.about', _about2.default);
(0, _lodash2.default)(exp, 'content.de.news', _news2.default);
(0, _lodash2.default)(exp, 'content.en.about', _about4.default);
(0, _lodash2.default)(exp, 'content.en.news', _news4.default);
(0, _lodash2.default)(exp, 'content.general.about', _about6.default);
(0, _lodash2.default)(exp, 'content.general.contact', _contact2.default);
(0, _lodash2.default)(exp, 'content.general.news', _news6.default);

exports.default = exp;
},{"lodash.set":21,"./content/de/about.md":14,"./content/de/news.md":18,"./content/en/about.md":20,"./content/en/news.md":15,"./content/general/about.md":19,"./content/general/contact.md":16,"./content/general/news.md":17}],6:[function(require,module,exports) {
module.exports = {news: "## Melodic Punk Rock", events: [{date: "1993-02-28", event: {name: "test", url: ""}, location: {name: "bla", url: null}}, {date: "1993-02-26", event: {name: "test", url: ""}, location: {name: "bla", url: null}}, {date: "2000-02-28", event: {name: "test", url: ""}, location: {name: "bla", url: null}}], about: "# about\nThe best looking band on Earth! Naja, oder einfach die vier Jungs von GIVE ME A REASON, die sich die Welt zu Füssen rocken. Dabei nehmen sie sich selbst weit weniger ernst als ihre Musik. Ein rockiger Melodic-Punk, der geradezu nach einem tanzenden Publikum schreit. Und dann gibt, es da noch diese Stimme, mittendrin, die die Träumer mit Inspiration versorgt. Mit stilechten Eigenkompositionen und einer Handvoll Covers nehmen uns die jungen Zürcher mit auf einen Road Trip live on Stage.\n### GIVE ME A REASON sind\n|                  |                  |\n| ---------------- | ---------------: |\n| Mattia Di Paolo  | Vocals \u002F Gitarre |\n| David Sipek      |          Gitarre |\n| Marvin Trottmann |             Bass |\n| Dario Bistoletti |            Drums |\n", contact: "# contact \u002F booking\n[E-Mail: givemeareason.official@gmail.com](mailto:givemeareason.official@gmail.com)\n\n[Facebook: @GiveMeAReasonOfficial](https:\u002F\u002Fwww.facebook.com\u002FGiveMeAReasonOfficial)\n"};
},{}],22:[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],12:[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();
  newLink.onload = function () {
    link.remove();
  };
  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;
function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');
    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":22}],7:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":12}],8:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":12}],9:[function(require,module,exports) {

        var reloadCSS = require('_css_loader');
        module.hot.dispose(reloadCSS);
        module.hot.accept(reloadCSS);
      
},{"_css_loader":12}],11:[function(require,module,exports) {
var global = (1,eval)("this");
var process = require("process");
/*!
 * jQuery JavaScript Library v3.3.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2018-01-20T17:24Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var document = window.document;

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

      // Support: Chrome <=57, Firefox <=52
      // In some browsers, typeof returns "function" for HTML <object> elements
      // (i.e., `typeof document.createElement( "object" ) === "function"`).
      // We don't want to classify *any* DOM node as a function.
      return typeof obj === "function" && typeof obj.nodeType !== "number";
  };


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};




	var preservedScriptAttributes = {
		type: true,
		src: true,
		noModule: true
	};

	function DOMEval( code, doc, node ) {
		doc = doc || document;

		var i,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {
				if ( node[ i ] ) {
					script[ i ] = node[ i ];
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.3.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android <=4.0 only
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {

		/* eslint-disable no-unused-vars */
		// See https://github.com/eslint/eslint/issues/6125
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		DOMEval( code );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android <=4.0 only
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.3
 * https://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2016-08-08
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" + ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	disabledAncestor = addCombinator(
		function( elem ) {
			return elem.disabled === true && ("form" in elem || "label" in elem);
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {

				// ID selector
				if ( (m = match[1]) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( (elem = context.getElementById( m )) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && (elem = newContext.getElementById( m )) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[2] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( (m = match[3]) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!compilerCache[ selector + " " ] &&
				(!rbuggyQSA || !rbuggyQSA.test( selector )) ) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( context.nodeName.toLowerCase() !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( (nid = context.getAttribute( "id" )) ) {
						nid = nid.replace( rcssescape, fcssescape );
					} else {
						context.setAttribute( "id", (nid = expando) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[i] = "#" + nid + " " + toSelector( groups[i] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext.querySelectorAll( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement("fieldset");

	try {
		return !!fn( el );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}
		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
						disabledAncestor( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( preferredDoc !== document &&
		(subWindow = document.defaultView) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( el ) {
		el.className = "i";
		return !el.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( el ) {
		el.appendChild( document.createComment("") );
		return !el.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	});

	// ID filter and find
	if ( support.getById ) {
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode("id");
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( (elem = elems[i++]) ) {
						node = elem.getAttributeNode("id");
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( document.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( el ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll(":enabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll(":disabled").length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( el ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === document || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === document || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return (sel + "").replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || (node[ expando ] = {});

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								(outerCache[ node.uniqueID ] = {});

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {
							// Use previously-cached element index if available
							if ( useCache ) {
								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || (node[ expando ] = {});

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									(outerCache[ node.uniqueID ] = {});

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {
								// Use the same loop as above to seek `elem` from the start
								while ( (node = ++nodeIndex && node && node[ dir ] ||
									(diff = nodeIndex = 0) || start.pop()) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] || (node[ expando ] = {});

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												(outerCache[ node.uniqueID ] = {});

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] || (outerCache[ elem.uniqueID ] = {});

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( (oldCache = uniqueCache[ key ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem.ownerDocument !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context || document, xml) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( el ) {
	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement("fieldset") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( el ) {
	return el.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
        if ( nodeName( elem, "iframe" ) ) {
            return elem.contentDocument;
        }

        // Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
        // Treat the template element as a regular one in browsers that
        // don't support it.
        if ( nodeName( elem, "template" ) ) {
            elem = elem.content || elem;
        }

        return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			jQuery.contains( elem.ownerDocument, elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};




function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]+)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE <=9 only
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

// Support: IE <=9 only
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem.ownerDocument, elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
} )();
var documentElement = document.documentElement;



var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 only
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	/* eslint-disable max-len */

	// See https://github.com/eslint/eslint/issues/3229
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,

	/* eslint-enable */

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), doc, node );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && jQuery.contains( node.ownerDocument, node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html.replace( rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		div.style.position = "absolute";
		scrollboxSizeVal = div.offsetWidth === 36 || "absolute";

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a property mapped along what jQuery.cssProps suggests or to
// a vendor prefixed property.
function finalPropName( name ) {
	var ret = jQuery.cssProps[ name ];
	if ( !ret ) {
		ret = jQuery.cssProps[ name ] = vendorPropName( name ) || name;
	}
	return ret;
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5
		) );
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),
		val = curCSS( elem, dimension, styles ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox;

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}

	// Check for style in case a browser which returns unreliable values
	// for getComputedStyle silently falls back to the reliable elem.style
	valueIsBorderBox = valueIsBorderBox &&
		( support.boxSizingReliable() || val === elem.style[ dimension ] );

	// Fall back to offsetWidth/offsetHeight when value is "auto"
	// This happens for inline elements with no explicit setting (gh-3571)
	// Support: Android <=4.1 - 4.3 only
	// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
	if ( val === "auto" ||
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) {

		val = elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ];

		// offsetWidth/offsetHeight provide border-box values
		valueIsBorderBox = true;
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === "number" ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),
				isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra && boxModelAdjustment(
					elem,
					dimension,
					extra,
					isBorderBox,
					styles
				);

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && support.scrollboxSize() === styles.position ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 &&
				( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = Date.now();

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce++ ) + uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" ).prop( {
					charset: s.scriptCharset,
					src: s.url
				} ).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	}
} );

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

},{"process":13}],2:[function(require,module,exports) {
'use strict';

var _Main = require('./Main.elm');

var _Gallery = require('./Gallery.elm');

var _registerServiceWorker = require('./registerServiceWorker');

var _registerServiceWorker2 = _interopRequireDefault(_registerServiceWorker);

var _imports = require('../imports');

var _imports2 = _interopRequireDefault(_imports);

var _test = require('./test.yaml');

var _test2 = _interopRequireDefault(_test);

require('./main.styl');

require('./header.styl');

require('./Gallery.styl');

var _jquery = require('jquery');

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Main.embed(document.getElementById('root'))

var app = _Main.Main.fullscreen();

/*app.ports.check.subscribe(function(word) {
	const suggestions = spellCheck(word)
	app.ports.suggestions.send(suggestions)
})*/

var _imports$content = _imports2.default.content,
    general = _imports$content.general,
    de = _imports$content.de,
    en = _imports$content.en;


app.ports.content.send(_test2.default);

function spellCheck(language) {
	// have a real implementation!

	return Object.assign({}, _imports2.default.content.general, _imports2.default.content[language]);
}

(0, _registerServiceWorker2.default)();

(0, _jquery2.default)(document).ready(function () {
	(0, _jquery2.default)('a').click(function (_ref) {
		var hash = _ref.target.hash;

		if (hash) {
			try {
				(0, _jquery2.default)('html, body').animate({
					scrollTop: (0, _jquery2.default)(hash).offset().top - 100
				}, 600);
			} catch (error) {
				console.warn('scroll target not found', error);
			}
		}
	});
});
},{"./Main.elm":3,"./Gallery.elm":4,"./registerServiceWorker":10,"../imports":5,"./test.yaml":6,"./main.styl":7,"./header.styl":8,"./Gallery.styl":9,"jquery":11}],30:[function(require,module,exports) {

var OVERLAY_ID = '__parcel__error__overlay__';

var global = (1, eval)('this');
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '45115' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},[30,2])
//# sourceMappingURL=/src.9250672f.map