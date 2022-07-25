import axios from "axios";
import { addDays, startOfDay, subDays } from "date-fns";
import compact from "lodash.compact";
import { nanoid } from "nanoid";
import { API_BASE_URL } from "../constants";
import { Bite } from "../types";
import { db } from "./dbService";

export const createBite = async (isGuest: boolean, bite: Omit<Bite, "id" | "userId">) => {
  if (isGuest) {
    const id = nanoid();
    await db.bites.add({
      ...bite,
      id,
      title: bite.title || "Give me a title",
      userId: "-99999",
    });
    if (bite?.tags && bite.tags?.length > 0) {
      const tagsToAttach = bite.tags.map((tag) => {
        return { tagId: tag.id || "", biteId: id };
      });
      await db.tagBite.bulkAdd(tagsToAttach);
    }
    const newBite = await db.bites.get(id);
    const tags = await db.tagBite.where("biteId").equals(id).toArray();
    return { ...newBite, tags };
  }
  const resp = await axios.post<Bite>(`${API_BASE_URL}/bite`, bite, { withCredentials: true });
  return resp.data;
};

export const getBites = async (isGuest: boolean, startDate: Date, endDate: Date): Promise<Bite[]> => {
  if (isGuest) {
    const bites = await db.bites
      .filter((bite) =>
        startDate.toDateString() === endDate.toDateString()
          ? startDate.toDateString() === new Date(bite.createdAt).toDateString()
          : startDate.toISOString().localeCompare(bite.createdAt) <= 0 && endDate.toISOString().localeCompare(bite.createdAt) >= 0
      )
      .toArray();
    const promisedBites = bites.map(async (bite) => {
      const tagIds = (await db.tagBite.where("biteId").equals(bite.id).toArray()).map((tagBite) => tagBite.tagId);
      const tags = await db.tags.bulkGet(tagIds);
      return { ...bite, tags: compact(tags) || [] };
    });
    return await Promise.all(promisedBites);
  }
  const resp = await axios.get<Bite[]>(`${API_BASE_URL}/bite`, {
    params: {
      f: startDate.toISOString(),
      t: endDate.toISOString(),
    },
    withCredentials: true,
  });
  return resp.data;
};

export const deleteBite = async (isGuest: boolean, biteId: string) => {
  if (isGuest) {
    await db.bites.delete(biteId);
    await db.tagBite.where("biteId").equals(biteId).delete();
    return;
  }
  const resp = await axios.delete(`${API_BASE_URL}/bite/${biteId}`, { withCredentials: true });
  return resp.data;
};
