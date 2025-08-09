import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../assets/styles/notas.css';

function Notas() {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticulos = async () => {
      if (!token) return;

      try {
        const response = await fetch('http://localhost:5000/api/articles/my', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Error al cargar artículos');

        const data = await response.json();
        setNotas(data);
      } catch (err) {
        console.error('Error:', err);
        setError('No se pudieron cargar los artículos');
      } finally {
        setLoading(false);
      }
    };

    fetchArticulos();
  }, [token]);

  const handleDownload = async (id, nota) => {
    if (!nota?.ruta_archivo || !nota?.nombre_archivo) {
      alert('⚠️ Este artículo no tiene archivo asociado');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/articles/download/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al descargar');
      }

      const blob = await response.blob();
      const fileExtension = nota.nombre_archivo.split('.').pop() || '';
      const mimeTypes = {
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'pdf': 'application/pdf',
        'txt': 'text/plain'
      };

      const url = window.URL.createObjectURL(new Blob([blob], { type: mimeTypes[fileExtension] || 'application/octet-stream' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = nota.nombre_original || `articulo_${id}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
    } catch (err) {
      console.error('❌ Error al descargar:', err);
      alert(`❌ ${err.message || 'Error al descargar el archivo'}`);
    }
  };

  const handleDelete = async (id, titulo = "este artículo") => {
    if (!window.confirm(`¿Eliminar "${titulo}" permanentemente?`)) return;

    try {
      const response = await fetch(`http://localhost:5000/api/articles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      setNotas(prev => prev.filter(item => item.id_articulo !== id));
      alert(`✅ "${titulo}" fue eliminado correctamente`);
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
      console.error("Error al eliminar:", err);
    }
  };

  const handleView = async (id, nota) => {
    if (!nota?.ruta_archivo) {
      alert('⚠️ Este artículo no tiene archivo asociado');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/articles/view/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al visualizar');
      }

      const blob = await response.blob();
      const fileType = nota.tipo_archivo || 'application/octet-stream';
      const url = window.URL.createObjectURL(new Blob([blob], { type: fileType }));

      const viewer = window.open(url, '_blank');
      if (!viewer) alert('⚠️ Por favor desbloquea ventanas emergentes para visualizar el archivo');
    } catch (err) {
      console.error('❌ Error al visualizar:', err);
      alert(`❌ ${err.message || 'Error al abrir el archivo'}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  if (loading) return <div className="loading">Cargando artículos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="periodista-upload-container">
      <div className="upload-header">
        Mis Artículos
        <button className="btn-nuevo" onClick={() => navigate('/subir-articulo')}>
          + Nuevo Artículo
        </button>
      </div>

      {notas.length > 0 ? (
        <div className="tabla-wrapper">
          <table className="notas-table">
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
                <tr key={nota.id_articulo}>
                  <td>{nota.titulo}</td>
                  <td>{nota.estado || 'Borrador'}</td>
                  <td>{formatDate(nota.fecha_creacion)}</td>
                  <td>{formatDate(nota.fecha_modificacion)}</td>
                  <td className="acciones">
                    <button onClick={() => handleDownload(nota.id_articulo, nota)} className="btn-accion">Descargar</button>
                    <button onClick={() => handleView(nota.id_articulo, nota)} className="btn-accion">Leer</button>
                    <button onClick={() => handleDelete(nota.id_articulo, nota.titulo)} className="btn-accion">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-notas">
          No tienes artículos aún.
          <button onClick={() => navigate('/subir-articulo')} className="btn-nuevo">¡Subí uno!</button>
        </div>
      )}
    </div>
  );
}

export default Notas;
