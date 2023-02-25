"use strict";
exports.__esModule = true;
exports.Kernel = void 0;
var Process_1 = require("./Process");
var Log_1 = require("./Log");
var Event_1 = require("./Event");
var helper_functions_1 = require("./helper_functions");
var MAXPROCESSES = 5;
var ACTIVE = "ACTIVE";
var DONE = "DONE";
var REQUESTPROC = "REQUESTPROC";
var EXTERNAL = "EXTERNAL";
var INTERNAL = "INTERNAL";
var PROCESS = "PROCESS";
var TERMINATE = "TERMINATE";
var READY = "READY";
var ERROR = "ERROR";
var OK = "OK";
var TERMINATED = "TERMINATED";
var IONEEDED = "IONEEDED";
var IODONE = "IODONE";
var BLOCKED = "BLOCKED";
var COMPLETED = "COMPLETED";
var IO = "IO";
var CPU = "CPU";
var PREMPT = "PREMPT";
var Kernel = /** @class */ (function () {
    function Kernel() {
        this.reset();
    }
    Kernel.prototype.reset = function () {
        this.processes = [];
        this.currentProcess = -1;
        this.processCreations = 0;
        this.events = [];
        this.log = new Log_1.Log();
        this.clock = 0;
        this.selectedEvent = -1;
        this.generate_event();
    };
    Kernel.prototype.selectEvent = function (id) {
        this.selectedEvent = id;
    };
    Kernel.prototype.deselectEvent = function () {
        this.selectedEvent = -1;
    };
    Kernel.prototype.moveProcess = function (pid, bin) {
        if (bin === COMPLETED) {
            return this.terminate(pid); // checked
        }
        else if (bin === IO) {
            return this.moveToIO(pid); // checked
        }
        else if (bin === READY) {
            if (pid === this.currentProcess) {
                this.prempt();
            }
            else {
                return this.moveToReady(pid); // checked
            }
        }
        else if (bin === CPU) {
            return this.runProcess(pid);
        }
        return {
            status: ERROR,
            message: "The bin you have chosen is invalid."
        };
    };
    Kernel.prototype.generate_event = function () {
        if (this.clock % 3 === 0) {
            this.generate_external_event();
            this.generate_internal_event();
        }
    };
    Kernel.prototype.createProcess = function () {
        if (this.selectedEvent === -1) {
            return {
                status: "ERROR",
                message: "You have not selected any event."
            };
        }
        if (this.events[this.selectedEvent].name !== REQUESTPROC) {
            return {
                status: "ERROR",
                message: "You have not selected process creation event."
            };
        }
        // creating new process
        var pid = this.processes.length;
        var process = new Process_1.Process(pid);
        this.processes.push(process);
        this.events[this.selectedEvent].setResponceId(this.log.records.length);
        this.selectedEvent = -1;
        console.log(this.advanceClock(false));
        var message = "Created Process ".concat(pid, " at ").concat(this.clock);
        this.log.addRecord(message);
        return {
            status: "OK",
            message: message
        };
    };
    Kernel.prototype.advanceClock = function (isUser) {
        if (isUser === void 0) { isUser = true; }
        if (this.selectedEvent !== -1) {
            return {
                status: "ERROR",
                message: "You have already selected an event. Process the selected event First."
            };
        }
        // this.clock++;
        // console.log("Hello World");
        this.clock = this.clock + 1;
        this.generate_event();
        var message = "Advanced clock at ".concat(this.clock);
        if (isUser === true) {
            this.log.addRecord(message);
        }
        return {
            status: "OK",
            message: message
        };
    };
    Kernel.prototype.runProcess = function (id) {
        if (this.selectedEvent !== -1) {
            return {
                status: "ERROR",
                message: "You have already selected a event. Process the selected event first."
            };
        }
        if (this.processes[id].state !== READY) {
            return {
                status: "ERROR",
                message: "The Process ".concat(id, " is not in the ready pool. So it can't be moved to CPU.")
            };
        }
        if (this.currentProcess !== -1) {
            return {
                status: "ERROR",
                message: "The CPU is not idle."
            };
        }
        this.processes[id].run();
        this.currentProcess = id;
        this.advanceClock(false);
        var message = "Process ".concat(id, " is moved from ready queue to the CPU.");
        this.log.addRecord(message);
        return {
            status: OK,
            message: message
        };
    };
    Kernel.prototype.prempt = function () {
        if (this.selectedEvent === -1) {
            return {
                status: "ERROR",
                message: "You have not selected any event."
            };
        }
        if (this.events[this.selectedEvent].name !== PREMPT) {
            return {
                status: "ERROR",
                message: "You have not selected Prempt event."
            };
        }
        this.processes[this.currentProcess].ready();
        this.events[this.selectedEvent].setResponceId(this.log.records.length);
        this.selectedEvent = -1;
        this.advanceClock(false);
        var message = "Moved Process ".concat(this.currentProcess, " from CPU to Ready Pool ").concat(this.clock, ".");
        this.log.addRecord(message);
        this.currentProcess = -1;
        return {
            status: "OK",
            message: message
        };
    };
    Kernel.prototype.terminate = function (pid) {
        if (this.selectedEvent === -1) {
            return {
                status: "ERROR",
                message: "You have not selected any event."
            };
        }
        if (this.events[this.selectedEvent].name !== TERMINATE) {
            return {
                status: "ERROR",
                message: "You have not selected process termination event."
            };
        }
        if (this.events[this.selectedEvent].pid !== pid) {
            return {
                status: "ERROR",
                message: "The event process and selected process are not equal."
            };
        }
        if (this.processes[pid].state === TERMINATED) {
            return {
                status: "ERROR",
                message: "The Process ".concat(pid, " is already terminated.")
            };
        }
        this.processes[pid].terminate();
        this.events[this.selectedEvent].setResponceId(this.log.records.length);
        this.selectedEvent = -1;
        this.advanceClock(false);
        if (pid === this.currentProcess) {
            this.currentProcess = -1;
        }
        var message = "Terminated Process ".concat(pid, " at ").concat(this.clock, ".");
        this.log.addRecord(message);
        return {
            status: "OK",
            message: message
        };
    };
    Kernel.prototype.moveToIO = function (pid) {
        if (this.selectedEvent === -1) {
            return {
                status: "ERROR",
                message: "You have not selected any event."
            };
        }
        if (this.events[this.selectedEvent].name !== IONEEDED) {
            return {
                status: "ERROR",
                message: "You have not selected ioNeeded event."
            };
        }
        if (pid !== this.currentProcess) {
            return {
                status: "ERROR",
                message: "The process you selected is not in the CPU."
            };
        }
        if (this.events[this.selectedEvent].pid !== this.currentProcess) {
            return {
                status: "ERROR",
                message: "The event process and process in cpu are not equal."
            };
        }
        this.processes[this.currentProcess].moveToIO();
        this.events[this.selectedEvent].setResponceId(this.log.records.length);
        this.selectedEvent = -1;
        this.advanceClock(false);
        this.currentProcess = -1;
        var message = "Moved Process ".concat(pid, " to IO Pool at ").concat(this.clock, ".");
        this.log.addRecord(message);
        return {
            status: "OK",
            message: message
        };
    };
    Kernel.prototype.moveToReady = function (pid) {
        if (this.selectedEvent === -1) {
            return {
                status: "ERROR",
                message: "You have not selected any event."
            };
        }
        if (this.events[this.selectedEvent].name !== IODONE) {
            return {
                status: "ERROR",
                message: "You have not selected the ioDone event."
            };
        }
        if (this.events[this.selectedEvent].pid !== pid) {
            return {
                status: "ERROR",
                message: "The event process and selected process are not equal."
            };
        }
        if (this.processes[pid].state !== BLOCKED) {
            return {
                status: "ERROR",
                message: "The Process ".concat(pid, " is not in IO POOL.")
            };
        }
        this.processes[pid].ready();
        this.events[this.selectedEvent].setResponceId(this.log.records.length);
        this.selectedEvent = -1;
        this.advanceClock(false);
        var message = "Moved Process ".concat(pid, " from IO Pool to Ready Pool ").concat(this.clock, ".");
        this.log.addRecord(message);
        return {
            status: "OK",
            message: message
        };
    };
    Kernel.prototype.get_processes = function () {
        return this.processes;
    };
    Kernel.prototype.getData = function () {
        var processes = [];
        for (var index = 0; index < this.processes.length; index++) {
            var element = this.processes[index].getData();
            processes.push(element);
        }
        var events = [];
        for (var index = 0; index < this.events.length; index++) {
            var element = this.events[index].getData();
            events.push(element);
        }
        return {
            processes: processes,
            currentProcess: this.currentProcess,
            processCreations: this.processCreations, clock: this.clock,
            events: events,
            log: this.log.records, selectedEvent: this.selectedEvent
        };
    };
    Kernel.prototype.setData = function (data) {
        var processes = data.processes, currentProcess = data.currentProcess, processCreations = data.processCreations, clock = data.clock, events = data.events, log = data.log;
        this.processes = [];
        for (var index = 0; index < processes.length; index++) {
            var element = processes[index];
            var p = new Process_1.Process();
            p.setData(element);
            this.processes.push(p);
        }
        this.events = [];
        for (var index = 0; index < events.length; index++) {
            var element = events[index];
            var e = new Event_1.Event();
            e.setData(element);
            this.events.push(e);
        }
        this.log.records = log;
        this.currentProcess = currentProcess;
        this.processCreations = processCreations;
        this.clock = clock;
    };
    Kernel.prototype.get_terminatable_procs = function () {
        var active_procs = [];
        for (var index = 0; index < this.processes.length; index++) {
            var element = this.processes[index];
            if (element.state !== "TERMINATED") {
                var flag = true;
                for (var j = 0; j < this.events.length; j++) {
                    // console.log("came to term");
                    if (this.events[j].type == EXTERNAL && this.events[j].pid === index) {
                        flag = false;
                        break;
                    }
                }
                if (flag === true)
                    active_procs.push(index);
            }
        }
        return active_procs;
    };
    Kernel.prototype.generate_external_event = function () {
        var possible_events = [];
        var id;
        // Process Creation Event
        if (this.processes.length + this.processCreations < MAXPROCESSES) {
            id = this.events.length;
            var new_process_event = new Event_1.Event(id, REQUESTPROC, this.clock, -1, EXTERNAL);
            possible_events.push(new_process_event);
        }
        // Kill by User (Terminate)
        var active_procs = this.get_terminatable_procs();
        if (active_procs.length > 0) {
            var process_to_kill = (0, helper_functions_1.getRandomElement)(active_procs);
            id = this.events.length;
            var terminate_event = new Event_1.Event(id, TERMINATE, this.clock, process_to_kill, EXTERNAL);
            possible_events.push(terminate_event);
        }
        // Genearating Premption Event
        if (this.currentProcess !== -1) {
            var flag = true;
            for (var index = 0; index < this.events.length; index++) {
                var element = this.events[index];
                if (element.pid !== this.currentProcess) {
                    continue;
                }
                if (element.state !== ACTIVE) {
                    continue;
                }
                if (element.name === IONEEDED) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                id = this.events.length;
                var prempt_event = new Event_1.Event(id, PREMPT, this.clock, this.currentProcess, EXTERNAL);
                possible_events.push(prempt_event);
            }
        }
        if (possible_events.length > 0) {
            var next_event = (0, helper_functions_1.getRandomElement)(possible_events);
            if (next_event.name == REQUESTPROC) {
                this.processCreations += 1;
            }
            this.events.push(next_event);
        }
    };
    Kernel.prototype.generate_internal_event = function () {
        var possible_events = [];
        var id;
        // IO Need
        if (this.currentProcess !== -1) {
            var flag = true;
            for (var index = 0; index < this.events.length; index++) {
                var element = this.events[index];
                if (element.pid !== this.currentProcess) {
                    continue;
                }
                if (element.state !== ACTIVE) {
                    continue;
                }
                if (element.name === PREMPT) {
                    flag = false;
                    break;
                }
            }
            if (flag === true) {
                id = this.events.length;
                var ioneed_event = new Event_1.Event(id, IONEEDED, this.clock, this.currentProcess, INTERNAL);
                possible_events.push(ioneed_event);
            }
        }
        // IO Done Event
        var io_processes = [];
        for (var index = 0; index < this.processes.length; index++) {
            var element = this.processes[index];
            if (element.state === BLOCKED) {
                io_processes.push(index);
            }
        }
        if (io_processes.length > 0) {
            var process_to_ready = (0, helper_functions_1.getRandomElement)(io_processes);
            id = this.events.length;
            var idodone_event = new Event_1.Event(id, IODONE, this.clock, process_to_ready, INTERNAL);
            possible_events.push(idodone_event);
        }
        if (possible_events.length > 0) {
            var next_event = (0, helper_functions_1.getRandomElement)(possible_events);
            this.events.push(next_event);
        }
    };
    return Kernel;
}());
exports.Kernel = Kernel;
