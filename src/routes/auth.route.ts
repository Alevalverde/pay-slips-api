import { Router } from 'express';
import { authController } from '../controllers';

const router = Router();

router.post('/register', authController.registerUser);
// router.post('/login', authController.login);
// router.get('/current-user', authController.currentUser);
// router.post('/reset-password/initiate', authController.initiateResetPassword);
// router.post('/reset-password/complete', authController.completeResetPassword);

export default router;
