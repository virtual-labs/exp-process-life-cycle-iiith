import { Event } from "./Event";
import { Kernel } from "./Kernel";
import { Process } from "./Process";
export { UI };
class UI {
    kernel : Kernel;

    constructor() {
        this.kernel = new Kernel();
    }

    display_clock() {
        let clock = document.getElementById("clock");
        let clock_span = document.getElementsByTagName("span")[0];
        clock_span.innerHTML = this.kernel.clock.toString();
    }
    update_clock(){
        this.kernel.advanceClock();
        this.display_clock();
    }
    createProcess() {
        this.kernel.createProcess();
        this.display_processes();
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
        // clear all pools
        let processes = document.getElementsByClassName("process");
        while(processes.length > 0){
            processes[0].remove();
        }
        // add processes to pools
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

