import axios from "axios";

const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || 8000;
const LAPTOP_IP = import.meta.env.VITE_LAPTOP_IP || "localhost";

// const API_URL=`http://${LAPTOP_IP}:${BACKEND_PORT}/api`

// const API_URL=`http://localhost:${BACKEND_PORT}/api`;
const API_URL = "http://localhost:8000/api";

console.log("Frontend dice: Usando API URL:", API_URL);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
