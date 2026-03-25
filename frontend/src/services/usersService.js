import api from "./api";

export const usersService = {
  async listarUsuarios(params = {}) {
    // TODO backend: implementar GET /api/usuarios
    const response = await api.get("/usuarios", { params });
    return response.data;
  },
  async cambiarRol(userId, rol) {
    // TODO backend: implementar PATCH /api/usuarios/{id}/rol
    const response = await api.patch(`/usuarios/${userId}/rol`, { rol });
    return response.data;
  },
};
