import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const userInfoString = localStorage.getItem("userInfo");

  // Check if userInfo exists AND is not the string "undefined"
  if (userInfoString && userInfoString !== "undefined") {
    try {
      const userInfo = JSON.parse(userInfoString);
      if (userInfo && userInfo.token) {
        config.headers.Authorization = `Bearer ${userInfo.token}`;
      }
    } catch (error) {
      console.error("Error parsing user info from localStorage:", error);
      // If it's corrupt, clear it so it doesn't crash again
      localStorage.removeItem("userInfo");
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;