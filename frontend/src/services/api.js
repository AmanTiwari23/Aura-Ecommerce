import axios from "axios";

// Create an instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * This runs before every single API call made by your app.
 * It manually attaches the JWT token from localStorage to the 
 * Authorization header to bypass browser cookie blocking.
 */
api.interceptors.request.use(
  (config) => {
    try {
      // Get user info string from storage
      const userInfoString = localStorage.getItem("userInfo");
      
      if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        
        // If token exists, attach it to the headers
        if (userInfo && userInfo.token) {
          config.headers.Authorization = `Bearer ${userInfo.token}`;
        }
      }
    } catch (error) {
      console.error("Error parsing user info from localStorage", error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor (Recommended Addition)
 * This is useful for handling 401 errors globally. 
 * If the token expires while the user is browsing, this logs them out.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: Clear storage and redirect to login if unauthorized
      // localStorage.removeItem("userInfo");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;