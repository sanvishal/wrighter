import axios, { AxiosResponse } from "axios";
import { API_BASE_URL } from "../constants";
import { Tag } from "../types";
import { db } from "./dbService";

export const getAllTags = async (isGuest: boolean): Promise<Tag[] | undefined> => {
  if (isGuest) {
    return await db.tags.toArray();
  }
  const tags = (await axios.get(`${API_BASE_URL}/tag`, { withCredentials: true })) as AxiosResponse<Tag[]>;
  return tags.data;
};

export const createTag = async (isGuest: boolean, tag: Tag): Promise<Tag | undefined> => {
  if (isGuest) {
    await db.tags.add(tag);
    return await db.tags.get(tag.id);
  }
  const newTag = (await axios.post(`${API_BASE_URL}/tag`, tag, { withCredentials: true })) as AxiosResponse<Tag>;
  return newTag.data;
};
