import { Event } from "./Event";
import { IResponce, Kernel } from "./Kernel";
import { Process } from "./Process";
import * as config from "./config"
import Driver from "driver.js"
import { descriptions } from "./descriptions";
import { imperatives } from "./imperatives"

export { UI };
class UI {
    kernel : Kernel
    timerId: NodeJS.Timer
    ready_pool: HTMLElement
    io_pool: HTMLElement
    cpu: HTMLElement
    terminated_pool: HTMLElement
    timer_paused: Boolean

    imperatives: Map<string, Driver.Step>
    drivers: Map<string, Driver>

    constructor() {
        const data = localStorage.getItem('data');
        this.kernel = new Kernel();
        if(data !== null)
            this.kernel.setData(JSON.parse(data));
        this.timer_paused = true;

        if(this.kernel.clock > 0) 
            document.getElementById('start').childNodes[0].textContent = "Resume";

        this.ready_pool = document.querySelector('#READY .queue_body');
        this.io_pool = document.querySelector('#IO .queue_body');
        this.cpu = document.querySelector('#CPU .queue_body');
        this.terminated_pool = document.querySelector('#COMPLETED .queue_body');

        this.timerId = null;

        this.initialize_events();
        this.initialize_accordion();
    }

    is_ex_paused(){
        return document.getElementById("start").childNodes[0].nodeValue !== "Pause";
    }

    start_timer() {
        if(this.timerId === null && this.kernel.selectedEvent === -1){
            this.timerId = setInterval(() => {
                this.kernel.advanceClock(false);
                this.display_all();
            }, 2000);
        }
    }

    end_timer() {
        if(this.timerId !== null){
            clearInterval(this.timerId);
            this.timerId = null;
        }
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
            if(this.is_ex_paused())
                return ;
            // console.log(event.target.id);

            if (this.kernel.selectedEvent === -1)
                this.end_timer();
            console.log("hello" + this.kernel.selectedEvent);
            event.dataTransfer.dropEffect = "move";
            event.dataTransfer.setData("text/plain", event.target.id);
        }

        let process_dragend_handler = (event: DragEvent) => {
            if(this.is_ex_paused())
                return ;
            this.start_timer();
        }

