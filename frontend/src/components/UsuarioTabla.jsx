import React from "react";

export default function UsuarioTabla({ usuarios, onEditar, onEliminar }) {
  return (
    <table className="tabla-usuarios">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Email</th>
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
              <td>{u.email}</td>
              <td>{u.rol}</td>
              <td>
                <button onClick={() => onEditar(u)}>Editar</button>
                <button
                  className="eliminar"
                  onClick={() => onEliminar(u.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">No hay usuarios</td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
