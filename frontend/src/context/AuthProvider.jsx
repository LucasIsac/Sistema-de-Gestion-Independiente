import { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser) setUsuario(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

  const login = (userData, authToken) => {
    // Asegúrate que userData incluya id_usuario
    const userToStore = {
      id_usuario: userData.id || userData.id_usuario, // Compatibilidad con ambos formatos
      nombre: userData.nombre,
      apellido: userData.apellido,
      email: userData.email,
      categoria: userData.categoria || userData.rol // Depende de tu backend
    };

    localStorage.setItem('usuario', JSON.stringify(userToStore));
    localStorage.setItem('token', authToken);
    setUsuario(userToStore);
    setToken(authToken);
  };

  const logout = () => {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    setUsuario(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ setUsuario , usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
