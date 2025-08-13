//..src/controllers/file.controller.js
import { pool } from "../config/db.js" 
import path from "path"

export const uploadArticle = async (req, res) => {
  try {
    console.log("Datos recibidos en backend:", {
      body: req.body,
      file: req.file ? req.file.originalname : "No hay archivo"
    });

    if (!req.file) {
      return res.status(400).json({ message: "No se subió ningún archivo" });
    }

    const titulo = req.body.titulo || req.body.texto; 
    const categoria_id = req.body.categoria_id;

    if (!titulo || !categoria_id) {
      return res.status(400).json({ 
        message: "Faltan campos obligatorios (título o categoría)" 
      });
    }

    const now = new Date();
    const query = `
      INSERT INTO articulos (
        titulo, periodista_id, categoria_id,
        tipo_archivo, nombre_archivo, nombre_original,
        ruta_archivo, tamaño_archivo, fecha_creacion, fecha_modificacion
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;

    const values = [
      titulo.trim(),
      req.userId,
      Number(categoria_id),
      req.file.mimetype,
      req.file.filename,
      req.file.originalname,
      req.file.path,
      req.file.size,
      now,
      now
    ];

    // 5. Ejecutar la consulta
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);

  } catch (error) {
    console.error("❌ Error en uploadArticle:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};


export const getMyArticles = async (req, res) => {
  try {
    console.log("🔍 DEBUG - userId:", req.userId)
    
    const periodista_id = req.userId
    const result = await pool.query("SELECT * FROM articulos WHERE periodista_id = $1", [periodista_id])
    
    console.log("🔍 DEBUG - Query result:", result)
    console.log("🔍 DEBUG - Rows:", result.rows)
    console.log("🔍 DEBUG - Rows length:", result.rows.length)
    
    res.json(result.rows)
  } catch (error) {
    console.error("❌ Error al obtener artículos:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

export const downloadArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT ruta_archivo, nombre_original, tipo_archivo 
       FROM articulos 
       WHERE id_articulo = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Artículo no encontrado" });
    }

    const { ruta_archivo, nombre_original, tipo_archivo } = result.rows[0];
    
    res.download(ruta_archivo, nombre_original, {
      headers: {
        'Content-Type': tipo_archivo // MIME type correcto
      }
    });

  } catch (error) {
    console.error("Error al descargar:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const viewArticle = async (req, res) => {
  try {
    const { id } = req.params
    const result = await pool.query("SELECT * FROM articulos WHERE id_articulo = $1 AND periodista_id = $2", [
      id,
      req.userId,
    ])

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Artículo no encontrado" })
    }

    const article = result.rows[0]
    res.sendFile(path.resolve(article.ruta_archivo))
  } catch (error) {
    console.error("❌ Error al ver archivo:", error)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

export const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // Validación de ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: "ID de artículo inválido" });
    }

    // 1. Verificar existencia y permisos
    const articleQuery = await pool.query(
      `SELECT ruta_archivo, periodista_id 
       FROM articulos 
       WHERE id_articulo = $1 
       AND (periodista_id = $2 OR $2 IN (
         SELECT id_usuario FROM usuarios WHERE rol_id = 1
       ))`,
      [parseInt(id), userId]
    );

    if (articleQuery.rows.length === 0) {
      return res.status(403).json({ message: "No autorizado o artículo no existe" });
    }

    // 2. Eliminar archivo físico
    const filePath = articleQuery.rows[0].ruta_archivo;
    if (filePath) {
      try {
        await fs.promises.unlink(filePath);
      } catch (fsError) {
        console.warn("No se pudo eliminar el archivo físico:", fsError.message);
      }
    }

    // 3. Eliminar de la BD
    await pool.query('DELETE FROM articulos WHERE id_articulo = $1', [parseInt(id)]);

    res.json({ success: true, message: "Artículo eliminado correctamente" });

  } catch (error) {
    console.error("Error completo:", error);
    res.status(500).json({ message: "Error al procesar la eliminación" });
  }
};