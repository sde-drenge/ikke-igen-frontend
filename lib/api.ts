import { environment } from "@/config/environment";
import axios from "axios";
import { cookies } from "next/headers";
import { COOKIES } from "./constants/cookies";

const api = axios.create({
  baseURL: environment.NEXT_PRIVATE_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const awaitedCookies = await cookies();

    const jwt = awaitedCookies.get(COOKIES.SESSION_TOKEN.name)?.value;

    if (jwt) {
      config.headers["Cookie"] = `jwt=${jwt}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

type UrlPattern =
  | `/${string}/`
  | `/${string}/?${string}`
  | `/${string}/#${string}`
  | `/${string}/?${string}#${string}`
  | `/${string}/#${string}?${string}`;

export async function safeGet<T>(
  url: UrlPattern
): Promise<{ data: T | null; error: unknown }> {
  try {
    const res = await api.get<T>(url);
    return { data: res.data as T, error: null };
  } catch (error) {
    return { data: null, error };
  }
}
