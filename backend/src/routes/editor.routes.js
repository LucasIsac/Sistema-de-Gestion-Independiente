// src/routes/editor.routes.js
import { Router } from 'express';
import { obtenerArticulosEnRevision } from '../controllers/articulo.controller.js';
import { guardarComentarioEditor } from '../controllers/comentario.controller.js';

const router = Router();

router.get('/articulos/en-revision', obtenerArticulosEnRevision);

router.post('/comentarios-editor', guardarComentarioEditor);

export default router;
