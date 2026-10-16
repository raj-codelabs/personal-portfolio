import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AdminUser } from '../types/cms';
import { api } from '../services/api';

interface AdminAuthContextType {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  needsSetup: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setupFirstAdmin: (email: string, password: string) => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [needsSetup, setNeedsSetup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check setup status first
      const setup = await api.getSetupStatus();
      setNeedsSetup(setup.needsSetup);

      if (!setup.needsSetup) {
        // Try to fetch current session
        try {
          const me = await api.getMe();
          if (me.authenticated && me.admin) {
            setAdmin(me.admin);
          } else {
            setAdmin(null);
          }
        } catch {
          setAdmin(null);
        }
      } else {
        setAdmin(null);
      }
    } catch (err: any) {
      console.warn('Auth status check error:', err);
      setError(err?.message || 'Failed to verify authentication status.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(email, password);
      setAdmin(res.admin);
      setNeedsSetup(false);
    } catch (err: any) {
      setError(err?.message || 'Login failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setupFirstAdmin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.setupFirstAdmin(email, password);
      setAdmin(res.admin);
      setNeedsSetup(false);
    } catch (err: any) {
      setError(err?.message || 'Initial administrator setup failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.logout();
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      setAdmin(null);
      setLoading(false);
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isAuthenticated: !!admin,
        needsSetup,
        loading,
        error,
        login,
        logout,
        setupFirstAdmin,
        refreshAuth: checkAuth,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = (): AdminAuthContextType => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
