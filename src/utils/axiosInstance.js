import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://backend-production-8e00.up.railway.app/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token", token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // localStorage.removeItem("authToken");
      // window.location.href = "/login";
      console.log("Bivas bivan");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
