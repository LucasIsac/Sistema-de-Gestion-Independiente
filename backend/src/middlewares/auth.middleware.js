import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "un_secreto_muy_seguro_para_jwt";

export async function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token requerido" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;

    // Verificación adicional: que el usuario aún exista en la BD y obtener su rol
    const { rows } = await pool.query(
      "SELECT id_usuario, rol_id FROM usuarios WHERE id_usuario = $1",
      [decoded.userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Usuario no existe" });
    }

    req.user = { id: rows[0].id_usuario, rol_id: rows[0].rol_id };

    next();
  } catch (err) {
    console.error("🔴 Error en verifyToken:", err.message);
    return res.status(401).json({
      message: "Token inválido o expirado",
      error: err.message,
    });
  }
}

export async function checkAdminRole(req, res, next) {
  try {
    const { rows } = await pool.query(
      "SELECT nombre FROM roles WHERE id_rol = $1",
      [req.user.rol_id]
    );

    if (rows.length === 0) {
      return res.status(403).json({ message: "Rol no válido" });
    }

    const roleName = rows[0].nombre;

    if (roleName.toLowerCase() !== "administrador") {
      return res
        .status(403)
        .json({ message: "Acceso denegado: se requiere rol de administrador" });
    }

    next();
  } catch (err) {
    console.error("🔴 Error en checkAdminRole:", err);
    res.status(500).json({ message: "Error al verificar rol" });
  }
}
