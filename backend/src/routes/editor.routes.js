// src/routes/editor.routes.js
import { Router } from 'express';
import { obtenerArticulosEnRevision } from '../controllers/articulo.controller.js';
import { guardarComentarioEditor} from '../controllers/comentario.controller.js';
import { actualizarEstadoArticulo } from '../controllers/articulo.controller.js';

const router = Router();

router.get('/articulos/en-revision', obtenerArticulosEnRevision);
// Ruta para actualizar estado del artículo
router.post('/articulos/estado', actualizarEstadoArticulo);

router.post('/comentarios-editor', guardarComentarioEditor);

export default router;
