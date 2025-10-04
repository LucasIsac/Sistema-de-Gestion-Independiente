import express from 'express';
import multer from 'multer';
import { pool } from '../config/db.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/avatars/' }); // Ajusta la ruta según tu estructura

router.post('/upload-avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.userId;
    const avatarPath = req.file.path;

    // Actualiza la URL del avatar en la base de datos
    await pool.query(
      'UPDATE usuarios SET avatar_url = $1 WHERE id_usuario = $2 RETURNING avatar_url',
      [avatarPath, userId]
    );

    res.json({ 
      success: true,
      avatarUrl: `/avatars/${req.file.filename}` // Ruta pública accesible
    });
  } catch (error) {
    console.error('Error subiendo avatar:', error);
    res.status(500).json({ success: false, message: 'Error al subir imagen' });
  }
});