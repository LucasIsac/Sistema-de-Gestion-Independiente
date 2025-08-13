import express from "express"
import { uploadArticle, getMyArticles, downloadArticle, viewArticle } from "../controllers/file.controllers.js"
import { verifyToken } from "../middlewares/auth.middleware.js"
import multer from "multer"
import path from "path"
import { deleteArticle } from "../controllers/file.controllers.js"

const router = express.Router()

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/articles/")
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB límite
  },
})

// 🔐 RUTAS CON AUTENTICACIÓN
router.post("/upload", verifyToken, upload.single("archivo"), uploadArticle)
router.get("/my", verifyToken, getMyArticles)
router.get("/download/:id", verifyToken, downloadArticle)
router.get("/view/:id", verifyToken, viewArticle)
router.delete("/:id",verifyToken,deleteArticle);

// ✅ CAMBIO PRINCIPAL: usar export default
export default router