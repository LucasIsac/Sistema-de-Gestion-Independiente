import { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
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

  const guardarComentario = async (articuloId) => {
    try {
      const comentario = comentarios[articuloId];
      const res = await fetch('http://localhost:5000/api/comentarios-editor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articulo_id: articuloId,
          editor_id: usuario.id,
          comentario,
        }),
      });

      if (res.ok) {
        alert('Comentario guardado correctamente');
      } else {
        alert('Error al guardar el comentario');
      }
    } catch (error) {
      console.error('Error al guardar comentario:', error);
    }
  };

  const verArchivo = (ruta) => {
    window.open(ruta, '_blank');
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
                <button onClick={() => guardarComentario(art.id_articulo)}>💾 Guardar</button>
              </td>
              <td>{art.nombre_periodista} {art.apellido_periodista}</td>
              <td>
                <button onClick={() => verArchivo(art.ruta_archivo)}>👁 Ver</button>
                <a href={art.ruta_archivo} download>
                  <button>📥 Descargar</button>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RevisionEditor;
