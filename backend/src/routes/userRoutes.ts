import { Router } from "express";
import { authenticateToken } from '../middleware/auth.ts';
import { logout, profile } from "../controllers/userController.ts";

const router = Router();

router.use(authenticateToken);

router.get('/me', profile);

// TODO: Add other methods to update the user profile

router.post('/logout', logout);

export default router;
