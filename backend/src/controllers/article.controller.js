// src/controllers/article.controller.js
import Article from '../models/article.model.js';
import {pool} from '../config/db.js';

const getMyArticles = async (req, res) => {
  try {
    const periodistaId = req.user.id;
    const articulos = await Article.findByPeriodista(periodistaId);
    
    res.json({
      message: 'Artículos obtenidos exitosamente',
      articles: articulos,
      total: articulos.length
    });
  } catch (error) {
    console.error('❌ Error al obtener artículos:', error);
    res.status(500).json({ message: 'Error al obtener artículos' });
  }
};

const getArticleById = async (req, res) => {
  try {
    const periodistaId = req.user.id;
    const articleId = req.params.id;

    const articulo = await Article.findById(articleId);

    if (!articulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    // Verificar que el artículo pertenezca al periodista
    if (articulo.periodista_id !== periodistaId) {
      return res.status(403).json({ message: 'No tienes permiso para ver este artículo' });
    }

    res.json({
      message: 'Artículo obtenido exitosamente',
      article: articulo
    });
  } catch (error) {
    console.error('Error al obtener artículo:', error);
    res.status(500).json({ message: 'Error al obtener artículo' });
  }
};

const updateArticle = async (req, res) => {
  try {
    const periodistaId = req.user.id;
    const articleId = req.params.id;
    const datos = req.body;

    // Verificar que el artículo existe y pertenece al periodista
    const articulo = await Article.findById(articleId);

    if (!articulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    if (articulo.periodista_id !== periodistaId) {
      return res.status(403).json({ message: 'No tienes permiso para modificar este artículo' });
    }

    // Agregar fecha de modificación
    datos.fecha_modificacion = new Date();

    const ok = await Article.update(articleId, datos);

    if (!ok) {
      return res.status(500).json({ message: 'No se pudo actualizar el artículo' });
    }

    res.json({ message: 'Artículo actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar artículo:', error);
    res.status(500).json({ message: 'Error al actualizar artículo' });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const periodistaId = req.user.id;
    const articleId = req.params.id;

    // Verificar que el artículo existe y pertenece al periodista
    const articulo = await Article.findById(articleId);

    if (!articulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    if (articulo.periodista_id !== periodistaId) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este artículo' });
    }

    // Soft delete - cambiar estado a 'eliminado'
    const ok = await Article.update(articleId, { 
      estado: 'eliminado',
      fecha_modificacion: new Date()
    });

    if (!ok) {
      return res.status(500).json({ message: 'No se pudo eliminar el artículo' });
    }

    res.json({ message: 'Artículo eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar artículo:', error);
    res.status(500).json({ message: 'Error al eliminar artículo' });
  }
};

// Función adicional para cambiar estado del artículo (borrador -> publicado, etc.)
const changeArticleStatus = async (req, res) => {
  try {
    const periodistaId = req.user.id;
    const articleId = req.params.id;
    const { estado } = req.body;

    // Validar estados permitidos
    const estadosValidos = ['borrador', 'revision', 'publicado', 'archivado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ 
        message: 'Estado no válido', 
        estadosPermitidos: estadosValidos 
      });
    }

    const articulo = await Article.findById(articleId);

    if (!articulo) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    if (articulo.periodista_id !== periodistaId) {
      return res.status(403).json({ message: 'No tienes permiso para modificar este artículo' });
    }

    const ok = await Article.update(articleId, { 
      estado,
      fecha_modificacion: new Date()
    });

    if (!ok) {
      return res.status(500).json({ message: 'No se pudo cambiar el estado del artículo' });
    }

    res.json({ 
      message: `Estado del artículo cambiado a: ${estado}` 
    });
  } catch (error) {
    console.error('Error al cambiar estado del artículo:', error);
    res.status(500).json({ message: 'Error al cambiar estado del artículo' });
  }
};

export {
  getMyArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  changeArticleStatus
};