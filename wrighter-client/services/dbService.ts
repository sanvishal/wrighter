import Dexie, { Table } from "dexie";
import { Tag, Wright } from "../types";

export interface WrightIDB extends Partial<Wright> {}

export class IDB extends Dexie {
  wrights!: Table<WrightIDB>;
  editorContext!: Table<WrightIDB>;
  tags!: Table<Tag>;

  constructor() {
    super("wrighter");
    this.version(1).stores({
      wrights: "++id, title, head, createdAt, updatedAt, userId, content",
      editorContext: "++id, title, head, createdAt, updatedAt, userId, content",
      tags: "++id, name, color",
    });
  }
}

export const db = new IDB();
