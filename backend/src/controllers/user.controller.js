//src/controllers/user.controller.js
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { UPLOADS_PATH } from '../config/multer.js'; // Importar la ruta centralizada
import {
  findByUsuario,
  findByEmail,
  createUser,
  findAll,
  findById,
  updateUser,
  deleteUser,
  findRoles ,
} from '../models/user.model.js';
import { pool } from '../config/db.js';
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

    res.status(201).json({ 
      message: 'Usuario creado', 
      usuario: {
        id: nuevo.id_usuario,
        nombre: nuevo.nombre,
        apellido: nuevo.apellido,
        email: nuevo.email,
        telefono: nuevo.telefono,
      rol_id: nuevo.rol_id,
      }
    });

    // 5. Crear carpeta para el usuario usando la ruta centralizada
    try {
      const userFolderPath = path.join(UPLOADS_PATH, 'articles', nuevo.usuario);

      if (!fs.existsSync(userFolderPath)) {
        fs.mkdirSync(userFolderPath, { recursive: true });
        console.log(`📁 Carpeta creada para el usuario en ruta unificada: ${userFolderPath}`);
      }
    } catch (folderError) {
      console.error(`💥 No se pudo crear la carpeta para el usuario ${nuevo.usuario}:`, folderError);
    }

  } catch (err) {
    console.error('💥 registrarUsuario:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
}

export async function obtenerUsuario(req, res) {
  const { id } = req.params;

  try {
    const { rows } = await pool.query(
      `SELECT 
         u.id_usuario AS id,
         u.nombre,
         u.apellido,
         u.email,
         u.telefono,
         u.usuario,
         u.rol_id,
         r.nombre AS rol_nombre
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id_rol
       WHERE u.id_usuario = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ usuario: rows[0] });
  } catch (err) {
    console.error("💥 obtenerUsuario:", err);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
}

export async function actualizarUsuario(req, res) {
  const { id } = req.params;

  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: "ID de usuario inválido" });
  }

  // 🔧 Usar rol_id en vez de rol
  const { nombre, apellido, email, telefono, rol_id, usuario } = req.body;

  try {
    const userCheck = await pool.query(
      "SELECT id_usuario, usuario, email FROM usuarios WHERE id_usuario = $1",
      [id]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (usuario && usuario !== userCheck.rows[0].usuario) {
      const usuarioExistente = await pool.query(
        "SELECT id_usuario FROM usuarios WHERE usuario = $1 AND id_usuario != $2",
        [usuario, id]
      );
      if (usuarioExistente.rows.length > 0) {
        return res
          .status(409)
          .json({ message: "Nombre de usuario ya existe" });
      }
    }

    if (email && email !== userCheck.rows[0].email) {
      const emailExistente = await pool.query(
        "SELECT id_usuario FROM usuarios WHERE email = $1 AND id_usuario != $2",
        [email, id]
      );
      if (emailExistente.rows.length > 0) {
        return res.status(409).json({ message: "El email ya existe" });
      }
    }

    // ✅ Actualizar con rol_id
    const { rows } = await pool.query(
      `UPDATE usuarios 
       SET nombre = $1, apellido = $2, email = $3, telefono = $4, rol_id = $5, usuario = $6
       WHERE id_usuario = $7
       RETURNING id_usuario, nombre, apellido, email, telefono, rol_id, usuario`,
      [nombre, apellido, email, telefono, rol_id, usuario, id]
    );

    res.json({
      message: "Usuario actualizado correctamente",
      usuario: rows[0],
    });
  } catch (err) {
    console.error("💥 actualizarUsuario:", err);
    res.status(500).json({
      message: "Error al actualizar usuario",
      error: err.message,
    });
  }
}


export async function obtenerUsuarios(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT 
         u.id_usuario AS id,
         u.nombre,
         u.apellido,
         u.email,
         u.usuario,
         u.telefono,
         u.rol_id,
         r.nombre AS rol_nombre
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id_rol
       WHERE u.activo = true
       ORDER BY u.nombre, u.apellido`
    );
    res.json(rows);
  } catch (err) {
    console.error("💥 obtenerUsuarios:", err);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
}


export async function eliminarUsuario(req, res) {
  const { id } = req.params;

  try {
    // 1. Verificar que el usuario existe y está activo
    const userCheck = await pool.query(
      'SELECT id_usuario, nombre, apellido FROM usuarios WHERE id_usuario = $1 AND activo = true',
      [id]
    );
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado o ya desactivado' });
    }

    const { rows } = await pool.query(
      `UPDATE usuarios 
       SET activo = false
       WHERE id_usuario = $1
       RETURNING id_usuario, nombre, apellido`,
      [id]
    );

    res.json({ 
      message: 'Usuario desactivado correctamente',
      usuario: rows[0]
    });
  } catch (err) {
    console.error('💥 eliminarUsuario:', err);
    res.status(500).json({ message: 'Error al desactivar usuario' });
  }
}

export async function obtenerRoles(req, res) {
  try {
    const roles = await findRoles();
    console.log('✅ Roles obtenidos:', roles);
    res.json(roles);
  } catch (err) {
    console.error('💥 obtenerRoles:', err);
    res.status(500).json({ 
      message: 'Error al obtener roles',
      error: err.message 
    });
  }
}
