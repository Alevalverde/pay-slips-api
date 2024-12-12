/* eslint-disable no-await-in-loop */
import axios from 'axios';
import pdfParse from 'pdf-parse';
import { PassThrough } from 'stream';
import { Types } from 'mongoose';
import { Response } from 'express';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { PDFDocument } from 'pdf-lib';
import { logger } from '@/utils';
import errors from '@/config/errors';
import config from '@/config';
import PaySlipRepository from '@/repositories/pay-slip.repository';
import { PaySlip } from '@/models';
import { formatName } from '@/utils/format-name';

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

  async uploadPaySlip(file: Express.Multer.File, nameFile: string) {
    try {
      const uploadedFileUrl = await this.uploadFileToGoogleDrive(file, nameFile);

      const pdfBuffer = file.buffer;
      const pdfWasRead = await this.parsePDFDetailsWithBuffers(pdfBuffer);
      console.log(pdfWasRead);

      const payslipDetails: PaySlip = {
        month: 'Diciembre',
        year: '2025',
        url: uploadedFileUrl,
        name: nameFile,
      };

      return await this.paySlipRepository.uploadPaySlip(payslipDetails);
    } catch (error) {
      logger.error('Error at PaySlipService.uploadPaySlip ->', error);
      throw error;
    }
  }

  private async parsePDFDetailsWithBuffers(pdfBuffer: Buffer) {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const totalPages = pdfDoc.getPages().length;

    const pdfDetailsArray: Array<{
      page: number;
      name: string;
      cuil: string;
      buffer: Buffer;
    }> = [];

    for (let i = 0; i < totalPages; i++) {
      // Extraer cada página como un PDF separado
      const singlePagePdf = await PDFDocument.create();
      const [copiedPage] = await singlePagePdf.copyPages(pdfDoc, [i]);
      singlePagePdf.addPage(copiedPage);

      // Guardar el PDF de la página como Uint8Array y convertir a Buffer
      const singlePageUint8Array = await singlePagePdf.save();
      const singlePageBuffer = Buffer.from(singlePageUint8Array);

      // Leer el texto de la página usando pdf-parse
      const pageText = await pdfParse(singlePageBuffer).then((data) => data.text);

      // Buscar el CUIL en el texto
      const cuilMatch = pageText.match(/CUIL:\s?(\d{2}-\d{8}-\d)/);
      const cuil = cuilMatch && cuilMatch[1] ? cuilMatch[1] : 'No encontrado';

      // Dividir el texto en líneas y obtener "name" (línea 6)
      const lines = pageText.split('\n');
      const name = lines[6] ? formatName(lines[6]) : 'No encontrado';

      // Agregar los datos al array incluyendo el buffer de la página
      pdfDetailsArray.push({ page: i + 1, name, cuil, buffer: singlePageBuffer });
    }

    return pdfDetailsArray;
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
      const response = await driveService.files.create({
        media: {
          mimeType: 'application/pdf',
          body: bufferStream,
        },
        requestBody: {
          name: nameFile,
          parents: ['122NnOqAH3IyJQWWDh8jxo7kNdYl6uEZh'], // Folder ID
        },
      });

      const fileId = response.data.id;

      const uploadedFileUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

      logger.info(`File successfully uploaded to Google Drive -> URL: ${uploadedFileUrl}`);

      return uploadedFileUrl;
    } catch (error) {
      logger.error(`Error updateing file to Google Drive: ${error}`);
      throw error;
    }
  }
}

export default PaySlipService;
