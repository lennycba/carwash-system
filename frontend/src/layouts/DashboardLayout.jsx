import Sidebar from "../components/Sidebar";
import ThemeSwitch from "../components/ThemeSwitch";

function getFullName(user) {
  const full = `${user?.nombre || ""} ${user?.apellido || ""}`.trim();
  return full || user?.nombre || user?.email || "Usuario";
}

export default function DashboardLayout({ user, onLogout, children }) {
  return (
    <div className="min-h-screen md:flex relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-cw-skyBlue/10 blur-3xl" />
        <div className="absolute bottom-0 left-40 h-60 w-60 rounded-full bg-cw-darkBlue/10 blur-3xl" />
      </div>
      <Sidebar role={user.rol} onLogout={onLogout} />
      <main className="flex-1 p-5 md:p-8 relative z-10">
        <header className="mb-7 surface-card p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Dashboard</p>
            <ThemeSwitch />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold mt-2 title-gradient">Panel {user.rol}</h2>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Bienvenido, <span className="font-semibold text-cw-darkBlue">{getFullName(user)}</span> ({user.email})
          </p>
        </header>
        {children}
      </main>
    </div>
  );
}
