var Process = /** @class */ (function () {
    function Process(pid) {
        this.pid = pid;
        this.name = "P" + String(pid);
        this.state = "READY";
        this.history = ["NEW"];
        this.registers = { "r1": 1, "r2": 2, "r3": 3, "r4": 4 };
        this.ioRequests = { start_time: 3, ticks: 2 };
        this.ticks = 6;
        this.programCounter = 0;
    }
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
export { Process };
