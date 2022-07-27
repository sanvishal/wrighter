import Dexie, { Table } from "dexie";
import { Bite, Tag, TagBite, TagWright, Wright } from "../types";

export interface WrightIDB extends Partial<Wright> {}

export class IDB extends Dexie {
  wrights!: Table<WrightIDB>;
  editorContext!: Table<WrightIDB>;
  tags!: Table<Tag>;
  tagWright!: Table<TagWright>;
  bites!: Table<Bite>;
  tagBite!: Table<TagBite>;

  constructor() {
    super("wrighter");
    this.version(2).stores({
      wrights: "++id, title, head, createdAt, updatedAt, userId, content",
      editorContext: "++id, title, head, createdAt, updatedAt, userId, content",
      tags: "++id, name, color, userId",
      tagWright: "++id, tagId, wrightId",
      bites: "++id, title, content, type, createdAt, updatedAt, userId",
      tagBite: "++id, tagId, biteId",
    });
  }
}

export const db = new IDB();
