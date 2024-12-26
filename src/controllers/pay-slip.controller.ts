import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';
import { prepareResponse } from '@/utils/api-response';
import PaySlipService from '@/services/pay-slip.service';
import { FilePayload } from '@/interface';

class PaySlipController {
  constructor(private readonly paySlipService: PaySlipService) {}

  getPaySlip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const idPaySlip = new Types.ObjectId(id);
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

  updatePaySlip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body;
      const { id } = req.params;
      await this.paySlipService.updatePaySlip(id, payload);
      return res.json(prepareResponse(200, null));
    } catch (error) {
      next(error);
    }
  };

  deletePaySlip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const paySlipId = new Types.ObjectId(id);
      await this.paySlipService.deletePaySlip(paySlipId);
      return res.json(prepareResponse(200, null));
    } catch (error) {
      next(error);
    }
  };

  getPaySlipsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { year } = req.query;
      const userId = new Types.ObjectId(id);
      const paySlips = await this.paySlipService.getPaySlipsByUserId(userId, year as string);
      return res.json(prepareResponse(200, null, paySlips));
    } catch (error) {
      next(error);
    }
  };
}

export default PaySlipController;
