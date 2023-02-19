"use strict";
exports.__esModule = true;
exports.Event = void 0;
var Event = /** @class */ (function () {
    function Event(id, name, time, p, type) {
        if (id === void 0) { id = -1; }
        if (name === void 0) { name = ""; }
        if (time === void 0) { time = -1; }
        if (p === void 0) { p = -1; }
        if (type === void 0) { type = "EXTERNAL"; }
        this.name = name;
        this.pid = p;
        this.time = time;
        this.id = id;
        this.type = type;
        this.state = "ACTIVE";
    }
    Event.prototype.setResponceId = function (rid) {
        this.responceId = rid;
        this.state = "DONE";
    };
    Event.prototype.getData = function () {
        return {
            name: this.name,
            pid: this.pid,
            time: this.time,
            id: this.id,
            responceId: this.responceId,
            type: this.type,
            state: this.state
        };
    };
    Event.prototype.setData = function (data) {
        var name = data.name, pid = data.pid, time = data.time, id = data.id, responceId = data.responceId, type = data.type, state = data.state;
        this.name = name;
        this.pid = pid;
        this.time = time;
        this.id = id;
        this.responceId = responceId;
        this.type = type;
        this.state = state;
    };
    return Event;
}());
exports.Event = Event;
