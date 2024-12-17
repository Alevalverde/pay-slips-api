import axios from 'axios';
import { ObjectId, Types } from 'mongoose';
import { Response } from 'express';
import { logger, parsePDFDetailsWithBuffers } from '@/utils';
import errors from '@/config/errors';
import PaySlipRepository from '@/repositories/pay-slip.repository';
import { PaySlip } from '@/models';
import GoogleDriveService from './google-drive.service';
import { FilePayload } from '@/interface';
import UserRepository from '@/repositories/user.repository';

class PaySlipService {
  constructor(
    private readonly paySlipRepository: PaySlipRepository,
    private readonly googleDriveService: GoogleDriveService,
    private readonly userRepository: UserRepository
  ) {}

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

  /**
   * Uploads a payslip PDF to Google Drive and saves its details in the database.
   *
   * This function performs the following steps:
   * 1. Creates a folder in Google Drive using the provided file payload details.
   * 2. Parses the uploaded PDF file to extract individual pages.
   * 3. For each extracted page, uploads it as a separate PDF to Google Drive.
   * 4. Retrieves or updates the user information based on extracted CUIL and name.
   * 5. Saves the payslip details, including the uploaded PDF URL, to the database.
   *
   * @param file - The uploaded PDF file containing payslips.
   * @param filePayload - An object containing the file name, month, and year for the payslip.
   * @throws Will log an error and rethrow if any step of the process fails.
   */
  async uploadPaySlip(file: Express.Multer.File, filePayload: FilePayload) {
    const { nameFile, month, year } = filePayload;
    const folderName = `${nameFile} - ${month} ${year}`;
    try {
      const folderId = await this.googleDriveService.createFolderInGoogleDrive(folderName);
      const pdfBuffer = file.buffer;
      const pdfDetailsArray = await parsePDFDetailsWithBuffers(pdfBuffer);
      const pdfRejected = [];

      pdfDetailsArray.forEach(async (payslip) => {
        const pdfName = `${folderName} - ${payslip.name}`;
        const urlPdf = await this.googleDriveService.uploadFileToGoogleDrive(payslip.buffer, pdfName, folderId!);

        const { cuil, name } = payslip;
        if (!cuil || !name) {
          pdfRejected.push(payslip);
          return;
        }
        const userId = await this.userRepository.getOrUpdateUser(cuil, name);

        const payslipDetails: PaySlip = {
          month,
          year,
          url: urlPdf,
          name: pdfName,
          user: userId._id as ObjectId,
        };
        await this.paySlipRepository.uploadPaySlip(payslipDetails);
      });
    } catch (error) {
      logger.error('Error at PaySlipService.uploadPaySlip ->', error);
      throw error;
    }
  }
}

export default PaySlipService;
