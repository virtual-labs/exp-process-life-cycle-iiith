"use strict";
exports.__esModule = true;
exports.Log = void 0;
var Log = /** @class */ (function () {
    function Log() {
        this.records = [];
    }
    Log.prototype.addRecord = function (record) {
        this.records.push(record);
    };
    return Log;
}());
exports.Log = Log;
