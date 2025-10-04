// src/test-upload.js
import express from 'express';
import multer from 'multer';

const app = express();

// MULTER SÚPER BÁSICO
const upload = multer({ dest: './uploads/' });

// ENDPOINT DE PRUEBA
app.post('/test-upload', upload.single('archivo'), (req, res) => {
  console.log('🔍 req.file:', req.file);
  console.log('🔍 req.body:', req.body);
  
  if (req.file) {
    res.json({ 
      success: true, 
      file: req.file,
      body: req.body 
    });
  } else {
    res.json({ 
      success: false, 
      message: 'No file received' 
    });
  }
});

app.listen(3001, () => {
  console.log('🧪 Test server running on http://localhost:3001');
});