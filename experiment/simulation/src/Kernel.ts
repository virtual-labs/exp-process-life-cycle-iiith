import { Process, IProcess } from "./Process";
import { Log } from "./Log";
import { Event, IEvent } from "./Event";
import { getRandomInt, getRandomElement } from "./helper_functions";
import * as config from "./config"

export interface IKernel {
    processes: IProcess[];
    currentProcess: number;
    processCreations : number;
    events: IEvent [];
    log : string [];
    clock: number;
    selectedEvent: number;
}

export interface IResponce {
    status: string; // "SUCCESS" or config.ERROR
    message: string;
}

export class Kernel  {
    processes: Process[];
    currentProcess: number;
    processCreations : number;
    events: Event [];
    log : Log;
    clock: number;
    selectedEvent: number;
    selectedProcess: number;

    constructor() {
        this.reset();
    }

    reset() {
        this.processes = [];
        this.currentProcess = -1;
        this.processCreations = 0;
        this.events = [];
        this.log = new Log();
        this.clock = 0;
        this.selectedEvent = -1;
        this.selectedProcess = -1;
        // this.generate_event();
    }

    selectEvent(id: number) {
        this.selectedEvent = id;
    }

    deselectEvent() {
        this.selectedEvent = -1;
    }

    moveProcess(pid: number, bin: string): IResponce {
        if(bin === config.COMPLETED){
            return this.terminate(pid); // checked
        }
        else if(bin === config.IO){
            return this.moveToIO(pid);  // checked
        }
        else if(bin === config.READY){
            // if(pid === this.currentProcess){
            //     this.prempt();
            // } else {
                return this.moveToReady(pid); // checked
                // }
            // }
        }
        else if(bin === config.CPU){
            return this.runProcess(pid);
        }

        else
            return {
                status: config.ERROR,
                message: "The bin you have chosen is invalid."
            }

    }

    generate_event() {
        this.generate_external_event();
        this.generate_internal_event();
    }

    createProcess(): IResponce {
        if(this.selectedEvent === -1){
            return {
                status: config.ERROR,
                message: "You have not selected any event."
            }
        }
        if(this.events[this.selectedEvent].name !== config.REQUESTPROC){
            return {
                status: config.ERROR,
                message: "You have not selected process creation event."
            }
        }
        // creating new process
        const pid = this.processes.length;
        const process = new Process(pid);
        this.processes.push(process);

        this.events[this.selectedEvent].setResponceId(this.log.records.length);
        this.selectedEvent = -1;
        const message = `Created Process ${pid} at ${this.clock}`;
        this.log.addRecord(message);
        return {
            status : config.OK,
            message
        }
    }

    advanceClock(isUser: Boolean = true): IResponce {
        // if(this.selectedEvent !== -1){
        //     return {
        //         status: config.ERROR,
        //         message: "You have already selected an event. Process the selected event First."
        //     }
        // }
        // this.clock++;
        // console.log("Hello World");
        this.clock = this.clock + 1;
        this.generate_event();
        const message = `Advanced clock at ${this.clock}`;
        if(isUser === true) {
            this.log.addRecord(message);
        }
        return {
            status: config.OK,
            message
        }
    }

    runProcess(id: number): IResponce {
        if (this.processes[id].state === config.RUNNING) {
            return {
                status: config.OK,
                message: `The process ${id} is already running.`
            }
        }
        if(this.selectedEvent !== -1){
            return {
                status: config.ERROR,
                message: "You have already selected a event. Process the selected event first."
            }
        }
        if(this.processes[id].state !== config.READY){
            return {
                status: config.ERROR,
                message: `The Process ${id} is not in the ready pool. So it can't be moved to CPU.`
            }
        }
        if(this.currentProcess !== -1){
            return {
                status: config.ERROR,
                message: `The CPU is not idle.`
            }
        }

        this.processes[id].run();
        this.currentProcess = id;
        
        const message = `Process ${id} is moved from ready queue to the CPU.`;
        this.log.addRecord(message);
        return {
            status: config.OK,
            message
        }
    }

