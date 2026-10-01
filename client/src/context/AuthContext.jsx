import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function readUser() {
  try { return JSON.parse(localStorage.getItem('taskhub_user')) || null; } catch { return null; }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);

  const login = (payload) => {
    localStorage.setItem('taskhub_token', payload.token);
    localStorage.setItem('taskhub_user', JSON.stringify(payload.user));
    setUser(payload.user);
  };

  const logout = () => {
    localStorage.removeItem('taskhub_token');
    localStorage.removeItem('taskhub_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
