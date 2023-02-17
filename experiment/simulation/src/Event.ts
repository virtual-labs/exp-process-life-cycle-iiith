export class Event {
    name: string;
    pid: number | null;
    time: number

    constructor(name: string, p: number = -1, time: number) {
        this.name = name;
        this.pid = p;
        this.time = time;
    }
}