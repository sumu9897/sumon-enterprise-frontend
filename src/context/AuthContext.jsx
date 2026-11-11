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
    const hasSessionHint = localStorage.getItem('adminSession') === '1' || sessionStorage.getItem('token');
    if (!hasSessionHint) {
      setLoading(false);
      return;
    }

    let active = true;
    api.get('/auth/me')
      .then((response) => {
        if (response.data.meta?.csrfToken) sessionStorage.setItem('csrfToken', response.data.meta.csrfToken);
        if (active) setAdmin(response.data.data);
      })
      .catch(() => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('csrfToken');
        localStorage.removeItem('adminSession');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, []);

  const login = async (email, password, remember = false) => {
    const response = await api.post('/auth/login', { email, password, remember });
    const { admin: adminData, token, csrfToken } = response.data.data;
    
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('csrfToken', csrfToken);
    localStorage.setItem('adminSession', '1');
    setAdmin(adminData);
    
    return response.data;
  };

  const logout = async () => {
    try { await api.post('/auth/logout'); } catch { /* Clear the local session even if the API is unavailable. */ }
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('csrfToken');
    localStorage.removeItem('adminSession');
    setAdmin(null);
  };

  const can = (permission) => (
    admin?.role === 'superadmin' || admin?.permissions?.includes('*') || admin?.permissions?.includes(permission)
  );

  const value = {
    admin,
    loading,
    login,
    logout,
    isAuthenticated: !!admin,
    can,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
