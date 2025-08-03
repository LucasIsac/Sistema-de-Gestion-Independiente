import { pool } from "../config/db.js";
export async function obtenerArticulosEnRevision(req, res) {
  try {
    const { rows } = await pool.query(`
      SELECT a.id_articulo, a.titulo, a.ruta, a.estado, a.fecha_creacion, a.fecha_modificacion,
             u.nombre AS nombre_periodista, u.apellido AS apellido_periodista
      FROM articulos a
      JOIN usuarios u ON a.periodista_id = u.id_usuario
      WHERE a.estado = 'En revisión'
    `);
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener artículos en revisión:', err);
    res.status(500).json({ message: 'Error al obtener artículos' });
  }
}

