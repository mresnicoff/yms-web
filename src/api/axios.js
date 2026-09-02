import axios from "axios";

// En producción (Vercel) se define VITE_API_URL apuntando al backend
// desplegado, incluyendo el prefijo /api. En desarrollo local, si no está
// seteada, usa localhost:3000/api.
const baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;