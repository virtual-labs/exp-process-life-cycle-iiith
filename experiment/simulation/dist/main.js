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

/***/ "./src/Event.ts":
/*!**********************!*\
  !*** ./src/Event.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Event\": () => (/* binding */ Event)\n/* harmony export */ });\nvar Event = /** @class */ (function () {\n    function Event(name, time, p) {\n        if (p === void 0) { p = -1; }\n        this.name = name;\n        this.pid = p;\n        this.time = time;\n    }\n    Event.prototype.set_id = function (id) {\n        this.id = id;\n    };\n    return Event;\n}());\n\n\n\n//# sourceURL=webpack://context-switching/./src/Event.ts?");

/***/ }),

/***/ "./src/Kernel.ts":
/*!***********************!*\
  !*** ./src/Kernel.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Kernel\": () => (/* binding */ Kernel)\n/* harmony export */ });\n/* harmony import */ var _Process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Process */ \"./src/Process.ts\");\n/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Log */ \"./src/Log.ts\");\n/* harmony import */ var _Event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Event */ \"./src/Event.ts\");\n/* harmony import */ var _helper_functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helper_functions */ \"./src/helper_functions.ts\");\n\n\n\n\nvar MAXPROCESSES = 5;\nvar Kernel = /** @class */ (function () {\n    function Kernel() {\n        this.processes = [];\n        this.currentProcess = -1;\n        this.processCreations = 0;\n        this.external_events = [];\n        this.internal_events = [];\n        this.log = new _Log__WEBPACK_IMPORTED_MODULE_1__.Log();\n        this.clock = 0;\n    }\n    Kernel.prototype.createProcess = function () {\n        var pid = this.processes.length;\n        var process = new _Process__WEBPACK_IMPORTED_MODULE_0__.Process(pid);\n        this.processes.push(process);\n        this.advanceClock();\n    };\n    Kernel.prototype.advanceClock = function () {\n        this.clock++;\n        this.generate_external_event(this.clock);\n    };\n    Kernel.prototype.runProcess = function (id) {\n        this.processes[id].run();\n        this.advanceClock();\n    };\n    Kernel.prototype.prempt = function () {\n        this.processes[this.currentProcess].ready();\n        this.currentProcess = -1;\n        this.advanceClock();\n    };\n    Kernel.prototype.moveToIO = function () {\n        this.processes[this.currentProcess].moveToIO();\n        this.advanceClock();\n    };\n    Kernel.prototype.moveToReady = function (id) {\n        this.processes[id].ready();\n        this.advanceClock();\n    };\n    Kernel.prototype.terminate = function (id) {\n        this.processes[id].terminate();\n        this.advanceClock();\n    };\n    Kernel.prototype.get_processes = function () {\n        return this.processes;\n    };\n    Kernel.prototype.get_data = function () {\n        return \"Hello Eswar\";\n    };\n    Kernel.prototype.get_terminatable_procs = function () {\n        var active_procs = [];\n        for (var index = 0; index < this.processes.length; index++) {\n            var element = this.processes[index];\n            if (element.state !== \"TERMINATED\") {\n                var flag = true;\n                for (var j = 0; j < this.external_events.length; j++) {\n                    console.log(\"came to term\");\n                    if (this.external_events[j].pid === index) {\n                        flag = false;\n                        break;\n                    }\n                }\n                if (flag === true)\n                    active_procs.push(index);\n            }\n        }\n        return active_procs;\n    };\n    Kernel.prototype.count_process_creation_events = function () {\n        var count = 0;\n        for (var index = 0; index < this.external_events.length; index++) {\n            var element = this.external_events[index];\n            if (element.name == \"requestProc\")\n                count++;\n        }\n        return count;\n    };\n    Kernel.prototype.generate_external_event = function (clock) {\n        var possible_events = [];\n        // Process Creation Event\n        if (this.processes.length + this.count_process_creation_events() < MAXPROCESSES) {\n            var new_process_event = new _Event__WEBPACK_IMPORTED_MODULE_2__.Event(\"requestProc\", clock);\n            possible_events.push(new_process_event);\n        }\n        // Kill by User (Terminate)\n        var active_procs = this.get_terminatable_procs();\n        var process_to_kill = (0,_helper_functions__WEBPACK_IMPORTED_MODULE_3__.getRandomElement)(active_procs);\n        var terminate_event = new _Event__WEBPACK_IMPORTED_MODULE_2__.Event(\"terminate\", clock, process_to_kill);\n        possible_events.push(terminate_event);\n        var next_event = (0,_helper_functions__WEBPACK_IMPORTED_MODULE_3__.getRandomElement)(possible_events);\n        this.external_events.push(next_event);\n    };\n    return Kernel;\n}());\n\n\n\n//# sourceURL=webpack://context-switching/./src/Kernel.ts?");

/***/ }),

/***/ "./src/Log.ts":
/*!********************!*\
  !*** ./src/Log.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Log\": () => (/* binding */ Log)\n/* harmony export */ });\nvar Log = /** @class */ (function () {\n    function Log() {\n        this.records = [];\n    }\n    Log.prototype.addRecord = function (record) {\n        this.records.push(record);\n    };\n    return Log;\n}());\n\n\n\n//# sourceURL=webpack://context-switching/./src/Log.ts?");

/***/ }),

