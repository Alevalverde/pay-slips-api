import { NextFunction, Response, Request } from 'express';
import errors from '@/config/errors';
import config from '@/config';

/**
 *
 * Middleware that validate that the files uploaded meet certain criteria
 */
export function validateFile(req: Request, res: Response, next: NextFunction) {
  const uploadedFiles = req.files as Express.Multer.File[];
  if (uploadedFiles?.length === 0) {
    return next();
  }
  uploadedFiles.forEach((uploadedFile) => {
    const { mimetype, size } = uploadedFile;
    if (mimetype !== 'application/pdf') {
      return next(errors.document_upload.invalid_document_type);
    }
    // 10 mb as default value
    const maxFileSize = parseInt(config.MAX_FILE_SIZE_BYTES, 10);
    if (size > maxFileSize) {
      return next(errors.document_upload.invalid_document_size);
    }
  });

  return next();
}
