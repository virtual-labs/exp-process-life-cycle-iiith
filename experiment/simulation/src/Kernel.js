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
var PROCESS = "PROCESS";
var TERMINATE = "TERMINATE";
var READY = "READY";
var ERROR = "ERROR";
var OK = "OK";
var TERMINATED = "TERMINATED";
var IONEEDED = "IONEEDED";
var IODONE = "IODONE";
var BLOCKED = "BLOCKED";
var Kernel = /** @class */ (function () {
    function Kernel() {
        this.processes = [];
        this.currentProcess = -1;
        this.processCreations = 0;
        this.events = [];
        this.log = new Log_1.Log();
        this.clock = 0;
        this.selectedEvent = -1;
        this.generate_event();
    }
    Kernel.prototype.selectEvent = function (id) {
        this.selectedEvent = id;
    };
    Kernel.prototype.deselectEvent = function () {
        this.selectedEvent = -1;
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
                message: "You have already selected an event. Process the Selected Event First."
            };
        }
        // this.clock++;
        console.log("Hello World");
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
                message: "You have already selected a event. Process the Selected Event Fisrt."
            };
        }
        if (this.processes[id].state !== READY) {
            return {
                status: "ERROR",
                message: "The Process ".concat(id, " is not in ready pool. So it can't be moved to CPU.")
            };
        }
        if (this.currentProcess !== -1) {
            return {
                status: "ERROR",
                message: "The CPU is not empty."
            };
        }
        this.processes[id].run();
        this.currentProcess = id;
        this.advanceClock(false);
        var message = "Process ".concat(id, " is moved from ready queue to CPU");
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
                message: "You have not selected any event"
            };
        }
        if (this.events[this.selectedEvent].name !== IONEEDED) {
            return {
                status: "ERROR",
                message: "You have not selected IO needed event."
            };
        }
        this.processes[this.currentProcess].ready();
        this.currentProcess = -1;
        this.advanceClock();
    };
    Kernel.prototype.terminate = function (pid) {
        if (this.selectedEvent === -1) {
            return {
                status: "ERROR",
                message: "You have not selected any event"
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
        this.advanceClock(false);
        this.events[this.selectedEvent].setResponceId(this.log.records.length);
        this.selectedEvent = -1;
        if (pid === this.currentProcess) {
            this.currentProcess = -1;
        }
        var message = "Terminated Process ".concat(pid, " at ").concat(this.clock);
        this.log.addRecord(message);
        return {
            status: "OK",
            message: message
        };
    };
    Kernel.prototype.moveToIO = function () {
        if (this.selectedEvent === -1) {
            return {
                status: "ERROR",
                message: "You have not selected any event"
            };
        }
        if (this.events[this.selectedEvent].name !== IONEEDED) {
            return {
                status: "ERROR",
                message: "You have not selected IO needed event."
            };
        }
        if (this.events[this.selectedEvent].pid !== this.currentProcess) {
            return {
                status: "ERROR",
                message: "The event process and process in cpu are not equal."
            };
        }
        this.processes[this.currentProcess].moveToIO();
        this.advanceClock(false);
        this.events[this.selectedEvent].setResponceId(this.log.records.length);
        this.selectedEvent = -1;
        this.currentProcess = -1;
        var message = "Moved Process ".concat(this.currentProcess, " to IO Pool at ").concat(this.clock);
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
                message: "You have not selected any event"
            };
        }
        if (this.events[this.selectedEvent].name !== IODONE) {
            return {
                status: "ERROR",
                message: "You have not selected IO Done event."
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
                message: "The Process ".concat(pid, " is not in IOPOOL.")
            };
        }
        this.processes[pid].ready();
        this.advanceClock(false);
        this.events[this.selectedEvent].setResponceId(this.log.records.length);
        this.selectedEvent = -1;
        var message = "Moved Process ".concat(pid, " from IO Pool to Ready Pool ").concat(this.clock);
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
        var next_event = (0, helper_functions_1.getRandomElement)(possible_events);
        if (next_event.name == REQUESTPROC) {
            this.processCreations += 1;
        }
        this.events.push(next_event);
    };
    Kernel.prototype.generate_internal_event = function () {
    };
    return Kernel;
}());
exports.Kernel = Kernel;
