import { Router } from "express";
import { getUserNotes } from "../controllers/noteController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

router.use(authenticateToken);

// TODO: Implement Validations here

router.get('/', getUserNotes);

router.post('/');

router.patch('/:id');

router.delete('/:id');

router.delete('/batch-delete');

export default router;
