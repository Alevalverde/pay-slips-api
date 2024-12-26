import { NextFunction, Request, Response } from 'express';
import { prepareResponse } from '@/utils/api-response';
import PaySlipService from '@/services/pay-slip.service';
import { FilePayload } from '@/interface';

class PaySlipController {
  constructor(private readonly paySlipService: PaySlipService) {}

  getPaySlip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const paySlipsPDF = await this.paySlipService.getPaySlip(id, res);
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
      const { id } = req.params;
      const payload = req.body;
      await this.paySlipService.updatePaySlip(id, payload);
      return res.json(prepareResponse(200, null));
    } catch (error) {
      next(error);
    }
  };

  deletePaySlip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.paySlipService.deletePaySlip(id);
      return res.json(prepareResponse(200, null));
    } catch (error) {
      next(error);
    }
  };

  getPaySlipsByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { year } = req.query;
      const paySlips = await this.paySlipService.getPaySlipsByUserId(id, year as string);
      return res.json(prepareResponse(200, null, paySlips));
    } catch (error) {
      next(error);
    }
  };
}

export default PaySlipController;
