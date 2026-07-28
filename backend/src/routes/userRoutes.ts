import { Router } from "express";
import { authenticateToken } from '../middleware/auth.ts';
import { logout, profile, updateProfile } from "../controllers/userController.ts";
import { validateBody } from "../middleware/validation.ts";
import { updateUserSchema } from "../schemas/userSchemas.ts";

const router = Router();

router.use(authenticateToken);

router.get('/me', profile);

router.patch('/profile', validateBody(updateUserSchema), updateProfile);

router.post('/logout', logout);

export default router;
