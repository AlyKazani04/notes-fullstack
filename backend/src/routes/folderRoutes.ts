import { Router } from "express";
import { authenticateToken } from "../middleware/auth.ts";
import { createFolder, folderById, patchFolder, removeFolder, userFolders } from "../controllers/folderController.ts";

const router = Router();

router.use(authenticateToken);

router.get('/', userFolders);

router.get(':id/', folderById);

router.post('/', createFolder);

router.patch('/:id', patchFolder);

router.delete('/:id', removeFolder);

export default router;

