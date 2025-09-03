//src/routes/user.routes.js
import { Router } from 'express';
import {
  registrarUsuario,
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,  // Asegúrate de importar esta función del controlador
  obtenerRoles,
} from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas públicas
router.post('/usuarios', registrarUsuario); // Registro puede ser público

// Rutas protegidas (requieren autenticación)
router.get('/usuarios', verifyToken, obtenerUsuarios);  // Obtener todos los usuarios
router.get('/usuarios/:id', verifyToken, obtenerUsuario);  // Obtener un usuario específico
router.put('/usuarios/:id', verifyToken, actualizarUsuario);  // Actualizar usuario
router.delete('/usuarios/:id', verifyToken, eliminarUsuario);  // Eliminar usuario
router.get('/roles', obtenerRoles);

export default router;
