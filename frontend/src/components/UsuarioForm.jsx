import React, { useState, useEffect } from "react";

export default function UsuarioForm({ usuario, onGuardar, onCancelar }) {
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    email: "",
    rol: "",
  });

  useEffect(() => {
    if (usuario) {
      setFormData(usuario);
    }
  }, [usuario]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(formData);
  };

  return (
    <div className="modal">
      <form className="form-usuario" onSubmit={handleSubmit}>
        <h2>{formData.id ? "Editar Usuario" : "Nuevo Usuario"}</h2>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <select name="rol" value={formData.rol} onChange={handleChange} required>
          <option value="">Seleccione un rol</option>
          <option value="admin">Admin</option>
          <option value="usuario">Usuario</option>
        </select>

        <div className="acciones-form">
          <button type="submit">Guardar</button>
          <button type="button" onClick={onCancelar}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
