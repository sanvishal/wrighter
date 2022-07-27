import axios from "axios";
import { addDays, subDays } from "date-fns";
import compact from "lodash.compact";
import { nanoid } from "nanoid";
import { useQuery } from "react-query";
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

export const getBites = async (isGuest: boolean, startDate: Date, endDate: Date, isCompact = false): Promise<Bite[]> => {
  if (isGuest) {
    const bites = await db.bites
      .filter((bite) =>
        startDate.toDateString() === endDate.toDateString()
          ? startDate.toDateString() === new Date(bite.createdAt).toDateString()
          : startDate.toISOString().localeCompare(bite.createdAt) <= 0 && endDate.toISOString().localeCompare(bite.createdAt) >= 0
      )
      .toArray();
    if (!isCompact) {
      const promisedBites = bites.map(async (bite) => {
        const tagIds = (await db.tagBite.where("biteId").equals(bite.id).toArray()).map((tagBite) => tagBite.tagId);
        const tags = await db.tags.bulkGet(tagIds);
        return { ...bite, tags: compact(tags) || [] };
      });
      return await Promise.all(promisedBites);
    }
    return bites;
  }
  const resp = await axios.get<Bite[]>(!isCompact ? `${API_BASE_URL}/bite` : `${API_BASE_URL}/bite?compact=true`, {
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

export const searchBites = async (isGuest: boolean, query: string) => {
  if (isGuest) {
    return await db.bites
      .filter((bite) => bite.title.toLowerCase().includes(query.toLowerCase()))
      .limit(7)
      .toArray();
  }
  const resp = await axios.get<Bite[]>(`${API_BASE_URL}/bite/search`, {
    params: {
      q: query,
    },
    withCredentials: true,
  });
  return resp.data;
};

export const getLastNDaysBites = async (isGuest: boolean, nDays = 7) => {
  const startDate = subDays(new Date(), nDays - 1);
  const endDate = addDays(new Date(), 1);
  return await getBites(isGuest, startDate, endDate, false);
};
