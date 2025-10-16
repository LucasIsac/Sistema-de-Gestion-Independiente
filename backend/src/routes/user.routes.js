// 📁 routes/user.routes.js - YA APLICADO
import { trackUserActivity } from '../controllers/onlineUsers.controller.js';
import { Router } from 'express';
import {
  registrarUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerRoles,
  obtenerUsuariosTodos, 
  obtenerUsuario
} from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas públicas
router.post('/usuarios', registrarUsuario);

// ✅ RUTAS PROTEGIDAS CON TRACKING
router.get('/usuarios', verifyToken, trackUserActivity, obtenerUsuarios);
router.get('/usuarios/:id', verifyToken, trackUserActivity, obtenerUsuario);
router.put('/usuarios/:id', verifyToken, trackUserActivity, actualizarUsuario);
router.delete('/usuarios/:id', verifyToken, trackUserActivity, eliminarUsuario);
router.get('/roles', verifyToken, trackUserActivity, obtenerRoles);

export default router;