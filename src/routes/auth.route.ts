import { Router } from 'express';
import { authController } from '../controllers';
import { authorize } from '@/middlewares/auth.middleware';

const router = Router();

router.post('/login', authController.login);
router.get('/current-user', authorize, authController.currentUser);
// router.post('/reset-password/initiate', authController.initiateResetPassword);
// router.post('/reset-password/complete', authController.completeResetPassword);

export default router;
