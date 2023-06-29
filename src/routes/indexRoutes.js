import express from 'express';
import indexController from '../controllers/indexController.js';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get('/', indexController.indexView);
router.get('/register', userController.registerView);
router.post('/register', userController.userRegister);

export default router;