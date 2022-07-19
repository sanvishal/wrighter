import { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getUser } from "../services/authService";
import { User } from "../types";

export const UserContext = createContext<{
  user: User | undefined | null;
  fetchUser: () => Promise<User | undefined | null>;
  isAuthenticated: () => boolean;
  isAuthenticatedString: () => "true" | "false";
  isUserLoading: boolean;
}>({
  user: null,
  fetchUser: () => Promise.resolve(null),
  isAuthenticated: () => false,
  isUserLoading: false,
  isAuthenticatedString: () => "false",
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
    if (status === "success" && router.route === "/signin") {
      router.push("/wrights");
    } else if (status === "error") {
      // router.push("/signin");
    }

    return data?.data;
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const isAuthenticated = () => user !== null && user !== undefined;

  const isAuthenticatedString = () => (isAuthenticated() ? "true" : "false");

  return (
    <UserContext.Provider value={{ user, fetchUser, isAuthenticated, isAuthenticatedString, isUserLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
