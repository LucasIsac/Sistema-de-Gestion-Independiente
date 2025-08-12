// src/app.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import errorHandler from './middlewares/error.middleware.js';
import editorRoutes from './routes/editor.routes.js';
import notificacionesRoutes from "./routes/notificaciones.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.send('Backend Diario Virtual funcionando 👌'));
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api', userRoutes); // Rutas de usuarios
app.use('/api', editorRoutes); // Rutas de editor
app.use('/archivos', express.static('archivos')); //archivos está en la raíz del proyecto
app.use("/api/notificaciones", notificacionesRoutes); // Rutas de notificaciones

app.use(errorHandler);   // siempre al final
export default app;
