import { NextFunction, Request, Response } from 'express';
import { prepareResponse } from '@/utils/api-response';
import PaySlipService from '@/services/pay-slip.service';

class PaySlipController {
  constructor(private readonly paySlipService: PaySlipService) {}

  uploadPaySlip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paySlips = await this.paySlipService.uploadPaySlip();
      return res.json(prepareResponse(200, null, paySlips));
    } catch (error) {
      next(error);
    }
  };

  
}

export default PaySlipController;
