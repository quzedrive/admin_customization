import express from 'express';
import { loginAdmin, logoutAdmin, getMe, refreshAccessToken, registerAdmin, forgotPassword, resetPassword } from '../controllers/admin-auth.controller';
import { protect } from '../middlewares/auth.middleware';
import { authLimiter } from '../middlewares/rate-limiter.middleware';

const router = express.Router();

router.post('/register', protect, registerAdmin);
router.post('/login', authLimiter, loginAdmin);
router.post('/refresh', refreshAccessToken);
router.post('/forgotpassword', authLimiter, forgotPassword);
router.put('/resetpassword/:resettoken', authLimiter, resetPassword);
router.post('/logout', protect, logoutAdmin);
router.get('/me', protect, getMe);

export default router;
