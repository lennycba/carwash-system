import { useEffect, useState } from "react";

import StatusBadge from "../components/StatusBadge";
import { autosService } from "../services/autosService";

const nextStatus = {
  RECIBIDO: "EN_LAVADO",
  EN_LAVADO: "FINALIZADO",
};

function getAutoOwnerName(auto) {
  const full = `${auto?.cliente_nombre || ""} ${auto?.cliente_apellido || ""}`.trim();
  return full || `Usuario #${auto?.usuario_id ?? "-"}`;
}

export default function EmpleadoPanel() {
  const [autos, setAutos] = useState([]);
  const [error, setError] = useState("");

  const loadAutos = async () => {
    setError("");
    try {
      const data = await autosService.listarAutos();
      setAutos(data);
    } catch (err) {
      setError("No se pudo cargar la lista de autos.");
    }
  };

  useEffect(() => {
    loadAutos();
  }, []);

  const avanzarEstado = async (auto) => {
    const siguiente = nextStatus[auto.estado];
    if (!siguiente) return;
    try {
      await autosService.cambiarEstado(auto.id, siguiente);
      loadAutos();
    } catch (err) {
      setError(err?.response?.data?.detail || "No se pudo cambiar el estado.");
    }
  };

  return (
    <section className="space-y-5">
      <div className="grid md:grid-cols-3 gap-4">
        <article className="surface-card p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Total en planta</p>
          <p className="mt-2 text-3xl font-extrabold text-cw-darkBlue">{autos.length}</p>
        </article>
        <article className="surface-card p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Recibidos</p>
          <p className="mt-2 text-3xl font-extrabold text-cw-darkBlue">
            {autos.filter((item) => item.estado === "RECIBIDO").length}
          </p>
        </article>
        <article className="surface-card p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">En lavado</p>
          <p className="mt-2 text-3xl font-extrabold text-cw-darkBlue">
            {autos.filter((item) => item.estado === "EN_LAVADO").length}
          </p>
        </article>
      </div>

      <div className="panel-card">
        <h3 className="font-bold text-lg text-cw-darkBlue">Autos en proceso</h3>
        <p className="text-slate-500 text-sm mt-1">Gestiona el avance de cada vehiculo por etapas.</p>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="grid gap-3">
        {autos.map((auto) => (
          <article
            key={auto.id}
            className="panel-card flex flex-col md:flex-row md:items-center md:justify-between gap-3"
          >
            <div>
              <p className="font-bold text-cw-darkBlue">
                {getAutoOwnerName(auto)} - {auto.patente}
              </p>
              <p className="text-sm text-slate-500">Telefono: {auto.telefono}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={auto.estado} />
              <button
                className="primary-btn disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!nextStatus[auto.estado]}
                onClick={() => avanzarEstado(auto)}
              >
                {nextStatus[auto.estado] ? "Avanzar estado" : "Sin acciones"}
              </button>
            </div>
          </article>
        ))}
        {autos.length === 0 && <p className="text-slate-500">No hay autos registrados.</p>}
      </div>
    </section>
  );
}
