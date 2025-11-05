import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import '../assets/styles/gestionRoles.css';

export default function GestionRoles() {
  const [roles, setRoles] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useContext(AuthContext);

  useEffect(() => {
    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Cargar roles
      const rolesRes = await fetch('http://localhost:5000/api/roles', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!rolesRes.ok) throw new Error('Error al cargar roles');
      const rolesData = await rolesRes.json();
      setRoles(rolesData);

      // Cargar usuarios
      const usuariosRes = await fetch('http://localhost:5000/api/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!usuariosRes.ok) throw new Error('Error al cargar usuarios');
      const usuariosData = await usuariosRes.json();
      setUsuarios(usuariosData);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 FUNCIÓN PARA REASIGNAR ROL
  const reasignarRol = async (usuarioId, nuevoRolId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/${usuarioId}/rol`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rol_id: nuevoRolId })
      });

      if (!response.ok) throw new Error('Error al actualizar rol');
      
      alert('✅ Rol actualizado correctamente');
      cargarDatos(); // Recargar datos
    } catch (error) {
      alert('❌ Error al actualizar rol: ' + error.message);
    }
  };

  if (loading) return <div className="loading">Cargando datos...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="gestion-roles-container">
      <h1>Gestión de Roles del Sistema</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      {/* 🔹 RESUMEN DE ROLES EXISTENTES */}
      <div className="roles-resumen">
        <h2>Roles Disponibles</h2>
        <div className="roles-grid">
          {roles.map(rol => (
            <div key={rol.id_rol} className="rol-card">
              <h3>
                {rol.nombre === 'administrador' && '👑 '}
                {rol.nombre === 'Editor' && '📝 '}
                {rol.nombre === 'Periodista' && '✍️ '}
                {rol.nombre === 'Fotografo' && '📸 '}
                {rol.nombre}
              </h3>
              <p>
                {rol.nombre === 'administrador' && 'Responsable de la gestión general del sistema, asignación de roles, control de usuarios y mantenimiento de la plataforma.'}
                {rol.nombre === 'Editor' && 'Encargado de revisar, corregir y aprobar los contenidos antes de su publicación en el sistema.'}
                {rol.nombre === 'Periodista' && 'Se dedica a la redacción y publicación de noticias, artículos e informes periodísticos dentro del sistema.'}
                {rol.nombre === 'Fotografo' && 'Responsable de capturar, subir y administrar las imágenes utilizadas en las publicaciones y galerías del medio.'}
                {!['Administrador','Editor','Periodista','Fotografo'].includes(rol.nombre) && (rol.descripcion || 'Descripción no disponible')}
              </p>
              <small>
                {usuarios.filter(u => u.rol_id === rol.id_rol).length} usuarios
              </small>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 REASIGNACIÓN DE ROLES */}
      <div className="reasignacion-roles">
        <h2>Reasignar Roles a Usuarios</h2>
        {usuarios.length === 0 ? (
          <p>No hay usuarios para mostrar</p>
        ) : (
          <table className="usuarios-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol Actual</th>
                <th>Nuevo Rol</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <UsuarioFila 
                  key={usuario.id} 
                  usuario={usuario} 
                  roles={roles} 
                  onReasignar={reasignarRol}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔹 ESTADÍSTICAS */}
      <div className="roles-estadisticas">
        <h2>Estadísticas por Rol</h2>
        <div className="stats-grid">
          {roles.map(rol => {
            const cantidad = usuarios.filter(u => u.rol_id === rol.id_rol).length;
            return (
              <div key={rol.id_rol} className="stat-card">
                <h4>{rol.nombre}</h4>
                <p className="stat-number">{cantidad}</p>
                <small>usuarios</small>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function UsuarioFila({ usuario, roles, onReasignar }) {
  const [nuevoRolId, setNuevoRolId] = useState('');

  const handleReasignar = () => {
    if (!nuevoRolId) {
      alert('⚠️ Debes seleccionar un nuevo rol antes de actualizar');
      return;
    }
    if (parseInt(nuevoRolId) === usuario.rol_id) {
      alert('⚠️ El usuario ya tiene ese rol asignado');
      return;
    }
    onReasignar(usuario.id, parseInt(nuevoRolId));
  };


  // ✅ FUNCIÓN MEJORADA para obtener el nombre del rol actual
  const getRolNombre = (usuario) => {
    if (usuario.rol_nombre) return usuario.rol_nombre;        // caso: backend devuelve rol_nombre
    if (usuario.rol?.nombre) return usuario.rol.nombre;        // caso: backend devuelve objeto rol
    const rol = roles.find(r => r.id_rol === usuario.rol_id);  // caso: backend devuelve solo rol_id
    return rol ? rol.nombre : 'Sin rol asignado';
  };

  // ✅ FUNCIÓN para aplicar clases de color según el rol
  const getBadgeClass = (rolNombre) => {
    if (!rolNombre) return 'badge';
    const nombre = rolNombre.toLowerCase();
    if (nombre.includes('admin')) return 'badge rol-administrador';
    if (nombre.includes('editor')) return 'badge rol-editor';
    if (nombre.includes('periodista')) return 'badge rol-periodista';
    if (nombre.includes('fotografo')) return 'badge rol-fotografo';
    return 'badge';
  };

  const rolActual = getRolNombre(usuario);

  return (
    <tr>
      <td>{usuario.nombre} {usuario.apellido}</td>
      <td>{usuario.email}</td>
      <td>
        <span className={getBadgeClass(rolActual)}>
          {rolActual}
        </span>
      </td>
      <td>
        <select 
          value={nuevoRolId}
          onChange={(e) => setNuevoRolId(e.target.value)}
          className="rol-select"
        >
          <option value="">Seleccionar nuevo rol</option>
          {roles.map(rol => (
            <option key={rol.id_rol} value={rol.id_rol}>
              {rol.nombre}
            </option>
          ))}
        </select>
      </td>
      <td>
        <button 
          onClick={handleReasignar}
          className="btn-actualizar"
          disabled={!nuevoRolId}
        >
          Actualizar
        </button>
      </td>
    </tr>
  );
}

