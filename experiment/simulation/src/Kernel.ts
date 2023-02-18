import { Process } from "./Process";
import { Log } from "./Log";
import { Event } from "./Event";
import { getRandomInt, getRandomElement } from "./helper_functions";

const MAXPROCESSES = 5;

export class Kernel {
    processes: Process[];
    currentProcess: number;
    processCreations : number;
    external_events: Event [];
    internal_events: Event [];
    log : Log;
    clock: number;

    constructor() {
      this.processes = [];
      this.currentProcess = -1;
      this.processCreations = 0;
      this.external_events = [];
      this.internal_events = [];
      this.log = new Log();
      this.clock = 0
    }
  
    createProcess() {
      const pid = this.processes.length;
      const process = new Process(pid);
      this.processes.push(process);
      this.advanceClock();
    }

    advanceClock() {
        this.clock++;
        this.generate_external_event(this.clock);
    }

    runProcess(id: number) {
        this.processes[id].run();
        this.advanceClock();
    }

    prempt() {
        this.processes[this.currentProcess].ready();
        this.currentProcess = -1;
        this.advanceClock();
    }

    moveToIO() {
        this.processes[this.currentProcess].moveToIO();
        this.advanceClock();
    }

    moveToReady(id: number) {
        this.processes[id].ready();
        this.advanceClock();
    }

    terminate(id: number) {
        this.processes[id].terminate();
        this.advanceClock();
    }

    get_processes() {
        return this.processes;
    }

    get_data() {
        return "Hello Eswar";
    }

    get_terminatable_procs() {
        let active_procs: number[] = [];
        for (let index = 0; index < this.processes.length; index++) {
            const element = this.processes[index];
            if(element.state !== "TERMINATED"){
                let flag = true;
                for(let j = 0; j < this.external_events.length; j++){
                    console.log("came to term");
                    if(this.external_events[j].pid === index){
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

    count_process_creation_events() {
        let count: number = 0;
        for (let index = 0; index < this.external_events.length; index++) {
            const element = this.external_events[index];
            if(element.name == "requestProc") count++;
        }
        return count;
    }

    generate_external_event(clock: number) {
        let possible_events: Event[] = [];

        // Process Creation Event
        if (this.processes.length + this.count_process_creation_events() < MAXPROCESSES) {
            const new_process_event = new Event("requestProc", clock);
            possible_events.push(new_process_event);
        }

        // Kill by User (Terminate)
        let active_procs = this.get_terminatable_procs();
        const process_to_kill = getRandomElement(active_procs);
        const terminate_event = new Event("terminate", clock, process_to_kill);
        possible_events.push(terminate_event);

        const next_event = getRandomElement(possible_events);
        this.external_events.push(next_event);
    }

}