// src/pages/Notas.jsx
import { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';
import { useCategorias } from '../context/CategoriasContext.jsx';
import '../assets/styles/notas.css';

function Notas() {
  const [notas, setNotas] = useState([]);
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');

  const { token } = useContext(AuthContext);
  const { categorias } = useCategorias();
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticulos();
    fetchNotificaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Cargar artículos (borradores y rechazados)
  const fetchArticulos = async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:5000/api/articles/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al cargar artículos');

      const data = await response.json();
      const filtrados = data.filter(
        (a) => a.estado === 'borrador' || a.estado === 'rechazado'
      );
      setNotas(filtrados);
    } catch (err) {
      setError('No se pudieron cargar los artículos');
    } finally {
      setLoading(false);
    }
  };

  // Cargar notificaciones
  const fetchNotificaciones = async () => {
    if (!token) return;
    try {
      const response = await fetch(
        'http://localhost:5000/api/articles/user/notifications',
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.ok) {
        const data = await response.json();
        setNotificaciones(data);
      }
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
    }
  };

  // Helpers
  const getNombreCategoria = (categoriaId) => {
    if (!categoriaId) return 'Sin categoría';
    const cat = categorias.find((c) => c.id_categoria === categoriaId);
    return cat ? cat.nombre : 'Sin categoría';
  };

  const getComentarioRechazo = (articuloId, titulo) => {
    const notif = notificaciones.find((n) => {
      if (!n.mensaje) return false;
      const tieneId = n.mensaje.includes(String(articuloId));
      const tieneTitulo = n.mensaje.includes(titulo || '');
      const esRechazo =
        n.mensaje.toLowerCase().includes('rechazado') ||
        (n.titulo || '').toLowerCase().includes('rechazado');
      return (tieneId || tieneTitulo) && esRechazo;
    });
    return notif ? notif.mensaje : null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString('es-AR');
    } catch {
      return 'N/A';
    }
  };

  // Acciones
  const handleDownload = async (id, nota) => {
    if (!nota?.ruta_archivo || !nota?.nombre_archivo) {
      alert('⚠️ Este artículo no tiene archivo asociado');
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/articles/download/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error('Error al descargar');
      const blob = await response.blob();
      const fileExtension = (nota.nombre_archivo.split('.').pop() || '').trim();
      const url = window.URL.createObjectURL(new Blob([blob]));
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
      alert(`❌ ${err.message}`);
    }
  };

  const handleSendToReview = async (id, titulo) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/articles/${id}/send-to-review`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setNotas((prev) => prev.filter((item) => item.id_articulo !== id));
      alert(`✅ "${titulo}" enviado a revisión exitosamente`);
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
      console.error('Error al enviar a revisión:', err);
    }
  };

  const handleDelete = async (id, titulo = 'este artículo') => {
    if (!window.confirm(`¿Eliminar "${titulo}" permanentemente?`)) return;
    try {
      const response = await fetch(`http://localhost:5000/api/articles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      setNotas((prev) => prev.filter((item) => item.id_articulo !== id));
      alert(`✅ "${titulo}" fue eliminado correctamente`);
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
      console.error('Error al eliminar:', err);
    }
  };

  const handleView = async (id, nota) => {
    if (!nota?.ruta_archivo) {
      alert('⚠️ Este artículo no tiene archivo asociado');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/articles/view/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al visualizar');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const viewer = window.open(url, '_blank');
      if (!viewer) alert('⚠️ Desbloquea ventanas emergentes para ver el archivo');
    } catch (err) {
      console.error('❌ Error al visualizar:', err);
      alert(`❌ ${err.message}`);
    }
  };

  const handleModificar = (nota) => {
    navigate('/periodista-upload', { state: { articulo: nota, modo: 'modificacion' } });
  };

  // Badge de estado (clase + iconito)
  const getEstadoUI = (estado = '') => {
    const e = estado.toLowerCase();
    if (e.includes('rechaz')) return { cls: 'estado--bad', icon: '⛔' };
    if (e.includes('aprob') || e.includes('public')) return { cls: 'estado--ok', icon: '✅' };
    if (e.includes('borrad')) return { cls: 'estado--rev', icon: '📝' };
    return { cls: 'estado--rev', icon: '⏳' };
  };

  // Búsqueda por título o categoría
  const notasFiltradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return notas;
    return notas.filter((n) => {
      const t = (n.titulo || '').toLowerCase();
      const c = getNombreCategoria(n.categoria_id).toLowerCase();
      return t.includes(q) || c.includes(q);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda, notas, categorias]);

  // Render
  if (loading) return <div className="loading">Cargando artículos…</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="notas-page">
      <h1 className="notas-title">Mis artículos</h1>

      <div className="notas-card">
        {/* Toolbar */}
        <div className="notas-toolbar">
          <input
            className="input"
            placeholder="Buscar por título o categoría…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button className="btn btn--primary" onClick={() => navigate('/periodista-upload')}>
            + Nuevo artículo
          </button>
          <button className="btn btn--outline" onClick={() => navigate('/ArticulosEnRevision')}>
            Ver artículos en revisión
          </button>
        </div>

        {/* Tabla */}
        <table className="notas-table">
          <thead>
            <tr>
              <th className="col-titulo">Título</th>
              <th className="col-categoria">Categoría</th>
              <th className="col-estado">Estado</th>
              <th className="col-fecha">Fecha de creación</th>
              <th className="col-fecha">Última modificación</th>
              <th className="col-acciones">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {notasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  No hay artículos para mostrar.
                </td>
              </tr>
            ) : (
              notasFiltradas.map((nota) => {
                const comentario = getComentarioRechazo(nota.id_articulo, nota.titulo);
                const { cls: estadoCls, icon: estadoIcon } = getEstadoUI(nota.estado);

                return (
                  <tr key={nota.id_articulo}>
                    <td className="col-titulo" data-label="Título" title={nota.titulo}>
                      <span className="titulo-link">{nota.titulo}</span>
                    </td>

                    <td className="col-categoria" data-label="Categoría">
                      <span className="chip chip--cat">{getNombreCategoria(nota.categoria_id)}</span>
                    </td>

                    <td className="col-estado" data-label="Estado">
                      <span className={`estado ${estadoCls}`}>
                        <i>{estadoIcon}</i> {nota.estado || 'Borrador'}
                      </span>

                      {nota.estado === 'rechazado' && (
                        <div className="motivo">
                          {comentario
                            ? comentario
                            : 'El editor no dejó comentarios específicos.'}
                        </div>
                      )}
                    </td>

                    <td className="col-fecha" data-label="Fecha de creación">
                      {formatDate(nota.fecha_creacion)}
                    </td>

                    <td className="col-fecha" data-label="Última modificación">
                      {formatDate(nota.fecha_modificacion)}
                    </td>

                    <td className="col-acciones" data-label="Acciones">
                      <div className="actions">
                        <button className="btn btn--light" onClick={() => handleDownload(nota.id_articulo, nota)}>
                          Descargar
                        </button>
                        <button className="btn btn--light" onClick={() => handleView(nota.id_articulo, nota)}>
                          Leer
                        </button>

                        {nota.estado === 'borrador' && (
                          <button
                            className="btn btn--info"
                            onClick={() => handleSendToReview(nota.id_articulo, nota.titulo)}
                          >
                            Enviar a revisión
                          </button>
                        )}

                        {nota.estado === 'rechazado' && (
                          <>
                            <button
                              className="btn btn--info"
                              onClick={() => handleSendToReview(nota.id_articulo, nota.titulo)}
                            >
                              Reenviar a revisión
                            </button>
                            <button className="btn btn--warn" onClick={() => handleModificar(nota)}>
                              ✏️ Modificar
                            </button>
                          </>
                        )}

                        <button className="btn btn--danger" onClick={() => handleDelete(nota.id_articulo, nota.titulo)}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Notas;
