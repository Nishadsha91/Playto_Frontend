import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://web-production-29b08d.up.railway.app/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error(`API Error [${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error("No response from server:", error.request);
    } else {
      // Error in request setup
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;