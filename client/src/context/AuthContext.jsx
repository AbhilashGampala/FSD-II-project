import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { demoService } from '../services/demoService.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking' | 'connected' | 'disconnected'

  // Proactively verify backend availability
  const checkBackendHealth = useCallback(async () => {
    try {
      const isAlive = await api.checkBackendHealth();
      setBackendStatus(isAlive ? 'connected' : 'disconnected');
      return isAlive;
    } catch (err) {
      setBackendStatus('disconnected');
      return false;
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      // 1. Check for preserved Demo Session first (ensures refresh keeps demo session active)
      try {
        const storedDemo = localStorage.getItem('vit_demo_user');
        if (storedDemo) {
          const parsed = JSON.parse(storedDemo);
          if (parsed && parsed.isDemo) {
            setUser(parsed);
            setLoading(false);
            // Non-blocking health check in background
            checkBackendHealth();
            return;
          }
        }
      } catch (err) {
        console.warn('Error reading demo session from localStorage:', err);
      }

      // 2. Perform backend health check
      const isAlive = await checkBackendHealth();

      if (!isAlive) {
        setUser(null);
        setLoading(false);
        return;
      }

      // 3. Fetch server config if live
      try {
        const configRes = await api.getConfig();
        if (configRes && typeof configRes.demoMode === 'boolean') {
          setDemoMode(configRes.demoMode);
        }
      } catch (err) {
        // Soft fallback
      }

      // 4. Check for active authenticated user session via cookie / token
      try {
        const token = localStorage.getItem('vit_auth_token');
        if (token) {
          const meRes = await api.getMe();
          if (meRes.success && meRes.user) {
            setUser({ ...meRes.user, isDemo: false });
          } else {
            setUser(null);
          }
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
  }, [checkBackendHealth]);

  // Live Authentication Login
  const loginUser = (userData) => {
    localStorage.removeItem('vit_demo_user');
    setUser({ ...userData, isDemo: false });
  };

  // Backend-Independent Demo Mode Activation
  const enterDemoMode = (role = 'student') => {
    const demoUser = demoService.getDemoUser(role);
    // Remove real auth token to prevent accidental live API submission
    localStorage.removeItem('vit_auth_token');
    localStorage.setItem('vit_demo_user', JSON.stringify(demoUser));
    setUser(demoUser);
    return demoUser;
  };

  // Sign out / Exit Demo
  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('vit_demo_user');
      localStorage.removeItem('vit_auth_token');
      demoService.resetStore();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        demoMode,
        backendStatus,
        checkBackendHealth,
        loginUser,
        enterDemoMode,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
