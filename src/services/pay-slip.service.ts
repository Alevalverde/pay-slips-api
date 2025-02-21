/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { Types } from 'mongoose';
import { Response } from 'express';
import { chunkArray, logger, parsePDFDetailsWithBuffers, processChunks } from '@/utils';
import errors from '@/config/errors';
import PaySlipRepository from '@/repositories/pay-slip.repository';
import { PaySlip } from '@/models';
import GoogleDriveService from './google-drive.service';
import { FilePayload, NameFile } from '@/interfaces';
import UserRepository from '@/repositories/user.repository';

class PaySlipService {
  constructor(
    private readonly paySlipRepository: PaySlipRepository,
    private readonly googleDriveService: GoogleDriveService,
    private readonly userRepository: UserRepository
  ) {}

  async getPaySlip(id: string, res: Response) {
    try {
      const idPaySlip = new Types.ObjectId(id);
      const paySlips = await this.paySlipRepository.getPaySlip(idPaySlip);

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

  // async uploadPaySlip(file: Express.Multer.File, filePayload: FilePayload) {
  //   const { nameFile, month, year } = filePayload;
  //   const folderName = `${nameFile} - ${month} ${year}`;
  //   const { pdfDetailsArray, folderId } =
  //     nameFile === NameFile.BP
  //       ? await this.uploadFolderToGoogleDrive(file, folderName, false)
  //       : await this.uploadFolderToGoogleDrive(file, folderName);

  //   try {
  //     // Dividir pdfDetailsArray en 4 chunks
  //     const chunkSize = Math.ceil(pdfDetailsArray.length / 3);
  //     const chunks = chunkArray(pdfDetailsArray, chunkSize);

  //     const uploadResults = await processChunks(chunks, folderName, folderId!);

  //     const session = await this.paySlipRepository.startTransaction();
  //     try {
  //       for (const { cuil, name, urlPdf, pdfName } of uploadResults) {
  //         if (cuil!) {
  //           const userId = await this.userRepository.getOrUpdateUser(cuil as string, name as string, session);

  //           const payslipDetails: PaySlip = {
  //             month,
  //             year,
  //             url: urlPdf,
  //             name: pdfName,
  //             userId: userId._id as Types.ObjectId,
  //           };

  //           await this.paySlipRepository.uploadPaySlip(payslipDetails, session);
  //         } else {
  //           // TODO: AGREGAR LOS USUARIOS SIN CUIL A UN ARRAY PARA LUEGO RENDERIZAR EN EL FRONT
  //           logger.info('Usuario sin CUIL:', name);
  //         }
  //       }
  //       await session.commitTransaction();
  //     } catch (error) {
  //       await session.abortTransaction();
  //       throw error;
  //     } finally {
  //       await session.endSession();
  //     }
  //   } catch (error) {
  //     if (folderId) {
  //       await this.googleDriveService.deleteFolderFromGoogleDrive(folderId);
  //     }
  //     logger.error('Error at PaySlipService.uploadPaySlip ->', error);
  //     throw error;
  //   }
  // }

  async uploadPaySlip(file: Express.Multer.File, filePayload: FilePayload) {
    const { nameFile, month, year } = filePayload;
    const folderName = `${nameFile} - ${month} ${year}`;
    let folderId: string | undefined | null;

    try {
      const { pdfDetailsArray, googleFolderId } = await this.uploadFolderToGoogleDrive(
        file,
        folderName,
        nameFile !== NameFile.BP
      );

      folderId = googleFolderId;

      // Procesar los archivos en chunks
      const uploadResults = await this.processPaySlipsInChunks(pdfDetailsArray, folderName, folderId!);

      await this.savePaySlipsToDatabase(uploadResults, month, year);
    } catch (error) {
      if (folderId) {
        await this.googleDriveService.deleteFolderFromGoogleDrive(folderId);
      }
      logger.error('Error at PaySlipService.uploadPaySlip ->', error);
      throw error;
    }
  }

  private async processPaySlipsInChunks(
    pdfDetailsArray: any,
    folderName: string,
    folderId: string
  ): Promise<Array<{ cuil?: string; name: string; urlPdf: string; pdfName: string }>> {
    const chunkSize = Math.ceil(pdfDetailsArray.length / 3);
    const chunks = chunkArray(pdfDetailsArray, chunkSize);

    return processChunks(chunks, folderName, folderId);
  }

  private async savePaySlipsToDatabase(uploadResults: any, month: string, year: string): Promise<void> {
    const session = await this.paySlipRepository.startTransaction();

    try {
      for (const { cuil, name, urlPdf, pdfName } of uploadResults) {
        if (cuil) {
          const userId = await this.userRepository.getOrUpdateUser(cuil, name, session);

          const payslipDetails: PaySlip = {
            month,
            year,
            url: urlPdf,
            name: pdfName,
            userId: userId._id as Types.ObjectId,
          };

          await this.paySlipRepository.uploadPaySlip(payslipDetails, session);
        } else {
          logger.info(`El Usuario ${name} no tiene CUIL: ${cuil}`);
          // TODO: Agregar usuarios sin CUIL a un array para devolver en el endpoint
        }
      }
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  async uploadFolderToGoogleDrive(file: Express.Multer.File, folderName: string, isPaySlip = true) {
    try {
      const googleFolderId = await this.googleDriveService.createFolderInGoogleDrive(folderName, isPaySlip);
      const pdfBuffer = file.buffer;
      const pdfDetailsArray = await parsePDFDetailsWithBuffers(pdfBuffer, isPaySlip);
      return { pdfDetailsArray, googleFolderId };
    } catch (error) {
      logger.error('Error at PaySlipService.uploadToGoogleDrive ->', error);
      throw error;
    }
  }

  async updatePaySlip(id: string, payload: PaySlip) {
    try {
      const paySlipId = new Types.ObjectId(id);
      let { userId } = payload;

      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        throw errors.user.not_found;
      }
      const paySlip = await this.paySlipRepository.getPaySlip(paySlipId);
      if (!paySlip) {
        throw errors.pay_slip.not_exist;
      }
      await this.paySlipRepository.updatePaySlip(paySlipId, payload);
    } catch (error) {
      logger.error('Error at PaySlipService.updatePaySlip ->', error);
      throw error;
    }
  }

  async deletePaySlip(id: string) {
    try {
      const paySlipId = new Types.ObjectId(id);
      const paySlip = await this.paySlipRepository.getPaySlip(paySlipId);
      if (!paySlip) {
        throw errors.pay_slip.not_exist;
      }
      await this.paySlipRepository.deletePaySlip(paySlipId);
    } catch (error) {
      logger.error('Error at PaySlipService.deletePaySlip ->', error);
      throw error;
    }
  }

  async getPaySlipsByUserId(id: string, year: string) {
    try {
      const userId = new Types.ObjectId(id);
      const user = await this.userRepository.getUserById(userId);
      if (!user) {
        throw errors.user.not_exist;
      }
      const paySlips = await this.paySlipRepository.getPaySlipsByUserId(userId, year);
      return paySlips;
    } catch (error) {
      logger.error('Error at PaySlipService.getPaySlipsByUserId ->', error);
      throw error;
    }
  }
}

export default PaySlipService;
