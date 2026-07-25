import { FolderCreateInputSchema, FolderSelectSchema, NoteCreateInputSchema, NoteSelectSchema, UserCreateInputSchema, UserSelectSchema } from "../generated/zod/index.ts";

export const insertUserSchema = UserCreateInputSchema;
export const selectUserSchema = UserSelectSchema;
export const insertNoteSchema = NoteCreateInputSchema;
export const selectNoteSchema = NoteSelectSchema;
export const insertFolderSchema = FolderCreateInputSchema;
export const selectFolderSchema = FolderSelectSchema;
