export default function SimpleTable({ headers, rows, emptyMessage = "Sin datos" }) {
  return (
    <div className="overflow-x-auto panel-card">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/70">
            {headers.map((header) => (
              <th key={header} className="py-3.5 px-3 text-xs uppercase tracking-wider text-slate-500 font-bold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={headers.length} className="py-10 px-3 text-slate-500 text-center">
                {emptyMessage}
              </td>
            </tr>
          )}
          {rows.map((row, index) => (
            <tr
              key={index}
              className="border-b border-slate-100 dark:border-slate-800 last:border-none hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition"
            >
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-3.5 px-3 text-sm text-slate-700">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
