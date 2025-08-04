import React, { useState } from 'react';
import '../assets/styles/notificaciones-internas.css';

export default function NotificacionesInternas() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [destinatario, setDestinatario] = useState('');

  const generarNotificacion = () => {
    const tituloLimpio = titulo.trim();
    const descripcionLimpia = descripcion.trim();
    const destinatarioLimpio = destinatario.trim();

    if (tituloLimpio && descripcionLimpia && destinatarioLimpio) {
      console.log('🔔 Notificación generada:', {
        titulo: tituloLimpio,
        descripcion: descripcionLimpia,
        destinatario: destinatarioLimpio,
      });

      // Aquí podrías hacer un POST a un backend si lo necesitás.

      // Limpiar campos:
      setTitulo('');
      setDescripcion('');
      setDestinatario('');
    }
  };

  return (
    <div className="notificaciones-internas-container">
      <div className="upload-header">NOTIFICACIONES INTERNAS</div>
      <div className="upload-wrapper">
        <aside className="sidebar">{/* Sidebar vacía */}</aside>

        <main className="upload-main">
          <div className="upload-form">
            <div className="left-section">
              <label htmlFor="titulo">Título</label>
              <input
                type="text"
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título de la notificación"
              />

              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción detallada"
              />

              <label htmlFor="destinatario">Destinatario</label>
              <input
                type="text"
                id="destinatario"
                value={destinatario}
                onChange={(e) => setDestinatario(e.target.value)}
                placeholder="Nombre o rol del destinatario"
              />

              <button className="upload-button" onClick={generarNotificacion}>
                Generar notificación
              </button>
            </div>

            <div className="right-section">
              {/* Podrías mostrar historial de notificaciones aquí si querés */}
              <h2>Panel de notificaciones</h2>
              <p className="preview-placeholder">Aquí podrían mostrarse las notificaciones generadas.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
