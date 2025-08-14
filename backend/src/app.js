// src/app.js
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import rolesRoutes from './routes/roles.routes.js';
import errorHandler from './middlewares/error.middleware.js';
import editorRoutes from './routes/editor.routes.js';
import notificacionesRoutes from "./routes/notificaciones.routes.js";
import articleRoutes from './routes/article.routes.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middlewares globales
app.use(cors());
app.use('/api/articles',articleRoutes);

app.get('/', (_req, res) => res.send('Backend Diario Virtual funcionando 👌'));
app.use(express.json());
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api', userRoutes); // Rutas de usuarios
app.use('/api', rolesRoutes); // Rutas de roles
app.use('/api', editorRoutes); // Rutas de editor
app.use('/archivos', express.static('archivos')); //archivos está en la raíz del proyecto
app.use("/api/notificaciones", notificacionesRoutes); // Rutas de notificaciones
app.get('/test', (req, res) => res.json({ message: 'Test OK' }));
app.use('/avatars', express.static(path.join(__dirname,'uploads/avatars')));


app.use(errorHandler);   // siempre al final
export default app;
