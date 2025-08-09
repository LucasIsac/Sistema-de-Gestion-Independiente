// src/app.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import errorHandler from './middlewares/error.middleware.js';
import editorRoutes from './routes/editor.routes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.send('Backend Diario Virtual funcionando 👌'));
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api', editorRoutes);


app.use(errorHandler);   // siempre al final
export default app;
