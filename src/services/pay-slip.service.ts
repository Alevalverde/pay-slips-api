import PaySlipRepository from '@/repositories/pay-slip.repository';
import { logger } from '@/utils';

class PaySlipService {
  constructor(private readonly paySlipRepository: PaySlipRepository) {}

  async getPaySlips() {
    try {
      return [];
    } catch (error) {
      logger.error('Error at PaySlipService.getPaySlips ->', error);
      throw error;
    }
  }
}

export default PaySlipService;
