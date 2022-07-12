import Dexie, { Table } from "dexie";
import { Wright } from "../types";

export interface WrightIDB extends Partial<Wright> {}

export class IDB extends Dexie {
  wrights!: Table<WrightIDB>;

  constructor() {
    super("wrighter");
    this.version(1).stores({
      wrights: "++id, title, head, createdAt, updatedAt, userId, content",
    });
  }
}

export const db = new IDB();
