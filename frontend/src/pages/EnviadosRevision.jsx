import React from "react";
import "../assets/styles/EnviadosRevision.css";

const EnviadosRevision = () => {
  const articulos = [
    {
      nombre: "Informe Anual",
      tipo: "Reporte",
      estado: "Enviado",
      corregidoPor: "-"
    },
    {
      nombre: "Nota de Opinión",
      tipo: "Artículo",
      estado: "Visto",
      corregidoPor: "María Pérez"
    },
    {
      nombre: "Análisis Económico",
      tipo: "Informe",
      estado: "Corregido",
      corregidoPor: "Juan Gómez"
    }
  ];

  return (
    <div className="contenedor-enviados">
      <h1>Artículos Enviados a Revisión</h1>
      <table className="tabla-enviados">
        <thead>
          <tr>
            <th>Nombre del Artículo</th>
            <th>Tipo de Artículo</th>
            <th>Estado</th>
            <th>Corregido/Visto por</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((articulo, index) => (
            <tr key={index}>
              <td>{articulo.nombre}</td>
              <td>{articulo.tipo}</td>
              <td className={`estado ${articulo.estado.toLowerCase()}`}>
                {articulo.estado}
              </td>
              <td>{articulo.corregidoPor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnviadosRevision;
