import { Router } from 'express';
import { paySlipController } from '../controllers';
import { validateFile } from '@/middlewares';

const router = Router();

router.get('/pay-slips/:id', paySlipController.getPaySlip);
router.patch('/pay-slips/:id', paySlipController.updatePaySlip);
router.delete('/pay-slips/:id', paySlipController.deletePaySlip);
router.post('/pay-slips', validateFile, paySlipController.uploadPaySlip);
router.get('/users/:id/pay-slips', paySlipController.getPaySlipsByUserId);

export default router;
