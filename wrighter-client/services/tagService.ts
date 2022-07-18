import axios, { AxiosResponse } from "axios";
import { IndexableType } from "dexie";
import compact from "lodash.compact";
import { nanoid } from "nanoid";
import { API_BASE_URL } from "../constants";
import { Tag, TagWright } from "../types";
import { db } from "./dbService";

export const getAllTags = async (isGuest: boolean): Promise<Tag[] | undefined> => {
  if (isGuest) {
    return await db.tags.toArray();
  }
  const tags = await axios.get<Tag[]>(`${API_BASE_URL}/tag`, { withCredentials: true });
  return tags.data;
};

export const createTag = async (isGuest: boolean, tag: Tag): Promise<Tag | undefined> => {
  if (isGuest) {
    const tagAlreadyExists = await db.tags.where("name").equals(tag.name).count();
    if (tagAlreadyExists) {
      return await db.tags.where("name").equals(tag.name).first();
    }
    const tagId = nanoid();
    const newTag: Tag = {
      id: tagId,
      name: tag.name,
      color: tag.color,
      userId: "-999999",
    };
    await db.tags.add(newTag);
    return await db.tags.get(tagId);
  }
  const newTag = await axios.post<Tag>(`${API_BASE_URL}/tag`, tag, { withCredentials: true });
  return newTag.data;
};

export const attachTagToWright = async (isGuest: boolean, tagId: string, wrightId: string): Promise<any> => {
  if (isGuest) {
    const isAlreadyAttached = await db.tagWright
      .where("wrightId")
      .equals(wrightId)
      .and((t) => t.tagId === tagId)
      .first();
    if (!isAlreadyAttached) {
      return await db.tagWright.add({ tagId, wrightId });
    }
    return isAlreadyAttached;
  }
  const resp = (await axios.put(
    `${API_BASE_URL}/wright/${wrightId}`,
    { tagId },
    { withCredentials: true }
  )) as AxiosResponse<any>;
  return resp.data;
};

export const getTagsForWright = async (isGuest: boolean, wrightId: string): Promise<Tag[] | undefined> => {
  if (isGuest) {
    const tagsRelations = await db.tagWright.where("wrightId").equals(wrightId).toArray();
    const tags = await db.tags.bulkGet(tagsRelations.map((relation) => relation.tagId));
    return compact(tags);
  }
  const tags = await axios.get<Tag[]>(`${API_BASE_URL}/wright/${wrightId}/tag`, { withCredentials: true });
  return tags.data;
};

export const searchTags = async (isGuest: boolean, query: string): Promise<Tag[] | undefined> => {
  if (isGuest) {
    return await db.tags.filter((tag) => tag.name.toLowerCase().includes(query.toLowerCase())).toArray();
  }
  const tags = await axios.get<Tag[]>(`${API_BASE_URL}/tag/search?query=${query}`, { withCredentials: true });
  return tags.data;
};

export const untagWright = async (isGuest: boolean, tagId: string, wrightId: string): Promise<any> => {
  if (isGuest) {
    return await db.tagWright
      .where("tagId")
      .equals(tagId)
      .and((tw) => tw.wrightId === wrightId)
      .delete();
  }
  const resp = (await axios.put(
    `${API_BASE_URL}/wright/${wrightId}`,
    { tagId: "" },
    { withCredentials: true }
  )) as AxiosResponse<any>;
  return resp.data;
};
