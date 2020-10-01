import axios from "axios";
import { getToken } from "./auth";

const isDev = process.env.NODE_ENV === "development";

const baseURL = !isDev
  ? "http://localhost:3333"
  : "https://cuca-api.herokuapp.com";

const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
