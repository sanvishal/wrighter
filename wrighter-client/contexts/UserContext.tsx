import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/router";
import React, { createContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getUser } from "../services/authService";
import { User } from "../types";

export const UserContext = createContext<{ user: User | undefined | null; fetchUser: () => Promise<User | undefined | null> }>({
  user: null,
  fetchUser: () => Promise.resolve(null),
});

export const UserProvider = ({ children }: { children: JSX.Element[] | JSX.Element }) => {
  const [user, setUser] = useState<User | undefined | null>(null);
  const { refetch: refetchUser, isLoading: isUserLoading } = useQuery<AxiosResponse<User>, AxiosError<unknown, unknown>>(
    "user",
    () => getUser(),
    { enabled: false, retry: false }
  );
  const router = useRouter();

  const fetchUser = async () => {
    const { status, data } = await refetchUser();
    setUser(data?.data);
    if (status === "success") {
      router.push("/home");
    } else if (status === "error") {
      router.push("/signin");
    }

    return data?.data;
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return <UserContext.Provider value={{ user, fetchUser }}>{children}</UserContext.Provider>;
};
