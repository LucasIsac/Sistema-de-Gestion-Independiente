import React, { useEffect, useState } from "react";
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
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarUsuarios = React.useCallback(async () => {
    try {
      setCargando(true);
      console.log("TOKEN ANTES DEL FETCH:", token);

      const response = await fetch("http://localhost:5000/api/usuarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      // Asegurarse de que data sea siempre un array
      setUsuarios(Array.isArray(data) ? data : []);
    } catch {
      setError("Error al cargar los usuarios");
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    // Doble comprobación: solo cargar usuarios si la autenticación NO está en proceso
    // y si ya tenemos un token. Esto elimina la condición de carrera.
    if (!authLoading && token) {
      cargarUsuarios();
    }
  }, [token, authLoading, cargarUsuarios]);

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

  const handleGuardar = async (usuario) => {
    try {
      const url = usuario.id
        ? `http://localhost:5000/api/usuarios/${usuario.id}`
        : "http://localhost:5000/api/usuarios";
      const method = usuario.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuario),
      });

      if (response.ok) {
        setMostrarForm(false);
        cargarUsuarios(); // Recargar la lista de usuarios
      } else {
        setError("Error al guardar el usuario");
      }
    } catch {
      setError("Error al guardar el usuario");
    }
  };

  // Mientras se verifica la sesión, mostrar un mensaje.
  if (authLoading) return <div className="cargando">Verificando sesión...</div>;
  if (cargando && !usuarios.length) return <div className="cargando">Cargando usuarios...</div>;
  if (error) return <div className="error">{error}</div>;

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
