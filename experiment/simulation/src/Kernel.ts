import { Process } from "./Process";
import { Log } from "./Log";

export class Kernel {
    processes: Process[];
    currentProcess: number;
    processCreations : number [];
    events: Event [];
    log : Log;
    clock: number;

    constructor() {
      this.processes = [];
      this.currentProcess = -1;
    }
  
    createProcess(name: string) {
      const pid = this.processes.length;
      const process = new Process(pid, name);
      this.processes.push(process);
    }

    advanceClock() {
        this.clock++;
    }

    runProcess(id: number) {
        this.processes[id].run();
    }

    prempt() {
        this.processes[this.currentProcess].ready();
        this.currentProcess = -1;
    }

    moveToIO() {
        this.processes[this.currentProcess].moveToIO();
    }

    moveToReady(id: number) {
        this.processes[id].ready();
    }

    terminate() {
        this.processes[this.currentProcess].terminate();
    }
}