import { useTheme } from "../hooks/useTheme";

export default function ThemeSwitch() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 h-9 w-9 text-slate-700 dark:text-slate-200 transition hover:shadow-md"
      aria-label="Cambiar tema"
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      <span className="text-base" aria-hidden="true">{isDark ? "☀" : "☾"}</span>
      <span className="sr-only">{isDark ? "Modo claro" : "Modo oscuro"}</span>
    </button>
  );
}
