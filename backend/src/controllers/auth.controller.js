// 📁 controllers/auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { transporter } from "../service/mail.service.js";

const JWT_SECRET = process.env.JWT_SECRET || "un_secreto_muy_seguro_para_jwt";
const saltRounds = 10;

// 🔹 LOGIN
export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const { rows } = await pool.query(
      `SELECT u.id_usuario, u.nombre, u.apellido, u.contraseña, r.nombre AS categoria
       FROM usuarios u
       JOIN roles r ON u.rol_id = r.id_rol
       WHERE u.email = $1`,
      [email]
    );

    if (!rows.length)
      return res.status(401).json({ message: "Credenciales inválidas" });

    const user = rows[0];

    const match = await bcrypt.compare(password, user.contraseña);
    if (!match)
      return res.status(401).json({ message: "Credenciales inválidas" });

    const token = jwt.sign(
      { userId: user.id_usuario, categoria: user.categoria },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      token,
      user: {
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        apellido: user.apellido,
        categoria: user.categoria.toLowerCase(),
      },
    });
  } catch (err) {
    console.error("💥 login:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
}

// 🔹 FORGOT PASSWORD
export async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const { rows } = await pool.query(
      "SELECT id_usuario, nombre FROM usuarios WHERE email=$1 AND activo=true",
      [email]
    );
    if (!rows.length)
      return res
        .status(200)
        .json({ message: "Si el email está registrado se enviará un enlace." });

    const user = rows[0];
    const resetToken = jwt.sign({ id: user.id_usuario }, JWT_SECRET, {
      expiresIn: "1h",
    });

    await pool.query(
      "UPDATE tokensrecuperacion SET usado=true WHERE usuario_id=$1 AND usado=false",
      [user.id_usuario]
    );
    await pool.query(
      "INSERT INTO tokensrecuperacion (usuario_id, token, fecha_creacion, fecha_expiracion, usado) VALUES ($1,$2,NOW(),NOW()+INTERVAL '1 hour',false)",
      [user.id_usuario, resetToken]
    );

    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Restablecer contraseña • Diario Virtual",
      html: `<p>Hola ${user.nombre}, haz clic aquí para restablecer tu contraseña:</p><a href="${resetUrl}">${resetUrl}</a>`,
    });

    res.json({ message: "Si el email está registrado se enviará un enlace." });
  } catch (err) {
    console.error("💥 forgotPassword:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
}

// 🔹 RESET PASSWORD
export async function resetPassword(req, res) {
  const { token, newPassword } = req.body;
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const { rows } = await pool.query(
      "SELECT * FROM tokensrecuperacion WHERE token=$1 AND usuario_id=$2 AND usado=false AND fecha_expiracion>NOW()",
      [token, id]
    );
    if (!rows.length)
      return res.status(400).json({ message: "Enlace inválido o expirado" });

    const hash = await bcrypt.hash(newPassword, saltRounds);
    await pool.query("UPDATE usuarios SET contraseña=$1 WHERE id_usuario=$2", [
      hash,
      id,
    ]);
    await pool.query(
      "UPDATE tokensrecuperacion SET usado=true WHERE token=$1",
      [token]
    );

    res.json({ message: "Contraseña restablecida" });
  } catch (err) {
    console.error("💥 resetPassword:", err);
    res.status(500).json({ message: "Error del servidor" });
  }
}