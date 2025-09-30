import axios from 'axios';
import { getToken } from './auth'; // Import the getToken function

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
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
  if (axios.isAxiosError(error) && error.response) {
    // Use the error message from the backend if available
    throw new Error(error.response.data.error || error.response.data.message || 'An unknown API error occurred');
  }
  // Handle non-Axios errors or network errors
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
  post: async (path: string, body: any) => {
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
  put: async (path: string, body: any) => {
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
