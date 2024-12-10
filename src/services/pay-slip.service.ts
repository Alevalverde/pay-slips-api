import axios from 'axios';
import { PassThrough } from 'stream';
import { Types } from 'mongoose';
import { Response } from 'express';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { logger } from '@/utils';
import errors from '@/config/errors';
import config from '@/config';
import PaySlipRepository from '@/repositories/pay-slip.repository';

class PaySlipService {
  constructor(private readonly paySlipRepository: PaySlipRepository) {}

  async getPaySlip(id: Types.ObjectId, res: Response) {
    try {
      const paySlips = await this.paySlipRepository.getPaySlip(id);

      if (!paySlips) throw errors.pay_slip.not_exist;
      const fileUrl = paySlips.url;

      const paySlipsPDF = await this.downloadPaySlipsPDF(fileUrl);

      res.setHeader('Content-Disposition', `attachment; filename="${paySlips.name}.pdf"`);

      return paySlipsPDF;
    } catch (error) {
      logger.error('Error at PaySlipService.getPaySlips ->', error);
      throw error;
    }
  }

  private async downloadPaySlipsPDF(fileUrl: string) {
    try {
      return await axios.get(fileUrl, { responseType: 'stream' });
    } catch (error) {
      logger.error(`Error fetching PDF from URL: ${fileUrl}`, error);
      throw errors.pay_slip.invalid_url;
    }
  }

  async uploadPaySlip(files: Express.Multer.File[], nameFile: string) {
    try {
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const promise = this.uploadFileToGoogleDrive(file, nameFile);
        promises.push(promise);
      }
      await Promise.all(promises);
    } catch (error) {
      logger.error('Error at PaySlipService.uploadPaySlip ->', error);
      throw error;
    }
  }

  async createDriveClient() {
    try {
      const auth = new GoogleAuth({
        keyFile: config.GOOGLE_CREDENTIAL,
        scopes: ['https://www.googleapis.com/auth/drive'],
      });
      return google.drive({ version: 'v3', auth });
    } catch (error) {
      logger.error(`Error connecting to Google Drive: ${error}`);
      throw error;
    }
  }

  async uploadFileToGoogleDrive(file: Express.Multer.File, nameFile: string) {
    const driveService = await this.createDriveClient();

    try {
      const bufferStream = new PassThrough();
      bufferStream.end(file.buffer);
      const data = await driveService.files.create({
        media: {
          mimeType: 'application/pdf',
          body: bufferStream,
        },
        requestBody: {
          name: file.originalname,
          parents: ['122NnOqAH3IyJQWWDh8jxo7kNdYl6uEZh'], // Folder ID
        },
      });
      logger.info(`File successfully uploaded to Google Drive: ${nameFile}`);
      return data;
    } catch (error) {
      logger.error(`Error updateing file to Google Drive: ${error}`);
      throw error;
    }
  }
}

export default PaySlipService;
