import * as config from "./config"

export interface IAction {
  event: number;
  responce_time: number;
}

export interface ILog {
  records: IAction[];
}

export class Log {
  records: IAction[];

  constructor() {
    this.records = [];
  }

  addRecord(event: number, responce_time: number) {
    this.records.push({event, responce_time});
  }

  createElement(events) {
    let log = document.getElementById("log");
        let html = `<thead><tr><th>t<sub>e</sub></th><th>Event</th>
        <th>t<sub>r</sub></th><th>Action</th></tr></thead><tbody>`;
        for (let index = 0; index < this.records.length; index++) {
            const element = this.records[index];
            let action = "";
            if(element.event < 0) {
                html += `<tr><td>NA</td><td>NA</td>
                <td>${element.responce_time}</td><td>moveProcess(${-element.event - 1}, CPU)</td></tr>`;
            }
            else {
                const e = events[element.event];
                if(e.name === config.REQUESTPROC)
                    action = `createProcess(${e.pid})`;
                else if(e.name === config.IONEEDED)
                    action = `moveProcess(${e.pid}, ${config.IO})`;
                else if(e.name === config.IODONE)
                    action = `moveProcess(${e.pid}, ${config.READY})`;
                else if(e.name === config.TERMINATE)
                    action = `moveProcess(${e.pid}, ${config.COMPLETED})`
                html += `<tr><td>${e.time}</td><td>${e.name}(${e.pid})</td>
                <td>${element.responce_time}</td><td>${action}</td></tr>`;
            }
        }
        log.innerHTML = html + `</tbody>`;
  }

}