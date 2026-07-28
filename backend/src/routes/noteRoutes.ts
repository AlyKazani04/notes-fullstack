import { Router } from "express";
import { deleteManyUserNotes, deleteUserNote, getUserNotes, postUserNote, updateUserNote } from "../controllers/noteController";
import { authenticateToken } from "../middleware/auth";
import { validateBody, validateParams, validateQuery } from "../middleware/validation";
import { batchDeleteNotesSchema, createNoteSchema, folderQuerySchema, noteIdParamSchema, updateNoteSchema } from "../schemas/noteSchemas";

const router = Router();

router.use(authenticateToken);

router.get('/', validateQuery(folderQuerySchema), getUserNotes);

router.post('/', validateQuery(folderQuerySchema), validateBody(createNoteSchema), postUserNote);

router.patch('/:id', validateParams(noteIdParamSchema), validateBody(updateNoteSchema), updateUserNote);

router.delete('/:id', validateParams(noteIdParamSchema), deleteUserNote);

router.post('/batch-delete', validateBody(batchDeleteNotesSchema), deleteManyUserNotes);

export default router;
