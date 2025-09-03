import express from 'express';
import {
  uploadFoto,
  getMyFotos,
  getFotosGlobales,
  getFotoById,
  toggleVisibilidadFoto,
  deleteFoto,
  downloadFoto,
  viewFoto
} from '../controllers/foto.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { uploadFoto as uploadMiddleware } from '../config/multer-fotos.js';

const router = express.Router();

// Rutas para fotógrafos
router.post('/upload', verifyToken, uploadMiddleware.single('archivo'), uploadFoto);
router.get('/my', verifyToken, getMyFotos);
router.put('/:id/toggle-visibility', verifyToken, toggleVisibilidadFoto);
router.delete('/:id', verifyToken, deleteFoto);
router.get('/view/:id', verifyToken, viewFoto);

// Rutas públicas (para periodistas)
router.get('/global', verifyToken, getFotosGlobales);
router.get('/:id', verifyToken, getFotoById);
router.get('/download/:id', verifyToken, downloadFoto);

export default router;