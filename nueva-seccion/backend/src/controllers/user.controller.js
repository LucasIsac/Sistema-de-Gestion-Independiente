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