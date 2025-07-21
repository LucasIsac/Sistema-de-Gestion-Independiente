import { useState, useEffect } from 'react';
import '../assets/styles/notas.css';

function Notas() {
  const [notas, setNotas] = useState([]);

  useEffect(() => {
    // Simulamos que cada nota tiene una URL de archivo asociada
    const notasSimuladas = [
      {
        id: 1,
        titulo: "Entrevista con Ministro",
        estado: "Borrador",
        fechaCreacion: "2025-07-01",
        fechaModificacion: "2025-07-15",
        url_archivo: "/archivos/archivo1.pdf", // En /public/archivos/nota1.pdf
      },
      {
        id: 2,
        titulo: "Informe sobre Educación",
        estado: "Listo",
        fechaCreacion: "2025-06-20",
        fechaModificacion: "2025-07-05",
        url_archivo: "/archivos/Tp 9.docx", // En /public/archivos/nota2.pdf
      },
    ];
    setNotas(notasSimuladas);
  }, []);

  const actualizarEstado = (idNota, nuevoEstado) => {
    const nuevasNotas = notas.map((nota) =>
      nota.id === idNota ? { ...nota, estado: nuevoEstado } : nota
    );
    setNotas(nuevasNotas);
  };

  const verArchivo = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="contenedor-notas">
      <h2>Mis Notas</h2>
      <table className="tabla-notas">
        <thead>
          <tr>
            <th>Título</th>
            <th>Estado</th>
            <th>Fecha de creación</th>
            <th>Última modificación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notas.map((nota) => (
            <tr key={nota.id}>
              <td>{nota.titulo}</td>
              <td>
                <select
                  value={nota.estado}
                  onChange={(e) => actualizarEstado(nota.id, e.target.value)}
                >
                  <option value="Borrador">Borrador</option>
                  <option value="Listo">Listo</option>
                  <option value="En revisión">En revisión</option>
                </select>
              </td>
              <td>{nota.fechaCreacion}</td>
              <td>{nota.fechaModificacion}</td>
              <td>
                <button className="btn-descargar">📥 Descargar</button>
                <button
                  className="btn-ver"
                  onClick={() => verArchivo(nota.url_archivo)}
                >
                  👁 Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Notas;
