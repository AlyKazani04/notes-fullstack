import { useState, useEffect } from "react";
import type { User, UserResponse } from "../types";
import { auth } from '../api/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const res = await auth.login(email, password);
    setUser(res.user);

    const authChannel = new BroadcastChannel('auth');
    authChannel.postMessage({ type: 'login' });
    authChannel.close();

    return res;
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await auth.register(name, email, password);
    setUser(res.user); // cookie is set, so we treat as logged in

    const authChannel = new BroadcastChannel('auth');
    authChannel.postMessage({ type: 'login' });
    authChannel.close();

    return res;
  };

  const logout = async () => {
    await auth.logout();
    setUser(null);

    const authChannel = new BroadcastChannel('auth');
    authChannel.postMessage({ type: 'logout' });
    authChannel.close();
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

  useEffect(() => {
    const authChannel = new BroadcastChannel('auth');

    authChannel.onmessage = (event) => {
      const {type} = event.data;

      if (type === 'login' || type === 'logout') {
        window.location.reload();
      }
    }

    const handleFocus = async () => {
      try {
        const res: UserResponse = await auth.getMe();
        if (res.user) {
          const currentSessionUser = res.user;
          if (user && currentSessionUser.id !== user.id) {
            window.location.reload();
          }
        }
      } catch (err) {
        console.error('Failed to validate session on focus', err);
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      authChannel.close();
      window.removeEventListener('focus', handleFocus);
    }
  }, [user]);

  return { user, loading, login, register, logout, getMe };
}
