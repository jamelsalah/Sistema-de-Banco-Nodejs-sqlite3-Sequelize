import express from 'express';
import accountController from '../controllers/accountController.js';

const router = express.Router();

router.get('/createAccount', accountController.createAccountView);
router.post('/createAccount', accountController.createAccount);
router.post('/accountHome', accountController.accountHome);
router.get('/deposit', accountController.depositView);
router.post('/deposit', accountController.deposit);
router.get('/transferCheck', accountController.transferCheckView);
router.post('/transferCheck', accountController.transferCheck);
router.post('/transfer', accountController.transfer);
router.get('/list', accountController.listView);
router.post('/list', accountController.list)

export default router;