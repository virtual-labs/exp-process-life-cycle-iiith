import { Event } from "./Event";
import { Kernel } from "./Kernel";
import { Process } from "./Process";
export { UI };
class UI {
    kernel : Kernel;
    timerId: NodeJS.Timer
    constructor() {
        this.kernel = new Kernel();
        this.start_timer();
    }
    start_timer() {
        this.timerId = setInterval(() => {
            this.kernel.advanceClock(false);
            this.display_all();
        }, 2000);
    }

    end_timer() {
        clearInterval(this.timerId);
    }

    // private functions
    console_display() {
        console.log(this.kernel.getData());
        return ;
        // console.log("Proceeses");
        // for(let i = 0; i < this.kernel.processes.length; i++) {
        //     console.log(this.kernel.processes[i]);
        // }
        // // console.log("")
        // for(let i = 0; i < this.kernel.events.length; i++) {
        //     console.log(this.kernel.events[i]);
        // }
        // console.log(this.kernel)
    }
    add_to_pool(p: Process, pool: HTMLElement) {
        // create a div for process inside pool
        let process_div = document.createElement("div");
        process_div.classList.add("process");
        process_div.id = "Process"+p.pid.toString();
        process_div.innerHTML = p.name;
        // add event listeners
        process_div.addEventListener("click", () => {
            this.end_timer();
            this.kernel.selectedProcess = p.pid;
            var modal = document.getElementById("process_popup");
            let span: HTMLElement = document.getElementsByClassName("close")[0] as HTMLElement;
            modal.style.display = "block";
        });
        pool.appendChild(process_div);
    }
    add_to_events_queue(e: Event) {
        if(e.state === "DONE" || e.state === "KILLED")
            return;
        let events = document.getElementById("all_events");
        let event_div = document.createElement("div");
        event_div.classList.add("event");
        event_div.id = "Event"+e.id.toString();
        event_div.innerHTML = e.name + " " + e.pid.toString();
        event_div.addEventListener("click", () => {
            if(this.kernel.selectedEvent === e.id){
                this.kernel.selectEvent(-1);
                this.start_timer();
            }
            else {
                this.end_timer();
                this.kernel.selectEvent(e.id);
            }
                
            // if(e.name == "REQUESTPROC"){
            //     this.end_timer();
            //     var modal = document.getElementById("create_process_popup");
            //     let span: HTMLElement = document.getElementsByClassName("close")[1] as HTMLElement;
            //     modal.style.display = "block";
            //     span.onclick = function() {
            //         modal.style.display = "none";
            //     }
            //     window.onclick = function(event) {
            //         if (event.target == modal) {
            //             modal.style.display = "none";
            //         }
            //     }
            //     this.kernel.selectEvent(-1);
            // }
            this.display_all();
        });
        events.appendChild(event_div);
    }

    ///////////////////////////////

    update_clock(){
        return(this.kernel.advanceClock());
    }
    createProcess() {
        // this.kernel.selectEvent(0);
        this.kernel.createProcess();
        this.display_all();
    }
    display_clock() {
        let clock = document.getElementById("clock");
        let clock_span = document.getElementsByTagName("span")[0];
        clock_span.innerHTML = this.kernel.clock.toString();
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
    display_events() {
        // remove all events
        let events_list = document.getElementsByClassName("event");
        while(events_list.length > 0){
            events_list[0].remove();
        }
        // add events
        for(let i=0; i<this.kernel.events.length; i++){
            let e = this.kernel.events[i];
            this.add_to_events_queue(e);
        }
        if(this.kernel.selectedEvent !== -1){
            let e = document.getElementById("Event"+this.kernel.selectedEvent.toString());
            e.classList.add("selected");
            // e.remove();
        }
    }

    display_all(){
        this.display_clock();
        this.display_processes();
        this.display_events();
        this.console_display();
    }
}

