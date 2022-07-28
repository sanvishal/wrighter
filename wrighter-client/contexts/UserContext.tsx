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
  isAuth: boolean;
}>({
  user: null,
  fetchUser: () => Promise.resolve(null),
  isAuthenticated: () => false,
  isUserLoading: true,
  isAuthenticatedString: () => "false",
  isAuth: false,
});

export const UserProvider = ({ children }: { children: JSX.Element[] | JSX.Element }) => {
  const [user, setUser] = useState<User | undefined | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const { refetch: refetchUser } = useQuery<AxiosResponse<User>, AxiosError<unknown, unknown>>("user", () => getUser(), {
    enabled: false,
    retry: false,
  });
  const router = useRouter();

  const fetchUser = async () => {
    setIsUserLoading(true);
    const { status, data } = await refetchUser();
    setUser(data?.data);
    if (status === "success") {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
    setIsUserLoading(false);
    if (status === "success" && router.route === "/signin") {
      router.push("/wrights");
    } else if (status === "error") {
      // router.push("/signin");
    }
    return data?.data;
  };

  useEffect(() => {
    fetchUser();
  }, [router.pathname]);

  const isAuthenticated = () => user !== null && user !== undefined;

  const isAuthenticatedString = () => (isAuthenticated() ? "true" : "false");

  return (
    <UserContext.Provider value={{ user, fetchUser, isAuthenticated, isAuthenticatedString, isUserLoading, isAuth }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
