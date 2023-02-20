var Log = /** @class */ (function () {
    function Log() {
        this.records = [];
    }
    Log.prototype.addRecord = function (record) {
        this.records.push(record);
    };
    return Log;
}());
export { Log };
