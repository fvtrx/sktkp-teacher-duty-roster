// File: services/api.ts

import axios, { AxiosError } from "axios";

// Create a base axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // You can add authentication tokens here
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh or specific error codes
    if (axios.isAxiosError(error) && error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // You could refresh token here
          // const refreshToken = localStorage.getItem('refresh_token');
          // const response = await axios.post('/api/auth/refresh', { token: refreshToken });
          // localStorage.setItem('auth_token', response.data.token);
          // After refreshing token, retry the original request
          // return api(originalRequest);
        } catch (refreshError) {
          // Handle refresh failure (e.g., redirect to login)
          console.error("Failed to refresh authentication", refreshError);
        }
      }

      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.error("Access forbidden");
        // You could redirect to an access denied page
      }

      // Handle 404 Not Found
      if (error.response.status === 404) {
        console.error("Resource not found");
      }

      // Handle 500 Server Error
      if (error.response.status >= 500) {
        console.error("Server error");
      }
    }

    return Promise.reject(error);
  }
);

// Helper functions
export const handleAxiosError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      // The server responded with a status other than 2xx
      return "Something went wrong, please try again later.";
    } else if (axiosError.request) {
      // The request was made but no response was received
      return "No response received from server";
    } else {
      // Something happened in setting up the request
      return axiosError.message || "An unknown error occurred";
    }
  }

  // For non-Axios errors
  return error instanceof Error ? error.message : "An unknown error occurred";
};

export default api;
