import { pool } from "../config/db.js";

// Enviar un mensaje
export const enviarMensaje = async (req, res) => {
  try {
    const { emisor_id, receptor_id, contenido } = req.body;

    if (!emisor_id || !receptor_id || !contenido) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const result = await pool.query(
      `INSERT INTO mensajes (emisor_id, receptor_id, contenido) 
       VALUES ($1, $2, $3) RETURNING *`,
      [emisor_id, receptor_id, contenido]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al enviar mensaje" });
  }
};

// Obtener mensajes entre dos usuarios
export const obtenerMensajes = async (req, res) => {
  try {
    const { emisorId, receptorId } = req.params;

    const result = await pool.query(
      `SELECT * FROM mensajes 
       WHERE (emisor_id = $1 AND receptor_id = $2) 
          OR (emisor_id = $2 AND receptor_id = $1)
       ORDER BY fecha ASC`,
      [emisorId, receptorId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener mensajes" });
  }
};

// Marcar mensaje como leído
export const marcarLeido = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE mensajes SET leido = TRUE WHERE id_mensaje = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Mensaje no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al marcar mensaje como leído" });
  }
};
