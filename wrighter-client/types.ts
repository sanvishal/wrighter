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
}

export type ResponseTypeMap<isGuest, isAuth> = {
  true: isAuth;
  false: isGuest;
};

export type Tag = {
  id: string;
  color: string;
  name: string;
};
