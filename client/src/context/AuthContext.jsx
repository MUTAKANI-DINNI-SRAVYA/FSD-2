import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('vyra_user') || localStorage.getItem('remarket_user');
    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('vyra_token') || localStorage.getItem('remarket_token') || null);
  const [loading, setLoading] = useState(true);

  // Verify token on initial mount
  useEffect(() => {
    async function verifyUser() {
      const storedToken = localStorage.getItem('vyra_token') || localStorage.getItem('remarket_token');
      if (storedToken) {
        try {
          const res = await api.auth.getMe(storedToken);
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('vyra_user', JSON.stringify(res.user));
          } else {
            // Token invalid or expired
            logout();
          }
        } catch {
          // If offline, keep local user state
        }
      }
      setLoading(false);
    }

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.auth.login(email, password);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('vyra_token', res.token);
      localStorage.setItem('vyra_user', JSON.stringify(res.user));
      return { success: true };
    }
    return { success: false, error: res.message || 'Login failed' };
  };

  const register = async (userData) => {
    const res = await api.auth.register(userData);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('vyra_token', res.token);
      localStorage.setItem('vyra_user', JSON.stringify(res.user));
      return { success: true };
    }
    return { success: false, error: res.message || 'Registration failed' };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('vyra_token');
    localStorage.removeItem('vyra_user');
    localStorage.removeItem('remarket_token');
    localStorage.removeItem('remarket_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
