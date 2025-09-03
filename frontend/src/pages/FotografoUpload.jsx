import React, { useRef, useState } from 'react';
import '../assets/styles/fotografo-upload.css';
import axios from 'axios';

export default function FotografoUpload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(''); // ← Agregar descripción
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [archivoSubido, setArchivoSubido] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const inputFileRef = useRef();
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null);

  const handleUploadClick = () => inputFileRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivoSeleccionado(file);
      setPreview(URL.createObjectURL(file));
      setFileName(title.trim() !== '' ? title.trim() : file.name);
      setMostrarConfirmacion(true);
    }
  };

  const confirmarSubida = async () => {
    if (!archivoSeleccionado || !title.trim()) {
      setError('Título y archivo son obligatorios');
      return;
    }

    setCargando(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('archivo', archivoSeleccionado);
      formData.append('titulo', title);
      formData.append('descripcion', description);
      // Agrega más campos si necesitas: categoria_id, es_global, etc.

      const token = localStorage.getItem('token');
      
      const response = await axios.post('http://localhost:5000/api/fotos/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 201) {
        setArchivoSubido(true);
        setMostrarConfirmacion(false);
        setFileName(title);
        alert('✅ Foto subida exitosamente');
      }
    } catch (error) {
      console.error('Error al subir foto:', error);
      setError('Error al subir la foto. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  const cancelarSubida = () => {
    setPreview(null);
    setFileName('');
    setArchivoSubido(false);
    setMostrarConfirmacion(false);
    setTitle('');
    setDescription('');
    setArchivoSeleccionado(null);
    setError('');
  };

  const editarEntrega = () => {
    setArchivoSubido(false);
    setMostrarConfirmacion(false);
    inputFileRef.current.click();
  };

  const handleTitleChange = (e) => {
    const nuevoTitulo = e.target.value;
    setTitle(nuevoTitulo);
    if (!archivoSubido) {
      setFileName(nuevoTitulo);
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  return (
    <div className="fotografo-upload-container">
      <div className="upload-header">FOTÓGRAFO</div>
      <div className="upload-wrapper">
        <aside className="sidebar">{/* Barra verde sin texto */}</aside>

        <main className="upload-main">
          <div className="upload-form">
            <div className="left-section">
              <label htmlFor="title">Título *</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Ingresar título"
                disabled={archivoSubido || cargando}
              />

              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Descripción de la foto (opcional)"
                disabled={archivoSubido || cargando}
                rows="3"
              />

              <button 
                className="upload-button" 
                onClick={handleUploadClick}
                disabled={cargando}
              >
                {cargando ? 'Subiendo...' : 'Subir archivo'}
              </button>
              
              <input
                type="file"
                accept="image/*"
                ref={inputFileRef}
                onChange={handleFileChange}
                hidden
                disabled={cargando}
              />

              {error && (
                <div className="error-message">
                  ❌ {error}
                </div>
              )}

              {mostrarConfirmacion && (
                <div className="confirm-box">
                  <p>¿Está seguro de subir este archivo?</p>
                  <div className="confirm-buttons">
                    <button 
                      className="yes-btn" 
                      onClick={confirmarSubida}
                      disabled={cargando}
                    >
                      {cargando ? 'Subiendo...' : 'Sí'}
                    </button>
                    <button 
                      className="no-btn" 
                      onClick={cancelarSubida}
                      disabled={cargando}
                    >
                      No
                    </button>
                  </div>
                </div>
              )}

              {archivoSubido && (
                <div className="upload-box moodle-box">
                  <div className="moodle-buttons">
                    <button className="edit-btn" onClick={editarEntrega}>
                      EDITAR ENTREGA
                    </button>
                    <button className="delete-btn" onClick={cancelarSubida}>
                      BORRAR ENTREGA
                    </button>
                  </div>

                  <table className="status-table">
                    <tbody>
                      <tr>
                        <td><strong>Estado de la entrega</strong></td>
                        <td className="success">Enviado</td>
                      </tr>
                      <tr>
                        <td><strong>Última modificación</strong></td>
                        <td>{new Date().toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td><strong>Archivos enviados</strong></td>
                        <td>
                          <a href={preview} target="_blank" rel="noreferrer">
                            {fileName}
                          </a>
                          <br />
                          <span className="fecha-envio">
                            {new Date().toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="right-section">
              <h2>Vista previa</h2>
              <div className="preview-box">
                {preview ? (
                  <img src={preview} alt="Vista previa" />
                ) : (
                  <span className="preview-placeholder">
                    No hay archivo cargado
                  </span>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}