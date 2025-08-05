import React, { useState } from 'react';
import '../assets/styles/gestion-roles.css';

export default function GestionRoles() {
  const [nuevoRol, setNuevoRol] = useState('');
  const [roles, setRoles] = useState([]);

  const handleAgregarRol = () => {
    const rolLimpio = nuevoRol.trim();
    if (rolLimpio !== '' && !roles.includes(rolLimpio)) {
      setRoles([...roles, rolLimpio]);
      setNuevoRol('');
    }
  };

  return (
    <div className="gestion-roles-container">
      <div className="upload-header">GESTIÓN DE ROLES</div>
      <div className="upload-wrapper">
        <aside className="sidebar">{/* Barra lateral vacía */}</aside>

        <main className="upload-main">
          <div className="upload-form">
            <div className="left-section">
              <label htmlFor="rol">Nombre del rol</label>
              <input
                type="text"
                id="rol"
                value={nuevoRol}
                onChange={(e) => setNuevoRol(e.target.value)}
                placeholder="Ej: Administrador, Editor, etc."
              />

              <button className="upload-button" onClick={handleAgregarRol}>
                Cargar rol
              </button>
            </div>

            <div className="right-section">
              <h2>Roles existentes</h2>
              <div className="roles-list-box">
                {roles.length > 0 ? (
                  <ul className="roles-list">
                    {roles.map((rol, index) => (
                      <li key={index} className="rol-item">{rol}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="preview-placeholder">No hay roles cargados</span>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
