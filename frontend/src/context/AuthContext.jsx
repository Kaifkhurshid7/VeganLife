import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function apiRequest(url, options = {}) {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('veganlife-token'));
  const [loading, setLoading] = useState(true);

  const setAuth = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
    if (token) localStorage.setItem('veganlife-token', token);
    else localStorage.removeItem('veganlife-token');
  };

  const refreshAccessToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('veganlife-refresh');
      const data = await apiRequest('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
      setAccessToken(data.accessToken);
      localStorage.setItem('veganlife-token', data.accessToken);
      return data.accessToken;
    } catch {
      setAuth(null, null);
      localStorage.removeItem('veganlife-refresh');
      return null;
    }
  }, []);

  const fetchUser = useCallback(async () => {
    if (!accessToken) { setLoading(false); return; }
    try {
      const data = await apiRequest('/auth/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser(data.user);
    } catch (err) {
      if (err.message === 'Token expired') {
        const newToken = await refreshAccessToken();
        if (newToken) {
          try {
            const data = await apiRequest('/auth/me', {
              headers: { Authorization: `Bearer ${newToken}` },
            });
            setUser(data.user);
          } catch { setAuth(null, null); }
        }
      } else {
        setAuth(null, null);
      }
    } finally {
      setLoading(false);
    }
  }, [accessToken, refreshAccessToken]);

  useEffect(() => { fetchUser(); }, []);

  async function login(email, password) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setAuth(data.accessToken, data.user);
    return data;
  }

  async function signup(name, username, email, password) {
    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, username, email, password }),
    });
    setAuth(data.accessToken, data.user);
    return data;
  }

  async function adminLogin(email, password, secretKey) {
    const data = await apiRequest('/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify({ email, password, secretKey }),
    });
    setAuth(data.accessToken, data.user);
    return data;
  }

  async function updateProfile(updates) {
    const data = await apiRequest('/auth/profile', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(updates),
    });
    setUser(data.user);
    return data;
  }

  async function changePassword(currentPassword, newPassword) {
    return apiRequest('/auth/change-password', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  function logout() {
    apiRequest('/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    }).catch(() => {});
    setAuth(null, null);
    localStorage.removeItem('veganlife-refresh');
  }

  async function deleteAccount() {
    await apiRequest('/auth/account', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setAuth(null, null);
  }

  const authFetch = useCallback(async (url, options = {}) => {
    return apiRequest(url, {
      ...options,
      headers: { Authorization: `Bearer ${accessToken}`, ...options.headers },
    });
  }, [accessToken]);

  return (
    <AuthContext.Provider value={{
      user, accessToken, loading,
      login, signup, adminLogin, logout,
      updateProfile, changePassword, deleteAccount,
      authFetch,
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
