import axios from "axios";

<<<<<<< HEAD
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
=======
const API_URL = "https://habit-tracker-backend-a3vm.onrender.com/api";
>>>>>>> 71f53e21dabf00af18e3c7a7c67b14325fb65fb3

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
