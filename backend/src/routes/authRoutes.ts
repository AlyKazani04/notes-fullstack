import { Router } from "express";
import z from "zod";
import { insertUserSchema } from '../db/schema.ts'
import { validateBody } from '../middleware/validation.ts';
import { login, register } from "../controllers/authController.ts";

const loginSchema = z.object({
  email: z.email({ error: 'Invalid Email' }),
  password: z.string().min(8, 'Password should be minimum 8 characters long'),
})

const router = Router();

router.post('/signup', validateBody(insertUserSchema), register);

router.post('/login', validateBody(loginSchema), login);

router.post('/logout');

export default router;
