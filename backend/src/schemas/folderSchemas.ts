import { z } from 'zod';

export const createFolderSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').trim(),
});

export const updateFolderSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty').trim(),
});

export const folderParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a valid number')
})
