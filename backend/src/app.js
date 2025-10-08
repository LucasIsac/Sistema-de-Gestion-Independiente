// src/app.js
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import rolesRoutes from './routes/roles.routes.js';
import errorHandler from './middlewares/error.middleware.js';
import notificacionesRoutes from "./routes/notificaciones.routes.js";
import articleRoutes from './routes/article.routes.js';
import fotoRoutes from './routes/foto.routes.js';
import categoriaRoutes from './routes/categoria.routes.js';
import onlineUsersRoutes from './routes/onlineUsers.routes.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json());



import fileRoutes from './routes/file.routes.js';  


// Middlewares globales
app.use(cors());
app.use('/api/articles',articleRoutes);
app.use('/api/fotos', fotoRoutes);

app.get('/', (_req, res) => res.send('Backend Diario Virtual funcionando 👌'));
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api', userRoutes); // Rutas de usuarios
app.use('/api', rolesRoutes); // Rutas de roles
app.use('/archivos', express.static('archivos')); //archivos está en la raíz del proyecto
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use("/api/notificaciones", notificacionesRoutes); // Rutas de notificaciones
app.get('/test', (req, res) => res.json({ message: 'Test OK' }));
app.use('/avatars', express.static(path.join(__dirname,'uploads/avatars')));
app.use('/api',fileRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/admin', onlineUsersRoutes);



app.use(errorHandler);   // siempre al final
export default app;
