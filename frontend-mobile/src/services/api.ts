import axios from "axios";

const BACKEND_PORT = import.meta.env.VITE_BACKEND_PORT || 8000;
// Version LAN :
// 1. Descomenta VITE_LATOP_IP en .env
// 2. Descomenta la constante LAPTOP_IP aquí:
// const LAPTOP_IP = import.meta.env.VITE_LAPTOP_IP || "localhost";
// 3. Comenta la constante API_URL
const API_URL = `http://localhost:${BACKEND_PORT}/api`
// 4. Descomenta la nueva constante API URL
// const API_URL = `http://${LAPTOP_IP}:${BACKEND_PORT}/api`


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
