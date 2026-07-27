import { Router } from "express";
import { authenticateToken } from "../middleware/auth.ts";
import { createFolder, folderById, userFolders } from "../controllers/folderController.ts";

const router = Router();

router.use(authenticateToken);

router.get('/', userFolders);

router.get(':id/', folderById);

router.post('/', createFolder);

router.patch('/:id');

router.delete('/:id');

export default router;

