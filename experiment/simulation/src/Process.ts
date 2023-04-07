import * as config from "./config"

interface IOTime {
    start_time: number
    ticks: number
}

export interface IProcess {
    pid: number;
    name: string;
    state: string;
    history: string[]
}

export class Process implements IProcess {
    pid: number;
    name: string;
    state: string;
    history: string[]

    constructor(pid: number = 0) {
        this.pid = pid;
        this.name = "P" + String(pid);
        this.state = config.INFANT;
        this.history = [];
    }

    getData(): IProcess {
        return {
            "pid": this.pid,
            "name": this.name,
            "state": this.state,
            "history": this.history
        }
    }

    setData(data: IProcess) {
        const {pid, name, state, history} = data;
        this.pid = pid;
        this.name = name;
        this.state = state;
        this.history = history;
    }

    create() {
        this.state = config.READY;
    }

    run() {
        this.state = config.RUNNING;
        this.history.push(this.state);
    }

    ready() {
        this.state = config.READY;
        this.history.push(this.state);
    }

    moveToIO() {
        this.state = config.BLOCKED;
        this.history.push(this.state);
    }

    terminate() {
        this.state = config.TERMINATED;
        this.history.push(this.state);
    }

    createElement() {
        let process_div = document.createElement("div");
        process_div.classList.add("process");
        process_div.draggable = true;
        process_div.id = "Process" + this.pid.toString();
        process_div.innerHTML = this.name;
        return process_div;
    }
    
}
