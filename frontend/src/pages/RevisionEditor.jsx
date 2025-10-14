import { useEffect, useState, useContext, useCallback } from 'react'; // 👈 AGREGAR useCallback
import { AuthContext } from '../context/AuthContext';
import '../assets/styles/revisioneditor.css';

function RevisionEditor() {
  const [articulos, setArticulos] = useState([]);
  const [articulosFiltrados, setArticulosFiltrados] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { token } = useContext(AuthContext);
  const { categorias } = useCategorias();

  useEffect(() => {
    fetchArticulosEnRevision();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔹 FUNCIÓN PARA APLICAR FILTROS CON useCallback
  const aplicarFiltros = useCallback(() => {
    let filtrados = [...articulos];

    // Filtrar por categoría
    if (categoriaFiltro) {
      filtrados = filtrados.filter(art => 
        art.categoria_id.toString() === categoriaFiltro
      );
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtrados = filtrados.filter(art =>
        art.titulo.toLowerCase().includes(term) ||
        (art.periodista_nombre && art.periodista_nombre.toLowerCase().includes(term)) ||
        (art.periodista_apellido && art.periodista_apellido.toLowerCase().includes(term)) ||
        (art.categoria_nombre && art.categoria_nombre.toLowerCase().includes(term))
      );
    }

    setArticulosFiltrados(filtrados);
  }, [articulos, categoriaFiltro, searchTerm]); // 👈 DEPENDENCIAS CORRECTAS

  // 🔹 Aplicar filtros cuando cambien las dependencias
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

  const manejarDecision = async (articuloId, decision) => {
    try {
      const comentario = comentarios[articuloId];
      // 1️⃣ Guardar comentario
      await fetch('http://localhost:5000/api/comentarios-editor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          articulo_id: articuloId,
          editor_id: usuario.id,
          comentario,
        }),
      });

      // 2️⃣ Actualizar estado del artículo
      await fetch('http://localhost:5000/api/articulos/estado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
      alert(`Error: ${error.message}`);
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
      
      {/* 🔹 FILTROS PARA EDITORES */}
      <div className="filtros-editor">
        <div className="filtro-group">
          <label htmlFor="categoria-filtro">Filtrar por categoría:</label>
          <select
            id="categoria-filtro"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="filtro-group">
          <label htmlFor="busqueda-editor">Buscar:</label>
          <input
            type="text"
            id="busqueda-editor"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, periodista o categoría..."
          />
        </div>

        {(categoriaFiltro || searchTerm) && (
          <button className="limpiar-filtros-btn" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        )}
      </div>

      {/* 🔹 INFORMACIÓN DE RESULTADOS */}
      <div className="resultados-info">
        <p>
          Mostrando <strong>{articulosFiltrados.length}</strong> de <strong>{articulos.length}</strong> artículos en revisión
          {categoriaFiltro && ` en ${categorias.find(c => c.id_categoria.toString() === categoriaFiltro)?.nombre}`}
          {searchTerm && ` que coinciden con "${searchTerm}"`}
        </p>
      </div>
      
      {articulosFiltrados.length === 0 ? (
        <div className="no-articulos">
          <p>
            {articulos.length === 0 
              ? "No hay artículos en revisión en este momento." 
              : "No se encontraron artículos con los filtros aplicados."
            }
          </p>
          {(categoriaFiltro || searchTerm) && (
            <button onClick={limpiarFiltros} className="btn-primary">
              Mostrar todos los artículos
            </button>
          )}
        </div>
      ) : (
        <table className="tabla-notas">
          <thead>
            <tr>
              <th>Título</th>
              <th>Periodista</th>
              <th>Categoría</th>
              <th>Fecha de envío</th>
              <th>Comentario del editor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {articulosFiltrados.map((art) => (
              <tr key={art.id_articulo}>
                <td>
                  <strong>{art.titulo}</strong>
                </td>
                <td>{art.periodista_nombre} {art.periodista_apellido}</td>
                <td>
                  <span className="categoria-badge">
                    {art.categoria_nombre}
                  </span>
                </td>
                <td>{new Date(art.fecha_modificacion).toLocaleDateString('es-AR')}</td>
                <td>
                  <textarea 
                    value={comentarios[art.id_articulo] || ''} 
                    onChange={(e) => handleComentarioChange(art.id_articulo, e.target.value)} 
                    placeholder="Escribe tu comentario aquí..." 
                    rows="3"
                  />
                  <div className="decision-buttons">
                    <button 
                      className="accion-btn btn-aprobar"
                      onClick={() => manejarDecision(art.id_articulo, 'approve')}
                    >
                      ✓ Aprobar
                    </button>
                    <button 
                      className="accion-btn btn-rechazar"
                      onClick={() => manejarDecision(art.id_articulo, 'reject')}
                    >
                      ✗ Rechazar
                    </button>
                  </div>
                </td>
                <td>
                  <div className="archivo-buttons">
                    <button 
                      className="accion-btn btn-ver"
                      onClick={() => verArchivo(art.id_articulo)}
                    >
                      👁 Ver
                    </button>
                    <button 
                      className="accion-btn btn-descargar"
                      onClick={() => descargarArchivo(art.id_articulo, art.nombre_original)}
                    >
                      📥 Descargar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RevisionEditor;