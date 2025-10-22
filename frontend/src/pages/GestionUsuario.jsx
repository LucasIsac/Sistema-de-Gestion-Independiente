import React, { useEffect, useState, useContext, useCallback } from "react";
import "../assets/styles/gestionUsuario.css";
import UsuarioTabla from "../components/UsuarioTabla";
import UsuarioForm from "../components/UsuarioForm";
<<<<<<< HEAD
import { AuthContext } from "../context/AuthContext";
=======
import useAuth from "../context/useAuth";
>>>>>>> 653dc6f1da51637806ddb03f566bb237c6f103c0

export default function GestionUsuario() {
  const { token, loading: authLoading } = useAuth(); // Obtener el estado de carga de la autenticación
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
<<<<<<< HEAD
  const [cargando, setCargando] = useState(true);
  const { token } = useContext(AuthContext);

  const handleGuardar = async (usuarioData) => {
    try {
      const rol_id = await obtenerRolId(usuarioData.rol);
      if (!rol_id) {
        throw new Error('Rol no válido');
      }

      const datosParaBackend = {
        nombre: usuarioData.nombre,
        apellido: usuarioData.apellido,
        usuario: usuarioData.usuario,
        email: usuarioData.email,
        telefono: usuarioData.telefono || '',
        rol: rol_id
      };

      if (!usuarioData.id) {
        if (!usuarioData.contraseña) {
          throw new Error('La contraseña es obligatoria para nuevos usuarios');
        }
        datosParaBackend.contraseña = usuarioData.contraseña;
      } else if (usuarioData.contraseña) {
        datosParaBackend.contraseña = usuarioData.contraseña;
      }

      const url = usuarioData.id 
        ? `http://localhost:5000/api/usuarios/${usuarioData.id}`
        : 'http://localhost:5000/api/usuarios';

      const method = usuarioData.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(datosParaBackend)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Error ${response.status}`);
      }

      alert(result.message || 'Usuario guardado correctamente');
      cargarUsuarios();
      setMostrarForm(false);
    } catch (error) {
      alert('Error: ' + error.message);
=======

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
>>>>>>> 653dc6f1da51637806ddb03f566bb237c6f103c0
    }
    setMostrarForm(false);
  };

  const cargarUsuarios = useCallback(async () => {
    try {
      setCargando(true);
      
      const response = await fetch('http://localhost:5000/api/usuarios', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setUsuarios(data);
    } catch {
      setUsuarios([]);
    } finally {
      setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  const handleBuscar = (e) => {
    setBusqueda(e.target.value);
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.usuario?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleNuevo = () => {
    setUsuarioEditando(null);
    setMostrarForm(true);
  };

  const handleEditar = (usuario) => {
    const usuarioParaForm = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      usuario: usuario.usuario,
      email: usuario.email,
      telefono: usuario.telefono,
      rol: usuario.rol_nombre || "Editor"
    };
    
    setUsuarioEditando(usuarioParaForm);
    setMostrarForm(true);
  };

  const handleEliminar = async (id) => {
    if (!id) {
      alert("Error: ID de usuario no válido");
      return;
    }

    if (window.confirm("¿Seguro que quieres desactivar este usuario?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          alert('Usuario desactivado correctamente');
          cargarUsuarios();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al desactivar usuario');
        }
      } catch (error) {
        alert(error.message || 'Error al desactivar usuario');
      }
    }
  };

  const obtenerRolId = async (nombreRol) => {
    try {
      const response = await fetch('http://localhost:5000/api/roles', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error ${response.status} al obtener roles`);
      }
      
      const roles = await response.json();
      const rol = roles.find(r => r.nombre === nombreRol);
      
      return rol ? rol.id_rol : null;
    } catch {
      return null;
    }
  };

  if (cargando) {
    return (
      <div className="gestion-usuario">
        <h1>Gestión de Usuarios</h1>
        <div className="cargando">Cargando usuarios...</div>
      </div>
    );
  }

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

<<<<<<< HEAD
      {usuarios.length === 0 ? (
        <div className="sin-usuarios">
          No hay usuarios registrados en el sistema.
        </div>
      ) : (
=======
      <div className="gestion-usuario-contenido">
>>>>>>> 653dc6f1da51637806ddb03f566bb237c6f103c0
        <UsuarioTabla
          usuarios={usuariosFiltrados}
          onEditar={handleEditar}
          onEliminar={handleEliminar}
        />
<<<<<<< HEAD
      )}
=======
      </div>
>>>>>>> 653dc6f1da51637806ddb03f566bb237c6f103c0

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