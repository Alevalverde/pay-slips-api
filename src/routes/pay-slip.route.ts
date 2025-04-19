import { Router } from 'express';
import { paySlipController } from '../controllers';
import { validateFile } from '@/middlewares';
import { authorize } from '@/middlewares/auth.middleware';

const router = Router();

router.get('/pay-slips/:id', authorize, paySlipController.getPaySlip);
router.patch('/pay-slips/:id', authorize, paySlipController.updatePaySlip);
router.delete('/pay-slips/:id', authorize, paySlipController.deletePaySlip);
router.post('/pay-slips', authorize, validateFile, paySlipController.uploadPaySlip);
router.get('/users/:id/pay-slips', authorize, paySlipController.getPaySlipsByUserId);

export default router;
