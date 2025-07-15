import { Router } from 'express';
import { registrarUsuario } from '../controllers/user.controller.js';

const router = Router();

router.post('/users', registrarUsuario);

export default router;
