import { useState } from "react";
import "../assets/styles/revisiones.css";

export default function Revisiones() {
  // Datos de ejemplo (mock)
  const [archivos, setArchivos] = useState([
    { id: 1, nombre: "documento1.pdf", estado: "En revisión" },
    { id: 2, nombre: "planilla.xlsx", estado: "Verificado" },
    { id: 3, nombre: "informe.docx", estado: "Corregido" },
    { id: 4, nombre: "contrato.pdf", estado: "No autorizado" },
  ]);

  const [archivoSubir, setArchivoSubir] = useState(null);

  // Simulación de subida
  const handleUpload = () => {
    if (!archivoSubir) {
      alert("Selecciona un archivo primero");
      return;
    }
    const nuevoArchivo = {
      id: archivos.length + 1,
      nombre: archivoSubir.name,
      estado: "En revisión",
    };
    setArchivos([...archivos, nuevoArchivo]);
    setArchivoSubir(null);
    alert(`Archivo "${archivoSubir.name}" agregado a la lista`);
  };

  return (
  <div className="page-content">
    <div className="revisiones-container">
      <h1>📄 Revisión de Archivos</h1>

      {/* Subida de archivos */}
      <div className="upload-section">
        <input
          type="file"
          onChange={(e) => setArchivoSubir(e.target.files[0])}
        />
        <button onClick={handleUpload}>Subir</button>
      </div>

      {/* Lista de archivos */}
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Descargar</th>
          </tr>
        </thead>
        <tbody>
          {archivos.map((a) => (
            <tr key={a.id}>
              <td>{a.nombre}</td>
              <td
                className={`estado ${a.estado
                  .replace(/\s+/g, "-")
                  .toLowerCase()}`}
              >
                {a.estado}
              </td>
              <td>
                <button
                  onClick={() => alert(`Descargando ${a.nombre}...`)}
                >
                  Descargar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
  
}
