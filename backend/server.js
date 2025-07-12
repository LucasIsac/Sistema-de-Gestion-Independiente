const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
const nodemailer = require('nodemailer'); 
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Añadido para hashing

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false 
  } 
});
const JWT_SECRET = process.env.JWT_SECRET || 'un_secreto_muy_seguro_para_jwt';
const saltRounds = 10; // Para bcrypt

// Probar conexión a la base de datos
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Error conectando a la base de datos:', err.stack);
  } else {
    console.log('✅ Conexión exitosa a PostgreSQL');
    release();
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando 👌');
});

// Ruta de login corregida
// ... dentro de app.post('/login', ...)
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
      // --- DEPURACIÓN LOGIN ---
      console.log('--- DEPURACIÓN LOGIN ---');
      console.log('Recibido del frontend:');
      console.log('  Email:', email, '(Tipo:', typeof email, ')');
      console.log('  Password:', password, '(Tipo:', typeof password, ')');
      // ------------------------

      const userResult = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

      if (userResult.rows.length === 0) {
          console.log('❌ Login Fallido: Email no encontrado en la BD para:', email);
          return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }

      const user = userResult.rows[0];

      // --- DEPURACIÓN LOGIN ---
      console.log('Obtenido de la base de datos:');
      console.log('  Email BD:', user.email);
      console.log('  Contraseña BD (hash):', user.contraseña);
      // ------------------------

      // Comparar contraseña hasheada
      const isMatch = await bcrypt.compare(password, user.contraseña);

      // --- DEPURACIÓN LOGIN ---
      console.log('Resultado de bcrypt.compare (isMatch):', isMatch);
      console.log('------------------------');
      // ------------------------

      if (!isMatch) {
          console.log('❌ Login Fallido: Contraseña no coincide para email:', email);
          return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
      }

      const token = jwt.sign({ id_usuario: user.id_usuario }, JWT_SECRET, { expiresIn: '1h' });

      res.json({
          success: true,
          token,
          user: {
              id: user.id_usuario,
              nombre: user.nombre,
              apellido: user.apellido
          }
      });

  } catch (error) {
      console.error('💥 Error en login:', error);
      res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

// Ruta para recuperación de contraseña (sin cambios)
app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const userResult = await pool.query('SELECT id_usuario, usuario, nombre FROM usuarios WHERE email = $1 AND activo = true', [email]);
    if (userResult.rows.length === 0) {
      console.log(`⚠️ Solicitud de recuperación para email no encontrado: ${email}`);
      return res.status(200).json({ success: true, message: 'Si el email está registrado, recibirás un enlace para restablecer tu contraseña.' });
    }
    const user = userResult.rows[0];

    const resetToken = jwt.sign({ id_usuario: user.id_usuario }, JWT_SECRET, { expiresIn: '1h' });

    await pool.query('UPDATE tokensrecuperacion SET usado = true WHERE usuario_id = $1 AND usado = false', [user.id_usuario]); // <--- CAMBIO AQUÍ
    await pool.query(
    'INSERT INTO tokensrecuperacion (usuario_id, token, fecha_creacion, fecha_expiracion, usado) VALUES ($1, $2, NOW(), NOW() + INTERVAL \'1 hour\', FALSE)', // <--- CAMBIO AQUÍ
    [user.id_usuario, resetToken]
    );
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Restablecer tu contraseña del Diario El Independiente',
      html: `
        <p>Hola ${user.nombre},</p>
        <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en el Sistema de Gestión de Archivos del Diario El Independiente.</p>
        <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste este cambio, por favor ignora este correo.</p>
        <p>Saludos,</p>
        <p>El equipo del Diario El Independiente</p>
      `,
    });

    console.log(`✅ Correo de recuperación enviado a: ${email}`);
    res.json({ success: true, message: 'Si el email está registrado, recibirás un enlace para restablecer tu contraseña.' });

  } catch (error) {
    console.error('💥 Error en forgot-password:', error);
    res.status(500).json({ success: false, message: 'Error del servidor al solicitar recuperación.', error: error.message });
  }
});


app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Faltan el token o la nueva contraseña.' });
  }

  try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id_usuario;

      const tokenResult = await pool.query(
          'SELECT * FROM tokensrecuperacion WHERE token = $1 AND usuario_id = $2 AND usado = FALSE AND fecha_expiracion > NOW()',
          [token, userId] // <--- ¡AÑADE ESTO AQUÍ!
      );

      if (tokenResult.rows.length === 0) {
          console.log('❌ Token inválido, usado o expirado para restablecimiento.');
          return res.status(400).json({ success: false, message: 'El enlace de restablecimiento es inválido o ha expirado. Por favor, solicita uno nuevo.' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // --- DEPURACIÓN (puedes eliminar estas líneas una vez que todo funcione) ---
      console.log('--- DEPURACIÓN RESET-PASSWORD ---');
      console.log('Valor de newPassword recibido:', newPassword, '(Tipo:', typeof newPassword, ')');
      console.log('Valor de hashedPassword generado:', hashedPassword, '(Tipo:', typeof hashedPassword, ')');
      console.log('Valor de userId del token:', userId, '(Tipo:', typeof userId, ')');
      console.log('---------------------------------');
      // ------------------------------------------------------------------------

      // Esta es la ÚNICA LÍNEA de UPDATE de contraseña que debe ir
      await pool.query('UPDATE usuarios SET contraseña = $1 WHERE id_usuario = $2', [hashedPassword, userId]);

      // Esta línea es para marcar el token como usado
      await pool.query('UPDATE tokensrecuperacion SET usado = TRUE WHERE token = $1', [token]);

      console.log(`✅ Contraseña restablecida (y hasheada) para usuario ID: ${userId}`);
      res.json({ success: true, message: 'Tu contraseña ha sido restablecida exitosamente.' });

  } catch (error) {
      if (error.name === 'TokenExpiredError') {
          return res.status(400).json({ success: false, message: 'El enlace de restablecimiento ha expirado. Por favor, solicita uno nuevo.' });
      }
      console.error('💥 Error en reset-password:', error);
      res.status(500).json({ success: false, message: 'Error del servidor al restablecer contraseña.', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
  console.log('🔧 Variables de entorno cargadas:');
  console.log(`    - DB_HOST: ${process.env.DB_HOST}`);
  console.log(`    - DB_PORT: ${process.env.DB_PORT}`);
  console.log(`    - DB_USER: ${process.env.DB_USER}`);
  console.log(`    - DB_NAME: ${process.env.DB_NAME}`);
  console.log(`    - DB_PASSWORD: ${process.env.DB_PASSWORD ? '***' : 'NO DEFINIDA'}`);
  console.log(`    - EMAIL_USER: ${process.env.EMAIL_USER ? '***' : 'NO DEFINIDA'}`); 
  console.log(`    - JWT_SECRET: ${process.env.JWT_SECRET ? '***' : 'NO DEFINIDA'}`); 
});