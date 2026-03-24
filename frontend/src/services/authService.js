import api from "./api";

const STORAGE_KEY = "carwash_auth";

function saveSession(session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function getSession() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}

export const authService = {
  getCurrentSession() {
    return getSession();
  },

  async login(payload) {
    // TODO backend: implementar POST /api/auth/login
    // Se espera respuesta: { access_token, user: { id, nombre, apellido, email, rol } }
    const response = await api.post("/auth/login", payload);
    const session = response.data;
    saveSession(session);
    return session;
  },

  async register(payload) {
    // TODO backend: implementar POST /api/auth/register
    // Regla sugerida: si no hay usuarios en DB, forzar rol ADMIN para el primero.
    // Se espera payload: { nombre, apellido, email, password }
    const response = await api.post("/auth/register", payload);
    return response.data;
  },

  logout() {
    clearSession();
  },
};
