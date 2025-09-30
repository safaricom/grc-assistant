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
  withCredentials: true,
  timeout: 10000, // 10s timeout to help detect hangs
  headers: {
    'Content-Type': 'application/json',
  },
});

// Use an interceptor to add the token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - axios types for headers can be loose here
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Generic error handler with improved diagnostics for network/CORS failures
const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    // Timeout
    if ((error as any).code === 'ECONNABORTED') {
      console.error('API request timed out', { baseURL: axiosInstance.defaults.baseURL });
      throw new Error(`Network timeout: no response from API (baseURL=${axiosInstance.defaults.baseURL})`);
    }

    // No response received (possible CORS preflight blocked, connection refused, DNS failure)
    if (error.request && !error.response) {
      console.error('Network/No response from API.', {
        attemptedBaseURL: axiosInstance.defaults.baseURL,
        originalError: error,
      });
      throw new Error(`Network error: no response from API. attempted baseURL=${axiosInstance.defaults.baseURL}`);
    }

    // Server responded with an error
    if (error.response) {
      const data = error.response.data as any;
      const msg = data?.message || data?.error || `HTTP ${error.response.status}`;
      throw new Error(msg);
    }
  }

  // Non-Axios errors
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
      return handleError(error);
    }
  },
  post: async (path: string, body: any) => {
    try {
      const response = await axiosInstance.post(path, body);
      return response.data;
    } catch (error) {
      return handleError(error);
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
      return handleError(error);
    }
  },
  put: async (path: string, body: any) => {
    try {
      const response = await axiosInstance.put(path, body);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
  delete: async (path: string) => {
    try {
      const response = await axiosInstance.delete(path);
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};

export default axiosInstance;
