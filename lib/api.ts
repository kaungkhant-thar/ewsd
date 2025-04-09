import axios, { AxiosResponse } from "axios";
import { QueryClient } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { toast } from "sonner";


export const BE_HOST = "http://localhost";

// Create axios instance with default config
export const api = axios.create({
  baseURL: `${BE_HOST}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const AUTH_TOKEN_KEY = "token";

export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  window.location.href = "/login";
};

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  // Get token from localStorage
  const token =
    typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.url !== "/login") {
    toast.error("Token not found! Logging out...");
    logout();
  }
  return config;
});

// Create and export QueryClient instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount:true
    },
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      // Handle axios errors
      const message = error.response?.data?.message || error.message;
      const hasErrorInData =
        error.response?.data?.data &&
        typeof error.response?.data?.data === "object";
      if (hasErrorInData) {
        // Backend sometimes return validation errors in the `data` object
        const errStr = Object.values(error.response?.data?.data).join(", ");
        throw new Error(message ? `${message}. ${errStr}` : errStr);
      }
      throw new Error(message);
    }
    // Handle other errors
    throw error;
  }
);
