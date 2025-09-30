import { User } from "@/types";

const USER_STORAGE_KEY = "grc-assistant-user";
const TOKEN_STORAGE_KEY = "grc-assistant-token";

export const login = (user: User, token: string, rememberMe: boolean): void => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  storage.setItem(TOKEN_STORAGE_KEY, token);
  window.dispatchEvent(new Event("storage")); // To notify other tabs
};

export const logout = (): void => {
  localStorage.removeItem(USER_STORAGE_KEY);
  sessionStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  window.dispatchEvent(new Event("storage")); // To notify other tabs
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(USER_STORAGE_KEY) || sessionStorage.getItem(USER_STORAGE_KEY);
  if (!userJson) {
    return null;
  }
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error("Failed to parse user from storage", error);
    return null;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY);
};

export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};
