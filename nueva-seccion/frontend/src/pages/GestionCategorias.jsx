import React, { useState } from 'react';
import '../assets/styles/gestion-categorias.css';

export default function GestionCategorias() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categorias, setCategorias] = useState([]);

  const agregarCategoria = () => {
    const nombreLimpio = nombre.trim();
    const descripcionLimpia = descripcion.trim();

    if (nombreLimpio !== '' && descripcionLimpia !== '') {
      const nuevaCategoria = {
        id: Date.now(),
        nombre: nombreLimpio,
        descripcion: descripcionLimpia,
      };

      setCategorias([...categorias, nuevaCategoria]);
      setNombre('');
      setDescripcion('');
    }
  };

  const eliminarCategoria = (id) => {
    const nuevasCategorias = categorias.filter(cat => cat.id !== id);
    setCategorias(nuevasCategorias);
  };

  return (
    <div className="gestion-categorias-container">
      <div className="upload-header">GESTIÓN DE CATEGORÍAS</div>
      <div className="upload-wrapper">
        <aside className="sidebar">{/* Espacio lateral */}</aside>

        <main className="upload-main">
          <div className="upload-form">
            <div className="left-section">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre de la categoría"
              />

              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción breve"
              />

              <button className="upload-button" onClick={agregarCategoria}>
                Agregar categoría
              </button>
            </div>

            <div className="right-section">
              <h2>Acciones</h2>
              <div className="acciones-box">
                {categorias.length > 0 ? (
                  categorias.map((cat) => (
                    <div key={cat.id} className="categoria-item">
                      <div>
                        <strong>{cat.nombre}</strong><br />
                        <span>{cat.descripcion}</span>
                      </div>
                      <button className="delete-btn" onClick={() => eliminarCategoria(cat.id)}>
                        Eliminar
                      </button>
                    </div>
                  ))
                ) : (
                  <span className="preview-placeholder">No hay categorías cargadas</span>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
