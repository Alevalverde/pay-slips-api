import { Router } from 'express';
import { paySlipController } from '../controllers';

const router = Router();

router.get('/paySlip/:paySlipDate', paySlipController.getPaySlip);

export default router;
