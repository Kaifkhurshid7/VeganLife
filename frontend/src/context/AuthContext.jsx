import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_URL } from '../utils/api';

const AuthContext = createContext(null);

// Tokens live in httpOnly cookies — never in localStorage or JS memory, so an
// XSS payload can't steal a session. Requests just carry credentials.
async function apiRequest(url, options = {}) {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    err.code = data.code;
    throw err;
  }
  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rotate the tokens via the refresh cookie; used on boot and on socket reconnect.
  const refreshSession = useCallback(async () => {
    return apiRequest('/auth/refresh', { method: 'POST' });
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const data = await apiRequest('/auth/me');
      setUser(data.user);
    } catch (err) {
      if (err.status === 401) {
        // Access token missing/expired — try one silent refresh before giving up
        try {
          await refreshSession();
          const data = await apiRequest('/auth/me');
          setUser(data.user);
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, [refreshSession]);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  async function login(email, password) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(data.user);
    return data;
  }

  async function signup(name, username, email, password) {
    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, username, email, password }),
    });
    setUser(data.user);
    return data;
  }

  async function adminLogin(email, password, secretKey) {
    const data = await apiRequest('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password, secretKey }),
    });
    setUser(data.user);
    return data;
  }

  async function updateProfile(updates) {
    const data = await apiRequest('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    setUser(data.user);
    return data;
  }

  async function changePassword(currentPassword, newPassword) {
    return apiRequest('/auth/change-password', {
      method: 'PATCH',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  function logout() {
    apiRequest('/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
  }

  async function deleteAccount() {
    await apiRequest('/auth/account', { method: 'DELETE' });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      adminLogin,
      logout,
      updateProfile,
      changePassword,
      deleteAccount,
      refreshSession,
      isAdmin: user?.role === 'admin',
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
