import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { PassThrough } from 'stream';
import config from '@/config';
import { logger } from '@/utils';

class GoogleDriveService {
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

  async uploadFileToGoogleDrive(file: Express.Multer.File | Buffer, nameFile: string, parentFolderId: string) {
    const driveService = await this.createDriveClient();
    try {
      const bufferStream = new PassThrough();
      if (file instanceof Buffer) {
        bufferStream.end(file);
      } else {
        bufferStream.end(file.buffer);
      }

      const response = await driveService.files.create({
        media: {
          mimeType: 'application/pdf',
          body: bufferStream,
        },
        requestBody: {
          name: nameFile,
          parents: [parentFolderId], // Folder ID
        },
      });

      const fileId = response.data.id;

      const urlPdf = `https://drive.google.com/uc?export=download&id=${fileId}`;

      logger.info(`File successfully uploaded to Google Drive -> URL: ${urlPdf}`);

      return { urlPdf, fileId };
    } catch (error) {
      logger.error(`Error updateing file to Google Drive: ${error}`);
      throw error;
    }
  }

  async createFolderInGoogleDrive(folderName: string, isPaySlip: boolean) {
    const driveService = await this.createDriveClient();
    try {
      const response = await driveService.files.create({
        requestBody: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
          parents: isPaySlip ? [config.FOLDER_ID_PAYSLIP] : [config.FOLDER_ID_SCHOOLFEE], // Parent folder ID
        },
      });

      const folderId = response.data.id;

      logger.info(`Folder '${folderName}' successfully created in Google Drive -> Folder ID: ${folderId}`);

      return folderId;
    } catch (error) {
      logger.error(`Error creating folder in Google Drive: ${error}`);
      throw error;
    }
  }

  async deleteFileFromGoogleDrive(fileId: string) {
    const driveService = await this.createDriveClient();
    try {
      await driveService.files.delete({ fileId });
    } catch (error) {
      logger.error(`Error deleting file from Google Drive (File ID: ${fileId}): ${error}`);
      throw error;
    }
  }

  async deleteFolderFromGoogleDrive(folderId: string) {
    const driveService = await this.createDriveClient();
    try {
      await driveService.files.delete({ fileId: folderId });
      logger.info(`Folder with ID '${folderId}' successfully deleted from Google Drive.`);
    } catch (error) {
      logger.error(`Error deleting folder from Google Drive (Folder ID: ${folderId}): ${error}`);
      throw error;
    }
  }
}

export default GoogleDriveService;
