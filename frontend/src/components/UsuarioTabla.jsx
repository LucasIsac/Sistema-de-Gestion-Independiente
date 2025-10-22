import React from "react";

export default function UsuarioTabla({ usuarios, onEditar, onEliminar }) {
  // Función para mapear rol_id a nombre de rol
  const getRolNombre = (rolId) => {
    const rolesMap = {
      1: 'Administrador',
      2: 'Periodista', 
      3: 'Fotógrafo',
      4: 'Editor'
    };
    return rolesMap[rolId] || 'Desconocido';
  };

  const handleEliminarClick = (usuario) => {
    if (!usuario.id) {
      alert("Error: ID de usuario no válido");
      return;
    }
    
    onEliminar(usuario.id);
  };

  return (
    <table className="tabla-usuarios">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
<<<<<<< HEAD
          <th>Usuario</th>
=======
          <th>Apellido</th>
>>>>>>> 653dc6f1da51637806ddb03f566bb237c6f103c0
          <th>Email</th>
          <th>Teléfono</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.length > 0 ? (
<<<<<<< HEAD
          usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre} {usuario.apellido}</td>
              <td>{usuario.usuario}</td>
              <td>{usuario.email}</td>
              <td>{getRolNombre(usuario.rol_id)}</td>
              <td>
                <button onClick={() => onEditar(usuario)}>Editar</button>
                <button
                  className="eliminar"
                  onClick={() => handleEliminarClick(usuario)}
                >
                  Eliminar
                </button>
=======
          usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.apellido}</td>
              <td>{u.email}</td>
              <td>{u.telefono}</td>
              <td>{u.rol}</td>
              <td>
                <div className="acciones-celda">
                  <button
                    className="editar"
                    onClick={() => onEditar(u)}
                    title="Editar usuario"
                  >
                    <i className="fas fa-edit"></i> Editar
                  </button>
                  <button
                    className="eliminar"
                    onClick={() => onEliminar(u.id)}
                    title="Eliminar usuario"
                  >
                    <i className="fas fa-trash-alt"></i> Eliminar
                  </button>
                </div>
>>>>>>> 653dc6f1da51637806ddb03f566bb237c6f103c0
              </td>
            </tr>
          ))
        ) : (
          <tr>
<<<<<<< HEAD
            <td colSpan="6">No hay usuarios</td>
=======
            <td colSpan="7" style={{ textAlign: 'center' }}>
              No hay usuarios registrados
            </td>
>>>>>>> 653dc6f1da51637806ddb03f566bb237c6f103c0
          </tr>
        )}
      </tbody>
    </table>
  );
}