import { paySlipRepository } from '@/repositories';
import PaySlipService from './pay-slip.service';

const paySlipService = new PaySlipService(paySlipRepository);

export { paySlipService };
