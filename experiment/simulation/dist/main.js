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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Event\": () => (/* binding */ Event)\n/* harmony export */ });\nvar Event = /** @class */ (function () {\n    function Event(id, name, time, p, type) {\n        if (id === void 0) { id = -1; }\n        if (name === void 0) { name = \"\"; }\n        if (time === void 0) { time = -1; }\n        if (p === void 0) { p = -1; }\n        if (type === void 0) { type = \"EXTERNAL\"; }\n        this.name = name;\n        this.pid = p;\n        this.time = time;\n        this.id = id;\n        this.type = type;\n        this.state = \"ACTIVE\";\n    }\n    Event.prototype.setResponceId = function (rid) {\n        this.responceId = rid;\n        this.state = \"DONE\";\n    };\n    Event.prototype.getData = function () {\n        return {\n            name: this.name,\n            pid: this.pid,\n            time: this.time,\n            id: this.id,\n            responceId: this.responceId,\n            type: this.type,\n            state: this.state\n        };\n    };\n    Event.prototype.setData = function (data) {\n        var name = data.name, pid = data.pid, time = data.time, id = data.id, responceId = data.responceId, type = data.type, state = data.state;\n        this.name = name;\n        this.pid = pid;\n        this.time = time;\n        this.id = id;\n        this.responceId = responceId;\n        this.type = type;\n        this.state = state;\n    };\n    return Event;\n}());\n\n\n\n//# sourceURL=webpack://context-switching/./src/Event.ts?");

/***/ }),

