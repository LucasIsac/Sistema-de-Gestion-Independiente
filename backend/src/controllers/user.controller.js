import bcrypt from 'bcryptjs';
import {
  findByUsuario,
  findByEmail,
  createUser,
  findAll,
  findById,
  updateUser,
  deleteUser,
} from '../models/user.model.js';

const saltRounds = 10;

export async function registrarUsuario(req, res) {
  const { nombre, apellido, usuario, contraseña, email, telefono, rol_id } = req.body;

  if (!nombre || !apellido || !usuario || !contraseña || !email || !rol_id) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  try {
    if (await findByUsuario(usuario))
      return res.status(409).json({ message: 'Nombre de usuario ya existe' });

    if (await findByEmail(email))
      return res.status(409).json({ message: 'El email ya existe' });

    const passwordHash = await bcrypt.hash(contraseña, saltRounds);

    const nuevo = await createUser({
      nombre,
      apellido,
      usuario,
      passwordHash,
      email,
      telefono,
      rolId: rol_id,
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
        fechaCreacion: nuevo.fecha_creacion
      }
    });
  } catch (err) {
    console.error('💥 registrarUsuario:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
}

export async function obtenerUsuarios(req, res) {
  try {
    const usuarios = await findAll();
    res.json(usuarios);
  } catch (err) {
    console.error('💥 obtenerUsuarios:', err);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
}

export async function obtenerUsuario(req, res) {
  const { id } = req.params;

  try {
    const usuario = await findById(id);

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ usuario });
  } catch (err) {
    console.error('💥 obtenerUsuario:', err);
    res.status(500).json({ message: 'Error al obtener usuario' });
  }
}

export async function actualizarUsuario(req, res) {
  const { id } = req.params;
  
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ message: 'ID de usuario inválido' });
  }

  try {
    const usuarioActualizado = await updateUser(id, req.body);

    if (!usuarioActualizado) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ usuario: usuarioActualizado });
  } catch (err) {
    console.error('💥 actualizarUsuario:', err);
    res.status(500).json({ message: 'Error al actualizar usuario' });
  }
}

export async function eliminarUsuario(req, res) {
  const { id } = req.params;

  try {
    const rowCount = await deleteUser(id);

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('💥 eliminarUsuario:', err);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
}
