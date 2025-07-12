const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Importa tus rutas de autenticación

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor backend funcionando 👌');
});

// Rutas de la API
app.use('/api/auth', authRoutes); // Todas las rutas de autenticación irán bajo /api/auth

// Si tienes más rutas, las añadirías aquí:
// app.use('/api/users', userRoutes);
// app.use('/api/articles', articleRoutes);

module.exports = app;