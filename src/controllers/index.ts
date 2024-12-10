import { paySlipService } from '@/services';
import PaySlipController from './pay-slip.controller';

const paySlipController = new PaySlipController(paySlipService);

export { paySlipController };
