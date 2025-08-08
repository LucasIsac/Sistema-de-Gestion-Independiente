import React, { useEffect, useState } from "react";
import "../assets/styles/gestionUsuario.css";
import UsuarioTabla from "../components/UsuarioTabla";
import UsuarioForm from "../components/UsuarioForm";

export default function GestionUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);

  const mockUsuarios = [
    { id: 1, nombre: "Juan Pérez", email: "juan@example.com", rol: "admin" },
    { id: 2, nombre: "Ana López", email: "ana@example.com", rol: "usuario" },
    { id: 3, nombre: "Carlos Díaz", email: "carlos@example.com", rol: "usuario" }
  ];

  useEffect(() => {
    setUsuarios(mockUsuarios);
  }, []);

  const handleBuscar = (e) => {
    setBusqueda(e.target.value);
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleNuevo = () => {
    setUsuarioEditando(null);
    setMostrarForm(true);
  };

  const handleEditar = (usuario) => {
    setUsuarioEditando(usuario);
    setMostrarForm(true);
  };

  const handleEliminar = (id) => {
    if (window.confirm("¿Seguro que quieres eliminar este usuario?")) {
      setUsuarios(usuarios.filter((u) => u.id !== id));
    }
  };

  const handleGuardar = (usuario) => {
    if (usuario.id) {
      // Editar
      setUsuarios(usuarios.map((u) => (u.id === usuario.id ? usuario : u)));
    } else {
      // Nuevo
      usuario.id = usuarios.length + 1;
      setUsuarios([...usuarios, usuario]);
    }
    setMostrarForm(false);
  };

  return (
    <div className="gestion-usuario">
      <h1>Gestión de Usuarios</h1>

      <div className="acciones">
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={busqueda}
          onChange={handleBuscar}
        />
        <button onClick={handleNuevo}>+ Nuevo Usuario</button>
      </div>

      <UsuarioTabla
        usuarios={usuariosFiltrados}
        onEditar={handleEditar}
        onEliminar={handleEliminar}
      />

      {mostrarForm && (
        <UsuarioForm
          usuario={usuarioEditando}
          onGuardar={handleGuardar}
          onCancelar={() => setMostrarForm(false)}
        />
      )}
    </div>
  );
}
