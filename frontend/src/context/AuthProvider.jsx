// src/context/AuthProvider.jsx
import { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';  // ✅ Correcto

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser) setUsuario(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

  const login = (data, authToken) => {
    localStorage.setItem('usuario', JSON.stringify(data));
    localStorage.setItem('token', authToken);
    setUsuario(data);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setUsuario(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}