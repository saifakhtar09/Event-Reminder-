import express from 'express';
import { signup, login, verifyToken } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/verify', protect, verifyToken); // Changed from /verify-token to /verify

export default router;