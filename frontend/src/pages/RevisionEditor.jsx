import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../assets/styles/notas.css';

function RevisionEditor() {
  const [articulos, setArticulos] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const { usuario } = useContext(AuthContext);

  useEffect(() => {
    const fetchArticulos = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/articulos/en-revision');
        const data = await res.json();
        setArticulos(data);
      } catch (err) {
        console.error('Error al cargar artículos:', err);
      }
    };

    fetchArticulos();
  }, []);

  const handleComentarioChange = (id, texto) => {
    setComentarios({ ...comentarios, [id]: texto });
  };

  // Maneja la decisión del editor (Aprobar/Rechazar)
  const manejarDecision = async (articuloId, nuevoEstado) => {
    try {
      const comentario = comentarios[articuloId];

      // 1️⃣ Guardar comentario
      await fetch('http://localhost:5000/api/comentarios-editor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articulo_id: articuloId,
          editor_id: usuario.id,
          comentario,
        }),
      });

      // 2️⃣ Actualizar estado del artículo
      await fetch('http://localhost:5000/api/articulos/estado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articulo_id: articuloId,
          estado: nuevoEstado,
        }),
      });

      alert(`Artículo ${nuevoEstado.toLowerCase()} correctamente`);
      setComentarios((prev) => ({ ...prev, [articuloId]: '' }));

      // 3️⃣ Opcional: Recargar lista
      const res = await fetch('http://localhost:5000/api/articulos/en-revision');
      const data = await res.json();
      setArticulos(data);

    } catch (error) {
      console.error('Error al procesar decisión:', error);
    }
  };


  const verArchivo = (ruta) => {
    const url = `http://localhost:5000${ruta}`;
    const extension = ruta.split('.').pop().toLowerCase();

    if (extension === 'pdf') {
      // Si es PDF, abrirlo
      window.open(url, '_blank');
    } else {
      // Si no es PDF, descargarlo directamente
      descargarArchivo(ruta);
    }
  };

  const descargarArchivo = (ruta) => {
    const url = `http://localhost:5000${ruta}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = ruta.split('/').pop(); // Nombre del archivo
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="contenedor-notas">
      <h2>Artículos en Revisión</h2>
      <table className="tabla-notas">
        <thead>
          <tr>
            <th>Título</th>
            <th>Comentario</th>
            <th>Periodista</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {articulos.map((art) => (
            <tr key={art.id_articulo}>
              <td>{art.titulo}</td>
              <td>
                <textarea
                  value={comentarios[art.id_articulo] || ''}
                  onChange={(e) => handleComentarioChange(art.id_articulo, e.target.value)}
                  placeholder="Escribe tu comentario aquí..."
                />
                <button onClick={() => manejarDecision(art.id_articulo, 'Aprobado')}>✅ Aprobar</button>
                <button onClick={() => manejarDecision(art.id_articulo, 'En revisión')}>❌ Rechazar</button>
              </td>
              <td>{art.nombre_periodista} {art.apellido_periodista}</td>
              <td>
                <button onClick={() => verArchivo(art.ruta_archivo)}>👁 Ver</button>
                <button onClick={() => descargarArchivo(art.ruta_archivo)}>📥 Descargar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RevisionEditor;
