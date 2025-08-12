import { Router } from "express";
import { obtenerNotificaciones, marcarNotificacionLeida } from "../controllers/notificacion.controller.js";

const router = Router();

router.get("/:usuarioId", obtenerNotificaciones);
router.post("/marcar-leida", marcarNotificacionLeida);

export default router;
