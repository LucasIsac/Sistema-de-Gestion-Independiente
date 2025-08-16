//Registrar usuario
import bcrypt from 'bcryptjs';
import {
  findByUsuario,
  findByEmail,
  createUser,
} from '../models/user.model.js';

const saltRounds = 10;

export async function registrarUsuario(req, res) {
  const { nombre, apellido, usuario, contraseña, email, rol } = req.body;

  // 1. Validación básica
  if (!nombre || !apellido || !usuario || !contraseña || !email || !rol) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  try {
    // 2. Verificar duplicados
    if (await findByUsuario(usuario))
      return res.status(409).json({ message: 'Nombre de usuario ya existe' });

    if (await findByEmail(email))
      return res.status(409).json({ message: 'El email ya existe' });

    // 3. Hash de la contraseña
    const passwordHash = await bcrypt.hash(contraseña, saltRounds);

    // 4. Insertar en BD
    const nuevo = await createUser({
      nombre,
      apellido,
      usuario,
      passwordHash,
      email,
      rolId: rol,
    });

    // 5. Respuesta (sin contraseña)
    res.status(201).json({ message: 'Usuario creado', usuario: nuevo });
  } catch (err) {
    console.error('💥 registrarUsuario:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
}

// Agrega estos nuevos métodos al final, sin modificar lo existente:

import { pool } from '../config/db.js';

export async function obtenerUsuario(req, res) {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT id_usuario, nombre, apellido, email, telefono 
       FROM usuarios WHERE id_usuario = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ usuario: rows[0] });
  } catch (err) {
    console.error('💥 obtenerUsuario:', err);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
}

export async function actualizarUsuario(req, res) {
  const { id } = req.params;
  
  // Validación robusta del ID
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: 'ID de usuario inválido' });
  }

  const { nombre, apellido, email, telefono, password } = req.body;

  try {
    // 1. Verificar usuario existe
    const userCheck = await pool.query(
      'SELECT id_usuario, contraseña FROM usuarios WHERE id_usuario = $1',
      [id]
    );
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 2. Verificar contraseña
    const isValid = await bcrypt.compare(password, userCheck.rows[0].contraseña);
    if (!isValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // 3. Actualizar
    const { rows } = await pool.query(
      `UPDATE usuarios 
       SET nombre = $1, apellido = $2, email = $3, telefono = $4
       WHERE id_usuario = $5
       RETURNING id_usuario, nombre, apellido, email, telefono`,
      [nombre, apellido, email, telefono, id]
    );

    res.json({ usuario: rows[0] });
  } catch (err) {
    console.error('💥 actualizarUsuario:', err);
    res.status(500).json({ 
      message: 'Error al actualizar usuario',
      error: err.message // ← Detalle del error para debugging
    });
  }
}

export async function obtenerUsuarios(req, res) {
  try {
    const { rows } = await pool.query('SELECT id_usuario as id, nombre, apellido, email FROM usuarios');
    res.json(rows);
  } catch (err) {
    console.error('💥 obtenerUsuarios:', err);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
}
