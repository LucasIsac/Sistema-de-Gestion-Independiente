import express from "express"
import { enviarMensaje, obtenerMensajes, marcarLeido } from "../controllers/mensajes.controller.js"
import { verifyToken } from "../middlewares/auth.middleware.js"

const router = express.Router()

// 🔐 RUTAS CON AUTENTICACIÓN
router.post("/", verifyToken, enviarMensaje) // Enviar mensaje
router.get("/:emisorId/:receptorId", verifyToken, obtenerMensajes) // Obtener mensajes entre 2 usuarios
router.put("/:id/leido", verifyToken, marcarLeido) // Marcar como leído

// ✅ Exportación ESM
export default router
