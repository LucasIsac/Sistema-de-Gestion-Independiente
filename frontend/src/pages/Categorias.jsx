import React, { useState } from "react";
import "../assets/styles/categorias.css";

const Categorias = () => {
  // Datos simulados que luego vendrán del backend
  const categorias = [
    { nombre: "Policial", archivos: ["Caso1.pdf", "Caso2.docx"] },
    { nombre: "Cultura", archivos: ["Arte.pdf", "Historia.txt"] },
    { nombre: "Deportes", archivos: ["Partido1.jpg", "Estadísticas.xlsx"] },
    { nombre: "Radio", archivos: ["Programa1.mp3", "Entrevista.wav"] },
    { nombre: "Show", archivos: ["Concierto.mp4", "Evento.pdf"] },
    { nombre: "Sociedad", archivos: ["Informe.pdf", "Censo.xlsx"] },
  ];

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  return (
    <div className="categorias-container">
      <h1>Categorías</h1>

      {/* Lista de categorías */}
      <div className="categorias-lista">
        {categorias.map((cat, index) => (
          <div
            key={index}
            className={`categoria-card ${
              categoriaSeleccionada === cat.nombre ? "seleccionada" : ""
            }`}
            onClick={() => setCategoriaSeleccionada(cat.nombre)}
          >
            {cat.nombre}
          </div>
        ))}
      </div>

      {/* Archivos de la categoría seleccionada */}
      {categoriaSeleccionada && (
        <div className="archivos-container">
          <h2>Archivos de {categoriaSeleccionada}</h2>
          <ul>
            {categorias
              .find((c) => c.nombre === categoriaSeleccionada)
              ?.archivos.map((archivo, idx) => (
                <li key={idx} className="archivo-item">
                  {archivo}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Categorias;
