export class Log {
  records: String[];

  constructor() {
    this.records = [];
  }

  addRecord(record: string) {
    this.records.push(record);
  }
}