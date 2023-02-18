"use strict";
exports.__esModule = true;
exports.Kernel = void 0;
var Process_1 = require("./Process");
var Log_1 = require("./Log");
var Event_1 = require("./Event");
var helper_functions_1 = require("./helper_functions");
var MAXPROCESSES = 5;
var Kernel = /** @class */ (function () {
    function Kernel() {
        this.processes = [];
        this.currentProcess = -1;
        this.processCreations = 0;
        this.external_events = [];
        this.internal_events = [];
        this.log = new Log_1.Log();
        this.clock = 0;
    }
    Kernel.prototype.createProcess = function () {
        var pid = this.processes.length;
        var process = new Process_1.Process(pid);
        this.processes.push(process);
        this.advanceClock();
    };
    Kernel.prototype.advanceClock = function () {
        this.clock++;
        this.generate_external_event(this.clock);
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
    Kernel.prototype.get_data = function () {
        return "Hello Eswar";
    };
    Kernel.prototype.get_terminatable_procs = function () {
        var active_procs = [];
        for (var index = 0; index < this.processes.length; index++) {
            var element = this.processes[index];
            if (element.state !== "TERMINATED") {
                var flag = true;
                for (var j = 0; j < this.external_events.length; j++) {
                    console.log("came to term");
                    if (this.external_events[j].pid === index) {
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
    Kernel.prototype.count_process_creation_events = function () {
        var count = 0;
        for (var index = 0; index < this.external_events.length; index++) {
            var element = this.external_events[index];
            if (element.name == "requestProc")
                count++;
        }
        return count;
    };
    Kernel.prototype.generate_external_event = function (clock) {
        var possible_events = [];
        // Process Creation Event
        if (this.processes.length + this.count_process_creation_events() < MAXPROCESSES) {
            var new_process_event = new Event_1.Event("requestProc", clock);
            possible_events.push(new_process_event);
        }
        // Kill by User (Terminate)
        var active_procs = this.get_terminatable_procs();
        var process_to_kill = (0, helper_functions_1.getRandomElement)(active_procs);
        var terminate_event = new Event_1.Event("terminate", clock, process_to_kill);
        possible_events.push(terminate_event);
        var next_event = (0, helper_functions_1.getRandomElement)(possible_events);
        this.external_events.push(next_event);
    };
    return Kernel;
}());
exports.Kernel = Kernel;
