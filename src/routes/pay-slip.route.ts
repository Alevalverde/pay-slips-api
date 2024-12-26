import { Router } from 'express';
import { paySlipController } from '../controllers';
import { validateFile } from '@/middlewares';

const router = Router();

router.get('/pay-slips/:id', paySlipController.getPaySlip);
router.patch('/pay-slips/:id', paySlipController.updatePaySlip);
router.delete('/pay-slips/:id', paySlipController.deletePaySlip);
router.post('/pay-slips/upload', validateFile, paySlipController.uploadPaySlip);

export default router;
