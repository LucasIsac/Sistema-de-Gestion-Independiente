import React, { useState, useEffect, useContext } from 'react';
import '../assets/styles/galeria.css';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ModalFotoGlobal = ({ foto, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-global" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <img 
          src={`http://localhost:5000/${foto.ruta_archivo.replace(/\\/g, '/')}`} 
          alt={foto.titulo}
          className="modal-image"
        />
        <div className="modal-info-global">
          <h3>{foto.titulo}</h3>
          <p>{foto.descripcion}</p>
          <div className="fotografo-info">
            <strong>Fotógrafo:</strong> {foto.fotografo_nombre} {foto.fotografo_apellido}
          </div>
          <div className="categoria-info">
            <strong>Categoría:</strong> {foto.categoria_nombre || 'Sin categoría'}
          </div>
          <span className="modal-fecha">
            Subida el: {new Date(foto.fecha).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

const FotoItemGlobal = ({ foto, onDownload, onView }) => {
  const [imageStatus, setImageStatus] = useState('loading');

  return (
    <div className="tarjeta-foto-global">
      <div className="imagen-container-global" onClick={() => onView(foto)}>
        {imageStatus === 'loading' && (
          <div className="skeleton-loader">
            <div className="spinner"></div>
          </div>
        )}
        
        <img 
          src={`http://localhost:5000/${foto.ruta_archivo.replace(/\\/g, '/')}`}
          alt={foto.titulo}
          className={`foto-imagen ${imageStatus === 'loaded' ? 'loaded' : ''}`}
          onLoad={() => setImageStatus('loaded')}
          onError={() => setImageStatus('error')}
        />

        {imageStatus === 'error' && (
          <div className="error-placeholder">
            <span>❌ Error al cargar</span>
          </div>
        )}

        <div className="overlay-global">
          <span className="view-text">👁️ Ver</span>
        </div>
      </div>
      
      <div className="tarjeta-info-global">
        <h3 className="foto-titulo">{foto.titulo}</h3>
        <p className="foto-descripcion">{foto.descripcion}</p>
        
        <div className="fotografo-info-small">
          📸 Por: {foto.fotografo_nombre} {foto.fotografo_apellido}
        </div>
        
        {foto.categoria_nombre && (
          <div className="categoria-tag">
            {foto.categoria_nombre}
          </div>
        )}

        <div className="botones-accion-global">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDownload(foto.id_foto, foto.nombre_original);
            }}
            className="btn-descargar-global"
          >
            ⬇️ Descargar
          </button>
        </div>
      </div>
    </div>
  );
};

const GaleriaGlobal = () => {
  const [fotos, setFotos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const { token } = useContext(AuthContext);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    cargarFotos();
    cargarCategorias();
   
  }, []);

  const cargarFotos = async () => {
  try {
    // ✅ SIN token para rutas públicas
    const response = await axios.get('http://localhost:5000/api/fotos/globales');
    setFotos(response.data);
  } catch (error) {
    console.error('Error al cargar fotos globales:', error);
  } finally {
    setCargando(false);
  }
};

 const cargarCategorias = async () => {
  try {
    // ✅ SIN token para rutas públicas  
    const response = await axios.get('http://localhost:5000/api/categorias');
    setCategorias(response.data);
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  }
};

  const handleDescargar = async (fotoId, nombreOriginal) => {
    try {
      const config = token ? { 
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      } : { responseType: 'blob' };

      const response = await axios.get(`http://localhost:5000/api/fotos/download/${fotoId}`, config);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = nombreOriginal || `foto_${fotoId}.jpg`;
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);

    } catch (error) {
      console.error('Error al descargar:', error);
      alert('Error al descargar la foto');
    }
  };

  const abrirModal = (foto) => {
    setFotoSeleccionada(foto);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setFotoSeleccionada(null);
  };

  const fotosFiltradas = filtroCategoria 
    ? fotos.filter(foto => foto.categoria_id === parseInt(filtroCategoria))
    : fotos;

  if (cargando) {
    return (
      <div className="galeria-container">
        <h1>Galería Global</h1>
        <div className="cargando-container">
          <div className="spinner grande"></div>
          <p>Cargando galería global...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="galeria-container">
      <h1>Galería Global</h1>
      <p className="subtitulo-galeria">Fotos compartidas por todos los fotógrafos</p>

      {/* Filtro por categoría */}
      <div className="filtro-categoria">
        <label htmlFor="categoria">Filtrar por categoría:</label>
        <select 
          id="categoria"
          value={filtroCategoria} 
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat.id_categoria} value={cat.id_categoria}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      {fotosFiltradas.length === 0 ? (
        <div className="no-fotos">
          <p>No hay fotos disponibles en la galería global.</p>
          {filtroCategoria && (
            <button onClick={() => setFiltroCategoria('')}>
              Mostrar todas las categorías
            </button>
          )}
        </div>
      ) : (
        <div className="galeria-grid-global">
          {fotosFiltradas.map((foto) => (
            <FotoItemGlobal 
              key={foto.id_foto} 
              foto={foto} 
              onDownload={handleDescargar}
              onView={abrirModal}
            />
          ))}
        </div>
      )}

      <ModalFotoGlobal 
        foto={fotoSeleccionada} 
        isOpen={modalAbierto} 
        onClose={cerrarModal} 
      />
    </div>
  );
};

export default GaleriaGlobal;