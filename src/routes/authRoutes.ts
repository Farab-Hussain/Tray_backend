import { Router } from 'express';
import { signup, login, forgetPassword, verifyOtp, resetPassword } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgetPassword', forgetPassword);
router.post('/verifyOTP', verifyOtp);
router.post('/resetPassword', resetPassword);

export default router;
