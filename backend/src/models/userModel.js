const pool = require('../config/database'); // Importa la conexión a la DB
const bcrypt = require('bcryptjs');

const saltRounds = 10;

class User {
    static async findByEmail(email) {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async updatePassword(userId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await pool.query('UPDATE usuarios SET contraseña = $1 WHERE id_usuario = $2', [hashedPassword, userId]);
    }

    // Otros métodos relacionados con usuarios (crear, buscar por ID, etc.)
    // static async createUser(userData) { ... }
}

module.exports = User;