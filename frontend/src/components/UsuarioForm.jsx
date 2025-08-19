import React, { useState, useEffect } from "react";
import "../assets/styles/UsuarioForm.css";

export default function UsuarioForm({ usuario, onGuardar, onCancelar }) {
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    rol: ""
  });
  const [rolesDisponibles, setRolesDisponibles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/roles");
        const data = await response.json();
        setRolesDisponibles(data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
    
    if (usuario) {
      setFormData({
        id: usuario.id || "",
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        email: usuario.email || "",
        telefono: usuario.telefono || "",
        rol: usuario.rol || ""
      });
    } else {
      setFormData({
        id: "",
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        rol: ""
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(formData);
  };

  return (
    <div className="usuario-form-modal">
      <div className="usuario-form-container">
        <h2 className="usuario-form-title">
          {formData.id ? "Editar Usuario" : "Nuevo Usuario"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="usuario-form-group">
            <label className="usuario-form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="usuario-form-input"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
            <span className="usuario-form-error">Este campo es requerido</span>
          </div>

          <div className="usuario-form-group">
            <label className="usuario-form-label">Apellido</label>
            <input
              type="text"
              name="apellido"
              className="usuario-form-input"
              value={formData.apellido}
              onChange={handleChange}
              required
            />
            <span className="usuario-form-error">Este campo es requerido</span>
          </div>

          <div className="usuario-form-group">
            <label className="usuario-form-label">Email</label>
            <input
              type="email"
              name="email"
              className="usuario-form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <span className="usuario-form-error">Ingrese un email válido</span>
          </div>

          <div className="usuario-form-group">
            <label className="usuario-form-label">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              className="usuario-form-input"
              value={formData.telefono}
              onChange={handleChange}
              required
            />
            <span className="usuario-form-error">Este campo es requerido</span>
          </div>

          <div className="usuario-form-group">
            <label className="usuario-form-label">Rol</label>
            <select
              name="rol"
              className="usuario-form-select"
              value={formData.rol}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un rol</option>
              {rolesDisponibles.map((rol) => (
                <option key={rol.id} value={rol.nombre}>
                  {rol.nombre}
                </option>
              ))}
            </select>
            <span className="usuario-form-error">Seleccione un rol</span>
          </div>

          <div className="usuario-form-actions">
            <button
              type="button"
              className="usuario-form-button usuario-form-button--cancel"
              onClick={onCancelar}
            >
              <i className="fas fa-times"></i> Cancelar
            </button>
            <button
              type="submit"
              className="usuario-form-button usuario-form-button--save"
            >
              <i className="fas fa-save"></i> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
