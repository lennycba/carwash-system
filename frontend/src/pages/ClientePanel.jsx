import { useEffect, useState } from "react";

import SimpleTable from "../components/SimpleTable";
import StatusBadge from "../components/StatusBadge";
import { autosService } from "../services/autosService";

function getFullName(user) {
  const full = `${user?.nombre || ""} ${user?.apellido || ""}`.trim();
  return full || user?.nombre || "";
}

export default function ClientePanel({ user }) {
  const fullName = getFullName(user);
  const [form, setForm] = useState({
    cliente: fullName,
    telefono: "",
    patente: "",
  });
  const [autos, setAutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadAutos = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await autosService.listarAutos();
      setAutos(data.filter((item) => item.cliente.toLowerCase() === fullName.toLowerCase()));
    } catch (err) {
      setError("No se pudieron cargar los autos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAutos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await autosService.crearAuto(form);
      setForm({ ...form, telefono: "", patente: "" });
      loadAutos();
    } catch (err) {
      setError("Error al registrar vehiculo. Verifica datos o patente duplicada.");
    }
  };

  return (
    <section className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <article className="surface-card p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Autos registrados</p>
          <p className="mt-2 text-3xl font-extrabold text-cw-darkBlue">{autos.length}</p>
        </article>
        <article className="surface-card p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">En lavado</p>
          <p className="mt-2 text-3xl font-extrabold text-cw-darkBlue">
            {autos.filter((item) => item.estado === "EN_LAVADO").length}
          </p>
        </article>
        <article className="surface-card p-4">
          <p className="text-xs uppercase tracking-wider text-slate-500">Finalizados</p>
          <p className="mt-2 text-3xl font-extrabold text-cw-darkBlue">
            {autos.filter((item) => item.estado === "FINALIZADO").length}
          </p>
        </article>
      </div>

      <div className="panel-card">
        <h3 className="font-bold text-lg mb-1 text-cw-darkBlue">Registrar vehiculo</h3>
        <p className="text-sm text-slate-500 mb-4">Carga los datos para ingresar un nuevo auto al sistema.</p>
        <form className="grid md:grid-cols-2 lg:grid-cols-4 gap-3" onSubmit={handleSubmit}>
          <input
            className="input-base"
            placeholder="Nombre cliente"
            value={form.cliente}
            onChange={(e) => setForm({ ...form, cliente: e.target.value })}
            required
          />
          <input
            className="input-base"
            placeholder="Telefono"
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
            required
          />
          <input
            className="input-base"
            placeholder="Patente"
            value={form.patente}
            onChange={(e) => setForm({ ...form, patente: e.target.value.toUpperCase() })}
            required
          />
          <button className="primary-btn" type="submit">
            Registrar auto
          </button>
        </form>
        {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
      </div>

      <div className="space-y-3">
        <h3 className="font-bold text-lg text-cw-darkBlue">Estado de mis autos</h3>
        {loading ? (
          <p className="text-slate-500">Cargando...</p>
        ) : (
          <SimpleTable
            headers={["ID", "Cliente", "Patente", "Estado"]}
            rows={autos.map((auto) => [
              auto.id,
              auto.cliente,
              auto.patente,
              <StatusBadge key={auto.id} status={auto.estado} />,
            ])}
            emptyMessage="Todavia no registraste autos."
          />
        )}
      </div>
    </section>
  );
}
