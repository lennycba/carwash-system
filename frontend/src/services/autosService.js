import api from "./api";

export const autosService = {
  async crearAuto(payload) {
    const response = await api.post("/autos", payload);
    return response.data;
  },
  async listarAutos(params = {}) {
    const response = await api.get("/autos", { params });
    return response.data;
  },
  async cambiarEstado(autoId, estado) {
    const response = await api.patch(`/autos/${autoId}/estado`, { estado });
    return response.data;
  },
  async asignarEmpleados(autoId, empleadosIds) {
    // TODO backend: implementar PATCH /api/autos/{id}/empleados
    const response = await api.patch(`/autos/${autoId}/empleados`, {
      empleados_ids: empleadosIds,
    });
    return response.data;
  },
  async estadisticasProcesados(params = {}) {
    // TODO backend: implementar GET /api/autos/estadisticas/procesados
    const response = await api.get("/autos/estadisticas/procesados", { params });
    return response.data;
  },
};
