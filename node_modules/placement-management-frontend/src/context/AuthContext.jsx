import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { readStoredUser } from '../utils/authSync';
import { setupSessionRefresh } from '../utils/sessionRefresh';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => readStoredUser());

  const syncFromStorage = useCallback(() => {
    const stored = readStoredUser();
    setUser((current) => {
      if (JSON.stringify(current) === JSON.stringify(stored)) return current;
      return stored;
    });
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'user' || e.key === null) syncFromStorage();
    };
    const onAuthSync = () => syncFromStorage();

    window.addEventListener('storage', onStorage);
    window.addEventListener('auth-sync', onAuthSync);
    window.addEventListener('focus', onAuthSync);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('auth-sync', onAuthSync);
      window.removeEventListener('focus', onAuthSync);
    };
  }, [syncFromStorage]);

  useEffect(() => {
    if (!user?.token) return undefined;
    return setupSessionRefresh({ onLogout: () => setUser(null) });
  }, [user?.token]);

  const login = (userData) => setUser(userData);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // still clear local session
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
