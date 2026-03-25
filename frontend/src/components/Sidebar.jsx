import { Link, useLocation } from "react-router-dom";

const navByRole = {
  CLIENTE: [{ to: "/dashboard", label: "Mi Vehiculo", hint: "Seguimiento en tiempo real" }],
  EMPLEADO: [{ to: "/dashboard", label: "Autos en Servicio", hint: "Operacion diaria" }],
  ADMIN: [{ to: "/dashboard", label: "Gestion de Usuarios", hint: "Control de permisos" }],
};

export default function Sidebar({ role, onLogout }) {
  const location = useLocation();
  const links = navByRole[role] || [];

  return (
    <aside className="w-full md:w-[300px] bg-gradient-to-b from-cw-darkBlue to-[#163151] text-white md:min-h-screen p-6 md:p-7 relative overflow-hidden">
      <div className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-cw-skyBlue/20 blur-2xl" />
      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

      <div className="relative z-10">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-100/80">Car Wash</p>
          <h1 className="text-2xl font-extrabold mt-2">Operations Hub</h1>
          <p className="text-blue-100/80 mt-2 text-sm leading-6">
            Plataforma operativa para gestionar recepcion, lavado y entrega.
          </p>
        </div>

        <nav className="space-y-3">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`block rounded-2xl px-4 py-3 transition border ${
                active
                  ? "bg-cw-skyBlue text-white border-cw-skyBlue shadow-lg shadow-cw-skyBlue/25"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
            >
              <p className="font-semibold">{link.label}</p>
              <p className="text-xs text-blue-100/85 mt-1">{link.hint}</p>
            </Link>
          );
        })}
        </nav>

        <button
          onClick={onLogout}
          className="mt-10 w-full rounded-2xl border border-white/30 py-2.5 font-semibold hover:bg-white/10 transition"
        >
          Cerrar sesion
        </button>
      </div>
    </aside>
  );
}
