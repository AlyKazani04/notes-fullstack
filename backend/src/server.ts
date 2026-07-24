import express, { urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import { getNoteByID, getNotes, postNote, removeNoteByID, updateNoteByID } from './db/dbHelpers.ts';
import type { CreateNoteInput, Note } from './db/dbHelpers.ts';

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

app.get('/api/notes', async (req, res) => {
  try {
    const notes = await getNotes();

    res.status(200).json({
      message: "Server: sent",
      notes
    });
  } catch (e) {
    res.status(500).json({
      message: 'Server: Internal Server Error',
    });
  }
});

app.get('/api/notes/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      message: 'Server: ID must be a valid number',
    });
  }

  try {
    const note = await getNoteByID(id);
    if (note) {
      res.status(200).json({
        message: "Server: sent",
        note
      });
    } else {
      res.status(404).json({
        message: 'Server: Note not found',
      });
    }
  } catch (e) {
    res.status(500).json({
      message: 'Server: Internal Server Error',
    });
  }
});

app.post('/api/notes', async (req, res) => {
  try {
    const newNote: CreateNoteInput = req.body;

    if (!newNote.title || !newNote.content) {
      return res.status(400).json({
        message: 'Server: Title and Content are required',
      });
    }

    const result = await postNote(newNote);
    res.status(201).json({
      message: 'Server: recieved',
      result
    });
  } catch (e) {
    res.status(500).json({
      message: 'Server: Internal Server Error',
    });
  }
});

app.patch('/api/notes/:id', async (req, res) => {
  const id: number = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      message: 'Server: ID must be a valid number',
    })
  }

  try {
    const changes: Partial<CreateNoteInput> = req.body;
    const result = await updateNoteByID(id, changes);

    res.status(200).json({
      message: 'Server: updated',
      result
    });
  } catch (e) {
    res.status(404).json({
      message: 'Server: Note not found or Bad Request',
    });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  const id: number = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({
      message: 'Server: ID must be a valid number',
    })
  }

  try {
    await removeNoteByID(id);

    res.status(200).json({
      message: 'Server: deleted'
    });
  } catch (e) {
    res.status(404).json({
      message: 'Server: Note not found for deletion',
    });
  }
});

export { app };
export default app;