    prempt() {
        if(this.selectedEvent === -1){
            return {
                status: config.ERROR,
                message: "You have not selected any event."
            }
        }
        if(this.events[this.selectedEvent].name !== config.PREMPT){
            return {
                status: config.ERROR,
                message: "You have not selected Prempt event."
            }
        }
        this.processes[this.currentProcess].ready();

        this.events[this.selectedEvent].setResponceId(this.log.records.length);
        this.selectedEvent = -1;

        const message = `Moved Process ${this.currentProcess} from CPU to Ready Pool ${this.clock}.`;
        this.log.addRecord(message);
        this.currentProcess = -1;
        return {
            status : config.OK,
            message
        }
    }

    terminate(pid: number): IResponce {
        if(this.selectedEvent === -1){
            return {
                status: config.ERROR,
                message: "You have not selected any event."
            };
        }
        if(this.events[this.selectedEvent].name !== config.TERMINATE){
            return {
                status: config.ERROR,
                message: "You have not selected process termination event."
            };
        }
        if(this.events[this.selectedEvent].pid !== pid){
            return {
                status: config.ERROR,
                message: "The event process and selected process are not equal."
            };
        }
        if(this.processes[pid].state === config.TERMINATED){
            return {
                status: config.OK,
                message: `The Process ${pid} is already terminated.`
            }
        }

        this.processes[pid].terminate();

        this.events[this.selectedEvent].setResponceId(this.log.records.length);

        for (let index = 0; index < this.events.length; index++) {
            if(this.events[index].pid === pid && this.events[index].state === config.ACTIVE) {
                this.events[index].killed(this.log.records.length);
            }
        }

        this.selectedEvent = -1;

        if(pid === this.currentProcess) {
            this.currentProcess = -1;
        }
        const message = `Terminated Process ${pid} at ${this.clock}.`;
        this.log.addRecord(message);
        return {
            status : config.OK,
            message
        }
    }

    moveToIO(pid: number) {
        if(this.selectedEvent === -1){
            return {
                status: config.ERROR,
                message: "You have not selected any event."
            }
        }
        if(this.events[this.selectedEvent].name !== config.IONEEDED){
            return {
                status: config.ERROR,
                message: "You have not selected ioNeeded event."
            }
        }
        if(pid !== this.currentProcess){
            return {
                status: config.ERROR,
                message: "The process you selected is not in the CPU."
            }
        }
        if(this.events[this.selectedEvent].pid !== this.currentProcess){
            return {
                status: config.ERROR,
                message: "The event process and process in cpu are not equal."
            }
        }

        this.processes[this.currentProcess].moveToIO();

        this.events[this.selectedEvent].setResponceId(this.log.records.length);
        this.selectedEvent = -1;

        this.currentProcess = -1;
        const message = `Moved Process ${pid} to IO Pool at ${this.clock}.`;
        this.log.addRecord(message);
        return {
            status : config.OK,
            message
        }
    }

    moveToReady(pid: number) {
        if(this.selectedEvent === -1){
            return {
                status: config.ERROR,
                message: "You have not selected any event."
            }
        }
        if(this.events[this.selectedEvent].name !== config.IODONE){
            return {
                status: config.ERROR,
                message: "You have not selected the ioDone event."
            }
        }
        if(this.events[this.selectedEvent].pid !== pid){
            return {
                status: config.ERROR,
                message: "The event process and selected process are not equal."
            }
        }
        if(this.processes[pid].state !== config.BLOCKED){
            return {
                status: config.ERROR,
                message: `The Process ${pid} is not in IO POOL.`
            }
        }

        this.processes[pid].ready();

        this.events[this.selectedEvent].setResponceId(this.log.records.length);
        this.selectedEvent = -1;

        const message = `Moved Process ${pid} from IO Pool to Ready Pool ${this.clock}.`;
        this.log.addRecord(message);
        return {
            status : config.OK,
            message
        }
    }

    get_processes() {
        return this.processes;
    }

    getData(): IKernel {
        let processes: IProcess[] = [];
        for (let index = 0; index < this.processes.length; index++) {
            const element = this.processes[index].getData();
            processes.push(element);
        }

        let events = [];
        for (let index = 0; index < this.events.length; index++) {
            const element = this.events[index].getData();
            events.push(element);
        }

        return {
            processes, currentProcess: this.currentProcess, 
            processCreations: this.processCreations, clock: this.clock, events,
            log: this.log.records, selectedEvent: this.selectedEvent};
    }
    setData(data: IKernel) {
        const {processes, currentProcess, processCreations, clock, events, log} = data;

        this.processes = [];
        for (let index = 0; index < processes.length; index++) {
            const element = processes[index];
            let p = new Process();
            p.setData(element);
            this.processes.push(p);
        }

        this.events = []
        for (let index = 0; index < events.length; index++) {
            const element = events[index];
            let e = new Event();
            e.setData(element);
            this.events.push(e);
        }
        this.log.records = log;
        this.currentProcess = currentProcess;
        this.processCreations = processCreations;
        this.clock = clock;
    }

