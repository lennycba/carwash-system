const map = {
  RECIBIDO: {
    text: "RECIBIDO",
    dot: "bg-amber-400",
    className: "bg-amber-50 text-amber-800 border border-amber-200",
  },
  EN_LAVADO: {
    text: "EN_LAVADO",
    dot: "bg-blue-500",
    className: "bg-blue-50 text-blue-800 border border-blue-200",
  },
  FINALIZADO: {
    text: "FINALIZADO",
    dot: "bg-emerald-500",
    className: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  },
};

export default function StatusBadge({ status }) {
  const style = map[status] || {
    text: status,
    dot: "bg-slate-400",
    className: "bg-slate-100 text-slate-800 border border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide ${style.className}`}
    >
      <span className={`h-2 w-2 rounded-full ${style.dot}`} />
      {style.text}
    </span>
  );
}
