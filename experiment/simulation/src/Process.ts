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
        this.state = "READY";
        this.history = ["NEW"];
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

    run() {
        this.state = "RUNNING";
        this.history.push(this.state);
    }

    ready() {
        this.state = "READY";
        this.history.push(this.state);
    }

    moveToIO() {
        this.state = "BLOCKED";
        this.history.push(this.state);
    }

    terminate() {
        this.state = "TERMINATED";
        this.history.push(this.state);
    }
    
}