/***/ "./src/Kernel.ts":
/*!***********************!*\
  !*** ./src/Kernel.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Kernel\": () => (/* binding */ Kernel)\n/* harmony export */ });\n/* harmony import */ var _Process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Process */ \"./src/Process.ts\");\n/* harmony import */ var _Log__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Log */ \"./src/Log.ts\");\n/* harmony import */ var _Event__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Event */ \"./src/Event.ts\");\n/* harmony import */ var _helper_functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helper_functions */ \"./src/helper_functions.ts\");\n\n\n\n\nvar MAXPROCESSES = 5;\nvar ACTIVE = \"ACTIVE\";\nvar DONE = \"DONE\";\nvar REQUESTPROC = \"REQUESTPROC\";\nvar EXTERNAL = \"EXTERNAL\";\nvar PROCESS = \"PROCESS\";\nvar TERMINATE = \"TERMINATE\";\nvar READY = \"READY\";\nvar ERROR = \"ERROR\";\nvar OK = \"OK\";\nvar TERMINATED = \"TERMINATED\";\nvar IONEEDED = \"IONEEDED\";\nvar IODONE = \"IODONE\";\nvar BLOCKED = \"BLOCKED\";\nvar Kernel = /** @class */ (function () {\n    function Kernel() {\n        this.processes = [];\n        this.currentProcess = -1;\n        this.processCreations = 0;\n        this.events = [];\n        this.log = new _Log__WEBPACK_IMPORTED_MODULE_1__.Log();\n        this.clock = 0;\n        this.selectedEvent = -1;\n        this.generate_event();\n    }\n    Kernel.prototype.selectEvent = function (id) {\n        this.selectedEvent = id;\n    };\n    Kernel.prototype.deselectEvent = function () {\n        this.selectedEvent = -1;\n    };\n    Kernel.prototype.generate_event = function () {\n        if (this.clock % 3 === 0) {\n            this.generate_external_event();\n            this.generate_internal_event();\n        }\n    };\n    Kernel.prototype.createProcess = function () {\n        if (this.selectedEvent === -1) {\n            return {\n                status: \"ERROR\",\n                message: \"You have not selected any event.\"\n            };\n        }\n        if (this.events[this.selectedEvent].name !== REQUESTPROC) {\n            return {\n                status: \"ERROR\",\n                message: \"You have not selected process creation event.\"\n            };\n        }\n        // creating new process\n        var pid = this.processes.length;\n        var process = new _Process__WEBPACK_IMPORTED_MODULE_0__.Process(pid);\n        this.processes.push(process);\n        this.advanceClock(false);\n        this.events[this.selectedEvent].setResponceId(this.log.records.length);\n        this.selectedEvent = -1;\n        var message = \"Created Process \".concat(pid, \" at \").concat(this.clock);\n        this.log.addRecord(message);\n        return {\n            status: \"OK\",\n            message: message\n        };\n    };\n    Kernel.prototype.advanceClock = function (isUser) {\n        if (isUser === void 0) { isUser = true; }\n        if (this.selectedEvent !== -1) {\n            return {\n                status: \"ERROR\",\n                message: \"You have already selected an event. Process the Selected Event First.\"\n            };\n        }\n        this.clock++;\n        this.generate_event();\n        var message = \"Advanced clock at \".concat(this.clock);\n        if (isUser === true) {\n            this.log.addRecord(message);\n        }\n        return {\n            status: \"OK\",\n            message: message\n        };\n    };\n    Kernel.prototype.runProcess = function (id) {\n        if (this.selectedEvent !== -1) {\n            return {\n                status: \"ERROR\",\n                message: \"You have already selected a event. Process the Selected Event Fisrt.\"\n            };\n        }\n        if (this.processes[id].state !== READY) {\n            return {\n                status: \"ERROR\",\n                message: \"The Process \".concat(id, \" is not in ready pool. So it can't be moved to CPU.\")\n            };\n        }\n        if (this.currentProcess !== -1) {\n            return {\n                status: \"ERROR\",\n                message: \"The CPU is not empty.\"\n            };\n        }\n        this.processes[id].run();\n        this.currentProcess = id;\n        this.advanceClock(false);\n        var message = \"Process \".concat(id, \" is moved from ready queue to CPU\");\n        this.log.addRecord(message);\n        return {\n            status: OK,\n            message: message\n        };\n    };\n    Kernel.prototype.prempt = function () {\n        if (this.selectedEvent === -1) {\n            return {\n                status: \"ERROR\",\n                message: \"You have not selected any event\"\n            };\n        }\n        if (this.events[this.selectedEvent].name !== IONEEDED) {\n            return {\n                status: \"ERROR\",\n                message: \"You have not selected IO needed event.\"\n            };\n        }\n        this.processes[this.currentProcess].ready();\n        this.currentProcess = -1;\n        this.advanceClock();\n    };\n    Kernel.prototype.terminate = function (pid) {\n        if (this.selectedEvent === -1) {\n            return {\n                status: \"ERROR\",\n                message: \"You have not selected any event\"\n            };\n        }\n        if (this.events[this.selectedEvent].name !== TERMINATE) {\n            return {\n                status: \"ERROR\",\n                message: \"You have not selected process termination event.\"\n            };\n        }\n        if (this.events[this.selectedEvent].pid !== pid) {\n            return {\n                status: \"ERROR\",\n                message: \"The event process and selected process are not equal.\"\n            };\n        }\n        if (this.processes[pid].state === TERMINATED) {\n            return {\n                status: \"ERROR\",\n                message: \"The Process \".concat(pid, \" is already terminated.\")\n            };\n        }\n        this.processes[pid].terminate();\n        this.advanceClock(false);\n        this.events[this.selectedEvent].setResponceId(this.log.records.length);\n        this.selectedEvent = -1;\n        if (pid === this.currentProcess) {\n            this.currentProcess = -1;\n        }\n        var message = \"Terminated Process \".concat(pid, \" at \").concat(this.clock);\n        this.log.addRecord(message);\n        return {\n            status: \"OK\",\n            message: message\n        };\n    };\n    Kernel.prototype.moveToIO = function () {\n        if (this.selectedEvent === -1) {\n            return {\n                status: \"ERROR\",\n                message: \"You have not selected any event\"\n            };\n        }\n        if (this.events[this.selectedEvent].name !== IONEEDED) {\n            return {\n                status: \"ERROR\",\n                message: \"You have not selected IO needed event.\"\n            };\n        }\n        if (this.events[this.selectedEvent].pid !== this.currentProcess) {\n            return {\n                status: \"ERROR\",\n                message: \"The event process and process in cpu are not equal.\"\n            };\n        }\n        this.processes[this.currentProcess].moveToIO();\n        this.advanceClock(false);\n        this.events[this.selectedEvent].setResponceId(this.log.records.length);\n        this.selectedEvent = -1;\n        this.currentProcess = -1;\n        var message = \"Moved Process \".concat(this.currentProcess, \" to IO Pool at \").concat(this.clock);\n        this.log.addRecord(message);\n        return {\n            status: \"OK\",\n            message: message\n        };\n    };\n    Kernel.prototype.moveToReady = function (pid) {\n        if (this.selectedEvent === -1) {\n            return {\n                status: \"ERROR\",\n                message: \"You have not selected any event\"\n            };\n        }\n        if (this.events[this.selectedEvent].name !== IODONE) {\n            return {\n                status: \"ERROR\",\n                message: \"You have not selected IO Done event.\"\n            };\n        }\n        if (this.events[this.selectedEvent].pid !== pid) {\n            return {\n                status: \"ERROR\",\n                message: \"The event process and selected process are not equal.\"\n            };\n        }\n        if (this.processes[pid].state !== BLOCKED) {\n            return {\n                status: \"ERROR\",\n                message: \"The Process \".concat(pid, \" is not in IOPOOL.\")\n            };\n        }\n        this.processes[pid].ready();\n        this.advanceClock(false);\n        this.events[this.selectedEvent].setResponceId(this.log.records.length);\n        this.selectedEvent = -1;\n        var message = \"Moved Process \".concat(pid, \" from IO Pool to Ready Pool \").concat(this.clock);\n        this.log.addRecord(message);\n        return {\n            status: \"OK\",\n            message: message\n        };\n    };\n    Kernel.prototype.get_processes = function () {\n        return this.processes;\n    };\n    Kernel.prototype.getData = function () {\n        var processes = [];\n        for (var index = 0; index < this.processes.length; index++) {\n            var element = this.processes[index].getData();\n            processes.push(element);\n        }\n        var events = [];\n        for (var index = 0; index < this.events.length; index++) {\n            var element = this.events[index].getData();\n            events.push(element);\n        }\n        return {\n            processes: processes,\n            currentProcess: this.currentProcess,\n            processCreations: this.processCreations, clock: this.clock,\n            events: events,\n            log: this.log.records, selectedEvent: this.selectedEvent\n        };\n    };\n    Kernel.prototype.setData = function (data) {\n        var processes = data.processes, currentProcess = data.currentProcess, processCreations = data.processCreations, clock = data.clock, events = data.events, log = data.log;\n        this.processes = [];\n        for (var index = 0; index < processes.length; index++) {\n            var element = processes[index];\n            var p = new _Process__WEBPACK_IMPORTED_MODULE_0__.Process();\n            p.setData(element);\n            this.processes.push(p);\n        }\n        this.events = [];\n        for (var index = 0; index < events.length; index++) {\n            var element = events[index];\n            var e = new _Event__WEBPACK_IMPORTED_MODULE_2__.Event();\n            e.setData(element);\n            this.events.push(e);\n        }\n        this.log.records = log;\n        this.currentProcess = currentProcess;\n        this.processCreations = processCreations;\n        this.clock = clock;\n    };\n    Kernel.prototype.get_terminatable_procs = function () {\n        var active_procs = [];\n        for (var index = 0; index < this.processes.length; index++) {\n            var element = this.processes[index];\n            if (element.state !== \"TERMINATED\") {\n                var flag = true;\n                for (var j = 0; j < this.events.length; j++) {\n                    // console.log(\"came to term\");\n                    if (this.events[j].type == EXTERNAL && this.events[j].pid === index) {\n                        flag = false;\n                        break;\n                    }\n                }\n                if (flag === true)\n                    active_procs.push(index);\n            }\n        }\n        return active_procs;\n    };\n    Kernel.prototype.generate_external_event = function () {\n        var possible_events = [];\n        var id;\n        // Process Creation Event\n        if (this.processes.length + this.processCreations < MAXPROCESSES) {\n            id = this.events.length;\n            var new_process_event = new _Event__WEBPACK_IMPORTED_MODULE_2__.Event(id, REQUESTPROC, this.clock, -1, EXTERNAL);\n            possible_events.push(new_process_event);\n        }\n        // Kill by User (Terminate)\n        var active_procs = this.get_terminatable_procs();\n        if (active_procs.length > 0) {\n            var process_to_kill = (0,_helper_functions__WEBPACK_IMPORTED_MODULE_3__.getRandomElement)(active_procs);\n            id = this.events.length;\n            var terminate_event = new _Event__WEBPACK_IMPORTED_MODULE_2__.Event(id, TERMINATE, this.clock, process_to_kill, EXTERNAL);\n            possible_events.push(terminate_event);\n        }\n        var next_event = (0,_helper_functions__WEBPACK_IMPORTED_MODULE_3__.getRandomElement)(possible_events);\n        if (next_event.name == REQUESTPROC) {\n            this.processCreations += 1;\n        }\n        this.events.push(next_event);\n    };\n    Kernel.prototype.generate_internal_event = function () {\n    };\n    return Kernel;\n}());\n\n\n\n//# sourceURL=webpack://context-switching/./src/Kernel.ts?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Process\": () => (/* binding */ Process)\n/* harmony export */ });\nvar Process = /** @class */ (function () {\n    function Process(pid) {\n        if (pid === void 0) { pid = 0; }\n        this.pid = pid;\n        this.name = \"P\" + String(pid);\n        this.state = \"READY\";\n        this.history = [\"NEW\"];\n    }\n    Process.prototype.getData = function () {\n        return {\n            \"pid\": this.pid,\n            \"name\": this.name,\n            \"state\": this.state,\n            \"history\": this.history\n        };\n    };\n    Process.prototype.setData = function (data) {\n        var pid = data.pid, name = data.name, state = data.state, history = data.history;\n        this.pid = pid;\n        this.name = name;\n        this.state = state;\n        this.history = history;\n    };\n    Process.prototype.run = function () {\n        this.state = \"RUNNING\";\n        this.history.push(this.state);\n    };\n    Process.prototype.ready = function () {\n        this.state = \"READY\";\n        this.history.push(this.state);\n    };\n    Process.prototype.moveToIO = function () {\n        this.state = \"BLOCKED\";\n        this.history.push(this.state);\n    };\n    Process.prototype.terminate = function () {\n        this.state = \"TERMINATED\";\n        this.history.push(this.state);\n    };\n    return Process;\n}());\n\n\n\n//# sourceURL=webpack://context-switching/./src/Process.ts?");

