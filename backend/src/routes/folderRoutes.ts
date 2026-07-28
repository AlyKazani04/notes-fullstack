import { Router } from "express";
import { authenticateToken } from "../middleware/auth.ts";
import { createFolder, folderById, patchFolder, removeFolder, userFolders } from "../controllers/folderController.ts";
import { validateBody, validateParams } from "../middleware/validation.ts";
import { createFolderSchema, folderParamSchema, updateFolderSchema } from "../schemas/folderSchemas.ts";

const router = Router();

router.use(authenticateToken);

router.get('/', userFolders);

router.get('/:id', validateParams(folderParamSchema), folderById);

router.post('/', validateBody(createFolderSchema), createFolder);

router.patch('/:id', validateParams(folderParamSchema), validateBody(updateFolderSchema), patchFolder);

router.delete('/:id', validateParams(folderParamSchema), removeFolder);

export default router;

