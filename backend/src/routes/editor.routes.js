// src/routes/editor.routes.js
import { Router } from 'express';
import { obtenerArticulosEnRevision } from '../controllers/articulo.controller.js';
<<<<<<< HEAD
import { guardarComentarioEditor } from '../controllers/comentario.controller.js';
=======
import { guardarComentarioEditor} from '../controllers/comentario.controller.js';
import { actualizarEstadoArticulo } from '../controllers/articulo.controller.js';
>>>>>>> origin/main

const router = Router();

// Ruta para obtener artículos "En revisión"
router.get('/articulos/en-revision', obtenerArticulosEnRevision);

<<<<<<< HEAD
=======
// Ruta para actualizar estado del artículo
router.post('/articulos/estado', actualizarEstadoArticulo);

>>>>>>> origin/main
// Ruta para guardar comentario del editor
router.post('/comentarios-editor', guardarComentarioEditor);

export default router;
