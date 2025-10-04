import React, { useState, useEffect } from "react";
import useAuth from "../context/useAuth.js";
import "../assets/styles/notificaciones.css";

export default function NotificacionesInternas() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoDestino, setTipoDestino] = useState("usuario");
  const [valorDestino, setValorDestino] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [busquedaUsuario, setBusquedaUsuario] = useState("");
  const [cargando, setCargando] = useState(false);
  const { token } = useAuth();

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        
        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        };

        // Obtener usuarios
        const resUsuarios = await fetch("http://localhost:5000/api/usuarios", { headers });
        const dataUsuarios = await resUsuarios.json();
        // Limpiar datos de usuarios
        const usuariosLimpios = dataUsuarios.map(user => ({
          id: user.id,
          nombre: user.nombre || '',
          apellido: user.apellido || '',
          email: user.email || ''
        }));
        setUsuarios(usuariosLimpios);
        
        // Obtener roles
        const resRoles = await fetch("http://localhost:5000/api/roles", { headers });
        const dataRoles = await resRoles.json();
        setRoles(dataRoles);
        
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setCargando(false);
      }
    };
    
    if (token) {
      cargarDatos();
    }
  }, [token]);

  // Filtrar usuarios según búsqueda (ahora segura contra valores null/undefined)
  const usuariosFiltrados = usuarios.filter(usuario => {
    const nombreCompleto = `${usuario.nombre} ${usuario.apellido}`.toLowerCase();
    const email = usuario.email.toLowerCase();
    const busqueda = busquedaUsuario.toLowerCase();
    
    return nombreCompleto.includes(busqueda) || email.includes(busqueda);
  });

  const generarNotificacion = async () => {
    if (!titulo || !descripcion || (tipoDestino !== "todos" && !valorDestino)) {
      alert("Por favor complete todos los campos");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/notificaciones/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          titulo, 
          mensaje: descripcion, 
          tipoDestino, 
          valorDestino: tipoDestino === "todos" ? "all" : valorDestino 
        })
      });

      if (response.ok) {
        alert("Notificación generada con éxito");
        setTitulo("");
        setDescripcion("");
        setValorDestino("");
        setTipoDestino("usuario");
        setBusquedaUsuario("");
      } else {
        alert("Error al generar la notificación");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="notificaciones-container">
      <h1>Notificaciones Internas</h1>

      <label>Título:</label>
      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Ingrese el título"
      />

      <label>Descripción:</label>
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Ingrese la descripción"
      />

      <label>Enviar a:</label>
      <select 
        value={tipoDestino} 
        onChange={(e) => {
          setTipoDestino(e.target.value);
          setValorDestino("");
          setBusquedaUsuario("");
        }}
      >
        <option value="usuario">Usuario específico</option>
        <option value="grupo">Grupo/Rol de usuarios</option>
        <option value="todos">Todos los usuarios</option>
      </select>

      {tipoDestino === "usuario" && (
        <div className="usuario-selector">
          <input
            type="text"
            value={busquedaUsuario}
            onChange={(e) => setBusquedaUsuario(e.target.value)}
            placeholder="Buscar usuario por nombre o email"
            className="busqueda-usuario"
          />
          
          {cargando ? (
            <p>Cargando usuarios...</p>
          ) : (
            <select
              value={valorDestino}
              onChange={(e) => setValorDestino(e.target.value)}
              disabled={usuariosFiltrados.length === 0}
            >
              <option value="">Seleccione un usuario</option>
              {usuariosFiltrados.map(usuario => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre} {usuario.apellido} ({usuario.email})
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {tipoDestino === "grupo" && (
        <select
          value={valorDestino}
          onChange={(e) => setValorDestino(e.target.value)}
          disabled={roles.length === 0}
        >
          <option value="">Seleccione un rol</option>
          {roles.map(rol => (
            <option key={rol.id} value={rol.nombre}>
              {rol.nombre}
            </option>
          ))}
        </select>
      )}

      <button 
        onClick={generarNotificacion}
        disabled={cargando}
      >
        {cargando ? "Procesando..." : "Generar Notificación"}
      </button>
    </div>
  );
}
