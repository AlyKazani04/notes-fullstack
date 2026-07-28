import express, { urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.ts'
import noteRoutes from './routes/noteRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import folderRoutes from './routes/folderRoutes.ts';

const app = express();
app.use(cors());
app.use(helmet());

app.use(cookieParser());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({
    message: "Server: I am fine."
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/folders', folderRoutes);
app.use('/api/users', userRoutes);


export { app };
export default app;
