import axios, { AxiosResponse } from "axios";
import { IndexableType } from "dexie";
import compact from "lodash.compact";
import { nanoid } from "nanoid";
import { API_BASE_URL } from "../constants";
import { Bite, Tag, TagWright, Wright } from "../types";
import { db, WrightIDB } from "./dbService";

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
    `${API_BASE_URL}/wright/${wrightId}/tag`,
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
  const tags = await axios.get<Tag[]>(`${API_BASE_URL}/tag?q=${query}`, { withCredentials: true });
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
  const resp = (await axios.delete(`${API_BASE_URL}/wright/${wrightId}/tag/${tagId}`, {
    withCredentials: true,
  })) as AxiosResponse<any>;
  return resp.data;
};

export const getTagContents = async (isGuest: boolean, tagId: string): Promise<(Wright | WrightIDB | Bite)[]> => {
  if (isGuest) {
    const wrightRelations = await db.tagWright.where("tagId").equals(tagId).toArray();
    const biteRelations = await db.tagBite.where("tagId").equals(tagId).toArray();
    const wrights = await db.wrights.bulkGet(wrightRelations.map((relation) => relation.wrightId));
    const bites = await db.bites.bulkGet(biteRelations.map((relation) => relation.biteId));
    return [...compact(wrights), ...compact(bites)];
  }
  const resp = await axios.get<(Wright | Bite)[]>(`${API_BASE_URL}/tag/${tagId}/content`, { withCredentials: true });
  return resp.data;
};

export const deleteTag = async (isGuest: boolean, tagId: string): Promise<any> => {
  if (isGuest) {
    await db.tags.delete(tagId);
    await db.tagWright.where("tagId").equals(tagId).delete();
    await db.tagBite.where("tagId").equals(tagId).delete();
    return {};
  }
  const resp = await axios.delete(`${API_BASE_URL}/tag/${tagId}`, { withCredentials: true });
  return resp.data;
};
