import { Navigate, Route, Routes } from "react-router-dom";

import { useAuth } from "./hooks/useAuth";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { user, loading, login, register, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-cw-darkBlue">
        Cargando sesion...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={login} />}
      />
      <Route
        path="/register"
        element={
          user ? <Navigate to="/dashboard" replace /> : <RegisterPage onRegister={register} />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user}>
            <DashboardPage user={user} onLogout={logout} />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}
