// src/app.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middlewares/error.middleware.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.send('Backend Diario Virtual funcionando 👌'));
app.use('/api/auth', authRoutes);

app.use(errorHandler);   // siempre al final
export default app;