/***/ "./src/Process.ts":
/*!************************!*\
  !*** ./src/Process.ts ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Process\": () => (/* binding */ Process)\n/* harmony export */ });\nvar Process = /** @class */ (function () {\n    function Process(pid) {\n        this.pid = pid;\n        this.name = \"P\" + String(pid);\n        this.state = \"READY\";\n        this.history = [\"NEW\"];\n        this.registers = { \"r1\": 1, \"r2\": 2, \"r3\": 3, \"r4\": 4 };\n        this.ioRequests = { start_time: 3, ticks: 2 };\n        this.ticks = 6;\n        this.programCounter = 0;\n    }\n    Process.prototype.run = function () {\n        this.state = \"RUNNING\";\n        this.history.push(this.state);\n    };\n    Process.prototype.ready = function () {\n        this.state = \"READY\";\n        this.history.push(this.state);\n    };\n    Process.prototype.moveToIO = function () {\n        this.state = \"BLOCKED\";\n        this.history.push(this.state);\n    };\n    Process.prototype.terminate = function () {\n        this.state = \"TERMINATED\";\n        this.history.push(this.state);\n    };\n    return Process;\n}());\n\n\n\n//# sourceURL=webpack://context-switching/./src/Process.ts?");

/***/ }),

/***/ "./src/UI.ts":
/*!*******************!*\
  !*** ./src/UI.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"UI\": () => (/* binding */ UI)\n/* harmony export */ });\n/* harmony import */ var _Kernel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Kernel */ \"./src/Kernel.ts\");\n\n\nvar UI = /** @class */ (function () {\n    function UI() {\n        this.kernel = new _Kernel__WEBPACK_IMPORTED_MODULE_0__.Kernel();\n    }\n    UI.prototype.display_clock = function () {\n        var clock = document.getElementById(\"clock\");\n        var clock_span = document.getElementsByTagName(\"span\")[0];\n        clock_span.innerHTML = this.kernel.clock.toString();\n    };\n    UI.prototype.update_clock = function () {\n        this.kernel.advanceClock();\n        this.display_clock();\n    };\n    UI.prototype.createProcess = function () {\n        this.kernel.createProcess();\n        this.display_processes();\n    };\n    UI.prototype.add_to_pool = function (p, pool) {\n        // create a div for process inside pool\n        var process_div = document.createElement(\"div\");\n        process_div.classList.add(\"process\");\n        process_div.id = p.name;\n        process_div.innerHTML = p.name;\n        pool.appendChild(process_div);\n    };\n    UI.prototype.display_processes = function () {\n        // clear all pools\n        var processes = document.getElementsByClassName(\"process\");\n        while (processes.length > 0) {\n            processes[0].remove();\n        }\n        // add processes to pools\n        var ready_pool = document.getElementById(\"ready_pool\");\n        var io_pool = document.getElementById(\"io_pool\");\n        var cpu = document.getElementById(\"cpu\");\n        var terminated_pool = document.getElementById(\"comp_pool\");\n        for (var i = 0; i < this.kernel.processes.length; i++) {\n            var p = this.kernel.processes[i];\n            if (p.state === \"READY\")\n                this.add_to_pool(p, ready_pool);\n            else if (p.state === \"RUNNING\")\n                this.add_to_pool(p, cpu);\n            else if (p.state === \"BLOCKED\")\n                this.add_to_pool(p, io_pool);\n            else if (p.state === \"TERMINATED\")\n                this.add_to_pool(p, terminated_pool);\n        }\n    };\n    return UI;\n}());\n\n\n//# sourceURL=webpack://context-switching/./src/UI.ts?");

/***/ }),

/***/ "./src/helper_functions.ts":
/*!*********************************!*\
  !*** ./src/helper_functions.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"getRandomElement\": () => (/* binding */ getRandomElement),\n/* harmony export */   \"getRandomInt\": () => (/* binding */ getRandomInt),\n/* harmony export */   \"initialize_processes\": () => (/* binding */ initialize_processes)\n/* harmony export */ });\n\nvar getRandomInt = function (min, max) {\n    min = Math.ceil(min);\n    max = Math.floor(max);\n    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive\n};\nvar getRandomElement = function (l) {\n    return l[getRandomInt(0, l.length)];\n};\nvar create_process = function (id) {\n    var ticks = getRandomInt(3, 6);\n    var io = {\n        \"start_time\": getRandomInt(1, ticks - 1),\n        \"ticks\": getRandomInt(1, 3)\n    };\n    if (id % 2 == 0) {\n        io = null;\n    }\n    return {\n        \"id\": id,\n        \"ticks\": ticks,\n        \"start_time\": getRandomInt(0, 10),\n        \"cur_ticks\": 0,\n        \"io\": io\n    };\n};\nvar initialize_processes = function (n) {\n    var processes = [];\n    for (var i = 0; i < n; i++) {\n        processes.push(create_process(i));\n    }\n    processes.sort(function (p1, p2) { return p1.start_time - p2.start_time; });\n    return processes;\n};\n\n\n//# sourceURL=webpack://context-switching/./src/helper_functions.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _UI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UI */ \"./src/UI.ts\");\n\nvar ui = new _UI__WEBPACK_IMPORTED_MODULE_0__.UI();\nui.createProcess();\nui.createProcess();\nui.createProcess();\nui.createProcess();\nui.createProcess();\nui.createProcess();\nui.createProcess();\nui.createProcess();\ndocument.getElementById(\"clock\").addEventListener(\"click\", function () {\n    ui.update_clock();\n});\n\n\n//# sourceURL=webpack://context-switching/./src/main.ts?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;