import { useEffect, useState } from "react";

import { authService } from "../services/authService";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = authService.getCurrentSession();
    setUser(session?.user || null);
    setLoading(false);
  }, []);

  const login = async (payload) => {
    const session = await authService.login(payload);
    setUser(session.user);
  };

  const register = async (payload) => {
    await authService.register(payload);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
  };
}
