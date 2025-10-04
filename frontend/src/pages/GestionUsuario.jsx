import React, { useEffect, useState, useContext } from "react"; // ← Agregar useContext
import "../assets/styles/gestionUsuario.css";
import UsuarioTabla from "../components/UsuarioTabla";
import UsuarioForm from "../components/UsuarioForm";
import useAuth from "../context/useAuth";

export default function GestionUsuario() {
  const { token, loading: authLoading } = useAuth(); // Obtener el estado de carga de la autenticación
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

  const usuariosFiltrados = usuarios.filter(u =>
    `${u.nombre} ${u.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.telefono.includes(busqueda)
  );

  const handleNuevo = () => {
    setUsuarioEditando(null);
    setMostrarForm(true);
  };

  const handleEditar = (usuario) => {
    setUsuarioEditando(usuario);
    setMostrarForm(true);
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Está seguro que desea eliminar este usuario?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          setUsuarios(usuarios.filter((u) => u.id !== id));
        } else {
          setError("Error al eliminar el usuario");
        }
      } catch {
        setError("Error al eliminar el usuario");
      }
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
      <header className="gestion-usuario-header">
        <h1>Gestión de Usuarios</h1>
        <p>Administra los usuarios del sistema</p>
      </header>

      <div className="gestion-usuario-acciones">
        <div className="busqueda-container">
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={busqueda}
            onChange={handleBuscar}
            className="busqueda-input"
          />
          <button className="btn-buscar">
            <i className="fas fa-search"></i>
          </button>
        </div>
        
        <button onClick={handleNuevo} className="btn-nuevo">
          <i className="fas fa-plus"></i> Nuevo Usuario
        </button>
      </div>

      <div className="gestion-usuario-contenido">
        <UsuarioTabla
          usuarios={usuariosFiltrados}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
        />
      </div>

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