const pool = require('../config/database');

class TokenRecovery {
    static async invalidateOldTokens(userId) {
        await pool.query('UPDATE tokensrecuperacion SET usado = true WHERE usuario_id = $1 AND usado = false', [userId]);
    }

    static async createToken(userId, token) {
        await pool.query(
            'INSERT INTO tokensrecuperacion (usuario_id, token, fecha_creacion, fecha_expiracion, usado) VALUES ($1, $2, NOW(), NOW() + INTERVAL \'1 hour\', FALSE)',
            [userId, token]
        );
    }

    static async findValidToken(token, userId) {
        const result = await pool.query(
            'SELECT * FROM tokensrecuperacion WHERE token = $1 AND usuario_id = $2 AND usado = FALSE AND fecha_expiracion > NOW()',
            [token, userId]
        );
        return result.rows[0];
    }

    static async markTokenAsUsed(token) {
        await pool.query('UPDATE tokensrecuperacion SET usado = TRUE WHERE token = $1', [token]);
    }
}

module.exports = TokenRecovery;