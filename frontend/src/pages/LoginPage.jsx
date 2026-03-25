import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import ThemeSwitch from "../components/ThemeSwitch";
import { publicStatsService } from "../services/publicStatsService";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    ingresos_hoy: null,
    autos_activos: null,
    autos_entregados_hoy: null,
    tiempo_promedio_minutos: null,
    productividad_porcentaje: null,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await publicStatsService.getLoginStats();
        setStats({
          ingresos_hoy: data.ingresos_hoy,
          autos_activos: data.autos_activos,
          autos_entregados_hoy: data.autos_entregados_hoy,
          tiempo_promedio_minutos: data.tiempo_promedio_minutos,
          productividad_porcentaje: data.productividad_porcentaje,
        });
      } catch {
        // El backend todavia esta en desarrollo. Mostramos placeholders.
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  const productividad = Number(stats.productividad_porcentaje ?? 0);
  const productividadWidth = Math.min(Math.max(productividad, 0), 100);
  const showValue = (value, suffix = "") => {
    if (statsLoading) return "...";
    if (value === null || value === undefined) return "--";
    return `${value}${suffix}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onLogin({ email: form.email, password: form.password });
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.detail || "No se pudo iniciar sesion.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4 md:p-6">
      <div className="fixed top-4 right-4 z-20">
        <ThemeSwitch />
      </div>
      <div className="w-full max-w-5xl grid lg:grid-cols-2 surface-card overflow-hidden">
        <section className="bg-gradient-to-br from-cw-darkBlue to-[#163151] text-white p-8 md:p-10 relative">
          <div className="absolute top-0 right-0 h-52 w-52 rounded-full bg-cw-skyBlue/25 blur-3xl" />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.22em] text-blue-100/80">Car Wash Management</p>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-4 leading-tight">
              Control operativo
              <br />
              en una sola vista
            </h1>
            <p className="text-blue-100/90 mt-5 leading-7 max-w-md">
              Supervisa estados, registra vehiculos y coordina al equipo con una interfaz limpia y profesional.
            </p>
            <div className="mt-9 space-y-4">
              <div className="rounded-2xl bg-white/10 border border-white/20 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.14em] text-blue-100/80">Resumen diario</p>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-[11px] text-blue-100/80">Ingresos</p>
                    <p className="text-xl font-extrabold">{showValue(stats.ingresos_hoy)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-blue-100/80">Activos</p>
                    <p className="text-xl font-extrabold">{showValue(stats.autos_activos)}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-blue-100/80">Entregados</p>
                    <p className="text-xl font-extrabold">{showValue(stats.autos_entregados_hoy)}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/20 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.14em] text-blue-100/80">Indicadores clave</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100/90">Tiempo promedio por auto</span>
                    <span className="font-bold">{showValue(stats.tiempo_promedio_minutos, " min")}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-100/90">Productividad equipo</span>
                    <span className="font-bold">{showValue(stats.productividad_porcentaje, "%")}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/20 overflow-hidden mt-2">
                    <div className="h-full bg-cw-skyBlue transition-all duration-500" style={{ width: `${productividadWidth}%` }} />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 border border-white/20 p-4 backdrop-blur-sm">
                <p className="text-sm font-semibold">Gestion centralizada y trazabilidad completa.</p>
                <p className="text-xs text-blue-100/85 mt-1">
                  Flujo operativo pensado para equipos de lavadero con foco en velocidad y orden.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-cw-white/90 dark:bg-slate-900/75 rounded-none p-8 md:p-10">
          <h2 className="text-3xl font-extrabold text-cw-darkBlue dark:text-blue-300">Iniciar sesion</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 mb-7">Ingresa con tus credenciales para continuar</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1.5 font-semibold text-slate-700 dark:text-slate-300">Email</label>
              <input
                className="input-base"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1.5 font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <input
                className="input-base"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button className="primary-btn w-full mt-2 disabled:opacity-60" type="submit" disabled={submitting}>
              Entrar al dashboard
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>

          <p className="text-sm text-slate-600 dark:text-slate-400 mt-5">
            No tienes cuenta?{" "}
            <Link to="/register" className="text-cw-skyBlue font-bold hover:underline">
              Registrate
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
