"use strict";
exports.__esModule = true;
exports.Event = void 0;
var Event = /** @class */ (function () {
    function Event(name, time, p) {
        if (p === void 0) { p = -1; }
        this.name = name;
        this.pid = p;
        this.time = time;
    }
    Event.prototype.set_id = function (id) {
        this.id = id;
    };
    return Event;
}());
exports.Event = Event;
