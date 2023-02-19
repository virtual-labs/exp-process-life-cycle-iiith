"use strict";
exports.__esModule = true;
exports.Process = void 0;
var Process = /** @class */ (function () {
    function Process(pid) {
        if (pid === void 0) { pid = 0; }
        this.pid = pid;
        this.name = "P" + String(pid);
        this.state = "READY";
        this.history = ["NEW"];
    }
    Process.prototype.getData = function () {
        return {
            "pid": this.pid,
            "name": this.name,
            "state": this.state,
            "history": this.history
        };
    };
    Process.prototype.setData = function (data) {
        var pid = data.pid, name = data.name, state = data.state, history = data.history;
        this.pid = pid;
        this.name = name;
        this.state = state;
        this.history = history;
    };
    Process.prototype.run = function () {
        this.state = "RUNNING";
        this.history.push(this.state);
    };
    Process.prototype.ready = function () {
        this.state = "READY";
        this.history.push(this.state);
    };
    Process.prototype.moveToIO = function () {
        this.state = "BLOCKED";
        this.history.push(this.state);
    };
    Process.prototype.terminate = function () {
        this.state = "TERMINATED";
        this.history.push(this.state);
    };
    return Process;
}());
exports.Process = Process;
