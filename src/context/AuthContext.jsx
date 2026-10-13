import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    let active = true;
    api.get('/auth/me')
      .then((response) => {
        if (active) setAdmin(response.data.data);
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const login = async (email, password, remember = false) => {
    const response = await api.post('/auth/login', { email, password, remember });
    const { admin: adminData, token } = response.data.data;
    
    localStorage.setItem('token', token);
    setAdmin(adminData);
    
    return response.data;
  };

  const logout = () => {
    api.post('/auth/logout').catch(() => undefined);
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
