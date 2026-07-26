import { Router } from "express";
import { authenticateToken } from '../middleware/auth.ts';
import { logout } from "../controllers/userController.ts";

const router = Router();

router.use(authenticateToken);

router.post('/logout', logout);

export default router;
