import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'un_secreto_muy_seguro_para_jwt';

export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("🔍 DEBUG - Token decodificado:", decoded);
    
    // ✅ CAMBIO: extraer userId del token decodificado
    req.userId = decoded.userId || decoded.id || decoded.user_id;
    
    console.log("🔍 DEBUG - req.userId asignado:", req.userId);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}