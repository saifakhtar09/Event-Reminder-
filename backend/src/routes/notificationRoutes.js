import express from 'express';
import {
  subscribe,
  unsubscribe,
  getPublicKey,
  sendTestNotification
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/public-key', getPublicKey);
router.post('/subscribe', protect, subscribe);
router.post('/unsubscribe', protect, unsubscribe);
router.post('/test', protect, sendTestNotification);

export default router;
