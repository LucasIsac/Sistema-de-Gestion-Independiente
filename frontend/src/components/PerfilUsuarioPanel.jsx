import React from "react";
import "../assets/styles/perfil-panel.css";

const PerfilUsuarioPanel = ({ usuario, onClose }) => {
  if (!usuario) return null;

  return (
    <div className="perfil-panel">
      <div className="perfil-header">
        <button className="perfil-cerrar" onClick={onClose}>×</button>
        <h2>Perfil de {usuario.nombre}</h2>
      </div>

      <div className="perfil-contenido">
        <div className="perfil-avatar">
          <img
            src={
              usuario.avatar_url
                ? `http://localhost:5000${usuario.avatar_url}`
                : "/default-avatar.png"
            }
            alt={usuario.nombre}
          />
        </div>

        <div className="perfil-info">
            <p><strong>Usuario:</strong> {usuario.usuario || "Sin usuario"}</p>
            <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}</p>
            <p><strong>Rol:</strong> {usuario.rol_nombre || "Sin rol asignado"}</p>
            <p><strong>Email:</strong> {usuario.email || "No disponible"}</p>
            <p><strong>Teléfono:</strong> {usuario.telefono || "No especificado"}</p>
            <p><strong>Estado:</strong> En línea 🟢</p>
        </div>

      </div>
    </div>
  );
};

export default PerfilUsuarioPanel;