        process_div.addEventListener("dragstart", process_dragstart_handler);
        process_div.addEventListener("dragend", process_dragend_handler);
        pool.appendChild(process_div);
    }
    add_to_events_queue(e: Event) {
        if(e.state === config.DONE || e.state === config.KILLED)
            return;
        let events = document.getElementById("all_events");
        let event_div = e.createElement();
        event_div.id = "Event"+e.id.toString();
        if(this.kernel.selectedEvent === e.id){
            event_div.classList.add("selected");
        }
        event_div.addEventListener("click", () => {
            if(this.is_ex_paused())
                return ;
            if(this.kernel.selectedEvent === e.id){
                this.kernel.selectEvent(-1);
                this.start_timer();
            }
            else {
                this.end_timer();
                this.kernel.selectEvent(e.id);
            }
            this.display_all();
        });
        events.appendChild(event_div);
    }

    update_clock(){
        return(this.kernel.advanceClock());
    }
    createProcess() {
        const res = this.kernel.createProcess();
        this.display_all();
        return res;
    }
    display_clock() {
        let clock = document.getElementById("clock");
        let clock_span = document.getElementById("clock_val");
        clock_span.innerHTML = this.kernel.clock.toString();
        if(this.kernel.clock !== 0 && this.is_ex_paused())
            clock_span.innerHTML += " (Paused)";
    }
    display_processes() {
        // clear all pools
        let processes = document.getElementsByClassName("process");
        while(processes.length > 0){
            processes[0].remove();
        }

        for(let i=0; i<this.kernel.processes.length; i++){
            let p = this.kernel.processes[i];
            if(p.state === config.READY)
                this.add_to_pool(p, this.ready_pool);
            else if(p.state === config.RUNNING)
                this.add_to_pool(p, this.cpu);
            else if(p.state === config.BLOCKED)
                this.add_to_pool(p, this.io_pool);
            else if(p.state === config.TERMINATED)
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

    display_analytics() {
        let analytics = document.getElementById("analytics");
        analytics.innerHTML = "";
        let wm = document.createElement('li');
        wm.innerText = `Wrong Moves: ${this.kernel.wrongMoves}`;
        let aet = document.createElement('li');
        aet.innerText = `Average Event Wait time: ${this.kernel.getAverageWaitTime()}`;
        let cpuIdle = document.createElement('li');
        cpuIdle.innerText = `CPU Idle time: ${this.kernel.cpuIdle}`;
        analytics.appendChild(wm);
        analytics.appendChild(aet);
        analytics.appendChild(cpuIdle);
    }

    display_log() {
        let log = document.getElementById("log");
        let html = `<thead><tr><th>t<sub>e</sub></th><th>Event</th>
        <th>t<sub>r</sub></th><th>Action</th></tr></thead><tbody>`;
        for (let index = 0; index < this.kernel.log.records.length; index++) {
            const element = this.kernel.log.records[index];
            let action = "";
            if(element.event < 0) {
                html += `<tr><td>NA</td><td>NA</td>
                <td>${element.responce_time}</td><td>moveProcess(${-element.event - 1}, CPU)</td></tr>`;
            }
            else {
                const e = this.kernel.events[element.event];
                if(e.name === config.REQUESTPROC)
                    action = `createProcess(${e.pid})`;
                else if(e.name === config.IONEEDED)
                    action = `moveProcess(${e.pid}, ${config.IO})`;
                else if(e.name === config.IODONE)
                    action = `moveProcess(${e.pid}, ${config.READY})`;
                else if(e.name === config.TERMINATE)
                    action = `moveProcess(${e.pid}, ${config.COMPLETED})`
                html += `<tr><td>${e.time}</td><td>${e.name}(${e.pid})</td>
                <td>${element.responce_time}</td><td>${action}</td></tr>`;
            }
        }
        log.innerHTML = html + `</tbody>`;
    }

    display_all(){
        localStorage.setItem('data', JSON.stringify(this.kernel.getData()));
        this.display_clock();
        this.display_processes();
        this.display_events();
        this.display_log();
        this.update_accordion();
        this.display_analytics();
        if(this.kernel.selectedEvent !== -1 && 
            this.kernel.events[this.kernel.selectedEvent].name === config.REQUESTPROC)
            document.getElementById("create_process").style.visibility = "visible";
        else
            document.getElementById("create_process").style.visibility = "hidden";
    }

    showDialog(message: string) {
        const dialogBox = document.createElement("p");
        dialogBox.textContent = message;
        const inst = document.getElementById("instruction");
        // inst.innerHTML = "";
        inst.appendChild(dialogBox);
        setTimeout(() => {
          inst.removeChild(dialogBox);
        }, 10000);
    }

    initialize_events() {

        let process_drop_handler = (event) => {
            if(this.is_ex_paused())
                return ;
            event.preventDefault();
            const data = event.dataTransfer.getData("text/plain");
            console.log(data);

            console.log("Process Drop Handler");

            let bin = event.target.parentNode.id;
            let dropped_pid = +data.split("s")[2]; // Split data = ["proce", "", "<id>"]
            let dropped_process = this.kernel.processes[dropped_pid];

            let response = this.kernel.moveProcess(dropped_pid, bin);
            if (response.status === config.ERROR){
                // alert("Error: " + response.message);
                this.showDialog(response.message);
            }
            this.display_all();
        }
        let process_dragover_handler = (event: DragEvent) => {
            if(this.is_ex_paused())
                return ;
            event.preventDefault();
            console.log("Drag Over");

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
        let pause_driver = new Driver({
            animate: true,
            allowClose: false,
            overlayClickNext: false,
            padding: 0,
        });

        let start_button_handler = (event) => {
            const val = event.target.childNodes[0].nodeValue;
            if(val === "Start" || val === "Resume"){
                event.target.childNodes[0].nodeValue = "Pause";
                this.display_all();
                this.start_timer();
                // pause_driver.reset();
            }
            else {
                event.target.childNodes[0].nodeValue = "Resume";
                this.display_all();
                this.end_timer();
                //pause_driver.highlight("#start");
            }
        }

        let reset_button_handler = () => {
            this.kernel.reset();
            this.timer_paused = false;
            document.getElementById("start").childNodes[0].nodeValue = "Start";
            this.end_timer();
            this.display_all();
        };


        let finish_button_handler = () => {
            const { jsPDF } = require("jspdf"); // will automatically load the node version
            const confirmed: boolean = window.confirm("Do you want to download your analytics ?");
            if (confirmed) {
            // User clicked OK
                const doc = new jsPDF();
                doc.setFontSize(25);
                doc.text("Process Life Cycle Student Report", 35, 20);
                doc.setFontSize(15);
                doc.text(`1. Wrong Moves: ${this.kernel.wrongMoves}`, 20, 50);
                doc.text(`2. Average Event Wait time: ${this.kernel.getAverageWaitTime()}`, 20, 60);
                doc.text(`3. CPU Idle time: ${this.kernel.cpuIdle}`, 20, 70);
                doc.setFontSize(10);
                doc.text(`Timestamp: ${Date()}`, 40, 90);
                doc.save("a4.pdf");
            } else {
            // User clicked Cancel
            }
            reset_button_handler();
        };


        document.getElementById("create_process").addEventListener("click", () => {
            if(this.is_ex_paused())
                return ;
            const res: IResponce = this.createProcess();
            if(res.status === "OK"){
                this.timer_paused = true;
                this.display_all();
                this.start_timer();
            }
            else {
                this.showDialog(res.message);
            }
        });

        document.getElementById("reset")
            .addEventListener("click", reset_button_handler);

        document.getElementById("start")
            .addEventListener("click", start_button_handler);

        document.getElementById("finish")
            .addEventListener("click", finish_button_handler);
        
        document.querySelectorAll(".info").forEach(ele => {
            const driver = new Driver();
            ele.addEventListener("mouseover", (event) => {
                const {target} = event;
                const parent_node = (target as HTMLElement).parentNode;
                const element_id = (parent_node as HTMLElement).id;
                console.log(element_id);
                driver.highlight(descriptions.get(element_id));
            })
            ele.addEventListener("mouseout", (event) => {
                const activeElement = driver.getHighlightedElement();
                console.log("released");
                driver.reset();
            })
        })
    }

    initialize_accordion() {

        let log = <HTMLElement> document.getElementById("observations_button");
        let observations = <HTMLElement> log.nextElementSibling;
        log.classList.toggle("active");
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
                descriptions.get("event_queue"),
                descriptions.get("clock"),
                descriptions.get("CPU"),
                descriptions.get("READY"),
                descriptions.get("IO"),
                descriptions.get("COMPLETED"),

                // imperatives.get("handling_events"),
                // imperatives.get("handling_events_req_process_1"),
                // imperatives.get("handling_events_req_procesdriver.highlight(descriptions.get(element_id));s_2"),
                // imperatives.get("handling_events_req_process_3"),

            ];

        driver.defineSteps(main_tour_steps);
        driver.start();
    }

    information_popover (element_id) {
        const driver = new Driver();
        driver.highlight(descriptions.get(element_id));
    }
}