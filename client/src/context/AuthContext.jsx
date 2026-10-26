import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(true);

  // Initialize auth and system config
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Fetch server config (demo mode)
        const configRes = await api.getConfig();
        if (configRes && typeof configRes.demoMode === 'boolean') {
          setDemoMode(configRes.demoMode);
        }
      } catch (err) {
        console.warn('Could not load auth config, assuming demoMode = true');
      }

      try {
        // Check current session cookie via /auth/me
        const meRes = await api.getMe();
        if (meRes.success && meRes.user) {
          setUser(meRes.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        demoMode,
        loginUser,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
