export { initialize_processes, getRandomInt, getRandomElement };
var getRandomInt = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};
var getRandomElement = function (l) {
    return l[getRandomInt(0, l.length)];
};
var create_process = function (id) {
    var ticks = getRandomInt(3, 6);
    var io = {
        "start_time": getRandomInt(1, ticks - 1),
        "ticks": getRandomInt(1, 3)
    };
    if (id % 2 == 0) {
        io = null;
    }
    return {
        "id": id,
        "ticks": ticks,
        "start_time": getRandomInt(0, 10),
        "cur_ticks": 0,
        "io": io
    };
};
var initialize_processes = function (n) {
    var processes = [];
    for (var i = 0; i < n; i++) {
        processes.push(create_process(i));
    }
    processes.sort(function (p1, p2) { return p1.start_time - p2.start_time; });
    return processes;
};
