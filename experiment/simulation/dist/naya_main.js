/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Kernel.ts":
/*!***********************!*\
  !*** ./src/Kernel.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Kernel\": () => (/* binding */ Kernel)\n/* harmony export */ });\n/* harmony import */ var _Process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Process */ \"./src/Process.ts\");\n\nvar Kernel = /** @class */ (function () {\n    function Kernel() {\n        this.processes = [];\n        this.currentProcess = -1;\n    }\n    Kernel.prototype.createProcess = function (name) {\n        var pid = this.processes.length;\n        var process = new _Process__WEBPACK_IMPORTED_MODULE_0__.Process(pid, name);\n        this.processes.push(process);\n    };\n    Kernel.prototype.advanceClock = function () {\n        this.clock++;\n    };\n    Kernel.prototype.runProcess = function (id) {\n        this.processes[id].run();\n    };\n    Kernel.prototype.prempt = function () {\n        this.processes[this.currentProcess].ready();\n        this.currentProcess = -1;\n    };\n    Kernel.prototype.moveToIO = function () {\n        this.processes[this.currentProcess].moveToIO();\n    };\n    Kernel.prototype.moveToReady = function (id) {\n        this.processes[id].ready();\n    };\n    Kernel.prototype.terminate = function () {\n        this.processes[this.currentProcess].terminate();\n    };\n    return Kernel;\n}());\n\n\n\n//# sourceURL=webpack://context-switching/./src/Kernel.ts?");

/***/ }),

/***/ "./src/Process.ts":
/*!************************!*\
  !*** ./src/Process.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Process\": () => (/* binding */ Process)\n/* harmony export */ });\nvar Process = /** @class */ (function () {\n    function Process(pid, name) {\n        this.pid = pid;\n        this.name = name;\n        this.state = \"READY\";\n        this.history = [\"NEW\"];\n        this.registers = { \"r1\": 1, \"r2\": 2, \"r3\": 3, \"r4\": 4 };\n        this.ioRequests = { start_time: 3, ticks: 2 };\n        this.ticks = 6;\n        this.programCounter = 0;\n    }\n    Process.prototype.run = function () {\n        this.state = \"RUNNING\";\n        this.history.push(this.state);\n    };\n    Process.prototype.ready = function () {\n        this.state = \"READY\";\n        this.history.push(this.state);\n    };\n    Process.prototype.moveToIO = function () {\n        this.state = \"BLOCKED\";\n        this.history.push(this.state);\n    };\n    Process.prototype.terminate = function () {\n        this.state = \"TERMINATED\";\n        this.history.push(this.state);\n    };\n    return Process;\n}());\n\n\n\n//# sourceURL=webpack://context-switching/./src/Process.ts?");

/***/ }),

/***/ "./src/naya_main.ts":
/*!**************************!*\
  !*** ./src/naya_main.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Kernel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Kernel */ \"./src/Kernel.ts\");\n\nvar kernel = new _Kernel__WEBPACK_IMPORTED_MODULE_0__.Kernel();\n// document.getElementById(\"head\").textContent = \"Good to have you here\";\nvar procedurePopupButton = document.getElementById(\"procedure\");\nvar procedurepopupWindow = document.getElementById(\"popup-window\");\nvar closeButton = document.getElementById(\"close-button\");\nprocedurePopupButton.addEventListener(\"click\", function () {\n    popupWindow.style.display = \"block\";\n});\ncloseButton.addEventListener(\"click\", function () {\n    popupWindow.style.display = \"none\";\n});\n\n\n//# sourceURL=webpack://context-switching/./src/naya_main.ts?");

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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/naya_main.ts");
/******/ 	
/******/ })()
;