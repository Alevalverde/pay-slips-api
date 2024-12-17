import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { prepareResponse } from '@/utils/api-response';
import PaySlipService from '@/services/pay-slip.service';
import { FilePayload } from '@/interface';

class PaySlipController {
  constructor(private readonly paySlipService: PaySlipService) {}

  getPaySlip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const idPaySlip = new mongoose.Types.ObjectId(id);
      const paySlipsPDF = await this.paySlipService.getPaySlip(idPaySlip, res);
      return paySlipsPDF.data.pipe(res);
    } catch (error) {
      next(error);
    }
  };

  uploadPaySlip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.files as Express.Multer.File[];
      const { nameFile, month, year } = req.body;
      const filePayload: FilePayload = {
        nameFile,
        month,
        year,
      };
      await this.paySlipService.uploadPaySlip(file[0], filePayload);
      return res.json(prepareResponse(200, null));
    } catch (error) {
      next(error);
    }
  };
}

export default PaySlipController;
