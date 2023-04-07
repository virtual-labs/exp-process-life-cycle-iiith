import { Event } from "./Event";
import { IResponce, Kernel } from "./Kernel";
import { Process } from "./Process";
import * as config from "./config"
import Driver from "driver.js"
import { descriptions } from "./descriptions";
import { imperatives } from "./imperatives";
import { initialize_accordion, update_accordion } from "./accordion";
import { showDialog } from "./dialog";
import { initialize_tours } from "./tours";
import { display_pools, initialize_pools } from "./pool";
import { display_clock } from "../clock";

export { UI };
class UI {
    kernel : Kernel
    timerId: NodeJS.Timer
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

        this.timerId = null;

        this.initialize_events();
        initialize_accordion();
        initialize_tours();
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
        let process_div = p.createElement();

        let process_dragstart_handler = (event) => {
            if(this.is_ex_paused())
                return ;
            // console.log(event.target.id);

            if (this.kernel.selectedEvent === -1)
                this.end_timer();
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

    display_all(){
        localStorage.setItem('data', JSON.stringify(this.kernel.getData()));
        display_clock(this.kernel.clock);
        display_pools(this.kernel.processes, this.add_to_pool)
        this.display_events();
        this.kernel.log.createElement(this.kernel.events);
        update_accordion();
        this.display_analytics();
        if(this.kernel.selectedEvent !== -1 && 
            this.kernel.events[this.kernel.selectedEvent].name === config.REQUESTPROC)
            document.getElementById("create_process").style.visibility = "visible";
        else
            document.getElementById("create_process").style.visibility = "hidden";
    }


    initialize_events() {

        let process_drop_handler = (event) => {
            if(this.is_ex_paused())
                return ;
            event.preventDefault();
            const data = event.dataTransfer.getData("text/plain");

            let bin = event.target.parentNode.id;
            let dropped_pid = +data.split("s")[2];
            let dropped_process = this.kernel.processes[dropped_pid];

            let response = this.kernel.moveProcess(dropped_pid, bin);
            if (response.status === config.ERROR){
                showDialog(response.message);
            }
            this.display_all();
        }
        let process_dragover_handler = (event: DragEvent) => {
            if(this.is_ex_paused())
                return ;
            event.preventDefault();
        }

        initialize_pools(process_dragover_handler, process_drop_handler);

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
                showDialog(res.message);
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
                driver.highlight(descriptions.get(element_id));
            })
            ele.addEventListener("mouseout", (event) => {
                const activeElement = driver.getHighlightedElement();
                console.log("released");
                driver.reset();
            })
        })
    }

    information_popover (element_id) {
        const driver = new Driver();
        driver.highlight(descriptions.get(element_id));
    }
}