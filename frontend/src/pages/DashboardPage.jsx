import DashboardLayout from "../layouts/DashboardLayout";
import AdminPanel from "./AdminPanel";
import ClientePanel from "./ClientePanel";
import EmpleadoPanel from "./EmpleadoPanel";

function RoleContent({ role, user }) {
  if (role === "ADMIN") return <AdminPanel />;
  if (role === "EMPLEADO") return <EmpleadoPanel />;
  return <ClientePanel user={user} />;
}

export default function DashboardPage({ user, onLogout }) {
  return (
    <DashboardLayout user={user} onLogout={onLogout}>
      <RoleContent role={user.rol} user={user} />
    </DashboardLayout>
  );
}

