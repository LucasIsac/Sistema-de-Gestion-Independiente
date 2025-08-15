import { pool } from "../config/db.js";

export async function guardarComentarioEditor(req, res) {
  const { articulo_id, comentario, editor_id } = req.body;

  try {
    await pool.query(`
      INSERT INTO comentarioseditor (articulo_id, editor_id, comentario, fecha)
      VALUES ($1, $2, $3, NOW())
    `, [articulo_id, editor_id, comentario]);

    res.json({ success: true, message: 'Comentario guardado correctamente' });
  } catch (err) {
    console.error('Error al guardar comentario:', err);
    res.status(500).json({ message: 'Error al guardar el comentario' });
  }
}
