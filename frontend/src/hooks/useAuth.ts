import { useState, useEffect } from "react";
import type { User } from "../types";
import { auth } from '../api/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const res = await auth.login(email, password);
    setUser(res.user);
    return res;
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await auth.register(name, email, password);
    setUser(res.user); // cookie is set, so we treat as logged in
    return res;
  };

  const logout = async () => {
    await auth.logout();
    setUser(null);
  };

  const getMe = async () => {
    try {
      const res = await auth.getMe();
      setUser(res.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return { user, loading, login, register, logout, getMe };
}