    get_terminatable_procs() {
        let active_procs: number[] = [];
        for (let index = 0; index < this.processes.length; index++) {
            const element = this.processes[index];
            if(element.state !== config.TERMINATED){
                let flag = true;
                for(let j = 0; j < this.events.length; j++){
                    // console.log("came to term");
                    if(this.events[j].type == config.EXTERNAL &&this.events[j].pid === index){
                        flag = false;
                        break;
                    }
                }
                if(flag === true)
                    active_procs.push(index);
            }
        }
        return active_procs;
    }

    generate_external_event() {
        let possible_events: Event[] = [];
        let id;
        // Process Creation Event
        if (this.processCreations < config.MAXPROCESSES) {
            // console.log("Hello Eswar");
            // console.log(this.processes.length, this.processCreations);
            id = this.events.length;
            const new_process_event = new Event(id, config.REQUESTPROC, this.clock, -1, config.EXTERNAL);
            possible_events.push(new_process_event);
        }

        // Kill by User (Terminate)
        if(this.clock > 50){
            let active_procs = this.get_terminatable_procs();
            if(active_procs.length > 0){
                // console.log(active_procs);
                const process_to_kill = getRandomElement(active_procs);
                id = this.events.length;
                const terminate_event = new Event(id, config.TERMINATE, this.clock, process_to_kill, config.EXTERNAL);
                possible_events.push(terminate_event);
            }
        }

        // Genearating Premption Event
        if(this.currentProcess !== -1 && false){
            let flag = true;
            for (let index = 0; index < this.events.length; index++) {
                const element = this.events[index];
                if(element.pid !== this.currentProcess){
                    continue;
                }
                if(element.state !== config.ACTIVE){
                    continue;
                }
                if(element.name === config.IONEEDED){
                    flag = false;
                    break;
                }
            }
            if(flag){
                id = this.events.length;
                const prempt_event = new Event(id, config.PREMPT, this.clock, this.currentProcess, config.EXTERNAL);
                possible_events.push(prempt_event);
            }
        }

        if(possible_events.length > 0){
            const next_event = getRandomElement(possible_events);
            if(next_event.name == config.REQUESTPROC) {
                this.processCreations += 1;
            }
            this.events.push(next_event);
        }



    }

    generate_internal_event() {
        let possible_events: Event[] = [];

        let id;

        // IO Need
        if(this.currentProcess !== -1){
            let flag = true;
            for (let index = 0; index < this.events.length; index++) {
                const element = this.events[index];
                if(element.pid !== this.currentProcess){
                    continue;
                }
                if(element.state !== config.ACTIVE){
                    continue;
                }
                if(element.name === config.PREMPT || element.name === config.IONEEDED){
                    flag = false;
                    break;
                }
            }

            if(flag === true){
                id = this.events.length;
                const ioneed_event = new Event(id, config.IONEEDED, this.clock, this.currentProcess, config.INTERNAL);
                possible_events.push(ioneed_event);
            }
        }

        // IO Done Event
        let io_processes: number[] = [];
        for (let index = 0; index < this.processes.length; index++) {
            const element = this.processes[index];
            if(element.state !== config.BLOCKED){
                continue;
            }
            let flag = true;
            for(let j = 0; j < this.events.length; j++){
                const evt = this.events[j];
                if(evt.pid !== index){
                    continue;
                }
                if(evt.state !== config.ACTIVE){
                    continue;
                }
                if(evt.name === config.IODONE){
                    flag = false;
                    break;
                }
            }

            if(flag === true){
                io_processes.push(index);
            }
        }
        if(io_processes.length > 0){
            const process_to_ready = getRandomElement(io_processes);
            id = this.events.length;
            const idodone_event = new Event(id, config.IODONE, this.clock, process_to_ready, config.INTERNAL);
            possible_events.push(idodone_event);
        }

        if(possible_events.length > 0 ){
            const next_event = getRandomElement(possible_events);
            this.events.push(next_event);
        }
    }
}
