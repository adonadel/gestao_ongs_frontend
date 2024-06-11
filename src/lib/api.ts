import axios, { AxiosInstance } from "axios";
import { getState } from "../shared/store/authStore";

interface AuthState {
  token: string;
}

const baseApi: AxiosInstance = axios.create({
  baseURL: "http://localhost:80",
});

baseApi.interceptors.request.use(
  async (config) => {
    const authToken = (getState() as AuthState).token;
    config.headers.Authorization = `Bearer ${authToken}`;

    return config;
  },
  (error) => Promise.reject(error)
);

baseApi.defaults.withCredentials = false;
baseApi.defaults.headers.post["Content-Type"] =
  "application/json;charset=utf-8";
baseApi.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

export default baseApi;
