// src/page.jsx
import React, { useState } from "react";
import "../assets/styles/gestion-editor.css";

const GestionEditor = () => {
  const categoriasDisponibles = [
    "Policial",
    "Cultura",
    "Deportes",
    "Radio",
    "Show",
    "Sociedad",
  ];

  const [archivo, setArchivo] = useState(null);
  const [tipoArchivo, setTipoArchivo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [listaCategorias, setListaCategorias] = useState([]);

  // Cuando se carga un archivo
  const manejarArchivo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivo(file);
      // Detectar tipo por MIME o por extensión
      setTipoArchivo(file.type || file.name.split(".").pop().toUpperCase());
    }
  };

  const agregarCategoria = (e) => {
    e.preventDefault();
    if (!archivo) {
      alert("Primero cargue un archivo.");
      return;
    }
    if (categoria && !listaCategorias.includes(categoria)) {
      setListaCategorias([...listaCategorias, categoria]);
      setCategoria("");
    }
  };

  const eliminarCategoria = (cat) => {
    setListaCategorias(listaCategorias.filter((c) => c !== cat));
  };

  return (
    <div className="gestion-categorias-container">
      <h1>Gestión de Categorías</h1>

      {/* Subida de archivo */}
      <div className="cargar-archivo">
        <label htmlFor="archivo">Cargar archivo:</label>
        <input
          type="file"
          id="archivo"
          onChange={manejarArchivo}
        />
      </div>

      {/* Mostrar tipo de archivo si hay */}
      {archivo && (
        <div className="tipo-archivo">
          <strong>Tipo de archivo:</strong> {tipoArchivo || "Desconocido"}
        </div>
      )}

      {/* Formulario para elegir categoría */}
      <form onSubmit={agregarCategoria} className="form-categoria">
        <label htmlFor="categoria">Seleccionar tipo de categoría:</label>
        <select
          id="categoria"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          disabled={!archivo} // Deshabilitado si no hay archivo
        >
          <option value="">-- Seleccionar --</option>
          {categoriasDisponibles.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button type="submit" disabled={!archivo}>
          Agregar
        </button>
      </form>

      {/* Lista de categorías */}
      <div className="lista-categorias">
        <h2>Categorías actuales</h2>
        {listaCategorias.length === 0 ? (
          <p>No hay categorías agregadas.</p>
        ) : (
          <ul>
            {listaCategorias.map((cat, index) => (
              <li key={index}>
                {cat}
                <button
                  className="btn-eliminar"
                  onClick={() => eliminarCategoria(cat)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GestionEditor;