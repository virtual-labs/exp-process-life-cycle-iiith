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

/***/ "./src/exercise.ts":
/*!*************************!*\
  !*** ./src/exercise.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _helper_functions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helper_functions */ \"./src/helper_functions.ts\");\n\nvar instruction = document.getElementById(\"instruction\");\ninstruction.textContent = \"No Instruction for now\";\nvar isWrong = false;\nvar wrongMovePos = -1;\nvar whatIsWrong = \"\";\nvar log = [];\nvar current_time = 0;\nvar processes = (0,_helper_functions__WEBPACK_IMPORTED_MODULE_0__.initialize_processes)(6);\n// console.log(processes);\nvar ready = [];\nvar io = [];\nvar completed = [];\nvar cpu_proc = null;\nvar prempt = 0;\nvar cpu_time = 3;\nfunction create_process_ui(process) {\n    var d = document.createElement('div');\n    var p = document.createElement('p');\n    p.textContent = \"P\" + String(process.id);\n    d.appendChild(p);\n    // let p2 = document.createElement('p');\n    // p2.textContent = \"Remaining Time: \" + String(process.ticks - process.cur_ticks);\n    // d.appendChild(p2);\n    d.classList.add('process');\n    return d;\n}\nvar update_ready_queue = function () {\n    var ready_queue = document.querySelector(\"#ready_queue .queue_body\");\n    ready_queue.innerHTML = \"\";\n    ready.forEach(function (process) {\n        // const p = document.createElement('p');\n        // p.textContent = \"P\" + String(process.id);\n        // p.classList.add('process');\n        var d = create_process_ui(process);\n        ready_queue.appendChild(d);\n        d.onclick = function (event) {\n            // check if sending the process to cpu is correct\n            if (cpu_proc !== null) {\n                if (!isWrong) {\n                    whatIsWrong = \"You have sent the process P\".concat(process.id, \" to CPU while CPU is not empty.\");\n                }\n                wrong_move();\n            }\n            // console.log(\"hello eswar\")\n            cpu_proc = process;\n            ready = ready.filter(function (proc) { return proc.id !== process.id; });\n            log.push(\"Process P\".concat(process.id, \" is moved from ready pool to CPU\"));\n            update();\n        };\n    });\n};\nvar update_io_queue = function () {\n    var io_queue = document.querySelector(\"#io_queue .queue_body\");\n    io_queue.innerHTML = \"\";\n    io.forEach(function (process) {\n        // const p = document.createElement('p');\n        // p.textContent = \"P\" + String(process.id);\n        // p.classList.add('process');\n        var d = create_process_ui(process);\n        io_queue.appendChild(d);\n    });\n};\nvar update_complete_pool = function () {\n    var complete_pool = document.querySelector(\"#complete_pool .queue_body\");\n    complete_pool.innerHTML = \"\";\n    completed.forEach(function (process) {\n        // const p = document.createElement('p');\n        // p.textContent = \"P\" + String(process.id);\n        // p.classList.add('process');\n        var d = create_process_ui(process);\n        complete_pool.appendChild(d);\n    });\n};\nvar update_cpu = function () {\n    if (cpu_proc !== null) {\n        // console.log(\"pora yedava\");\n        var cpu_ele = document.querySelector(\"#cpu .queue_body\");\n        cpu_ele.innerHTML = \"\";\n        // const p = document.createElement('p');\n        // p.textContent = \"P\" + String(cpu_proc.id);\n        // p.classList.add('process');\n        var d = create_process_ui(cpu_proc);\n        cpu_ele.appendChild(d);\n    }\n    else {\n        var cpu_ele = document.querySelector(\"#cpu .queue_body\");\n        cpu_ele.innerHTML = \"No Process in CPU\";\n    }\n};\nfunction result() {\n    if (isWrong) {\n        return \"Incorrect. Your first major mistake is at \".concat(wrongMovePos + 1, \"th move.\") + whatIsWrong;\n    }\n    else {\n        return \"Well Done! You have successfully completed running all the processes using correct context switches.\";\n    }\n}\nvar update_instruction = function () {\n    var inst = \"Advance the clock\";\n    if (completed.length == 6) {\n        inst = result();\n    }\n    else if (processes.length > 0 && processes[0].start_time == current_time) {\n        inst = \"There is a create request for a new process P\".concat(processes[0].id);\n    }\n    else if (cpu_proc === null && ready.length > 0) {\n        // inst = \"The CPU is empty. Please select a process in ready queue for execution\";\n        inst = \"\";\n    }\n    else if (cpu_proc !== null && cpu_proc.io != null && cpu_proc.cur_ticks === cpu_proc.io.start_time) {\n        inst = \"The process P\".concat(cpu_proc.id, \" in CPU needs IO.\");\n    }\n    else if (cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.ticks) {\n        inst = \"The process P\".concat(cpu_proc.id, \" in CPU hit the termination instruction.\");\n    }\n    else if (cpu_proc !== null && prempt == cpu_time) {\n        inst = \"The process P\".concat(cpu_proc.id, \" in CPU completed its current cpu time.\");\n    }\n    else {\n        // io queue\n        var flag = false;\n        for (var index = 0; index < io.length; index++) {\n            if (io[index].io != null && io[index].io.ticks === 0) {\n                inst = \"The process P\".concat(io[index].id, \" in IO pool is done with IO.\");\n                break;\n            }\n        }\n    }\n    instruction.textContent = inst;\n};\nfunction update_clock() {\n    document.getElementById(\"clock_val\").textContent = String(current_time);\n}\nvar update = function () {\n    update_instruction();\n    update_ready_queue();\n    update_cpu();\n    update_io_queue();\n    update_complete_pool();\n    update_clock();\n    console.log(log);\n};\nupdate();\nfunction wrong_move() {\n    if (!isWrong) {\n        isWrong = true;\n        wrongMovePos = log.length;\n        console.log(wrongMovePos);\n    }\n}\ndocument.getElementById(\"advance_clock\").onclick = function (event) {\n    // check if the user has done all the required things before advancing the clock\n    if (completed.length == 6) {\n        alert(\"You have completed running all processes. Please refresh the page to start again.\");\n        return;\n    }\n    else if (processes.length > 0 && processes[0].start_time == current_time) {\n        // alert(\"Please create the new process before advancing the clock.\");\n        if (!isWrong) {\n            whatIsWrong = \"You did not create the new process before advancing the clock.\";\n        }\n        wrong_move();\n    }\n    else if (cpu_proc === null && ready.length > 0) {\n        // alert(\"The CPU is empty. Please select a process in ready queue for execution\");\n        if (!isWrong) {\n            whatIsWrong = \"The CPU was empty. You did not select a process in ready pool for execution before advancing the clock.\";\n        }\n        wrong_move();\n    }\n    else if (cpu_proc !== null && cpu_proc.io != null && cpu_proc.cur_ticks === cpu_proc.io.start_time) {\n        // alert(\"The process in CPU needs IO. Please send it to IO queue by clicking IO.\");\n        if (!isWrong) {\n            whatIsWrong = \"The process in CPU needed IO. You did not send it to IO pool before advancing the clock.\";\n        }\n        wrong_move();\n    }\n    else if (cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.ticks) {\n        // alert(\"The process in CPU completed its work. Please send it to complete pool by clicking Complete.\");\n        if (!isWrong) {\n            whatIsWrong = \"The process P\".concat(cpu_proc.id, \" in CPU hit the termination instruction. You did not terminate it before advancing the clock.\");\n        }\n        wrong_move();\n    }\n    else if (cpu_proc !== null && prempt == cpu_time) {\n        // alert(\"The process in CPU completed its current cpu time. Please send it to ready queue by clicking Prempt.\");\n        if (!isWrong) {\n            whatIsWrong = \"The process P\".concat(cpu_proc.id, \" in CPU needed to be preempted. You did not preempt it before advancing the clock.\");\n        }\n        wrong_move();\n    }\n    else {\n        // io queue\n        // let flag: Boolean = false;\n        for (var index = 0; index < io.length; index++) {\n            if (io[index].io != null && io[index].io.ticks === 0) {\n                // alert(`The process P${io[index].id} in IO queue got IO. Please collect data and send it to ready queue by clicking Collect.`);\n                if (!isWrong) {\n                    whatIsWrong = \"The process P\".concat(io[index].id, \" in IO pool got IO. You did not send it to ready pool before advancing the clock.\");\n                }\n                wrong_move();\n                // flag = true;\n                break;\n            }\n        }\n        // if (flag) return;\n    }\n    current_time = current_time + 1;\n    if (cpu_proc !== null) {\n        cpu_proc.cur_ticks = cpu_proc.cur_ticks + 1;\n        prempt = prempt + 1;\n    }\n    for (var index = 0; index < io.length; index++) {\n        io[index].io.ticks--;\n    }\n    log.push(\"Advanced clock to \".concat(current_time));\n    update();\n};\ndocument.getElementById(\"create\").onclick = function (event) {\n    // check if clicking \"create\" is valid\n    if (processes[0].start_time != current_time) {\n        alert(\"There is no process that is ready to be created.\");\n        return;\n    }\n    if (processes.length > 0 && processes[0].start_time == current_time) {\n        ready.push(processes[0]);\n        processes.shift();\n        log.push(\"Created process P\".concat(ready[ready.length - 1].id));\n        update();\n    }\n};\ndocument.getElementById(\"prempt\").onclick = function (event) {\n    // check if clicking \"prempt\" is valid\n    if (cpu_proc === null) {\n        alert(\"The CPU is empty. There is no process to preempt.\");\n        return;\n    }\n    else if (prempt != cpu_time) {\n        // alert(\"The process in CPU has not completed its current cpu time. Please wait for it to complete.\");\n        if (!isWrong) {\n            whatIsWrong = \"The process P\".concat(cpu_proc.id, \" in CPU has not completed its current cpu time. You did not wait for it to complete before preempting it.\");\n        }\n        wrong_move();\n        // return;\n    }\n    // if (cpu_proc !== null && prempt == cpu_time) {\n    ready.push(cpu_proc);\n    cpu_proc = null;\n    prempt = 0;\n    log.push(\"Preempted process P\".concat(ready[ready.length - 1].id, \", and put it in ready queue\"));\n    update();\n    // }\n};\ndocument.getElementById(\"goto_io\").onclick = function (event) {\n    // check if clicking \"goto_io\" is valid\n    if (cpu_proc === null) {\n        alert(\"The CPU is empty. There is no process to send to IO.\");\n        return;\n    }\n    else if (cpu_proc.io != null && cpu_proc.cur_ticks != cpu_proc.io.start_time) {\n        // alert(\"The process in CPU doesn't need IO now.\");\n        if (!isWrong) {\n            whatIsWrong = \"The process P\".concat(cpu_proc.id, \" in CPU did not need IO. But you sent it to IO pool.\");\n        }\n        wrong_move();\n        // return;\n    }\n    // if (cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.io.start_time) {\n    io.push(cpu_proc);\n    // console.log(\"In Goto IO\");\n    // console.log(cpu_proc);\n    cpu_proc = null;\n    prempt = 0;\n    log.push(\"Sent process P\".concat(io[io.length - 1].id, \" to IO pool\"));\n    update();\n    // }\n};\ndocument.getElementById(\"collect\").onclick = function (event) {\n    // check if clicking \"collect\" is valid\n    if (io.length === 0) {\n        alert(\"The IO pool is empty. There is no process to send to Ready Pool.\");\n        return;\n    }\n    var process;\n    var flag = false;\n    for (var index = 0; index < io.length; index++) {\n        if (io[index].io != null && io[index].io.ticks === 0) {\n            flag = true;\n            process = io[index];\n            break;\n        }\n    }\n    if (!flag) {\n        // alert(\"There is no process in IO pool that has completed IO.\");\n        if (!isWrong) {\n            whatIsWrong = \"There was no process in IO pool that had completed IO. You did not wait for it to complete before sending it to ready pool.\";\n        }\n        wrong_move();\n        process = io[0]; // send the first process if none of the process has completed IO\n        // return;\n    }\n    // for (let index = 0; index < io.length; index++) {\n    //     if (io[index].io.ticks === 0) {\n    //         process = io[index];\n    //         break;\n    //     }\n    // }\n    process.io.start_time = -1;\n    ready.push(process);\n    io = io.filter(function (proc) { return proc.id !== process.id; });\n    log.push(\"Sent the process P\".concat(process.id, \" from IO pool to ready pool\"));\n    update();\n};\ndocument.getElementById(\"kill\").onclick = function (event) {\n    // check if clicking \"kill\" is valid\n    if (cpu_proc === null) {\n        alert(\"There is no process in CPU to terminate.\");\n        return;\n    }\n    else if (cpu_proc.cur_ticks != cpu_proc.ticks) {\n        // alert(\"The process in CPU has not hit its termination instruction yet.\");\n        if (!isWrong) {\n            whatIsWrong = \"You terminated the process P\".concat(cpu_proc.id, \" in CPU before it hit its termination instruction.\");\n        }\n        wrong_move();\n        // return;\n    }\n    // if (cpu_proc !== null && cpu_proc.cur_ticks === cpu_proc.ticks) {\n    completed.push(cpu_proc);\n    cpu_proc = null;\n    prempt = 0;\n    log.push(\"Terminated process P\".concat(completed[completed.length - 1].id));\n    update();\n    // }\n};\n\n\n//# sourceURL=webpack://context-switching/./src/exercise.ts?");

/***/ }),

/***/ "./src/helper_functions.ts":
/*!*********************************!*\
  !*** ./src/helper_functions.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"initialize_processes\": () => (/* binding */ initialize_processes)\n/* harmony export */ });\n\nvar getRandomInt = function (min, max) {\n    min = Math.ceil(min);\n    max = Math.floor(max);\n    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive\n};\nvar create_process = function (id) {\n    var ticks = getRandomInt(3, 6);\n    var io = {\n        \"start_time\": getRandomInt(1, ticks - 1),\n        \"ticks\": getRandomInt(1, 3)\n    };\n    if (id % 2 == 0) {\n        io = null;\n    }\n    return {\n        \"id\": id,\n        \"ticks\": ticks,\n        \"start_time\": getRandomInt(0, 10),\n        \"cur_ticks\": 0,\n        \"io\": io\n    };\n};\nvar initialize_processes = function (n) {\n    var processes = [];\n    for (var i = 0; i < n; i++) {\n        processes.push(create_process(i));\n    }\n    processes.sort(function (p1, p2) { return p1.start_time - p2.start_time; });\n    return processes;\n};\n\n\n//# sourceURL=webpack://context-switching/./src/helper_functions.ts?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/exercise.ts");
/******/ 	
/******/ })()
;