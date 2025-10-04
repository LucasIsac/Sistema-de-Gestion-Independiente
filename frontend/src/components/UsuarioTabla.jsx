import React from "react";

export default function UsuarioTabla({ usuarios, onEditar, onEliminar }) {
  return (
    <table className="tabla-usuarios">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Email</th>
          <th>Teléfono</th>
          <th>Rol</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.length > 0 ? (
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
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="7" style={{ textAlign: 'center' }}>
              No hay usuarios registrados
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}