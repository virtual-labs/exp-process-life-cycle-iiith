export class Log {
  records: string[];

  constructor() {
    this.records = [];
  }

  addRecord(record: string) {
    this.records.push(record);
  }
}