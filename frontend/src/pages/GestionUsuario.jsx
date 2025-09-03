import React, { useEffect, useState, useContext } from "react"; // ← Agregar useContext
import "../assets/styles/gestionUsuario.css";
import UsuarioTabla from "../components/UsuarioTabla";
import UsuarioForm from "../components/UsuarioForm";
import { AuthContext } from "../context/AuthContext"; // ← Importar AuthContext

export default function GestionUsuario() {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [mostrarForm, setMostrarForm] = useState(false);
  const { token } = useContext(AuthContext); // ← Obtener token del contexto

  const mockUsuarios = [
    { id: 1, nombre: "Juan Pérez", email: "juan@example.com", rol: "admin" },
    { id: 2, nombre: "Ana López", email: "ana@example.com", rol: "usuario" },
    { id: 3, nombre: "Carlos Díaz", email: "carlos@example.com", rol: "usuario" }
  ];

  useEffect(() => {
    setUsuarios(mockUsuarios);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const obtenerRolId = async (nombreRol) => {
    try {
      const response = await fetch('http://localhost:5000/api/roles');
      const roles = await response.json();
      const rol = roles.find(r => r.nombre === nombreRol);
      return rol ? rol.id_rol : null;
    } catch (error) {
      console.error('Error al obtener roles:', error);
      return null;
    }
  };

  const cargarUsuarios = async () => { // ← Agregar función cargarUsuarios
    try {
      const response = await fetch('http://localhost:5000/api/usuarios', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

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
        telefono: usuarioData.telefono,
        rol_id: rol_id
      };

      if (usuarioData.contraseña) {
        datosParaBackend.contraseña = usuarioData.contraseña;
      }

      console.log('📤 Enviando datos:', datosParaBackend);

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
        throw new Error(result.message || 'Error al guardar usuario');
      }

      alert(result.message || 'Usuario guardado correctamente');
      cargarUsuarios(); // ← Llamar a la función para recargar
      setMostrarForm(false);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      alert(error.message || 'Error al guardar usuario');
    }
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