import express from 'express';
import { loginAdmin, logoutAdmin, getMe, refreshAccessToken, registerAdmin, forgotPassword, resetPassword } from '../controllers/admin-auth.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/refresh', refreshAccessToken);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.post('/logout', protect, logoutAdmin);
router.get('/me', protect, getMe);

export default router;
