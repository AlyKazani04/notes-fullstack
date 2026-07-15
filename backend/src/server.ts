import express, { urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { getNotes, postNote, removeNote, updateNote } from './db/dbHelpers.ts';

const app = express();
app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({
    message: "Server: I am fine."
  });
});

app.get('/api/notes', async (req, res) => {
  const notes = await getNotes();
  res.status(200).json({
    message: "Server: sent",
    notes
  });
});

app.post('/api/notes', async (req, res) => {
  const newNote = req.body;
  const result = await postNote(newNote);
  res.status(201).json({
    message: 'Server: recieved',
    result
  });
});

app.patch('/api/notes', async (req, res) => {
  const changes = req.body;
  const result = await updateNote(changes);
  res.status(200).json({
    message: 'Server: updated',
    result
  })
});

app.delete('/api/notes', async (req, res) => {
  const noteToDelete = req.body;
  await removeNote(noteToDelete);
  res.status(200).json({
    message: 'Server: deleted'
  });
});

export { app };
export default app;
