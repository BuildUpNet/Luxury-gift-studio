import React, { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext(null);

const TOKEN_KEY = 'giftstudio_admin_token';
const USER_KEY = 'giftstudio_admin_user';

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY) || null;
    } catch {
      return null;
    }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading] = useState(false);

  const persistAuth = (newToken, newUser) => {
    try {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USER_KEY, JSON.stringify(newUser));
      document.cookie = `giftstudio_admin_token=${newToken}; path=/; max-age=86400; SameSite=Lax`;
    } catch {}

    setToken(newToken);
    setAdminUser(newUser);
  };

  const login = async (identifier, password) => {
    const trimmedId = (identifier || '').trim();
    const cleanPassword = (password || '').trim();

    if (!trimmedId || !cleanPassword) {
      return { success: false, error: 'Please enter both username/email and password.' };
    }

    try {
      // Connect to real backend login endpoint
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: trimmedId,
          password: cleanPassword
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success && data.token) {
        persistAuth(data.token, data.admin);
        return { success: true };
      }

      return {
        success: false,
        error: data.message || 'Invalid username or password. Please verify credentials.'
      };
    } catch {
      return {
        success: false,
        error: 'Unable to connect to authentication server. Please verify backend is running on port 5000.'
      };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
    } catch {}

    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      document.cookie = 'giftstudio_admin_token=; path=/; max-age=0; SameSite=Lax';
    } catch {}

    setToken(null);
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        token,
        adminUser,
        isAuthenticated: Boolean(token),
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
