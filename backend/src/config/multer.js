import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: './uploads/articles/',
  filename: (req, file, cb) => {
    const fileHash = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`; 
    const fileExt = path.extname(file.originalname); 
    cb(null, `${fileHash}${fileExt}`); 
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
      'application/pdf',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos DOC, DOCX, PDF o TXT'), false);
    }
  }
});