import { useEffect, useMemo, useState } from "react";

import { autosService } from "../services/autosService";

function getFullName(user) {
  const full = `${user?.nombre || ""} ${user?.apellido || ""}`.trim();
  return full || user?.nombre || "";
}

export default function ClientePanel({ user }) {
  const fullName = getFullName(user);
  const notificationsStorageKey = `carwash_seen_notifications_${user?.id || fullName}`;

  const [vehiculos, setVehiculos] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [vehiculoForm, setVehiculoForm] = useState({
    telefono: "",
    patente: "",
  });
  const [ingresoVehiculoId, setIngresoVehiculoId] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [seenNotificationKeys, setSeenNotificationKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [vehiculosData, ingresosData] = await Promise.all([
        autosService.listarVehiculos(),
        autosService.listarAutos(),
      ]);

      const currentUserId = Number(user?.id);
      const filteredIngresos = ingresosData.filter((item) => Number(item.usuario_id) === currentUserId);

      setVehiculos(vehiculosData);
      setIngresos(filteredIngresos);
    } catch {
      setError("No se pudieron cargar tus datos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(notificationsStorageKey);
      setSeenNotificationKeys(raw ? JSON.parse(raw) : []);
    } catch {
      setSeenNotificationKeys([]);
    }
  }, [notificationsStorageKey]);

  const notifications = useMemo(() => {
    return ingresos
      .filter((ingreso) => ingreso.estado === "EN_LAVADO" || ingreso.estado === "FINALIZADO")
      .map((ingreso) => {
        const key = `${ingreso.id}:${ingreso.estado}`;
        const isFinalizado = ingreso.estado === "FINALIZADO";
        return {
          key,
          ingresoId: ingreso.id,
          message: isFinalizado
            ? `Tu ingreso #${ingreso.id} (${ingreso.patente}) ya esta listo para retiro.`
            : `Tu ingreso #${ingreso.id} (${ingreso.patente}) paso a lavado.`,
          type: isFinalizado ? "success" : "info",
        };
      })
      .sort((a, b) => b.ingresoId - a.ingresoId);
  }, [ingresos]);

  const unreadCount = useMemo(() => {
    const seen = new Set(seenNotificationKeys);
    return notifications.filter((notification) => !seen.has(notification.key)).length;
  }, [notifications, seenNotificationKeys]);

  const markNotificationsAsSeen = () => {
    const updatedSeen = Array.from(
      new Set([...seenNotificationKeys, ...notifications.map((notification) => notification.key)]),
    );
    setSeenNotificationKeys(updatedSeen);
    localStorage.setItem(notificationsStorageKey, JSON.stringify(updatedSeen));
  };

  const toggleNotifications = () => {
    const nextOpen = !notificationOpen;
    setNotificationOpen(nextOpen);
    if (nextOpen) {
      markNotificationsAsSeen();
    }
  };

  const handleRegisterVehiculo = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await autosService.registrarVehiculo(vehiculoForm);
      setVehiculoForm({ telefono: "", patente: "" });
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.detail || "No se pudo registrar el vehiculo.");
    }
  };

  const handleCrearIngreso = async (e) => {
    e.preventDefault();
    if (!ingresoVehiculoId) return;
    setError("");
    try {
      await autosService.crearIngreso(Number(ingresoVehiculoId));
      setIngresoVehiculoId("");
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.detail || "No se pudo crear el ingreso al lavadero.");
    }
  };

  return (
    <section className="space-y-6 relative">
      <div className="absolute -top-16 right-0 z-30">
        <button
          type="button"
          className="relative p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/85 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          onClick={toggleNotifications}
          aria-label="Abrir notificaciones"
          title="Notificaciones"
        >
          <svg
            className="w-6 h-6 text-cw-darkBlue dark:text-blue-200"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2a2 2 0 0 1-.6 1.4L4 17h5" />
            <path d="M9 17a3 3 0 0 0 6 0" />
          </svg>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        {notificationOpen && (
          <div className="mt-2 w-80 max-w-[85vw] panel-card shadow-lg space-y-2">
            <p className="text-sm font-semibold text-cw-darkBlue dark:text-blue-200">Notificaciones</p>
            {notifications.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400">Todavia no tienes notificaciones.</p>
            )}
            {notifications.map((notification) => (
              <article
                key={notification.key}
                className={`rounded-xl border p-3 ${
                  notification.type === "success"
                    ? "border-emerald-200 bg-emerald-50/80 dark:border-emerald-800 dark:bg-emerald-950/40"
                    : "border-sky-200 bg-sky-50/80 dark:border-sky-800 dark:bg-sky-950/40"
                }`}
              >
                <p className="text-sm text-slate-800 dark:text-slate-100">{notification.message}</p>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <article className="surface-card p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Vehiculos registrados</p>
          <p className="mt-2 text-3xl font-extrabold text-cw-darkBlue">{vehiculos.length}</p>
        </article>
        <article className="surface-card p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Ingresos en lavado</p>
          <p className="mt-2 text-3xl font-extrabold text-cw-darkBlue">
            {ingresos.filter((item) => item.estado === "EN_LAVADO").length}
          </p>
        </article>
        <article className="surface-card p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Ingresos finalizados</p>
          <p className="mt-2 text-3xl font-extrabold text-cw-darkBlue">
            {ingresos.filter((item) => item.estado === "FINALIZADO").length}
          </p>
        </article>
      </div>

      <div className="panel-card">
        <h3 className="font-bold text-lg mb-1 text-cw-darkBlue">Registrar vehiculo</h3>
        <p className="text-sm text-slate-500 mb-4">Carga una sola vez los datos de cada auto que sueles traer.</p>
        <form className="grid md:grid-cols-2 lg:grid-cols-3 gap-3" onSubmit={handleRegisterVehiculo}>
          <input
            className="input-base"
            placeholder="Telefono"
            value={vehiculoForm.telefono}
            onChange={(e) => setVehiculoForm({ ...vehiculoForm, telefono: e.target.value })}
            required
          />
          <input
            className="input-base"
            placeholder="Patente"
            value={vehiculoForm.patente}
            onChange={(e) => setVehiculoForm({ ...vehiculoForm, patente: e.target.value.toUpperCase() })}
            required
          />
          <button className="primary-btn" type="submit">
            Guardar vehiculo
          </button>
        </form>
      </div>

      <div className="panel-card">
        <h3 className="font-bold text-lg mb-1 text-cw-darkBlue">Nuevo ingreso al lavadero</h3>
        <p className="text-sm text-slate-500 mb-4">Cuando traes un auto hoy, crea un nuevo ingreso desde tu lista.</p>
        <form className="grid md:grid-cols-2 lg:grid-cols-3 gap-3" onSubmit={handleCrearIngreso}>
          <select
            className="input-base"
            value={ingresoVehiculoId}
            onChange={(e) => setIngresoVehiculoId(e.target.value)}
            required
          >
            <option value="">Selecciona un vehiculo</option>
            {vehiculos.map((vehiculo) => (
              <option key={vehiculo.id} value={vehiculo.id}>
                {vehiculo.patente} - {vehiculo.telefono}
              </option>
            ))}
          </select>
          <button className="primary-btn" type="submit">
            Crear ingreso
          </button>
        </form>
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-lg text-cw-darkBlue">Mis vehiculos</h3>
        {loading ? (
          <p className="text-slate-500 dark:text-slate-400">Cargando...</p>
        ) : vehiculos.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">Todavia no registraste vehiculos.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {vehiculos.map((vehiculo) => (
              <article key={vehiculo.id} className="panel-card">
                <p className="font-semibold text-cw-darkBlue">Patente: {vehiculo.patente}</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">Telefono: {vehiculo.telefono}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Vehiculo #{vehiculo.id}</p>
              </article>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </section>
  );
}
