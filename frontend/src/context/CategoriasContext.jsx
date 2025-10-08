// 📁 src/context/CategoriasContext.jsx - CREAR ESTE ARCHIVO NUEVO
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const CategoriasContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCategorias = () => {
  const context = useContext(CategoriasContext);
  if (!context) {
    throw new Error('useCategorias debe usarse dentro de CategoriasProvider');
  }
  return context;
};

export const CategoriasProvider = ({ children }) => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Cargar categorías desde la API (con useCallback para evitar dependencias)
  const cargarCategorias = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔄 Cargando categorías desde API...");
      
      const response = await fetch('http://localhost:5000/api/categorias');
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("✅ Categorías cargadas:", data);
      
      setCategorias(data);
      setError(null);
      return data;
    } catch (err) {
      console.error('❌ Error cargando categorías:', err);
      setError(err.message);
      
      // 🔹 FALLBACK
      const fallback = [
        { id_categoria: 3, nombre: "Economía" },
        { id_categoria: 4, nombre: "Cultura" },
        { id_categoria: 5, nombre: "Tecnología" },
        { id_categoria: 6, nombre: "Sociedad" },
        { id_categoria: 7, nombre: "Internacional" },
        { id_categoria: 8, nombre: "Salud" },
        { id_categoria: 9, nombre: "Educación" },
        { id_categoria: 10, nombre: "Entretenimiento" }
      ];
      setCategorias(fallback);
      return fallback;
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Recargar categorías
  const recargarCategorias = async () => {
    return await cargarCategorias();
  };

  // 🔹 Cargar categorías al iniciar
  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]); // ✅ Ahora no da error de ESLint

  const value = {
    categorias,
    loading,
    error,
    recargarCategorias
  };

  return (
    <CategoriasContext.Provider value={value}>
      {children}
    </CategoriasContext.Provider>
  );
};