import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch, refreshAccessToken } from '../utils/api';

const AuthContext = createContext(null);

// Tokens live in httpOnly cookies — never in localStorage or JS memory, so an
// XSS payload can't steal a session. Requests just carry credentials; apiFetch
// silently rotates an expired access cookie and retries once on 401.
async function apiRequest(url, options = {}) {
  const res = await apiFetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    err.code = data.code;
    err.fieldErrors = data.errors; // [{ field, message }] from express-validator
    throw err;
  }
  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rotate the tokens via the refresh cookie; used on boot and on socket reconnect.
  const refreshSession = useCallback(() => {
    return refreshAccessToken();
  }, []);

  // apiRequest already refreshes an expired access cookie and retries, so on
  // boot this either succeeds or the session is genuinely gone — no manual retry.
  const fetchUser = useCallback(async () => {
    try {
      const data = await apiRequest('/auth/me');
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

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

  // Avatar upload uses FormData — the browser sets the multipart boundary, so we
  // must NOT send a JSON Content-Type header. Goes through apiFetch so an expired
  // access cookie is refreshed and the upload retried like any other request.
  async function uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await apiFetch('/auth/avatar', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data.message || 'Upload failed');
      err.status = res.status;
      throw err;
    }

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
      uploadAvatar,
      changePassword,
      deleteAccount,
      refreshSession,
      refreshUser: fetchUser,
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
