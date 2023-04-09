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
}