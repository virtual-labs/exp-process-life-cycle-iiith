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

/***/ "./src/helper_functions.ts":
/*!*********************************!*\
  !*** ./src/helper_functions.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initialize_processes\": () => (/* binding */ initialize_processes)\n/* harmony export */ });\n\nvar getRandomInt = function (min, max) {\n    min = Math.ceil(min);\n    max = Math.floor(max);\n    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive\n};\nvar create_process = function (id) {\n    var ticks = getRandomInt(2, 5);\n    return {\n        \"id\": id,\n        \"ticks\": ticks,\n        \"start_time\": getRandomInt(0, 10),\n        \"cur_ticks\": 0,\n        \"io\": {\n            \"start_time\": getRandomInt(1, ticks - 1),\n            \"ticks\": getRandomInt(1, 3)\n        }\n    };\n};\nvar initialize_processes = function (n) {\n    var processes = [];\n    for (var i = 0; i < n; i++) {\n        processes.push(create_process(i));\n    }\n    processes.sort(function (p1, p2) { return p1.start_time - p2.start_time; });\n    return processes;\n};\n\n\n//# sourceURL=webpack://context-switching/./src/helper_functions.ts?");

/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helper_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper_functions */ \"./src/helper_functions.ts\");\n\nvar instruction = document.getElementById(\"instruction\");\ninstruction.textContent = \"No Instruction for now\";\nvar current_time = 0;\nvar processes = (0,_helper_functions__WEBPACK_IMPORTED_MODULE_0__.initialize_processes)(6);\nvar ready = [];\nvar io_queue = [];\nvar completed = (0,_helper_functions__WEBPACK_IMPORTED_MODULE_0__.initialize_processes)(6);\nvar cpu_proc = null;\nvar prempt = 0;\nvar update_ready_queue = function () {\n    var ready_queue = document.querySelector(\"#ready_queue .queue_body\");\n    ready_queue.innerHTML = \"\";\n    ready.forEach(function (process) {\n        var p = document.createElement('p');\n        p.textContent = \"P\" + String(process.id);\n        p.classList.add('process');\n        ready_queue.appendChild(p);\n        p.onclick = function (event) {\n            console.log(\"hello eswar\");\n            cpu_proc = process;\n            ready = ready.filter(function (proc) { return proc.id !== process.id; });\n            update();\n        };\n    });\n};\nvar update_cpu = function () {\n    if (cpu_proc !== null) {\n        console.log(\"pora yedava\");\n        var cpu_ele = document.querySelector(\"#cpu .queue_body\");\n        cpu_ele.innerHTML = \"\";\n        var p = document.createElement('p');\n        p.textContent = \"P\" + String(cpu_proc.id);\n        p.classList.add('process');\n        cpu_ele.appendChild(p);\n    }\n    else {\n        var cpu_ele = document.querySelector(\"#cpu .queue_body\");\n        cpu_ele.innerHTML = \"No Process in CPU\";\n    }\n};\nvar update_instruction = function () {\n    var inst = \"\".concat(current_time, \" No instruction for now\");\n    if (processes.length > 0 && processes[0].start_time == current_time) {\n        inst = \"\".concat(current_time, \" There is a new process P\").concat(processes[0].id, \" request please create it\");\n    }\n    else if (cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.io.start_time) {\n        inst = \"\".concat(current_time, \" The process P\").concat(cpu_proc.id, \" in CPU needs IO. Send it to IO queue by clicking GoTo IO.\");\n    }\n    instruction.textContent = inst;\n};\nvar update = function () {\n    update_instruction();\n    update_ready_queue();\n    update_cpu();\n};\nupdate();\ndocument.getElementById(\"advance_clock\").onclick = function (event) {\n    current_time = current_time + 1;\n    if (cpu_proc !== null) {\n        cpu_proc.cur_ticks = cpu_proc.cur_ticks + 1;\n        prempt = prempt + 1;\n    }\n    update();\n};\ndocument.getElementById(\"create\").onclick = function (event) {\n    if (processes.length > 0 && processes[0].start_time == current_time) {\n        ready.push(processes[0]);\n        processes.shift();\n        update();\n    }\n};\ndocument.getElementById(\"prempt\").onclick = function (event) {\n    if (cpu_proc !== null) {\n        ready.push(cpu_proc);\n        cpu_proc = null;\n        update();\n    }\n};\ndocument.getElementById(\"goto_io\").onclick = function (event) {\n    if (cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.io.start_time) {\n        io_queue.push(cpu_proc);\n        cpu_proc = null;\n        update_cpu();\n    }\n};\n\n\n//# sourceURL=webpack://context-switching/./src/main.ts?");

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