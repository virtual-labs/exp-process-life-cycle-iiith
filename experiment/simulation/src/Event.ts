export interface IEvent {
    name: string;
    pid: number | null;
    time: number;
    id: number;
    responceId: number;
    type: string;
    state: string;
}

export class Event implements IEvent{
    name: string;
    pid: number | null;
    time: number;
    id: number;
    responceId: number;
    type: string;
    state: string;
    

    constructor(id: number = -1, name: string = "", time: number = -1, p: number = -1, type: string = "EXTERNAL") {
        this.name = name;
        this.pid = p;
        this.time = time;
        this.id = id;
        this.type = type;
        this.state = "ACTIVE";
    }
    setResponceId(rid: number) {
        this.responceId = rid;
        this.state = "DONE";
    }
    killed(rid: number) {
        this.responceId = rid;
        this.state = "KILLED";
    }
    getData(): IEvent {
        return {
            name: this.name,
            pid: this.pid,
            time: this.time,
            id: this.id,
            responceId: this.responceId,
            type: this.type,
            state: this.state
        }
    }
    setData(data: IEvent) {
        let {name, pid, time, id, responceId, type, state} = data;
        this.name = name;
        this.pid = pid;
        this.time = time;
        this.id = id;
        this.responceId = responceId;
        this.type = type;
        this.state = state;
    }
    
}