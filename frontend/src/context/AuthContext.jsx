import React, { createContext, useState, useEffect } from 'react';
import { getAuthenticatedUser, loginUser } from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ isAuthenticated: false, user: null });

  // Check for authenticated user on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await getAuthenticatedUser();
        setAuth({ isAuthenticated: true, user });
      } catch (err) {
        console.error('Authentication check failed:', err.message);
        localStorage.removeItem('token');
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const { token, user } = await loginUser({ email, password });
      localStorage.setItem('token', token); // Save token to local storage
      setAuth({ isAuthenticated: true, user }); // Update context state
    } catch (err) {
      console.error('Login failed:', err.message);
      throw err; // Re-throw error to be handled in the login page
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token'); // Clear token from local storage
    setAuth({ isAuthenticated: false, user: null }); // Reset context state
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};