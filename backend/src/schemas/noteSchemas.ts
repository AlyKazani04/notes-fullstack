import { z } from 'zod';

const createNoteSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').trim(),
  content: z.string().min(1, 'Content cannot be empty').trim(),
});

// TODO: Add other note schemas
