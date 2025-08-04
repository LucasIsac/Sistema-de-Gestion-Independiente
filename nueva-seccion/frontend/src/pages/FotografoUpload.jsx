import React, { useRef, useState } from 'react';
import '../assets/styles/fotografo-upload.css';

export default function FotografoUpload() {
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState('');
  const [archivoSubido, setArchivoSubido] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const inputFileRef = useRef();

  const handleUploadClick = () => inputFileRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFileName(title.trim() !== '' ? title.trim() : file.name);
      setMostrarConfirmacion(true);
    }
  };

  const confirmarSubida = () => {
    setArchivoSubido(true);
    setMostrarConfirmacion(false);
    setFileName(title.trim() !== '' ? title.trim() : fileName);
  };

  const cancelarSubida = () => {
    setPreview(null);
    setFileName('');
    setArchivoSubido(false);
    setMostrarConfirmacion(false);
    setTitle('');
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

  return (
    <div className="fotografo-upload-container">
      <div className="upload-header">FOTÓGRAFO</div>
      <div className="upload-wrapper">
        <aside className="sidebar">{/* Barra verde sin texto */}</aside>

        <main className="upload-main">
          <div className="upload-form">
            <div className="left-section">
              <label htmlFor="title">Título</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                placeholder="Ingresar título"
                disabled={archivoSubido}
              />

              <button className="upload-button" onClick={handleUploadClick}>
                Subir archivo
              </button>
              <input
                type="file"
                accept="image/*"
                ref={inputFileRef}
                onChange={handleFileChange}
                hidden
              />

              {mostrarConfirmacion && (
                <div className="confirm-box">
                  <p>¿Está seguro de subir este archivo?</p>
                  <div className="confirm-buttons">
                    <button className="yes-btn" onClick={confirmarSubida}>Sí</button>
                    <button className="no-btn" onClick={cancelarSubida}>No</button>
                  </div>
                </div>
              )}

              {archivoSubido && (
                <div className="upload-box moodle-box">
                  <div className="moodle-buttons">
                    <button className="edit-btn" onClick={editarEntrega}>EDITAR ENTREGA</button>
                    <button className="delete-btn" onClick={cancelarSubida}>BORRAR ENTREGA</button>
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
                          <a href={preview} target="_blank" rel="noreferrer">{fileName}</a><br />
                          <span className="fecha-envio">{new Date().toLocaleString()}</span>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Comentarios de la entrega</strong></td>
                        <td><a href="#">Comentarios (0)</a></td>
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
                  <span className="preview-placeholder">No hay archivo cargado</span>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}