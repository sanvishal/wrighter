import axios, { AxiosResponse } from "axios";
import { API_BASE_URL } from "../constants";
import { User } from "../types";

export const login = ({ email, password }: { email: string; password: string }) => {
  return axios.post(`${API_BASE_URL}/user/login`, { email, password }, { withCredentials: true });
};

export const register = ({ email, password, name }: { email: string; password: string; name: string }) => {
  return axios.post(`${API_BASE_URL}/user`, { email, password, name }, { withCredentials: true });
};

export const getUser = (): Promise<AxiosResponse<User>> => {
  return axios.get(`${API_BASE_URL}/user/whoami`, { withCredentials: true });
};

export const logout = () => {
  return axios.get(`${API_BASE_URL}/user/logout`, { withCredentials: true });
};

export const verifyJWT = () => {};
