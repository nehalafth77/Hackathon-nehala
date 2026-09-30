import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_USER, MOCK_TEACHER } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('studyvault_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_USER;
      }
    }
    return MOCK_USER; // Default directly to logged-in student Arjun Sharma for instant product experience
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('studyvault_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('studyvault_user');
    }
  }, [user]);

  const loginAs = (role = 'student') => {
    const selectedUser = role === 'teacher' ? MOCK_TEACHER : MOCK_USER;
    setUser(selectedUser);
    return selectedUser;
  };

  const loginWithCredentials = (email, password) => {
    if (email.toLowerCase().includes('teacher') || email.toLowerCase().includes('prof')) {
      return loginAs('teacher');
    }
    const studentUser = {
      ...MOCK_USER,
      email: email || MOCK_USER.email,
    };
    setUser(studentUser);
    return studentUser;
  };

  const switchRole = () => {
    setUser(prev => {
      const next = prev?.role === 'teacher' ? MOCK_USER : MOCK_TEACHER;
      return next;
    });
  };

  const updateUser = (fields) => {
    setUser(prev => ({
      ...prev,
      ...fields,
      avatarInitials: fields.name
        ? fields.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : prev.avatarInitials,
    }));
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginAs,
        loginWithCredentials,
        switchRole,
        updateUser,
        logout,
        isAuthenticated: !!user,
        isTeacher: user?.role === 'teacher',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
