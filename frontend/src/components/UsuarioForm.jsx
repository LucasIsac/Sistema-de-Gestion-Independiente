import React, { useState, useEffect } from "react";
import "../assets/styles/UsuarioForm.css";

export default function UsuarioForm({ usuario, onGuardar, onCancelar }) {
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    email: "",
    rol: "",
  });

  useEffect(() => {
<<<<<<< HEAD
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/roles", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setRolesDisponibles(Array.isArray(data) ? data : []);
      } catch {
        setRolesDisponibles([]);
      }
    };

    if (token) fetchRoles();

    if (usuario) {
      setFormData({
        id: usuario.id || usuario.id_usuario || "",
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        usuario: usuario.usuario || "",
        email: usuario.email || "",
        telefono: usuario.telefono || "",
        rol: usuario.rol || usuario.rol_nombre || "",
        contraseña: ""
      });
    } else {
      setFormData({
        id: "",
        nombre: "",
        apellido: "",
        usuario: "",
        email: "",
        telefono: "",
        rol: "",
        contraseña: ""
      });
=======
    if (usuario) {
      setFormData(usuario);
>>>>>>> 653dc6f1da51637806ddb03f566bb237c6f103c0
    }
  }, [usuario, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

<<<<<<< HEAD
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
          <label className="usuario-form-label">Usuario</label>
          <input
            type="text"
            name="usuario"
            className="usuario-form-input"
            value={formData.usuario}
            onChange={handleChange}
            required
            disabled={!!formData.id}
          />
          <span className="usuario-form-error">Este campo es requerido</span>
        </div>

        {!formData.id && (
          <div className="usuario-form-group">
            <label className="usuario-form-label">Contraseña</label>
            <input
              type="password"
              name="contraseña"
              className="usuario-form-input"
              value={formData.contraseña}
              onChange={handleChange}
              required
            />
            <span className="usuario-form-error">Este campo es requerido</span>
          </div>
        )}

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
              <option key={rol.id_rol} value={rol.nombre}>
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
            Cancelar
          </button>
          <button
            type="submit"
            className="usuario-form-button usuario-form-button--save"
          >
            Guardar
          </button>
=======
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
>>>>>>> 653dc6f1da51637806ddb03f566bb237c6f103c0
        </div>
      </form>
    </div>
  );
}