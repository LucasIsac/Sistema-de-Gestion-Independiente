import React, { useEffect, useState } from 'react';
import CategoriaForm from '../components/CategoriaForm';
import CategoriaTable from '../components/CategoriaTable';
import '../assets/styles/gestionCategorias.css';

export default function GestionCategorias() {
  const [categorias, setCategorias] = useState([]);

  // Cargar categorías desde el backend
  const fetchCategorias = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/categorias'); // tu endpoint
      const data = await res.json();
      setCategorias(data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  // Agregar categoría
  const addCategoria = async (categoria) => {
    try {
      const res = await fetch('http://localhost:3000/api/categorias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoria)
      });
      if (res.ok) fetchCategorias();
    } catch (error) {
      console.error('Error agregando categoría:', error);
    }
  };

  // Eliminar categoría
  const deleteCategoria = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/categorias/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) fetchCategorias();
    } catch (error) {
      console.error('Error eliminando categoría:', error);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return (
    <div className="gestion-categorias-container">
      <h1>Gestión de Categorías</h1>
      <CategoriaForm onAdd={addCategoria} />
      <CategoriaTable categorias={categorias} onDelete={deleteCategoria} />
    </div>
  );
}
