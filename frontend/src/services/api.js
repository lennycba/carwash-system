import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("carwash_auth");
  if (!raw) return config;

  try {
    const session = JSON.parse(raw);
    const token = session?.access_token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Si el storage esta corrupto, seguimos sin token.
  }

  return config;
});

export default api;
