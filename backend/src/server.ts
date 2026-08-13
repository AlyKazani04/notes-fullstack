import express, { urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.ts'
import noteRoutes from './routes/noteRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import folderRoutes from './routes/folderRoutes.ts';
import { errorHandler } from './errorHandler.ts';
import env from '../env.ts';

const CORS_OPTIONS = {
  origin: env.CORS_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(CORS_OPTIONS));
app.use(helmet());

app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({
    message: "Server: I am fine."
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

export { app };
export default app;
