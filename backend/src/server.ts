import express, { urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { getNotes, postNote } from './db/dbHelpers.ts';

const app = express();
app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({
    fine: "I am fine."
  });
});

app.get('/api/notes', async (req, res) => {
  const notes = await getNotes();
  res.status(200).json({
    message: "sent",
    notes
  });
});

app.post('/api/notes', async (req, res) => {
  const newNote = req.body;
  const result = await postNote(newNote);
  res.status(200).json({
    message: 'recieved',
    result
  });
});

export { app };
export default app;
