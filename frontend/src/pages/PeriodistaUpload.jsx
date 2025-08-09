import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';  // ✅ Correcto
import '../assets/styles/periodista-upload.css';
import { useNavigate } from 'react-router-dom';

export default function PeriodistaUpload() {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('1');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // Corregí el typo de "preview" a "preview"
  const [uploadStatus, setUploadStatus] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type === 'application/pdf') {
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file || !title) {
      setUploadStatus({ error: 'Debes completar todos los campos' });
      return;
    }

    setUploadStatus({ loading: true });

    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('titulo', title);
    formData.append('categoria_id', category);

    try {
      const response = await fetch('http://localhost:5000/api/articles/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Error al subir');

      setUploadStatus({ success: 'Artículo subido correctamente' });
      setIsSubmitted(true);
    } catch (err) {
      setUploadStatus({ error: err.message });
    }
  };

  return (
    <div className="periodista-upload-container">
      <div className="upload-header">SUBIR ARTÍCULO</div>
      
      <div className="upload-wrapper">
        <aside className="sidebar">
          {/* Opciones del sidebar si las necesitas */}
        </aside>

        <main className="upload-main">
          <form onSubmit={handleSubmit} className="upload-form">
            <div className="left-section">
              <div className="form-group">
                <label htmlFor="title">Título del artículo</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ingresa un título descriptivo"
                  disabled={isSubmitted}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Categoría</label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isSubmitted}
                >
                  <option value="1">Política</option>
                  <option value="2">Economía</option>
                  <option value="3">Deportes</option>
                  <option value="4">Cultura</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="file">Archivo</label>
                <div className="file-upload-wrapper">
                  <input
                    type="file"
                    id="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    disabled={isSubmitted}
                  />
                  <label htmlFor="file" className="file-upload-label">
                    {file ? file.name : 'Seleccionar archivo'}
                  </label>
                </div>
                <p className="file-hint">Formatos aceptados: PDF, DOC, DOCX</p>
              </div>

              {uploadStatus?.error && (
                <div className="error-message">{uploadStatus.error}</div>
              )}

              {!isSubmitted ? (
                <div className="form-actions">
                  <button type="submit" className="upload-button" disabled={uploadStatus?.loading}>
                    {uploadStatus?.loading ? 'Subiendo...' : 'Subir artículo'}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => navigate('/notas')}
                    disabled={uploadStatus?.loading}
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="upload-success">
                  <p>¡Artículo subido exitosamente!</p>
                  <div className="success-actions">
                    <button 
                      type="button" 
                      className="new-upload-button"
                      onClick={() => {
                        setTitle('');
                        setFile(null);
                        setPreview(null);
                        setIsSubmitted(false);
                        setUploadStatus(null);
                      }}
                    >
                      Subir nuevo artículo
                    </button>
                    <button 
                      type="button" 
                      className="back-button"
                      onClick={() => navigate('/notas')}
                    >
                      Volver a mis artículos
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="right-section">
              <h2>Vista previa</h2>
              <div className="preview-box">
                {preview ? (
                  <iframe
                    src={preview}
                    title="Vista previa del documento"
                  />
                ) : (
                  <div className="preview-placeholder">
                    {file ? (
                      <p>Vista previa no disponible para este tipo de archivo</p>
                    ) : (
                      <>
                        <p>No hay archivo seleccionado</p>
                        <p>Selecciona un archivo para ver la vista previa</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
