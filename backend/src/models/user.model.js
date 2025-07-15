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

export async function createUser({
  nombre,
  apellido,
  usuario,
  passwordHash,
  email,
  rolId,
}) {
  const { rows } = await pool.query(
    `INSERT INTO usuarios (nombre, apellido, usuario, contraseña, email, rol_id)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id_usuario, nombre, apellido, usuario, email, rol_id`,
    [nombre, apellido, usuario, passwordHash, email, rolId],
  );
  return rows[0];
}
