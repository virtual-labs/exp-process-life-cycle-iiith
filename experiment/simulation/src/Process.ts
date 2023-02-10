interface IOTime {
    start_time: number
    ticks: number
}

export class Process {
    pid: number;
    name: string;
    state: string;
    registers: {[key: string]: any};
    programCounter : number
    ioRequests: IOTime;
    ticks: number
    history: string[]

    constructor(pid: number, name: string) {
        this.pid = pid;
        this.name = name;
        this.state = "READY";
        this.history = ["NEW"];
        this.registers = {"r1" : 1, "r2" : 2, "r3" : 3, "r4" : 4};
        this.ioRequests = { start_time: 3, ticks : 2};
        this.ticks = 6;
        this.programCounter = 0;
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