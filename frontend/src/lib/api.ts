import axios from 'axios';
import { getToken } from './auth'; // Import the getToken function

// Prefer a build-time Vite variable `VITE_API_HOST` (e.g. https://api.example.com or http://backend:3001)
// If present, use it and append /api. Fall back to VITE_API_BASE_URL for backward compatibility, then to localhost.
// Default to a relative path so an nginx frontend can proxy /api -> backend internally.
const API_HOST = import.meta.env.VITE_API_HOST || import.meta.env.VITE_API_BASE_URL || '';
const API_BASE_URL = API_HOST
  ? (API_HOST.endsWith('/api') ? API_HOST : `${API_HOST.replace(/\/$/, '')}/api`)
  : '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000, // 15s timeout to fail fast on network issues
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Use an interceptor to add the token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Generic error handler
const handleError = (error: unknown) => {
  // Axios errors with a response: backend returned an error
  if (axios.isAxiosError(error) && error.response) {
    const data = error.response.data as unknown;
    let message = `API error: ${error.response.status}`;
    if (data && typeof data === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const d = data as any;
      message = d?.error || d?.message || message;
    }
    throw new Error(message);
  }

  // Network errors / no response (CORS / DNS / server down)
  if (axios.isAxiosError(error) && error.request && !error.response) {
    const attempted = API_BASE_URL || window.location.origin;
    throw new Error(
      `Network Error: Failed to reach ${attempted}. This may be a CORS issue, the server may be down, or the URL is incorrect.`
    );
  }

  // Other JS errors
  if (error instanceof Error) {
    throw error;
  }

  throw new Error('An unexpected error occurred');
};


export const api = {
  get: async (path: string) => {
    try {
      const response = await axiosInstance.get(path);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  post: async (path: string, body: unknown) => {
    try {
      const response = await axiosInstance.post(path, body);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  postForm: async (path: string, formData: FormData) => {
    try {
      // For form data, we need a different header config
      const response = await axiosInstance.post(path, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  put: async (path: string, body: unknown) => {
    try {
      const response = await axiosInstance.put(path, body);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  delete: async (path: string) => {
    try {
      const response = await axiosInstance.delete(path);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
};
