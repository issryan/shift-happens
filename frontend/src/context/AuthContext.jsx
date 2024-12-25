import React, { createContext, useState, useEffect } from 'react';
import { getAuthenticatedUser, loginUser } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isAuthenticated: false, user: null });
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getAuthenticatedUser();
        setAuth({ isAuthenticated: true, user });
      } catch (err) {
        console.error('Authentication check failed:', err.message);
        localStorage.removeItem('token');
      } finally {
        setLoading(false); // Set loading to false when auth check completes
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { token, user } = await loginUser({ email, password });
      localStorage.setItem('token', token);
      setAuth({ isAuthenticated: true, user });
    } catch (err) {
      console.error('Login failed:', err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({ isAuthenticated: false, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};