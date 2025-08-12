import { pool } from "../config/db.js";

// Crear notificación
export async function crearNotificacion(titulo, mensaje, usuarioDestinoId) {
  try {
    await pool.query(`
      INSERT INTO notificaciones (titulo, mensaje, usuario_destino_id, leido, fecha)
      VALUES ($1, $2, $3, false, NOW())
    `, [titulo, mensaje, usuarioDestinoId]);
  } catch (err) {
    console.error("❌ Error al crear notificación:", err);
  }
}

// Obtener notificaciones de un usuario
export async function obtenerNotificaciones(req, res) {
  const { usuarioId } = req.params;
  try {
    const { rows } = await pool.query(`
      SELECT * 
      FROM notificaciones
      WHERE usuario_destino_id = $1
      ORDER BY fecha DESC
    `, [usuarioId]);

    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ Error al obtener notificaciones:", err);
    res.status(500).json({ message: "Error al obtener notificaciones" });
  }
}

// Marcar como leída
export async function marcarNotificacionLeida(req, res) {
  const { id_notificacion } = req.body;
  try {
    await pool.query(`
      UPDATE notificaciones
      SET leido = true
      WHERE id_notificacion = $1
    `, [id_notificacion]);

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Error al marcar notificación como leída:", err);
    res.status(500).json({ message: "Error al actualizar notificación" });
  }
}
