import { Event } from "./Event";
import { Kernel } from "./Kernel";
import { Process } from "./Process";
import Driver from "driver.js"

export { UI };
class UI {
    kernel : Kernel
    timerId: NodeJS.Timer
    ready_pool: HTMLElement
    io_pool: HTMLElement
    cpu: HTMLElement
    terminated_pool: HTMLElement
    timer_paused: Boolean

    descriptions: Map<string, Driver.Step>
    imperatives: Map<string, Driver.Step>
    drivers: Map<string, Driver>

    constructor() {
        this.kernel = new Kernel();
        // this.start_timer();
        this.timer_paused = true;

        this.ready_pool = document.querySelector('#READY .queue_body');
        this.io_pool = document.querySelector('#IO .queue_body');
        this.cpu = document.querySelector('#CPU .queue_body');
        this.terminated_pool = document.querySelector('#COMPLETED .queue_body');

        this.initialize_events();
        this.initialize_accordion();

        this.descriptions = this.descriptions_map();
        this.imperatives = this.imperatives_map();
        // this.main_tour();
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

    toggle_timer () {
        if (this.timer_paused === true) {
            this.start_timer();
            this.timer_paused = false;
            console.log("Timer Started.");
        }
        else {
            this.end_timer();
            this.timer_paused = true;
            console.log("Timer Paused.")
        }
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
        process_div.draggable = true;
        process_div.id = "Process"+p.pid.toString();
        process_div.innerHTML = p.name;
        // add event listeners

        let process_dragstart_handler = (event) => {
            // console.log(event.target.id);

            if (this.kernel.selectedEvent === -1)
                this.toggle_timer();
            console.log("hello" + this.kernel.selectedEvent);
            event.dataTransfer.dropEffect = "move";
            event.dataTransfer.setData("text/plain", event.target.id);
        }

        let process_dragend_handler = (event: DragEvent) => {
            // this.start_timer();
            this.toggle_timer();
        }

        process_div.addEventListener("dragstart", process_dragstart_handler);
        process_div.addEventListener("dragend", process_dragend_handler);

        // process_div.addEventListener("click", () => {
        //     this.end_timer();
        //     this.kernel.selectedProcess = p.pid;
        //     var modal = document.getElementById("process_popup");
        //     let span: HTMLElement = document.getElementsByClassName("close")[0] as HTMLElement;
        //     modal.style.display = "block";
        // });
        pool.appendChild(process_div);
    }
    add_to_events_queue(e: Event) {
        if(e.state === "DONE" || e.state === "KILLED")
            return;
        let events = document.getElementById("all_events");
        let event_div = document.createElement("div");
        event_div.classList.add("event");
        event_div.id = "Event"+e.id.toString();
        if(e.name === "IONEEDED" || e.name === "IODONE" || e.name === "Terminate"){ //XXX: Invariant: "Terminate" === TERMINATE in Kernel.ts
            event_div.innerHTML = e.name + " " + e.pid.toString();
        }
        else {
            event_div.innerHTML = e.name;
        }
        event_div.addEventListener("click", () => {
            if(this.kernel.selectedEvent === e.id){
                this.kernel.selectEvent(-1);
                // this.start_timer();
                this.toggle_timer();
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
        let clock_span = document.getElementById("clock_val");
        clock_span.innerHTML = this.kernel.clock.toString();
    }
    display_processes() {
        // clear all pools
        let processes = document.getElementsByClassName("process");
        while(processes.length > 0){
            processes[0].remove();
        }

        for(let i=0; i<this.kernel.processes.length; i++){
            let p = this.kernel.processes[i];
            if(p.state === "READY")
                this.add_to_pool(p, this.ready_pool);
            else if(p.state === "RUNNING")
                this.add_to_pool(p, this.cpu);
            else if(p.state === "BLOCKED")
                this.add_to_pool(p, this.io_pool);
            else if(p.state === "TERMINATED")
                this.add_to_pool(p, this.terminated_pool);
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

    display_log() {
        let log = document.getElementById("log");
        for (let index = log.childElementCount; index < this.kernel.log.records.length; index++) {
            const element = this.kernel.log.records[index];
            let p = document.createElement("li");
            p.innerText = element;
            log.appendChild(p);
            console.log("Adding log ",element );
        }
        console.log(log.childElementCount);

    }

    display_all(){
        this.display_clock();
        this.display_processes();
        this.display_events();
        this.display_log();
        this.update_accordion();
        // this.console_display();
    }

    initialize_events() {

        let process_drop_handler = (event) => {
            event.preventDefault();
            const data = event.dataTransfer.getData("text/plain");
            console.log(data);

            let bin = event.target.parentNode.id;
            let dropped_pid = +data.split("s")[2]; // Split data = ["proce", "", "<id>"]
            let dropped_process = this.kernel.processes[dropped_pid];

            let response = this.kernel.moveProcess(dropped_pid, bin);
            if (response.status === "ERROR")
                alert("Error: " + response.message);
            this.display_all();
        }

        let process_dragover_handler = (event: DragEvent) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";

            if (this.kernel.selectedEvent === -1)
                this.end_timer();

        }

        this.ready_pool.addEventListener("dragover", process_dragover_handler);
        this.io_pool.addEventListener("dragover", process_dragover_handler);
        this.cpu.addEventListener("dragover", process_dragover_handler);
        this.terminated_pool.addEventListener("dragover", process_dragover_handler);

        this.ready_pool.addEventListener("drop", process_drop_handler);
        this.io_pool.addEventListener("drop", process_drop_handler);
        this.cpu.addEventListener("drop", process_drop_handler);
        this.terminated_pool.addEventListener("drop", process_drop_handler);


        document.getElementById("init_tour")
            .addEventListener("click", (e) => {
                setTimeout(() => {
                    this.main_tour();
                });
            });

        let start_button_handler = () => {
            this.toggle_timer();

            // let button_text = document.getElementById("start").childNodes[0].nodeValue;
            if (!this.timer_paused) {
                document.getElementById("start")
                    .childNodes[0].nodeValue = "Pause";

            }
            else {
                document.getElementById("start")
                    .childNodes[0].nodeValue = "Start";
            }

        };

        let reset_button_handler = () => {
            start_button_handler(); // XXX: Pass instance of the appropriate Event Type
            // The start_button_handler starts the timer, so keep the stop_timer logic after it.

            this.kernel.reset();
            this.timer_paused = false;
            this.toggle_timer();
            this.display_all();
        };

        // let finish_button_handler = () => {
        //     // this.kernel.reset();
        // };


        document.getElementById("create_process").addEventListener("click", () => {
            // ui.kernel.events[ui.kernel.selectedEvent].do
            this.createProcess();
            this.timer_paused = true;
            this.toggle_timer();
        });

        document.getElementById("reset")
            .addEventListener("click", reset_button_handler);

        document.getElementById("start")
            .addEventListener("click", start_button_handler);

        // document.getElementById("finish")
        //     .addEventListener("click", finish_button_handler);
    }

    initialize_accordion() {

        let observations = <HTMLElement> document.getElementById("observations_button").nextElementSibling;
        observations.style.display = "flex";
        observations.style.flexDirection = "column";
        observations.style.overflow = "scroll";
        observations.style.maxHeight = observations.scrollHeight + "px";

        let accordion = document.getElementsByClassName("accordion");

        for(let i = 0; i < accordion.length; i++) {
            accordion[i].addEventListener("click", () => {
                accordion[i].classList.toggle("active");
                let panel = <HTMLElement> accordion[i].nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.transition = "0.2s";
                    panel.style.display = "none";
                    panel.style.maxHeight = null;
                } else {
                    panel.style.display = "flex";
                    panel.style.flexDirection = "column";
                    panel.style.overflow = "scroll";
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            });
        }

    }

    update_accordion () {
        let log = <HTMLElement> document.getElementById("observations_button");
        let observations = <HTMLElement> log.nextElementSibling;

        if (log.classList.contains("active"))
            return;

        observations.style.display = "flex";
        observations.style.flexDirection = "column";
        observations.style.overflow = "scroll";
        observations.style.maxHeight = observations.scrollHeight + "px";
    }

    main_tour () {
        const driver: Driver = new Driver({
            animate: true,
            opacity: 0.8,
            padding: 5,
            showButtons: true,
            overlayClickNext: true,
        });

        let main_tour_steps: Driver.Step [] =
            [
                this.descriptions.get("events_queue"),
                this.descriptions.get("clock"),
                this.descriptions.get("CPU"),
                this.descriptions.get("READY"),
                this.descriptions.get("IO"),
                this.descriptions.get("COMPLETED"),

                this.imperatives.get("handling_events"),
                this.imperatives.get("handling_events_req_process_1"),
                this.imperatives.get("handling_events_req_process_2"),
                this.imperatives.get("handling_events_req_process_3"),

            ];

        driver.defineSteps(main_tour_steps);
        driver.start();
    }

    descriptions_map () {
        let descriptions = new Map<string, Driver.Step>();

        descriptions.set("events_queue",
                         {element: "#event_queue",
                          popover: {
                              title: "Events Queue",
                              description: "The events queue collects the events coming in from external sources (the user, interrupts etc.), or the various requests from the processes that need to be handled (such as requests for resource allocation).",
                              position: "right"
                          }});

        descriptions.set("clock",
                         {element: "#clock",
                          popover: {
                              title: "Clock",
                              description: "The clock cycles help synchronize the execution and management of processes." }});

        descriptions.set("CPU",
                         {element: "#CPU",
                          popover: {
                              title: "The CPU",
                              description: "The processes currently being executed appear in the CPU." }});

        descriptions.set("IO",
                         {element: "#IO",
                          popover: {
                              title: "The I/O Pool",
                              description: "The processes which are currently using I/O resources appear in the I/O Pool." }});

        descriptions.set("READY",
                         {element: "#READY",
                          popover: {
                              title: "The Ready Pool",
                              description: "The ready pool is where the processes wait before they are allowed to be executed." }});

        descriptions.set("COMPLETED",
                         {element: "#COMPLETED",
                          popover: {
                              title: "Terminated Processes",
                              description: "The processes which have been terminated appear here." }});

        return descriptions
    }

    imperatives_map () {
        let imperatives = new Map<string, Driver.Step>();

        imperatives.set("handling_events",
                        {element: "#all_events",
                         popover: {
                             title: "How to Handle Events.",
                             description: "Each event arriving in the events queue requires some action from your side. To begin handling an event, click to select it from the events queue. The clock will be stopped when you select any event, and will remain stopped for the duration of handling of that event, or its cancellation."
                         }});

        imperatives.set("handling_events_req_process_1",
                        {element: "#create_process",
                         popover: {
                             title: "The reqProcess Event.",
                             description: "Handling the reqProcess event requires you to trigger the command to create a new process. You can do that by cliking the create process button. Remember, a reqProcess event must be selected before issuing the create process command."
                         }});

        imperatives.set("handling_events_req_process_2",
                        {element: "#READY",
                         popover: {
                             title: "The reqProcess Event.",
                             description: "Newly created processes appear in the Ready Pool, where they wait until they are allowed to start execution in the CPU."
                         }});

        imperatives.set("handling_events_req_process_3",
                        {element: "#event_queue",
                         popover: {
                             title: "The reqProcess Event.",
                             description: "Once the current event has been handled, the clock starts again, and you can begin handling other events.."
                         }});

        return imperatives
    }

    information_popover (element_id) {
    }
}
