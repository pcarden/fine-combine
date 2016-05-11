(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("fineCombine", [], factory);
	else if(typeof exports === 'object')
		exports["fineCombine"] = factory();
	else
		root["fineCombine"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	exports.default = fineCombine;
	function fineCombine() {
	  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }
	
	  var reducerCollections = args;
	
	  // get all duplicate keys
	  var duplicates = reducerCollections
	  // get all the keys of all the reducer collections
	  .reduce(function (memo, value) {
	    Object.keys(value).forEach(function (key) {
	      return memo.push(key);
	    });
	    return memo;
	  }, [])
	  // now find the duplicates among them by sorting and looking for matching pairs.
	  .sort().reduce(function (memo, key, index, array) {
	    if (index > 0 && key === array[index - 1]) {
	
	      // if memo does not already contain key, add it
	      if (memo.indexOf(key) === -1) memo.push(key);
	    }
	    return memo;
	  }, []);
	
	  // get an array of the relevant reducerCollections for each duplicate
	  var relevantCollections = duplicates.reduce(function (previous, duplicate) {
	    var current = previous;
	
	    reducerCollections.forEach(function (reducerCollection) {
	      if (duplicate in reducerCollection) {
	        current[duplicate] = current[duplicate] || [];
	        current[duplicate].push(reducerCollection);
	      }
	    });
	    return current;
	  }, {});
	
	  // build the combined reducer functions for each duplicate
	  var combinedReducers = duplicates.reduce(function (previous, duplicateKey) {
	    var current = previous;
	
	    current[duplicateKey] = function fineCombinedReducer(state, action) {
	      var newState = state;
	
	      relevantCollections[duplicateKey].forEach(function (relevantCollection) {
	        newState = relevantCollection[duplicateKey](newState, action);
	      });
	      return newState;
	    };
	
	    return current;
	  }, {});
	
	  // push it onto reducerCollections (so it will override relevant keys in the next step)
	  reducerCollections.push(combinedReducers);
	
	  // build the combined return object
	  return reducerCollections.reduce(function (memo, value) {
	    return _extends(memo, value);
	  }, {});
	}
	// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
	// =================================================================================================

/***/ }
/******/ ])
});
;
//# sourceMappingURL=fineCombine.js.map