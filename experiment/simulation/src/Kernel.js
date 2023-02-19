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
var Kernel = /** @class */ (function () {
    function Kernel() {
        this.processes = [];
        this.currentProcess = -1;
        this.processCreations = 0;
        this.events = [];
        this.log = new Log_1.Log();
        this.clock = 0;
        this.generate_event();
        this.selectedEvent = -1;
    }
    Kernel.prototype.selectEvent = function (id) {
        this.selectedEvent = id;
    };
    Kernel.prototype.generate_event = function () {
        if (this.clock % 3 === 0) {
            this.generate_external_event();
            this.generate_internal_event();
        }
    };
    Kernel.prototype.createProcess = function () {
        if (this.selectedEvent !== -1) {
            return {
                status: "ERROR",
                message: "You have not selected any event"
            };
        }
        if (this.events[this.selectedEvent].name !== REQUESTPROC) {
            return {
                status: "ERROR",
                message: "You have not selected process creation event."
            };
        }
        var pid = this.processes.length;
        var process = new Process_1.Process(pid);
        this.processes.push(process);
        this.advanceClock();
        this.events[this.selectedEvent].state = DONE;
        this.selectedEvent = -1;
        var message = "Created Process ".concat(pid, " at ").concat(this.clock);
        this.log.addRecord(message);
        return {
            status: "OK",
            message: message
        };
    };
    Kernel.prototype.advanceClock = function () {
        this.clock++;
        this.generate_external_event();
    };
    Kernel.prototype.runProcess = function (id) {
        this.processes[id].run();
        this.advanceClock();
    };
    Kernel.prototype.prempt = function () {
        this.processes[this.currentProcess].ready();
        this.currentProcess = -1;
        this.advanceClock();
    };
    Kernel.prototype.moveToIO = function () {
        this.processes[this.currentProcess].moveToIO();
        this.advanceClock();
    };
    Kernel.prototype.moveToReady = function (id) {
        this.processes[id].ready();
        this.advanceClock();
    };
    Kernel.prototype.terminate = function (id) {
        this.processes[id].terminate();
        this.advanceClock();
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
            var terminate_event = new Event_1.Event(id, TERMINATE, this.clock, process_to_kill);
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
