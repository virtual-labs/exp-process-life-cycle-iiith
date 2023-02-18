export class Event {
    name: string;
    pid: number | null;
    time: number;
    id: number

    constructor(name: string, time: number, p: number = -1) {
        this.name = name;
        this.pid = p;
        this.time = time;
    }

    set_id(id: number) {
        this.id = id;
    }
}