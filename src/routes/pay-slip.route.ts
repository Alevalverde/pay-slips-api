import { Router } from 'express';
import { paySlipController } from '../controllers';

const router = Router();

router.post('/paySlip/upload', paySlipController.uploadPaySlip);

export default router;
