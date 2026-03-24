import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import ThemeSwitch from "../components/ThemeSwitch";

export default function RegisterPage({ onRegister }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onRegister({
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (err) {
      setError(err?.response?.data?.detail || "No se pudo registrar el usuario.");
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
          <div className="absolute top-10 -left-10 h-44 w-44 rounded-full bg-cw-skyBlue/30 blur-3xl" />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.22em] text-blue-100/80">Cliente nuevo</p>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-4 leading-tight">
              Crea tu cuenta
              <br />
              y agenda tu servicio
            </h1>
            <p className="text-blue-100/90 mt-5 leading-7 max-w-md">
              Si es tu primera vez en el lavadero, registrate para seguir el estado de tu auto y recibir
              notificaciones cuando este listo.
            </p>
          </div>
        </section>

        <section className="bg-cw-white/90 dark:bg-slate-900/75 rounded-none p-8 md:p-10">
          <h2 className="text-3xl font-extrabold text-cw-darkBlue dark:text-blue-300">Registro</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 mb-7">
            Crea usuarios reales. Los roles deben gestionarse desde administracion.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1.5 font-semibold text-slate-700 dark:text-slate-300">Nombre</label>
              <input
                className="input-base"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1.5 font-semibold text-slate-700 dark:text-slate-300">Apellido</label>
              <input
                className="input-base"
                value={form.apellido}
                onChange={(e) => setForm({ ...form, apellido: e.target.value })}
                required
              />
            </div>
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
              Crear cuenta
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </form>

          <p className="text-sm text-slate-600 dark:text-slate-400 mt-5">
            Ya tienes cuenta?{" "}
            <Link to="/login" className="text-cw-skyBlue font-bold hover:underline">
              Iniciar sesion
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