/***/ }),

/***/ "./src/UI.ts":
/*!*******************!*\
  !*** ./src/UI.ts ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"UI\": () => (/* binding */ UI)\n/* harmony export */ });\n/* harmony import */ var _Kernel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Kernel */ \"./src/Kernel.ts\");\n\n\nvar UI = /** @class */ (function () {\n    function UI() {\n        this.kernel = new _Kernel__WEBPACK_IMPORTED_MODULE_0__.Kernel();\n    }\n    UI.prototype.display_clock = function () {\n        var clock = document.getElementById(\"clock\");\n        var clock_span = document.getElementsByTagName(\"span\")[0];\n        clock_span.innerHTML = this.kernel.clock.toString();\n    };\n    UI.prototype.update_clock = function () {\n        this.kernel.advanceClock();\n        this.display_clock();\n    };\n    UI.prototype.createProcess = function () {\n        this.kernel.selectEvent(0);\n        this.kernel.createProcess();\n        this.display_processes();\n        this.display_clock();\n    };\n    UI.prototype.add_to_pool = function (p, pool) {\n        // create a div for process inside pool\n        var process_div = document.createElement(\"div\");\n        process_div.classList.add(\"process\");\n        process_div.id = p.name;\n        process_div.innerHTML = p.name;\n        // add event listeners\n        process_div.addEventListener(\"click\", function () {\n            var modal = document.getElementById(\"myModal\");\n            var span = document.getElementsByClassName(\"close\")[0];\n            modal.style.display = \"block\";\n            span.onclick = function () {\n                modal.style.display = \"none\";\n            };\n            window.onclick = function (event) {\n                if (event.target == modal) {\n                    modal.style.display = \"none\";\n                }\n            };\n        });\n        pool.appendChild(process_div);\n    };\n    UI.prototype.display_processes = function () {\n        // clear all pools\n        var processes = document.getElementsByClassName(\"process\");\n        while (processes.length > 0) {\n            processes[0].remove();\n        }\n        // add processes to pools\n        var ready_pool = document.getElementById(\"ready_pool\");\n        var io_pool = document.getElementById(\"io_pool\");\n        var cpu = document.getElementById(\"cpu\");\n        var terminated_pool = document.getElementById(\"comp_pool\");\n        for (var i = 0; i < this.kernel.processes.length; i++) {\n            var p = this.kernel.processes[i];\n            if (p.state === \"READY\")\n                this.add_to_pool(p, ready_pool);\n            else if (p.state === \"RUNNING\")\n                this.add_to_pool(p, cpu);\n            else if (p.state === \"BLOCKED\")\n                this.add_to_pool(p, io_pool);\n            else if (p.state === \"TERMINATED\")\n                this.add_to_pool(p, terminated_pool);\n        }\n    };\n    UI.prototype.display_events = function () {\n        // remove all events\n        var events_list = document.getElementsByClassName(\"event\");\n        while (events_list.length > 0) {\n            events_list[0].remove();\n        }\n        // add events\n        var events = document.getElementById(\"all_events\");\n        for (var i = 0; i < this.kernel.events.length; i++) {\n            var e = this.kernel.events[i];\n            var event_div = document.createElement(\"div\");\n            event_div.classList.add(\"event\");\n            event_div.innerHTML = e.name;\n            event_div.addEventListener(\"click\", function () {\n                var modal = document.getElementById(\"myModal\");\n                var span = document.getElementsByClassName(\"close\")[0];\n                modal.style.display = \"block\";\n                span.onclick = function () {\n                    modal.style.display = \"none\";\n                };\n                window.onclick = function (event) {\n                    if (event.target == modal) {\n                        modal.style.display = \"none\";\n                    }\n                };\n            });\n            events.appendChild(event_div);\n        }\n    };\n    UI.prototype.display_all = function () {\n        this.display_clock();\n        this.display_processes();\n        this.display_events();\n    };\n    return UI;\n}());\n\n\n//# sourceURL=webpack://context-switching/./src/UI.ts?");

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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _UI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UI */ \"./src/UI.ts\");\n\nvar ui = new _UI__WEBPACK_IMPORTED_MODULE_0__.UI();\nui.createProcess();\nui.createProcess();\nui.createProcess();\nui.createProcess();\nui.createProcess();\nui.createProcess();\nui.createProcess();\nui.createProcess();\n// ui.createEvent();\ndocument.getElementById(\"clock\").addEventListener(\"click\", function () {\n    ui.update_clock();\n});\n\n\n//# sourceURL=webpack://context-switching/./src/main.ts?");

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