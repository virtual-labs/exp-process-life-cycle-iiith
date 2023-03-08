import * as config from "./config"

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
    

    constructor(id: number = -1, name: string = "", time: number = -1, p: number = -1, type: string = config.EXTERNAL) {
        this.name = name;
        this.pid = p;
        this.time = time;
        this.id = id;
        this.type = type;
        this.state = config.ACTIVE;
    }
    setResponceId(rid: number) {
        this.responceId = rid;
        this.state = config.DONE;
    }
    killed(rid: number) {
        this.responceId = rid;
        this.state = config.KILLED;
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
    createElement(){
        console.log(`event: name ${this.name}`);
        let e_type = document.createElement('p');
        if(this.type === config.EXTERNAL){
            e_type.innerText = 'E';
            e_type.style.backgroundColor = "#0ec8b4";
        }
        else {
            e_type.innerText = 'P';
            e_type.style.backgroundColor = "#1128ee";
        }
        e_type.classList.add("event_type");
        e_type.classList.add("center");

        let name = document.createElement('p');
        name.innerText = this.name;
        name.classList.add('event_name');
        name.classList.add('center');

        let pid = document.createElement('p');
        pid.innerHTML = `P<sub>id</sub>: ${this.pid}`;
        pid.classList.add("event_pid");
        pid.classList.add("center");

        let time = document.createElement('p');
        time.innerText = `time: ${this.time}`;
        time.classList.add("event_time");
        time.classList.add("center");

        let e_main = document.createElement('div');
        e_main.classList.add("event");
        e_main.appendChild(e_type);
        e_main.appendChild(name);
        e_main.appendChild(pid);
        e_main.appendChild(time)

        return e_main;
    }
}
