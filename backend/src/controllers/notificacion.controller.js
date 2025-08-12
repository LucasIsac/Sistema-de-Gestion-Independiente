import { pool } from "../config/db.js";

// Crear notificación (1 usuario, grupo o todos)
export async function crearNotificacion(req, res) {
  const { titulo, mensaje, tipoDestino, valorDestino } = req.body;

  try {
    let usuariosDestino = [];

    if (tipoDestino === "usuario") {
      usuariosDestino = [valorDestino];
    } 
    else if (tipoDestino === "grupo") {
      const { rows } = await pool.query(
        "SELECT id_usuario FROM usuarios u JOIN roles r ON u.rol_id = r.id_rol WHERE r.nombre = $1",
        [valorDestino]
      );
      usuariosDestino = rows.map(u => u.id_usuario);
    } 
    else if (tipoDestino === "todos") {
      const { rows } = await pool.query("SELECT id_usuario FROM usuarios");
      usuariosDestino = rows.map(u => u.id_usuario);
    }

    // Insertar notificaciones
    for (const id of usuariosDestino) {
      await pool.query(`
        INSERT INTO notificaciones (titulo, mensaje, usuario_destino_id, leido, fecha)
        VALUES ($1, $2, $3, false, NOW())
      `, [titulo, mensaje, id]);
    }

    res.status(201).json({ message: "Notificaciones enviadas con éxito" });
  } catch (err) {
    console.error("❌ Error al crear notificación:", err);
    res.status(500).json({ message: "Error al crear notificación" });
  }
}


// Obtener notificaciones de un usuario
export async function obtenerNotificaciones(req, res) {
  const { usuarioId } = req.params;
  try {
    const { rows } = await pool.query(`
      SELECT 
        id_notificacion,
        titulo,
        mensaje,
        usuario_destino_id,
        leido,
        TO_CHAR(fecha, 'YYYY-MM-DD HH24:MI:SS') AS fecha
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
