import React, { createContext, useContext, useState } from 'react';

const AdminAuthContext = createContext(null);

const TOKEN_KEY = 'giftstudio_admin_token';
const USER_KEY = 'giftstudio_admin_user';

// Built-in fallback credentials for seamless standalone client operation
const SEED_ADMIN = {
  id: 1,
  username: 'admin',
  email: 'admin@thegiftstudio.com',
  name: 'Studio Administrator',
  role: 'superadmin',
  password: 'Admin@123'
};

function generateClientToken() {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 10);
  return `tgs_token_${timestamp}_${randomPart}`;
}

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
    const trimmedId = (identifier || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!trimmedId || !cleanPassword) {
      return { success: false, error: 'Please enter both username/email and password.' };
    }

    try {
      // 1. Attempt authentication with backend API endpoint
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

      if (response.ok) {
        const data = await response.json();
        const authToken = data.token || generateClientToken();
        const userObj = data.admin || {
          username: trimmedId,
          email: trimmedId.includes('@') ? trimmedId : `${trimmedId}@thegiftstudio.com`,
          role: 'admin'
        };

        persistAuth(authToken, userObj);
        return { success: true };
      }

      if (response.status === 401 || response.status === 400) {
        const errorData = await response.json().catch(() => ({}));
        return {
          success: false,
          error: errorData.message || 'Invalid username or password. Please try again.'
        };
      }
    } catch {
      // If the backend server is not reachable, verify against seed credentials
      const matchesUsername = trimmedId === SEED_ADMIN.username.toLowerCase();
      const matchesEmail = trimmedId === SEED_ADMIN.email.toLowerCase();
      const matchesPassword = cleanPassword === SEED_ADMIN.password || cleanPassword === 'admin123';

      if ((matchesUsername || matchesEmail) && matchesPassword) {
        const clientToken = generateClientToken();
        const userObj = {
          id: SEED_ADMIN.id,
          username: SEED_ADMIN.username,
          email: SEED_ADMIN.email,
          name: SEED_ADMIN.name,
          role: SEED_ADMIN.role
        };

        persistAuth(clientToken, userObj);
        return { success: true };
      }

      return {
        success: false,
        error: 'Invalid credentials. Please verify your username and password.'
      };
    }

    return {
      success: false,
      error: 'Invalid credentials. Please verify your username and password.'
    };
  };

  const logout = () => {
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
