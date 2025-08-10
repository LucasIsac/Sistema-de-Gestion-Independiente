// src/controllers/articulo.controller.js
import { pool } from "../config/db.js";

export async function obtenerArticulosEnRevision(req, res) {
  try {
    const query = `
      SELECT 
        a.id_articulo,
        a.titulo,
        a.ruta_archivo,
        a.estado,
        a.fecha_creacion,
        a.fecha_modificacion,
        a.nombre_archivo,
        a.tipo_archivo,
        a.tamaño_archivo,
        a.fecha_subida,
        u.nombre AS nombre_periodista,
        u.apellido AS apellido_periodista
      FROM articulos a
      JOIN usuarios u ON a.periodista_id = u.id_usuario
      WHERE a.estado = 'En revisión'
    `;

    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ Error al obtener artículos en revisión:', err);
    res.status(500).json({ message: 'Error al obtener artículos en revisión' });
  }
}

// ✅ Nueva función para cambiar estado
export async function actualizarEstadoArticulo(req, res) {
  const { articulo_id, estado } = req.body;

  try {
    await pool.query(`
      UPDATE articulos
      SET estado = $1, fecha_modificacion = NOW()
      WHERE id_articulo = $2
    `, [estado, articulo_id]);

    res.status(200).json({ success: true, message: `Artículo ${estado} correctamente` });
  } catch (err) {
    console.error('❌ Error al actualizar estado del artículo:', err);
    res.status(500).json({ message: 'Error al actualizar estado' });
  }
}
