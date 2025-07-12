const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel'); // Importa tu modelo de usuario
const TokenRecovery = require('../models/tokenRecoveryModel'); // Importa tu modelo de tokens
const transporter = require('../config/nodemailer'); // Importa el transportador
const JWT_SECRET = require('../config/jwt'); // Importa el secreto JWT

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            console.log('❌ Login Fallido: Email no encontrado en la BD para:', email);
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.contraseña);

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
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findByEmail(email);

        if (!user || !user.activo) {
            console.log(`⚠️ Solicitud de recuperación para email no encontrado o inactivo: ${email}`);
            // Siempre responder con éxito para no dar pistas sobre emails registrados
            return res.status(200).json({ success: true, message: 'Si el email está registrado, recibirás un enlace para restablecer tu contraseña.' });
        }

        const resetToken = jwt.sign({ id_usuario: user.id_usuario }, JWT_SECRET, { expiresIn: '1h' });

        await TokenRecovery.invalidateOldTokens(user.id_usuario);
        await TokenRecovery.createToken(user.id_usuario, resetToken);

        const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`; // Usar variable de entorno para el host del frontend si es necesario

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
};

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ success: false, message: 'Faltan el token o la nueva contraseña.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id_usuario;

        const validToken = await TokenRecovery.findValidToken(token, userId);

        if (!validToken) {
            console.log('❌ Token inválido, usado o expirado para restablecimiento.');
            return res.status(400).json({ success: false, message: 'El enlace de restablecimiento es inválido o ha expirado. Por favor, solicita uno nuevo.' });
        }

        await User.updatePassword(userId, newPassword); 
        await TokenRecovery.markTokenAsUsed(token); 

        console.log(`✅ Contraseña restablecida (y hasheada) para usuario ID: ${userId}`);
        res.json({ success: true, message: 'Tu contraseña ha sido restablecida exitosamente.' });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ success: false, message: 'El enlace de restablecimiento ha expirado. Por favor, solicita uno nuevo.' });
        }
        console.error('💥 Error en reset-password:', error);
        res.status(500).json({ success: false, message: 'Error del servidor al restablecer contraseña.', error: error.message });
    }
};

module.exports = {
    login,
    forgotPassword,
    resetPassword,
};