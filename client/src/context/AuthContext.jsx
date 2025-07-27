import { createContext, useState, useContext } from 'react';
import apiClient from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    const { token } = response.data;
    setToken(token);
    localStorage.setItem('token', token);
    // TODO: Decode token to get user info and set user state
    return response;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const authContextValue = {
    user,
    token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};