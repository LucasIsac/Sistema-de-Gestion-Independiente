//Registrar usuario
import { Router } from 'express';
import { registrarUsuario } from '../controllers/user.controller.js';

const router = Router();

import {
  actualizarUsuario,
  obtenerUsuario,
  obtenerUsuarios
} from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

// Agrega estas rutas nuevas:
router.get('/usuarios', obtenerUsuarios);
router.get('/users/:id', verifyToken, obtenerUsuario);
router.put('/users/:id', verifyToken, actualizarUsuario);

// Mantén tu ruta existente:
router.post('/users', registrarUsuario);

export default router;
