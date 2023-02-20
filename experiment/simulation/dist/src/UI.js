var UI = /** @class */ (function () {
    function UI() {
    }
    // update_events() {
    //     let event_queue = document.getElementById("event_queue");
    //     event_queue.innerHTML = "";
    //     for (let index = 0; index < this.kernel.events.length; index++) {
    //         const element = this.kernel.events[index];
    //         let event_element = document.createElement("section");
    //         event_element.classList.add("event");
    //         let event_name = document.createElement("p");
    //     }
    // }
    UI.prototype.update_clock = function () {
        this.kernel.advanceClock();
        var clock = document.getElementById("clock");
        var clock_span = clock.getElementsByTagName("span")[0];
        clock_span.innerHTML = this.kernel.clock.toString();
    };
    UI.prototype.add_to_pool = function (p, pool) {
        // create a div for process inside pool
        var process_div = document.createElement("div");
        process_div.classList.add("process");
        process_div.id = p.name;
        process_div.innerHTML = p.name;
        pool.appendChild(process_div);
    };
    UI.prototype.display_processes = function () {
        var ready_pool = document.getElementById("ready_pool");
        var io_pool = document.getElementById("io_pool");
        var cpu = document.getElementById("cpu");
        var terminated_pool = document.getElementById("comp_pool");
        for (var i = 0; i < this.kernel.processes.length; i++) {
            var p = this.kernel.processes[i];
            if (p.state === "READY")
                this.add_to_pool(p, ready_pool);
            else if (p.state === "RUNNING")
                this.add_to_pool(p, cpu);
            else if (p.state === "BLOCKED")
                this.add_to_pool(p, io_pool);
            else if (p.state === "TERMINATED")
                this.add_to_pool(p, terminated_pool);
        }
    };
    return UI;
}());
export {};
