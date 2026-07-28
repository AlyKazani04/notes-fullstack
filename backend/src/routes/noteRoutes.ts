import { Router } from "express";
import { deleteManyUserNotes, deleteUserNote, getUserNotes, postUserNote, updateUserNote } from "../controllers/noteController.ts";
import { authenticateToken } from "../middleware/auth.ts";
import { validateBody, validateParams, validateQuery } from "../middleware/validation.ts";
import { batchDeleteNotesSchema, createNoteSchema, folderQuerySchema, noteIdParamSchema, updateNoteSchema } from "../schemas/noteSchemas.ts";

const router = Router();

router.use(authenticateToken);

router.get('/', validateQuery(folderQuerySchema), getUserNotes);

router.post('/', validateBody(createNoteSchema), postUserNote);

router.patch('/:id', validateParams(noteIdParamSchema), validateBody(updateNoteSchema), updateUserNote);

router.delete('/:id', validateParams(noteIdParamSchema), deleteUserNote);

router.post('/batch-delete', validateBody(batchDeleteNotesSchema), deleteManyUserNotes);

export default router;
