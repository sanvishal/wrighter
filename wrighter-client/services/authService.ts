import axios from "axios";
import { API_BASE_URL } from "../constants";

export const login = ({ email, password }: { email: string; password: string }) => {
  return axios.post(`${API_BASE_URL}/user/login`, { email, password }, { withCredentials: true });
};

export const getUser = () => {
  return axios.get(`${API_BASE_URL}/user/whoami`, { withCredentials: true });
};

export const logout = () => {
  return axios.get(`${API_BASE_URL}/user/logout`, { withCredentials: true });
};

export const verifyJWT = () => {};
