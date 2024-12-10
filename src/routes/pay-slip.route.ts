import { Router } from 'express';
import { paySlipController } from '../controllers';
import { validateFile } from '@/middlewares';

const router = Router();

router.get('/pay-slips/:id', paySlipController.getPaySlip);
router.post('/pay-slips/upload', validateFile, paySlipController.uploadPaySlip);

export default router;
