import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('studysphere_token'));

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('studysphere_token');
      const savedUser = localStorage.getItem('studysphere_user');
      
      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          // Verify token is still valid
          const res = await authAPI.getMe();
          setUser(res.data.user);
          localStorage.setItem('studysphere_user', JSON.stringify(res.data.user));
        } catch {
          localStorage.removeItem('studysphere_token');
          localStorage.removeItem('studysphere_user');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, user } = res.data;
    localStorage.setItem('studysphere_token', token);
    localStorage.setItem('studysphere_user', JSON.stringify(user));
    setToken(token);
    setUser(user);
    return user;
  };

  const register = async (data) => {
    const res = await authAPI.register(data);
    const { token, user } = res.data;
    localStorage.setItem('studysphere_token', token);
    localStorage.setItem('studysphere_user', JSON.stringify(user));
    setToken(token);
    setUser(user);
    return user;
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch {}
    localStorage.removeItem('studysphere_token');
    localStorage.removeItem('studysphere_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
