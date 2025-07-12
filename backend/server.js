require('dotenv').config();

console.log('DEBUG: DB_PASSWORD cargada:', process.env.DB_PASSWORD); // AÑADE ESTA LÍNEA TEMPORALMENTE

const app = require('./src/app'); // Importa la aplicación Express configurada
// ... el resto de tu códigoconst app = require('./src/app');

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