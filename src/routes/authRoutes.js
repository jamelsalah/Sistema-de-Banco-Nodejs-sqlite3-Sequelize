import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.get('/auth', authController.loginView);
router.post('/auth', authController.auth);

export default router;