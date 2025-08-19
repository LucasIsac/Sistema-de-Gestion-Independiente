//src/models/user.model.js
import { pool } from '../config/db.js';

export async function findByUsuario(oUsuario) {
  const { rows } = await pool.query(
    'SELECT id_usuario FROM usuarios WHERE usuario = $1',
    [oUsuario],
  );
  return rows[0] ?? null;
}

export async function findByEmail(email) {
  const { rows } = await pool.query(
    'SELECT id_usuario FROM usuarios WHERE email = $1',
    [email],
  );
  return rows[0] ?? null;
}

export async function createUser({ nombre, apellido, usuario, passwordHash, email, telefono, rolId }) {
  const { rows } = await pool.query(
    `INSERT INTO usuarios 
     (nombre, apellido, usuario, contraseña, email, telefono, rol_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id_usuario, nombre, apellido, email, telefono, rol_id, fecha_creacion`,
    [nombre, apellido, usuario, passwordHash, email, telefono, rolId]
  );
  return rows[0];
}

export async function findAll() {
  const { rows } = await pool.query(`
    SELECT 
      u.id_usuario as id, 
      u.nombre, 
      u.apellido, 
      u.email, 
      u.telefono,
      r.nombre as rol
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.id_rol
    ORDER BY u.id_usuario
  `);
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query(
    `SELECT id_usuario, nombre, apellido, email, telefono 
     FROM usuarios WHERE id_usuario = $1`,
    [id]
  );
  return rows[0];
}

export async function updateUser(id, { nombre, apellido, email, telefono, rol_id }) {
  const { rows } = await pool.query(
    `UPDATE usuarios 
     SET nombre = $1, apellido = $2, email = $3, telefono = $4, rol_id = $5
     WHERE id_usuario = $6
     RETURNING id_usuario as id, nombre, apellido, email, telefono, rol_id, fecha_creacion as "fechaCreacion"`,
    [nombre, apellido, email, telefono, rol_id, id]
  );
  return rows[0];
}

export async function deleteUser(id) {
  const result = await pool.query(
    'DELETE FROM usuarios WHERE id_usuario = $1 RETURNING id_usuario',
    [id]
  );
  return result.rowCount;
}
