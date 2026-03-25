import api from "./api";

export const publicStatsService = {
  async getLoginStats() {
    // TODO backend: implementar GET /api/stats/login
    // Respuesta esperada:
    // {
    //   ingresos_hoy: number,
    //   autos_activos: number,
    //   autos_entregados_hoy: number,
    //   tiempo_promedio_minutos: number,
    //   productividad_porcentaje: number
    // }
    const response = await api.get("/stats/login");
    return response.data;
  },
};
