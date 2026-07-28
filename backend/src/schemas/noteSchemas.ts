import { z } from 'zod';

export const folderQuerySchema = z.object({
  folderId: z.coerce.number().int('Folder ID must be a positive integer').positive().nullable().optional()
});

export const createNoteSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').trim(),
  content: z.string().min(1, 'Content cannot be empty').trim(),
  folderId: z.coerce.number().int('Folder ID must be a positive integer').positive().nullable().optional()
});

export const noteIdParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a valid number')
});
;
export const updateNoteSchema = z.object({
  title: z.string().min(1, "Title cannct be empty").trim().optional(),
  content: z.string().optional(),
  folderId: z.union([
    z.number().int().positive(),
    z.null()
  ]).optional(),
});

export const batchDeleteNotesSchema = z.object({
  noteIds: z.array(z.number().int('Note ID must be a positive integer').positive()).min(1, 'At least one Note ID must be provided')
});
