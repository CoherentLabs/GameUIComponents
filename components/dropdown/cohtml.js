///<reference path="./cohtml.d.ts"/>

/*jslint browser: true, nomen: true, plusplus: true */

/// @file cohtml.js
/// @namespace engine

/// Coherent UI JavaScript interface.
/// The `engine` module contains all functions for communication between the UI and the game / application.
(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory(global, global.engine, false);
	} else {
		engine = factory(window, /** @type {any} */(window).engine, true);
	}
})(function (global, engine, hasOnLoad) {
	'use strict';

	var isAttached = engine !== undefined;
	engine = engine || {};
	if (engine._Initialized) {
		return engine;
	}

	var VERSION = [2, 0, 3, 0];

	/**
	* Event emitter
	*
	* @class Emitter
	*/
	function Emitter() {
		this.events = {};
	}

	/**
	* Event handler
	*
	* @class Handler
	*/
	function Handler(code, context) {
		this.code = code;
		this.context = context;
	}

	Emitter.prototype._createClear = function (object, name, handler, context) {
		return function () {
			var handlers = object.events[name];
			if (handlers) {
				var index = -1;
				// this was in native previously
				if (handler === undefined) {
					for (var i = 0; i < handlers.length; ++i) {
						if (handlers[i].wasInCPP !== undefined) {
							index = i;
							break;
						}
					}
				}
				else {
					index = handlers.indexOf(handler);
				}
				if (index != -1) {
					handlers.splice(index, 1);
					if (handlers.length === 0) {
						delete object.events[name];
					}
				}
			} else {
				if (engine.RemoveOnHandler !== undefined) {
					engine.RemoveOnHandler(name, handler, context || engine);
				}
			}
		};
	};

	/**
	* Add a handler for an event
	*
	* @method on
	* @param name the event name
	* @param callback function to be called when the event is triggered
	* @param context this binding for executing the handler, defaults to the Emitter
	* @return connection object
	*/
	Emitter.prototype.on = function (name, callback, context) {
		var handlers = this.events[name];
		if (handlers === undefined)
			handlers = this.events[name] = [];

		var handler = new Handler(callback, context || this);
		handlers.push(handler);
		return { clear: this._createClear(this, name, handler, context) };
	};

	/**
	* Remove a handler from an event
	*
	* @method off
	* @param name the event name
	* @param handler function to be called when the event is triggered
	* @param context this binding for executing the handler, defaults to the Emitter
	* @return connection object
	*/
	Emitter.prototype.off = function (name, handler, context) {
		var handlers = this.events[name];

		if (handlers !== undefined) {
			context = context || this;

			var index;
			var length = handlers.length;
			for (index = 0; index < length; ++index) {
				var reg = handlers[index];
				if (reg.code == handler && reg.context == context) {
					break;
				}
			}
			if (index < length) {
				handlers.splice(index, 1);
				if (handlers.length === 0) {
					delete this.events[name];
				}
			}
		}
		else {
			engine.RemoveOnHandler(name, handler, context || this);
		}
	};

	Emitter.prototype.trigger = function (name) {
		var handlers = this.events[name];

		if (handlers !== undefined) {
			var args = Array.prototype.slice.call(arguments, 1);

			handlers.forEach(function (handler) {
				handler.code.apply(handler.context, args);
			});
			return true;
		}
		return false;
	};

	/// @var {bool} engine.isAttached
	/// Indicates whether the script is currently running inside Cohtml
	engine.isAttached = isAttached;

	if (!engine.isAttached) {
		Emitter.prototype.on = function (name, callback, context) {
			var handlers = this.events[name];
			if (/** @type {any} */(this).browserCallbackOn) {
				/** @type {any} */(this).browserCallbackOn(name, callback, context);
			}

			if (handlers === undefined) {
				handlers = this.events[name] = [];
			}

			var handler = new Handler(callback, context || this);
			handlers.push(handler);
			return { clear: this._createClear(this, name, handler) };
		};

		Emitter.prototype.off = function (name, handler, context) {
			var handlers = this.events[name];

			if (handlers !== undefined) {
				context = context || this;

				var index;
				var length = handlers.length;
				for (index = 0; index < length; ++index) {
					var reg = handlers[index];
					if (reg.code == handler && reg.context == context) {
						break;
					}
				}
				if (index < length) {
					handlers.splice(index, 1);
					if (handlers.length === 0) {
						delete this.events[name];

						if (/** @type {any} */(this).browserCallbackOff) {
							/** @type {any} */(this).browserCallbackOff(name, handler, context);
						}
					}
				}
			}
		};

		engine.SendMessage = function (name, id) {
			var args = Array.prototype.slice.call(arguments, 2);
			var deferred = engine._ActiveRequests[id];

			delete engine._ActiveRequests[id];
			var call = function () {
				var mock = engine._mocks[name];

				if (mock !== undefined) {
					deferred.resolve(mock.apply(engine, args));
				}
			};

			window.setTimeout(call, 16);
		};

		/// @function engine.TriggerEvent
		/// Tries to invoke handlers for an event.
		///
		/// It will invoke any handler registered in C++ or the only handler registered in JavaScript.
		/// engine._trigger will handle the case where more than one event handler is registered in JavaScript
		/// or there are handlers from C++ and JavaScript at the same time.
		/// @param {String} name name of the event to be fired
		/// @param ... any extra parameters to be passed to event handlers
		/// @return true if any event handlers have been registered in C++ or exactly one in JavaScript
		/// @note this mock-mode version will return true if there is any event handler in JavaScript
		engine.TriggerEvent = function () {
			var args = Array.prototype.slice.call(arguments);

			var trigger = function () {
				var mock = engine._mocks[args[0]];

				if (mock !== undefined) {
					mock.apply(engine, args.slice(1));
				}
			};
			window.setTimeout(trigger, 16);
			return engine._mocks[args[0]] !== undefined;
		};

		engine.BindingsReady = function () {
			engine._OnReady();
		};

		engine.createJSModel = function (name, obj) {
			global[name] = obj;
		};

		engine.updateWholeModel = function() {};
		engine.synchronizeModels = function() {};
		engine.enableImmediateLayout = function() {};
		engine.isImmediateLayoutEnabled = function() { return true; }
		engine.executeImmediateLayoutSync = function() {};

		engine._mocks = {};

		engine._mockImpl = function (name, mock, isCppCall, isEvent) {
			if (mock) {
				this._mocks[name] = mock;
			}
			// Extract the name of the arguments from Function.prototype.toString
			var functionStripped = mock.toString().replace("function " + mock.name + "(", "");
			var rightParanthesis = functionStripped.indexOf(")");
			var args = functionStripped.substr(0, rightParanthesis);
			if (this.browserCallbackMock) {
				this.browserCallbackMock(name,
					args,
					isCppCall,
					Boolean(isEvent));
			}
		};

		engine.mock = function (name, mock, isEvent) {
			this._mockImpl(name, mock, true, isEvent);
		};
	}

	engine.events = {};
	for (var property in Emitter.prototype) {
		engine[property] = Emitter.prototype[property];
	}

	if (engine.isAttached) {

		/// @function engine.on
		/// Register handler for and event
		/// @param {String} name name of the event
		/// @param {Function} callback callback function to be executed when the event has been triggered
		/// @param context *this* context for the function, by default the engine object
		engine.on = function (name, callback, context) {
			if (!callback) {
				console.error("No handler specified for engine.on");
				return { clear: function() {} };
			}
			engine.AddOrRemoveOnHandler(name, callback, context || engine);
			return { clear: this._createClear(this, name, callback, context) };
		};
	}

	engine.whenReady = new Promise((resolve) => {
		engine.on('Ready', resolve);
	});

	/// @function engine.off
	/// Remove handler for an event
	/// @param {String} name name of the event, by default removes all events
	/// @param {Function} callback the callback function to be removed, by default removes all callbacks for a given event
	/// @param context *this* context for the function, by default all removes all callbacks, regardless of context
	/// @warning Removing all handlers for `engine` will remove some *Coherent UI* internal events, breaking some functionality.

	/// @function engine.trigger
	/// Trigger an event
	/// This function will trigger any C++ handler registered for this event with `View::RegisterForEvent`
	/// @param {String} name name of the event
	/// @param ... any extra arguments to be passed to the event handlers

	engine._trigger = Emitter.prototype.trigger;
	engine.trigger = function () {
		if (!this._trigger.apply(this, arguments)) {
			this.TriggerEvent.apply(this, arguments);
		}
	};

	/// @function engine.mock
	/// Mocks a C++ function call with the specified function.
	/// Only works in the browser. Attempts to use it in Coherent UI will do nothing.
	/// @param {String} name name of the event
	/// @param {Function} mock a function to be called in-place of your native binding
	/// @param {Boolean} isEvent whether you are mocking an event or function call
	if (engine.isAttached) {
		engine.mock = function () {};
	}

	engine._BindingsReady = false;
	engine._ContentLoaded = false;
	engine._RequestId = 0;
	engine._ActiveRequests = {};

	/// @function engine.call
	/// Call asynchronously a C++ handler and retrieve the result
	/// The C++ handler must have been registered with `View::BindCall`
	/// @param {String} name name of the C++ handler to be called
	/// @param ... any extra parameters to be passed to the C++ handler
	/// @return ECMAScript 6 promise
	engine.call = function () {
		engine._RequestId++;
		var id = engine._RequestId;
		var messageArguments = Array.prototype.slice.call(arguments);
		messageArguments.splice(1, 0, id);

		var promise = new Promise(function (resolve, reject) {
			engine._ActiveRequests[id] = {
				resolve: resolve,
				reject: reject,
			};
			engine.SendMessage.apply(engine, messageArguments);
		});
		return promise;
	};

	engine._Result = function (requestId) {
		var deferred = engine._ActiveRequests[requestId];
		if (deferred !== undefined) {
			delete engine._ActiveRequests[requestId];

			var resultArguments = Array.prototype.slice.call(arguments);
			resultArguments.shift();
			deferred.resolve.apply(deferred, resultArguments);
		}
	};

	engine._Reject = function (requestId) {
		var deferred = engine._ActiveRequests[requestId];
		if (deferred !== undefined) {
			delete engine._ActiveRequests[requestId];

			// ChakraCore executes deferred.reject immediately before we can return and have the user attach a rejection callback
			requestAnimationFrame(() => deferred.reject("No handler registered"));
		}
	}


	engine._ForEachError = function (errors, callback) {
		var length = errors.length;

		for (var i = 0; i < length; ++i) {
			callback(errors[i].first, errors[i].second);
		}
	};

	engine._TriggerError = function (message) {
		engine.trigger('Error', message);
	};

	engine._OnError = function (requestId, errors) {

		if (requestId === null || requestId === 0) {
			engine._ForEachError(errors, engine._TriggerError);
		}
		else {
			var deferred = engine._ActiveRequests[requestId];

			delete engine._ActiveRequests[requestId];

			deferred.reject(new Error(errors[0].second));
		}
		if (errors.length) {
			throw new Error(errors[0].second);
		}
	};

	engine._OnReady = function () {
		engine._BindingsReady = true;
		if (engine._ContentLoaded) {
			engine.trigger('Ready');
		}
	};

	engine._OnContentLoaded = function () {
		engine._ContentLoaded = true;
		if (engine._BindingsReady) {
			engine.trigger('Ready');
		}
	};

	if (hasOnLoad) {
		global.addEventListener("DOMContentLoaded", function () {
			engine._OnContentLoaded();
		});
	} else {
		engine._ContentLoaded = true;
	}

	engine.on('_Result', engine._Result, engine);
	engine.on('_Reject', engine._Reject, engine);
	engine.on('_OnReady', engine._OnReady, engine);
	engine.on('_OnError', engine._OnError, engine);

	//@ts-ignore
	engine.dependency = new WeakMap();
	engine.hasAttachedUpdateListner = false;

	engine.onUpdateWholeModel = (object) => {
		let deps = engine.dependency.get(object) || [];
		deps.forEach((dep) => engine.updateWholeModel(dep));
	};

	engine.createObservableModel = (observableName) => {
		const handler = {
			set: (target, prop, value) => {
				engine.updateWholeModel(window[observableName]);
				target[prop] = value;
			}
		};
		// @ts-ignore
		engine.createJSModel(observableName, new Proxy({}, handler));
	};

	engine.addSynchronizationDependency = (first, second) => {
		if (!engine.hasAttachedUpdateListner) {
			// will attach updateWholeModel callback for when there are one or more model dependencies
			engine.addDataBindEventListner("updateWholeModel", engine.onUpdateWholeModel);
			engine.hasAttachedUpdateListner = true;
		}

		let deps = engine.dependency.get(first);
		if (!deps) {
			deps = [];
			engine.dependency.set(first, deps);
		}
		deps.push(second);
	};

	engine.removeSynchronizationDependency = (first, second) => {
		let deps = engine.dependency.get(first) || [];
		deps.splice(deps.indexOf(second), 1);
	};

	engine.BindingsReady(VERSION[0], VERSION[1], VERSION[2], VERSION[3]);
	engine._Initialized = true;

	return engine;
});
