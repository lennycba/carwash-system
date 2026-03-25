import { useEffect, useMemo, useState } from "react";

import SimpleTable from "../components/SimpleTable";
import { autosService } from "../services/autosService";
import { usersService } from "../services/usersService";

function getFullName(user) {
  const full = `${user?.nombre || ""} ${user?.apellido || ""}`.trim();
  return full || user?.nombre || user?.email || "Usuario";
}

function buildFallbackStats(autos, empleadoId, desde, hasta) {
  const from = desde ? new Date(`${desde}T00:00:00`) : null;
  const to = hasta ? new Date(`${hasta}T23:59:59`) : null;

  const processed = autos.filter((auto) => {
    if (auto.estado !== "FINALIZADO") return false;
    const refDate = auto.fecha_finalizacion || auto.updated_at || auto.created_at;
    if (!refDate) return true;
    const date = new Date(refDate);
    if (from && date < from) return false;
    if (to && date > to) return false;
    if (!empleadoId) return true;

    const assignedIds = auto.empleados_ids || [];
    return assignedIds.includes(Number(empleadoId));
  });

  return {
    total_autos_procesados: processed.length,
  };
}

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [autos, setAutos] = useState([]);
  const [stats, setStats] = useState({ total_autos_procesados: 0 });
  const [filters, setFilters] = useState({
    desde: "",
    hasta: "",
    empleadoId: "",
  });
  const [assignment, setAssignment] = useState({
    autoId: "",
    empleadosIds: [],
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const empleados = useMemo(
    () => users.filter((user) => user.rol === "EMPLEADO"),
    [users]
  );

  const loadBaseData = async () => {
    setError("");
    try {
      const [usersData, autosData] = await Promise.all([
        usersService.listarUsuarios(),
        autosService.listarAutos(),
      ]);
      setUsers(usersData);
      setAutos(autosData);
    } catch (err) {
      setError(err?.response?.data?.detail || "No se pudo cargar informacion de administracion.");
    }
  };

  const loadStats = async () => {
    setError("");
    setMessage("");
    try {
      const data = await autosService.estadisticasProcesados({
        desde: filters.desde || undefined,
        hasta: filters.hasta || undefined,
        empleado_id: filters.empleadoId || undefined,
      });
      setStats(data);
    } catch {
      // Fallback visual para no bloquear la UI mientras implementas backend.
      setStats(buildFallbackStats(autos, filters.empleadoId, filters.desde, filters.hasta));
    }
  };

  useEffect(() => {
    loadBaseData();
  }, []);

  useEffect(() => {
    loadStats();
  }, [autos]);

  const cambiarRol = async (userId, rol) => {
    setError("");
    setMessage("");
    try {
      await usersService.cambiarRol(userId, rol);
      setMessage("Rol actualizado correctamente.");
      await loadBaseData();
    } catch (err) {
      setError(err?.response?.data?.detail || "No se pudo actualizar el rol.");
    }
  };

  const handleEmployeeSelection = (event) => {
    const selectedValues = Array.from(event.target.selectedOptions, (option) => Number(option.value));
    setAssignment((prev) => ({ ...prev, empleadosIds: selectedValues }));
  };

  const handleAssign = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await autosService.asignarEmpleados(Number(assignment.autoId), assignment.empleadosIds);
      setMessage("Empleados asignados correctamente al auto.");
      setAssignment({ autoId: "", empleadosIds: [] });
      await loadBaseData();
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "No se pudo asignar empleados. Implementa PATCH /api/autos/{id}/empleados en backend."
      );
    }
  };

  const applyStatsFilters = async (event) => {
    event.preventDefault();
    await loadStats();
  };

  return (
    <section className="space-y-5">
      <div className="grid md:grid-cols-3 gap-4">
        <article className="surface-card p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Usuarios totales</p>
          <p className="mt-2 text-3xl font-extrabold text-cw-darkBlue">{users.length}</p>
        </article>
        <article className="surface-card p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Empleados activos</p>
          <p className="mt-2 text-3xl font-extrabold text-cw-darkBlue">{empleados.length}</p>
        </article>
        <article className="surface-card p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Autos procesados</p>
          <p className="mt-2 text-3xl font-extrabold text-cw-darkBlue">
            {stats.total_autos_procesados ?? 0}
          </p>
        </article>
      </div>

      <div className="panel-card">
        <h3 className="font-bold text-lg text-cw-darkBlue">Estadisticas de procesamiento</h3>
        <p className="text-sm text-slate-500 mt-1">
          Filtra por fecha y empleado para medir productividad.
        </p>
        <form className="grid md:grid-cols-4 gap-3 mt-4" onSubmit={applyStatsFilters}>
          <input
            className="input-base"
            type="date"
            value={filters.desde}
            onChange={(event) => setFilters((prev) => ({ ...prev, desde: event.target.value }))}
          />
          <input
            className="input-base"
            type="date"
            value={filters.hasta}
            onChange={(event) => setFilters((prev) => ({ ...prev, hasta: event.target.value }))}
          />
          <select
            className="input-base"
            value={filters.empleadoId}
            onChange={(event) => setFilters((prev) => ({ ...prev, empleadoId: event.target.value }))}
          >
            <option value="">Todos los empleados</option>
            {empleados.map((empleado) => (
              <option key={empleado.id} value={empleado.id}>
                {getFullName(empleado)}
              </option>
            ))}
          </select>
          <button className="primary-btn" type="submit">
            Aplicar filtros
          </button>
        </form>
      </div>

      <div className="panel-card">
        <h3 className="font-bold text-lg text-cw-darkBlue">Asignar empleados a auto</h3>
        <p className="text-sm text-slate-500 mt-1">
          Selecciona un auto y asigna uno o varios empleados para su trabajo.
        </p>
        <form className="grid md:grid-cols-3 gap-3 mt-4" onSubmit={handleAssign}>
          <select
            className="input-base"
            value={assignment.autoId}
            onChange={(event) => setAssignment((prev) => ({ ...prev, autoId: event.target.value }))}
            required
          >
            <option value="">Seleccionar auto</option>
            {autos.map((auto) => (
              <option key={auto.id} value={auto.id}>
                #{auto.id} - {auto.patente} ({auto.cliente})
              </option>
            ))}
          </select>

          <select
            className="input-base min-h-28"
            multiple
            value={assignment.empleadosIds.map(String)}
            onChange={handleEmployeeSelection}
            required
          >
            {empleados.map((empleado) => (
              <option key={empleado.id} value={empleado.id}>
                {getFullName(empleado)}
              </option>
            ))}
          </select>

          <button className="primary-btn" type="submit">
            Asignar empleados
          </button>
        </form>
      </div>

      <div className="panel-card">
        <h3 className="font-bold text-lg text-cw-darkBlue">Gestion de usuarios</h3>
        <p className="text-sm text-slate-500 mt-1">Actualiza roles desde este panel administrativo.</p>
      </div>

      <SimpleTable
        headers={["Nombre", "Email", "Rol", "Accion"]}
        rows={users.map((user) => [
          <span className="font-semibold text-cw-darkBlue" key={`${user.id}-nombre`}>
            {getFullName(user)}
          </span>,
          user.email,
          user.rol,
          <select
            key={user.id}
            className="input-base"
            value={user.rol}
            onChange={(event) => cambiarRol(user.id, event.target.value)}
          >
            <option value="ADMIN">ADMIN</option>
            <option value="EMPLEADO">EMPLEADO</option>
            <option value="CLIENTE">CLIENTE</option>
          </select>,
        ])}
        emptyMessage="No hay usuarios cargados."
      />

      {message && <p className="text-sm text-emerald-700">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </section>
  );
}
