import axios from 'axios';
import { Types } from 'mongoose';
import { Response } from 'express';
import { delay, logger, parsePDFDetailsWithBuffers } from '@/utils';
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

  /**
   * Gets a payslip document by its ID and sends it as a PDF response.
   * @param id - The ID of the payslip to find.
   * @param res - The Express response object to send the PDF response.
   * @returns A promise that resolves to the PDF response.
   * @throws {errors.pay_slip.not_exist} If the payslip document is not found.
   * @throws {errors.pay_slip.invalid_url} If the PDF file cannot be downloaded.
   */
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

  /**
   * Downloads a PDF file from a given URL.
   * @param fileUrl - The URL of the PDF file to download.
   * @returns A promise that resolves to the PDF file as a stream.
   * @throws {errors.pay_slip.invalid_url} If the PDF file cannot be downloaded.
   */
  private async downloadPaySlipsPDF(fileUrl: string) {
    try {
      return await axios.get(fileUrl, { responseType: 'stream' });
    } catch (error) {
      logger.error(`Error fetching PDF from URL: ${fileUrl}`, error);
      throw errors.pay_slip.invalid_url;
    }
  }

  /**
   * Uploads a payslip PDF to Google Drive and saves the PDF URLs to the database.
   * @param file - The payslip PDF file to upload.
   * @param filePayload - The details of the payslip PDF file, including the name, month, and year.
   * @returns The uploaded PDF URLs.
   */
  async uploadPaySlip(file: Express.Multer.File, filePayload: FilePayload) {
    const { nameFile, month, year } = filePayload;
    const folderName = `${nameFile} - ${month} ${year}`;
    try {
      const folderId = await this.googleDriveService.createFolderInGoogleDrive(folderName);
      const pdfBuffer = file.buffer;
      const pdfDetailsArray = await parsePDFDetailsWithBuffers(pdfBuffer);
      const pdfRejected = [];

      await Promise.all(
        pdfDetailsArray.map(async (payslip, index) => {
          await delay(index * 100);

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
            userId: userId._id as Types.ObjectId,
          };

          await this.paySlipRepository.uploadPaySlip(payslipDetails);
        })
      );
    } catch (error) {
      logger.error('Error at PaySlipService.uploadPaySlip ->', error);
      throw error;
    }
  }

  async updatePaySlip(id: string, payload: PaySlip) {
    const paySlipId = new Types.ObjectId(id);
    let { userId } = payload;

    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw errors.user.not_exist;
    }
    const paySlip = await this.paySlipRepository.getPaySlip(paySlipId);
    if (!paySlip) {
      throw errors.pay_slip.not_exist;
    }
    await this.paySlipRepository.updatePaySlip(paySlipId, payload);
  }

  async deletePaySlip(paySlipId: Types.ObjectId) {
    const paySlip = await this.paySlipRepository.getPaySlip(paySlipId);
    if (!paySlip) {
      throw errors.pay_slip.not_exist;
    }
    await this.paySlipRepository.deletePaySlip(paySlipId);
  }

  async getPaySlipsByUserId(userId: Types.ObjectId, year: string) {
    const user = await this.userRepository.getUserById(userId);
    if (!user) {
      throw errors.user.not_exist;
    }
    const paySlips = await this.paySlipRepository.getPaySlipsByUserId(userId, year);
    return paySlips;
  }
}

export default PaySlipService;
