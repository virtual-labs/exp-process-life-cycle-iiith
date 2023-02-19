import { Event } from "./Event";
import { Kernel } from "./Kernel";
import { Process } from "./Process";
export { UI };
class UI {
    kernel : Kernel;

    constructor() {
        this.kernel = new Kernel();
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

    update_clock() {
        this.kernel.advanceClock();
        let clock = document.getElementById("clock");
        let clock_span = clock.getElementsByTagName("span")[0];
        clock_span.innerHTML = this.kernel.clock.toString();
    }

    add_to_pool(p: Process, pool: HTMLElement) {
        // create a div for process inside pool
        let process_div = document.createElement("div");
        process_div.classList.add("process");
        process_div.id = p.name;
        process_div.innerHTML = p.name;
        pool.appendChild(process_div);
    }

    display_processes() {
        let ready_pool = document.getElementById("ready_pool");
        let io_pool = document.getElementById("io_pool");
        let cpu = document.getElementById("cpu");
        let terminated_pool = document.getElementById("comp_pool");
        for(let i=0; i<this.kernel.processes.length; i++){
            let p = this.kernel.processes[i];
            if(p.state === "READY")
                this.add_to_pool(p, ready_pool);
            else if(p.state === "RUNNING")
                this.add_to_pool(p, cpu);
            else if(p.state === "BLOCKED")
                this.add_to_pool(p, io_pool);
            else if(p.state === "TERMINATED")
                this.add_to_pool(p, terminated_pool);
        }
    }
}

