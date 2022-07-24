export type User = {
  id: string;
  name: string;
  email: string;
};

export interface Wright {
  id: string;
  title: string;
  head: string;
  createdAt: string;
  updatedAt: string;
  content: string;
  userId: string;
  tags?: Tag[];
  slug?: string;
  isPublic?: boolean;
}

export type ResponseTypeMap<isGuest, isAuth> = {
  true: isAuth;
  false: isGuest;
};

export type Tag = {
  id?: string;
  color?: string;
  name: string;
  userId?: string;
};

export type TagWright = {
  id?: number;
  tagId: string;
  wrightId: string;
};

export type TagSearchResult = Tag & { isTagged?: boolean };

export enum BiteType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  LINK = "LINK",
}

export type Bite = {
  id: string;
  title: string;
  content: string;
  type: BiteType;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags?: Tag[];
};

export type TagBite = {
  id?: number;
  tagId: string;
  biteId: string;
};
