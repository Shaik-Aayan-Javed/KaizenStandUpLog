import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, updateUser as apiUpdateUser } from '../api/users';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState(() => {
    const saved = window.sessionStorage.getItem('kaizen_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authMode, setAuthMode] = useState('login');
  const isAuthenticated = !!authUser;

  useEffect(() => {
    if (authUser) {
      window.sessionStorage.setItem('kaizen_auth_user', JSON.stringify(authUser));
    } else {
      window.sessionStorage.removeItem('kaizen_auth_user');
    }
  }, [authUser]);

  const handleLogin = async ({ email, password }) => {
    try {
      const data = await apiLogin(email, password);
      setAuthUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Could not connect to server.' };
    }
  };

  const handleRegister = async ({ fullName, email, password }) => {
    try {
      const data = await apiRegister(fullName, email, password);
      setAuthUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Could not connect to server.' };
    }
  };

  const handleLogout = () => {
    setAuthUser(null);
  };

  const updateAuthUser = async (id, data) => {
    try {
      const res = await apiUpdateUser(id, data);
      setAuthUser(res.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || 'Could not update profile.' };
    }
  };

  return (
    <AuthContext.Provider value={{ authUser, isAuthenticated, authMode, setAuthMode, handleLogin, handleRegister, handleLogout, updateAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
