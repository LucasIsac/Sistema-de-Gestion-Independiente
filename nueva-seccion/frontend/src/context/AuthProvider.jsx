import { useState, useEffect } from 'react';
import AuthContext from './AuthContext.js';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('usuario');
    if (stored) setUsuario(JSON.parse(stored));
  }, []);

  const login  = (data) => {
    localStorage.setItem('usuario', JSON.stringify(data));
    setUsuario(data);
  };

  const logout = () => {
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}