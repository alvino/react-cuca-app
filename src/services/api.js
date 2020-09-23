import axios from "axios";
import { getToken } from "./auth";

const baseURL = process.env.CUCA_API_URL || "http://localhost:3333";

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
