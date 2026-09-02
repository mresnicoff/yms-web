import axios from "axios";

// Leemos la URL base de las variables de entorno (con un fallback por si no existe)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"; 
// Nota: Si usás Create React App cambia por: process.env.REACT_APP_API_URL

const api = axios.create({
  baseURL: `${BASE_URL}/api`
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;