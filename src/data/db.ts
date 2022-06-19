import Dexie, { Table } from "dexie";

const DATAKEY = "myMeditation";

export interface Record {
  id?: number;
  createTime: number;
  duration: number;
  note?: string;
}

export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  records!: Table<Record>;

  constructor() {
    super(DATAKEY);
    this.version(1).stores({
      records: "++id, createTime, duration, note", // Primary key and indexed props
    });
  }
}

export const db = new MySubClassedDexie();
